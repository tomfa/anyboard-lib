var assert = require("assert");
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

var validDriverData = {
    'name': 'validDriver',
    'description': 'A driver suited for testing purposes',
    'date': '2015-08-01',
    'version': '0.0.1'
};
var invalidDriverData = {
    'name': 'forgotDescriptionDriver',
    'date': '2015-08-01',
    'version': '0.0.2'
};

describe('AnyBoard.Driver', function() {
    describe('when constructing with valid arguments', function () {
        var driver = new AnyBoard.Driver(validDriverData);
        it('will return an instance of AnyBoard.Driver', function () {
            assert(driver instanceof AnyBoard.Driver);
        });
        it('can be found through AnyBoard.Drivers.get([name of driver])', function () {
            assert.equal(driver, AnyBoard.Drivers.get(validDriverData.name))
        });
    });
    describe('when constructing with invalid arguments', function () {
        after(function(){ AnyBoard.Logger.loggerObject = console; });
        it('will call error() on AnyBoard.Logger', function () {
            var otherLogger = sinon.spy();
            var errorLogger = sinon.spy();
            var logger = {debug: otherLogger, log: otherLogger, warn: otherLogger, error: errorLogger};
            AnyBoard.Logger.loggerObject = logger;
            var a = new AnyBoard.Driver(invalidDriverData);
            assert(errorLogger.called)

        });
        it('and not be found with AnyBoard.Drivers.get([name of driver])', function () {
            assert(typeof AnyBoard.Deck.get(invalidDriverData.name) === 'undefined')
        });
    });

});

