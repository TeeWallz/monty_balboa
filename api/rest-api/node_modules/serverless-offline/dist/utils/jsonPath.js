"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jsonPath;

var _jsonpathPlus = require("jsonpath-plus");

// import debugLog from '../debugLog.js'
function jsonPath(json, path) {
  // debugLog('Calling jsonPath:', path)
  // NOTE: JSONPath returns undefined if 'json' is e.g. null, undefined, string,
  // number (anything other than JSON)
  const [result] = (0, _jsonpathPlus.JSONPath)({
    json,
    path
  }) || []; // debugLog('jsonPath resolved:', result)

  return result;
}