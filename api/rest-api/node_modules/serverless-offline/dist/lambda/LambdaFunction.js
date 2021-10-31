"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _fsExtra = require("fs-extra");

var _perf_hooks = require("perf_hooks");

var _jszip = _interopRequireDefault(require("jszip"));

var _index = _interopRequireDefault(require("./handler-runner/index.js"));

var _LambdaContext = _interopRequireDefault(require("./LambdaContext.js"));

var _serverlessLog = _interopRequireDefault(require("../serverlessLog.js"));

var _resolveJoins = _interopRequireDefault(require("../utils/resolveJoins.js"));

var _index2 = require("../config/index.js");

var _index3 = require("../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  keys
} = Object;
const {
  ceil
} = Math;

var _artifact = _classPrivateFieldLooseKey("artifact");

var _clientContext = _classPrivateFieldLooseKey("clientContext");

var _codeDir = _classPrivateFieldLooseKey("codeDir");

var _event = _classPrivateFieldLooseKey("event");

var _executionTimeEnded = _classPrivateFieldLooseKey("executionTimeEnded");

var _executionTimeStarted = _classPrivateFieldLooseKey("executionTimeStarted");

var _functionKey = _classPrivateFieldLooseKey("functionKey");

var _functionName = _classPrivateFieldLooseKey("functionName");

var _handlerRunner = _classPrivateFieldLooseKey("handlerRunner");

var _idleTimeStarted = _classPrivateFieldLooseKey("idleTimeStarted");

var _initialized = _classPrivateFieldLooseKey("initialized");

var _lambdaContext = _classPrivateFieldLooseKey("lambdaContext");

var _lambdaDir = _classPrivateFieldLooseKey("lambdaDir");

var _memorySize = _classPrivateFieldLooseKey("memorySize");

var _region = _classPrivateFieldLooseKey("region");

var _runtime = _classPrivateFieldLooseKey("runtime");

var _timeout = _classPrivateFieldLooseKey("timeout");

class LambdaFunction {
  // can be 'BUSY' or 'IDLE'
  constructor(functionKey, functionDefinition, serverless, options) {
    var _functionDefinition$p;

    Object.defineProperty(this, _artifact, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _clientContext, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _codeDir, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _event, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _executionTimeEnded, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _executionTimeStarted, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _functionKey, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _functionName, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _handlerRunner, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _idleTimeStarted, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _initialized, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _lambdaContext, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lambdaDir, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _memorySize, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _region, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _runtime, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _timeout, {
      writable: true,
      value: null
    });
    this.status = 'IDLE';
    const {
      service,
      config: {
        serverlessPath,
        servicePath
      },
      service: {
        provider,
        package: servicePackage = {}
      }
    } = serverless; // TEMP options.location, for compatibility with serverless-webpack:
    // https://github.com/dherault/serverless-offline/issues/787
    // TODO FIXME look into better way to work with serverless-webpack

    const _servicePath = (0, _path.resolve)(servicePath, options.location || '');

    const {
      handler,
      name,
      package: functionPackage = {}
    } = functionDefinition;
    const [handlerPath, handlerName] = (0, _index3.splitHandlerPathAndName)(handler);
    const memorySize = functionDefinition.memorySize || provider.memorySize || _index2.DEFAULT_LAMBDA_MEMORY_SIZE;
    const runtime = functionDefinition.runtime || provider.runtime || _index2.DEFAULT_LAMBDA_RUNTIME;
    const timeout = (functionDefinition.timeout || provider.timeout || _index2.DEFAULT_LAMBDA_TIMEOUT) * 1000; // this._executionTimeout = null

    _classPrivateFieldLooseBase(this, _functionKey)[_functionKey] = functionKey;
    _classPrivateFieldLooseBase(this, _functionName)[_functionName] = name;
    _classPrivateFieldLooseBase(this, _memorySize)[_memorySize] = memorySize;
    _classPrivateFieldLooseBase(this, _region)[_region] = provider.region;
    _classPrivateFieldLooseBase(this, _runtime)[_runtime] = runtime;
    _classPrivateFieldLooseBase(this, _timeout)[_timeout] = timeout;

    this._verifySupportedRuntime();

    const env = this._getEnv((0, _resolveJoins.default)(provider.environment), functionDefinition.environment, handler);

    _classPrivateFieldLooseBase(this, _artifact)[_artifact] = (_functionDefinition$p = functionDefinition.package) === null || _functionDefinition$p === void 0 ? void 0 : _functionDefinition$p.artifact;

    if (!_classPrivateFieldLooseBase(this, _artifact)[_artifact]) {
      var _service$package;

      _classPrivateFieldLooseBase(this, _artifact)[_artifact] = (_service$package = service.package) === null || _service$package === void 0 ? void 0 : _service$package.artifact;
    }

    if (_classPrivateFieldLooseBase(this, _artifact)[_artifact]) {
      // lambda directory contains code and layers
      _classPrivateFieldLooseBase(this, _lambdaDir)[_lambdaDir] = (0, _path.join)(_servicePath, '.serverless-offline', 'services', service.service, functionKey, (0, _index3.createUniqueId)());
    }

    _classPrivateFieldLooseBase(this, _codeDir)[_codeDir] = _classPrivateFieldLooseBase(this, _lambdaDir)[_lambdaDir] ? (0, _path.resolve)(_classPrivateFieldLooseBase(this, _lambdaDir)[_lambdaDir], 'code') : _servicePath; // TEMP

    const funOptions = {
      functionKey,
      handler,
      handlerName,
      codeDir: _classPrivateFieldLooseBase(this, _codeDir)[_codeDir],
      handlerPath: (0, _path.resolve)(_classPrivateFieldLooseBase(this, _codeDir)[_codeDir], handlerPath),
      runtime,
      serverlessPath,
      servicePath: _servicePath,
      timeout,
      layers: functionDefinition.layers || [],
      provider,
      functionName: name,
      servicePackage: servicePackage.artifact ? (0, _path.resolve)(_servicePath, servicePackage.artifact) : undefined,
      functionPackage: functionPackage.artifact ? (0, _path.resolve)(_servicePath, functionPackage.artifact) : undefined
    };
    _classPrivateFieldLooseBase(this, _handlerRunner)[_handlerRunner] = new _index.default(funOptions, options, env);
    _classPrivateFieldLooseBase(this, _lambdaContext)[_lambdaContext] = new _LambdaContext.default(name, memorySize);
  }

