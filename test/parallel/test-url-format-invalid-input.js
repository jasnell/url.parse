'use strict';
const assert = require('assert');
const url = require('../../url');

const throwsObjsAndReportTypes = new Map([
  [undefined, 'undefined'],
  [null, 'object'],
  [true, 'boolean'],
  [false, 'boolean'],
  [0, 'number'],
  [function() {}, 'function'],
  [Symbol('foo'), 'symbol']
]);

for (const [urlObject, type] of throwsObjsAndReportTypes) {
  assert.throws(function() {
    url.format(urlObject);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: 'The "urlObject" argument must be one of type Object or string. ' +
             `Received type ${type}`
  });
}
assert.strictEqual(url.format(''), '');
assert.strictEqual(url.format({}), '');

;require('tap').pass('sync run');var _list = process.listeners('uncaughtException');process.removeAllListeners('uncaughtException');_list.pop();_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});
