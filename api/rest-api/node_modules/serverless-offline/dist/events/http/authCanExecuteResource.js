"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authCanExecuteResource;

var _authMatchPolicyResource = _interopRequireDefault(require("./authMatchPolicyResource.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;

function checkStatementsAgainstResource(Statement, resource, effect) {
  return Statement.some(statement => {
    const resourceArray = isArray(statement.Resource) ? statement.Resource : [statement.Resource];
    return statement.Effect.toLowerCase() === effect.toLowerCase() && resourceArray.some(policyResource => (0, _authMatchPolicyResource.default)(policyResource, resource));
  });
}

function authCanExecuteResource(policy, resource) {
  const {
    Statement
  } = policy; // check for explicit deny

  const denyStatementFound = checkStatementsAgainstResource(Statement, resource, 'Deny');

  if (denyStatementFound) {
    return false;
  }

  return checkStatementsAgainstResource(Statement, resource, 'Allow');
}