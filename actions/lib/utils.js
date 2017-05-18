

var allowParams = function(paramsList, msg) {
  var obj = {};
  for(var i in paramsList) {
    var p = paramsList[i];
    if (typeof msg[p] !== 'undefined') {
      obj[p] = msg[p];
    }
  }
  return obj;
}


//var utils = 

module.exports = {
  allowParams: allowParams
};

