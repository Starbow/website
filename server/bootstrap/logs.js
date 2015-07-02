var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs');

var logsDirPath = process.env.ROOT + "/server/data/logs";

var getAccessLog = function(accessConfig){
  accessConfig.options.stream = fs.createWriteStream(logsDirPath + '/' + accessConfig.options.stream, {flags: 'a'});
  return morgan(accessConfig.format, accessConfig.options);
};

var getErrorLog = function(errorConfig){
  errorConfig.file.filename = logsDirPath + "/" + errorConfig.file.filename;
  return new winston.Logger({
      transports: [
        new winston.transports.Console(errorConfig.console),
        new winston.transports.File(errorConfig.file)
      ],
      exitOnError: false
  });
};

var getManualLog = function(manualConfig){
  manualConfig.file.filename = logsDirPath + "/" + manualConfig.file.filename;
  return new winston.Logger({
      transports: [
        new winston.transports.Console(manualConfig.console),
        new winston.transports.File(manualConfig.file)
      ],
      exitOnError: false
  });
};

module.exports = function(config){
  if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath, "0755");
  }
  return {
    access: getAccessLog(config.log.access),
    error: getErrorLog(config.log.error),
    manual: getManualLog(config.log.manual),
  };
};
