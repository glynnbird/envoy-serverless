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

    var bits = msg.__ow_path.split('/');
    var params = utils.allowParams(['attachments', 'conflicts', 'local_seq', 'open_revs', 'rev', 'revs', 'revs_info'], msg);
    var envoyid = null;
    var id = '';
    var lastbit = null;
    console.log('path length', msg.__ow_path.length);
    console.log('path', msg.__ow_path)

    if (bits.length === 2) {
      // it's a request for a /db/id document
      id = decodeURIComponent(bits[1]);
    } else if (bits.length === 3 && bits[1] === '_local') {
      // it's a request for a _local/id document
      lastbit = decodeURIComponent(bits[2]);
      id = '_local/' + lastbit;
    }
    envoyid = access.addOwnerId(id, user_id)

    return db.get(envoyid, params).then(function(body) {
      var retval = {};
      var stripped = access.strip(body);

      // OpenWhisk+APIConnect requires different replies depending on the request.
      // - request GET /db - return {ok: true}
      // - request GET /db/doc - return { doc: {ok: true} }
      // - request GET /db/_local/doc - return { _local: { doc: {ok: true}}}
      // very odd
      if (id.match(/^_local/)) {
        var obj = {};
        obj[lastbit] = stripped
        retval['_local'] = obj;
      } else {
        retval[id] = stripped;
      }
      return retval;
    });

  } else {
    // it's a GET /db/ request
    return db.info();
  }

  
};

exports.main = main;