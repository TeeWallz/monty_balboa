"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = invokeRoute;

var _InvokeAsyncController = _interopRequireDefault(require("./InvokeAsyncController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  parse
} = JSON; // https://docs.aws.amazon.com/lambda/latest/dg/API_InvokeAsync.html

function invokeRoute(lambda, options) {
  const invokeAsyncController = new _InvokeAsyncController.default(lambda);
  return {
    handler(request) {
      const {
        params: {
          functionName
        },
        payload
      } = request;
      const event = parse(payload.toString('utf-8'));
      return invokeAsyncController.invokeAsync(functionName, event);
    },

    method: 'POST',
    options: {
      payload: {
        // allow: ['binary/octet-stream'],
        defaultContentType: 'binary/octet-stream',
        // request.payload will be a raw buffer
        parse: false
      },
      cors: options.corsConfig,
      tags: ['api']
    },
    path: '/2014-11-13/functions/{functionName}/invoke-async/'
  };
}