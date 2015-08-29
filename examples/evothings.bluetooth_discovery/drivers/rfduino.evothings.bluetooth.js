"use strict";

/**
 * Driver for evothings.ble based on cordova
 * requires evothings.easyble
 */

(function(){
    var rfduinoBluetooth = new AnyBoard.Driver({
        name: 'evothings-easyble-rfduino',
        description: 'rfduino-driver based off evothings.easyble library for Cordova-based apps',
        dependencies: 'evothings.easyble',
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

    var GenericSend = function(name, functionId, takesData) {
        if (!takesData) {
            var data = new Uint8Array(1);
            data[0] = functionId;
            return function(token, win, fail) {
                AnyBoard.Logger.debug("Executing " + name, token);
                rfduinoBluetooth.send(token, data, win, fail)
            };
        }
        return function(token, data, win, fail) {
            AnyBoard.Logger.debug("Executing " + name, token);
            if(data.buffer) {
                if(!(data instanceof Uint8Array))
                    data = new Uint8Array(data.buffer);
            } else if(data instanceof ArrayBuffer) {
                data = new Uint8Array(data);
            } else {
                AnyBoard.Logger.warn("send data is not an ArrayBuffer.", this);
                fail("cannot send data that is not an ArrayBuffer");
                return;
            }

            if (data.length > 18) {
                AnyBoard.Logger.warn("cannot send data of length over 18.", this);
                fail("cannot send data of length over 18.");
                return;
            }

            var newData = new Uint8Array(data.length+1);
            newData[0] = functionId;
            for (var index in data) {
                if (data.hasOwnProperty(index))
                    newData[parseInt(index)+1] = data[index];
            }

            rfduinoBluetooth.send(token, newData, win, fail)
        }
    };

    var COMMANDS = {
        GET_NAME: GenericSend("GET_NAME", 32, false),
        GET_VERSION: GenericSend("GET_VERSION", 33, false),
        GET_UUID: GenericSend("GET_UUID", 34, false),
        GET_BATTERY_STATUS: GenericSend("GET_BATTERY_STATUS", 35, false),
        HAS_LED: GenericSend("HAS_LED", 64, false),
        HAS_LED_COLOR: GenericSend("HAS_LED_COLOR", 65, false),
        HAS_VIBRATION: GenericSend("HAS_VIBRATION", 66, false),
        HAS_COLOR_DETECTION: GenericSend("HAS_COLOR_DETECTION", 67, false),
        HAS_LED_SCREEN: GenericSend("HAS_LED_SCREEN", 68, false),
        LED_SCREEN_WIDTH: GenericSend("LED_SCREEN_WIDTH", 69, false),
        LED_SCREEN_HEIGHT: GenericSend("LED_SCREEN_HEIGHT", 70, false),
        HAS_RFID: GenericSend("HAS_RFID", 71, false),
        HAS_NFC: GenericSend("HAS_NFC", 72, false),
        HAS_ACCELEROMETER: GenericSend("HAS_ACCELEROMETER", 73, false),
        LED_OFF: GenericSend("LED_OFF", 128, false),
        LED_ON: GenericSend("LED_ON", 129, true),
        LED_BLINK: GenericSend("LED_BLINK", 130, true),
        VIBRATE_OFF: GenericSend("VIBRATE_OFF", 131, false),
        VIBRATE: GenericSend("VIBRATE", 132, true),
        SET_LED_SCREEN: GenericSend("SET_LED_SCREEN", 133, true),
        READ_NFC: GenericSend("READ_NFC", 134, false),
        READ_RFID: GenericSend("READ_RFID", 135, false),
        READ_COLOR: GenericSend("READ_COLOR", 136, false)
    };

    /**
     * Predefined colors for Token LEDs
     * @property {Uint8Array} red predefined color red
     * @property {Uint8Array} green predefined color green
     * @property {Uint8Array} blue predefined color blue
     * @property {Uint8Array} white predefined color white
     * @property {Uint8Array} pink predefined color pink
     * @property {Uint8Array} yellow predefined color yellow
     * @property {Uint8Array} aqua predefined color aqua
     */
    var COLORS = {
        'red': new Uint8Array([255, 0, 0]),
        'green': new Uint8Array([0, 255, 0]),
        'blue': new Uint8Array([0, 0, 255]),
        'white': new Uint8Array([255, 255, 255]),
        'pink': new Uint8Array([255, 0, 255]),
        'yellow': new Uint8Array([255, 255, 0]),
        'aqua': new Uint8Array([0, 255, 255]),
        'off': new Uint8Array([0, 0, 0])
    };

    rfduinoBluetooth._devices = {};

    /**
     * Attempts to connect to a device and retrieves available services.
     *
     * NOTE: Attempts at connecting with certain devices, has executed both win and fail callback.
     * This bug is traced back to Cordova library. It has never occured with Tokens, however should be handled
     * by your failure function (it should 'cancel' a potenial call to win.)
     *
     * @param {AnyBoard.BaseToken} token token to be connected to
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    rfduinoBluetooth.connect = function (token, win, fail) {
        var self = this;

        token.device.connect(function(device) {
            self.getServices(token, win, fail);
        }, function(errorCode) {
            token.device.haveServices = false;
            fail(errorCode);
        });
    };

    /**
     * Disconnects from device
     * @param {AnyBoard.BaseToken} token
     */
    rfduinoBluetooth.disconnect = function (token) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + token, this);
        token.device && token.device.close()
        token.device.haveServices = false;
    };

    /**
     * Sends data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {string} string regular string.
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    rfduinoBluetooth.sendString = function(token, string, win, fail) {
        var data = new Uint8Array(evothings.ble.toUtf8(string));
        this.send(token, data, win, fail);
    };

    rfduinoBluetooth.getName = function (token, win, fail) {
        COMMANDS.GET_NAME(token, win, fail);
    };

    rfduinoBluetooth.getVersion = function (token, win, fail) {
        COMMANDS.GET_VERSION(token, win, fail);
    };

    rfduinoBluetooth.setLed = function (token, value, win, fail) {
        value = value || 'white';

        if (typeof value === 'string' && value in COLORS) {
            COMMANDS.LED_ON(token, COLORS[value], win, fail);
        } else if (value instanceof Array && value.length === 3) {
            COMMANDS.LED_ON(token, new Uint8Array(value), win, fail);
        } else {
            fail && fail('Invalid or unsupported color parameters');
        }
    };

    rfduinoBluetooth.vibrate = function (token, options, win, fail) {
        options = options || {};
        options.length = options.length || 10; // *100milliseconds
        options.mode = options.mode || 1;
        options.strength = options.strength || 10;
        COMMANDS.VIBRATE(token, new Uint8Array([options.length, options.mode, options.strength]), win, fail);
    };

    /**
     * Send data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {ArrayBuffer|Uint8Array} data data to be sent
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    rfduinoBluetooth.send = function(token, data, win, fail) {
        var self = this;

        if(!(token.device.haveServices)) {
            rfduinoBluetooth.getServices(token, function() {
                self.send(token, data, win, fail);
            }, fail);
            return;
        }

        // view data as a Uint8Array, unless it already is one.
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

    rfduinoBluetooth._connectError = function(errorCode) {
        AnyBoard.Logger.error('Connect failed: ' + errorCode, this);
    };

    rfduinoBluetooth._readServicesError = function(errorCode) {
        AnyBoard.Logger.error('Read services failed: ' + errorCode, this);
    };


})();


