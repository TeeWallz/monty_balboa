"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _worker_threads = require("worker_threads");

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

// eslint-disable-line import/no-unresolved
const workerThreadHelperPath = (0, _path.resolve)(__dirname, './workerThreadHelper.js');

var _workerThread = _classPrivateFieldLooseKey("workerThread");

var _allowCache = _classPrivateFieldLooseKey("allowCache");

class WorkerThreadRunner {
  constructor(funOptions
  /* options */
  , env, allowCache) {
    Object.defineProperty(this, _workerThread, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _allowCache, {
      writable: true,
      value: false
    });
    // this._options = options
    const {
      functionKey,
      handlerName,
      handlerPath,
      timeout
    } = funOptions;
    _classPrivateFieldLooseBase(this, _allowCache)[_allowCache] = allowCache;
    _classPrivateFieldLooseBase(this, _workerThread)[_workerThread] = new _worker_threads.Worker(workerThreadHelperPath, {
      // don't pass process.env from the main process!
      env,
      workerData: {
        functionKey,
        handlerName,
        handlerPath,
        timeout
      }
    });
  } // () => Promise<number>


  cleanup() {
    // TODO console.log('worker thread cleanup')
    // NOTE: terminate returns a Promise with exit code in node.js v12.5+
    return _classPrivateFieldLooseBase(this, _workerThread)[_workerThread].terminate();
  }

  run(event, context) {
    return new Promise((_resolve, reject) => {
      const {
        port1,
        port2
      } = new _worker_threads.MessageChannel();
      port1.on('message', _resolve) // emitted if the worker thread throws an uncaught exception.
      // In that case, the worker will be terminated.
      .on('error', reject) // TODO
      .on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      _classPrivateFieldLooseBase(this, _workerThread)[_workerThread].postMessage({
        context,
        event,
        allowCache: _classPrivateFieldLooseBase(this, _allowCache)[_allowCache],
        // port2 is part of the payload, for the other side to answer messages
        port: port2
      }, // port2 is also required to be part of the transfer list
      [port2]);
    });
  }

}

exports.default = WorkerThreadRunner;