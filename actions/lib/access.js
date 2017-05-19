var crypto = require('crypto');

var sha1 = function(string) {
  return crypto.createHash('sha1').update(string).digest('hex');
};

// adds owner id to an a document id
// e.g. dog becomes glynn-dog
var addOwnerId = function(id, ownerid) {
  var match = id.match(/_local\/(.*)/);
  var hashownerid = sha1(ownerid);
  if (match) {
    var localid = match[1];
    return '_local/' + hashownerid + '-' + localid;
  } else {
    return hashownerid + '-' + id;
  }
};

var removeOwnerId = function(id) {
  var match = id.match(/_local\/(.*)/);
  if (match) {
    var localid = match[1].replace(/^[^-]+\-/,'');
    return '_local/' + localid;
  } else {
    return id.replace(/^[^-]+\-/,''); 
  }
};

var strip = function(obj) {
  if (obj.id) {
    obj.id = removeOwnerId(obj.id);
  }
  if (obj.key) {
    obj.key = removeOwnerId(obj.key);
  }
  if (obj._id) {
    obj._id = removeOwnerId(obj._id);
  }
  if (obj.doc && obj.doc._id) {
    obj.doc = strip(obj.doc);
  }
  if (obj.rows) {
    for(var i in obj.rows) {
      obj.rows[i] = strip(obj.rows[i]);
    }
  }
  return obj;
};


//var access 
module.exports = {
  addOwnerId: addOwnerId,
  removeOwnerId: removeOwnerId,
  strip: strip
};
