  
var Cloudant = require('cloudant');

var configure = function(url, dbname) {
  var cloudant = Cloudant({url: url, plugin:'promises'});
  var db = cloudant.db.use(dbname);
  db.request = cloudant.request;
  return db;
};

module.exports = {
  configure: configure
}

