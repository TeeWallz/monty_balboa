"use strict";

var _index = _interopRequireDefault(require("../in-process-runner/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO handle this:
process.on('uncaughtException', err => {
  const {
    constructor: {
      name
    },
    message,
    stack
  } = err;
  process.send({
    // process.send() can't serialize an Error object, so we help it out a bit
    error: {
      constructor: {
        name
      },
      message,
      stack
    }
  });
});
const [,, functionKey, handlerName, handlerPath] = process.argv;
process.on('message', async messageData => {
  const {
    context,
    event,
    allowCache,
    timeout
  } = messageData; // TODO we could probably cache this in the module scope?

  const inProcessRunner = new _index.default(functionKey, handlerPath, handlerName, process.env, timeout, allowCache);
  let result;

  try {
    result = await inProcessRunner.run(event, context);
  } catch (err) {
    // TODO logging
    console.log(err);
    throw err;
  } // TODO check serializeability (contains function, symbol etc)


  process.send(result);
});