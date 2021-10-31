"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = typeof process.env.SLS_DEBUG !== 'undefined' ? console.log.bind(null, '[offline]') : () => null;

exports.default = _default;