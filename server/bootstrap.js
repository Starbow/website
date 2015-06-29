var fs = require('fs');
var path = require('path');

var env = {};
var envFile = __dirname + '/bootstrap/config/env/env.json';

env = fs.readFileSync(envFile, 'utf-8');
env = JSON.parse(env);
Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});
process.env.ROOT = path.normalize(__dirname + '/..');
