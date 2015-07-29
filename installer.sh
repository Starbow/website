#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo "Removing folder \"node_modules\""
sudo rm -r "$DIR/node_modules"
echo "Running: npm install"
sudo npm install
echo "Running: grunt compile"
sudo grunt compile
