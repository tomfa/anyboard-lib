var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

describe('AnyBoard.TokenManager', function() {
    var spy = sinon.spy();
    var dummyDriver = new AnyBoard.Driver({
        name: 'dummyDriver',
        description: 'Not an actual driver, just for testing',
        dependencies: 'none', version: '1.0',
        sendBinary: function(data, win, fail) {
            AnyBoard.Logger.log('SIMULTE SEND: ' + data, this);
            if (data instanceof Uint8Array)
                win();
            else
                fail('wrong format');
        },
        sendSerial: function(data, win, fail) {
            AnyBoard.Logger.log('SIMULTE SEND: ' + data, this);
            win();
        },
        connect: function(id, win, fail) {
            AnyBoard.Logger.log('SIMULTE CONNECT: ' + data, this);
            win({'dummyDevice': 'OK'});
        },
        disconnect: function(id) {
            AnyBoard.Logger.log('SIMULTE DISCONNECT: ' + data, this);
            return true;
        },
        scan: function(win, fail, threshold) {
            if (threshold > 50) {
                setTimeout(function() {
                    win({address: '815-493-00', name: 'jellyHouse'});
                }, 50);
                if (threshold > 150) {
                    setTimeout(function () {
                        win({address: '123-456-78', name: 'jellyHouse'});
                    }, 150);
                    if (threshold > 320) {
                        setTimeout(function () {
                            fail('time to fail for some reason');
                        }, 320);
                        if (threshold > 500) {
                            setTimeout(function () {
                                win({address: 'testadress', name: 'jellyHouse'});
                            }, 500);
                        }
                    }
                }
            }

        }
    });
    AnyBoard.TokenManager.setBluetoothDriver(dummyDriver)

    describe('when calling AnyBoard.TokenManager.scan(win, fail, threshold)', function(){
        it.skip('it will call win(object) for every device responding', function () {

        });
        it.skip('it will call fail(object) for every failure', function () {

        });
        it.skip('it will stop search after [threshold] amount of milliseconds', function () {

        });

    });
    describe('when calling AnyBoard.TokenManager.connect(tokenID)', function(){
        describe('and token is not responding', function(){
            it.skip('will return false', function () {

            });
            it.skip('and leave no changed on own properties', function () {

            });
        });
        describe('and token is responding', function(){
            it.skip('will return true', function () {

            });
            it.skip('and add token to own this.connectedTokens', function () {

            });
        });
    });
    describe('when calling AnyBoard.TokenManager.get(tokenID)', function(){
        describe('and token with tokenID is discovered', function(){
            it.skip('will return token', function () {

            });
        });
        describe('and token with tokenID is connected', function(){
            it.skip('will return token', function () {

            });
        });
        describe('and no token with that tokenID is found', function(){
            it.skip('will return undefined', function () {

            });
        });
    });
});

describe('AnyBoard.BaseToken', function() {
    var spy = sinon.spy();

    describe('when adding a event listener using on(...)', function(){
        it.skip('will be triggered when an event with matching eventName is triggered', function () {

        });
        it.skip('will not be triggered unless name of event matches', function () {

        });
    });
    describe('when triggering events using trigger(...)', function() {

        it.skip('will call listeners added using on(...) with matching name', function () {

        });

        it.skip('will not call listeners added using on(...) with non-matching name', function () {

        });
    });

});

