var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    bogus: "cake"
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , ConfigModel = require(modelsPath + "/ConfigModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");

var ThinkyModel = bogusThinky.createModel("ThinkyDocumentModel", {
  foo: bogusThinky.type.string().default(null).min(1).required().allowNull(false),
  time: bogusThinky.type.date().default(bogusThinky.r.now()).required().allowNull(false),
});

describe("ThinkyDocumentModel", function(){
  before(function(done){
    var callback = function(){
      ConfigModel.init(bogusConfig);
      ThinkyDocumentModel.init(bogusThinky);
      done();
    };
    bogusThinky.r.tableList().run().then(function(tables){
      if (tables.indexOf("ThinkyDocumentModel") <= -1) {
        bogusThinky.r.tableCreate("ThinkyDocumentModel").run().then(function(){
          callback();
        });
      } else {
        callback();
      }
    });
  });
  after(function(done){
    bogusThinky.r.table("ThinkyDocumentModel").delete().run().then(function(){
      done();
    });
  });
  beforeEach(function(done){
    bogusThinky.r.table("ThinkyDocumentModel").delete().run().then(function(){
      done();
    });
  });

  it("Should inherit correctly", function(){
    var thinkyDocumentModel = new ThinkyDocumentModel;
    expect(thinkyDocumentModel).to.be.an.instanceOf(ConfigModel);
    expect(thinkyDocumentModel).to.be.an.instanceOf(ThinkyDocumentModel);
  });
  describe("getThinky()", function(){
    it("Should return input thinky", function(){
      assert.typeOf(ThinkyDocumentModel.getThinky(), "object");
      assert.deepEqual(ThinkyDocumentModel.getThinky(), bogusThinky);
    });
  });
  describe("Saving", function(){
    describe("save()", function(){
      it("Should not save an invalid document", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(undefined);
        thinkyDocumentModel
          .save()
          .error(function(err){
            expect(err).to.be.an.instanceOf(TypeError);
            assert.equal(err.toString(), "TypeError: Cannot read property 'validate' of undefined");
            done();
          });
      });
      it("Should be able to save an valid document", function(done){
        var ThinkyModel = bogusThinky.createModel("ThinkyDocumentModel_807ade1f", {});
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .save()
          .then(done);
      });
    });
  });
  describe("Finding", function(){
    describe("find()", function(){
      it("Will reject promise when no document is found", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .find("1")
          .error(function(err){
            assert.typeOf(err, "object");
            expect(err.toString()).to.contain("Document not found: The query did not find a document and returned null in");
            done();
          });
      });
      it("Will successfully find a valid document", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .setValue("foo", "abc")
          .save()
          .then(function(){
            var id = thinkyDocumentModel.document.id;
            var subThinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
            subThinkyDocumentModel
              .find(id)
              .then(function(){
                done();
              });
          });
      });
    });
    describe("findByFilter()", function(){
      it("Will reject promise when no document is found", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .findByFilter({foo: "abc"})
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document not found");
            done();
          });
      });
      it("Will successfully find a valid document", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .setValue("foo", "abc")
          .save()
          .then(function(){
            var id = thinkyDocumentModel.document.id;
            var subThinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
            subThinkyDocumentModel
              .findByFilter({foo: "abc"})
              .then(function(){
                done();
              });
          });
      });
    });
  });
  describe("Values", function(){
    describe("setValue()", function(){
      it("Can set value", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValue("foo", "abc");
        assert.equal(thinkyDocumentModel.document.foo, "abc");
      });
    });
    describe("setValues()", function(){
      it("Must receive a key-value paired Object", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        var notAnObject = "foo";
        assert.throws(function(){
          thinkyDocumentModel.setValues(notAnObject);
        }, Error, /Parameter is not an Object/);
      });
      it("Can set multiple values", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValues({"foo": "abc"});
        assert.equal(thinkyDocumentModel.document.foo, "abc");
      });
    });
    describe("getValue()", function(){
      it("Will return undefined when key doesn't exist", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.equal(thinkyDocumentModel.getValue("bar"), undefined);
      });
      it("Will return the default value, null, when 'foo' hasn't been specified", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.equal(thinkyDocumentModel.getValue("foo"), null);
      });
      it("Must receive a valid key", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValue("foo", "abc");
        assert.equal(thinkyDocumentModel.getValue("foo"), "abc");
      });
    });
    describe("getValues()", function(){
      it("Will return a cloned Object", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        var values = thinkyDocumentModel.getValues();
        assert.typeOf(values, "object");
        assert.strictEqual(values.foo, null);
        assert.typeOf(values.time, "function");
        assert.notStrictEqual(values, thinkyDocumentModel.document, "It's a cloned Object; not the 'document' Object itself");
      });
    });
  });
  describe("Validators", function(){
    describe("existsInDatabase()", function(){
      it("Will return false when document has not been saved or fetched", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        expect(thinkyDocumentModel.existsInDatabase()).to.be.false;
      });
      it("Will return false when document is invalid", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .find(null)
          .error(function(){
            expect(thinkyDocumentModel.existsInDatabase()).to.be.false;
            done();
          });
      });
      it("Will return true when document has been saved", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .setValue("foo", "abc")
          .save()
          .then(function(){
            assert.ok(thinkyDocumentModel.existsInDatabase());
            done();
          });
      });
      it("Will return true when document has been found", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .setValue("foo", "abc")
          .save()
          .then(function(){
            var id = thinkyDocumentModel.getValue("id");
            thinkyDocumentModel
              .find(id)
              .then(function(){
                assert.ok(thinkyDocumentModel.existsInDatabase());
                done();
              });
          });
      });
    });
    describe("isValid()", function(){
      it("Is not valid when document has not been modified", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        expect(thinkyDocumentModel.isValid()).to.be.false;
      });
      it("Is valid when document has been modified with correct key-value pairs", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValue("foo", "abc");
        assert.ok(thinkyDocumentModel.isValid());
      });
    });
  });
  describe("Guards", function(){
    describe("guardExistsInDatabase()", function(){
      it("Fails when document does not exist in database", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.throw(function(){thinkyDocumentModel.guardExistsInDatabase()}, Error);
      });
      it("Succeeds when document does exist in database", function(done){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel
          .setValue("foo", "abc")
          .save()
          .then(function(){
            assert.deepEqual(thinkyDocumentModel.guardExistsInDatabase(), thinkyDocumentModel);
            done();
          });
      });
    });
    describe("guardIsValid()", function(){
      it("Fails when document is not valid", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.throw(function(){thinkyDocumentModel.guardIsValid()}, Error);
      });
      it("Succeeds when document is valid", function(){
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValue("foo", "abc");
        assert.deepEqual(thinkyDocumentModel.guardIsValid(), thinkyDocumentModel);
      });
    });
  });
});
