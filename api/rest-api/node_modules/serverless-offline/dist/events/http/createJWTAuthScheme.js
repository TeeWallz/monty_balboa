"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAuthScheme;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _serverlessLog = _interopRequireDefault(require("../../serverlessLog.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAuthScheme(jwtOptions) {
  const authorizerName = jwtOptions.name;
  const identitySourceMatch = /^\$request.header.((?:\w+-?)+\w+)$/.exec(jwtOptions.identitySource);

  if (!identitySourceMatch || identitySourceMatch.length !== 2) {
    throw new Error(`Serverless Offline only supports retrieving JWT from the headers (${authorizerName})`);
  }

  const identityHeader = identitySourceMatch[1].toLowerCase(); // Create Auth Scheme

  return () => ({
    async authenticate(request, h) {
      console.log(''); // Just to make things a little pretty
      // TODO: this only validates specific properties of the JWT
      // it does not verify the JWT is correctly signed. That would
      // be a great feature to add under an optional flag :)

      (0, _serverlessLog.default)(`Running JWT Authorization function for ${request.method} ${request.path} (${authorizerName})`); // Get Authorization header

      const {
        req
      } = request.raw;
      let jwtToken = req.headers[identityHeader];

      if (jwtToken && jwtToken.split(' ')[0] === 'Bearer') {
        ;
        [, jwtToken] = jwtToken.split(' ');
      }

      try {
        const decoded = _jsonwebtoken.default.decode(jwtToken, {
          complete: true
        });

        if (!decoded) {
          return _boom.default.unauthorized('JWT not decoded');
        }

        const expirationDate = new Date(decoded.payload.exp * 1000);

        if (expirationDate.valueOf() < Date.now()) {
          return _boom.default.unauthorized('JWT Token expired');
        }

        const {
          iss,
          aud,
          scope
        } = decoded.payload;
        const clientId = decoded.payload.client_id;

        if (iss !== jwtOptions.issuerUrl) {
          (0, _serverlessLog.default)(`JWT Token not from correct issuer url`);
          return _boom.default.unauthorized('JWT Token not from correct issuer url');
        }

        const validAudiences = Array.isArray(jwtOptions.audience) ? jwtOptions.audience : [jwtOptions.audience];
        const providedAudiences = Array.isArray(aud) ? aud : [aud];
        const validAudienceProvided = providedAudiences.some(a => validAudiences.includes(a));

        if (!validAudienceProvided && !validAudiences.includes(clientId)) {
          (0, _serverlessLog.default)(`JWT Token does not contain correct audience`);
          return _boom.default.unauthorized('JWT Token does not contain correct audience');
        }

        let scopes = null;

        if (jwtOptions.scopes && jwtOptions.scopes.length) {
          if (!scope) {
            (0, _serverlessLog.default)(`JWT Token missing valid scope`);
            return _boom.default.forbidden('JWT Token missing valid scope');
          }

          scopes = scope.split(' ');

          if (scopes.every(s => {
            return !jwtOptions.scopes.includes(s);
          })) {
            (0, _serverlessLog.default)(`JWT Token missing valid scope`);
            return _boom.default.forbidden('JWT Token missing valid scope');
          }
        }

        (0, _serverlessLog.default)(`JWT Token validated`); // Set the credentials for the rest of the pipeline
        // return resolve(

        return h.authenticated({
          credentials: {
            claims: decoded.payload,
            scopes
          }
        });
      } catch (err) {
        (0, _serverlessLog.default)(`JWT could not be decoded`);
        (0, _serverlessLog.default)(err);
        return _boom.default.unauthorized('Unauthorized');
      }
    }

  });
}