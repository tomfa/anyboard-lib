/**
 * A token manager.
 * @static
 * @property {object} connectedTokens dictionary of connect tokens that maps id to object
 * @property {AnyBoard.Driver} bleDriver driver driver for bluetooth comm. Set with setBlueToothDriver();
 */
AnyBoard.TokenManager = {
    connectedTokens: {},
    bleDriver: AnyBoard.Drivers.get('evothings-easyble-bean')
};

/**
 * Sets a new driver to handle bluetooth communication
 * @param {AnyBoard.Driver} bluetoothDriver driver to be used for bluetooth communication
 */
AnyBoard.TokenManager.setBluetoothDriver = function(bluetoothDriver) {
    // Check that functions exists on driver
    (bluetoothDriver.connect && typeof bluetoothDriver.connect === 'function') || AnyBoard.Logger.warn('Could not find connect() on given bluetooth driver.', this);
    (bluetoothDriver.disconnect && typeof bluetoothDriver.disconnect === 'function') || AnyBoard.Logger.warn('Could not find disconnect() on given bluetooth driver', this);
    (bluetoothDriver.scan && typeof bluetoothDriver.scan === 'function') || AnyBoard.Logger.warn('Could not find scan() on given bluetooth driver', this);
    (bluetoothDriver.sendSerial && typeof bluetoothDriver.sendSerial === 'function') || AnyBoard.Logger.warn('Could not find sendSerial() on given bluetooth driver', this);
    (bluetoothDriver.sendBinary && typeof bluetoothDriver.sendBinary === 'function') || AnyBoard.Logger.warn('Could not find sendBinary() on given bluetooth driver', this);

    if ((!this.bleDriver) || (bluetoothDriver.connect && typeof bluetoothDriver.connect === 'function' &&
        bluetoothDriver.disconnect && typeof bluetoothDriver.disconnect === 'function' &&
        bluetoothDriver.scan && typeof bluetoothDriver.scan === 'function' &&
        bluetoothDriver.sendSerial && typeof bluetoothDriver.sendSerial === 'function' &&
        bluetoothDriver.sendBinary && typeof bluetoothDriver.sendBinary === 'function'))

        this.bleDriver = bluetoothDriver;
};

/**
 * * Attempts to connect to a token
 * @param {string} tokenIdentifier identifier of the token found when scanned
 * @param {function} win function to be called upon connect success
 * @param {function} fail function to be called upon connect failure
 */
AnyBoard.TokenManager.connect = function(tokenIdentifier, win, fail) {
    bleDriver.connect(tokenIdentifier, win, fail)
};

/**
 * Disconnects a connected token
 * @param {string} tokenIdentifier identifier of the token
 */
AnyBoard.TokenManager.disconnect = function(tokenIdentifier){
    this.bleDriver.disconnect(tokenIdentifier)
};

/**
 * Attempts to send binary data to the token
 * @param {string} tokenIdentifier
 * @param {Uint8Array} data
 * @param {function} win
 * @param {function} fail
 */
AnyBoard.TokenManager.sendBinary = function(tokenIdentifier, data, win, fail) {
    this.bleDriver.sendBinary(tokenIdentifier, data, win, fail);
};
/**
 * Sends JSON data to the token
 * @param {string} tokenIdentifier
 * @param {object} data JSON data.
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 */
AnyBoard.TokenManager.sendSerial = function(tokenIdentifier, data, win, fail) {
    this.bleDriver.sendSerial(tokenIdentifier, data, win, fail);
};

/**
 * Scans for bluetooth tokens nearby and stores in discoveredTokens property
 * @param {function} win function to be executed when devices are found (called for each device found)
 * @param {function} fail function to be executed upon failure
 * @param {number} timeout amount of milliseconds to scan before stopping
 */
AnyBoard.TokenManager.scan = function(win, fail, timeout) {
    this.bleDriver.scan(win, fail, timeout)
};

/**
 * Returns a token handled by this TokenManager
 * @param {string} tokenIdentifier identifer of the token found when scanned
 * @returns {AnyBoard.BaseToken|AnyBoard.BinaryToken|AnyBoard.JSONToken} token if handled by this tokenManager, else undefined
 */
AnyBoard.TokenManager.get = function(tokenIdentifier) {
    return this.tokens[tokenIdentifier];
};

