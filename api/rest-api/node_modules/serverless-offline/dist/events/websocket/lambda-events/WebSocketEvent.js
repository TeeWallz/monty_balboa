"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WebSocketRequestContext = _interopRequireDefault(require("./WebSocketRequestContext.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _connectionId = _classPrivateFieldLooseKey("connectionId");

var _payload = _classPrivateFieldLooseKey("payload");

var _route = _classPrivateFieldLooseKey("route");

class WebSocketEvent {
  constructor(connectionId, route, payload) {
    Object.defineProperty(this, _connectionId, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _payload, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _route, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _connectionId)[_connectionId] = connectionId;
    _classPrivateFieldLooseBase(this, _payload)[_payload] = payload;
    _classPrivateFieldLooseBase(this, _route)[_route] = route;
  }

  create() {
    const requestContext = new _WebSocketRequestContext.default('MESSAGE', _classPrivateFieldLooseBase(this, _route)[_route], _classPrivateFieldLooseBase(this, _connectionId)[_connectionId]).create();
    return {
      body: _classPrivateFieldLooseBase(this, _payload)[_payload],
      isBase64Encoded: false,
      requestContext
    };
  }

}

exports.default = WebSocketEvent;