"use strict";

/**
 * Driver for evothings.ble based on cordova
 * requires evothings.ble
 */

(function(){
    var rfduinoBluetooth = new AnyBoard.Driver({
        name: 'anyboard-ble-rfduino',
        description: 'rfduino-driver based off evothings.ble library for Cordova-based apps',
        dependencies: 'evothings.ble',
        version: '0.1',
        date: '2015-08-23',
        type: ['bluetooth'],
        compatibility: [
            {
                characteristic_uuid: '00002222-0000-1000-8000-00805f9b34fb',
                service_uuid: '00002220-0000-1000-8000-00805f9b34fb'
            }
        ]
    });

    /**
     * Internal generic function that returns a function
     * @param {string} name name of function, so it can be recognized
     * @param {number} functionId the id of the function call
     * @param {boolean} hasParams whether or not the function should accept Uint8Array data
     * @param {boolean} [useCache] whether or not to cache the answer (will not change during run)
     * @returns {Function} function
     * @constructor
     */
    rfduinoBluetooth._GenericSend = function(name, functionId, hasParams, useCache) {
        var internalSend = function(token, data, win, fail) {
            AnyBoard.Logger.debug("Executing " + name, token);
            if (useCache && token.cache[name]) {
                win && win(token.cache[name]);
                return;
            }
            rfduinoBluetooth.send(
                token,
                data,
                function(){
                    token.once(name,
                        function(returnData) {
                            if (useCache) {
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
            var data = new Uint8Array(1);
            data[0] = functionId;
            return function(token, win, fail) {
                internalSend(token, data, win, fail);
            };
        }
        return function(token, data, win, fail) {
            var newData = new Uint8Array(data.length+1);
            newData[0] = functionId;
            for (var index in data) {
                if (data.hasOwnProperty(index))
                    newData[parseInt(index)+1] = data[index];
            }
            internalSend(token, data, win, fail);
        }
    };

    // Internal mapping and generation of commands
    var NO_PARAMS = false;
    var HAS_PARAMS = true;
    var USE_CACHE = true;
    rfduinoBluetooth._COMMANDS = {

        GET_VERSION: rfduinoBluetooth._GenericSend(
            "GET_VERSION",
            rfduinoBluetooth._CMD_CODE.GET_VERSION,
            NO_PARAMS),
        GET_UUID: rfduinoBluetooth._GenericSend(
            "GET_UUID",
            rfduinoBluetooth._CMD_CODE.GET_UUID,
            NO_PARAMS),
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

    // Internal mapping between command and uint8 (1-255) number that corresponds to that command
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

    // Internal mapping between color strings to Uint8 array of RGB colors
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

    /**
     * Disconnects from device
     * @param {AnyBoard.BaseToken} token
     */
    rfduinoBluetooth.disconnect = function (token) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + token, this);
        token.device && token.device.close();
        token.device.haveServices = false;
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
    /**
     * Internal method that unsubscribes from updates from this token
     * @param token
     * @param win
     * @param fail
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
        var self = this;
        var cb = function(uint8array) {
            var cmd = uint8array[0];
            var strData;
            switch (cmd) {
                case self._CMD_CODE.GET_BATTERY_STATUS:
                    strData = String.fromCharCode.apply(null, uint8array.subarray(1));
                    token.trigger('GET_BATTERY_STATUS', {"value": strData});
                    break;
                case self._CMD_CODE.MOVE:
                    token.trigger('MOVE', {"newTile": uint8array[1], "oldTile": uint8array[2]});
                    break;
                case self._CMD_CODE.GET_NAME:
                    strData = String.fromCharCode.apply(null, uint8array.subarray(1));
                    token.trigger('GET_NAME', {"value": strData});
                    break;
                case self._CMD_CODE.GET_VERSION:
                    strData = String.fromCharCode.apply(null, uint8array.subarray(1));
                    token.trigger('GET_VERSION', {"value": strData});
                    break;
                case self._CMD_CODE.GET_UUID:
                    strData = String.fromCharCode.apply(null, uint8array.subarray(1));
                    token.trigger('GET_UUID', {"value": strData});
                    break;
                case self._CMD_CODE.LED_BLINK:
                    token.trigger('LED_BLINK');
                    break;
                case self._CMD_CODE.LED_OFF:
                    token.trigger('LED_OFF');
                    break;
                case self._CMD_CODE.LED_ON:
                    token.trigger('LED_ON');
                    break;
                case self._CMD_CODE.HAS_LED:
                    token.trigger('HAS_LED', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_LED_COLOR:
                    token.trigger('HAS_LED_COLOR', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_VIBRATION:
                    token.trigger('HAS_VIBRATION', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_COLOR_DETECTION:
                    token.trigger('HAS_COLOR_DETECTION', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_LED_SCREEN:
                    token.trigger('HAS_LED_SCREEN', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_RFID:
                    token.trigger('HAS_RFID', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_NFC:
                    token.trigger('HAS_NFC', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_ACCELEROMETER:
                    token.trigger('HAS_ACCELEROMETER', {"value": uint8array[1]})
                    break;
                case self._CMD_CODE.HAS_TEMPERATURE:
                    token.trigger('HAS_TEMPERATURE', {"value": uint8array[1]})
                    break;
                default:
                    token.trigger('INVALID_DATA_RECEIVE', {"value": uint8array});
            }
        };
        this._subscribe(token, cb)
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

    rfduinoBluetooth.hasLedSceen = function(token, win, fail) {
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
            this._COMMANDS.LED_ON(token, this._COLORS[value], win, fail);
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
     * Send data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {ArrayBuffer|Uint8Array|string} data data to be sent
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
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

        evothings.ble.writeCharacteristic(
            token.device.deviceHandle,
            token.device.serialChar,
            data,
            win,
            fail
        );
    };

})();