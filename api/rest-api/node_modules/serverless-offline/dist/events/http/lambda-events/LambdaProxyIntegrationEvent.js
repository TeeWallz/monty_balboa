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
} = Object; // https://serverless.com/framework/docs/providers/aws/events/apigateway/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html

var _path = _classPrivateFieldLooseKey("path");

var _routeKey = _classPrivateFieldLooseKey("routeKey");

var _request = _classPrivateFieldLooseKey("request");

var _stage = _classPrivateFieldLooseKey("stage");

var _stageVariables = _classPrivateFieldLooseKey("stageVariables");

class LambdaProxyIntegrationEvent {
  constructor(request, stage, path, stageVariables, routeKey = null) {
    Object.defineProperty(this, _path, {
      writable: true,
      value: null
    });
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
    _classPrivateFieldLooseBase(this, _path)[_path] = path;
    _classPrivateFieldLooseBase(this, _routeKey)[_routeKey] = routeKey;
    _classPrivateFieldLooseBase(this, _request)[_request] = request;
    _classPrivateFieldLooseBase(this, _stage)[_stage] = stage;
    _classPrivateFieldLooseBase(this, _stageVariables)[_stageVariables] = stageVariables;
  }

  create() {
    const authPrincipalId = _classPrivateFieldLooseBase(this, _request)[_request].auth && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials && _classPrivateFieldLooseBase(this, _request)[_request].auth.credentials.principalId;

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
      rawHeaders,
      url
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
      method,
      route
    } = _classPrivateFieldLooseBase(this, _request)[_request];

    const httpMethod = method.toUpperCase();
    const requestTime = (0, _index.formatToClfTime)(received);
    const requestTimeEpoch = received;
    const resource = _classPrivateFieldLooseBase(this, _routeKey)[_routeKey] || route.path.replace(`/${_classPrivateFieldLooseBase(this, _stage)[_stage]}`, '');
    return {
      body,
      headers,
      httpMethod,
      isBase64Encoded: false,
      // TODO hook up
      multiValueHeaders: (0, _index.parseMultiValueHeaders)( // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
      rawHeaders || []),
      multiValueQueryStringParameters: (0, _index.parseMultiValueQueryStringParameters)(url),
      path: _classPrivateFieldLooseBase(this, _path)[_path],
      pathParameters: (0, _index.nullIfEmpty)(pathParams),
      queryStringParameters: (0, _index.parseQueryStringParameters)(url),
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer: authAuthorizer || assign(authContext, {
          claims,
          scopes,
          // 'principalId' should have higher priority
          principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId' // See #24

        }),
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        extendedRequestId: (0, _index.createUniqueId)(),
        httpMethod,
        identity: {
          accessKey: null,
          accountId: process.env.SLS_ACCOUNT_ID || 'offlineContext_accountId',
          apiKey: process.env.SLS_API_KEY || 'offlineContext_apiKey',
          apiKeyId: process.env.SLS_API_KEY_ID || 'offlineContext_apiKeyId',
          caller: process.env.SLS_CALLER || 'offlineContext_caller',
          cognitoAuthenticationProvider: _headers['cognito-authentication-provider'] || process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER || 'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType: process.env.SLS_COGNITO_AUTHENTICATION_TYPE || 'offlineContext_cognitoAuthenticationType',
          cognitoIdentityId: _headers['cognito-identity-id'] || process.env.SLS_COGNITO_IDENTITY_ID || 'offlineContext_cognitoIdentityId',
          cognitoIdentityPoolId: process.env.SLS_COGNITO_IDENTITY_POOL_ID || 'offlineContext_cognitoIdentityPoolId',
          principalOrgId: null,
          sourceIp: remoteAddress,
          user: 'offlineContext_user',
          userAgent: _headers['user-agent'] || '',
          userArn: 'offlineContext_userArn'
        },
        path: _classPrivateFieldLooseBase(this, _path)[_path],
        protocol: 'HTTP/1.1',
        requestId: (0, _index.createUniqueId)(),
        requestTime,
        requestTimeEpoch,
        resourceId: 'offlineContext_resourceId',
        resourcePath: route.path,
        stage: _classPrivateFieldLooseBase(this, _stage)[_stage]
      },
      resource,
      stageVariables: _classPrivateFieldLooseBase(this, _stageVariables)[_stageVariables]
    };
  }

}

exports.default = LambdaProxyIntegrationEvent;