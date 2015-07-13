var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    auth: {
      bnet: {
        encryptionSalt: "encryption_salt_123"
      }
    }
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , ConfigModel = require(modelsPath + "/ConfigModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel")
  , User;

describe("User", function(){
  before(function(){
    bogusThinky.r.tableDrop("users");
    bogusThinky.r.tableCreate("users");
  });
  after(function(){
    bogusThinky.r.tableDrop("users");
  });
  beforeEach(function(){
    ConfigModel.init(bogusConfig);
    ThinkyDocumentModel.init(bogusThinky);
    User = require(modelsPath + "/User");
  });
  afterEach(function(done){
    bogusThinky.r.table("users").delete().run().finally(done);
  });
  it("Should not be able to find a non-existant user", function(done){
    var user = new User();
    user
      .findByUserId(1)
      .error(function(err){
        assert.ok(!user.isValid(), "Should not be valid");
        assert.ok(!user.existsInDatabase(), "Should not exist in database");
        assert.typeOf(user.getValues(), "object", "Object should contain default values");
        done();
      });
  });
  it("Should not be able to save invalid user", function(done){
    var user = new User();
    user
      .save()
      .error(function(err){
        assert.ok(!user.isValid(), "Should not be valid");
        assert.ok(!user.existsInDatabase(), "Should not exist");
        done();
      });
  });
  it("Can save a valid user", function(done){
    var user = new User();
    user
      .setValues({
        userId: 1,
        oauthType: "bogus",
        oauthTokenEncrypted: "123bogus",
      })
      .save()
      .then(function(){
        assert.ok(user.isValid(), "Should be valid");
        assert.ok(user.existsInDatabase(), "Should exist");
        assert.strictEqual(user.getValue('userId'), 1, "Value: userId");
        assert.strictEqual(user.getValue('oauthType'), "bogus", "Value: oauthType");
        assert.strictEqual(user.getValue('oauthTokenEncrypted'), "123bogus", "Value: oauthType");
        done();
      });
  });
  it("Can encrypt oauth token correctly", function(){
    var user = new User();
    var encryptedToken = user.encryptOauthToken("my_little_oauth_token");
    assert.strictEqual(encryptedToken, "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e");
  });
  it("Can decrypt oauth token correctly", function(){
    var user = new User();
    var encryptedToken = "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e";
    var token = user.decryptOauthToken(encryptedToken);
    assert.strictEqual(token, "my_little_oauth_token");
  });
});
