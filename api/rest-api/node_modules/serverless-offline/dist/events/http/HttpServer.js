"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buffer = require("buffer");

var _fs = require("fs");

var _path = require("path");

var _h2o = _interopRequireDefault(require("@hapi/h2o2"));

var _hapi = require("@hapi/hapi");

var _authFunctionNameExtractor = _interopRequireDefault(require("./authFunctionNameExtractor.js"));

var _authJWTSettingsExtractor = _interopRequireDefault(require("./authJWTSettingsExtractor.js"));

var _createAuthScheme = _interopRequireDefault(require("./createAuthScheme.js"));

var _createJWTAuthScheme = _interopRequireDefault(require("./createJWTAuthScheme.js"));

var _Endpoint = _interopRequireDefault(require("./Endpoint.js"));

var _index = require("./lambda-events/index.js");

var _parseResources = _interopRequireDefault(require("./parseResources.js"));

var _payloadSchemaValidator = _interopRequireDefault(require("./payloadSchemaValidator.js"));

var _debugLog = _interopRequireDefault(require("../../debugLog.js"));

var _serverlessLog = _interopRequireWildcard(require("../../serverlessLog.js"));

var _index2 = require("../../utils/index.js");

var _LambdaProxyIntegrationEventV = _interopRequireDefault(require("./lambda-events/LambdaProxyIntegrationEventV2.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  parse,
  stringify
} = JSON;

var _lambda = _classPrivateFieldLooseKey("lambda");

var _lastRequestOptions = _classPrivateFieldLooseKey("lastRequestOptions");

var _options = _classPrivateFieldLooseKey("options");

var _serverless = _classPrivateFieldLooseKey("serverless");

var _server = _classPrivateFieldLooseKey("server");

var _terminalInfo = _classPrivateFieldLooseKey("terminalInfo");

class HttpServer {
  constructor(serverless, options, lambda) {
    Object.defineProperty(this, _lambda, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lastRequestOptions, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _serverless, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _server, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _terminalInfo, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _lambda)[_lambda] = lambda;
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    _classPrivateFieldLooseBase(this, _serverless)[_serverless] = serverless;

    const {
      enforceSecureCookies,
      host,
      httpPort,
      httpsProtocol,
      noStripTrailingSlashInUrl
    } = _classPrivateFieldLooseBase(this, _options)[_options];

    const serverOptions = {
      host,
      port: httpPort,
      router: {
        // allows for paths with trailing slashes to be the same as without
        // e.g. : /my-path is the same as /my-path/
        stripTrailingSlash: !noStripTrailingSlashInUrl
      },
      state: enforceSecureCookies ? {
        isHttpOnly: true,
        isSameSite: false,
        isSecure: true
      } : {
        isHttpOnly: false,
        isSameSite: false,
        isSecure: false
      }
    }; // HTTPS support

    if (typeof httpsProtocol === 'string' && httpsProtocol.length > 0) {
      serverOptions.tls = {
        cert: (0, _fs.readFileSync)((0, _path.resolve)(httpsProtocol, 'cert.pem'), 'ascii'),
        key: (0, _fs.readFileSync)((0, _path.resolve)(httpsProtocol, 'key.pem'), 'ascii')
      };
    } // Hapijs server creation


    _classPrivateFieldLooseBase(this, _server)[_server] = new _hapi.Server(serverOptions); // Enable CORS preflight response

    _classPrivateFieldLooseBase(this, _server)[_server].ext('onPreResponse', (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom ? request.response.output : request.response;
        const explicitlySetHeaders = { ...response.headers
        };

        if (_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi && _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi.cors) {
          const httpApiCors = (0, _index2.getHttpApiCorsConfig)(_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi.cors);

          if (request.method === 'options') {
            response.statusCode = 204;
            const allowAllOrigins = httpApiCors.allowedOrigins.length === 1 && httpApiCors.allowedOrigins[0] === '*';

            if (!allowAllOrigins && !httpApiCors.allowedOrigins.includes(request.headers.origin)) {
              return h.continue;
            }
          }

          response.headers['access-control-allow-origin'] = request.headers.origin;

          if (httpApiCors.allowCredentials) {
            response.headers['access-control-allow-credentials'] = 'true';
          }

          if (httpApiCors.maxAge) {
            response.headers['access-control-max-age'] = httpApiCors.maxAge;
          }

          if (httpApiCors.exposedResponseHeaders) {
            response.headers['access-control-expose-headers'] = httpApiCors.exposedResponseHeaders.join(',');
          }

          if (httpApiCors.allowedMethods) {
            response.headers['access-control-allow-methods'] = httpApiCors.allowedMethods.join(',');
          }

          if (httpApiCors.allowedHeaders) {
            response.headers['access-control-allow-headers'] = httpApiCors.allowedHeaders.join(',');
          }
        } else {
          response.headers['access-control-allow-origin'] = request.headers.origin;
          response.headers['access-control-allow-credentials'] = 'true';

          if (request.method === 'options') {
            response.statusCode = 200;

            if (request.headers['access-control-expose-headers']) {
              response.headers['access-control-expose-headers'] = request.headers['access-control-expose-headers'];
            } else {
              response.headers['access-control-expose-headers'] = 'content-type, content-length, etag';
            }

            response.headers['access-control-max-age'] = 60 * 10;

            if (request.headers['access-control-request-headers']) {
              response.headers['access-control-allow-headers'] = request.headers['access-control-request-headers'];
            }

            if (request.headers['access-control-request-method']) {
              response.headers['access-control-allow-methods'] = request.headers['access-control-request-method'];
            }
          } // Override default headers with headers that have been explicitly set


          Object.keys(explicitlySetHeaders).forEach(key => {
            const value = explicitlySetHeaders[key];

            if (value) {
              response.headers[key] = value;
            }
          });
        }
      }

      return h.continue;
    });
  }

  async start() {
    const {
      host,
      httpPort,
      httpsProtocol
    } = _classPrivateFieldLooseBase(this, _options)[_options];

    try {
      await _classPrivateFieldLooseBase(this, _server)[_server].start();
    } catch (err) {
      console.error(`Unexpected error while starting serverless-offline server on port ${httpPort}:`, err);
      process.exit(1);
    } // TODO move the following block


    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`;
    (0, _serverlessLog.default)(`[HTTP] server ready: ${server} 🚀`);
    (0, _serverlessLog.default)(''); // serverlessLog('OpenAPI/Swagger documentation:')
    // logRoute('GET', server, '/documentation')
    // serverlessLog('')

    (0, _serverlessLog.default)('Enter "rp" to replay the last request');

    if (process.env.NODE_ENV !== 'test') {
      process.openStdin().addListener('data', data => {
        // note: data is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()
        if (data.toString().trim() === 'rp') {
          this._injectLastRequest();
        }
      });
    }
  } // stops the server


  stop(timeout) {
    return _classPrivateFieldLooseBase(this, _server)[_server].stop({
      timeout
    });
  }

  async registerPlugins() {
    try {
      await _classPrivateFieldLooseBase(this, _server)[_server].register([_h2o.default]);
    } catch (err) {
      (0, _serverlessLog.default)(err);
    }
  } // // TODO unused:
  // get server() {
  //   return this.#server.listener
  // }


  _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
    }
  }

  _logPluginIssue() {
    (0, _serverlessLog.default)('If you think this is an issue with the plugin please submit it, thanks!');
    (0, _serverlessLog.default)('https://github.com/dherault/serverless-offline/issues');
  }

  _extractJWTAuthSettings(endpoint) {
    const result = (0, _authJWTSettingsExtractor.default)(endpoint, _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider, _classPrivateFieldLooseBase(this, _options)[_options].ignoreJWTSignature);
    return result.unsupportedAuth ? null : result;
  }

  _configureJWTAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null;
    } // right now _configureJWTAuthorization only handles AWS HttpAPI Gateway JWT
    // authorizers that are defined in the serverless file


    if (_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.name !== 'aws' || !endpoint.isHttpApi) {
      return null;
    }

    const jwtSettings = this._extractJWTAuthSettings(endpoint);

    if (!jwtSettings) {
      return null;
    }

    (0, _serverlessLog.default)(`Configuring JWT Authorization: ${method} ${path}`); // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately

    const authKey = `${functionKey}-${jwtSettings.authorizerName}-${method}-${path}`;
    const authSchemeName = `scheme-${authKey}`;
    const authStrategyName = `strategy-${authKey}`; // set strategy name for the route config

    (0, _debugLog.default)(`Creating Authorization scheme for ${authKey}`); // Create the Auth Scheme for the endpoint

    const scheme = (0, _createJWTAuthScheme.default)(jwtSettings); // Set the auth scheme and strategy on the server

    _classPrivateFieldLooseBase(this, _server)[_server].auth.scheme(authSchemeName, scheme);

    _classPrivateFieldLooseBase(this, _server)[_server].auth.strategy(authStrategyName, authSchemeName);

    return authStrategyName;
  }

  _extractAuthFunctionName(endpoint) {
    const result = (0, _authFunctionNameExtractor.default)(endpoint);
    return result.unsupportedAuth ? null : result.authorizerName;
  }

  _configureAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null;
    }

    const authFunctionName = this._extractAuthFunctionName(endpoint);

    if (!authFunctionName) {
      return null;
    }

    (0, _serverlessLog.default)(`Configuring Authorization: ${path} ${authFunctionName}`);

    const authFunction = _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.getFunction(authFunctionName);

    if (!authFunction) return (0, _serverlessLog.default)(`WARNING: Authorization function ${authFunctionName} does not exist`);
    const authorizerOptions = {
      identitySource: 'method.request.header.Authorization',
      identityValidationExpression: '(.*)',
      resultTtlInSeconds: '300'
    };

    if (typeof endpoint.authorizer === 'string') {
      authorizerOptions.name = authFunctionName;
    } else {
      Object.assign(authorizerOptions, endpoint.authorizer);
    } // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately


    const authKey = `${functionKey}-${authFunctionName}-${method}-${path}`;
    const authSchemeName = `scheme-${authKey}`;
    const authStrategyName = `strategy-${authKey}`; // set strategy name for the route config

    (0, _debugLog.default)(`Creating Authorization scheme for ${authKey}`); // Create the Auth Scheme for the endpoint

    const scheme = (0, _createAuthScheme.default)(authorizerOptions, _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider, _classPrivateFieldLooseBase(this, _lambda)[_lambda]); // Set the auth scheme and strategy on the server

    _classPrivateFieldLooseBase(this, _server)[_server].auth.scheme(authSchemeName, scheme);

    _classPrivateFieldLooseBase(this, _server)[_server].auth.strategy(authStrategyName, authSchemeName);

    return authStrategyName;
  }

  createRoutes(functionKey, httpEvent, handler) {
    const [handlerPath] = (0, _index2.splitHandlerPathAndName)(handler);
    let method;
    let path;
    let hapiPath;

    if (httpEvent.isHttpApi) {
      if (httpEvent.routeKey === '$default') {
        method = 'ANY';
        path = httpEvent.routeKey;
        hapiPath = '/{default*}';
      } else {
        ;
        [method, path] = httpEvent.routeKey.split(' ');
        hapiPath = (0, _index2.generateHapiPath)(path, { ..._classPrivateFieldLooseBase(this, _options)[_options],
          noPrependStageInUrl: true // Serverless always uses the $default stage

        }, _classPrivateFieldLooseBase(this, _serverless)[_serverless]);
      }
    } else {
      method = httpEvent.method.toUpperCase();
      ({
        path
      } = httpEvent);
      hapiPath = (0, _index2.generateHapiPath)(path, _classPrivateFieldLooseBase(this, _options)[_options], _classPrivateFieldLooseBase(this, _serverless)[_serverless]);
    }

    const endpoint = new _Endpoint.default((0, _path.join)(_classPrivateFieldLooseBase(this, _serverless)[_serverless].config.servicePath, handlerPath), httpEvent);
    const stage = endpoint.isHttpApi ? '$default' : _classPrivateFieldLooseBase(this, _options)[_options].stage || _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.stage;
    const protectedRoutes = [];

    if (httpEvent.private) {
      protectedRoutes.push(`${method}#${hapiPath}`);
    }

    const {
      host,
      httpPort,
      httpsProtocol
    } = _classPrivateFieldLooseBase(this, _options)[_options];

    const server = `${httpsProtocol ? 'https' : 'http'}://${host}:${httpPort}`;

    _classPrivateFieldLooseBase(this, _terminalInfo)[_terminalInfo].push({
      method,
      path: hapiPath,
      server,
      stage: endpoint.isHttpApi || _classPrivateFieldLooseBase(this, _options)[_options].noPrependStageInUrl ? null : stage,
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`
    }); // If the endpoint has an authorization function, create an authStrategy for the route


    const authStrategyName = _classPrivateFieldLooseBase(this, _options)[_options].noAuth ? null : this._configureJWTAuthorization(endpoint, functionKey, method, path) || this._configureAuthorization(endpoint, functionKey, method, path);
    let cors = null;

    if (endpoint.cors) {
      cors = {
        credentials: endpoint.cors.credentials || _classPrivateFieldLooseBase(this, _options)[_options].corsConfig.credentials,
        exposedHeaders: _classPrivateFieldLooseBase(this, _options)[_options].corsConfig.exposedHeaders,
        headers: endpoint.cors.headers || _classPrivateFieldLooseBase(this, _options)[_options].corsConfig.headers,
        origin: endpoint.cors.origins || _classPrivateFieldLooseBase(this, _options)[_options].corsConfig.origin
      };
    } else if (_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi && _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi.cors) {
      const httpApiCors = (0, _index2.getHttpApiCorsConfig)(_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.provider.httpApi.cors);
      cors = {
        origin: httpApiCors.allowedOrigins || [],
        credentials: httpApiCors.allowCredentials,
        exposedHeaders: httpApiCors.exposedResponseHeaders || [],
        maxAge: httpApiCors.maxAge,
        headers: httpApiCors.allowedHeaders || []
      };
    }

    const hapiMethod = method === 'ANY' ? '*' : method;
    const state = _classPrivateFieldLooseBase(this, _options)[_options].disableCookieValidation ? {
      failAction: 'ignore',
      parse: false
    } : {
      failAction: 'error',
      parse: true
    };
    const hapiOptions = {
      auth: authStrategyName,
      cors,
      state,
      timeout: {
        socket: false
      }
    }; // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
    // for more details, check https://github.com/dherault/serverless-offline/issues/204

    if (hapiMethod === 'HEAD') {
      (0, _serverlessLog.default)('HEAD method event detected. Skipping HAPI server route mapping ...');
      return;
    }

    if (hapiMethod !== 'HEAD' && hapiMethod !== 'GET') {
      // maxBytes: Increase request size from 1MB default limit to 10MB.
      // Cf AWS API GW payload limits.
      hapiOptions.payload = {
        maxBytes: 1024 * 1024 * 10,
        parse: false
      };
    }

    hapiOptions.tags = ['api'];

    const hapiHandler = async (request, h) => {
      var _endpoint$request;

      // Here we go
      // Store current request as the last one
      _classPrivateFieldLooseBase(this, _lastRequestOptions)[_lastRequestOptions] = {
        headers: request.headers,
        method: request.method,
        payload: request.payload,
        url: request.url.href
      };
      const requestPath = endpoint.isHttpApi || _classPrivateFieldLooseBase(this, _options)[_options].noPrependStageInUrl ? request.path : request.path.substr(`/${stage}`.length);

      if (request.auth.credentials && request.auth.strategy) {
        _classPrivateFieldLooseBase(this, _lastRequestOptions)[_lastRequestOptions].auth = request.auth;
      } // Payload processing


      const encoding = (0, _index2.detectEncoding)(request);
      request.payload = request.payload && request.payload.toString(encoding);
      request.rawPayload = request.payload; // Incomming request message

      this._printBlankLine();

      (0, _serverlessLog.default)(`${method} ${request.path} (λ: ${functionKey})`); // Check for APIKey

      if ((protectedRoutes.includes(`${hapiMethod}#${hapiPath}`) || protectedRoutes.includes(`ANY#${hapiPath}`)) && !_classPrivateFieldLooseBase(this, _options)[_options].noAuth) {
        const errorResponse = () => h.response({
          message: 'Forbidden'
        }).code(403).type('application/json').header('x-amzn-ErrorType', 'ForbiddenException');

        const requestToken = request.headers['x-api-key'];

        if (requestToken) {
          if (requestToken !== _classPrivateFieldLooseBase(this, _options)[_options].apiKey) {
            (0, _debugLog.default)(`Method ${method} of function ${functionKey} token ${requestToken} not valid`);
            return errorResponse();
          }
        } else if (request.auth && request.auth.credentials && request.auth.credentials.usageIdentifierKey) {
          const {
            usageIdentifierKey
          } = request.auth.credentials;

          if (usageIdentifierKey !== _classPrivateFieldLooseBase(this, _options)[_options].apiKey) {
            (0, _debugLog.default)(`Method ${method} of function ${functionKey} token ${usageIdentifierKey} not valid`);
            return errorResponse();
          }
        } else {
          (0, _debugLog.default)(`Missing x-api-key on private function ${functionKey}`);
          return errorResponse();
        }
      }

      const response = h.response();
      const contentType = request.mime || 'application/json'; // default content type

      const {
        integration,
        requestTemplates
      } = endpoint; // default request template to '' if we don't have a definition pushed in from serverless or endpoint

      const requestTemplate = typeof requestTemplates !== 'undefined' && integration === 'AWS' ? requestTemplates[contentType] : '';
      const schema = typeof (endpoint === null || endpoint === void 0 ? void 0 : (_endpoint$request = endpoint.request) === null || _endpoint$request === void 0 ? void 0 : _endpoint$request.schema) !== 'undefined' ? endpoint.request.schema[contentType] : ''; // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
      // so we have to do it ourselves

      const contentTypesThatRequirePayloadParsing = ['application/json', 'application/vnd.api+json'];

      if (contentTypesThatRequirePayloadParsing.includes(contentType) && request.payload && request.payload.length > 1) {
        try {
          if (!request.payload || request.payload.length < 1) {
            request.payload = '{}';
          }

          request.payload = parse(request.payload);
        } catch (err) {
          (0, _debugLog.default)('error in converting request.payload to JSON:', err);
        }
      }

      (0, _debugLog.default)('contentType:', contentType);
      (0, _debugLog.default)('requestTemplate:', requestTemplate);
      (0, _debugLog.default)('payload:', request.payload);
      /* REQUEST PAYLOAD SCHEMA VALIDATION */

      if (schema) {
        (0, _debugLog.default)('schema:', schema);

        try {
          _payloadSchemaValidator.default.validate(schema, request.payload);
        } catch (err) {
          return this._reply400(response, err.message, err);
        }
      }
      /* REQUEST TEMPLATE PROCESSING (event population) */


      let event = {};

      if (integration === 'AWS') {
        if (requestTemplate) {
          try {
            (0, _debugLog.default)('_____ REQUEST TEMPLATE PROCESSING _____');
            event = new _index.LambdaIntegrationEvent(request, stage, requestTemplate, requestPath).create();
          } catch (err) {
            return this._reply502(response, `Error while parsing template "${contentType}" for ${functionKey}`, err);
          }
        } else if (typeof request.payload === 'object') {
          event = request.payload || {};
        }
      } else if (integration === 'AWS_PROXY') {
        const stageVariables = _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.custom ? _classPrivateFieldLooseBase(this, _serverless)[_serverless].service.custom.stageVariables : null;
        const lambdaProxyIntegrationEvent = endpoint.isHttpApi && endpoint.payload === '2.0' ? new _LambdaProxyIntegrationEventV.default(request, stage, endpoint.routeKey, stageVariables) : new _index.LambdaProxyIntegrationEvent(request, stage, requestPath, stageVariables, endpoint.isHttpApi ? endpoint.routeKey : null);
        event = lambdaProxyIntegrationEvent.create();
      }

      (0, _debugLog.default)('event:', event);

      const lambdaFunction = _classPrivateFieldLooseBase(this, _lambda)[_lambda].get(functionKey);

      lambdaFunction.setEvent(event);
      let result;
      let err;

      try {
        result = await lambdaFunction.runHandler();
      } catch (_err) {
        err = _err;
      } // const processResponse = (err, data) => {
      // Everything in this block happens once the lambda function has resolved


      (0, _debugLog.default)('_____ HANDLER RESOLVED _____');
      let responseName = 'default';
      const {
        contentHandling,
        responseContentType
      } = endpoint;
      /* RESPONSE SELECTION (among endpoint's possible responses) */
      // Failure handling

      let errorStatusCode = '502';

      if (err) {
        // Since the --useChildProcesses option loads the handler in
        // a separate process and serverless-offline communicates with it
        // over IPC, we are unable to catch JavaScript unhandledException errors
        // when the handler code contains bad JavaScript. Instead, we "catch"
        // it here and reply in the same way that we would have above when
        // we lazy-load the non-IPC handler function.
        if (_classPrivateFieldLooseBase(this, _options)[_options].useChildProcesses && err.ipcException) {
          return this._reply502(response, `Error while loading ${functionKey}`, err);
        }

        const errorMessage = (err.message || err).toString();
        const re = /\[(\d{3})]/;
        const found = errorMessage.match(re);

        if (found && found.length > 1) {
          ;
          [, errorStatusCode] = found;
        } else {
          errorStatusCode = '502';
        } // Mocks Lambda errors


        result = {
          errorMessage,
          errorType: err.constructor.name,
          stackTrace: this._getArrayStackTrace(err.stack)
        };
        (0, _serverlessLog.default)(`Failure: ${errorMessage}`);

        if (!_classPrivateFieldLooseBase(this, _options)[_options].hideStackTraces) {
          console.error(err.stack);
        }

        for (const [key, value] of Object.entries(endpoint.responses)) {
          if (key !== 'default' && errorMessage.match(`^${value.selectionPattern || key}$`)) {
            responseName = key;
            break;
          }
        }
      }

      (0, _debugLog.default)(`Using response '${responseName}'`);
      const chosenResponse = endpoint.responses[responseName];
      /* RESPONSE PARAMETERS PROCCESSING */

      const {
        responseParameters
      } = chosenResponse;

      if (responseParameters) {
        const responseParametersKeys = Object.keys(responseParameters);
        (0, _debugLog.default)('_____ RESPONSE PARAMETERS PROCCESSING _____');
        (0, _debugLog.default)(`Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`); // responseParameters use the following shape: "key": "value"

        Object.entries(responseParameters).forEach(([key, value]) => {
          const keyArray = key.split('.'); // eg: "method.response.header.location"

          const valueArray = value.split('.'); // eg: "integration.response.body.redirect.url"

          (0, _debugLog.default)(`Processing responseParameter "${key}": "${value}"`); // For now the plugin only supports modifying headers

          if (key.startsWith('method.response.header') && keyArray[3]) {
            const headerName = keyArray.slice(3).join('.');
            let headerValue;
            (0, _debugLog.default)('Found header in left-hand:', headerName);

            if (value.startsWith('integration.response')) {
              if (valueArray[2] === 'body') {
                (0, _debugLog.default)('Found body in right-hand');
                headerValue = valueArray[3] ? (0, _index2.jsonPath)(result, valueArray.slice(3).join('.')) : result;

                if (typeof headerValue === 'undefined' || headerValue === null) {
                  headerValue = '';
                } else {
                  headerValue = headerValue.toString();
                }
              } else {
                this._printBlankLine();

                (0, _serverlessLog.default)(`Warning: while processing responseParameter "${key}": "${value}"`);
                (0, _serverlessLog.default)(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);

                this._logPluginIssue();

                this._printBlankLine();
              }
            } else {
              headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value; // See #34
            } // Applies the header;


            if (headerValue === '') {
              (0, _serverlessLog.default)(`Warning: empty value for responseParameter "${key}": "${value}", it won't be set`);
            } else {
              (0, _debugLog.default)(`Will assign "${headerValue}" to header "${headerName}"`);
              response.header(headerName, headerValue);
            }
          } else {
            this._printBlankLine();

            (0, _serverlessLog.default)(`Warning: while processing responseParameter "${key}": "${value}"`);
            (0, _serverlessLog.default)(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);

            this._logPluginIssue();

            this._printBlankLine();
          }
        });
      }

      let statusCode = 200;

      if (integration === 'AWS') {
        const endpointResponseHeaders = endpoint.response && endpoint.response.headers || {};
        Object.entries(endpointResponseHeaders).filter(([, value]) => typeof value === 'string' && /^'.*?'$/.test(value)).forEach(([key, value]) => response.header(key, value.slice(1, -1)));
        /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */
        // If there is a responseTemplate, we apply it to the result

        const {
          responseTemplates
        } = chosenResponse;

        if (typeof responseTemplates === 'object') {
          const responseTemplatesKeys = Object.keys(responseTemplates);

          if (responseTemplatesKeys.length) {
            // BAD IMPLEMENTATION: first key in responseTemplates
            const responseTemplate = responseTemplates[responseContentType];

            if (responseTemplate && responseTemplate !== '\n') {
              (0, _debugLog.default)('_____ RESPONSE TEMPLATE PROCCESSING _____');
              (0, _debugLog.default)(`Using responseTemplate '${responseContentType}'`);

              try {
                const reponseContext = new _index.VelocityContext(request, stage, result).getContext();
                result = (0, _index.renderVelocityTemplateObject)({
                  root: responseTemplate
                }, reponseContext).root;
              } catch (error) {
                (0, _serverlessLog.default)(`Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:`);
                console.log(error.stack);
              }
            }
          }
        }
        /* LAMBDA INTEGRATION HAPIJS RESPONSE CONFIGURATION */


        statusCode = chosenResponse.statusCode || 200;

        if (err) {
          statusCode = errorStatusCode;
        }

        if (!chosenResponse.statusCode) {
          this._printBlankLine();

          (0, _serverlessLog.default)(`Warning: No statusCode found for response "${responseName}".`);
        }

        response.header('Content-Type', responseContentType, {
          override: false // Maybe a responseParameter set it already. See #34

        });
        response.statusCode = statusCode;

        if (contentHandling === 'CONVERT_TO_BINARY') {
          response.encoding = 'binary';
          response.source = _buffer.Buffer.from(result, 'base64');
          response.variety = 'buffer';
        } else if (typeof result === 'string') {
          response.source = JSON.stringify(result);
        } else if (result && result.body && typeof result.body !== 'string') {
          return this._reply502(response, 'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object', {});
        } else {
          response.source = result;
        }
      } else if (integration === 'AWS_PROXY') {
        /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */
        if (endpoint.isHttpApi && endpoint.payload === '2.0' && (typeof result === 'string' || !result.statusCode)) {
          const body = typeof result === 'string' ? result : JSON.stringify(result);
          result = {
            isBase64Encoded: false,
            statusCode: 200,
            body,
            headers: {
              'Content-Type': 'application/json'
            }
          };
        }

        if (result && !result.errorType) {
          statusCode = result.statusCode || 200;
        } else {
          statusCode = 502;
        }

        response.statusCode = statusCode;
        const headers = {};

        if (result && result.headers) {
          Object.keys(result.headers).forEach(header => {
            headers[header] = (headers[header] || []).concat(result.headers[header]);
          });
        }

        if (result && result.multiValueHeaders) {
          Object.keys(result.multiValueHeaders).forEach(header => {
            headers[header] = (headers[header] || []).concat(result.multiValueHeaders[header]);
          });
        }

        (0, _debugLog.default)('headers', headers);

        const parseCookies = headerValue => {
          const cookieName = headerValue.slice(0, headerValue.indexOf('='));
          const cookieValue = headerValue.slice(headerValue.indexOf('=') + 1);
          h.state(cookieName, cookieValue, {
            encoding: 'none',
            strictHeader: false
          });
        };

        Object.keys(headers).forEach(header => {
          if (header.toLowerCase() === 'set-cookie') {
            headers[header].forEach(parseCookies);
          } else {
            headers[header].forEach(headerValue => {
              // it looks like Hapi doesn't support multiple headers with the same name,
              // appending values is the closest we can come to the AWS behavior.
              response.header(header, headerValue, {
                append: true
              });
            });
          }
        });

        if (endpoint.isHttpApi && endpoint.payload === '2.0' && result.cookies) {
          result.cookies.forEach(parseCookies);
        }

        response.header('Content-Type', 'application/json', {
          duplicate: false,
          override: false
        });

        if (typeof result === 'string') {
          response.source = JSON.stringify(result);
        } else if (result && typeof result.body !== 'undefined') {
          if (result.isBase64Encoded) {
            response.encoding = 'binary';
            response.source = _buffer.Buffer.from(result.body, 'base64');
            response.variety = 'buffer';
          } else {
            if (result && result.body && typeof result.body !== 'string') {
              return this._reply502(response, 'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object', {});
            }

            response.source = result.body;
          }
        }
      } // Log response


      let whatToLog = result;

      try {
        whatToLog = stringify(result);
      } catch (error) {// nothing
      } finally {
        if (_classPrivateFieldLooseBase(this, _options)[_options].printOutput) (0, _serverlessLog.default)(err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`);
      } // Bon voyage!


      return response;
    };

    _classPrivateFieldLooseBase(this, _server)[_server].route({
      handler: hapiHandler,
      method: hapiMethod,
      options: hapiOptions,
      path: hapiPath
    });
  }

  _replyError(statusCode, response, message, error) {
    (0, _serverlessLog.default)(message);
    console.error(error);
    response.header('Content-Type', 'application/json');
    response.statusCode = statusCode;
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      offlineInfo: 'If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      stackTrace: this._getArrayStackTrace(error.stack)
    };
    return response;
  } // Bad news


  _reply502(response, message, error) {
    // APIG replies 502 by default on failures;
    return this._replyError(502, response, message, error);
  }

  _reply400(response, message, error) {
    return this._replyError(400, response, message, error);
  }

  createResourceRoutes() {
    const resourceRoutesOptions = _classPrivateFieldLooseBase(this, _options)[_options].resourceRoutes;

    if (!resourceRoutesOptions) {
      return;
    }

    const resourceRoutes = (0, _parseResources.default)(_classPrivateFieldLooseBase(this, _serverless)[_serverless].service.resources);

    if (!resourceRoutes || !Object.keys(resourceRoutes).length) {
      return;
    }

    this._printBlankLine();

    (0, _serverlessLog.default)('Routes defined in resources:');
    Object.entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const {
        isProxy,
        method,
        pathResource,
        proxyUri
      } = resourceRoutesObj;

      if (!isProxy) {
        (0, _serverlessLog.default)(`WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`);
        return;
      }

      if (!pathResource) {
        (0, _serverlessLog.default)(`WARNING: Could not resolve path for '${methodId}'.`);
        return;
      }

      const hapiPath = (0, _index2.generateHapiPath)(pathResource, _classPrivateFieldLooseBase(this, _options)[_options], _classPrivateFieldLooseBase(this, _serverless)[_serverless]);
      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {};
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri;

      if (!proxyUriInUse) {
        (0, _serverlessLog.default)(`WARNING: Could not load Proxy Uri for '${methodId}'`);
        return;
      }

      const hapiMethod = method === 'ANY' ? '*' : method;
      const state = _classPrivateFieldLooseBase(this, _options)[_options].disableCookieValidation ? {
        failAction: 'ignore',
        parse: false
      } : {
        failAction: 'error',
        parse: true
      };
      const hapiOptions = {
        cors: _classPrivateFieldLooseBase(this, _options)[_options].corsConfig,
        state
      }; // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204

      if (hapiMethod === 'HEAD') {
        (0, _serverlessLog.default)('HEAD method event detected. Skipping HAPI server route mapping ...');
        return;
      }

      if (hapiMethod !== 'GET' && hapiMethod !== 'HEAD') {
        hapiOptions.payload = {
          parse: false
        };
      }

      (0, _serverlessLog.default)(`${method} ${hapiPath} -> ${proxyUriInUse}`); // hapiOptions.tags = ['api']

      const route = {
        handler(request, h) {
          const {
            params
          } = request;
          let resultUri = proxyUriInUse;
          Object.entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value);
          });

          if (request.url.search !== null) {
            resultUri += request.url.search; // search is empty string by default
          }

          (0, _serverlessLog.default)(`PROXY ${request.method} ${request.url.pathname} -> ${resultUri}`);
          return h.proxy({
            passThrough: true,
            uri: resultUri
          });
        },

        method: hapiMethod,
        options: hapiOptions,
        path: hapiPath
      };

      _classPrivateFieldLooseBase(this, _server)[_server].route(route);
    });
  }

  create404Route() {
    // If a {proxy+} or $default route exists, don't conflict with it
    if (_classPrivateFieldLooseBase(this, _server)[_server].match('*', '/{p*}')) {
      return;
    }

    const existingRoutes = _classPrivateFieldLooseBase(this, _server)[_server].table() // Exclude this (404) route
    .filter(route => route.path !== '/{p*}') // Sort by path
    .sort((a, b) => a.path <= b.path ? -1 : 1) // Human-friendly result
    .map(route => `${route.method} - ${route.path}`);

    const route = {
      handler(request, h) {
        const response = h.response({
          currentRoute: `${request.method} - ${request.path}`,
          error: 'Serverless-offline: route not found.',
          existingRoutes,
          statusCode: 404
        });
        response.statusCode = 404;
        return response;
      },

      method: '*',
      options: {
        cors: _classPrivateFieldLooseBase(this, _options)[_options].corsConfig
      },
      path: '/{p*}'
    };

    _classPrivateFieldLooseBase(this, _server)[_server].route(route);
  }

  _getArrayStackTrace(stack) {
    if (!stack) return null;
    const splittedStack = stack.split('\n');
    return splittedStack.slice(0, splittedStack.findIndex(item => item.match(/server.route.handler.LambdaContext/))).map(line => line.trim());
  }

  _injectLastRequest() {
    if (_classPrivateFieldLooseBase(this, _lastRequestOptions)[_lastRequestOptions]) {
      (0, _serverlessLog.default)('Replaying HTTP last request');

      _classPrivateFieldLooseBase(this, _server)[_server].inject(_classPrivateFieldLooseBase(this, _lastRequestOptions)[_lastRequestOptions]);
    } else {
      (0, _serverlessLog.default)('No last HTTP request to replay!');
    }
  }

  writeRoutesTerminal() {
    (0, _serverlessLog.logRoutes)(_classPrivateFieldLooseBase(this, _terminalInfo)[_terminalInfo]);
  } // TEMP FIXME quick fix to expose gateway server for testing, look for better solution


  getServer() {
    return _classPrivateFieldLooseBase(this, _server)[_server];
  }

}

exports.default = HttpServer;