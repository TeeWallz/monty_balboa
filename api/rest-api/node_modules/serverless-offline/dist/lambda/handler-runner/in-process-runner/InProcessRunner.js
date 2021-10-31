"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _perf_hooks = require("perf_hooks");

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const clearModule = (fP, opts) => {
  const options = opts !== null && opts !== void 0 ? opts : {};
  let filePath = fP;

  if (!require.cache[filePath]) {
    const dirname = path.dirname(filePath);

    for (const fn of fs.readdirSync(dirname)) {
      const fullPath = path.resolve(dirname, fn);

      if (fullPath.substr(0, filePath.length + 1) === `${filePath}.` && require.cache[fullPath]) {
        filePath = fullPath;
        break;
      }
    }
  }

  if (require.cache[filePath]) {
    // Remove file from parent cache
    if (require.cache[filePath].parent) {
      let i = require.cache[filePath].parent.children.length;

      if (i) {
        do {
          i -= 1;

          if (require.cache[filePath].parent.children[i].id === filePath) {
            require.cache[filePath].parent.children.splice(i, 1);
          }
        } while (i);
      }
    }

    const cld = require.cache[filePath].children;
    delete require.cache[filePath];

    for (const c of cld) {
      // Unload any non node_modules children
      if (!c.filename.match(/node_modules/)) {
        clearModule(c.id, { ...options,
          cleanup: false
        });
      }
    }

    if (opts.cleanup) {
      // Cleanup any node_modules that are orphans
      let cleanup = false;

      do {
        cleanup = false;

        for (const fn of Object.keys(require.cache)) {
          if (require.cache[fn].id !== '.' && require.cache[fn].parent && require.cache[fn].parent.id !== '.' && !require.cache[require.cache[fn].parent.id]) {
            delete require.cache[fn];
            cleanup = true;
          }
        }
      } while (cleanup);
    }
  }
};

var _env = _classPrivateFieldLooseKey("env");

var _functionKey = _classPrivateFieldLooseKey("functionKey");

var _handlerName = _classPrivateFieldLooseKey("handlerName");

var _handlerPath = _classPrivateFieldLooseKey("handlerPath");

var _timeout = _classPrivateFieldLooseKey("timeout");

var _allowCache = _classPrivateFieldLooseKey("allowCache");

class InProcessRunner {
  constructor(functionKey, handlerPath, handlerName, env, timeout, allowCache) {
    Object.defineProperty(this, _env, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _functionKey, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _handlerName, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _handlerPath, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _timeout, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _allowCache, {
      writable: true,
      value: false
    });
    _classPrivateFieldLooseBase(this, _env)[_env] = env;
    _classPrivateFieldLooseBase(this, _functionKey)[_functionKey] = functionKey;
    _classPrivateFieldLooseBase(this, _handlerName)[_handlerName] = handlerName;
    _classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath] = handlerPath;
    _classPrivateFieldLooseBase(this, _timeout)[_timeout] = timeout;
    _classPrivateFieldLooseBase(this, _allowCache)[_allowCache] = allowCache;
  } // no-op
  // () => void


  cleanup() {}

  async run(event, context) {
    // check if the handler module path exists
    if (!require.resolve(_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath])) {
      throw new Error(`Could not find handler module '${_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]}' for function '${_classPrivateFieldLooseBase(this, _functionKey)[_functionKey]}'.`);
    } // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)


    Object.assign(process.env, _classPrivateFieldLooseBase(this, _env)[_env]); // lazy load handler with first usage

    if (!_classPrivateFieldLooseBase(this, _allowCache)[_allowCache]) {
      clearModule(_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath], {
        cleanup: true
      });
    }

    const {
      [_classPrivateFieldLooseBase(this, _handlerName)[_handlerName]]: handler
    } = await Promise.resolve(`${_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]}`).then(s => _interopRequireWildcard(require(s)));

    if (typeof handler !== 'function') {
      throw new Error(`offline: handler '${_classPrivateFieldLooseBase(this, _handlerName)[_handlerName]}' in ${_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]} is not a function`);
    }

    let callback;
    const callbackCalled = new Promise((resolve, reject) => {
      callback = (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      };
    });

    const executionTimeout = _perf_hooks.performance.now() + _classPrivateFieldLooseBase(this, _timeout)[_timeout]; // attach doc-deprecated functions
    // create new immutable object


    const lambdaContext = { ...context,
      getRemainingTimeInMillis: () => {
        const timeLeft = executionTimeout - _perf_hooks.performance.now(); // just return 0 for now if we are beyond alotted time (timeout)


        return timeLeft > 0 ? timeLeft : 0;
      },
      done: (err, data) => callback(err, data),
      fail: err => callback(err),
      succeed: res => callback(null, res)
    };
    let result; // execute (run) handler

    try {
      result = handler(event, lambdaContext, callback);
    } catch (err) {
      // this only executes when we have an exception caused by synchronous code
      // TODO logging
      console.log(err);
      throw new Error(`Uncaught error in '${_classPrivateFieldLooseBase(this, _functionKey)[_functionKey]}' handler.`);
    } // // not a Promise, which is not supported by aws
    // if (result == null || typeof result.then !== 'function') {
    //   throw new Error(`Synchronous function execution is not supported.`)
    // }


    const callbacks = [callbackCalled]; // Promise was returned

    if (result != null && typeof result.then === 'function') {
      callbacks.push(result);
    }

    let callbackResult;

    try {
      callbackResult = await Promise.race(callbacks);
    } catch (err) {
      // TODO logging
      console.log(err);
      throw err;
    }

    return callbackResult;
  }

}

exports.default = InProcessRunner;