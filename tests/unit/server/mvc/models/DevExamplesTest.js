var path = require("path");

var bogusConfig = {
    log: {
      access: {
        "a": "Just an Object with lots of data"
      }
    }
  },
  bogusThinkyConfig = {db: "bogus"},
  Models = {};

module.exports = {
  setUp: function(callback){
    Models.DevExamples = require(path.normalize(__dirname + "/../../../../../server/mvc/models/DevExamples.js"));
    var bogusThinky = require("thinky")(bogusThinkyConfig);
    Models.DevExamples.init(bogusConfig, bogusThinky);
    callback();
  },
  "Can 'whatIsOnePlusTwo' produce the correct result?": function(test){
    test.expect(1);
    var devExamples = new Models.DevExamples;
    test.strictEqual(devExamples.whatIsOnePlusTwo(), 3, "Should be 3");
    test.done();
  },
  "Will everything be alright?": function(test){
    test.expect(1);
    var devExamples = new Models.DevExamples;
    devExamples
      .promiseMeEverythingWillBeAlright()
      .then(function(isItAlright){
        test.ok(isItAlright, "Things should be fine");
      })
      .finally(function(){
        test.done();
      });
  },
  "Can config data be retrived?": function(test){
    test.expect(1);
    var devExamples = new Models.DevExamples;
    var expected = {
      "a": "Just an Object with lots of data"
    };
    test.deepEqual(devExamples.getAccessLogConfigData(), expected, "Should be identical");
    test.done();
  },
};
