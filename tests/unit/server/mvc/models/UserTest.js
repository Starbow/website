var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    auth: {
      bnet: {
        encryptionSalt: "encryption_salt_123"
      }
    },
    user: {
      email: {
        verificationCodeSalt: "7551d612f86269214fd94c498a47e4bf"
      }
    }
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , ConfigModel = require(modelsPath + "/ConfigModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel")
  , User;

describe("User", function(){
  before(function(done){
    var callback = function(){
      ConfigModel.init(bogusConfig);
      ThinkyDocumentModel.init(bogusThinky);
      done();
    };
    bogusThinky.r.tableList().run().then(function(tables){
      if (tables.indexOf("Users") <= -1) {
        bogusThinky.r.tableCreate("Users").run().then(function(){
          callback();
        });
      } else {
        callback();
      }
    });
  });
  after(function(done){
    bogusThinky.r.table("Users").delete().run().then(function(){
      done();
    });
  });
  beforeEach(function(done){
    bogusThinky.r.table("Users").delete().run().then(function(){
      User = require(modelsPath + "/User");
      done();
    });
  });

  describe("Saving", function(){
    describe("save()", function(){
      it("Should not be able to save invalid user", function(done){
        var user = new User();
        user
          .save()
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document failed validation");
            assert.ok(!user.validateIsValid());
            assert.ok(!user.validateExistsInDatabase());
            done();
          });
      });
      it("Should not be able to save when email is invalid", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus"
          });
        user.document.email = "bogus"; // Hard-overriding the email value
        user
          .save()
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document failed validation: Validator for the field [email] returned `false`.");
            assert.ok(!user.validateIsValid());
            assert.ok(!user.validateExistsInDatabase());
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
            assert.ok(user.validateIsValid());
            assert.ok(user.validateExistsInDatabase());
            assert.strictEqual(user.getValue('userId'), 1);
            assert.strictEqual(user.getValue('oauthType'), "bogus");
            assert.strictEqual(user.getValue('oauthTokenEncrypted'), "123bogus");
            expect(user.getValue('timeModified')).to.be.an.instanceOf(Date);
            done();
          });
      });
    });
  });
  describe("Finding", function(){
    describe("findByUserId()", function(){
      it("Should not be able to find a non-existant user", function(done){
        var user = new User();
        user
          .findByUserId(1)
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document not found");
            assert.ok(!user.validateIsValid());
            assert.ok(!user.validateExistsInDatabase());
            assert.typeOf(user.getValues(), "object", "Object should contain default values");
            done();
          });
      });
      it("Should be able to find an existing user", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus",
          })
          .save()
          .then(function(){
            var subUser = new User();
            subUser
              .findByUserId(1)
              .then(function(){
                done();
              })
              .error(function(err){
                console.log("err", err)
              });
          });
      });
    });
  });
  describe("encryptOauthToken()", function(){
    it("Throws 'TypeError' when parameter is not a String", function(){
      var user = new User();
      assert.throw(function(){user.encryptOauthToken(undefined)}, TypeError);
    });
    it("Can encrypt oauth token correctly", function(){
      var user = new User();
      var encryptedToken = user.encryptOauthToken("my_little_oauth_token");
      assert.strictEqual(encryptedToken, "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e");
    });
  });
  describe("decryptOauthToken()", function(){
    it("Throws 'TypeError' when parameter is not a String", function(){
      var user = new User();
      assert.throw(function(){user.decryptOauthToken(undefined)}, TypeError);
    });
    it("Can decrypt oauth token correctly", function(){
      var user = new User();
      var encryptedToken = "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e";
      var token = user.decryptOauthToken(encryptedToken);
      assert.strictEqual(token, "my_little_oauth_token");
    });
  });
  describe("generateEmailVerificationCode()", function(){
    it("Will fail if user does not exist in database", function(){
      var user = new User();
      assert.throw(function(){user.generateEmailVerificationCode()}, Error);
    });
    it("Will generate a unique verification code", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
        })
        .save()
        .then(function(){
          var expected = "646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61";
          assert.strictEqual(user.generateEmailVerificationCode(), expected);
          done();
        });
    });
  });
  describe("validateEmailVerificationCode()", function(){
    it("Will fail if user does not exist in database", function(){
      var user = new User();
      assert.throw(function(){user.validateEmailVerificationCode("123")}, Error);
    });
    it("Will validate input code against a generated verification code", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
        })
        .save()
        .then(function(){
          assert.ok(user.validateEmailVerificationCode("646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61"));
          assert.ok(!user.validateEmailVerificationCode("_646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61"));
          done();
        });
    });
  });
  describe("validateEmailAddress()", function(){
    it("Will validate address patterns correctly", function(){
      var user = new User();
      assert.ok(user.validateEmailAddress("a@b.c"));
      assert.ok(user.validateEmailAddress("uSeR@example.co.uk"));
      assert.ok(!user.validateEmailAddress(null));
      assert.ok(!user.validateEmailAddress("a @b.c"));
    });
  });
  describe("isEmailValid()", function(){
    it("Will fail if user is not valid", function(){
      var user = new User();
      assert.throw(function(){user.isEmailValid()}, Error);
    });
    it("Will correctly validate a valid email address", function(){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
        });
      assert.ok(!user.isEmailValid());
      user.setValue("email", "user@email.com");
      assert.ok(user.isEmailValid());
    });
  });
});
