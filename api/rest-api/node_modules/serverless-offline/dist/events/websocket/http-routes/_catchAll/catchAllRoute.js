"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = catchAllRoute;

var _debugLog = _interopRequireDefault(require("../../../../debugLog.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function catchAllRoute() {
  return {
    method: 'GET',
    path: '/{path*}',

    handler(request, h) {
      const {
        url
      } = request;
      (0, _debugLog.default)(`got GET to ${url}`);
      return h.response(null).code(426);
    }

  };
}