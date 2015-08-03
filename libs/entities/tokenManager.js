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
    (driver.sendString && typeof driver.sendString === 'function') || AnyBoard.Logger.warn('Could not find sendString() on given driver', this);
    (driver.send && typeof driver.send === 'function') || AnyBoard.Logger.warn('Could not find send() on given driver', this);

    if ((!this.driver) || (driver.connect && typeof driver.connect === 'function' &&
        driver.disconnect && typeof driver.disconnect === 'function' &&
        driver.scan && typeof driver.scan === 'function' &&
        driver.sendString && typeof driver.sendString === 'function' &&
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
 * @property {boolean} connected whether or not the token is connected
 * @property {object} device driver spesific data.
 * @property {object} listeners functions to be execute upon certain triggered events
 * @property {AnyBoard.Driver} driver driver that handles communication
 * @constructor
 */
AnyBoard.BaseToken = function(name, address, device, driver) {
    this.name = name;
    this.address = address;
    this.connected = false;
    this.device = device;
    this.listeners = {};
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
    AnyBoard.Logger.debug('Attempting to connect to ' + this, this);
    var pointer = this.driver || AnyBoard.TokenManager.driver;
    var self = this;
    pointer.connect(
        self,
        function(device) {
            AnyBoard.Logger.debug('Connected to ' + self, self);
            self.connected = true;
            self.device = device;
            self.trigger('connect', {device: self});
            win(device);
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to ' + self + '. ' + errorCode, self);
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
    AnyBoard.Logger.debug('' + this + ' triggered ' + eventName, this);
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
 * @param {ArrayBuffer|Uint8Array|Uint16Array|Uint32Array|Float64Array} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.sendBuffer = function(data, win, fail) {
    AnyBoard.Logger.debug('Token: ' + this + ' attempting to send with data: ' + data, this);
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
 * Sends data to token over 8bit unsigned BlueTooth
 * @param {sendString} data binary array of data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.sendString = function(data, win, fail) {
    AnyBoard.Logger.debug('Token: ' + this + ' attempting to sendString with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn(this + ' is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.sendString(data, win, fail);
            }, function(errorCode){
                fail(errorCode);
            }
        )
    } else {
        var pointer = this.driver || AnyBoard.TokenManager.driver;
        pointer.sendString(this, data, win, fail);
    }
};

/**
 * Sends data. if data parameter is Uint8Array, uses sendBinary(). Else sendSerial().
 * @param {object} data data to be sent
 * @param {function} win function to be executed upon success
 * @param {function} fail function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array || data instanceof ArrayBuffer)
        this.sendBuffer(this, data, win, fail);
    else
        this.sendString(this, data, win, fail);
};

/**
 * Representational string of class instance.
 * @returns {string}
 */
AnyBoard.BaseToken.prototype.toString = function() {
    return 'Token: ' + this.name + ' (' + this.address + ')';
};

/**
 * A dummy token that prints to AnyBoard.Logger instead of attempting to communicate with a physical token
 * @param {string} name (dummy) name of token
 * @param {string} address (dummy) address of the token
 * @constructor
 * @augments BaseToken
 */
AnyBoard.DummyToken = function(name, address) {
    AnyBoard.BaseToken.call(this, name, address);
    this.driver = new AnyBoard.Driver({
        send: function(data, win, fail) {
            AnyBoard.Logger.log('SIMULTE SEND: ' + data, this);
            if (data instanceof Uint8Array)
                win();
            else
                fail('wrong format');
        },
        sendString: function(data, win, fail) {
            AnyBoard.Logger.log('SIMULTE SENDSTRING: ' + data, this);
            if (typeof data === 'string')
                win();
            else
                fail('wrong format');
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
