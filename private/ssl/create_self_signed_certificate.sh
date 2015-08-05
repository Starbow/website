#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
openssl req -nodes -x509 -newkey rsa:2048 -keyout "$DIR/localhost.key" -out "$DIR/localhost.crt" -days 360
