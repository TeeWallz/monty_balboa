"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _lambda = _classPrivateFieldLooseKey("lambda");

class InvokeAsyncController {
  constructor(lambda) {
    Object.defineProperty(this, _lambda, {
      writable: true,
      value: null
    });
    _classPrivateFieldLooseBase(this, _lambda)[_lambda] = lambda;
  }

  async invokeAsync(functionName, event) {
    const lambdaFunction = _classPrivateFieldLooseBase(this, _lambda)[_lambda].getByFunctionName(functionName);

    lambdaFunction.setEvent(event); // don't await result!

    lambdaFunction.runHandler().catch(err => {
      // TODO handle error
      console.log(err);
      throw err;
    });
    return {
      StatusCode: 202
    };
  }

}

exports.default = InvokeAsyncController;