var security = require('./lib/security.js');
var cloudant = require('./lib/db.js');

function main(msg) {
  console.log("message", msg);
  var user_id = security.checkCredentials(msg);
  
  // cloudant
  var db = cloudant.configure(msg.COUCH_HOST, msg.ENVOY_DATABASE_NAME);

  return db.info();
};

exports.main = main;