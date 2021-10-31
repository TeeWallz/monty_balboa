"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../utils/index.js");

class ScheduleEvent {
  constructor(region) {
    // format of aws displaying the time, e.g.: 2020-02-09T14:13:57Z
    const time = new Date().toISOString().replace(/\.(.*)(?=Z)/g, '');
    this.account = (0, _index.createUniqueId)();
    this.detail = {};
    this['detail-type'] = 'Scheduled Event';
    this.id = (0, _index.createUniqueId)();
    this.region = region;
    this.resources = [];
    this.source = 'aws.events';
    this.time = time;
    this.version = '0';
  }

}

exports.default = ScheduleEvent;