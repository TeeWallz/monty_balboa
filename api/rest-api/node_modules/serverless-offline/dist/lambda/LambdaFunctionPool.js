"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _LambdaFunction = _interopRequireDefault(require("./LambdaFunction.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _options = _classPrivateFieldLooseKey("options");

var _pool = _classPrivateFieldLooseKey("pool");

var _serverless = _classPrivateFieldLooseKey("serverless");

var _timerRef = _classPrivateFieldLooseKey("timerRef");

class LambdaFunctionPool {
  constructor(serverless, options) {
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _pool, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _serverless, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _timerRef, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    _classPrivateFieldLooseBase(this, _serverless)[_serverless] = serverless; // start cleaner

    this._startCleanTimer();
  }

  _startCleanTimer() {
    // NOTE: don't use setInterval, as it would schedule always a new run,
    // regardless of function processing time and e.g. user action (debugging)
    _classPrivateFieldLooseBase(this, _timerRef)[_timerRef] = setTimeout(() => {
      // console.log('run cleanup')
      _classPrivateFieldLooseBase(this, _pool)[_pool].forEach(lambdaFunctions => {
        lambdaFunctions.forEach(lambdaFunction => {
          const {
            idleTimeInMinutes,
            status
          } = lambdaFunction; // console.log(idleTimeInMinutes, status)

          if (status === 'IDLE' && idleTimeInMinutes >= _classPrivateFieldLooseBase(this, _options)[_options].functionCleanupIdleTimeSeconds / 60) {
            // console.log(`removed Lambda Function ${lambdaFunction.functionName}`)
            lambdaFunction.cleanup();
            lambdaFunctions.delete(lambdaFunction);
          }
        });
      }); // schedule new timer


      this._startCleanTimer();
    }, _classPrivateFieldLooseBase(this, _options)[_options].functionCleanupIdleTimeSeconds * 1000 / 2);
  }

  _cleanupPool() {
    const wait = [];

    _classPrivateFieldLooseBase(this, _pool)[_pool].forEach(lambdaFunctions => {
      lambdaFunctions.forEach(lambdaFunction => {
        // collect promises
        wait.push(lambdaFunction.cleanup());
        lambdaFunctions.delete(lambdaFunction);
      });
    });

    return Promise.all(wait);
  } // TODO make sure to call this


  async cleanup() {
    clearTimeout(_classPrivateFieldLooseBase(this, _timerRef)[_timerRef]);
    return this._cleanupPool();
  }

  get(functionKey, functionDefinition) {
    const lambdaFunctions = _classPrivateFieldLooseBase(this, _pool)[_pool].get(functionKey);

    let lambdaFunction; // we don't have any instances

    if (lambdaFunctions == null) {
      lambdaFunction = new _LambdaFunction.default(functionKey, functionDefinition, _classPrivateFieldLooseBase(this, _serverless)[_serverless], _classPrivateFieldLooseBase(this, _options)[_options]);

      _classPrivateFieldLooseBase(this, _pool)[_pool].set(functionKey, new Set([lambdaFunction]));

      return lambdaFunction;
    } // console.log(`${lambdaFunctions.size} lambdaFunctions`)
    // find any IDLE ones


    lambdaFunction = Array.from(lambdaFunctions).find(({
      status
    }) => status === 'IDLE'); // we don't have any IDLE instances

    if (lambdaFunction == null) {
      lambdaFunction = new _LambdaFunction.default(functionKey, functionDefinition, _classPrivateFieldLooseBase(this, _serverless)[_serverless], _classPrivateFieldLooseBase(this, _options)[_options]);
      lambdaFunctions.add(lambdaFunction); // console.log(`${lambdaFunctions.size} lambdaFunctions`)

      return lambdaFunction;
    }

    return lambdaFunction;
  }

}

exports.default = LambdaFunctionPool;