var access = require('./lib/access.js');
var security = require('./lib/security.js');
var utils = require('./lib/utils.js');
var cloudant = require('./lib/db.js');

var getSelector = function(ownerid, query) {
  delete query.keys;
  delete query.key;
  query.startkey = access.addOwnerId('',ownerid);
  query.endkey = query.startkey.replace('-','z');
  query.descending = false;
  return query;
};

function main(msg) {
  console.log("message", msg);

  // security
  var user_id = security.checkCredentials(msg);
  var params = utils.allowParams(['keys', 'include_docs'], msg);

  // cloudant
  var db = cloudant.configure(msg.COUCH_HOST, msg.ENVOY_DATABASE_NAME);

  // if the user is asking for specific keys
  if (params.keys) {
    params.keys = JSON.parse(msg.keys);
    params.keys = msg.keys.map(function(id) {
      return access.addOwnerId(id, user_id);
    });
    return db.list().then(function(d) {
      return access.strip(d);
    });
  } else {
    // use the primary index for range selection
    var selector = getSelector(user_id, params);
    return db.list(selector).then(function(d) {
      return access.strip(d);
    });
  }
}

exports.main = main;