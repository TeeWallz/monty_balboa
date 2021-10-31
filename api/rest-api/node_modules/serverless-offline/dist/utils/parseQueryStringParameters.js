"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseQueryStringParameters;

var _index = require("../config/index.js");

const {
  fromEntries
} = Object;

function parseQueryStringParameters(url) {
  // dummy placeholder url for the WHATWG URL constructor
  // https://github.com/nodejs/node/issues/12682
  const {
    searchParams
  } = new URL(url, _index.BASE_URL_PLACEHOLDER);

  if (Array.from(searchParams).length === 0) {
    return null;
  }

  return fromEntries(searchParams);
}