#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mocha -R dot "$DIR/*/**/*Test.js";
