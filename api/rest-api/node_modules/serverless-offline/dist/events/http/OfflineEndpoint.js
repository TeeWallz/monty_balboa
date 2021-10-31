"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class OfflineEndpoint {
  constructor() {
    return {
      apiKeyRequired: false,
      authorizationType: 'none',
      authorizerFunction: false,
      path: '',
      requestParameters: {},
      requestTemplates: {
        'application/json': ''
      },
      responses: {
        default: {
          400: {
            statusCode: '400'
          },
          responseModels: {
            'application/json;charset=UTF-8': 'Empty'
          },
          responseParameters: {},
          responseTemplates: {
            'application/json;charset=UTF-8': ''
          },
          statusCode: 200
        }
      },
      type: 'AWS'
    };
  }

}

exports.default = OfflineEndpoint;