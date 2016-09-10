var stringReplaceString = require('./string-replace-stream');
var expect = require('expect.js');
var concat = require('concat-stream');


// Ruining poetry with node.js
describe('string-replace-stream', function () {
  ["string", "buffer"].forEach(function (type) {
    function testReplacement(haystack, search, replace, result, done) {
      replaceStream = stringReplaceString(search, replace);
      replaceStream.pipe(concat({encoding: 'string'}, complete));
      haystack.forEach(function (h) {
        if (type === "buffer") {
          replaceStream.write(new Buffer(h, 'utf8'));
        } else {
          replaceStream.write(h);
        }
      });
      replaceStream.end();

      function complete(output) {
        expect(output).to.equal(result);
        done();
      }
    }

    describe('with input ' + type, function () {
      it('should replace one instance of the search string with the replacement string inside a chunk', function (done) {
        testReplacement(
          ["'Twas brillig, and the slithy toves"],
          "slithy",
          "slimy",
          "'Twas brillig, and the slimy toves",
          done
        );
      });

      it('should replace search string with replacement string spanning 2 chunks', function (done) {
        testReplacement(
          ["'Twas brillig, and the slithy toves\n", "Did gyre and gimble in the wabe;"],
          "toves\nDid gyre",
          "badgers\nDid rotate",
          "'Twas brillig, and the slithy badgers\nDid rotate and gimble in the wabe;",
          done
        );
      });

      it('should replace search string with replacement string spanning 3 chunks', function (done) {
        testReplacement(
          ["'Twas brillig, and the slithy toves\n", "Did gyre and gimble in the wabe;\n", "All mimsy were the borogoves,"],
          "toves\nDid gyre and gimble in the wabe;\nAll mimsy",
          "badgers\nDid rotate and bore in the side of the hill;\nAll flimsy and miserable",
          "'Twas brillig, and the slithy badgers\nDid rotate and bore in the side of the hill;\nAll flimsy and miserable were the borogoves,",
          done
        );
      });

      it('should replace multiple occurrences of search string with replacment string', function (done) {
        testReplacement(
          ["'Twas brillig, and the slithy toves\n", "Did gyre and gimble in the wabe;\n", "All mimsy were the borogoves,"],
          "the",
          "that",
          "'Twas brillig, and that slithy toves\nDid gyre and gimble in that wabe;\nAll mimsy were that borogoves,",
          done
        );
      });

      it('should replace multiple occurances of search string next to each other with replacement string', function (done) {
        testReplacement(
          ["testtestte","sttesttesttes","tHELLOtest"],
          "test",
          "badger",
          "badgerbadgerbadgerbadgerbadgerbadgerHELLObadger",
          done
        );
      });

      it('should replace the whole lot if it matches', function (done) {
        testReplacement(
          ["'Twas brillig, and the slithy toves\n", "Did gyre and gimble in the wabe;\n", "All mimsy were the borogoves,"],
          "'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,",
          "It was four in the afternoon, and the slimy badgers were rotating and boring into the hill. Some birds were miserable and a bit flimsy",
          "It was four in the afternoon, and the slimy badgers were rotating and boring into the hill. Some birds were miserable and a bit flimsy",
          done
        );
      });
    });
  });
});
