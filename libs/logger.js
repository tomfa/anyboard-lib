/**
 * Static logger object that handles logging. Will log using hyper.log if hyper is present (when using Evothings).
 * Will then log all events, regardless of severity
 *
 * @static {object}
 * @property {number} threshold *(default: 10)* threshold on whether or not to log an event.
 *      Any message with level above or equal threshold will be logged
 * @property {number} debugLevel *(value: 0)* sets a threshold for when a log should be considered a debug log event.
 * @property {number} normalLevel *(value: 10)* sets a threshold for when a log should be considered a normal log event.
 * @property {number} warningLevel *(value: 20)* sets a threshold for when a log should be considered a warning.
 * @property {number} errorLevel *(value: 30)* sets a threshold for when a log should be considered a fatal error.
 * @property {object} loggerObject *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error()
 */
AnyBoard.Logger = {
    threshold: 10,
    debugLevel: 0,
    normalLevel: 10,
    warningLevel: 20,
    errorLevel: 30,
    loggerObject: console,

    /**
     * Internal method. Logs if threshold <= level parameter
     * @param {number} level of severity
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     * @private
     */
    _message: function(level, message, sender) {
        var messageFormat = 'AnyBoard (' + level + '): ' + message  + (sender ? ' (' + sender + ')' : '');
        if ((this.threshold <= level || this.errorLevel <= level) && this.debugLevel <= level) {
            if (level >= this.errorLevel)
                this.loggerObject.error && this.loggerObject.error(messageFormat);
            else if (level >= this.warningLevel)
                this.loggerObject.warn && this.loggerObject.warn(messageFormat);
            else if (level >= this.normalLevel)
                this.loggerObject.log && this.loggerObject.log(messageFormat);
            else
                this.loggerObject.debug && this.loggerObject.debug(messageFormat);
        }

        if (typeof hyper !== 'undefined') hyper.log(messageFormat);
    },

    /**
     * logs a warning. Ignored if threshold > this.warningLevel (default: 20)
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    warn: function(message, sender) {
        this._message(this.warningLevel, message, sender)
    },

    /**
     * logs an error. Will never be ignored.
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    error: function(message, sender) {
        this._message(this.errorLevel, message, sender)
    },

    /**
     * logs a normal event. Ignored if threshold > this.normalLevel (default: 10)
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    log: function(message, sender) {
        this._message(this.normalLevel, message, sender)
    },

    /**
     * logs debugging information. Ignored if threshold > this.debugLevel (default: 0)
     * @param {string} message event to be logged
     * @param {object} [sender] *(optional)* sender of the message
     */
    debug: function(message, sender) {
        this._message(this.debugLevel, message, sender)
    },

    /**
     * Sets threshold for logging
     * @param {number} severity a message has to have before being logged
     * @example
     * // By default, debug doesn't log
     * AnyBoard.debug("Hi")  // does not log
     * @example
     * // But you can lower the thresholdlevel
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.debugLevel)
     * AnyBoard.debug("I'm here afterall!")  // logs
     * @example
     * // Or increase it to avoid certain logging
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel)
     * AnyBoard.warn("The tardis has arrived!")  // does not log
     * @example
     * // But you can never avoid errors
     * AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel+1)
     * AnyBoard.error("The Doctor is dead!!")  // logs
     */
    setThreshold: function(severity) {
        this.threshold = severity;
    }
};