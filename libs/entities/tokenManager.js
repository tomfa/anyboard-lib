/**
 * A token manager. Holds all tokens. Discovers and connects to them.
 * @static
 * @property {object} tokens dictionary of connect tokens that maps id to object
 * @property {AnyBoard.Driver} driver driver for communication with tokens. Set with setDriver(driver);
 */
AnyBoard.TokenManager = {
    tokens: {},
    driver: null,
    listeners: {
        tokenEvent: {},
        onceTokenEvent: {},
        tokenTokenEvent: {},
        onceTokenTokenEvent: {},
        tokenConstraintEvent: {},
        onceTokenConstraintEvent: {}
    }
};

/**
 * Sets a new default driver to handle communication for tokens without specified driver.
 * The driver must have implemented methods *scan(win, fail, timeout) connect(token, win, fail) and
 * disconnect(token, win, fail)*, in order to discover tokens.
 *
 * @param {AnyBoard.Driver} driver driver to be used for communication
 */
AnyBoard.TokenManager.setDriver = function(driver) {
    // Check that functions exists on driver
    (driver.connect && typeof driver.connect === 'function') || AnyBoard.Logger.warn('Could not find connect() on given driver.', this);
    (driver.disconnect && typeof driver.disconnect === 'function') || AnyBoard.Logger.warn('Could not find disconnect() on given driver', this);
    (driver.scan && typeof driver.scan === 'function') || AnyBoard.Logger.warn('Could not find scan() on given driver', this);

    if ((!this.driver) || (driver.connect && typeof driver.connect === 'function' &&
        driver.disconnect && typeof driver.disconnect === 'function' &&
        driver.scan && typeof driver.scan === 'function'))

        this.driver = driver;
};

/**
 * Scans for tokens nearby and stores in discoveredTokens property
 * @param {onScanCallback} [win] *(optional)* function to be executed when devices are found (called for each device found)
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon failure
 * @param {number} [timeout] *(optional)* amount of milliseconds to scan before stopping. Driver has a default.
 * @example
 * var onDiscover = function(token) { console.log("I found " + token) };
 *
 * // Scans for tokens. For every token found, it prints "I found ...")
 * TokenManager.scan(onDiscover);
 */
AnyBoard.TokenManager.scan = function(win, fail, timeout) {
    this.driver.scan(
        function(token) {
            AnyBoard.TokenManager.tokens[token.address] = token;
            win && win(token);
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
 * Adds a callbackFunction to be executed always when a token-token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenTokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, resToken, event, options) {
 *      console.log(initToken + " " + event + " " + resToken);
 * };
 *
 * TokenManager.onTokenTokenEvent("MOVE_NEXT_TO", cb);
 *
 * // prints "existingToken MOVE_NEXT_TO anotherToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};
 *
 * // prints "existingToken MOVE_NEXT_TO oldToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};
 */
AnyBoard.TokenManager.onTokenTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to TT-event: ' + eventName, this);
    if (!this.listeners.tokenTokenEvent[eventName])
        this.listeners.tokenTokenEvent[eventName] = [];
    this.listeners.tokenTokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token-token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenTokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, resToken, event, options) {
 *      console.log(initToken + " " + event + " " + resToken);
 * };
 *
 * TokenManager.onceTokenTokenEvent("MOVE_NEXT_TO", cb);
 *
 * // prints "existingToken MOVE_NEXT_TO anotherToken";
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};
 *
 * // no effect
 * existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};
 */
AnyBoard.TokenManager.onceTokenTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to TT-event: ' + eventName, this);
    if (!this.listeners.onceTokenTokenEvent[eventName])
        this.listeners.onceTokenTokenEvent[eventName] = [];
    this.listeners.onceTokenTokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed always when a token-constraint event is triggered.
 * A token-constraint event is a physical token interaction with a game constraint, e.g. moving a pawn within a board.
 * @param {string} eventName name of event to listen to
 * @param {tokenConstraintEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, constraint, event, options) {
 *      console.log(initToken + " " + event + " " + constraint);
 * };
 *
 * TokenManager.onTokenConstraintEvent("MOVE", cb);
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};
 */
