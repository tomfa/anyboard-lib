/**
 * A token manager.
 * @static
 * @property {object} tokens dictionary of connect tokens that maps id to object
 * @property {AnyBoard.Driver} driver driver for comm. Set with setDriver(driver);
 */
AnyBoard.TokenManager = {
    tokens: {},
    driver: null
};

/**
 * Sets a new default driver to handle communication for tokens without specified driver
 * @param {AnyBoard.Driver} driver driver to be used for communication
 */
AnyBoard.TokenManager.setDriver = function(driver) {
    // Check that functions exists on driver
    (driver.connect && typeof driver.connect === 'function') || AnyBoard.Logger.warn('Could not find connect() on given driver.', this);
    (driver.disconnect && typeof driver.disconnect === 'function') || AnyBoard.Logger.warn('Could not find disconnect() on given driver', this);
    (driver.scan && typeof driver.scan === 'function') || AnyBoard.Logger.warn('Could not find scan() on given driver', this);
    (driver.send && typeof driver.send === 'function') || AnyBoard.Logger.warn('Could not find send() on given driver', this);

    if ((!this.driver) || (driver.connect && typeof driver.connect === 'function' &&
        driver.disconnect && typeof driver.disconnect === 'function' &&
        driver.scan && typeof driver.scan === 'function' &&
        driver.send && typeof driver.send === 'function'))

        this.driver = driver;
};

/**
 * Scans for tokens nearby and stores in discoveredTokens property
 * @param {function} win function to be executed when devices are found (called for each device found)
 * @param {function} fail function to be executed upon failure
 * @param {number} timeout amount of milliseconds to scan before stopping
 */
AnyBoard.TokenManager.scan = function(win, fail, timeout) {
    this.driver.scan(
        function(token) {
            AnyBoard.TokenManager.tokens[token.address] = token;
            win(token);
        },
        fail, timeout)
};

/**
 * Returns a token handled by this TokenManager
 * @param {string} address identifer of the token found when scanned
 * @returns {AnyBoard.BaseToken} token if handled by this tokenManager, else undefined
 */
AnyBoard.TokenManager.get = function(address) {
    return this.tokens[address];
};

/**
 * Base class for tokens. Should be used by communication driver upon AnyBoard.TokenManager.scan()
 * @param {string} name name of the token
 * @param {string} address address of the token found when scanned
 * @param {object} device device object used and handled by driver
 * @param {AnyBoard.Driver} [driver=AnyBoard.TokenManager.driver] token driver for handling communication with it.
 * @property {string} name name of the token
 * @property {string} address address of the token found when scanned
 * @property {boolean} connected whether or not the token is connected
 * @property {object} device driver spesific data.
 * @property {object} listeners functions to be execute upon certain triggered events
 * @property {object} onceListeners functions to be execute upon next triggering of certain events
 * @property {object} sendQueue sending to Pawn is being held here until available
 * @property {AnyBoard.Driver} driver driver that handles communication
 * @constructor
 */
AnyBoard.BaseToken = function(name, address, device, driver) {
    this.name = name;
    this.address = address;
    this.connected = false;
    this.device = device;
    this.listeners = {};
    this.onceListeners = {};
    this.sendQueue = [];
    this.driver = driver;
};

/**
 * Returns whether or not the token is connected
 * @returns {boolean} true if connected, else false
 */
AnyBoard.BaseToken.prototype.isConnected = function() {
    return this.connected;
};

/**
 * Attempts to connect to token.
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 * @returns {boolean} whether or not token is connected
 */
AnyBoard.BaseToken.prototype.connect = function(win, fail) {
    AnyBoard.Logger.debug('Attempting to connect to ' + this);
    var pointer = this.driver || AnyBoard.TokenManager.driver;
    var self = this;
    pointer.connect(
        self,
        function(device) {
            AnyBoard.Logger.debug('Connected to ' + self);
            self.connected = true;
            self.trigger('connect', {device: self});
            win(device);
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to ' + self + '. ' + errorCode);
            self.trigger('disconnect', {device: self});
            self.connected = false;
            fail(errorCode);
        }
    );
};

/**
 * Disconnects from the token.
 */
AnyBoard.BaseToken.prototype.disconnect = function() {
    var pointer = this.driver || AnyBoard.TokenManager.driver;
    pointer.disconnect(this);
    AnyBoard.Logger.debug('' + this + ' disconnected', this);
    this.connected = false;
    this.trigger('disconnect', {device: this});
};

/**
 * Trigger an event on a token
 * @param {string} eventName name of event
 * @param {object} eventOptions dictionary of parameters and values
 */
AnyBoard.BaseToken.prototype.trigger = function(eventName, eventOptions) {
    AnyBoard.Logger.debug('' + this + ' triggered "' + eventName + '"');
    if (this.listeners[eventName])
            for (var i in this.listeners[eventName]) {
                if (this.listeners[eventName].hasOwnProperty(i))
                    this.listeners[eventName][i](this, eventOptions);
            }
    if (this.onceListeners[eventName])
        for (var j in this.onceListeners[eventName]) {
            if (this.onceListeners[eventName].hasOwnProperty(j))
                this.onceListeners[eventName][j](this, eventOptions);
        }

};

/**
 * Adds a callbackFunction to be executed always when event is triggered
 * @param {string} eventName name of event to listen to
 * @param {function} callbackFunction function to be executed
 */
