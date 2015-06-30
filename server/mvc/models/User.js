var Promise = require("bluebird");
var Cryptr = require("cryptr");

var thinky, r;
var ThinkyUserModel;

Models.User = function(){
  var self = this,
    document = new ThinkyUserModel({}),
    cryptr = null,
    exists = false;

  this.findByUserId = function(userId){
    exists = false;
    return new Promise(function(resolve, reject){
      ThinkyUserModel
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
  this.encryptOauthToken = function(token){
    return self.getCryptr().encrypt(token);
  };
  this.decryptOauthToken = function(encryptedToken){
    return self.getCryptr().decrypt(encryptedToken);
  };
  this.getCryptr = function(){
    if (cryptr === null) {
      cryptr = new Cryptr(process.env.BNET_OAUTH_TOKEN_ENCRYPTION_SALT);
    }
    return cryptr;
  };
};

module.exports = function(dbConfig) {
  thinky = require("thinky")(dbConfig);
  r = thinky.r;
  var type = thinky.type;
  ThinkyUserModel = thinky.createModel("users", {
    userId: type.number().integer().default(null).min(1).required().allowNull(false),
    oauthType: type.string().default(null).min(1).required().allowNull(false),
    oauthTokenEncrypted: type.string().default(null).min(1).required().allowNull(false),
    timeCreated: type.date().default(r.now()).required().allowNull(false),
    timeModified: type.date().default(r.now()).required().allowNull(false),
    timeLatestLogin: type.date().default(r.now()).required().allowNull(false),
  });
  ThinkyUserModel.ensureIndex("timeCreated");
};
