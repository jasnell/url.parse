'use strict';
const assert = require('assert');
const url = require('../../url');

// https://github.com/joyent/node/issues/568
[
  [undefined, 'undefined'],
  [null, 'object'],
  [true, 'boolean'],
  [false, 'boolean'],
  [0.0, 'number'],
  [0, 'number'],
  [[], 'object'],
  [{}, 'object'],
  [() => {}, 'function'],
  [Symbol('foo'), 'symbol']
].forEach(([val, type]) => {
  assert.throws(() => {
    url.parse(val);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: `The "url" argument must be of type string. Received type ${type}`
  });
});

assert.throws(() => { url.parse('http://%E0%A4%A@fail'); },
              (e) => {
                // The error should be a URIError.
                if (!(e instanceof URIError))
                  return false;

                // The error should be from the JS engine and not from Node.js.
                // JS engine errors do not have the `code` property.
                return e.code === undefined;
              });

;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});
