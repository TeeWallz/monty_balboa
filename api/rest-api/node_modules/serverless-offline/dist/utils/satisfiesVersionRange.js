"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = satisfiesVersionRange;

var _semver = require("semver");

function satisfiesVersionRange(version, range) {
  if ((0, _semver.valid)(version) == null) {
    throw new Error(`Not a valid semver version: ${version}`);
  }

  if ((0, _semver.validRange)(range) == null) {
    throw new Error(`Not a valid semver range: ${range}`);
  }

  return (0, _semver.satisfies)(version, range);
}