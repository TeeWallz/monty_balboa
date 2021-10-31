"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseHeaders;

var _unflatten = _interopRequireDefault(require("./unflatten.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  fromEntries
} = Object; // (rawHeaders: Array<string>): { [string]: string }

function parseHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null;
  }

  const unflattened = (0, _unflatten.default)(rawHeaders, 2);
  return fromEntries(unflattened);
}