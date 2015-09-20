var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

describe('AnyBoard.Dice', function() {
	var simpledice;
	var oneDice;
	var twoDice;

  describe('when initated without parameters', function () {
  	simpledice = new AnyBoard.Dice()
	it('is initiated "new AnyBoard.Dice()"', function () {
  		simpledice = new AnyBoard.Dice()
  	});
    it('has 1 dice', function () {
      assert.equal(1, simpledice.numOfDice)
    });
    it('that dice has 6 eyes', function () {
      assert.equal(6, simpledice.eyes)
    });
  });

  describe('when initated with one parameter', function () {
  	oneDice = new AnyBoard.Dice(10)
  	it('is initiated with e.g. "new AnyBoard.Dice(10)"', function () {
      oneDice = new AnyBoard.Dice(10)
    });
    it('have 1 dice', function () {
      assert.equal(1, oneDice.numOfDice)
    });
    it('that dice have equal amount of eyes as the parameter (10)', function () {
      assert.equal(10, oneDice.eyes)
    });
  });

  describe('when initated with two parameters', function () {
  	twoDice = new AnyBoard.Dice(12, 6)
  	it('is initiated with e.g. "new AnyBoard.Dice(12, 6)"', function () {
      twoDice = new AnyBoard.Dice(12, 6)
    });
    it('have the second parameter amount of dices (6)', function () {
      assert.equal(6, twoDice.numOfDice)
    });
    it('each dice has amount of eyes equal to the first parameter', function () {
      assert.equal(12, twoDice.eyes)
    });
  });

  describe('when rolled with .roll()', function () {
  	it('returns a number [amount of dices] <= x <= [amount of dices] times [eyes]', function () {
        for (var i = 0; i < 20; i++) {
            assert(twoDice.roll() >= twoDice.numOfDice);
            assert(oneDice.roll() >= oneDice.numOfDice);
            assert(simpledice.roll() >= simpledice.numOfDice);
            assert(simpledice.roll() <= simpledice.eyes*simpledice.numOfDice);
            assert(twoDice.roll() <= twoDice.eyes*twoDice.numOfDice);
            assert(oneDice.roll() <= oneDice.eyes*oneDice.numOfDice);
        }
    });
  });

    describe('when rolled with .rollEach()', function () {
        it('returns an array of results equal in length to number of dices', function () {
            var roll = twoDice.rollEach();
            assert.equal(twoDice.numOfDice, roll.length);
        });
        it('returns an array where each element is between 1 and number of eyes', function () {
            var roll = twoDice.rollEach();
            for (var i = 0; i < twoDice.numOfDice; i++) {
                assert(roll[i] >= 1);
                assert(roll[i] <= twoDice.eyes);
            }
        });

    });

});
