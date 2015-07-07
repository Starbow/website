var fs = require('fs');
var express = require('express');
var bootstrap = require(__dirname + '/server/bootstrap.js');

var app = express();
bootstrap.startup(app);

// Create an HTTPS service
var https = require('https');
var server = https.createServer({
  key: fs.readFileSync(__dirname + process.env.SSL_KEY),
  cert: fs.readFileSync(__dirname + process.env.SSL_CERTIFICATE)
}, app).listen(process.env.PORT, process.env.HOST);

// Fallback: HTTP service which redirects to HTTPS
var http = require('http');
http.createServer(function(req, res){
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80, process.env.HOST);

bootstrap.onReady(function(){
  console.log('Secure server running at https://'+process.env.HOST+'/ (port: '+process.env.PORT+')');
});
