"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const {
  assign
} = Object;

class HttpEventDefinition {
  constructor(rawHttpEventDefinition) {
    let method;
    let path;
    let rest;

    if (typeof rawHttpEventDefinition === 'string') {
      ;
      [method, path] = rawHttpEventDefinition.split(' ');
    } else {
      ;
      ({
        method,
        path,
        ...rest
      } = rawHttpEventDefinition);
    }

    this.method = method;
    this.path = path;
    assign(this, rest);
  }

}

exports.default = HttpEventDefinition;