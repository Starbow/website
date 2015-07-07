var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs');

var logsDirPath = process.env.ROOT + "/server/data/logs";

if (!fs.existsSync(logsDirPath)) {
  fs.mkdirSync(logsDirPath, "0755");
}

var getMorganLog = function(subConfig){
  subConfig.options.stream = fs.createWriteStream(logsDirPath + '/' + subConfig.options.stream, {flags: 'a'});
  return morgan(subConfig.format, subConfig.options);
};

var getWinstonLog = function(subConfig){
  subConfig.file.filename = logsDirPath + "/" + subConfig.file.filename;
  return new winston.Logger({
      transports: [
        new winston.transports.Console(subConfig.console),
        new winston.transports.File(subConfig.file)
      ],
      exitOnError: false
  });
};

module.exports.init = function(config){
  module.exports.access = getMorganLog(config.log.access);
  module.exports.framework = getWinstonLog(config.log.framework);
  module.exports.mvc = getWinstonLog(config.log.mvc);
  delete module.exports.init; // Voodoo: The function deletes itself to prevent re-init
};
