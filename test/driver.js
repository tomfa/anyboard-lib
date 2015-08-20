var assert = require("assert");
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

var validDriverData = {
    'name': 'validDriver',
    'description': 'A driver suited for testing purposes',
    'date': '2015-08-01',
    'version': '0.0.1',
    'type': 'bluetooth',
    'compatibility': [{
        descriptor_uuid: '00002902-0000-1000-8000-00805f9b34fb',
        characteristic_uuid: 'a495ff11-c5b1-4b44-b512-1370f02d74de',
        service_uuid: 'a495ff10-c5b1-4b44-b512-1370f02d74de'
    }, 'dummyCompatibility']
};
var invalidDriverData = {
    'name': 'forgotDescriptionDriver',
    'date': '2015-08-01',
    'version': '0.0.2'
};

var driver;

describe('AnyBoard.Driver', function() {
    describe('when constructing with valid arguments', function () {
        driver = new AnyBoard.Driver(validDriverData);
        it('will return an instance of AnyBoard.Driver', function () {
            assert(driver instanceof AnyBoard.Driver);
        });
        it('can be found through AnyBoard.Drivers.get([name of driver])', function () {
            assert.equal(driver, AnyBoard.Drivers.get(validDriverData.name))
        });

    });

    describe('when attempting to find compatible drivers through AnyBoard.Drivers.getCompatibleDriver', function () {
        it('will return a instance of a AnyBoard.Driver if any matchining drivers exist', function () {
            assert.equal(driver, AnyBoard.Drivers.getCompatibleDriver('bluetooth', validDriverData.compatibility[0]));
            assert.equal(driver, AnyBoard.Drivers.getCompatibleDriver('bluetooth', validDriverData.compatibility[1]));
        });
        it('will return undefined if no matchining drivers exist', function () {
            assert.equal(undefined, AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'ThisIsNotAThing'));
        });
    });
    describe('when constructing with invalid arguments', function () {
        after(function(){ AnyBoard.Logger.loggerObject = console; });
        it('will call error() on AnyBoard.Logger', function () {
            var otherLogger = sinon.spy();
            var errorLogger = sinon.spy();
            AnyBoard.Logger.loggerObject = {debug: otherLogger, log: otherLogger, warn: otherLogger, error: errorLogger};
            var a = new AnyBoard.Driver(invalidDriverData);
            assert(errorLogger.called)
        });
        it('and not be found with AnyBoard.Drivers.get([name of driver])', function () {
            assert(typeof AnyBoard.Deck.get(invalidDriverData.name) === 'undefined')
        });
    });

});

