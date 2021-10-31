"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHttpApiCorsConfig;

var _debugLog = _interopRequireDefault(require("../debugLog.js"));

var _serverlessLog = require("../serverlessLog.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHttpApiCorsConfig(httpApiCors) {
  if (httpApiCors === true) {
    // default values that should be set by serverless
    // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
    const c = {
      allowedOrigins: ['*'],
      allowedHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent'],
      allowedMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    };
    (0, _debugLog.default)(c);
    (0, _serverlessLog.logWarning)(c);
    return c;
  }

  (0, _debugLog.default)(httpApiCors);
  (0, _serverlessLog.logWarning)(httpApiCors);
  return httpApiCors;
}