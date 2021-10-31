"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buffer = require("buffer");

var _jsonwebtoken = require("jsonwebtoken");

var _index = require("../../../utils/index.js");

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  byteLength
} = _buffer.Buffer;
const {
  parse
} = JSON;
const {
  assign
} = Object; // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html

var _routeKey = _classPrivateFieldLooseKey("routeKey");

var _request = _classPrivateFieldLooseKey("request");

var _stage = _classPrivateFieldLooseKey("stage");

var _stageVariables = _classPrivateFieldLooseKey("stageVariables");

class LambdaProxyIntegrationEventV2 {
  constructor(request, stage, routeKey, stageVariables) {
    Object.defineProperty(this, _routeKey, {
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
    Object.defineProperty(this, _stageVariables, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _routeKey)[_routeKey] = routeKey;
    _classPrivateFieldLooseBase(this, _request)[_request] = request;
    _classPrivateFieldLooseBase(this, _stage)[_stage] = stage;
    _classPrivateFieldLooseBase(this, _stageVariables)[_stageVariables] = stageVariables;
  }

  create() {
    const authContext = _classPrivateFieldLooseBase(this, _request)[_request].auth && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials.context || {};
    let authAuthorizer;

    if (process.env.AUTHORIZER) {
      try {
        authAuthorizer = parse(process.env.AUTHORIZER);
      } catch (error) {
        console.error('Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.');
      }
    }

    let body = _classPrivateFieldLooseBase(this, _request)[_request].payload;

    const {
      rawHeaders
    } = _classPrivateFieldLooseBase(this, _request)[_request].raw.req; // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())


    const headers = (0, _index.parseHeaders)(rawHeaders || []) || {};

    if (body) {
      if (typeof body !== 'string') {
        // this.#request.payload is NOT the same as the rawPayload
        body = _classPrivateFieldLooseBase(this, _request)[_request].rawPayload;
      }

      if (!headers['Content-Length'] && !headers['content-length'] && !headers['Content-length'] && (typeof body === 'string' || body instanceof _buffer.Buffer || body instanceof ArrayBuffer)) {
        headers['Content-Length'] = String(byteLength(body));
      } // Set a default Content-Type if not provided.


      if (!headers['Content-Type'] && !headers['content-type'] && !headers['Content-type']) {
        headers['Content-Type'] = 'application/json';
      }
    } else if (typeof body === 'undefined' || body === '') {
      body = null;
    } // clone own props


    const pathParams = { ..._classPrivateFieldLooseBase(this, _request)[_request].params
    };
    let token = headers.Authorization || headers.authorization;

    if (token && token.split(' ')[0] === 'Bearer') {
      ;
      [, token] = token.split(' ');
    }

    let claims;
    let scopes;

    if (token) {
      try {
        claims = (0, _jsonwebtoken.decode)(token) || undefined;

        if (claims && claims.scope) {
          scopes = claims.scope.split(' '); // In AWS HTTP Api the scope property is removed from the decoded JWT
          // I'm leaving this property because I'm not sure how all of the authorizers
          // for AWS REST Api handle JWT.
          // claims = { ...claims }
          // delete claims.scope
        }
      } catch (err) {// Do nothing
      }
    }

    const {
      headers: _headers,
      info: {
        received,
        remoteAddress
      },
      method
    } = _classPrivateFieldLooseBase(this, _request)[_request];

    const httpMethod = method.toUpperCase();
    const requestTime = (0, _index.formatToClfTime)(received);
    const requestTimeEpoch = received;
    const cookies = Object.entries(_classPrivateFieldLooseBase(this, _request)[_request].state).map(([key, value]) => `${key}=${value}`);
    return {
      version: '2.0',
      routeKey: _classPrivateFieldLooseBase(this, _routeKey)[_routeKey],
      rawPath: _classPrivateFieldLooseBase(this, _request)[_request].url.pathname,
      rawQueryString: _classPrivateFieldLooseBase(this, _request)[_request].url.searchParams.toString(),
      cookies,
      headers,
      queryStringParameters: _classPrivateFieldLooseBase(this, _request)[_request].url.search ? Object.fromEntries(Array.from(_classPrivateFieldLooseBase(this, _request)[_request].url.searchParams)) : null,
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer: authAuthorizer || assign(authContext, {
          jwt: {
            claims,
            scopes
          }
        }),
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        http: {
          method: httpMethod,
          path: _classPrivateFieldLooseBase(this, _request)[_request].url.pathname,
          protocol: 'HTTP/1.1',
          sourceIp: remoteAddress,
          userAgent: _headers['user-agent'] || ''
        },
        requestId: 'offlineContext_resourceId',
        routeKey: _classPrivateFieldLooseBase(this, _routeKey)[_routeKey],
        stage: _classPrivateFieldLooseBase(this, _stage)[_stage],
        time: requestTime,
        timeEpoch: requestTimeEpoch
      },
      body,
      pathParameters: (0, _index.nullIfEmpty)(pathParams),
      isBase64Encoded: false,
      stageVariables: _classPrivateFieldLooseBase(this, _stageVariables)[_stageVariables]
    };
  }

}

exports.default = LambdaProxyIntegrationEventV2;