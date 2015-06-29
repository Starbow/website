var fs = require('fs');
var express = require('express');
var passport = require('passport');
var bootstrap = require(__dirname + '/server/bootstrap.js');

var app = express();
var PORT = process.env.PORT || 443;

var OAuthAccessToken;

// Bootstrap models
fs.readdirSync(__dirname + '/server/mvc/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/server/mvc/models/' + file);
});

// Bootstrap passport config
console.log("Configuring passport");
require(__dirname + '/server/bootstrap/passport.js')(passport);

// Bootstrap application settings
console.log("Configuring express");
require(__dirname + '/server/bootstrap/express.js')(app, passport);

// Bootstrap routes
console.log("Configuring routes");
require(__dirname + '/server/bootstrap/routes.js')(app, passport);

// Create an HTTPS service
var https = require('https');
var server = https.createServer({
  key: fs.readFileSync(__dirname + process.env.SSL_KEY),
  cert: fs.readFileSync(__dirname + process.env.SSL_CERTIFICATE)
}, app).listen(PORT, process.env.HOST);

// Fallback: HTTP service which redirects to HTTPS
var http = require('http');
http.createServer(function(req, res){
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80, process.env.HOST);

console.log('Secure server running at https://'+process.env.HOST+'/ (port: '+PORT+')');
