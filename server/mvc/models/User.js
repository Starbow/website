var AbstractDocumentModel = require("./AbstractDocumentModel");
var Promise = require("bluebird");
var Cryptr = require("cryptr");

var config,
  thinky,
  r,
  ThinkyModel;

module.exports = function(){
  var self = this,
    parent;

  this.findByUserId = function(userId){
    return new Promise(function(resolve, reject){
      ThinkyModel
        .get(userId)
        .run()
        .then(function(doc){
          parent.document = doc;
          return resolve();
        })
        .error(reject);
    });
  };
  this.save = function(){
    parent.document.merge({"timeModified": r.now()});
    return parent.save(); // Returns a promise
  };
  this.updateTimeLatestLogin = function(){
    parent.document.timeLatestLogin = r.now();
    return self;
  };
  this.encryptOauthToken = function(token){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  };
  this.decryptOauthToken = function(encryptedToken){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
    return cryptr.decrypt(encryptedToken);
  };

  parent = new AbstractDocumentModel(self, new ThinkyModel({}));
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
