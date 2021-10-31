"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _OfflineEndpoint = _interopRequireDefault(require("./OfflineEndpoint.js"));

var _debugLog = _interopRequireDefault(require("../../debugLog.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  keys
} = Object;

function readFile(filePath) {
  return (0, _fs.readFileSync)(filePath, 'utf8');
} // velocity template defaults


const defaultRequestTemplate = readFile((0, _path.resolve)(__dirname, './templates/offline-default.req.vm'));
const defaultResponseTemplate = readFile((0, _path.resolve)(__dirname, './templates/offline-default.res.vm'));

function getResponseContentType(fep) {
  if (fep.response && fep.response.headers['Content-Type']) {
    return fep.response.headers['Content-Type'].replace(/'/gm, '');
  }

  return 'application/json';
}

var _handlerPath = _classPrivateFieldLooseKey("handlerPath");

var _http = _classPrivateFieldLooseKey("http");

class Endpoint {
  constructor(handlerPath, http) {
    Object.defineProperty(this, _handlerPath, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _http, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath] = handlerPath;
    _classPrivateFieldLooseBase(this, _http)[_http] = http;
    return this._generate();
  } // determine whether we have function level overrides for velocity templates
  // if not we will use defaults


  _setVmTemplates(fullEndpoint) {
    // determine requestTemplate
    // first check if requestTemplate is set through serverless
    const fep = fullEndpoint;

    try {
      // determine request template override
      const reqFilename = `${_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]}.req.vm`; // check if serverless framework populates the object itself

      if (typeof _classPrivateFieldLooseBase(this, _http)[_http].request === 'object' && typeof _classPrivateFieldLooseBase(this, _http)[_http].request.template === 'object') {
        const templatesConfig = _classPrivateFieldLooseBase(this, _http)[_http].request.template;

        keys(templatesConfig).forEach(key => {
          fep.requestTemplates[key] = templatesConfig[key];
        });
      } // load request template if exists if not use default from serverless offline
      else if ((0, _fs.existsSync)(reqFilename)) {
          fep.requestTemplates['application/json'] = readFile(reqFilename);
        } else {
          fep.requestTemplates['application/json'] = defaultRequestTemplate;
        } // determine response template


      const resFilename = `${_classPrivateFieldLooseBase(this, _handlerPath)[_handlerPath]}.res.vm`;
      fep.responseContentType = getResponseContentType(fep);
      (0, _debugLog.default)('Response Content-Type ', fep.responseContentType); // load response template from http response template, or load file if exists other use default

      if (fep.response && fep.response.template) {
        fep.responses.default.responseTemplates[fep.responseContentType] = fep.response.template;
      } else if ((0, _fs.existsSync)(resFilename)) {
        fep.responses.default.responseTemplates[fep.responseContentType] = readFile(resFilename);
      } else {
        fep.responses.default.responseTemplates[fep.responseContentType] = defaultResponseTemplate;
      }
    } catch (err) {
      (0, _debugLog.default)(`Error: ${err}`);
    }

    return fep;
  } // loosely based on:
  // https://github.com/serverless/serverless/blob/v1.59.2/lib/plugins/aws/package/compile/events/apiGateway/lib/validate.js#L380


  _getIntegration(http) {
    const {
      integration,
      async: isAsync
    } = http;

    if (integration) {
      const normalizedIntegration = integration.toUpperCase().replace('-', '_');

      if (normalizedIntegration === 'LAMBDA') {
        return 'AWS';
      }

      if (normalizedIntegration === 'LAMBDA_PROXY') {
        return 'AWS_PROXY';
      }

      return normalizedIntegration;
    }

    if (isAsync) {
      return 'AWS';
    }

    return 'AWS_PROXY';
  } // return fully generated Endpoint


  _generate() {
    const offlineEndpoint = new _OfflineEndpoint.default();
    const fullEndpoint = { ...offlineEndpoint,
      ..._classPrivateFieldLooseBase(this, _http)[_http]
    };
    fullEndpoint.integration = this._getIntegration(_classPrivateFieldLooseBase(this, _http)[_http]);

    if (fullEndpoint.integration === 'AWS') {
      // determine request and response templates or use defaults
      return this._setVmTemplates(fullEndpoint);
    }

    return fullEndpoint;
  }

}

exports.default = Endpoint;