AnyBoard.TokenManager.onTokenConstraintEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to TC-event: ' + eventName, this);
    if (!this.listeners.tokenConstraintEvent[eventName])
        this.listeners.tokenConstraintEvent[eventName] = [];
    this.listeners.tokenConstraintEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token-constraint event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenConstraintEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, constraint, event, options) {
 *      console.log(initToken + " " + event + " " + constraint);
 * };
 *
 * TokenManager.onceTokenConstraintEvent("MOVE", cb);
 *
 * // prints "existingToken MOVE Tile-5";
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint"", "constraint": "Tile-5"};
 *
 * // no effect
 * existingToken.trigger("MOVE", {"meta-eventType": "token-constraint""};
 */
AnyBoard.TokenManager.onceTokenConstraintEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to TC-event: ' + eventName, this);
    if (!this.listeners.onceTokenConstraintEvent[eventName])
        this.listeners.onceTokenConstraintEvent[eventName] = [];
    this.listeners.onceTokenConstraintEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed always when a token event is triggered.
 * A token event is an physical interaction with a single token.
 * @param {string} eventName name of event to listen to
 * @param {tokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, event, options) {
 *      console.log(initToken + " was " + event + "'ed ");
 * };
 *
 * TokenManager.onTokenEvent("LIFT", cb);
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 */
AnyBoard.TokenManager.onTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to T-event: ' + eventName, this);
    if (!this.listeners.tokenEvent[eventName])
        this.listeners.tokenEvent[eventName] = [];
    this.listeners.tokenEvent[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time a token event is triggered
 * @param {string} eventName name of event to listen to
 * @param {tokenEventCallback} callbackFunction function to be executed
 * @example
 * var cb = function (initToken, event, options) {
 *      console.log(initToken + " was " + event + "'ed ");
 * };
 *
 * TokenManager.onceTokenEvent("LIFT", cb);
 *
 * // prints "existingToken was LIFT'ed"
 * existingToken.trigger("LIFT", {"meta-eventType": "token"};
 *
 * // No effect
 * existingToken.trigger('LIFT');
 */
AnyBoard.TokenManager.onceTokenEvent = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to T-event: ' + eventName, this);
    if (!this.listeners.onceTokenEvent[eventName])
        this.listeners.onceTokenEvent[eventName] = [];
    this.listeners.onceTokenEvent[eventName].push(callbackFunction);
};


/**
 * Base class for tokens. Should be used by communication driver upon AnyBoard.TokenManager.scan()
 * @param {string} name name of the token
 * @param {string} address address of the token found when scanned
 * @param {object} device device object used and handled by driver
 * @param {AnyBoard.Driver} [driver=AnyBoard.BaseToken._defaultDriver] token driver for handling communication with it.
 * @property {string} name name of the token
 * @property {string} address address of the token found when scanned
 * @property {boolean} connected whether or not the token is connected
 * @property {object} device driver spesific data.
 * @property {object} listeners functions to be executed upon certain triggered events
 * @property {object} onceListeners functions to be executed upon the next triggering of a certain (only once).
 * @property {Array.<Function>} sendQueue queue for communicating with
 * @property {object} cache key-value store for caching certain communication calls
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
    this.cache = {};
    this.driver = driver || AnyBoard.BaseToken._defaultDriver;
};

AnyBoard.BaseToken._defaultDriver = {};

/**
 * Sets a new default driver to handle communication for tokens without specified driver.
 * The driver must have implement a method *send(win, fail)* in order to discover tokens.
 *
 * @param {AnyBoard.Driver} driver driver to be used for communication
 * @returns {boolean} whether or not driver was successfully set
 */
AnyBoard.BaseToken.setDefaultDriver = function(driver) {
    if (driver.send && typeof driver.send === 'function') {
        AnyBoard.BaseToken._defaultDriver = driver;
        return true;
    }
    AnyBoard.Logger.warn('Could not find send() on given driver', this);
    return false;
};

/**
 * Sets driver for the token.
 * @param driver
 */
AnyBoard.BaseToken.prototype.setDriver = function(driver){
    if (driver && driver.send && typeof driver.send === 'function')
        this.driver = driver;
    else
        AnyBoard.Logger.warn('Could not find send() on given driver', this);
};

/**
 * Returns whether or not the token is connected
 * @returns {boolean} true if connected, else false
 */
AnyBoard.BaseToken.prototype.isConnected = function() {
    return this.connected;
};

/**
 * Attempts to connect to token. Uses TokenManager driver, not its own, since connect
 *      needs to happen before determining suitable driver.
 * @param {stdNoParamCallback} [win] *(optional)* function to be executed upon success
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.connect = function(win, fail) {
    AnyBoard.Logger.debug('Attempting to connect to ' + this);
    var self = this;
    AnyBoard.TokenManager.driver.connect(
        self,
        function(device) {
            AnyBoard.Logger.debug('Connected to ' + self);
            self.connected = true;
            self.trigger('connect', {device: self});
            win && win();
        },
        function(errorCode) {
            AnyBoard.Logger.debug('Could not connect to ' + self + '. ' + errorCode);
            self.trigger('disconnect', {device: self});
            self.connected = false;
            fail && fail(errorCode);
        }
    );
};

/**
 * Disconnects from the token.
 */
AnyBoard.BaseToken.prototype.disconnect = function() {
    AnyBoard.TokenManager.driver.disconnect(this);
    AnyBoard.Logger.debug('' + this + ' disconnected', this);
    this.connected = false;
    this.trigger('disconnect', {device: this});
};

/**
 * Trigger an event on a token. Also used to trigger special events (Token, Token-Token and Token-Eonstraint-events) by
 * specifying 'meta-eventType' = 'token', 'token-token' or 'token-constraint' in eventOptions.
 * @param {string} eventName name of event
 * @param {object} [eventOptions] (*optional)* dictionary of parameters and values
 * @example
 * var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * existingToken.trigger('timeTravelled');  // prints again
 * existingToken.trigger('timeTravelled');  // prints again
 */
AnyBoard.BaseToken.prototype.trigger = function(eventName, eventOptions) {
    AnyBoard.Logger.debug('Triggered "' + eventName + '"', this);

    var baseTrigger = function(dict, event, args) {
        if (dict[event])
            for (var i in dict[event]) {
                if (dict[event].hasOwnProperty(i))
                    dict[event][i].apply(null, args);
            }
    };

    baseTrigger(this.listeners, eventName, [eventOptions]);
    baseTrigger(this.onceListeners, eventName, [eventOptions]);
    this.onceListeners[eventName] = [];

    var self = this;

    if (eventOptions && eventOptions.hasOwnProperty('meta-eventType')) {
        if (eventOptions['meta-eventType'] == 'token-token') {
            if (eventOptions.hasOwnProperty('token')) {
                baseTrigger(AnyBoard.TokenManager.listeners.tokenTokenEvent, eventName, [self, eventOptions.token, eventOptions]);
                baseTrigger(AnyBoard.TokenManager.listeners.onceTokenTokenEvent, eventName, [self, eventOptions.token, eventOptions]);
                AnyBoard.TokenManager.listeners.onceTokenTokenEvent[eventName] = [];
            } else {
                AnyBoard.warn('Attempting to trigger token-token event type, but missing token option', this);
            }

        } else if (eventOptions['meta-eventType'] == 'token') {
            baseTrigger(AnyBoard.TokenManager.listeners.tokenEvent, eventName, [self, eventOptions]);
            baseTrigger(AnyBoard.TokenManager.listeners.onceTokenEvent, eventName, [self, eventOptions]);
            AnyBoard.TokenManager.listeners.onceTokenEvent[eventName] = [];
        } else if (eventOptions['meta-eventType'] == 'token-constraint') {
            if (eventOptions.hasOwnProperty('constraint')) {
                baseTrigger(AnyBoard.TokenManager.listeners.tokenConstraintEvent, eventName, [self, eventOptions.constraint, eventOptions]);
                baseTrigger(AnyBoard.TokenManager.listeners.onceTokenConstraintEvent, eventName, [self, eventOptions.constraint, eventOptions]);
                AnyBoard.TokenManager.listeners.onceTokenConstraintEvent[eventName] = [];
            } else {
                AnyBoard.warn('Attempting to trigger token-token event type, but missing constraint option', this);
            }
        } else {
            AnyBoard.warn('Attempting to trigger invalid event type: ' + eventOptions['meta-eventType'], this);
        }
    }
};

/**
 * Adds a callbackFunction to be executed always when event is triggered
 * @param {string} eventName name of event to listen to
 * @param {simpleEventCallback} callbackFunction function to be executed
 * @example
 * var onTimeTravelCallback = function () {console.log("The tardis is great!")};
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * existingToken.trigger('timeTravelled');  // prints again
 * existingToken.trigger('timeTravelled');  // prints again
 * @example
 * var onTimeTravelCallback = function (options) {
 *     // Options can be left out of a trigger. You should therefore check
 *     // that input is as expected, throw an error or give a default value
 *     var name = (options && options.name ? options.name : "You're");
  *
 *     console.log(options.name + " is great!");
 * };
 * existingToken.on('timeTravelled', onTimeTravelCallback);
 *
 * // prints "Dr.Who is great!"
 * existingToken.trigger('timeTravelled', {"name": "Dr.Who"});
 *
 * // prints "You're great!"
 * existingToken.trigger('timeTravelled');
 */
AnyBoard.BaseToken.prototype.on = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added listener to event: ' + eventName, this);
    if (!this.listeners[eventName])
        this.listeners[eventName] = [];
    this.listeners[eventName].push(callbackFunction);
};

/**
 * Adds a callbackFunction to be executed next time an event is triggered
 * @param {string} eventName name of event to listen to
 * @param {simpleEventCallback} callbackFunction function to be executed
 * @example
 * var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
 * existingToken.once('timeTravelled', onTimeTravelCallback);
 *
 * // Triggers the function, and prints praise for the tardis
 * existingToken.trigger('timeTravelled');
 *
 * // No effect
 * existingToken.trigger('timeTravelled');
 */
AnyBoard.BaseToken.prototype.once = function(eventName, callbackFunction) {
    AnyBoard.Logger.debug('Added onceListener to event: ' + eventName, this);
    if (!this.onceListeners[eventName])
        this.onceListeners[eventName] = [];
    this.onceListeners[eventName].push(callbackFunction);
};

/**
 * Sends data to the token. Uses either own driver, or (if not set) TokenManager driver
 * @param {Uint8Array|ArrayBuffer|String} data data to be sent
 * @param {stdNoParamCallback} [win] *(optional)* function to be executed upon success
 * @param {stdErrorCallback} [fail] *(optional)* function to be executed upon error
 */
AnyBoard.BaseToken.prototype.send = function(data, win, fail) {
    AnyBoard.Logger.debug('Attempting to send with data: ' + data, this);
    if (!this.isConnected()) {
        AnyBoard.Logger.warn('Is not connected. Attempting to connect first.', this);
        var self = this;
        this.connect(
            function(device){
                self.send(data, win, fail);
            }, function(errorCode){
                fail && fail(errorCode);
            }
        )
    } else {
        this.driver.send(this, data, win, fail);
    }
};

/**
 * Prints to Token
 *
 * String can have special tokens to signify some printer command, e.g. ##n = newLine.
 * Refer to the individual driver for token spesific implementation and capabilites
 *
 * @param {string} value
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 *
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
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 * @example
 * // Function to be executed upon name retrieval
 * var getNameCallback = function (name) {console.log("Firmware name: " + name)};
 *
 * // Function to be executed upon failure to retrieve name
 * var failGettingNameCallback = function (name) {console.log("Couldn't get name :(")};
 *
 * existingToken.getFirmwareName(getNameCallback, failGettingNameCallback);
 *
 * // Since it's asyncronous, this will be printed before the result
 * console.log("This comes first!")
 */
AnyBoard.BaseToken.prototype.getFirmwareName = function(win, fail) {
    if (!this.driver.hasOwnProperty('getName')) {
        AnyBoard.Logger.warn('This token has not implemented getName', this);
        fail && fail('This token has not implemented getName');
    } else {
        this.driver.getName(this, function(data){
            win && win(data.value); }, fail);
    }
};

/**
 * Gets the version of the firmware type of the token
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.getFirmwareVersion = function(win, fail) {
    if (!this.driver.hasOwnProperty('getVersion')) {
        AnyBoard.Logger.warn('This token has not implemented getVersion', this);
        fail && fail('This token has not implemented getVersion');
    } else {
        this.driver.getVersion(this, function(data){
            win && win(data.value); }, fail);
    }
};

/**
 * Gets a uniquie ID the firmware of the token
 * @param {stdStringCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
 */
AnyBoard.BaseToken.prototype.hasLedScreen = function(win, fail) {
    if (!this.driver.hasOwnProperty('hasLedSceen')) {
        AnyBoard.Logger.debug('This token has not implemented hasLedSceen', this);
        fail && fail('This token has not implemented hasLedSceen');
    } else {
        this.driver.hasLedScreen(this, function(data) { win && win(data.value); }, fail);
    }
};

/**
 * Checks whether or not the token has RFID reader
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdBoolCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon failure
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
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 * @example
 * // sets Led to white
 * existingToken.ledOn([255, 255, 255]);
 *
 * // sets Led to white (See driver implementation for what colors are supported)
 * existingToken.ledOn("white");
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
 * tells token to blink its led
 * @param {string|Array} value string with color name or array of [red, green, blue] values 0-255
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 * @example
 * // blinks red
 * existingToken.ledBlink([255, 0, 0]);
 *
 * // blinks blue
 * existingToken.ledBlink("blue");
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
 * @param {stdNoParamCallback} [win] *(optional)* callback function to be called upon successful execution
 * @param {stdErrorCallback} [fail] *(optional)* callback function to be executed upon
 */
AnyBoard.BaseToken.prototype.ledOff = function(win, fail) {
    if (!this.driver.hasOwnProperty('ledOff')) {
        AnyBoard.Logger.warn('This token has not implemented ledOff', this);
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
