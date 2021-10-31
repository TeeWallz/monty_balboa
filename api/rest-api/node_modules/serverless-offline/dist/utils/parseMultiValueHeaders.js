"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseMultiValueHeaders;

var _unflatten = _interopRequireDefault(require("./unflatten.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  fromEntries
} = Object; // https://aws.amazon.com/blogs/compute/support-for-multi-value-parameters-in-amazon-api-gateway/
// (rawHeaders: Array<string>): { [string]: Array<string> }

function parseMultiValueHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null;
  }

  const map = new Map();
  const unflattened = (0, _unflatten.default)(rawHeaders, 2); // eslint-disable-next-line no-restricted-syntax

  for (const [key, value] of unflattened) {
    const item = map.get(key);

    if (item) {
      item.push(value);
    } else {
      map.set(key, [value]);
    }
  }

  return fromEntries(map);
}