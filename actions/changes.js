var access = require('./lib/access.js');
var security = require('./lib/security.js');
var utils = require('./lib/utils.js');
var cloudant = require('./lib/db.js');

function main(msg) {

  // security
  var user_id = security.checkCredentials(msg);
  var params = utils.allowParams(['style', 'since', 'timeout','include_docs'], msg);

  // cloudant
  var db = cloudant.configure(msg.COUCH_HOST, msg.ENVOY_DATABASE_NAME);

  // use Mango filtering https://github.com/apache/couchdb-couch/pull/162
  params.limit = 100;
  params.filter = '_selector';
  var prefix = access.addOwnerId('',user_id);
  var selector = { 
    selector: { 
      '_id':  { '$gt': prefix,
                '$lt': prefix + 'z'
              }
    }
  };

  // query filtered changes               
  return db.request( {
    db: msg.ENVOY_DATABASE_NAME,
    path: '_changes',
    qs: params,
    method: 'POST',
    body: selector
  }).then(function(data) {
    if (data.results) {
      data.results = data.results.map(function(r) {
        return access.strip(r);
      });
    }
    return data;
  })
}

exports.main = main;