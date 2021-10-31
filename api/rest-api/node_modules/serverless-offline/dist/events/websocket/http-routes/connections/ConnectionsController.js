"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _webSocketClients = _classPrivateFieldLooseKey("webSocketClients");

class ConnectionsController {
  constructor(webSocketClients) {
    Object.defineProperty(this, _webSocketClients, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients] = webSocketClients;
  }

  send(connectionId, payload) {
    // TODO, is this correct?
    if (!payload) {
      return null;
    }

    const clientExisted = _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients].send(connectionId, // payload is a Buffer
    payload.toString('utf-8'));

    return clientExisted;
  }

  remove(connectionId) {
    const clientExisted = _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients].close(connectionId);

    return clientExisted;
  }

}

exports.default = ConnectionsController;