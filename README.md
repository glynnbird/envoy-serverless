# envoy-serverless

A version of [Cloudant Envoy](https://github.com/cloudant-labs/envoy) that deploys to a IBM OpenWhisk - a serverless computing platform. Having Envoy run in a serverless environment has several advantages:

- you only pay for what you use
- the OpenWhisk API system handles authentication
- OpenWhisk handles the traffic scaling 

## Prerequisites

Clone this repository

    git clone https://github.com/glynnbird/envoy-serverless.git
    cd envoy-serverless

[Sign up for a Bluemix account](https://bluemix.net) and follow the [Getting Started with OpenWhisk guide](https://console.ng.bluemix.net/openwhisk/getting-started) to download the `wsk` tool and configure it for your Bluemix account.

In your Bluemix dashboard, create a Cloudant service and make a note of its URL. In the Cloudant dashboard, create a new empty database (say, 'envoydb').

## Installation

Create two environment variables containing your Cloudant URL and the database name:

    export COUCH_HOST="https://USERNAME:PASSWORD@HOST.cloudant.com"
    export ENVOY_DATABASE_NAME="envoydb"

and run the deployment script:

    ./deploy.sh

The URL of your service will look something like this:

    https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/YOURSERVICEID/envoy/envoydb

You can now visit the "API Management" section of your OpenWhisk dashboard:

- in the "Definition" tab, tick the box titled: "Require consuming applications to authenticate via API key"
- in the "Sharing" tab, create an API key

## Running    

You can test your service with `curl`:

    curl -H 'X-IBM-Client-ID: 0bd929c9-c8b7-43f7-856f-f2cbe33b9f50' \ 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/YOURSERVICEID/envoy/envoydb'
    { ... some json .... }

or from PouchDB:

```js
var PouchDB = require('pouchdb');
var url = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/YOURSERVICEID/envoy/envoydb';
var opts = {
  ajax: { 
    headers: { 
      'X-IBM-Client-ID': '60eaa0b0-0b84-4b02-abb1-726605890233'
    }
  }
};
var remotedb = new PouchDB(url, opts);

var envoydb = new PouchDB('envoydb')
envoydb.replicate.from(remotedb).on('change', function (info) {
  // handle change
  console.log('change', info)
}).on('paused', function (err) {
  console.log('paused', err)
}).on('active', function () {
  console.log('active')
}).on('denied', function (err) {
  console.log('denied', err)
}).on('complete', function (info) {
 console.log('complete', info)
}).on('error', function (err) {
  console.log('error', err);
});
```




