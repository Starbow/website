"use strict";

var ThinkyDocumentModel = require("../ThinkyDocumentModel");
var EmailValidator = require("email-validator");

var thinky = ThinkyDocumentModel.getThinky();

var Model = thinky.createModel("Users", {
  userId: thinky.type.number().integer().default(null).min(1).required().allowNull(false),
  battletag: thinky.type.string().default(null).min(1).required().allowNull(false),
  nickname: thinky.type.string().default(null).required().allowNull(true).validator(function(nickname){
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
      || EmailValidator.validate(email)
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


Model.ensureIndex("timeCreated");
Model.ensureIndex("emailVerificationTime");
Model.pre("save", function(next){
  this.timeModified = thinky.r.now();
  next();
});


module.exports = Model;
