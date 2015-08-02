"use strict";

/**
 * Driver for evothings.ble based on cordova
 * requires evothings.easyble
 */

(function(){
    var evothingsBluetooth = new AnyBoard.Driver({
        name: 'evothings-easyble-bean',
        description: 'Driver based off evothings.easyble library for Cordova-based apps',
        dependencies: 'evothings.easyble',
        version: '0.1',
        date: '2015-08-01'
    });

    evothingsBluetooth.detectedDevices = [];

    /**
     * Attempts to connect to a device
     * @param {BluetoothDevice} device
     * @param {function} win
     * @param {function} fail
     */
    evothingsBluetooth.connect = function (device, win, fail) {
        AnyBoard.Logger.debug('Attempting to connect to device: ' + device.name, this);
        evothings.easyble.connectToDevice(device, win, fail);
    };

    /**
     * Disconnects from device
     * @param {BluetoothDevice} device
     */
    evothingsBluetooth.disconnect = function (device) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + device.name, this);
        device && device.close()
    };

    /**
     * Scans for nearby active Bluetooth devices
     * @param {function} win function to be executed upon success with parameter listOfDevices
     * @param {function} fail function to be executed upon failure with parameter errorCode
     * @param {number} timeout *(default: 5000)* number of milliseconds before stopping scan
     */
    evothingsBluetooth.scan = function (win, fail, timeout) {
        if (this.scanning) {
            AnyBoard.Logger.debug('Already scanning. Ignoring new request.', this);
            return;
        }
        this.scanning = true;
        AnyBoard.Logger.debug('Scanning for bluetooth devices (timeout: ' + timeout + ')', this);

        this.detectedDevices = [];
        timeout = timeout || 5000;


        var self = this;

        // Specify that devices are reported repeatedly so that
        // we get the most recent RSSI reading for each device.
        evothings.easyble.reportDeviceOnce(true);
        evothings.easyble.startScan(function(device){
            self._deviceDetected(device);
            win(device)
        }, function(errorCode) {
            self._scanError(errorCode);
            fail(errorCode);
        });

        setTimeout(function() {hyper.log(timeout); self._completeScan()}, timeout);
    };

    evothingsBluetooth._completeScan = function(callback) {
        AnyBoard.Logger.debug('Stopping scan for bluetooth devices...', this);
        evothings.easyble.stopScan();
        this.scanning = false;
        callback && callback(this.detectedDevices);
    };

    evothingsBluetooth._deviceDetected = function(device) {
        AnyBoard.Logger.log('Device found: ' + device.name + ' rssi: ' + device.rssi);
        if (this.detectedDevices.indexOf(device) === -1)
            this.detectedDevices.push(device);
        else
            AnyBoard.Logger.log('Device already in detectedDevices property', this);
    };

    evothingsBluetooth._scanError = function(errorCode) {
        AnyBoard.Logger.error('Scan failed: ' + errorCode, this);
        this.scanning = false;
    };

    evothingsBluetooth._connectError = function(errorCode) {
        AnyBoard.Logger.error('Connect failed: ' + errorCode, this);
    };

    evothingsBluetooth._readServicesError = function(errorCode) {
        AnyBoard.Logger.error('Read services failed: ' + errorCode, this);
    };

    // Set as default bluetooth driver
    AnyBoard.TokenManager.bleDriver = AnyBoard.Drivers.drivers['evothings-easyble-bean'];
})();


