"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ws = require("ws");

var _index = require("./lambda-events/index.js");

var _debugLog = _interopRequireDefault(require("../../debugLog.js"));

var _serverlessLog = _interopRequireDefault(require("../../serverlessLog.js"));

var _index2 = require("../../config/index.js");

var _index3 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  parse,
  stringify
} = JSON;

var _clients = _classPrivateFieldLooseKey("clients");

var _lambda = _classPrivateFieldLooseKey("lambda");

var _options = _classPrivateFieldLooseKey("options");

var _webSocketRoutes = _classPrivateFieldLooseKey("webSocketRoutes");

var _websocketsApiRouteSelectionExpression = _classPrivateFieldLooseKey("websocketsApiRouteSelectionExpression");

var _idleTimeouts = _classPrivateFieldLooseKey("idleTimeouts");

var _hardTimeouts = _classPrivateFieldLooseKey("hardTimeouts");

class WebSocketClients {
  constructor(serverless, options, lambda) {
    Object.defineProperty(this, _clients, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _lambda, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _webSocketRoutes, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _websocketsApiRouteSelectionExpression, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _idleTimeouts, {
      writable: true,
      value: new WeakMap()
    });
    Object.defineProperty(this, _hardTimeouts, {
      writable: true,
      value: new WeakMap()
    });
    _classPrivateFieldLooseBase(this, _lambda)[_lambda] = lambda;
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    _classPrivateFieldLooseBase(this, _websocketsApiRouteSelectionExpression)[_websocketsApiRouteSelectionExpression] = serverless.service.provider.websocketsApiRouteSelectionExpression || _index2.DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION;
  }

  _addWebSocketClient(client, connectionId) {
    _classPrivateFieldLooseBase(this, _clients)[_clients].set(client, connectionId);

    _classPrivateFieldLooseBase(this, _clients)[_clients].set(connectionId, client);

    this._onWebSocketUsed(connectionId);

    this._addHardTimeout(client, connectionId);
  }

  _removeWebSocketClient(client) {
    const connectionId = _classPrivateFieldLooseBase(this, _clients)[_clients].get(client);

    _classPrivateFieldLooseBase(this, _clients)[_clients].delete(client);

    _classPrivateFieldLooseBase(this, _clients)[_clients].delete(connectionId);

    return connectionId;
  }

  _getWebSocketClient(connectionId) {
    return _classPrivateFieldLooseBase(this, _clients)[_clients].get(connectionId);
  }

  _addHardTimeout(client, connectionId) {
    const timeoutId = setTimeout(() => {
      (0, _debugLog.default)(`timeout:hard:${connectionId}`);
      client.close(1001, 'Going away');
    }, _classPrivateFieldLooseBase(this, _options)[_options].webSocketHardTimeout * 1000);

    _classPrivateFieldLooseBase(this, _hardTimeouts)[_hardTimeouts].set(client, timeoutId);
  }

  _clearHardTimeout(client) {
    const timeoutId = _classPrivateFieldLooseBase(this, _hardTimeouts)[_hardTimeouts].get(client);

    clearTimeout(timeoutId);
  }

  _onWebSocketUsed(connectionId) {
    const client = this._getWebSocketClient(connectionId);

    this._clearIdleTimeout(client);

    (0, _debugLog.default)(`timeout:idle:${connectionId}:reset`);
    const timeoutId = setTimeout(() => {
      (0, _debugLog.default)(`timeout:idle:${connectionId}:trigger`);
      client.close(1001, 'Going away');
    }, _classPrivateFieldLooseBase(this, _options)[_options].webSocketIdleTimeout * 1000);

    _classPrivateFieldLooseBase(this, _idleTimeouts)[_idleTimeouts].set(client, timeoutId);
  }

  _clearIdleTimeout(client) {
    const timeoutId = _classPrivateFieldLooseBase(this, _idleTimeouts)[_idleTimeouts].get(client);

    clearTimeout(timeoutId);
  }

  async _processEvent(websocketClient, connectionId, route, event) {
    let functionKey = _classPrivateFieldLooseBase(this, _webSocketRoutes)[_webSocketRoutes].get(route);

    if (!functionKey && route !== '$connect' && route !== '$disconnect') {
      functionKey = _classPrivateFieldLooseBase(this, _webSocketRoutes)[_webSocketRoutes].get('$default');
    }

    if (!functionKey) {
      return;
    }

    const sendError = err => {
      if (websocketClient.readyState === _ws.OPEN) {
        websocketClient.send(stringify({
          connectionId,
          message: 'Internal server error',
          requestId: '1234567890'
        }));
      } // mimic AWS behaviour (close connection) when the $connect route handler throws


      if (route === '$connect') {
        websocketClient.close();
      }

      (0, _debugLog.default)(`Error in route handler '${functionKey}'`, err);
    };

    const lambdaFunction = _classPrivateFieldLooseBase(this, _lambda)[_lambda].get(functionKey);

    lambdaFunction.setEvent(event); // let result

    try {
      /* result = */
      await lambdaFunction.runHandler(); // TODO what to do with "result"?
    } catch (err) {
      console.log(err);
      sendError(err);
    }
  }

  _getRoute(value) {
    let json;

    try {
      json = parse(value);
    } catch (err) {
      return _index2.DEFAULT_WEBSOCKETS_ROUTE;
    }

    const routeSelectionExpression = _classPrivateFieldLooseBase(this, _websocketsApiRouteSelectionExpression)[_websocketsApiRouteSelectionExpression].replace('request.body', '');

    const route = (0, _index3.jsonPath)(json, routeSelectionExpression);

    if (typeof route !== 'string') {
      return _index2.DEFAULT_WEBSOCKETS_ROUTE;
    }

    return route || _index2.DEFAULT_WEBSOCKETS_ROUTE;
  }

  addClient(webSocketClient, request, connectionId) {
    this._addWebSocketClient(webSocketClient, connectionId);

    const connectEvent = new _index.WebSocketConnectEvent(connectionId, request, _classPrivateFieldLooseBase(this, _options)[_options]).create();

    this._processEvent(webSocketClient, connectionId, '$connect', connectEvent);

    webSocketClient.on('close', () => {
      (0, _debugLog.default)(`disconnect:${connectionId}`);

      this._removeWebSocketClient(webSocketClient);

      const disconnectEvent = new _index.WebSocketDisconnectEvent(connectionId).create();

      this._clearHardTimeout(webSocketClient);

      this._clearIdleTimeout(webSocketClient);

      this._processEvent(webSocketClient, connectionId, '$disconnect', disconnectEvent);
    });
    webSocketClient.on('message', message => {
      (0, _debugLog.default)(`message:${message}`);

      const route = this._getRoute(message);

      (0, _debugLog.default)(`route:${route} on connection=${connectionId}`);
      const event = new _index.WebSocketEvent(connectionId, route, message).create();

      this._onWebSocketUsed(connectionId);

      this._processEvent(webSocketClient, connectionId, route, event);
    });
  }

  addRoute(functionKey, route) {
    // set the route name
    _classPrivateFieldLooseBase(this, _webSocketRoutes)[_webSocketRoutes].set(route, functionKey);

    (0, _serverlessLog.default)(`route '${route}'`);
  }

  close(connectionId) {
    const client = this._getWebSocketClient(connectionId);

    if (client) {
      client.close();
      return true;
    }

    return false;
  }

  send(connectionId, payload) {
    const client = this._getWebSocketClient(connectionId);

    if (client) {
      this._onWebSocketUsed(connectionId);

      client.send(payload);
      return true;
    }

    return false;
  }

}

exports.default = WebSocketClients;