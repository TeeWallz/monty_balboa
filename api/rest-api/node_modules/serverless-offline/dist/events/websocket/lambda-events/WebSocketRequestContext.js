"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../../utils/index.js");

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  now
} = Date;
const connectedAt = new Map();

var _connectionId = _classPrivateFieldLooseKey("connectionId");

var _eventType = _classPrivateFieldLooseKey("eventType");

var _route = _classPrivateFieldLooseKey("route");

var _connectedAt = _classPrivateFieldLooseKey("connectedAt");

class WebSocketRequestContext {
  constructor(eventType, route, connectionId) {
    Object.defineProperty(this, _connectionId, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _eventType, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _route, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _connectedAt, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _connectionId)[_connectionId] = connectionId;
    _classPrivateFieldLooseBase(this, _eventType)[_eventType] = eventType;
    _classPrivateFieldLooseBase(this, _route)[_route] = route;

    if (eventType === 'CONNECT') {
      connectedAt.set(connectionId, now());
    }

    _classPrivateFieldLooseBase(this, _connectedAt)[_connectedAt] = connectedAt.get(connectionId);

    if (eventType === 'DISCONNECT') {
      connectedAt.delete(connectionId);
    }
  }

  create() {
    const timeEpoch = now();
    const requestContext = {
      apiId: 'private',
      connectedAt: _classPrivateFieldLooseBase(this, _connectedAt)[_connectedAt],
      connectionId: _classPrivateFieldLooseBase(this, _connectionId)[_connectionId],
      domainName: 'localhost',
      eventType: _classPrivateFieldLooseBase(this, _eventType)[_eventType],
      extendedRequestId: (0, _index.createUniqueId)(),
      identity: {
        accessKey: null,
        accountId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: null,
        userArn: null
      },
      messageDirection: 'IN',
      messageId: (0, _index.createUniqueId)(),
      requestId: (0, _index.createUniqueId)(),
      requestTime: (0, _index.formatToClfTime)(timeEpoch),
      requestTimeEpoch: timeEpoch,
      routeKey: _classPrivateFieldLooseBase(this, _route)[_route],
      stage: 'local'
    };
    return requestContext;
  }

}

exports.default = WebSocketRequestContext;