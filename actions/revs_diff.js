var access = require('./lib/access.js');
var security = require('./lib/security.js');
var utils = require('./lib/utils.js');
var cloudant = require('./lib/db.js');

function main(msg) {

  // security
  var user_id = security.checkCredentials(msg);
  
  // cloudant
  var dbname = msg.ENVOY_DATABASE_NAME;
  var db = cloudant.configure(msg.COUCH_HOST, dbname);

  // strip the OpenWhisk stuff from the object
  msg = utils.removeOpenWhiskParams(msg);

  // Now we can do the revs_diff
  return db.request({
    db: dbname,
    path: '_revs_diff',
    method: 'POST',
    body: msg
  }).then(function(body) {    
    // remove ownerid from ids
    var newBody = { };
    Object.keys(body).forEach(function(k) {
      var newkey = access.removeOwnerId(k);
      newBody[newkey] = body[k];
    });
    return newBody;
  });
}

exports.main = main;