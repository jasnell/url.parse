'use strict';

const {
  hexTable
} = require('./querystring');

// Adapted from querystring's implementation.
// Ref: https://url.spec.whatwg.org/#concept-urlencoded-byte-serializer
const noEscape = [
  /*
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F
  */
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x00 - 0x0F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0x10 - 0x1F
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, // 0x20 - 0x2F
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 0x30 - 0x3F
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0x40 - 0x4F
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 0x50 - 0x5F
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0x60 - 0x6F
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0  // 0x70 - 0x7F
  ];
  
  const formatSymbol = Symbol.for('node-url-format');

  // Special version of hexTable that uses `+` for U+0020 SPACE.
  const paramHexTable = hexTable.slice();
  paramHexTable[0x20] = '+';
  
  function encodeStr(str, noEscapeTable, hexTable) {
    const len = str.length;
    if (len === 0)
      return '';
  
    var out = '';
    var lastPos = 0;
  
    for (var i = 0; i < len; i++) {
      var c = str.charCodeAt(i);
  
      // ASCII
      if (c < 0x80) {
        if (noEscapeTable[c] === 1)
          continue;
        if (lastPos < i)
          out += str.slice(lastPos, i);
        lastPos = i + 1;
        out += hexTable[c];
        continue;
      }
  
      if (lastPos < i)
        out += str.slice(lastPos, i);
  
      // Multi-byte characters ...
      if (c < 0x800) {
        lastPos = i + 1;
        out += hexTable[0xC0 | (c >> 6)] +
               hexTable[0x80 | (c & 0x3F)];
        continue;
      }
      if (c < 0xD800 || c >= 0xE000) {
        lastPos = i + 1;
        out += hexTable[0xE0 | (c >> 12)] +
               hexTable[0x80 | ((c >> 6) & 0x3F)] +
               hexTable[0x80 | (c & 0x3F)];
        continue;
      }
      // Surrogate pair
      ++i;
      var c2;
      if (i < len)
        c2 = str.charCodeAt(i) & 0x3FF;
      else {
        // This branch should never happen because all URLSearchParams entries
        // should already be converted to USVString. But, included for
        // completion's sake anyway.
        c2 = 0;
      }
      lastPos = i + 1;
      c = 0x10000 + (((c & 0x3FF) << 10) | c2);
      out += hexTable[0xF0 | (c >> 18)] +
             hexTable[0x80 | ((c >> 12) & 0x3F)] +
             hexTable[0x80 | ((c >> 6) & 0x3F)] +
             hexTable[0x80 | (c & 0x3F)];
    }
    if (lastPos === 0)
      return str;
    if (lastPos < len)
      return out + str.slice(lastPos);
    return out;
  }

  module.exports = {
    encodeStr,
    formatSymbol
  };