  _startExecutionTimer() {
    _classPrivateFieldLooseBase(this, _executionTimeStarted)[_executionTimeStarted] = _perf_hooks.performance.now(); // this._executionTimeout = this.#executionTimeStarted + this.#timeout * 1000
  }

  _stopExecutionTimer() {
    _classPrivateFieldLooseBase(this, _executionTimeEnded)[_executionTimeEnded] = _perf_hooks.performance.now();
  }

  _startIdleTimer() {
    _classPrivateFieldLooseBase(this, _idleTimeStarted)[_idleTimeStarted] = _perf_hooks.performance.now();
  }

  _verifySupportedRuntime() {
    // print message but keep working (don't error out or exit process)
    if (!_index2.supportedRuntimes.has(_classPrivateFieldLooseBase(this, _runtime)[_runtime])) {
      // this.printBlankLine(); // TODO
      console.log('');
      (0, _serverlessLog.default)(`Warning: found unsupported runtime '${_classPrivateFieldLooseBase(this, _runtime)[_runtime]}' for function '${_classPrivateFieldLooseBase(this, _functionKey)[_functionKey]}'`);
    }
  } // based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L108


  _getAwsEnvVars() {
    return {
      AWS_DEFAULT_REGION: _classPrivateFieldLooseBase(this, _region)[_region],
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: _classPrivateFieldLooseBase(this, _memorySize)[_memorySize],
      AWS_LAMBDA_FUNCTION_NAME: _classPrivateFieldLooseBase(this, _functionName)[_functionName],
      AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/lib/naming.js#L123
      AWS_LAMBDA_LOG_GROUP_NAME: `/aws/lambda/${_classPrivateFieldLooseBase(this, _functionName)[_functionName]}`,
      AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
      AWS_REGION: _classPrivateFieldLooseBase(this, _region)[_region],
      LAMBDA_RUNTIME_DIR: '/var/runtime',
      LAMBDA_TASK_ROOT: '/var/task',
      LANG: 'en_US.UTF-8',
      LD_LIBRARY_PATH: '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib',
      NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules'
    };
  }

  _getEnv(providerEnv, functionDefinitionEnv, handler) {
    return { ...this._getAwsEnvVars(),
      ...providerEnv,
      ...functionDefinitionEnv,
      _HANDLER: handler,
      // TODO is this available in AWS?
      IS_OFFLINE: true
    };
  }

