var security = require('./lib/security.js');
var cloudant = require('./lib/db.js');
var access = require('./lib/access.js');
var utils = require('./lib/utils.js');

function main(msg) {

  var user_id = security.checkCredentials(msg);
  
  // cloudant
  var db = cloudant.configure(msg.COUCH_HOST, msg.ENVOY_DATABASE_NAME);

  // if we have been passed a path, then this is a PUT /db/<docid> request
  if (msg.__ow_path && msg.__ow_path.length) {
    var bits = msg.__ow_path.split('/');
    var id = '';
    var envoyid = null;
    var path = msg.__ow_path;
    var lastbit = null;

    if (bits.length === 2) {
      // it's a write to a normal document
      id = decodeURIComponent(bits[1]);
    } else if (bits.length === 3 && bits[1] === '_local') {
      // it's a write to a a _local/id document
      lastbit =  decodeURIComponent(bits[2])
      id = '_local/' + lastbit; 
    }
    console.log('id', id);
    envoyid = access.addOwnerId(id, user_id)
    
    // strip the OpenWhisk stuff from the object
    msg = utils.removeOpenWhiskParams(msg);
    
    return db.insert(msg, envoyid).then(function(body) {
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
    // it's a PUT /db request
    return new Error('PUT /db not supported');
  }

};

exports.main = main;