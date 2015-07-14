"use strict";

var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");
var Cryptr = require("cryptr");

var ThinkyModel;
var getThinkyModel = function(thinky){
  if (ThinkyModel === undefined) {
    ThinkyModel = thinky.createModel("users", {
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
  }
  return ThinkyModel;
};

module.exports = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    var ThinkyModel = getThinkyModel(ThinkyDocumentModel.getThinky());
    this.__base(new ThinkyModel({}));
  },
  findByUserId: function(userId){
    var self = this;
    return new Promise(function(resolve, reject){
      ThinkyModel
        .get(userId)
        .run()
        .then(function(doc){
          self.document = doc;
          return resolve();
        })
        .error(reject);
    });
  },
  save: function(){
    this.document.merge({"timeModified": ThinkyDocumentModel.getThinky().r.now()});
    return this.__base();
  },
  updateTimeLatestLogin: function(){
    this.document.timeLatestLogin = ThinkyDocumentModel.getThinky().r.now();
    return this;
  },
  encryptOauthToken: function(token){
    this.guardIsString(token);
    var cryptr = new Cryptr(ThinkyDocumentModel.getConfig().auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  },
  decryptOauthToken: function(encryptedToken){
    this.guardIsString(encryptedToken);
    var cryptr = new Cryptr(ThinkyDocumentModel.getConfig().auth.bnet.encryptionSalt);
    return cryptr.decrypt(encryptedToken);
  }
});
