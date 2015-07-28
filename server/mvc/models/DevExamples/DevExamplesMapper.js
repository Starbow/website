"use strict";

var ThinkyDocumentModel = require("../ThinkyDocumentModel");

var thinky = ThinkyDocumentModel.getThinky();

var Model = thinky.createModel("DevExamples", {
  someText: thinky.type.string().default(null).min(1).required().allowNull(false)
});

module.exports = Model;
