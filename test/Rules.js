var assert = require("assert");
var Rules = require("../lib/Rules");


describe("Rules", function() {
  it("populated multiple outcomes", function() {
    var config = {
      "Must be 21 or older": {
        //if all "tests" in the if statement match,
        if: {
          "person.age": {
            lessThan: 21
          }
        },
        //process all of the outcomes
        then: {
          "person.error": "Must be 21 or older",
          "errors[]": "person"
        }
      },
      "Must be employed": {
        //if all "tests" in the if statement match,
        if: {
          "company.isEmployed": false
        },
        //process all of the outcomes
        then: {
          "company.error": "Must be employed",
          "errors[]": "company"
        }
      }
    };
    var data = {
      person: {
        age: 20
      }
    };
    var rules = new Rules(config);
    var results = rules.run(data);
    assert.equal(results.person.error, "Must be 21 or older");
    assert.deepEqual(results.errors, ["person", "company"]);
  });

  it("populates multiple outcomes into an array when [] is added", function() {
    var config = {
      "Must be 21 or older": {
        if: {
          "person.age": { lessThan: 21}
        },
        then: {
          "errors[]": "Must be 21 or older"
        }
      },
      "Must be employed": {
        if: {
          "person.isCitizen": false
        },
        then: {
          "errors[]": "Must be a citizen"
        }
      }
    };
    var data = {
      person: {
        age: 20,
        isCitizen: false,
      }
    };
    var rules = new Rules(config);
    var results = rules.run(data);

    assert.deepEqual(results.errors, [
      "Must be 21 or older",
      "Must be a citizen"
    ]);
  });
});

describe("options", function() {
  it("stringNumbers: false prevents parsing of numbers", function() {
    var data = {age: "14"};

    var config = {
      "Younger than 16 can't drive": {
        if: {
          "age": { lessThan: 16}
        },
        then: {
          "canDrive": false
        }
      }
    };

    var rules = new Rules(config, {stringNumbers: false});
    var error;
    try {
      rules.run(data);
    } catch(e) {
      error = true;
    }

    assert(error);
  });

  it("rulesModifyData: false creates new object of rule outcomes", function() {
    var data = {age: 15};

    var config = {
      "Younger than 16 can't drive": {
        if: {
          "age": { lessThan: 16}
        },
        then: {
          "cantDrive": true
        }
      }
    };

    var rules = new Rules(config, {rulesModifyData: false});
    var results = rules.run(data);

    assert.equal(results.cantDrive, true);
    assert.equal(data.cantDrive, undefined);
  });

  it("rulesModifyData: true modifies data with outcomes", function() {
    var data = {age: 15};

    var config = {
      "Younger than 16 can't drive": {
        if: {
          "age": { lessThan: 16}
        },
        then: {
          "cantDrive": true
        }
      }
    };

    var rules = new Rules(config, {rulesModifyData: true});
    rules.run(data);

    assert.equal(data.cantDrive, true);
  });
});