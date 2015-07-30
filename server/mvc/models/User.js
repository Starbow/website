"use strict";

var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");
var sprintf = require("sprintf-js").sprintf;
var Cryptr = require("cryptr");

var ThinkyUserModel = require("./User/UserMapper");

var User = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    this.__base(new ThinkyUserModel({}));
  },
  findByUserId: function(userId){
    return this.findByFilter({userId: userId});
  },
  findByEmail: function(email){
    return this.findByFilter({email: email});
  },
  findByEmailVerificationCode: function(emailVerificationCode){
    var self = this;
    return this.findByFilter(
      {emailVerificationCode: emailVerificationCode},
      {index: self.getThinky().r.desc("emailVerificationTime")}
    );
  },
  updateTimeLatestLogin: function(){
    this.document.timeLatestLogin = this.getThinky().r.now();
    return this;
  },
  },
  generateEmailVerificationCode: function(){
    this.guardIsValid();
    var salt = this.getConfig().user.email.verificationCodeSalt;
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
    var self = this;
    return new Promise(function(resolve, reject){
      var user = new User();
      user
        .findByUserId(userId)
        .then(function(){
          self.getLog().debug(sprintf("Updating existing user: [userId: %s]", userId));
        })
        .error(function(err){
          self.getLog().debug(sprintf("Creating new user: [userId: %s]", userId));
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
            self.getLog().debug("User saved successfully. Values:\n", user.getValues());
            return resolve();
          })
          .error(reject);
        });
    });
  }
  encryptOauthToken: function(token){
    this.guardIsString(token);
    var cryptr = new Cryptr(this.getConfig().auth.bnet.encryptionSalt);
    return cryptr.encrypt(token);
  },
  decryptOauthToken: function(encryptedToken){
    this.guardIsString(encryptedToken);
    var cryptr = new Cryptr(this.getConfig().auth.bnet.encryptionSalt);
    return cryptr.decrypt(encryptedToken);
  },
});

module.exports = User;
