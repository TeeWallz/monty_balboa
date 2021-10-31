"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ws = require("ws");

var _debugLog = _interopRequireDefault(require("../../debugLog.js"));

var _serverlessLog = _interopRequireDefault(require("../../serverlessLog.js"));

var _index = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _options = _classPrivateFieldLooseKey("options");

var _webSocketClients = _classPrivateFieldLooseKey("webSocketClients");

class WebSocketServer {
  constructor(options, webSocketClients, sharedServer) {
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _webSocketClients, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients] = webSocketClients;
    const server = new _ws.Server({
      server: sharedServer
    });
    server.on('connection', (webSocketClient, request) => {
      console.log('received connection');
      const connectionId = (0, _index.createUniqueId)();
      (0, _debugLog.default)(`connect:${connectionId}`);

      _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients].addClient(webSocketClient, request, connectionId);
    });
  }

  async start() {
    const {
      host,
      httpsProtocol,
      websocketPort
    } = _classPrivateFieldLooseBase(this, _options)[_options];

    (0, _serverlessLog.default)(`Offline [websocket] listening on ws${httpsProtocol ? 's' : ''}://${host}:${websocketPort}`);
  } // no-op, we're re-using the http server


  stop() {}

  addRoute(functionKey, webSocketEvent) {
    _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients].addRoute(functionKey, webSocketEvent.route); // serverlessLog(`route '${route}'`)

  }

}

exports.default = WebSocketServer;