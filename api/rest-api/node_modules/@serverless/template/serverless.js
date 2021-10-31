const { Component } = require('@serverless/core')
const {
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
} = require('./utils')

class Template extends Component {
  constructor(id, context) {
    const defaultFunction = super(id, context)

    return new Proxy(defaultFunction, {
      get: (obj, prop) => {
        // This handles the weird case when `then` is called on the `defaultFunction`
        if (prop === 'then') {
          return obj[prop]
        }

        if (obj.hasOwnProperty(prop)) {
          return obj[prop]
        }

        // Return a function that will invoke the custom method on requested components
        return createCustomMethodHandler(obj, prop)
      }
    })
  }

  async default(inputs = {}) {
    this.context.status('Deploying')

    const template = await getTemplate(inputs)

    this.context.debug(`Resolving the template's static variables.`)

    const resolvedTemplate = resolveTemplate(template)

    this.context.debug('Collecting components from the template.')

    const allComponents = await getAllComponents(resolvedTemplate)

    this.context.debug('Downloading any NPM components found in the template.')

    const allComponentsDownloaded = await downloadComponents(allComponents)

    this.context.debug(`Analyzing the template's components dependencies.`)

    const allComponentsWithDependencies = setDependencies(allComponentsDownloaded)

    this.context.debug(`Creating the template's components graph.`)

    const graph = createGraph(allComponentsWithDependencies)

    this.context.debug('Syncing template state.')

    await syncState(allComponentsWithDependencies, this)

    this.context.debug(`Executing the template's components graph.`)

    const allComponentsWithOutputs = await executeGraph(allComponentsWithDependencies, graph, this)

    const outputs = getOutputs(allComponentsWithOutputs)

    return outputs
  }

  async remove() {
    this.context.status('Removing')

    this.context.debug('Flushing template state and removing all components.')
    await syncState({}, this)

    // todo should we return the removed components outputs here?!
    return {}
  }
}

module.exports = Template
