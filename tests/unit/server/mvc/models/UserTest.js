var path = require("path");

var bogusThinkyConfig = {db: "bogus"};
var Models = {};

module.exports = {
  setUp: function(callback){
    Models.User = require(path.normalize(__dirname + "/../../../../../server/mvc/models/User.js"));
    var bogusThinky = require("thinky")(bogusThinkyConfig);
    Models.User.init(bogusThinky);
    callback();
  },
  tearDown: function(callback){
    var bogusThinky = require("thinky")(bogusThinkyConfig);
    bogusThinky.r.table("users").delete().run().finally(callback);
  },
  "Can findByUserId": function(test) {
    test.expect(1);
    var user = new Models.User();
    user
      .findByUserId(1)
      .then(function(){
        test.equal(typeof(user.getValues()), "object", "Has bogus valus");
        test.done();
      })
      .error(function(err){
        test.done();
      });
  },
  "Found user is not valid and does not exist in database": function(test) {
    test.expect(2);
    var user = new Models.User();
    user
      .findByUserId(1)
      .then(function(){
        test.ok(!user.isValid(), "Should not be valid");
        test.ok(!user.exists(), "Should not exist");
        test.done();
      })
      .error(function(err){
        test.done();
      });
  },
  "Invalid user cannot be saved": function(test) {
    test.expect(2);
    var user = new Models.User();
    user
      .save()
      .then(function(){
        test.done();
      })
      .error(function(err){
        test.ok(!user.isValid(), "Should not be valid");
        test.ok(!user.exists(), "Should not exist");
        test.done();
      });
  },
  "Valid user can be saved": function(test) {
    test.expect(5);
    var user = new Models.User();
    user
      .setValues({
        userId: 1,
        oauthType: "bogus",
        oauthTokenEncrypted: "123bogus",
      })
      .save()
      .then(function(){
        test.ok(user.isValid(), "Should be valid");
        test.ok(user.exists(), "Should exist");
        test.strictEqual(user.getValue('userId'), 1, "Value: userId");
        test.strictEqual(user.getValue('oauthType'), "bogus", "Value: oauthType");
        test.strictEqual(user.getValue('oauthTokenEncrypted'), "123bogus", "Value: oauthType");
        test.done();
      })
      .error(function(err){
        test.done();
      });
  },
  "Oauth token is encrypted correctly": function(test){
    test.expect(1);
    var user = new Models.User();
    var encryptedToken = user.encryptOauthToken("my_little_oauth_token", "encryption_salt_123");
    test.strictEqual(encryptedToken, "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e");
    test.done();
  },
  "Encrypted Oauth token is decrypted correctly": function(test){
    test.expect(1);
    var user = new Models.User();
    var encryptedToken = "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e";
    var token = user.decryptOauthToken(encryptedToken, "encryption_salt_123");
    test.strictEqual(token, "my_little_oauth_token");
    test.done();
  },
};
