"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

var _path = require("path");

var _child_process = require("child_process");

var _extend = _interopRequireDefault(require("extend"));

var _readline = _interopRequireDefault(require("readline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  parse,
  stringify
} = JSON;
const {
  cwd
} = process;
const {
  has
} = Reflect;

var _env = _classPrivateFieldLooseKey("env");

var _handlerName = _classPrivateFieldLooseKey("handlerName");

var _handlerPath = _classPrivateFieldLooseKey("handlerPath");

var _runtime = _classPrivateFieldLooseKey("runtime");

var _allowCache = _classPrivateFieldLooseKey("allowCache");

class PythonRunner {
  constructor(funOptions, env, allowCache) {
    Object.defineProperty(this, _env, {
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
    Object.defineProperty(this, _runtime, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _allowCache, {
      writable: true,
      value: false
    });
    const {
      handlerName,
      handlerPath,
      runtime
    } = funOptions;
    _classPrivateFieldLooseBase(this, _env)[_env] = env;
    _classPrivateFieldLooseBase(this, _handlerName)[_handlerName] = handlerName;
    _classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath] = handlerPath;
    _classPrivateFieldLooseBase(this, _runtime)[_runtime] = (0, _os.platform)() === 'win32' ? 'python.exe' : runtime;
    _classPrivateFieldLooseBase(this, _allowCache)[_allowCache] = allowCache;

    if (process.env.VIRTUAL_ENV) {
      const runtimeDir = (0, _os.platform)() === 'win32' ? 'Scripts' : 'bin';
      process.env.PATH = [(0, _path.join)(process.env.VIRTUAL_ENV, runtimeDir), _path.delimiter, process.env.PATH].join('');
    }

    const [pythonExecutable] = _classPrivateFieldLooseBase(this, _runtime)[_runtime].split('.');

    this.handlerProcess = (0, _child_process.spawn)(pythonExecutable, ['-u', (0, _path.resolve)(__dirname, 'invoke.py'), (0, _path.relative)(cwd(), _classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]), _classPrivateFieldLooseBase(this, _handlerName)[_handlerName]], {
      env: (0, _extend.default)(process.env, _classPrivateFieldLooseBase(this, _env)[_env]),
      shell: true
    });
    this.handlerProcess.stdout.readline = _readline.default.createInterface({
      input: this.handlerProcess.stdout
    });
  } // () => void


  cleanup() {
    this.handlerProcess.kill();
  }

  _parsePayload(value) {
    let payload;

    for (const item of value.split(_os.EOL)) {
      let json; // first check if it's JSON

      try {
        json = parse(item); // nope, it's not JSON
      } catch (err) {// no-op
      } // now let's see if we have a property __offline_payload__


      if (json && typeof json === 'object' && has(json, '__offline_payload__')) {
        payload = json.__offline_payload__; // everything else is print(), logging, ...
      } else {
        console.log(item);
      }
    }

    return payload;
  } // invokeLocalPython, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L410
  // invoke.py, based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py


  async run(event, context) {
    return new Promise((accept, reject) => {
      const input = stringify({
        context,
        event,
        allowCache: _classPrivateFieldLooseBase(this, _allowCache)[_allowCache]
      });

      const onErr = data => {
        // TODO
        console.log(data.toString());
      };

      const onLine = line => {
        try {
          const parsed = this._parsePayload(line.toString());

          if (parsed) {
            this.handlerProcess.stdout.readline.removeListener('line', onLine);
            this.handlerProcess.stderr.removeListener('data', onErr);
            return accept(parsed);
          }

          return null;
        } catch (err) {
          return reject(err);
        }
      };

      this.handlerProcess.stdout.readline.on('line', onLine);
      this.handlerProcess.stderr.on('data', onErr);
      process.nextTick(() => {
        this.handlerProcess.stdin.write(input);
        this.handlerProcess.stdin.write('\n');
      });
    });
  }

}

exports.default = PythonRunner;