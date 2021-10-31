"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedRuntimes = exports.supportedRuby = exports.supportedPython = exports.supportedProvided = exports.supportedNodejs = exports.supportedJava = exports.supportedGo = exports.supportedDotnetcore = void 0;
// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
// .NET CORE
const supportedDotnetcore = new Set([// deprecated
  // 'dotnetcore1.0',
  // 'dotnetcore2.0',
  // supported
  // 'dotnetcore2.1'
]); // GO

exports.supportedDotnetcore = supportedDotnetcore;
const supportedGo = new Set(['go1.x']); // JAVA

exports.supportedGo = supportedGo;
const supportedJava = new Set(['java8', 'java11']); // NODE.JS

exports.supportedJava = supportedJava;
const supportedNodejs = new Set([// deprecated, but still working
'nodejs4.3', 'nodejs6.10', 'nodejs8.10', // supported
'nodejs10.x', 'nodejs12.x', 'nodejs14.x']); // PROVIDED

exports.supportedNodejs = supportedNodejs;
const supportedProvided = new Set(['provided']); // PYTHON

exports.supportedProvided = supportedProvided;
const supportedPython = new Set(['python2.7', 'python3.6', 'python3.7', 'python3.8', 'python3.9']); // RUBY

exports.supportedPython = supportedPython;
const supportedRuby = new Set(['ruby2.5', 'ruby2.7']); // deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html

exports.supportedRuby = supportedRuby;
const supportedRuntimes = new Set([...supportedDotnetcore, ...supportedGo, ...supportedJava, ...supportedNodejs, ...supportedProvided, ...supportedPython, ...supportedRuby]);
exports.supportedRuntimes = supportedRuntimes;