"use strict";

var _worker_threads = require("worker_threads");

var _index = _interopRequireDefault(require("../in-process-runner/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line import/no-unresolved
const {
  functionKey,
  handlerName,
  handlerPath
} = _worker_threads.workerData;

_worker_threads.parentPort.on('message', async messageData => {
  const {
    context,
    event,
    port,
    timeout,
    allowCache
  } = messageData; // TODO we could probably cache this in the module scope?

  const inProcessRunner = new _index.default(functionKey, handlerPath, handlerName, process.env, timeout, allowCache);
  let result;

  try {
    result = await inProcessRunner.run(event, context);
  } catch (err) {
    // this only executes when we have an exception caused by synchronous code
    // TODO logging
    console.log(err);
    throw err;
  } // TODO check serializeability (contains function, symbol etc)


  port.postMessage(result);
});