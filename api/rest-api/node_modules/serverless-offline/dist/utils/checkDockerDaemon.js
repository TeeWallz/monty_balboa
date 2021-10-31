"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkDockerDaemon;

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function checkDockerDaemon() {
  let dockerServerOS;

  try {
    const {
      stdout
    } = await (0, _execa.default)('docker', ['version', '--format', '{{.Server.Os}}']);
    dockerServerOS = stdout;
  } catch (err) {
    throw new Error('The docker daemon is not running.');
  }

  if (dockerServerOS !== 'linux') {
    throw new Error('Please switch docker daemon to linux mode.');
  }
}