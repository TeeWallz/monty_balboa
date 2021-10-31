/**
 * Component Metrics Library
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const fetch = require('node-fetch')
const shortid = require('shortid')

module.exports = () => {

  let metric = { data: {} }

  // Setter functions are used so that data can be validated (in the future) before being set, to ensure save data.
  metric.configInstanceId = (input) => { metric.data.configInstanceId = input }
  metric.configCreatedAt = (input) => { metric.data.configCreatedAt = input }
  metric.userId = (input) => { metric.data.userId = input }
  metric.v1 = (input) => { metric.data.v1 = input }
  metric.v1TrackingDisabled = (input) => { metric.data.v1TrackingDisabled = input }
  metric.v1FrameworkId = (input) => { metric.data.v1FrameworkId = input }
  metric.v1CreatedAt = (input) => { metric.data.v1CreatedAt = input }
  metric.metricError = (input) => { metric.data.metricError = input }

  // Component Name
  metric.componentName = (input) => {
    if (input.includes('@') ) {
      if (input.split('@').length === 3 ) {
        metric.data.componentVersion = input.split('@')[2]
        metric.data.componentName = '@' + input.split('@')[1]
      } else {
        metric.data.componentName = input
      }
    } else {
      metric.data.componentName = input
    }
  }

  metric.componentVersion = (input) => { metric.data.componentVersion = input }
  metric.componentMethod = (input) => { metric.data.componentMethod = input }
  metric.componentContext = (input) => { metric.data.componentContext = input }
  metric.componentContextVersion = (input) => { metric.data.componentContextVersion = input }
  metric.componentError = (input) => { metric.data.componentError = input }

  /**
   * Publish Function
   */

  metric.publish = async () => {
    try {
      metric = await processConfig(metric)

      if (metric.data.v1TrackingDisabled) return

      // Send Metric
      await fetch('https://metrics.serverlessmeta.com/v1/components', {
        method: 'post',
        body:    JSON.stringify(metric.data),
        headers: { 'Content-Type': 'application/json' },
      })

    } catch (error) {
      // Unfortunately, don't do anything so that we don't affect the UX
    }
    return metric
  }

  return metric
}

/**
 * Process Config
 */

const processConfig = async (metric) => {

  let v1Config, componentsConfig

  // Fetch config files
  try { v1Config = await readV1Config() }
  catch (error) { metric.metricError(`Error reading V1 Config: ${error.message}`) }
  try { componentsConfig = await readComponentsConfig() }
  catch (error) { metric.metricError(`Error reading Components Config: ${error.message}`) }

  // Cancel metric gathering and capture error instead
  if (metric.data.metricError) return metric

  componentsConfig = componentsConfig && typeof componentsConfig === 'object' ? componentsConfig : {}
  componentsConfig.updatedAt = Date.now()

  // configInstanceId
  if (componentsConfig && !componentsConfig.instanceId) {
    componentsConfig.instanceId = shortid.generate()
  }
  metric.configInstanceId(componentsConfig.instanceId)

  // configCreatedAt
  if (componentsConfig && componentsConfig.createdAt) {
    componentsConfig.createdAt = componentsConfig.createdAt
  } else {
    componentsConfig.createdAt = Date.now()
  }
  metric.configCreatedAt(componentsConfig.createdAt)

  // userId
  if (componentsConfig && componentsConfig.userId) {
    componentsConfig.userId = componentsConfig.userId
  } else if (v1Config && v1Config.userId) {
    componentsConfig.userId = v1Config.userId
  }
  if (componentsConfig.userId) metric.userId(componentsConfig.userId)

  // Other v1Config Data
  if (v1Config) {
    if (v1Config.meta && v1Config.meta.created_at) metric.v1CreatedAt(v1Config.meta.created_at)
    if (typeof v1Config.trackingDisabled !== 'undefined') metric.v1TrackingDisabled(v1Config.trackingDisabled)
    if (v1Config.frameworkId) metric.v1FrameworkId(v1Config.frameworkId)
  }

  // Save .serverlesscomponentsrc
  await writeComponentsConfig(componentsConfig)

  return metric
}

/**
 * Read V1 Config
 */

const readV1Config = async () => {
  let slsV1Config = path.join(os.homedir(), '.serverlessrc')
  if (!fs.existsSync(slsV1Config)) return null
  slsV1Config = fs.readFileSync(slsV1Config, 'utf8')
  slsV1Config = JSON.parse(slsV1Config)
  return slsV1Config
}

/**
 * Read Component Config
 */

const readComponentsConfig = async () => {
  let componentsConfig = path.join(os.homedir(), '.serverlesscomponentsrc')
  if (!fs.existsSync(componentsConfig)) return null
  componentsConfig = fs.readFileSync(componentsConfig, 'utf8')
  componentsConfig = JSON.parse(componentsConfig)
  return componentsConfig
}

/**
 * Write Component Config
 */

const writeComponentsConfig = async (data) => {
  let componentsConfigPath = path.join(os.homedir(), '.serverlesscomponentsrc')
  fs.writeFileSync(
    componentsConfigPath,
    JSON.stringify(data, null, 4)
  )
  return data
}
