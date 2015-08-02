var assert = require("assert");
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');
var _ = require('underscore');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

describe('AnyBoard.Timer', function() {
    describe('when constructed', function () {
    });
    describe('when function are added to after(time, function)', function() {
        it.skip('they are invoked a set amount of time after the start() function is called', function () {
        });
    });
});

