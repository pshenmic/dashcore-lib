/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

'use strict';

function Random() {}

/* secure random bytes that sometimes throws an error due to lack of entropy */
Random.getRandomBuffer = function (size) {
  if (process.browser) return Random.getRandomBufferBrowser(size);
  else return Random.getRandomBufferNode(size);
};

Random.getRandomBufferNode = function (size) {
  var crypto = require('crypto');
  return crypto.randomBytes(size);
};

Random.getRandomBufferBrowser = function (size) {
  var myCrypto;
  if (typeof window !== 'undefined') {
    if (!window.crypto && !window.msCrypto)
      throw new Error('window.crypto not available');

    if (window.crypto && window.crypto.getRandomValues)
      myCrypto = window.crypto;
    else if (window.msCrypto && window.msCrypto.getRandomValues)
        //internet explorer
      myCrypto = window.msCrypto;
    else throw new Error('window.crypto.getRandomValues not available');
  }

  if (typeof window === 'undefined' && !crypto) {
    // chrome extensions does not have `window`, but does have `crypto`
    throw new Error('window and crypto are not available')
  } else {
    myCrypto = crypto
  }

  var bbuf = new Uint8Array(size);
  myCrypto.getRandomValues(bbuf);
  var buf = Buffer.from(bbuf);

  return buf;
};

/* insecure random bytes, but it never fails */
Random.getPseudoRandomBuffer = function (size) {
  var b32 = 0x100000000;
  var b = Buffer.alloc(size);
  var r;

  for (var i = 0; i <= size; i++) {
    var j = Math.floor(i / 4);
    var k = i - j * 4;
    if (k === 0) {
      r = Math.random() * b32;
      b[i] = r & 0xff;
    } else {
      b[i] = (r = r >>> 8) & 0xff;
    }
  }

  return b;
};

module.exports = Random;