  setClientContext(clientContext) {
    _classPrivateFieldLooseBase(this, _clientContext)[_clientContext] = clientContext;
  }

  setEvent(event) {
    _classPrivateFieldLooseBase(this, _event)[_event] = event;
  } // () => Promise<void>


  async cleanup() {
    // TODO console.log('lambda cleanup')
    await _classPrivateFieldLooseBase(this, _handlerRunner)[_handlerRunner].cleanup();

    if (_classPrivateFieldLooseBase(this, _lambdaDir)[_lambdaDir]) {
      await (0, _fsExtra.remove)(_classPrivateFieldLooseBase(this, _lambdaDir)[_lambdaDir]);
    }
  }

  _executionTimeInMillis() {
    return _classPrivateFieldLooseBase(this, _executionTimeEnded)[_executionTimeEnded] - _classPrivateFieldLooseBase(this, _executionTimeStarted)[_executionTimeStarted];
  } // round up to the nearest ms


  _billedExecutionTimeInMillis() {
    return ceil(_classPrivateFieldLooseBase(this, _executionTimeEnded)[_executionTimeEnded] - _classPrivateFieldLooseBase(this, _executionTimeStarted)[_executionTimeStarted]);
  } // extractArtifact, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L312


  async _extractArtifact() {
    if (!_classPrivateFieldLooseBase(this, _artifact)[_artifact]) {
      return null;
    }

    (0, _fsExtra.emptyDir)(_classPrivateFieldLooseBase(this, _codeDir)[_codeDir]);
    const data = await (0, _fsExtra.readFile)(_classPrivateFieldLooseBase(this, _artifact)[_artifact]);
    const zip = await _jszip.default.loadAsync(data);
    return Promise.all(keys(zip.files).map(async filename => {
      const fileData = await zip.files[filename].async('nodebuffer');

      if (filename.endsWith('/')) {
        return Promise.resolve();
      }

      await (0, _fsExtra.ensureDir)((0, _path.join)(_classPrivateFieldLooseBase(this, _codeDir)[_codeDir], (0, _path.dirname)(filename)));
      return (0, _fsExtra.writeFile)((0, _path.join)(_classPrivateFieldLooseBase(this, _codeDir)[_codeDir], filename), fileData, {
        mode: zip.files[filename].unixPermissions
      });
    }));
  }

  async _initialize() {
    await this._extractArtifact();
    _classPrivateFieldLooseBase(this, _initialized)[_initialized] = true;
  }

  get idleTimeInMinutes() {
    return (_perf_hooks.performance.now() - _classPrivateFieldLooseBase(this, _idleTimeStarted)[_idleTimeStarted]) / 1000 / 60;
  }

  get functionName() {
    return _classPrivateFieldLooseBase(this, _functionName)[_functionName];
  }

  async runHandler() {
    this.status = 'BUSY';

    if (!_classPrivateFieldLooseBase(this, _initialized)[_initialized]) {
      await this._initialize();
    }

    const requestId = (0, _index3.createUniqueId)();

    _classPrivateFieldLooseBase(this, _lambdaContext)[_lambdaContext].setRequestId(requestId);

    _classPrivateFieldLooseBase(this, _lambdaContext)[_lambdaContext].setClientContext(_classPrivateFieldLooseBase(this, _clientContext)[_clientContext]);

    const context = _classPrivateFieldLooseBase(this, _lambdaContext)[_lambdaContext].create();

    this._startExecutionTimer();

    const result = await _classPrivateFieldLooseBase(this, _handlerRunner)[_handlerRunner].run(_classPrivateFieldLooseBase(this, _event)[_event], context);

    this._stopExecutionTimer(); // TEMP TODO FIXME find better solution


    if (!_classPrivateFieldLooseBase(this, _handlerRunner)[_handlerRunner].isDockerRunner()) {
      (0, _serverlessLog.default)(`(λ: ${_classPrivateFieldLooseBase(this, _functionKey)[_functionKey]}) RequestId: ${requestId}  Duration: ${this._executionTimeInMillis().toFixed(2)} ms  Billed Duration: ${this._billedExecutionTimeInMillis()} ms`);
    }

    this.status = 'IDLE';

    this._startIdleTimer();

    return result;
  }

}

exports.default = LambdaFunction;