AnyBoard.BaseToken.prototype.on = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('' + this + ' added listener to event: ' + eventName, this);
    if (!this.listeners[eventName])
        this.listeners[eventName] = [];
    this.listeners[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time an event is triggered
 * @param {string} eventName name of event to listen to
 * @param {function} callbackFunction function to be executed
 */
AnyBoard.BaseToken.prototype.once = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('' + this + ' added onceListener to event: ' + eventName, this);
    if (!this.onceListeners[eventName])
        this.onceListeners[eventName] = [];
    this.onceListeners[eventName].push(callbackFunction);
};

/**
 * Sends raw data to the token.
 * @param {Uint8Array|ArrayBuffer|String} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    AnyBoard.Logger.debug('' + this + ' attempting to send with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn(this + ' is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.sendBuffer(data, win, fail);
            }, function(errorCode){
                fail(errorCode);
            }
        )
    } else {
        var pointer = this.driver || AnyBoard.TokenManager.driver;
        pointer.send(this, data, win, fail);
    }
};

/**
 * Prints to Token
 *
 * String can have special tokens to signify some printer command, e.g. ##n = newLine
 * Refer to the individual driver for token spesific implementation and capabilites
 *
 * @param {string} value
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.print = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('print')) {
        AnyBoard.Logger.warn('This token has not implemented print', this);
        fail && fail('This token has not implemented print');
    } else {
        this.driver.print(this, value, win, fail);
    }
};

/**
 * Gets the name of the firmware type of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareName = function(win, fail) {
    if (!this.driver.hasOwnProperty('getName')) {
        AnyBoard.Logger.warn('This token has not implemented getName', this);
        fail && fail('This token has not implemented getName');
    } else {
        this.driver.getName(this, function(data){ win && win(data.value); }, fail);
    }
};

/**
 * Gets the version of the firmware type of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareVersion = function(win, fail) {
    if (!this.driver.hasOwnProperty('getVersion')) {
        AnyBoard.Logger.warn('This token has not implemented getVersion', this);
        fail && fail('This token has not implemented getVersion');
    } else {
        this.driver.getVersion(this, function(data){ win && win(data.value); }, fail);
    }
};

/**
 * Gets a uniquie ID the firmware of the token
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareUUID = function(win, fail) {
    if (!this.driver.hasOwnProperty('getUUID')) {
        AnyBoard.Logger.warn('This token has not implemented getUUID', this);
        fail && fail('This token has not implemented getUUID');
    } else {
        this.driver.getUUID(this, function(data){ win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has simple LED
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLed = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLed')) {
        AnyBoard.Logger.debug('This token has not implemented hasLed', this);
        fail && fail('This token has not implemented hasLed');
    } else {
        this.driver.hasLed(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has colored LEDs
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLedColor = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLedColor')) {
        AnyBoard.Logger.debug('This token has not implemented hasLedColor', this);
        fail && fail('This token has not implemented hasLedColor');
    } else {
        this.driver.hasLedColor(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has vibration
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasVibration = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasVibration')) {
        AnyBoard.Logger.debug('This token has not implemented hasVibration', this);
        fail && fail('This token has not implemented hasVibration');
    } else {
        this.driver.hasVibration(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has ColorDetection
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasColorDetection = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasColorDetection')) {
        AnyBoard.Logger.debug('This token has not implemented hasColorDetection', this);
        fail && fail('This token has not implemented hasColorDetection');
    } else {
        this.driver.hasColorDetection(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has LedSceen
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLedSceen = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLedSceen')) {
        AnyBoard.Logger.debug('This token has not implemented hasLedSceen', this);
        fail && fail('This token has not implemented hasLedSceen');
    } else {
        this.driver.hasLedSceen(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has RFID reader
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasRfid = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasRfid')) {
        AnyBoard.Logger.debug('This token has not implemented hasRfid', this);
        fail && fail('This token has not implemented hasRfid');
    } else {
        this.driver.hasRfid(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has NFC reader
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasNfc = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasNfc')) {
        AnyBoard.Logger.debug('This token has not implemented hasNfc', this);
        fail && fail('This token has not implemented hasNfc');
    } else {
        this.driver.hasNfc(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has Accelometer
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasAccelometer = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasAccelometer')) {
        AnyBoard.Logger.debug('This token has not implemented hasAccelometer', this);
        fail && fail('This token has not implemented hasAccelometer');
    } else {
        this.driver.hasAccelometer(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has temperature measurement
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasTemperature = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasTemperature')) {
        AnyBoard.Logger.debug('This token has not implemented hasTemperature', this);
        fail && fail('This token has not implemented hasTemperature');
    } else {
        this.driver.hasTemperature(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Sets color on token
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOn = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('ledOn')) {
        AnyBoard.Logger.warn('This token has not implemented ledOn', this);
        fail && fail('This token has not implemented ledOn');
    } else {
        this.driver.ledOn(this, value, win, fail);
    }
};

/**
 * Sets color on token
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledBlink = function(value, win, fail) {
    if (!this.driver.hasOwnProperty('ledBlink')) {
        AnyBoard.Logger.warn('This token has not implemented ledBlink', this);
        fail && fail('This token has not implemented ledBlink');
    } else {
        this.driver.ledBlink(this, value, win, fail);
    }
};

/**
 * Turns LED off
 * @param {function} [win] callback function to be called upon successful execution
 * @param {function} [fail] callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOff = function(win, fail) {
    if (!this.driver.hasOwnProperty('ledOff')) {
        AnyBoard.Logger.warn('This token has not implemented ledOff', this)
        fail && fail('This token has not implemented ledOff');
    } else {
        this.driver.ledOff(this, win, fail);
    }
};

/**
 * Representational string of class instance.
 * @returns {string}
 */
AnyBoard.BaseToken.prototype.toString = function() {
    return 'Token: ' + this.name + ' (' + this.address + ')';
};
