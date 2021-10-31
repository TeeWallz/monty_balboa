"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const {
  assign
} = Object;

class ScheduleEventDefinition {
  constructor(rawHttpEventDefinition) {
    let enabled;
    let rate;
    let rest;

    if (typeof rawHttpEventDefinition === 'string') {
      rate = rawHttpEventDefinition;
    } else {
      ;
      ({
        rate,
        enabled,
        ...rest
      } = rawHttpEventDefinition);
    } // enabled: true (default)


    this.enabled = enabled == null ? true : enabled;
    this.rate = rate;
    assign(this, rest);
  }

}

exports.default = ScheduleEventDefinition;