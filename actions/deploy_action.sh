#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

FILENAME=$1
ZIPFILENAME="$FILENAME.zip"
ACTIONNAME=`echo "$1" | sed s/\.js$//`

echo "deploy_action $FILENAME"

# create action
cp "$FILENAME" index.js
zip -r "$ZIPFILENAME" index.js ./lib/*.js
wsk action update "envoy/$ACTIONNAME" --kind nodejs:6 "$ZIPFILENAME" --web true
rm "$ZIPFILENAME"
rm index.js
exit 0
