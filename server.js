var fs = require('fs');
var express = require('express');
var cluster = require('cluster');
var sprintf = require('sprintf-js').sprintf;

if (cluster.isMaster) {
  console.log("SERVER STARTED");
}

if (cluster.isMaster) {
  console.log(" - Initializing");
}
var config = require("./server/config/config")();

if (cluster.isMaster) {
  console.log(" - Ensuring 'server/data' directory exists");
}
var dataDirPath = process.env.ROOT + "/server/data";
if (!fs.existsSync(dataDirPath)) {
  fs.mkdirSync(dataDirPath);
}

if (cluster.isMaster) {
  console.log(" - Configuring logs");
}
var logs = require('./server/config/logs');
logs.init(config);

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  var workersMaxCount = cpuCount;
  if (typeof(process.env.WORKERS_MAX_COUNT) == "string" && process.env.WORKERS_MAX_COUNT.match(/^\d+$/)) {
    workersMaxCount = Math.min(cpuCount, Math.max(Math.floor(process.env.WORKERS_MAX_COUNT), 1));
  }
  logs.cluster.info(sprintf("Server: Starting up [Master pid: %s]", process.pid));
  logs.cluster.info(sprintf("Server: %s workers available. Start them up...", workersMaxCount));

  // Fork workers
  for (var i=0; i<workersMaxCount; i++) {
      cluster.fork();
  }
  cluster.on('online', function(worker){
    logs.cluster.info(sprintf("Server: Worker online: [id: %s] [pid: %s]", worker.id, worker.process.pid));
  });
  cluster.on('exit', function(deadWorker, code, signal){
    if (typeof(deadWorker.parent) == "object" && code != 0 && signal !== null) {
      if (deadWorker.parent.code == code && deadWorker.parent.signal == signal) {
        var msLimit = 500;
        if ((deadWorker.parent.time + msLimit) > (new Date()).getTime()) {
          logs.cluster.error(sprintf(
            "Server: Worker died: [id: %s] [pid: %s] [code: %s] [signal: %s]. "
            + "Will NOT start a new worker because the same error was caught twice within " + msLimit + "ms.",
            deadWorker.id, deadWorker.process.pid, code, signal
          ));
          return;
        }
      }
    }
    var worker = cluster.fork(); // Restart the worker
    worker.parent = {
      id: deadWorker.id,
      pid: deadWorker.process.pid,
      code: code,
      signal: signal,
      time: (new Date()).getTime()
    };
    logs.cluster.warn(sprintf(
      "Server: Worker died: [id: %s] [pid: %s] [code: %s] [signal: %s]. "
      + "Started new replacement worker: [id: %s] [pid: %s]",
      deadWorker.id, deadWorker.process.pid, code, signal, worker.id, worker.process.pid
    ));
  });
  process.on('exit', function() {
    logs.cluster.info("Server: Shutting down");
  });
} else {
  var bootstrap = require(__dirname + '/server/bootstrap.js');
  var app = express();
  bootstrap.startup(app, config, logs);

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
    logs.cluster.info(sprintf("Worker [id: %s][pid: %s]: Secure server running at https://%s/ (port: %s)",
      cluster.worker.id, cluster.worker.process.pid, process.env.HOST, process.env.PORT));
  });
}