/**
 * Base class for tokens
 * @param {string} tokenIdentifier identifer of the token found when scanned
 * @param {AnyBoard.Driver} [bleDriver=AnyBoard.TokenManager.bleDriver] token driver for handling bluetooth communication with it.
 * @property {boolean} connected
 * @property {object} device
 * @property {object} listeners
 * @property {AnyBoard.Driver} bleDriver
 * @constructor
 */
AnyBoard.BaseToken = function(tokenIdentifier, bleDriver) {
    this.id = tokenIdentifier;
    this.connected = false;
    this.device = null;
    this.listeners = {};
    this.bleDriver = null;
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
    var pointer = this.bleDriver || AnyBoard.TokenManager;
    var self = this;
    pointer.connect(
        this.id,
        function(device) {
            AnyBoard.Logger.debug('Connected to token: ' + this, this);
            self.connected = true;
            self.device = device;
            this.trigger('connect', {device: this});
            win(device);
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to token: ' + this + '. ' + errorCode, this);
            self.connected = false;
            fail(errorCode);
        }
    );
};

/**
 * Disconnects from the token.
 */
AnyBoard.BaseToken.prototype.disconnect = function() {
    var pointer = this.bleDriver || AnyBoard.TokenManager;
    pointer.disconnect(this.id);
    AnyBoard.Logger.debug('Token: ' + this + ' disconnected', this);
    this.trigger('disconnect', {message: 'Initiated disconnect.', device: this});
    this.connected = false;
};

/**
 * Trigger an event on a token
 * @param {string} eventName name of event
 * @param {object} eventOptions dictionary of parameters and values
 */
AnyBoard.BaseToken.prototype.trigger = function(eventName, eventOptions) {
    AnyBoard.Logger.debug('Token: ' + this + ' triggered ' + eventName, this);
    if (!this.listeners[eventName])
        return;
    for (var eventListener in this.listeners) {
        if (this.listeners.hasOwnProperty(eventListener)) {
            this.listeners[eventListener](this, eventOptions);
        }
    }
};

/**
 * Adds a callbackFunction to be executed when event is triggered
 * @param {string} eventName name of event to listen to
 * @param {function} callbackFunction function to be executed
 */
AnyBoard.BaseToken.prototype.on = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Token: ' + this + ' added listener to event: ' + eventName, this);
    if (!this.listeners[eventName])
        this.listeners[eventName] = [];
    this.listeners[eventName].push(callbackFunction);
};

/**
 * Sends data to token over serial BlueTooth
 * @param {object} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.sendSerial = function(data, win, fail) {
    AnyBoard.Logger.debug('Token: ' + this + ' attempting to sendSerial with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn(this + ' is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.sendSerial(data, win, fail);
            }, function(errorCode){
                fail(errorCode);
            }
        )
    } else {
        var pointer = this.bleDriver || AnyBoard.TokenManager;
        pointer.sendSerial(this.id, data, win, fail);
    }
};

/**
 * Sends data to token over 8bit unsigned BlueTooth
 * @param {Uint8Array} data binary array of data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.sendBinary = function(data, win, fail) {
    AnyBoard.Logger.debug('Token: ' + this + ' attempting to sendBinary with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn(this + ' is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.sendSerial(data, win, fail);
            }, function(errorCode){
                fail(errorCode);
            }
        )
    } else {
        var pointer = this.bleDriver || AnyBoard.TokenManager;
        pointer.sendBinary(this.id, data, win, fail);
    }
};

/**
 * Sends data. if data parameter is Uint8Array, uses sendBinary(). Else sendSerial().
 * @param {object} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    if (data instanceof Uint8Array)
        this.sendBinary(this.id, data, win, fail);
    else
        this.sendSerial(this.id, data, win, fail);
};

/**
 * Representational string of class instance.
 * @returns {string}
 */
AnyBoard.BaseToken.prototype.toString = function() {
    return 'Token: ' + this.id;
};

/**
 * A dummy token that prints to AnyBoard.Logger instead of attempting to communicate with a physical token
 * @param {string} tokenIdentifier (dummy) identifer of the token
 * @constructor
 * @augments BaseToken
 */
AnyBoard.DummyToken = function(tokenIdentifier) {
    AnyBoard.BaseToken.call(this, tokenIdentifier);
    this.bleDriver = new AnyBoard.Driver({
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
        }
    });
};
AnyBoard.DummyToken.prototype = new AnyBoard.BaseToken();
AnyBoard.DummyToken.prototype.constructor = AnyBoard.DummyToken;
