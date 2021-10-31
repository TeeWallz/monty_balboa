const { resolve, join } = require('path')
const { pick, isEmpty, path, uniq } = require('ramda')
const { Graph, alg } = require('graphlib')
const traverse = require('traverse')
const { utils } = require('@serverless/core')
const newMetric = require('@serverless/component-metrics')

const getComponentMetric = async (componentPath, componentMethod = 'default', instance) => {
  const metric = newMetric()
  metric.componentMethod(componentMethod)
  metric.componentContext(instance.context.instance.name || 'cli_declarative')
  metric.componentContextVersion(instance.context.instance.version || '1.0.0')
  metric.componentError(null)

  let componentName = componentPath
  let componentVersion
  const componentPackageJsonPath = join(componentPath, 'package.json')

  // if package.json exists, read it to get name & version
  if (await utils.fileExists(componentPackageJsonPath)) {
    const componentPackageJson = await utils.readFile(componentPackageJsonPath)
    componentName = componentPackageJson.name || componentPath
    componentVersion = componentPackageJson.version
  }

  metric.componentName(componentName)

  if (componentVersion) {
    metric.componentVersion(componentVersion)
  }

  // we only publish after the method is run
  // to check whether there was an error
  return metric
}

const getOutputs = (allComponents) => {
  const outputs = {}

  for (const alias in allComponents) {
    outputs[alias] = allComponents[alias].outputs
  }

  return outputs
}

const resolveObject = (object, context) => {
  const regex = /\${(\w*:?[\w\d.-]+)}/g

  const resolvedObject = traverse(object).forEach(function(value) {
    const matches = typeof value === 'string' ? value.match(regex) : null
    if (matches) {
      let newValue = value
      for (const match of matches) {
        const referencedPropertyPath = match.substring(2, match.length - 1).split('.')
        const referencedPropertyValue = path(referencedPropertyPath, context)

        if (referencedPropertyValue === undefined) {
          throw Error(`invalid reference ${match}`)
        }

        if (match === value) {
          newValue = referencedPropertyValue
        } else if (typeof referencedPropertyValue === 'string') {
          newValue = newValue.replace(match, referencedPropertyValue)
        } else {
          throw Error(`the referenced substring is not a string`)
        }
      }
      this.update(newValue)
    }
  })

  return resolvedObject
}

const validateGraph = (graph) => {
  const isAcyclic = alg.isAcyclic(graph)
  if (!isAcyclic) {
    const cycles = alg.findCycles(graph)
    let msg = ['Your template has circular dependencies:']
    cycles.forEach((cycle, index) => {
      let fromAToB = cycle.join(' --> ')
      fromAToB = `${(index += 1)}. ${fromAToB}`
      const fromBToA = cycle.reverse().join(' <-- ')
      const padLength = fromAToB.length + 4
      msg.push(fromAToB.padStart(padLength))
      msg.push(fromBToA.padStart(padLength))
    }, cycles)
    msg = msg.join('\n')
    throw new Error(msg)
  }
}

const getTemplate = async (inputs) => {
  const template = inputs.template || {}

  if (typeof template === 'string') {
    if (
      (!utils.isJsonPath(template) && !utils.isYamlPath(template)) ||
      !(await utils.fileExists(template))
    ) {
      throw Error('the referenced template path does not exist')
    }

    return utils.readFile(template)
  } else if (typeof template !== 'object') {
    throw Error('the template input could either be an object, or a string path to a template file')
  }
  return template
}

const resolveTemplate = (template) => {
  const regex = /\${(\w*:?[\w\d.-]+)}/g
  let variableResolved = false
  const resolvedTemplate = traverse(template).forEach(function(value) {
    const matches = typeof value === 'string' ? value.match(regex) : null
    if (matches) {
      let newValue = value
      for (const match of matches) {
        const referencedPropertyPath = match.substring(2, match.length - 1).split('.')
        const referencedTopLevelProperty = referencedPropertyPath[0]
        if (/\${env\.(\w*:?[\w\d.-]+)}/g.test(match)) {
          newValue = process.env[referencedPropertyPath[1]]
          variableResolved = true
        } else {
          if (!template[referencedTopLevelProperty]) {
            throw Error(`invalid reference ${match}`)
          }

          if (!template[referencedTopLevelProperty].component) {
            variableResolved = true
            const referencedPropertyValue = path(referencedPropertyPath, template)

            if (referencedPropertyValue === undefined) {
              throw Error(`invalid reference ${match}`)
            }

            if (match === value) {
              newValue = referencedPropertyValue
            } else if (typeof referencedPropertyValue === 'string') {
              newValue = newValue.replace(match, referencedPropertyValue)
            } else {
              throw Error(`the referenced substring is not a string`)
            }
          }
        }
      }
      this.update(newValue)
    }
  })
  if (variableResolved) {
    return resolveTemplate(resolvedTemplate)
  }
  return resolvedTemplate
}

const getAllComponents = async (obj = {}) => {
  const allComponents = {}

  for (const key in obj) {
    if (obj[key] && obj[key].component) {
      // local components start with a .
      if (obj[key].component[0] === '.') {
        // todo should local component paths be relative to cwd?
        const localComponentPath = resolve(process.cwd(), obj[key].component, 'serverless.js')
        if (!(await utils.fileExists(localComponentPath))) {
          throw Error(`No serverless.js file found in ${obj[key].component}`)
        }
      }
      allComponents[key] = {
        path: obj[key].component,
        inputs: obj[key].inputs || {}
      }
    }
  }

  return allComponents
}

