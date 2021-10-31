"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hapi = require("@hapi/hapi");

var _index = require("./http-routes/index.js");

var _serverlessLog = _interopRequireDefault(require("../../serverlessLog.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _options = _classPrivateFieldLooseKey("options");

var _server = _classPrivateFieldLooseKey("server");

var _webSocketClients = _classPrivateFieldLooseKey("webSocketClients");

class HttpServer {
  constructor(options, webSocketClients) {
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _server, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _webSocketClients, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    _classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients] = webSocketClients;
    const {
      host,
      websocketPort
    } = options;
    const serverOptions = {
      host,
      port: websocketPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: true
      }
    };
    _classPrivateFieldLooseBase(this, _server)[_server] = new _hapi.Server(serverOptions);
  }

  async start() {
    // add routes
    const routes = [...(0, _index.connectionsRoutes)(_classPrivateFieldLooseBase(this, _webSocketClients)[_webSocketClients]), (0, _index.catchAllRoute)()];

    _classPrivateFieldLooseBase(this, _server)[_server].route(routes);

    const {
      host,
      httpsProtocol,
      websocketPort
    } = _classPrivateFieldLooseBase(this, _options)[_options];

    try {
      await _classPrivateFieldLooseBase(this, _server)[_server].start();
    } catch (err) {
      console.error(`Unexpected error while starting serverless-offline websocket server on port ${websocketPort}:`, err);
      process.exit(1);
    }

    (0, _serverlessLog.default)(`Offline [http for websocket] listening on http${httpsProtocol ? 's' : ''}://${host}:${websocketPort}`);
  } // stops the server


  stop(timeout) {
    return _classPrivateFieldLooseBase(this, _server)[_server].stop({
      timeout
    });
  }

  get server() {
    return _classPrivateFieldLooseBase(this, _server)[_server].listener;
  }

}

exports.default = HttpServer;