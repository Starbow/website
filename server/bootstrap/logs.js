var morgan = require('morgan');
var fs = require('fs');

var Log = function(logConfig){
  this.getLogFormat = function() {
		return logConfig.format;
	},
	this.getLogOptions = function() {
		var options = {};
		try {
			if ('stream' in logConfig.options) {
				options = {
					stream: fs.createWriteStream(process.cwd() + '/' + logConfig.options.stream, {flags: 'a'})
				};
			}
		} catch (e) {
			options = {};
		}
		return options;
	}
};

module.exports = function(config){
  for (var logName in config.log) {
    module.exports[logName] = new Log(config.log[logName]);
  }
};
