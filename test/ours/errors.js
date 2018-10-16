var tap = require('tap');
var assert = require('assert');
var errors = require('../../internal/errors').codes;

function expect (err, Base, name, code, message) {
  assert(err instanceof Base);
  assert.strictEqual(err.name, name);
  assert.strictEqual(err.code, code);
  assert.strictEqual(err.message, message);
}

expect(
  new errors.ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], 0),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "chunk" argument must be one of type string, Buffer, or Uint8Array. Received type number'
);

expect(
  new errors.ERR_INVALID_ARG_TYPE('first argument', 'not string', 'foo'),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The first argument must not be of type string. Received type string'
);

expect(
  new errors.ERR_INVALID_ARG_TYPE('obj.prop', 'string', undefined),
  TypeError,
  'TypeError',
  'ERR_INVALID_ARG_TYPE',
  'The "obj.prop" property must be of type string. Received type undefined'
);

require('tap').pass('sync done');
