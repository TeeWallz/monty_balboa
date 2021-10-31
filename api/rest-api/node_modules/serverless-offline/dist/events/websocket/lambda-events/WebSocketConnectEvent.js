"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WebSocketRequestContext = _interopRequireDefault(require("./WebSocketRequestContext.js"));

var _index = require("../../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _connectionId = _classPrivateFieldLooseKey("connectionId");

var _httpsProtocol = _classPrivateFieldLooseKey("httpsProtocol");

var _rawHeaders = _classPrivateFieldLooseKey("rawHeaders");

var _url = _classPrivateFieldLooseKey("url");

var _websocketPort = _classPrivateFieldLooseKey("websocketPort");

class WebSocketConnectEvent {
  constructor(connectionId, request, options) {
    Object.defineProperty(this, _connectionId, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _httpsProtocol, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _rawHeaders, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _url, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _websocketPort, {
      writable: true,
      value: null
    });
    const {
      httpsProtocol,
      websocketPort
    } = options;
    const {
      rawHeaders,
      url
    } = request;
    _classPrivateFieldLooseBase(this, _connectionId)[_connectionId] = connectionId;
    _classPrivateFieldLooseBase(this, _httpsProtocol)[_httpsProtocol] = httpsProtocol;
    _classPrivateFieldLooseBase(this, _rawHeaders)[_rawHeaders] = rawHeaders;
    _classPrivateFieldLooseBase(this, _url)[_url] = url;
    _classPrivateFieldLooseBase(this, _websocketPort)[_websocketPort] = websocketPort;
  }

  create() {
    // const headers = {
    //   Host: 'localhost',
    //   'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    //   'Sec-WebSocket-Key': createUniqueId(),
    //   'Sec-WebSocket-Version': '13',
    //   'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
    //   'X-Forwarded-For': '127.0.0.1',
    //   'X-Forwarded-Port': String(this.#websocketPort),
    //   'X-Forwarded-Proto': `http${this.#httpsProtocol ? 's' : ''}`,
    // }
    const headers = (0, _index.parseHeaders)(_classPrivateFieldLooseBase(this, _rawHeaders)[_rawHeaders]);
    const multiValueHeaders = (0, _index.parseMultiValueHeaders)(_classPrivateFieldLooseBase(this, _rawHeaders)[_rawHeaders]);
    const multiValueQueryStringParameters = (0, _index.parseMultiValueQueryStringParameters)(_classPrivateFieldLooseBase(this, _url)[_url]);
    const queryStringParameters = (0, _index.parseQueryStringParameters)(_classPrivateFieldLooseBase(this, _url)[_url]);
    const requestContext = new _WebSocketRequestContext.default('CONNECT', '$connect', _classPrivateFieldLooseBase(this, _connectionId)[_connectionId]).create();
    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      // NOTE: multiValueQueryStringParameters and queryStringParameters
      // properties are only defined if they have values
      ...(multiValueQueryStringParameters && {
        multiValueQueryStringParameters
      }),
      ...(queryStringParameters && {
        queryStringParameters
      }),
      requestContext
    };
  }

}

exports.default = WebSocketConnectEvent;