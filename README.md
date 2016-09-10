string-replace-stream
=====================



Written by Thomas Parslow ([almostobsolete.net](http://almostobsolete.net) and
[tomparslow.co.uk](http://tomparslow.co.uk)) for IORad
([iorad.com](http://iorad.com/)) and released with their kind permission.

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


Contributing
------------

Fixed or improved stuff? Great! Send me a pull request [through GitHub](http://github.com/almost/string-replace-stream)
or get in touch on Twitter [@almostobsolete][#tom-twitter] or email at tom@almostobsolete.net

[#tom]: http://www.almostobsolete.net
[#tom-twitter]: https://twitter.com/almostobsolete
