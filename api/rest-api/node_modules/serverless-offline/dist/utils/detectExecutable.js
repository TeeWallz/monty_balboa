"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = detectExecutable;

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function detectExecutable(exe, versionFlag = '--version') {
  try {
    const {
      failed
    } = await (0, _execa.default)(exe, [versionFlag]);
    return failed === false;
  } catch (err) {
    return false;
  }
}