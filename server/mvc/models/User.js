"use strict";

var log = require(process.env.ROOT + '/server/mvc/log');
var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");
var sprintf = require("sprintf-js").sprintf;
var Cryptr = require("cryptr");
var sprintf = require("sprintf-js").sprintf;
var emailValidator = require("email-validator");

var thinky = ThinkyDocumentModel.getThinky();
var ThinkyModel = thinky.createModel("Users", {
  userId: thinky.type.number().integer().default(null).min(1).required().allowNull(false),
  nickname: thinky.type.string().default(null).min(1).required().allowNull(true).validator(function(nickname){
    return (
      nickname === null
      || (
        typeof(nickname) == "string"
        && nickname.length >= 2
      )
    );
  }),
  email: thinky.type.string().default(null).min(5).required().allowNull(true).validator(function(email){
    return (
      email === null
      || emailValidator.validate(email)
    );
  }),
  emailVerificationCode: thinky.type.string().default(null).min(1).required().allowNull(true),
  emailVerificationTime: thinky.type.date().default(null).required().allowNull(true),
  oauthType: thinky.type.string().default(null).min(1).required().allowNull(false),
  oauthTokenEncrypted: thinky.type.string().default(null).min(1).required().allowNull(false),
  timeCreated: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
  timeModified: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
  timeLatestLogin: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
  homeRegion: thinky.type.string().default(null).min(1).required().allowNull(true).validator(function(homeRegion){
    return (
      homeRegion === null
      || (
        typeof(homeRegion) == "string"
        && (["us", "eu"].indexOf(homeRegion) > -1)
      )
    );
  }),
  roles: thinky.type.array().default(function(){
    return ["user"];
  }).schema(thinky.type.string()).required().allowNull(false)
}, {
  "pk": "userId"
});
ThinkyModel.ensureIndex("timeCreated");
ThinkyModel.ensureIndex("emailVerificationTime");
ThinkyModel.pre("save", function(next){
  this.timeModified = ThinkyDocumentModel.getThinky().r.now();
  next();
});

var User = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    this.__base(new ThinkyModel({}));
  },
  findByUserId: function(userId){
    return this.findByFilter({userId: userId});
  },
  findByEmail: function(email){
    return this.findByFilter({email: email});
  },
  findByEmailVerificationCode: function(emailVerificationCode){
    return this.findByFilter(
      {emailVerificationCode: emailVerificationCode},
      {index: thinky.r.desc("emailVerificationTime")}
    );
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
  },
  generateEmailVerificationCode: function(){
    this.guardIsValid();
    var salt = ThinkyDocumentModel.getConfig().user.email.verificationCodeSalt;
    var userIdZeroPadded = sprintf("%016f", this.document.userId);
    var cryptr = new Cryptr(salt);
    return cryptr.encrypt(userIdZeroPadded);
  },
  validateEmailVerificationCode: function(verificationCode){
    return (verificationCode === this.generateEmailVerificationCode());
  },
  hasHomeRegion: function(){
    return (
      this.validateIsString(this.document.homeRegion)
      && this.document.homeRegion.length
    );
  },
  hasNickname: function(){
    return (
      this.validateIsString(this.document.nickname)
      && this.document.nickname.length
    );
  },
  isEmailVerified: function(){
    this.guardExistsInDatabase();
    return (
      (this.document.emailVerificationTime instanceof Date)
      && this.document.emailVerificationTime.getTime() > 0
    );
  },
  isRegistrationComplete: function(){
    this.guardExistsInDatabase();
    return (
      this.hasHomeRegion()
      && this.hasNickname()
      && this.isEmailVerified()
    );
  },
  isAdmin: function(){
    this.guardExistsInDatabase();
    return (this.document.roles.indexOf("admin") > -1);
  },
}, {
  createOrUpdate: function(userId, accessToken, oauthType){
    return new Promise(function(resolve, reject){
      var user = new User();
      user
        .findByUserId(userId)
        .then(function(){
          log.debug(sprintf("Updating existing user: [userId: %s]", userId));
        })
        .error(function(err){
          log.debug(sprintf("Creating new user: [userId: %s]", userId));
        })
        .finally(function(){
          user.setValues({
              oauthTokenEncrypted: user.encryptOauthToken(accessToken),
              oauthType: oauthType,
              userId: userId
          })
          .updateTimeLatestLogin()
          .save()
          .then(function(){
            log.debug("User saved successfully. Values:\n", user.getValues());
            return resolve();
          })
          .error(reject);
        });
    });
  }
});

module.exports = User;
