
var checkCredentials = function(msg) {
  if (msg && msg.__ow_headers && msg.__ow_headers['x-ibm-client-id']) {
    return msg.__ow_headers['x-ibm-client-id'];
  } else {
    throw( new Error('Missing x-ibm-client-id - unknown user'));
  }
};

module.exports = {
  checkCredentials: checkCredentials
}