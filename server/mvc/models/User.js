var Class = require('jsclass/src/core').Class;
var DocumentModel = require("./DocumentModel");
var Promise = require("bluebird");
var Cryptr = require("cryptr");

var config = DocumentModel.config()
  , thinky = DocumentModel.thinky();

var ThinkyModel = thinky.createModel("users", {
  userId: thinky.type.number().integer().default(null).min(1).required().allowNull(false),
  oauthType: thinky.type.string().default(null).min(1).required().allowNull(false),
  oauthTokenEncrypted: thinky.type.string().default(null).min(1).required().allowNull(false),
  timeCreated: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
  timeModified: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
  timeLatestLogin: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
}, {
  "pk": "userId"
});
ThinkyModel.ensureIndex("timeCreated");

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
