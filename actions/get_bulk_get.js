
// returns ok if GET /db/_bulk_get is called. 
// This proves to the caller that the POST /db/_bulk_get call exists
function main() {
  var reply = {error: 'method_not_allowed', reason:'Only POST allowed'};
  return {
    body: new Buffer(JSON.stringify(reply) + '\n').toString('base64'), 
    statusCode: 405, 
    headers:{ 'Content-Type': 'application/json'}
  };
}

exports.main = main;