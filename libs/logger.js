"use strict";


/**
 * @static {object}
 * @property {number} threshold *(default: 10)* sets a threshold on whether or not to log an event. debugLevel will be used instead if threshold is lower.
 * @property {number} debugLevel *(default: 0)* sets a threshold for when a log should be considered a debug log event.
 * @property {number} normalLevel *(default: 10)* sets a threshold for when a log should be considered a normal log event.
 * @property {number} warningLevel *(default: 20)* sets a threshold for when a log should be considered a warning.
 * @property {number} errorLevel *(default: 30)* sets a threshold for when a log should be considered a fatal error.
 * @property {function} loggerObject *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error()
 *
 */
AnyBoard.Logger = {
    threshold: 10,
    debugLevel: 0,
    normalLevel: 10,
    warningLevel: 20,
    errorLevel: 30,
    loggerObject: console,
    /**
     * logs if threshold <= level parameter
     * @param {level} level of severity
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    message: function(level, message, sender) {
        var messageFormat = 'AnyBoard: ' + message  + (sender ? ' (' + sender + ')' : '');
        if ((this.threshold <= level || this.errorLevel <= level) && this.debugLevel <= level) {
            if (level >= this.errorLevel)
                this.loggerObject.hasOwnProperty("error") && this.loggerObject.error(messageFormat);
            else if (level >= this.warningLevel)
                this.loggerObject.hasOwnProperty("warn") && this.loggerObject.warn(messageFormat);
            else if (level >= this.normalLevel)
                this.loggerObject.hasOwnProperty("log") && this.loggerObject.log(messageFormat);
            else
                this.loggerObject.hasOwnProperty("debug") && this.loggerObject.debug(messageFormat);
        }
    },
    /**
     * logs a warning. Ignored if threshold > this.warningLevel (default: 20)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    warn: function(message, sender) {
        this.message(this.warningLevel, message, sender)
    },
    /**
     * logs an error. Will never be ignored.
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    error: function(message, sender) {
        this.message(this.errorLevel, message, sender)
    },
    /**
     * logs a normal event. Ignored if threshold > this.normalLevel (default: 10)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    log: function(message, sender) {
        this.message(this.normalLevel, message, sender)
    },
    /**
     * logs debugging information. Ignored if threshold > this.debugLevel (default: 0)
     * @param {string} message event to be logged
     * @param {object} sender *(optional)* sender of the message
     */
    debug: function(message, sender) {
        this.message(this.debugLevel, message, sender)
    }
};
