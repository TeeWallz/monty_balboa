"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serverlessLog;
exports.logLayers = logLayers;
exports.setLog = setLog;
exports.logRoutes = logRoutes;
exports.logWarning = logWarning;

var _boxen = _interopRequireDefault(require("boxen"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  max
} = Math;

const blue = _chalk.default.keyword('dodgerblue');

const grey = _chalk.default.keyword('grey');

const lime = _chalk.default.keyword('lime');

const orange = _chalk.default.keyword('orange');

const peachpuff = _chalk.default.keyword('peachpuff');

const plum = _chalk.default.keyword('plum');

const red = _chalk.default.keyword('red');

const yellow = _chalk.default.keyword('yellow');

const colorMethodMapping = new Map([['DELETE', red], ['GET', blue], // ['HEAD', ...],
['PATCH', orange], ['POST', plum], ['PUT', blue]]);
let log;

function serverlessLog(msg) {
  if (log) {
    log(msg, 'offline');
  }
}

function logLayers(msg) {
  console.log(`offline: ${blue(msg)}`);
}

function setLog(serverlessLogRef) {
  log = serverlessLogRef;
} // logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js


function logRoute(method, server, path, maxLength, dimPath = false) {
  var _colorMethodMapping$g;

  const methodColor = (_colorMethodMapping$g = colorMethodMapping.get(method)) !== null && _colorMethodMapping$g !== void 0 ? _colorMethodMapping$g : peachpuff;
  const methodFormatted = method.padEnd(maxLength, ' ');
  return `${methodColor(methodFormatted)} ${yellow.dim('|')} ${grey.dim(server)}${dimPath ? grey.dim(path) : lime(path)}`;
}

function getMaxHttpMethodNameLength(routeInfo) {
  return max(...routeInfo.map(({
    method
  }) => method.length));
}

function logRoutes(routeInfo) {
  const boxenOptions = {
    borderColor: 'yellow',
    dimBorder: true,
    margin: 1,
    padding: 1
  };
  const maxLength = getMaxHttpMethodNameLength(routeInfo);
  console.log((0, _boxen.default)(routeInfo.map(({
    method,
    path,
    server,
    invokePath
  }) => // eslint-disable-next-line prefer-template
  logRoute(method, server, path, maxLength) + '\n' + logRoute('POST', server, invokePath, maxLength, true)).join('\n'), boxenOptions));
}

function logWarning(msg) {
  console.log(`offline: ${red(msg)}`);
}