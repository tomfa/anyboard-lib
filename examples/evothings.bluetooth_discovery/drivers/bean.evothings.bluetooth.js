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

    evothingsBluetooth._devices = {};

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
    evothingsBluetooth.connect = function (token, win, fail) {
        var self = this;

        token.device.connect(function(device) {
            self.getServices(token, win, fail);
        }, function(errorCode) {
            fail(errorCode);
        });
    };

    /**
     * Disconnects from device
     * @param {AnyBoard.BaseToken} token
     */
    evothingsBluetooth.disconnect = function (token) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + token, this);
        token.device && token.device.close()
    };

    /**
     * Sends data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {string} string regular string.
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    evothingsBluetooth.sendString = function(token, string, win, fail) {
        var data = new Uint8Array(evothings.ble.toUtf8(string));
        this.send(token, data, win, fail);
    };

    /**
     * Send data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {ArrayBuffer|Uint8Array|Uint16Array|Uint32Array|Float64Array} data data to be sent
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    evothingsBluetooth.send = function(token, data, win, fail) {
        if(!m.haveServices) {
            m.getServices(function() {
                this.serialWrite(data, win, fail);
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
            AnyBoard.Logger.error("serialWrite data is not an ArrayBuffer.", this);
        }

        if(m.singlePacketWrite && data.byteLength > 13) {
            var pos = 0;
            var win2 = function() {
                if(pos < data.byteLength) {
                    var len = Math.min(13, data.byteLength - pos);
                    bean.serialWrite(data.subarray(pos, pos+len), win2, fail);
                    pos += len;
                } else {
                    win();
                }
            }
            bean.serialWrite(data.subarray(pos, pos+13), win2, fail);
            pos = 13;
            return;
        }

        if(data.byteLength > 64) {
            throw "serialWrite data exceeds Bean maximum.";
        }

        // 6 = length+reserved+messageId+crc.
        var gstPacketLength = data.byteLength + 6;
        var buffer = m.gtBuffer(gstPacketLength);

        //evothings.printObject(buffer);

        // GST length
        buffer.append(data.byteLength + 2);

        // GST reserved
        buffer.append(0);

        // App Message Id
        buffer.append(0);
        buffer.append(0);

        // App Message Payload
        for(var i=0; i<data.byteLength; i++) {
            buffer.append(data[i]);
        }

        // GST CRC
        // compute in two steps.
        var crc = m.computeCRC16(buffer.buf, 1, 4);
        crc = m.computeCRC16(data, 0, data.byteLength, crc);
        buffer.append(crc & 0xff);
        buffer.append((crc >> 8) & 0xff);

        var i = 0;
        var partWin = function() {
            if(i == buffer.packetCount) {
                win();
            } else {
                var packet = buffer.packet(i);
                console.log("write packet "+bean.bytesToHexString(packet));
                evothings.ble.writeCharacteristic(m.deviceHandle, m.serialChar, packet, partWin, fail);
                i++;
            }
        }
        partWin();
    };

    /**
     * Scans for nearby active Bluetooth devices
     * @param {function} win function to be executed upon each result with parameter AnyBoard.BaseToken
     * @param {function} fail function to be executed upon failure with parameter errorCode
     * @param {number} timeout *(default: 5000)* number of milliseconds before stopping scan
     */
    evothingsBluetooth.scan = function (win, fail, timeout) {
        if (this.scanning) {
            AnyBoard.Logger.debug('Already scanning. Ignoring new request.', this);
            return;
        }
        this.scanning = true;

        timeout = timeout || 5000;
        AnyBoard.Logger.debug('Scanning for bluetooth devices (timeout: ' + timeout + ')', this);

        var self = this;

        // Specify that devices are reported repeatedly so that
        // we get the most recent RSSI reading for each device.
        evothings.easyble.reportDeviceOnce(true);
        evothings.easyble.startScan(function(device){
            var token = self._initializeDevice(device);
            win(token);
        }, function(errorCode) {
            self._scanError(errorCode);
            fail(errorCode);
        });

        setTimeout(function() {self._completeScan()}, timeout);
    };

    evothingsBluetooth.getToken = function(address) {
        return this._devices[address];
    };

    evothingsBluetooth._completeScan = function(callback) {
        AnyBoard.Logger.debug('Stopping scan for bluetooth devices...', this);
        evothings.easyble.stopScan();
        this.scanning = false;
        callback && callback(this._devices);
    };

    /**
     * Creates and stores, or retrieves token based on connection info
     * @param {object} device connectionObject from evothings.ble upon scan
     * @returns {AnyBoard.BaseToken} token instance of token generated
     * @private
     */
    evothingsBluetooth._initializeDevice = function(device) {
        AnyBoard.Logger.log('Device found: ' + device.name + ' address: ' + device.address + ' rssi: ' + device.rssi);
        if (!this._devices[device.address]) {
            var token = new AnyBoard.BaseToken(device.name, device.address, device, this);
            this._devices[device.address] = token;
            return token;
        }
        AnyBoard.Logger.log('Device already in _devices property', this);
        return this._devices[device.address];
    };

    evothingsBluetooth.getServices = function(token, win, fail) {
        var device = token.device;
        if (device.gettingServices)
            return;


        var self = this;
        device.gettingServices = true;
        AnyBoard.Logger.log('Fetch services for ' + token, self);
        evothings.ble.readAllServiceData(device.deviceHandle, function(services)
            {
                device.services = {};
                device.characteristics = {};
                device.descriptors = {};

                for (var si in services)
                {
                    var service = services[si];
                    device.services[service.uuid] = service;
                    AnyBoard.Logger.debug('Service: ' + service.uuid);

//                    if(service.uuid == 'a495ff10-c5b1-4b44-b512-1370f02d74de')
                        for (var ci in service.characteristics) {
                            var characteristic = service.characteristics[ci];
                            AnyBoard.Logger.debug('Characteristic: ' + characteristic.uuid);

                            device.characteristics[characteristic.uuid] = characteristic;

                            //if (characteristic.uuid == 'a495ff11-c5b1-4b44-b512-1370f02d74de')
                            //{
                                device.serialChar = characteristic.handle;
                                for (var di in characteristic.descriptors) {
                                    var descriptor = characteristic.descriptors[di];
                                    AnyBoard.Logger.debug('Descriptor: ' + descriptor.uuid);
                                    device.descriptors[descriptor.uuid] = descriptor;

                                    //if (descriptor.uuid == '00002902-0000-1000-8000-00805f9b34fb')
                                    //{
                                    //    device.serialDesc = descriptor.handle;
                                    //}
                                }
                            //}
                        }
                }

                //if (device.serialChar && device.serialDesc)
                //{
                //    device.haveServices = true;
                //    device.gettingServices = false;
                //
                //    win();
                //}
                //else
                //{
                //    device.gettingServices = false;
                //    fail('Services not found!');
                //}
                device.gettingServices = false;
                win && win();
            },
            function(errorCode) {
                device.gettingServices = false;
                AnyBoard.Logger.error('Could not fetch services for token ' + device.name + '. ' + errorCode, self);
                fail && fail(errorCode);
            });
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

    evothingsBluetooth._computeCRC16 = function(data) {
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

    // Set as default communication driver
    AnyBoard.TokenManager.setDriver(AnyBoard.Drivers.get('evothings-easyble-bean'));
})();


