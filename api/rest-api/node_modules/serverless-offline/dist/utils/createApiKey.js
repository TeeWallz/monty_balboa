"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApiKey;

var _crypto = require("crypto");

function createApiKey() {
  return (0, _crypto.createHash)('md5').digest('hex');
}