#!/bin/bash

if [ -z "$COUCH_HOST" ]; then echo "COUCH_HOST is required"; exit 1; fi
if [ -z "$ENVOY_DATABASE_NAME" ]; then 
  export ENVOY_DATABASE_NAME="envoydb"
fi

# deploy to OpenWhisk
wsk package update envoy --param COUCH_HOST $COUCH_HOST --param ENVOY_DATABASE_NAME $ENVOY_DATABASE_NAME

# create actions
cd actions
ls *.js | tr '\n' '\0' | xargs -0 -n1 ./deploy_action.sh
cd ..

# create API
wsk api create -n "Cloudant Envoy - $ENVOY_DATABASE_NAME" /envoy "/$ENVOY_DATABASE_NAME" get envoy/get_db --response-type json
wsk api create /envoy "/$ENVOY_DATABASE_NAME/_all_docs" get envoy/all_docs --response-type json
wsk api create /envoy "/$ENVOY_DATABASE_NAME/_changes" get envoy/changes --response-type json
wsk api create /envoy "/$ENVOY_DATABASE_NAME/_bulk_docs" get envoy/bulk_docs --response-type json
