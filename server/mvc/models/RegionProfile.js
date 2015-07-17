"use strict";

var log = require("../log");
var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");
var sprintf = require("sprintf-js").sprintf;
var Cryptr = require("cryptr");

var ThinkyRegionProfileModel = require("./User/RegionProfileMapper")(ThinkyDocumentModel.getThinky());

var RegionProfile = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    this.__base(new ThinkyRegionProfileModel({}));
  },
  findByUserProfileId: function(userProfileId){
    return this.findByFilter({userProfileId: userProfileId});
  },
  findByUserId: function(userId){
    return this.findByFilter({userId: userId}, 3);
  },
  findByUserIdAndRegion: function(userId, region) {
    return this.findByFilter({userId: userId, region: region})
  }
}, {
  createOrUpdate: function(userProfile, userId){
    return new Promise(function(resolve, reject){
      var regionProfile = new RegionProfile();
      regionProfile
        .findByUserIdAndRegion(userId, region)
        .then(function(){
          log.debug(sprintf("Updating existing region profile: [userId: %s, region: %s]", userId, region));
        })
        .error(function(err){
          log.debug(sprintf("Creating new region profile: [userId: %s, region: %s]", userId, region));
        })
        .finally(function(){
          regionProfile.setValues({
            userProfileId: userProfile.id,
            userId: userId,
            region: userProfile.region,
            characterName: userProfile.characterName,
            profilePath: userProfile.profilePath
          })
          .save()
          .then(function(){
            log.debug("User saved successfully. Values:\n", regionProfile.getValues());
            return resolve();
          })
          .error(reject);
        });
    });
  }
});

module.exports = RegionProfile;
