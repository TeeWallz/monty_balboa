"use strict";

var _pleaseUpgradeNode = _interopRequireDefault(require("please-upgrade-node"));

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: important, don't use any new javascript language features in this file!
// (other than es6 modules, which are transpiled)
const currentNodeVersion = process.versions.node;

const requiredNodeVersion = _package.default.engines.node.replace('>=', '');

(0, _pleaseUpgradeNode.default)(_package.default, {
  message: function message() {
    return (// eslint-disable-next-line prefer-template
      'serverless-offline requires node.js version ' + requiredNodeVersion + ' or higher, but found version ' + currentNodeVersion + '. Please upgrade!'
    );
  }
});