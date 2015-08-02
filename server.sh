#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
if [[ "development" == "$NODE_ENV" ]]; then
  nodemon --delay 50 --watch "$DIR" "$DIR/server.js"
else
  node "$DIR/server.js"
fi
