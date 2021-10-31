"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _context = _classPrivateFieldLooseKey("context");

// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
class LambdaContext {
  constructor(functionName, memorySize) {
    Object.defineProperty(this, _context, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _context)[_context] = {
      awsRequestId: undefined,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: undefined,
      functionName,
      functionVersion: `$LATEST`,
      identity: undefined,
      invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
      logGroupName: `offline_logGroupName_for_${functionName}`,
      logStreamName: `offline_logStreamName_for_${functionName}`,
      memoryLimitInMB: String(memorySize) // NOTE: string in AWS

    };
  }

  setClientContext(clientContext) {
    _classPrivateFieldLooseBase(this, _context)[_context].clientContext = clientContext;
  }

  setRequestId(requestId) {
    _classPrivateFieldLooseBase(this, _context)[_context].awsRequestId = requestId;
  }

  create() {
    return _classPrivateFieldLooseBase(this, _context)[_context];
  }

}

exports.default = LambdaContext;