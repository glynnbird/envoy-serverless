var crypto = require('crypto');

// lookup table of numbers 0 to 255 in hex with leading zeros
var lookup = [];
for(var i = 0; i < 256; i++) {
  lookup[i] = (i + 0x100).toString(16).substr(1)
}

module.exports = function() {
  var bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  var str = '';
  for(var i = 0; i < bytes.length; i++) {
    str += lookup[bytes[i]];
  }
  return str;
}