"use strict";

/*
 * anyboard-rfduino-token
 *
 * Driver for communicating with AnyBoard Token 1.0 (RFduino) hardware (http://www.rfduino.com/))
 * Supports RfduinoToken.ino firmware
 *
 * Dependencies:
 *      AnyBoard (...)
 *      cordova.js (https://cordova.apache.org/)
 *      evothings.ble (https://github.com/evothings/cordova-ble)
 */

(function(){
    var rfduinoBluetooth = new AnyBoard.Driver({
        name: 'anyboard-rfduino-token',
        description: 'rfduino-driver based off evothings.ble library for Cordova-based apps',
        dependencies: 'evothings.ble',
        version: '0.1',
        date: '2015-09-03',
        type: ['bluetooth'],
        compatibility: [
            {
                characteristic_uuid: '00002222-0000-1000-8000-00805f9b34fb',
                service_uuid: '00002220-0000-1000-8000-00805f9b34fb'
            }
        ]
    });

    /*
     * Internal method that generates a send function.
     * @param {string} name name of functionality. This is what will be used as cache entry, in logs,
     * @param {number} functionId The integer representation of the function, which will be sent as a command to
     *      the token. For instance, ledOn is 129.
     * @param {boolean} [hasParams=false] Whether or not this function accepts data to be sent to the token.
     *      For instance, ledOn takes parameters for color, while ledOff does not.
     * @param {boolean} [useCache=false] Whether or not cache should be used in this function.
     *      If cache is used, function will not send more than one request, no matter how many
     *      times this function is called. Used for getting token name and functionality (not changing pr token)
     * @returns {Function} A function that can be called to send a command to the token
     * @private
     */
    rfduinoBluetooth._GenericSend = function(name, functionId, hasParams, useCache) {
        var tmpId = functionId;
        var internalSend = function(token, data, win, fail) {
            AnyBoard.Logger.debug("Executing " + name, token);
            if (useCache && token.cache.hasOwnProperty(name)) {
                win && win(token.cache[name]);
                return;
            }
            rfduinoBluetooth.send(
                token,
                data,
                function(){
                    token.once(name,
                        function(token, returnData) {
                            if (useCache && returnData !== undefined) {
                                token.cache[name] = returnData;
                            }
                            win && win(returnData);
                        }
                    )
                },
                function(errorCode){ fail && fail(errorCode);}
            )
        };
        if (!hasParams) {
            var newData = new Uint8Array(1);
            newData[0] = tmpId;
            return function(token, win, fail) {
                internalSend(token, newData, win, fail);
            };
        }
        return function(token, data, win, fail) {
            var newData = new Uint8Array(data.length+1);
            newData[0] = tmpId;
            for (var index in data) {
                if (data.hasOwnProperty(index))
                    newData[parseInt(index)+1] = data[index];
            }
            internalSend(token, newData, win, fail);
        }
    };

    /* Internal mapping from commands to uint8 representations */
    rfduinoBluetooth._CMD_CODE = {
        MOVE: 194,
        GET_NAME: 32,
        GET_VERSION: 33,
        GET_UUID: 34,
        GET_BATTERY_STATUS: 35,
        LED_OFF: 128,
        LED_ON: 129,
        LED_BLINK: 130,
        HAS_LED: 64,
        HAS_LED_COLOR: 65,
        HAS_VIBRATION: 66,
        HAS_COLOR_DETECTION: 67,
        HAS_LED_SCREEN: 68,
        HAS_RFID: 71,
        HAS_NFC: 72,
        HAS_ACCELEROMETER: 73,
        HAS_TEMPERATURE: 74
    };

    /* Internal mapping between color strings to Uint8 array of RGB colors */
    rfduinoBluetooth._COLORS = {
        'red': new Uint8Array([255, 0, 0]),
        'green': new Uint8Array([0, 255, 0]),
        'blue': new Uint8Array([0, 0, 255]),
        'white': new Uint8Array([255, 255, 255]),
        'pink': new Uint8Array([255, 0, 255]),
        'yellow': new Uint8Array([255, 255, 0]),
        'aqua': new Uint8Array([0, 255, 255]),
        'off': new Uint8Array([0, 0, 0])
    };

    /* Internal mapping and generation of commands */
    var NO_PARAMS = false;
    var HAS_PARAMS = true;
    var USE_CACHE = true;
    rfduinoBluetooth._COMMANDS = {
        GET_NAME: rfduinoBluetooth._GenericSend(
            "GET_NAME",
            rfduinoBluetooth._CMD_CODE.GET_NAME,
            NO_PARAMS,
            USE_CACHE),
        GET_VERSION: rfduinoBluetooth._GenericSend(
            "GET_VERSION",
            rfduinoBluetooth._CMD_CODE.GET_VERSION,
            NO_PARAMS,
            USE_CACHE),
        GET_UUID: rfduinoBluetooth._GenericSend(
            "GET_UUID",
            rfduinoBluetooth._CMD_CODE.GET_UUID,
            NO_PARAMS,
            USE_CACHE),
        GET_BATTERY_STATUS: rfduinoBluetooth._GenericSend(
            "GET_BATTERY_STATUS",
            rfduinoBluetooth._CMD_CODE.GET_BATTERY_STATUS,
            NO_PARAMS),
        LED_OFF: rfduinoBluetooth._GenericSend(
            "LED_OFF",
            rfduinoBluetooth._CMD_CODE.LED_OFF,
            NO_PARAMS),
        LED_ON: rfduinoBluetooth._GenericSend(
            "LED_ON",
            rfduinoBluetooth._CMD_CODE.LED_ON,
            HAS_PARAMS),
        LED_BLINK: rfduinoBluetooth._GenericSend(
            "LED_BLINK",
            rfduinoBluetooth._CMD_CODE.LED_BLINK,
            HAS_PARAMS),
        HAS_LED: rfduinoBluetooth._GenericSend(
            "HAS_LED",
            rfduinoBluetooth._CMD_CODE.HAS_LED,
            NO_PARAMS,
            USE_CACHE),
        HAS_LED_COLOR: rfduinoBluetooth._GenericSend(
            "HAS_LED_COLOR",
            rfduinoBluetooth._CMD_CODE.HAS_LED_COLOR,
            NO_PARAMS,
            USE_CACHE),
        HAS_VIBRATION: rfduinoBluetooth._GenericSend(
            "HAS_VIBRATION",
            rfduinoBluetooth._CMD_CODE.HAS_VIBRATION,
            NO_PARAMS,
            USE_CACHE),
        HAS_COLOR_DETECTION: rfduinoBluetooth._GenericSend(
            "HAS_COLOR_DETECTION",
            rfduinoBluetooth._CMD_CODE.HAS_COLOR_DETECTION,
            NO_PARAMS,
            USE_CACHE),
        HAS_LED_SCREEN: rfduinoBluetooth._GenericSend(
            "HAS_LED_SCREEN",
            rfduinoBluetooth._CMD_CODE.HAS_LED_SCREEN,
            NO_PARAMS,
            USE_CACHE),
        HAS_RFID: rfduinoBluetooth._GenericSend(
            "HAS_RFID",
            rfduinoBluetooth._CMD_CODE.HAS_RFID,
            NO_PARAMS,
            USE_CACHE),
        HAS_NFC: rfduinoBluetooth._GenericSend(
            "HAS_NFC",
            rfduinoBluetooth._CMD_CODE.HAS_NFC,
            NO_PARAMS,
            USE_CACHE),
        HAS_ACCELEROMETER: rfduinoBluetooth._GenericSend(
            "HAS_ACCELEROMETER",
            rfduinoBluetooth._CMD_CODE.HAS_ACCELEROMETER,
            NO_PARAMS,
            USE_CACHE),
        HAS_TEMPERATURE: rfduinoBluetooth._GenericSend(
            "HAS_TEMPERATURE",
            rfduinoBluetooth._CMD_CODE.HAS_TEMPERATURE,
            NO_PARAMS,
            USE_CACHE)
    };

    /**
     * Internal method that subscribes to updates from the token
     * @param token
     * @param callback
     * @param success
     * @param fail
     */
    rfduinoBluetooth._subscribe = function(token, callback, success, fail)
    {
        evothings.ble.writeDescriptor(
            token.device.deviceHandle,
            token.device.descriptors['00002902-0000-1000-8000-00805f9b34fb'].handle,
            new Uint8Array([1,0])
            );

        evothings.ble.enableNotification(
            token.device.deviceHandle,
            token.device.characteristics['00002221-0000-1000-8000-00805f9b34fb'].handle,
            function(data){
                data = new DataView(data);
                var length = data.byteLength;
                var uint8Data = [];
                for (var i = 0; i < length; i++) {
                    uint8Data.push(data.getUint8(i));
                }
                callback && callback(uint8Data);
            },
            function(errorCode){
                AnyBoard.Logger.error("Could not subscribe to notifications", token);
            });

    };

    /*
     * Not used method stub. Should be functional
     */
    rfduinoBluetooth._unsubscribe = function(token, win, fail)
    {
        evothings.ble.writeDescriptor(
            token.device.deviceHandle,
            token.device.descriptors['00002902-0000-1000-8000-00805f9b34fb'].handle,
            new Uint8Array([0,0])
        );

        evothings.ble.disableNotification(
            token.device.deviceHandle,
            token.device.characteristics['00002221-0000-1000-8000-00805f9b34fb'].handle,
            function(data){ success && success(data); },
            function(errorCode){ fail && fail(errorCode); }
        );
    };

    /**
     * The initialize-methods is called automatically (or should be) from the master communication driver upon connect
     * to a device.
     *
     * In this initialize method, we subscribe to notifications sent by the rfduino device, and trigger events
     * on the token class upon receiving data.
     */
    rfduinoBluetooth.initialize = function(token) {
        var handleReceiveUpdateFromToken = function(uint8array) {
            var command = uint8array[0];
            var strData = "";

            switch (command) {
                case rfduinoBluetooth._CMD_CODE.GET_BATTERY_STATUS:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_BATTERY_STATUS', {"value": strData});
                    break;
                case rfduinoBluetooth._CMD_CODE.MOVE:
                    var currentTile = uint8array[1];
                    var previousTile = uint8array[2];
                    token.trigger('MOVE', {"value": currentTile, "newTile": currentTile, "oldTile": previousTile});
                    token.trigger('MOVE_TO', {'meta-eventType': 'token-constraint' ,"constraint": currentTile});
                    token.trigger('MOVE_FROM', {'meta-eventType': 'token-constraint' ,"constraint": previousTile});

                    for (var key in AnyBoard.TokenManager.tokens) {
                        if (AnyBoard.TokenManager.tokens.hasOwnProperty(key)) {
                            var t = AnyBoard.TokenManager.tokens[key];
                            if (t.currentTile && t.currentTile === currentTile) {
                                t.trigger('MOVE_NEXT_TO', {'meta-eventType': 'token-token' ,"token": t})
                            }
                        }
                    }
                    token.currentTile = currentTile;
                    break;
                case rfduinoBluetooth._CMD_CODE.GET_NAME:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_NAME', {"value": strData});
                    break;
                case rfduinoBluetooth._CMD_CODE.GET_VERSION:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_VERSION', {"value": strData});
                    break;
                case rfduinoBluetooth._CMD_CODE.GET_UUID:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_UUID', {"value": strData});
                    break;
                case rfduinoBluetooth._CMD_CODE.LED_BLINK:
                    token.trigger('LED_BLINK');
                    break;
                case rfduinoBluetooth._CMD_CODE.LED_OFF:
                    token.trigger('LED_OFF');
                    break;
                case rfduinoBluetooth._CMD_CODE.LED_ON:
                    token.trigger('LED_ON');
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_LED:
                    token.trigger('HAS_LED', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_LED_COLOR:
                    token.trigger('HAS_LED_COLOR', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_VIBRATION:
                    token.trigger('HAS_VIBRATION', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_COLOR_DETECTION:
                    token.trigger('HAS_COLOR_DETECTION', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_LED_SCREEN:
                    token.trigger('HAS_LED_SCREEN', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_RFID:
                    token.trigger('HAS_RFID', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_NFC:
                    token.trigger('HAS_NFC', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_ACCELEROMETER:
                    token.trigger('HAS_ACCELEROMETER', {"value": uint8array[1]})
                    break;
                case rfduinoBluetooth._CMD_CODE.HAS_TEMPERATURE:
                    token.trigger('HAS_TEMPERATURE', {"value": uint8array[1]})
                    break;
                default:
                    token.trigger('INVALID_DATA_RECEIVE', {"value": uint8array});
            }

            token.sendQueue.shift(); // Remove function from queue
            if (token.sendQueue.length > 0) {  // If there's more functions queued
                token.randomToken = Math.random();
                token.sendQueue[0]();  // Send next function off
            }
        };

        this._subscribe(token, handleReceiveUpdateFromToken);
    };

    rfduinoBluetooth.getName = function (token, win, fail) {
        this._COMMANDS.GET_NAME(token, win, fail);
    };

    rfduinoBluetooth.getVersion = function (token, win, fail) {
        this._COMMANDS.GET_VERSION(token, win, fail);
    };

    rfduinoBluetooth.getUUID = function (token, win, fail) {
        this._COMMANDS.GET_UUID(token, win, fail);
    };

    rfduinoBluetooth.hasLed = function(token, win, fail) {
        this._COMMANDS.HAS_LED(token, win, fail);
    };

    rfduinoBluetooth.hasLedColor = function(token, win, fail) {
        this._COMMANDS.HAS_LED_COLOR(token, win, fail);
    };

    rfduinoBluetooth.hasVibration = function(token, win, fail) {
        this._COMMANDS.HAS_VIBRATION(token, win, fail);
    };

    rfduinoBluetooth.hasColorDetection = function(token, win, fail) {
        this._COMMANDS.HAS_COLOR_DETECTION(token, win, fail);
    };

    rfduinoBluetooth.hasLedScreen = function(token, win, fail) {
        this._COMMANDS.HAS_LED_SCREEN(token, win, fail);
    };

    rfduinoBluetooth.hasRfid = function(token, win, fail) {
        this._COMMANDS.HAS_RFID(token, win, fail);
    };

    rfduinoBluetooth.hasNfc = function(token, win, fail) {
        this._COMMANDS.HAS_NFC(token, win, fail);
    };

    rfduinoBluetooth.hasAccelometer = function(token, win, fail) {
        this._COMMANDS.HAS_ACCELEROMETER(token, win, fail);
    };

    rfduinoBluetooth.hasTemperature = function(token, win, fail) {
        this._COMMANDS.HAS_TEMPERATURE(token, win, fail);
    };

    rfduinoBluetooth.ledOn = function (token, value, win, fail) {
        value = value || 'white';

        if (typeof value === 'string' && value in this._COLORS) {
            rfduinoBluetooth.ledOn(token, this._COLORS[value], win, fail);
        } else if ((value instanceof Array || value instanceof Uint8Array) && value.length === 3) {
            this._COMMANDS.LED_ON(token, new Uint8Array([value[0], value[1], value[2]]), win, fail);
        } else {
            fail && fail('Invalid or unsupported color parameters');
        }
    };

    rfduinoBluetooth.ledBlink = function (token, value, win, fail) {
        value = value || 'white';

        if (typeof value === 'string' && value in this._COLORS) {
            rfduinoBluetooth.ledBlink(token, this._COLORS[value], win, fail);
        } else if ((value instanceof Array || value instanceof Uint8Array) && value.length === 3) {
            this._COMMANDS.LED_BLINK(token, new Uint8Array([value[0], value[1], value[2], 30]), win, fail);
        } else {
            fail && fail('Invalid or unsupported color parameters');
        }
    };

    rfduinoBluetooth.ledOff = function (token, win, fail) {
        this._COMMANDS.LED_OFF(token, win, fail);
    };

    rfduinoBluetooth.onColorChange = function(token, changeCallback) {
        token.on('colorChange', changeCallback);
    };

    /**
     * Internal method. Raw sending of data to bean. Does not employ throttling/queueing, nor validates send data.
     *
     * @param {AnyBoard.BaseToken} token token that should be sent to
     * @param {Uint8Array} data data that should be sent to token
     * @param {Function} win function to be called upon success of sending data
     * @param {Function} fail function to be called upon failure of sending data
     */
    rfduinoBluetooth.rawSend = function(token, data, win, fail) {
        evothings.ble.writeCharacteristic(
            token.device.deviceHandle,
            token.device.serialChar,
            data,
            win,
            fail
        );
    };

    /**
     * Sends data to device. Uses throttling.
     *
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {ArrayBuffer|Uint8Array|String} data data to be sent (max 13 byte)
     * @param {function} [win] function to be executed upon success
     * @param {function} [fail] function to be executed upon failure
     */
    rfduinoBluetooth.send = function(token, data, win, fail) {
        var self = this;

        if(!(token.device.haveServices)) {
            fail && fail('Token does not have services');
            return;
        }

        if (typeof data === 'string') {
            data = new Uint8Array(evothings.ble.toUtf8(data));
        }

        if(data.buffer) {
            if(!(data instanceof Uint8Array))
                data = new Uint8Array(data.buffer);
        } else if(data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        } else {
            AnyBoard.Logger.warn("send data is not an ArrayBuffer.", this);
            return;
        }

        if (data.length > 20) {
            AnyBoard.Logger.warn("cannot send data of length over 20.", this);
            return;
        }

        if (token.sendQueue.length === 0) {  // this was first command
            token.sendQueue.push(function(){ rfduinoBluetooth.rawSend(token, data, win, fail); });
            rfduinoBluetooth.rawSend(token, data, win, fail);
        } else {
            // send function will be handled by existing
            token.sendQueue.push(function(){ rfduinoBluetooth.rawSend(token, data, win, fail); });

            // Disregards existing queue if it takes more than 2000ms
            var randomToken = Math.random();
            token.randomToken = randomToken;

            setTimeout(function() {
                if (token.randomToken == randomToken) { // Queuehandler Hung up

                    token.sendQueue.shift(); // Remove function from queue
                    if (token.sendQueue.length > 0) {  // If there's more functions queued
                        token.sendQueue[0]();  // Send next function off
                    }
                }
            }, 2000);
        }

    };

})();