// Replace a string with another string in a node stream even when the search
// string spans multiple chunks
'use strict';
var through2 = require('through2');
var StringDecoder = require('string_decoder').StringDecoder;

// Build the Knuth-Morris-Pratt table
function buildTable(search) {
  // Based on https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm#Description_of_pseudocode_for_the_table-building_algorithm
  var table = Array(search.length), pos = 2, cnd = 0, searchLen = search.length;
  table[0] = -1;
  table[1] = 0;
  while (pos < searchLen) {
    if (search[pos-1] === search[cnd]) {
      // the substring continues
      cnd++;
      table[pos] = cnd;
      pos++;
    } else if (cnd > 0) {
      // it doesn't, but we can fall back
      cnd = table[cnd];
    } else {
      // we have run part of candidates.  Note cnd = 0
      table[pos] = 0;
      pos++;
    }
  }
  return table;
}

// Create a transform stream that replaces one string with another
module.exports = function replaceStream(search, replace, opts) {
  var encoding = (opts && opts.encoding) || 'utf8';
  var decoder = new StringDecoder(encoding);
  var matchStart = 0, matchPos = 0;
  var table = buildTable(search);
  var buffer = [], bufferLen = 0, bufferStart = 0,
      outputBuffer = [], chunkLength = 0;

  // Flush up to the current matchStart (match start is relative to the start
  // of the current chunk so it's negative counting from the end of the
  // buffer)
  function flush(writeTo) {
    var outputTo = bufferLen + matchStart - chunkLength;

    while (outputTo > 0 && outputTo > bufferStart) {
      if (outputTo > buffer[0].length-1) {
        var part = buffer.shift();
        outputBuffer.push(part.slice(bufferStart));

        bufferStart = Math.max(0, bufferStart - part.length);
        bufferLen -= part.length;
        outputTo -= part.length;
      } else {
        outputBuffer.push(buffer[0].slice(bufferStart, outputTo));
        bufferStart = outputTo;
        break;
      }
    }
    if (writeTo) {
      // Output everything ready as one chunk
      writeTo.push(outputBuffer.join(''));
      outputBuffer.length = 0;
    }
  }

  return through2(
    function (chunk, enc, callback) {
      chunk = decoder.write(chunk);
      chunkLength = chunk.length;
      buffer.push(chunk);
      bufferLen += chunkLength;
      while (matchStart + matchPos < chunkLength) {
        if (search[matchPos] === chunk[matchStart+matchPos]) {
          matchPos++;
          if (matchPos === search.length) {
            // FOUND IT
            flush();
            outputBuffer.push(replace);
            bufferStart += matchPos;
            matchStart = matchPos + matchStart;
            matchPos = 0;
          }
        } else if (table[matchPos] === -1) {
          // Failed on the first first char of search
          matchPos = 0;
          matchStart++;
        } else {
          matchPos = table[matchPos];
          matchStart += matchPos - table[matchPos];
        }
      }
      flush(this);
      // Adjust the matchStart so it'll be relative to the start of the next
      // chunk
      matchStart = matchStart - chunkLength;
      callback();
    },
    function (callback) {
      matchStart = 0;
      chunkLength = 0;
      flush(this);
      callback();
    }
  );
}

// Export for testing
module.exports._buildTable = buildTable;
