var security = require('./lib/security.js');
var cloudant = require('./lib/db.js');
var access = require('./lib/access.js');
var utils = require('./lib/utils.js');

function main(msg) {

  var user_id = security.checkCredentials(msg);
  
  // cloudant
  var db = cloudant.configure(msg.COUCH_HOST, msg.ENVOY_DATABASE_NAME);

  // if we have been passed a path, then this is a GET /db/<docid> request
  if (msg.__ow_path && msg.__ow_path.length) {
    var params = utils.allowParams(['attachments', 'conflicts', 'local_seq', 'open_revs', 'rev', 'revs', 'revs_info'], msg);
    var bits = msg.__ow_path.split('/');
    var id = decodeURIComponent(bits[1]);
    var envoyid = access.addOwnerId(id, user_id)
    return db.get(envoyid, params).then(function(data) {
      var retval = {};
      retval[id] = access.strip(data);
      return retval;
    });
  } else {
    // it's a GET /db/ request
    return db.info();
  }

  
};

exports.main = main;