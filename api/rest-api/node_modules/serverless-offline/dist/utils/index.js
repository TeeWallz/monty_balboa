"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectEncoding = detectEncoding;
exports.nullIfEmpty = nullIfEmpty;
exports.isPlainObject = isPlainObject;
exports.toPlainOrEmptyObject = toPlainOrEmptyObject;
Object.defineProperty(exports, "createApiKey", {
  enumerable: true,
  get: function () {
    return _createApiKey.default;
  }
});
Object.defineProperty(exports, "createUniqueId", {
  enumerable: true,
  get: function () {
    return _createUniqueId.default;
  }
});
Object.defineProperty(exports, "detectExecutable", {
  enumerable: true,
  get: function () {
    return _detectExecutable.default;
  }
});
Object.defineProperty(exports, "formatToClfTime", {
  enumerable: true,
  get: function () {
    return _formatToClfTime.default;
  }
});
Object.defineProperty(exports, "getHttpApiCorsConfig", {
  enumerable: true,
  get: function () {
    return _getHttpApiCorsConfig.default;
  }
});
Object.defineProperty(exports, "jsonPath", {
  enumerable: true,
  get: function () {
    return _jsonPath.default;
  }
});
Object.defineProperty(exports, "parseHeaders", {
  enumerable: true,
  get: function () {
    return _parseHeaders.default;
  }
});
Object.defineProperty(exports, "parseMultiValueHeaders", {
  enumerable: true,
  get: function () {
    return _parseMultiValueHeaders.default;
  }
});
Object.defineProperty(exports, "parseMultiValueQueryStringParameters", {
  enumerable: true,
  get: function () {
    return _parseMultiValueQueryStringParameters.default;
  }
});
Object.defineProperty(exports, "parseQueryStringParameters", {
  enumerable: true,
  get: function () {
    return _parseQueryStringParameters.default;
  }
});
Object.defineProperty(exports, "satisfiesVersionRange", {
  enumerable: true,
  get: function () {
    return _satisfiesVersionRange.default;
  }
});
Object.defineProperty(exports, "splitHandlerPathAndName", {
  enumerable: true,
  get: function () {
    return _splitHandlerPathAndName.default;
  }
});
Object.defineProperty(exports, "checkDockerDaemon", {
  enumerable: true,
  get: function () {
    return _checkDockerDaemon.default;
  }
});
Object.defineProperty(exports, "generateHapiPath", {
  enumerable: true,
  get: function () {
    return _generateHapiPath.default;
  }
});

var _createApiKey = _interopRequireDefault(require("./createApiKey.js"));

var _createUniqueId = _interopRequireDefault(require("./createUniqueId.js"));

var _detectExecutable = _interopRequireDefault(require("./detectExecutable.js"));

var _formatToClfTime = _interopRequireDefault(require("./formatToClfTime.js"));

var _getHttpApiCorsConfig = _interopRequireDefault(require("./getHttpApiCorsConfig.js"));

var _jsonPath = _interopRequireDefault(require("./jsonPath.js"));

var _parseHeaders = _interopRequireDefault(require("./parseHeaders.js"));

var _parseMultiValueHeaders = _interopRequireDefault(require("./parseMultiValueHeaders.js"));

var _parseMultiValueQueryStringParameters = _interopRequireDefault(require("./parseMultiValueQueryStringParameters.js"));

var _parseQueryStringParameters = _interopRequireDefault(require("./parseQueryStringParameters.js"));

var _satisfiesVersionRange = _interopRequireDefault(require("./satisfiesVersionRange.js"));

var _splitHandlerPathAndName = _interopRequireDefault(require("./splitHandlerPathAndName.js"));

var _checkDockerDaemon = _interopRequireDefault(require("./checkDockerDaemon.js"));

var _generateHapiPath = _interopRequireDefault(require("./generateHapiPath.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;
const {
  keys
} = Object;

// export { default as baseImage } from './baseImage.js'
// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
function detectEncoding(request) {
  const contentType = request.headers['content-type'];
  return typeof contentType === 'string' && contentType.includes('multipart/form-data') ? 'binary' : 'utf8';
}

function nullIfEmpty(obj) {
  return obj && (keys(obj).length > 0 ? obj : null);
}

function isPlainObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && obj != null;
}

function toPlainOrEmptyObject(obj) {
  return typeof obj === 'object' && !isArray(obj) ? obj : {};
}