"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpEventDefinition = _interopRequireDefault(require("./HttpEventDefinition.js"));

var _HttpServer = _interopRequireDefault(require("./HttpServer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _httpServer = _classPrivateFieldLooseKey("httpServer");

class Http {
  constructor(serverless, options, lambda) {
    Object.defineProperty(this, _httpServer, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer] = new _HttpServer.default(serverless, options, lambda);
  }

  start() {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].start();
  } // stops the server


  stop(timeout) {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].stop(timeout);
  }

  _create(functionKey, rawHttpEventDefinition, handler) {
    const httpEvent = new _HttpEventDefinition.default(rawHttpEventDefinition);

    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].createRoutes(functionKey, httpEvent, handler);
  }

  create(events) {
    events.forEach(({
      functionKey,
      handler,
      http
    }) => {
      this._create(functionKey, http, handler);
    });

    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].writeRoutesTerminal();
  }

  createResourceRoutes() {
    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].createResourceRoutes();
  }

  create404Route() {
    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].create404Route();
  }

  registerPlugins() {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].registerPlugins();
  } // TEMP FIXME quick fix to expose gateway server for testing, look for better solution


  getServer() {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].getServer();
  }

}

exports.default = Http;