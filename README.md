string-replace-stream
=====================

Replace one string with another string in a Node.js Stream. Only supports
straight string replacement, no regexs. Handles replacing strings that span
multiple chunks in the stream correctly.

Written by Thomas Parslow ([almostobsolete.net](http://almostobsolete.net) and
[tomparslow.co.uk](http://tomparslow.co.uk)) for IORad
([iorad.com](http://iorad.com/)) and released with their kind permission.

[![NPM](https://nodei.co/npm/string-replace-stream.png?downloads&downloadRank)](https://nodei.co/npm/string-replace-stream/)

[![Build Status](https://travis-ci.org/almost/string-replace-stream.svg)](https://travis-ci.org/almost/string-replace-stream)


Install
-------

```bash
npm install --save string-replace-stream
```

Examples
--------

```javascript
import stringReplaceStream from 'string-replace-stream';

var all = [];

fs.createReadStream('data.txt')
  .pipe(stringReplaceStream("awesome", "rather good"))
  .pipe(process.stdout);
```

Buffers are converted to strings before search and replace is performed. You can
specify an encoding (it defaults to utf8):


```javascript
stringReplaceStream("awesome", "rather good"), {encoding: "ascii"})
```

Other Libaries
--------------

There are a couple of other similar libraries on NPM already:

[replacestream](https://github.com/eugeneware/replacestream): More fully
featured, supports regular expressions. Can be a lot slower depending on the
input (in my testing it does particulary badly with large streams in which the
search string only seldom appears)

[stream-replace](https://github.com/lxe/stream-replace): Much faster (about 5
times in my testing) but doesn't always give the right answer. Can't handle a
search string that spans 3 or more chunks.

Contributing
------------

Fixed or improved stuff? Great! Send me a pull request [through GitHub](http://github.com/almost/string-replace-stream)
or get in touch on Twitter [@almostobsolete][#tom-twitter] or email at tom@almostobsolete.net

[#tom]: http://www.almostobsolete.net
[#tom-twitter]: https://twitter.com/almostobsolete
