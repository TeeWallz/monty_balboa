"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createUniqueId;

var _cuid = _interopRequireDefault(require("cuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUniqueId() {
  return (0, _cuid.default)();
}