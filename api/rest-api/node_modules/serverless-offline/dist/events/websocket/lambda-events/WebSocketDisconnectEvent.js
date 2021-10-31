"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WebSocketRequestContext = _interopRequireDefault(require("./WebSocketRequestContext.js"));

var _index = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _connectionId = _classPrivateFieldLooseKey("connectionId");

class WebSocketDisconnectEvent {
  constructor(connectionId) {
    Object.defineProperty(this, _connectionId, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _connectionId)[_connectionId] = connectionId;
  }

  create() {
    // TODO FIXME not sure where the headers come from
    const rawHeaders = ['Host', 'localhost', 'x-api-key', '', 'x-restapi', ''];
    const headers = (0, _index.parseHeaders)(rawHeaders);
    const multiValueHeaders = (0, _index.parseMultiValueHeaders)(rawHeaders);
    const requestContext = new _WebSocketRequestContext.default('DISCONNECT', '$disconnect', _classPrivateFieldLooseBase(this, _connectionId)[_connectionId]).create();
    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      requestContext
    };
  }

}

exports.default = WebSocketDisconnectEvent;