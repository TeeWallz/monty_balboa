"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DockerContainer = _interopRequireDefault(require("./DockerContainer.js"));

var _index = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _codeDir = _classPrivateFieldLooseKey("codeDir");

var _container = _classPrivateFieldLooseKey("container");

class DockerRunner {
  constructor(funOptions, env, dockerOptions) {
    Object.defineProperty(this, _codeDir, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _container, {
      writable: true,
      value: null
    });
    const {
      codeDir,
      functionKey,
      handler,
      runtime,
      layers,
      provider,
      servicePath
    } = funOptions;
    _classPrivateFieldLooseBase(this, _codeDir)[_codeDir] = codeDir;

    if (dockerOptions.hostServicePath && _classPrivateFieldLooseBase(this, _codeDir)[_codeDir].startsWith(servicePath)) {
      _classPrivateFieldLooseBase(this, _codeDir)[_codeDir] = _classPrivateFieldLooseBase(this, _codeDir)[_codeDir].replace(servicePath, dockerOptions.hostServicePath);
    }

    _classPrivateFieldLooseBase(this, _container)[_container] = new _DockerContainer.default(env, functionKey, handler, runtime, layers, provider, servicePath, dockerOptions);
  }

  cleanup() {
    if (_classPrivateFieldLooseBase(this, _container)[_container]) {
      return _classPrivateFieldLooseBase(this, _container)[_container].stop();
    }

    return undefined;
  } // context will be generated in container


  async run(event) {
    // FIXME TODO this should run only once -> static private
    await (0, _index.checkDockerDaemon)();

    if (!_classPrivateFieldLooseBase(this, _container)[_container].isRunning) {
      await _classPrivateFieldLooseBase(this, _container)[_container].start(_classPrivateFieldLooseBase(this, _codeDir)[_codeDir]);
    }

    return _classPrivateFieldLooseBase(this, _container)[_container].request(event);
  }

}

exports.default = DockerRunner;