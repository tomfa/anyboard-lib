var assert = require("assert")
var AnyBoard = require("./../dist/AnyBoard.js");
var sinon = require('sinon');

AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;

describe('AnyBoard.Logger', function() {
    var debugLogger = sinon.spy();
    var normalLogger = sinon.spy();
    var warnLogger = sinon.spy();
    var errorLogger = sinon.spy();
    var logger = {debug: debugLogger, log: normalLogger, warn: warnLogger, error: errorLogger};
    var message = "Cakes for everyone!";

    after(function(){ AnyBoard.Logger.loggerObject = console; });
    it('will by default log to built-in JavaScript console object', function () {
        assert.equal(console, AnyBoard.Logger.loggerObject)
    });
    it('can be replaced by other logging means', function () {
        AnyBoard.Logger.loggerObject = logger;
        assert.equal(logger, AnyBoard.Logger.loggerObject);
    });
    describe('when calling AnyBoard.logger.debug(message)', function(){
        it('will call debug(message) on loggerObject if threshold <= debugLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.debugLevel;
            AnyBoard.Logger.debug(message);
            assert(debugLogger.called)
        });
        it('will be ignored if threshold > debugLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.debugLevel+1;
            debugLogger.reset();
            AnyBoard.Logger.debug(message);
            assert(!debugLogger.called)
        });
    });
    describe('when calling AnyBoard.logger.log(message)', function(){
        it('will call log(message) on loggerObject if threshold <= normalLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.normalLevel;
            AnyBoard.Logger.log(message);
            assert(normalLogger.called)
        });
        it('will be ignored if threshold > normalLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.normalLevel+1;
            normalLogger.reset();
            AnyBoard.Logger.log(message);
            assert(!normalLogger.called)
        });
    });
    describe('when calling AnyBoard.logger.warn(message)', function(){
        it('will call warn(message) on loggerObject if threshold <= warningLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.warningLevel;
            AnyBoard.Logger.warn(message);
            assert(warnLogger.called)
        });
        it('will be ignored if threshold > warningLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.warningLevel+1;
            warnLogger.reset();
            AnyBoard.Logger.warn(message);
            assert(!warnLogger.called)
        });
    });
    describe('when calling AnyBoard.logger.error(message)', function(){
        it('will call error(message) on loggerObject if threshold <= errorLevel', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel;
            AnyBoard.Logger.error(message);
            assert(errorLogger.called)
        });
        it('cannot be ignored by threshold value', function () {
            AnyBoard.Logger.threshold = AnyBoard.Logger.errorLevel + 9999;
            errorLogger.reset();
            AnyBoard.Logger.error(message);
            assert(errorLogger.called)
        });
    });
});