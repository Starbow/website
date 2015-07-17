"use strict";

var Model;

var getModel = function(thinky){
  if (Model === undefined) {
    Model = thinky.createModel("RegionProfiles", {
      userProfileId: thinky.type.number().integer().default(null).min(1).required().allowNull(false),
      userId: thinky.type.number().integer().default(null).min(1).required().allowNull(false),
      region: thinky.type.string().default(null).min(1).required().allowNull(true).validator(function(homeRegion){
        return (
          homeRegion === null
          || (
            typeof(homeRegion) == "string"
            && (["us", "eu"].indexOf(homeRegion) > -1)
          )
        );
      }).schema(thinky.type.string()).required().allowNull(false),
      characterName: thinky.type.string().default(null).required().allowNull(true).validator(function(nickname){
        return (
          characterName === null
          || (
            typeof(characterName) == "string"
            && characterName.length >= 2
          )
        );
      }),
      profilePath: thinky.type.string().default(null).required().allowNull(true).validator(function(nickname){
        return (
          profilePath === null
          || (
            typeof(profilePath) == "string"
            && profilePath.length >= 12
          )
        );
      }),
      timeCreated: thinky.type.date().default(thinky.r.now()).required().allowNull(false),
      timeModified: thinky.type.date().default(thinky.r.now()).required().allowNull(false)
    }, {
      "pk": "userProfileId"
    });

    Model.ensureIndex("timeCreated");
    Model.pre("save", function(next){
      this.timeModified = thinky.r.now();
      next();
    });
  }
  return Model;
};

module.exports = function(thinky){
  return getModel(thinky);
};
