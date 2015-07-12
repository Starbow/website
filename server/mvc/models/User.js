var Class = require('jsclass/src/core').Class;
var DocumentModel = require("./DocumentModel");
var Promise = require("bluebird");
var Cryptr = require("cryptr");

var config, thinky, ThinkyModel;

module.exports = new Class(DocumentModel, {
  initialize: function(){
    this.callSuper(new ThinkyModel({}));
  },
  findByUserId: function(userId){
    return new Promise(function(resolve, reject){
      ThinkyModel
        .get(userId)
        .run()
        .then(function(doc){
          this.document = doc;
          return resolve();
        })
        .error(reject);
    });
  },
  save: function(){
    this.document.merge({"timeModified": thinky.r.now()});
    return this.callSuper(); // Returns a promise
  },
  updateTimeLatestLogin: function(){
    this.document.timeLatestLogin = thinky.r.now();
    return this;
  },
  encryptOauthToken: function(token){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  },
  decryptOauthToken: function(encryptedToken){
    var cryptr = new Cryptr(config.auth.bnet.encryptionSalt);
    return cryptr.decrypt(encryptedToken);
  }
});

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
  var type = thinky.type;
  ThinkyModel = thinky.createModel("users", {
    userId: type.number().integer().default(null).min(1).required().allowNull(false),
    oauthType: type.string().default(null).min(1).required().allowNull(false),
    oauthTokenEncrypted: type.string().default(null).min(1).required().allowNull(false),
    timeCreated: type.date().default(thinky.r.now()).required().allowNull(false),
    timeModified: type.date().default(thinky.r.now()).required().allowNull(false),
    timeLatestLogin: type.date().default(thinky.r.now()).required().allowNull(false),
  }, {
    "pk": "userId"
  });
  ThinkyModel.ensureIndex("timeCreated");
};
