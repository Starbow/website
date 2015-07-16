"use strict";

var Model;

var getModel = function(thinky){
  if (Model === undefined) {
    Model = thinky.createModel("DevExamples", {
      someText: thinky.type.string().default(null).min(1).required().allowNull(false)
    });
  }
  return Model;
};

module.exports = function(thinky){
  return getModel(thinky);
};
