"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _renderVelocityTemplateObject = _interopRequireDefault(require("./renderVelocityTemplateObject.js"));

var _VelocityContext = _interopRequireDefault(require("./VelocityContext.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _path = _classPrivateFieldLooseKey("path");

var _request = _classPrivateFieldLooseKey("request");

var _requestTemplate = _classPrivateFieldLooseKey("requestTemplate");

var _stage = _classPrivateFieldLooseKey("stage");

class LambdaIntegrationEvent {
  constructor(request, stage, requestTemplate, path) {
    Object.defineProperty(this, _path, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _request, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _requestTemplate, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _stage, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _path)[_path] = path;
    _classPrivateFieldLooseBase(this, _request)[_request] = request;
    _classPrivateFieldLooseBase(this, _requestTemplate)[_requestTemplate] = requestTemplate;
    _classPrivateFieldLooseBase(this, _stage)[_stage] = stage;
  }

  create() {
    const velocityContext = new _VelocityContext.default(_classPrivateFieldLooseBase(this, _request)[_request], _classPrivateFieldLooseBase(this, _stage)[_stage], _classPrivateFieldLooseBase(this, _request)[_request].payload || {}, _classPrivateFieldLooseBase(this, _path)[_path]).getContext();
    const event = (0, _renderVelocityTemplateObject.default)(_classPrivateFieldLooseBase(this, _requestTemplate)[_requestTemplate], velocityContext);
    return event;
  }

}

exports.default = LambdaIntegrationEvent;