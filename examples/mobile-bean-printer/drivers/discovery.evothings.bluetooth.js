"use strict";

/**
 * anyboard-bluetooth-discovery
 *
 * Driver that can be used for discovering, connecting to, and reading services from
 * nearby bluetooth devices. Sets itself as default driver for AnyBoard.TokenManager
 *
 * Dependencies:
 *      AnyBoard (...)
 *      cordova.js (https://cordova.apache.org/)
 *      evothings.ble (https://github.com/evothings/cordova-ble)
 *      evothings.easyble (https://github.com/evothings/evothings-examples/blob/master/resources/libs/evothings/easyble/easyble.js)
 */

(function(){
    var discoveryBluetooth = new AnyBoard.Driver({
        name: 'anyboard-bluetooth-discovery',
        description: 'Driver based off evothings.easyble library for Cordova-based apps. ' +
            'Discovers, connects to and reads characteristics of bluetooth devices',
        dependencies: 'evothings.easyble',
        version: '0.1',
        date: '2015-09-08',
        type: ['bluetooth-discovery'],
        compatibility: []
    });

    discoveryBluetooth._devices = {};

    /**
     * Attempts to connect to a device and retrieves available services.
     *
     * NOTE: Attempts at connecting with certain devices, has executed both win and fail callback.
     * This bug is traced back to Cordova library. It has never occured with Tokens, only with non-compatible
     * bluetooth enabled devices not intended for use with AnyBoard. However it should be handled
     * by your failure function (it should 'cancel' a potenial call to win.)
     *
     * @param {AnyBoard.BaseToken} token token to be connected to
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    discoveryBluetooth.connect = function (token, win, fail) {
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
     * @param {AnyBoard.BaseToken} token token to disconnect from
     */
    discoveryBluetooth.disconnect = function (token) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + token, this);
        token.device && token.device.close()
        token.device.haveServices = false;
    };

    /**
     * Scans for nearby active Bluetooth devices
     * @param {function} win function to be executed upon each result with parameter AnyBoard.BaseToken
     * @param {function} fail function to be executed upon failure with parameter errorCode
     * @param {number} [timeout=5000] number of milliseconds before stopping scan
     */
    discoveryBluetooth.scan = function (win, fail, timeout) {
        if (this.scanning) {
            AnyBoard.Logger.debug('Already scanning. Ignoring new request.', this);
            return;
        }
        this.scanning = true;

        timeout = timeout || 5000;
        AnyBoard.Logger.debug('Scanning for bluetooth devices (timeout: ' + timeout + ')', this);

        var self = this;

        evothings.easyble.reportDeviceOnce(true);
        evothings.easyble.startScan(function(device){
            var token = self._initializeDevice(device);  // Converts bt device to AnyBoard.BaseToken
            win && win(token);
        }, function(errorCode) {
            AnyBoard.Logger.error('Scan failed: ' + errorCode, this);
            fail && fail(errorCode);
        });

        setTimeout(function() {self._completeScan()}, timeout);
    };

    /**
     * Returns token with a spesific address
     * @param {string} address adress of token
     * @returns {AnyBoard.BaseToken}
     */
    discoveryBluetooth.getToken = function(address) {
        return this._devices[address];
    };

    /*
     * Internal method executed upon completing scan
     * @param {function} [callback] function to be executed with the all discovered devices
     */
    discoveryBluetooth._completeScan = function(callback) {
        AnyBoard.Logger.debug('Stopping scan for bluetooth devices...', this);
        evothings.easyble.stopScan();
        this.scanning = false;
        callback && callback(this._devices);
    };

    /*
     * Internal method that creates and stores, or retrieves token based on connection info
     * @param {object} device connectionObject from evothings.ble upon scan
     * @returns {AnyBoard.BaseToken} token instance of token generated
     * @private
     */
    discoveryBluetooth._initializeDevice = function(device) {
        AnyBoard.Logger.log('Device found: ' + device.name + ' address: ' + device.address + ' rssi: ' + device.rssi);
        if (!this._devices[device.address]) {
            device.sendGtHeader = 0x80;
            device.gettingServices = false;
            device.serialChar = null; // Characteristic handle for serial write, set on getServices()
            device.serialDesc = null; // Description for characteristic handle, set on getServices()
            device.singlePacketWrite = true;
            var token = new AnyBoard.BaseToken(device.name, device.address, device, this);
            this._devices[device.address] = token;
            return token;
        }
        AnyBoard.Logger.log('Device already in _devices property', this);
        return this._devices[device.address];
    };

    /*
     * Internal method. Initializes token. Queries for services and characteristics and sets
     * driver property on token to a supported driver if successful (win callback called)
     * @param {AnyBoard.BaseToken} token token to find services from
     * @param {function} [win] callback to be called upon success with token as parameter
     * @param {function} [fail] callback to be called upon failure
     */
    discoveryBluetooth.getServices = function(token, win, fail) {
        var device = token.device;
        if (device.gettingServices)
            return;

        var self = this;
        device.gettingServices = true;
        AnyBoard.Logger.log('Fetch services for ' + token, self);
        evothings.ble.readAllServiceData(
            device.deviceHandle,
            function(services) {
                device.services = {};
                device.characteristics = {};
                device.descriptors = {};

                var driver;

                for (var si in services)
                {
                    var service = services[si];
                    device.services[service.uuid] = service;
                    AnyBoard.Logger.debug('Service: ' + service.uuid);

                    for (var ci in service.characteristics) {
                        var characteristic = service.characteristics[ci];
                        AnyBoard.Logger.debug('Characteristic: ' + characteristic.uuid);

                        device.characteristics[characteristic.uuid] = characteristic;

                        if (!driver) {
                            driver = AnyBoard.Drivers.getCompatibleDriver('bluetooth', {
                                characteristic_uuid: characteristic.uuid,
                                service_uuid: service.uuid
                            });
                            if (driver) {
                                device.serialChar = characteristic.handle;
                                token.driver = driver;
                            }
                        }

                        for (var di in characteristic.descriptors) {
                            var descriptor = characteristic.descriptors[di];
                            AnyBoard.Logger.debug('Descriptor: ' + descriptor.uuid);
                            device.descriptors[descriptor.uuid] = descriptor;

                            if (!driver) {
                                driver = AnyBoard.Drivers.getCompatibleDriver('bluetooth', {
                                    descriptor_uuid: descriptor.uuid,
                                    characteristic_uuid: characteristic.uuid,
                                    service_uuid: service.uuid
                                });
                                if (driver) {
                                    device.serialChar = characteristic.handle;
                                    device.serialDesc = descriptor.handle;
                                    token.driver = driver;
                                }
                            }
                        }
                    }
                }

                if (device.serialChar)
                {
                    device.haveServices = true;
                    device.gettingServices = false;
                    token.driver.hasOwnProperty('initialize') && token.driver.initialize(token);
                    win && win(token);
                }
                else
                {
                    device.gettingServices = false;
                    AnyBoard.Logger.error('Could not find predefined services for token:' + device.name, self);
                    fail && fail('Services not found!');
                }
            },
            function(errorCode) {
                device.gettingServices = false;
                AnyBoard.Logger.error('Could not fetch services for token ' + device.name + '. ' + errorCode, self);
                fail && fail(errorCode);
            }
        );
    };

    /* Set as default communication driver */
    AnyBoard.TokenManager.setDriver(AnyBoard.Drivers.get('anyboard-bluetooth-discovery'));

})();
