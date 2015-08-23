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
            this.getServices(token, function() {
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
            AnyBoard.Logger.error("send data is not an ArrayBuffer.", this);
            return;
        }

        evothings.ble.writeCharacteristic(token.device.deviceHandle,
            token.device.serialChar,
            data,
            function() {
                hyper.log('writeCharacteristic success');
                win();
            },
            function(errorCode) {
                hyper.log('writeCharacteristic error: ' + errorCode);
            }
        );
    };

    rfduinoBluetooth._connectError = function(errorCode) {
        AnyBoard.Logger.error('Connect failed: ' + errorCode, this);
    };

    rfduinoBluetooth._readServicesError = function(errorCode) {
        AnyBoard.Logger.error('Read services failed: ' + errorCode, this);
    };

    rfduinoBluetooth._computeCRC16 = function(data) {
        var crc = 0xFFFF;

        for (var i=0; i<data.length; i++) {
            var byte = data[i];
            crc = (((crc >> 8) & 0xff) | (crc << 8)) & 0xFFFF;
            crc ^= byte;
            crc ^= ((crc & 0xff) >> 4) & 0xFFFF;
            crc ^= ((crc << 8) << 4) & 0xFFFF;
            crc ^= (((crc & 0xff) << 4) << 1) & 0xFFFF;
        }

        return crc;
    };

    rfduinoBluetooth._bytesToHexString = function(data, offset, length) {
        offset = offset || 0;
        length = length || data.byteLength;
        var hex = '';
        for(var i=offset; i<(offset+length); i++) {
            hex += (data[i] >> 4).toString(16);
            hex += (data[i] & 0xF).toString(16);
        }
        return hex;
    };

})();


