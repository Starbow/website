var morgan = require('morgan');
var fs = require('fs');

var logs = {},
  logsDirPath = process.env.ROOT + "/server/data/logs";

var Log = function(logConfig){
  this.getLogFormat = function() {
		return logConfig.format;
	},
	this.getLogOptions = function() {
		var options = {};
		try {
			if ('stream' in logConfig.options) {
				options = {
					stream: fs.createWriteStream(logsDirPath + '/' + logConfig.options.stream, {flags: 'a'})
				};
			}
		} catch (e) {
			options = {};
		}
		return options;
	}
};

module.exports = function(config){
  if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath, "0755");
  }
  for (var logName in config.log) {
    logs[logName] = new Log(config.log[logName]);
  }
  return logs;
};
