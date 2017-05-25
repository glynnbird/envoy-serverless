

var allowParams = function(paramsList, msg) {
  var obj = {};
  for(var i in paramsList) {
    var p = paramsList[i];
    if (typeof msg[p] !== 'undefined') {
      obj[p] = msg[p];
    }
  }
  return obj;
};

var removeOpenWhiskParams = function(msg) {
  delete msg.__ow_method;
  delete msg.__ow_headers;
  delete msg.__ow_path;
  delete msg.COUCH_HOST;
  delete msg.ENVOY_DATABASE_NAME;
  return msg;
};


//var utils = 

module.exports = {
  allowParams: allowParams,
  removeOpenWhiskParams: removeOpenWhiskParams
};

