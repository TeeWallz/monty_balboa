"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const {
  assign
} = Object;

class WebSocketEventDefinition {
  constructor(rawWebSocketEventDefinition) {
    let rest;
    let route;

    if (typeof rawWebSocketEventDefinition === 'string') {
      route = rawWebSocketEventDefinition;
    } else {
      ;
      ({
        route,
        ...rest
      } = rawWebSocketEventDefinition);
    }

    this.route = route;
    assign(this, rest);
  }

}

exports.default = WebSocketEventDefinition;