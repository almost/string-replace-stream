// Replace a string with another string in a node stream even when the search
// string spans multiple chunks
'use strict';
var through2 = require('through2');

// Create a transform stream that replaces one string with another
module.exports = function replaceStream(s, replaceWith, opts) {
  var chunks = [], matchPos = 0, buffer = null;
  var encoding = (opts && opts.encoding) || 'utf8';

  return through2(
    function (chunk, enc, callback) {
      var outPos = 0, start = 0;
      chunk = chunk.toString(encoding);
      if (buffer) {
        start = buffer.length;
        chunk = buffer.concat(chunk);
        buffer = null;
      }
      for (var i = start; i < chunk.length; i++) {
        if (s[matchPos] === chunk[i]) {
          matchPos++;
          if (matchPos === s.length) {
            this.push(chunk.slice(outPos, i-matchPos+1));
            this.push(replaceWith);
            outPos = i+1;
            matchPos = 0;
          }
        } else {
          if (matchPos > 0) {
          }
          matchPos= 0;
        }
      }
      this.push(chunk.slice(outPos, chunk.length-matchPos));
      if (matchPos > 0) {
        buffer = chunk.slice(chunk.length-matchPos);
      }
      callback();
    },
    function (cb) {
      if (buffer) {
        this.push(buffer);
      }
      cb();
    }
  );
}
