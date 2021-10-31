"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpServer = _interopRequireDefault(require("./HttpServer.js"));

var _LambdaFunctionPool = _interopRequireDefault(require("./LambdaFunctionPool.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _httpServer = _classPrivateFieldLooseKey("httpServer");

var _lambdas = _classPrivateFieldLooseKey("lambdas");

var _lambdaFunctionNamesKeys = _classPrivateFieldLooseKey("lambdaFunctionNamesKeys");

var _lambdaFunctionPool = _classPrivateFieldLooseKey("lambdaFunctionPool");

class Lambda {
  constructor(serverless, options) {
    Object.defineProperty(this, _httpServer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lambdas, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _lambdaFunctionNamesKeys, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _lambdaFunctionPool, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _httpServer)[_httpServer] = new _HttpServer.default(options, this);
    _classPrivateFieldLooseBase(this, _lambdaFunctionPool)[_lambdaFunctionPool] = new _LambdaFunctionPool.default(serverless, options);
  }

  _create(functionKey, functionDefinition) {
    _classPrivateFieldLooseBase(this, _lambdas)[_lambdas].set(functionKey, functionDefinition);

    _classPrivateFieldLooseBase(this, _lambdaFunctionNamesKeys)[_lambdaFunctionNamesKeys].set(functionDefinition.name, functionKey);
  }

  create(lambdas) {
    lambdas.forEach(({
      functionKey,
      functionDefinition
    }) => {
      this._create(functionKey, functionDefinition);
    });
  }

  get(functionKey) {
    const functionDefinition = _classPrivateFieldLooseBase(this, _lambdas)[_lambdas].get(functionKey);

    return _classPrivateFieldLooseBase(this, _lambdaFunctionPool)[_lambdaFunctionPool].get(functionKey, functionDefinition);
  }

  getByFunctionName(functionName) {
    const functionKey = _classPrivateFieldLooseBase(this, _lambdaFunctionNamesKeys)[_lambdaFunctionNamesKeys].get(functionName);

    return this.get(functionKey);
  }

  listFunctionNames() {
    const functionNames = Array.from(_classPrivateFieldLooseBase(this, _lambdaFunctionNamesKeys)[_lambdaFunctionNamesKeys].keys());
    return functionNames;
  }

  listFunctionNamePairs() {
    const funcNamePairs = Array.from(_classPrivateFieldLooseBase(this, _lambdaFunctionNamesKeys)[_lambdaFunctionNamesKeys]).reduce((obj, [key, value]) => Object.assign(obj, {
      [key]: value
    }), // Be careful! Maps can have non-String keys; object literals can't.
    {});
    return funcNamePairs;
  }

  start() {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].start();
  } // stops the server


  stop(timeout) {
    return _classPrivateFieldLooseBase(this, _httpServer)[_httpServer].stop(timeout);
  }

  cleanup() {
    return _classPrivateFieldLooseBase(this, _lambdaFunctionPool)[_lambdaFunctionPool].cleanup();
  }

}

exports.default = Lambda;