"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buffer = require("buffer");

var _jsStringEscape = _interopRequireDefault(require("js-string-escape"));

var _jsonwebtoken = require("jsonwebtoken");

var _index = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  parse,
  stringify
} = JSON;
const {
  assign,
  entries,
  fromEntries
} = Object;

function escapeJavaScript(x) {
  if (typeof x === 'string') {
    return (0, _jsStringEscape.default)(x).replace(/\\n/g, '\n'); // See #26,
  }

  if ((0, _index.isPlainObject)(x)) {
    const result = fromEntries(entries(x).map(([key, value]) => [key, (0, _jsStringEscape.default)(value)]));
    return stringify(result); // Is this really how APIG does it?
  }

  if (typeof x.toString === 'function') {
    return escapeJavaScript(x.toString());
  }

  return x;
}
/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/


var _path = _classPrivateFieldLooseKey("path");

var _payload = _classPrivateFieldLooseKey("payload");

var _request = _classPrivateFieldLooseKey("request");

var _stage = _classPrivateFieldLooseKey("stage");

class VelocityContext {
  constructor(request, stage, payload, path) {
    Object.defineProperty(this, _path, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _payload, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _request, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _stage, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _path)[_path] = path;
    _classPrivateFieldLooseBase(this, _payload)[_payload] = payload;
    _classPrivateFieldLooseBase(this, _request)[_request] = request;
    _classPrivateFieldLooseBase(this, _stage)[_stage] = stage;
  }

  getContext() {
    const path = x => (0, _index.jsonPath)(_classPrivateFieldLooseBase(this, _payload)[_payload], x);

    const authPrincipalId = _classPrivateFieldLooseBase(this, _request)[_request].auth && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials.principalId;

    let authorizer = _classPrivateFieldLooseBase(this, _request)[_request].auth && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials.authorizer; // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())


    const headers = (0, _index.parseHeaders)(_classPrivateFieldLooseBase(this, _request)[_request].raw.req.rawHeaders || []);
    let token = headers && (headers.Authorization || headers.authorization);

    if (token && token.split(' ')[0] === 'Bearer') {
      ;
      [, token] = token.split(' ');
    }

    if (!authorizer) authorizer = {};
    authorizer.principalId = authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId'; // See #24

    if (token) {
      try {
        const claims = (0, _jsonwebtoken.decode)(token) || undefined;

        if (claims) {
          assign(authorizer, {
            claims
          });
        }
      } catch (err) {// Nothing
      }
    }

    return {
      context: {
        apiId: 'offlineContext_apiId',
        authorizer,
        httpMethod: _classPrivateFieldLooseBase(this, _request)[_request].method.toUpperCase(),
        identity: {
          accountId: 'offlineContext_accountId',
          apiKey: 'offlineContext_apiKey',
          apiKeyId: 'offlineContext_apiKeyId',
          caller: 'offlineContext_caller',
          cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
          sourceIp: _classPrivateFieldLooseBase(this, _request)[_request].info.remoteAddress,
          user: 'offlineContext_user',
          userAgent: _classPrivateFieldLooseBase(this, _request)[_request].headers['user-agent'] || '',
          userArn: 'offlineContext_userArn'
        },
        requestId: (0, _index.createUniqueId)(),
        resourceId: 'offlineContext_resourceId',
        resourcePath: _classPrivateFieldLooseBase(this, _path)[_path],
        stage: _classPrivateFieldLooseBase(this, _stage)[_stage]
      },
      input: {
        body: _classPrivateFieldLooseBase(this, _payload)[_payload],
        // Not a string yet, todo
        json: x => stringify(path(x)),
        params: x => typeof x === 'string' ? _classPrivateFieldLooseBase(this, _request)[_request].params[x] || _classPrivateFieldLooseBase(this, _request)[_request].query[x] || headers[x] : {
          header: headers,
          path: { ..._classPrivateFieldLooseBase(this, _request)[_request].params
          },
          querystring: { ..._classPrivateFieldLooseBase(this, _request)[_request].query
          }
        },
        path
      },
      util: {
        base64Decode: x => _buffer.Buffer.from(x.toString(), 'base64').toString('binary'),
        base64Encode: x => _buffer.Buffer.from(x.toString(), 'binary').toString('base64'),
        escapeJavaScript,
        parseJson: parse,
        urlDecode: x => decodeURIComponent(x.replace(/\+/g, ' ')),
        urlEncode: encodeURI
      }
    };
  }

}

exports.default = VelocityContext;