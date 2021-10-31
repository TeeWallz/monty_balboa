"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthScheme;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _authCanExecuteResource = _interopRequireDefault(require("./authCanExecuteResource.js"));

var _debugLog = _interopRequireDefault(require("../../debugLog.js"));

var _serverlessLog = _interopRequireDefault(require("../../serverlessLog.js"));

var _index = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAuthScheme(authorizerOptions, provider, lambda) {
  const authFunName = authorizerOptions.name;
  let identityHeader = 'authorization';

  if (authorizerOptions.type !== 'request') {
    const identitySourceMatch = /^method.request.header.((?:\w+-?)+\w+)$/.exec(authorizerOptions.identitySource);

    if (!identitySourceMatch || identitySourceMatch.length !== 2) {
      throw new Error(`Serverless Offline only supports retrieving tokens from the headers (λ: ${authFunName})`);
    }

    identityHeader = identitySourceMatch[1].toLowerCase();
  } // Create Auth Scheme


  return () => ({
    async authenticate(request, h) {
      console.log(''); // Just to make things a little pretty

      (0, _serverlessLog.default)(`Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`); // Get Authorization header

      const {
        req
      } = request.raw; // Get path params
      // aws doesn't auto decode path params - hapi does

      const pathParams = { ...request.params
      };
      const accountId = 'random-account-id';
      const apiId = 'random-api-id';
      const httpMethod = request.method.toUpperCase();
      const resourcePath = request.route.path.replace(new RegExp(`^/${provider.stage}`), '');
      let event = {
        enhancedAuthContext: {},
        methodArn: `arn:aws:execute-api:${provider.region}:${accountId}:${apiId}/${provider.stage}/${httpMethod}${resourcePath}`,
        requestContext: {
          accountId,
          apiId,
          httpMethod,
          requestId: 'random-request-id',
          resourceId: 'random-resource-id',
          resourcePath,
          path: request.path,
          stage: provider.stage
        },
        resource: resourcePath
      }; // Create event Object for authFunction
      //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
      //   Account ID and API ID are not simulated

      if (authorizerOptions.type === 'request') {
        const {
          rawHeaders,
          url
        } = req;
        event = { ...event,
          headers: (0, _index.parseHeaders)(rawHeaders),
          httpMethod: request.method.toUpperCase(),
          multiValueHeaders: (0, _index.parseMultiValueHeaders)(rawHeaders),
          multiValueQueryStringParameters: (0, _index.parseMultiValueQueryStringParameters)(url),
          path: request.path,
          pathParameters: (0, _index.nullIfEmpty)(pathParams),
          queryStringParameters: (0, _index.parseQueryStringParameters)(url),
          type: 'REQUEST'
        };
      } else {
        const authorization = req.headers[identityHeader];
        const identityValidationExpression = new RegExp(authorizerOptions.identityValidationExpression);
        const matchedAuthorization = identityValidationExpression.test(authorization);
        const finalAuthorization = matchedAuthorization ? authorization : '';
        (0, _debugLog.default)(`Retrieved ${identityHeader} header "${finalAuthorization}"`);
        event = { ...event,
          authorizationToken: finalAuthorization,
          type: 'TOKEN'
        };
      }

      const lambdaFunction = lambda.get(authFunName);
      lambdaFunction.setEvent(event);

      try {
        const result = await lambdaFunction.runHandler(); // return processResponse(null, result)

        const policy = result; // Validate that the policy document has the principalId set

        if (!policy.principalId) {
          (0, _serverlessLog.default)(`Authorization response did not include a principalId: (λ: ${authFunName})`);
          return _boom.default.forbidden('No principalId set on the Response');
        }

        if (!(0, _authCanExecuteResource.default)(policy.policyDocument, event.methodArn)) {
          (0, _serverlessLog.default)(`Authorization response didn't authorize user to access resource: (λ: ${authFunName})`);
          return _boom.default.forbidden('User is not authorized to access this resource');
        }

        (0, _serverlessLog.default)(`Authorization function returned a successful response: (λ: ${authFunName})`);
        const authorizer = {
          integrationLatency: '42',
          principalId: policy.principalId,
          ...policy.context
        }; // Set the credentials for the rest of the pipeline
        // return resolve(

        return h.authenticated({
          credentials: {
            authorizer,
            context: policy.context,
            principalId: policy.principalId,
            usageIdentifierKey: policy.usageIdentifierKey
          }
        });
      } catch (err) {
        (0, _serverlessLog.default)(`Authorization function returned an error response: (λ: ${authFunName})`);
        return _boom.default.unauthorized('Unauthorized');
      }
    }

  });
}