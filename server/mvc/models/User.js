var Class = require("node-class").class;
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

module.exports = Class("User", {
  extends: ["ThinkyDocumentModel"],
  initialize: function(){
    var ThinkyModel = getThinkyModel(this.getThinky());
    this.__parent(new ThinkyModel({}));
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
    this.document.merge({"timeModified": this.getThinky().r.now()});
    return this.__parent(); // Returns a promise
  },
  updateTimeLatestLogin: function(){
    this.document.timeLatestLogin = this.getThinky().r.now();
    return this;
  },
  encryptOauthToken: function(token){
    var cryptr = new Cryptr(this.getConfig().auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  },
  decryptOauthToken: function(encryptedToken){
    var cryptr = new Cryptr(this.getConfig().auth.bnet.encryptionSalt);
    return cryptr.decrypt(encryptedToken);
  }
});
