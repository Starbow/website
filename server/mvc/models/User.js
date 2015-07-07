var Promise = require("bluebird");
var Cryptr = require("cryptr");

var config,
  thinky,
  r,
  ThinkyModel;

module.exports = function(){
  var self = this,
    document = new ThinkyModel({});

  this.findByUserId = function(userId){
    return new Promise(function(resolve, reject){
      ThinkyModel
        .get(userId)
        .run()
        .then(function(doc){
          document = doc;
          return resolve();
        })
        .error(reject);
    });
  };
  this.save = function(){
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
  this.existsInDatabase = function(){
    return document.isSaved();
  };
  this.updateTimeLatestLogin = function(){
    document.timeLatestLogin = r.now();
    return this;
  };
  this.encryptOauthToken = function(token){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  };
  this.decryptOauthToken = function(encryptedToken){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
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
  }, {
    "pk": "userId"
  });
  ThinkyModel.ensureIndex("timeCreated");
};