const downloadComponents = async (allComponents) => {
  // npm components property does not start with a period.
  // ie. local components component property is ./abc or ../abc
  const aliasesToDownload = Object.keys(allComponents).filter(
    (alias) => allComponents[alias].path[0] !== '.'
  )
  const componentsToDownload = pick(aliasesToDownload, allComponents)

  // using uniq to remove any duplicates in case
  // the user is using multiple instances of the same
  // component, so that it would be downloaded only once
  const componentsList = uniq(aliasesToDownload.map((alias) => componentsToDownload[alias].path))

  const componentsPaths = await utils.download(componentsList)

  const downloadedComponents = {}
  for (const alias in componentsToDownload) {
    const npmPackageName = componentsToDownload[alias].path
    downloadedComponents[alias] = {
      ...componentsToDownload[alias],
      path: componentsPaths[npmPackageName]
    }
  }

  allComponents = { ...allComponents, ...downloadedComponents }

  return allComponents
}

const setDependencies = (allComponents) => {
  const regex = /\${(\w*:?[\w\d.-]+)}/g

  for (const alias in allComponents) {
    const dependencies = traverse(allComponents[alias].inputs).reduce(function(accum, value) {
      const matches = typeof value === 'string' ? value.match(regex) : null
      if (matches) {
        for (const match of matches) {
          const referencedComponent = match.substring(2, match.length - 1).split('.')[0]

          if (!allComponents[referencedComponent]) {
            throw Error(`the referenced component in expression ${match} does not exist`)
          }

          if (!accum.includes(referencedComponent)) {
            accum.push(referencedComponent)
          }
        }
      }
      return accum
    }, [])

    allComponents[alias].dependencies = dependencies
  }

  return allComponents
}

const createGraph = (allComponents) => {
  const graph = new Graph()

  for (const alias in allComponents) {
    graph.setNode(alias, allComponents[alias])
  }

  for (const alias in allComponents) {
    const { dependencies } = allComponents[alias]
    if (!isEmpty(dependencies)) {
      for (const dependency of dependencies) {
        graph.setEdge(alias, dependency)
      }
    }
  }

  validateGraph(graph)

  return graph
}

const executeGraph = async (allComponents, graph, instance) => {
  const leaves = graph.sinks()

  if (isEmpty(leaves)) {
    return allComponents
  }

  const promises = []

  for (const alias of leaves) {
    const componentData = graph.node(alias)

    const fn = async () => {
      const component = await instance.load(componentData.path, alias)
      const availableOutputs = getOutputs(allComponents)
      const inputs = resolveObject(allComponents[alias].inputs, availableOutputs)
      instance.context.status('Deploying', alias)

      const metric = await getComponentMetric(componentData.path, 'default', instance)

      try {
        allComponents[alias].outputs = (await component(inputs)) || {}
      } catch (e) {
        // on error, publish error metric
        metric.componentError(e.message)
        await metric.publish()
        throw e
      }

      await metric.publish()
    }

    promises.push(fn())
  }

  await Promise.all(promises)

  for (const alias of leaves) {
    graph.removeNode(alias)
  }

  return executeGraph(allComponents, graph, instance)
}

const syncState = async (allComponents, instance) => {
  const promises = []

  for (const alias in instance.state.components || {}) {
    if (!allComponents[alias]) {
      const fn = async () => {
        const component = await instance.load(instance.state.components[alias], alias)
        instance.context.status('Removing', alias)

        const metric = await getComponentMetric(
          instance.state.components[alias],
          'remove',
          instance
        )

        try {
          await component.remove()
        } catch (e) {
          // on error, publish error metric
          metric.componentError(e.message)
          await metric.publish()
          throw e
        }
        await metric.publish()
      }

      promises.push(fn())
    }
  }

  await Promise.all(promises)

  instance.state.components = {}

  for (const alias in allComponents) {
    instance.state.components[alias] = allComponents[alias].path
  }

  await instance.save()
}

const createCustomMethodHandler = (instance, method) => {
  return async ({ component, template, ...inputs }) => {
    let components = Array.isArray(component) ? component : [component]
    components = components.filter(Boolean)

    if (!components.length) {
      throw Error(`"component" input is required to run custom methods`)
    }

    instance.context.debug(
      `Attempting to run method "${method}" on template aliases: ${components.join(', ')}`
    )

    // Make sure the template is an object
    const templateObject = await getTemplate({ template })

    // Load template components
    const templateComponents = await getAllComponents(templateObject)

    // Get only the requested components ("component" input)
    const componentsToRun = Object.keys(templateComponents)
      .filter((alias) => components.includes(alias))
      .reduce((acc, item) => {
        acc.push({ alias: item, path: templateComponents[item].path })
        return acc
      }, [])

    // Verify all the components have the requested method implemented
    instance.context.debug(`Verifying presence of method "${method}" in requested components...`)
    for (let i = 0; i < componentsToRun.length; i++) {
      const item = componentsToRun[i]
      const cmp = await instance.load(item.path, item.alias)
      if (typeof cmp[method] !== 'function') {
        throw Error(`method "${method}" not found in "${item.path}"`)
      }
      // Store the loaded component so we don't have to load it again
      componentsToRun[i].component = cmp
    }

    // Run custom method and return output
    const outputs = {}
    for (let i = 0; i < componentsToRun.length; i++) {
      const cmp = componentsToRun[i]
      instance.context.debug(`Running method "${method}" on "${cmp.path}"...`)
      outputs[cmp.alias] = await cmp.component[method](inputs)
    }

    return outputs
  }
}

module.exports = {
  getTemplate,
  resolveTemplate,
  getAllComponents,
  downloadComponents,
  setDependencies,
  createGraph,
  executeGraph,
  syncState,
  getOutputs,
  createCustomMethodHandler
}
