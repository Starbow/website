var Promise = require("bluebird");
var Cryptr = require("cryptr");

var config,
  thinky,
  r,
  ThinkyModel;

module.exports = function(){
  var self = this,
    document = new ThinkyModel({}),
    exists = false;

  this.findByUserId = function(userId){
    exists = false;
    return new Promise(function(resolve, reject){
      ThinkyModel
        .filter({"userId": userId})
        .orderBy(r.desc("timeCreated"))
        .limit(1)
        .run()
        .then(function(docs){
          if (Array.isArray(docs) && docs.length) {
            exists = true;
            document = docs[0];
          }
          return resolve();
        })
        .error(reject);
    });
  };
  this.save = function(){
    exists = false;
    return new Promise(function(resolve, reject){
      document.merge({"timeModified": r.now()});
      try {
        document.validate();
      } catch (e) {
        return reject(e);
      }
      document
        .save()
        .then(function(){
          exists = true;
          return resolve();
        })
        .error(reject);
    });
  };
  this.setValue = function(key, value){
    var obj = {};
    obj[key] = value;
    document.merge(obj);
    document.validate();
    return this;
  };
  this.setValues = function(obj){
    document.merge(obj);
    document.validate();
    return this;
  };
  this.getValue = function(key){
    var values = self.getValues();
    if (values.hasOwnProperty(key)) {
      return values[key];
    }
    return null;
  };
  this.getValues = function(){
    var clone = {};
    for (var i in document) {
      if (document.hasOwnProperty(i))
        clone[i] = document[i];
    }
    return clone;
  };
  this.isValid = function(){
    try {
      document.validate();
    } catch (e) {
      return false;
    }
    return true;
  };
  this.exists = function(){
    return exists;
  };
  this.updateTimeLatestLogin = function(){
    document.timeLatestLogin = r.now();
    return this;
  };
  this.encryptOauthToken = function(token, salt){
    var cryptr = new Cryptr(salt);
    return cryptr.encrypt(token);
  };
  this.decryptOauthToken = function(encryptedToken, salt){
    var cryptr = new Cryptr(salt);
    return cryptr.decrypt(encryptedToken);
  };
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
  r = thinky.r;
  var type = thinky.type;
  ThinkyModel = thinky.createModel("users", {
    userId: type.number().integer().default(null).min(1).required().allowNull(false),
    oauthType: type.string().default(null).min(1).required().allowNull(false),
    oauthTokenEncrypted: type.string().default(null).min(1).required().allowNull(false),
    timeCreated: type.date().default(r.now()).required().allowNull(false),
    timeModified: type.date().default(r.now()).required().allowNull(false),
    timeLatestLogin: type.date().default(r.now()).required().allowNull(false),
  });
  ThinkyModel.ensureIndex("timeCreated");
};
