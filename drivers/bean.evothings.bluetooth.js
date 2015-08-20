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
        date: '2015-08-01',
        type: ['bluetooth', 'bluetooth-discovery'],
        compatibility: [
            {
                descriptor_uuid: '00002902-0000-1000-8000-00805f9b34fb',
                characteristic_uuid: 'a495ff11-c5b1-4b44-b512-1370f02d74de',
                service_uuid: 'a495ff10-c5b1-4b44-b512-1370f02d74de'
            }
        ]
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
            token.device.haveServices = false;
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
        token.device.haveServices = false;
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
     * @param {ArrayBuffer|Uint8Array} data data to be sent
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    evothingsBluetooth.send = function(token, data, win, fail) {
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
        }

        if (token.device.singlePacketWrite && data.byteLength > 13) {
            var pos = 0;
            var win2 = function() {
                if(pos < data.byteLength) {
                    var len = Math.min(13, data.byteLength - pos);
                    self.send(token, data.subarray(pos, pos+len), win2, fail);
                    pos += len;
                } else {
                    win();
                }
            };
            this.send(token, data.subarray(pos, pos+13), win2, fail);
            pos = 13;
            return;
        }

        if(data.byteLength > 64) {
            throw "serialWrite data exceeds Bean maximum.";
        }

        // 6 = length+reserved+messageId+crc.
        var gstPacketLength = data.byteLength + 6;
        var buffer = this._gtBuffer(token, gstPacketLength);

        //evothings.printObject(buffer);

        // GST length
        buffer.append(data.byteLength + 2);

        // GST reserved
        buffer.append(0);

        // App Message Id
        buffer.append(0);
        buffer.append(0);

        // App Message Payload
        for (var j = 0; j<data.byteLength; j++) {
            buffer.append(data[j]);
        }

        // GST CRC
        // compute in two steps.
        var crc = this._computeCRC16(buffer.buf, 1, 4);
        crc = this._computeCRC16(data, 0, data.byteLength, crc);
        buffer.append(crc & 0xff);
        buffer.append((crc >> 8) & 0xff);

        var i = 0;
        var partWin = function() {
            if(i == buffer.packetCount) {
                win();
            } else {
                var packet = buffer.packet(i);
                AnyBoard.Logger.debug("write packet "+ self._bytesToHexString(packet), token);
                evothings.ble.writeCharacteristic(token.device.deviceHandle, token.device.serialChar, packet, partWin, fail);
                i++;
            }
        };
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

    /**
     * Initializes token. Queries for services and characteristics and sets driver property on token to
     * a supported driver if successful (win callback called)
     * @param {AnyBoard.BaseToken} token token to find services from
     * @param {function} win callback to be called upon success with token as parameter
     * @param {function} fail callback to be called upon failure
     */
    evothingsBluetooth.getServices = function(token, win, fail) {
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

                        for (var di in characteristic.descriptors) {
                            var descriptor = characteristic.descriptors[di];
                            AnyBoard.Logger.debug('Descriptor: ' + descriptor.uuid);
                            device.descriptors[descriptor.uuid] = descriptor;

                            if (!driver) {
                                driver = AnyBoard.Drivers.getCompatibleDriver('bluetooth', {
                                    descriptor_uuid: descriptor_uuid,
                                    characteristic_uuid: characteristic_uuid,
                                    service_uuid: service_uuid
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

                if (device.serialChar && device.serialDesc)
                {
                    device.haveServices = true;
                    device.gettingServices = false;
                    win && win(token);
                }
                else
                {
                    device.gettingServices = false;
                    AnyBoard.Logger.error('Could not find predefined services for BlueBean token:' + device.name, self);
                    fail('Services not found!');
                }
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

    /**
     * Returns an object representing a GT message buffer.
     * @param token
     * @param gstPacketLength
     * @returns {{packetCount: number, buf: Uint8Array, append: Function, packet: Function}}
     * @private
     */
    evothingsBluetooth._gtBuffer = function(token, gstPacketLength) {
        // BLE max is 20. GT header takes 1 byte.
        var packetCount = Math.ceil(gstPacketLength / 19);

        // We'll store all the packets in one buffer.
        var bufferLength = gstPacketLength + packetCount;

        var buf = new Uint8Array(bufferLength);
        var pos = 0;

        return {
            packetCount: packetCount,
            buf: buf,
            append: function(b) {
                // If this is the start of a GT packet, add the GT header.
                if((pos % 20) == 0) {

                    // Decrement the local packetCount. This should not affect the member packetCount.
                    buf[pos] = evothingsBluetooth._gtHeader(token, --packetCount, pos);
                    pos++;
                }
                buf[pos++] = b;
            },
            // Returns the i:th packet in the message.
            packet: function(i) {
                return buf.subarray(i*20, Math.min((i+1)*20, bufferLength));
            }
        };
    };

    /**
     * Returns the next GT header, given the number of packets remaining in the message.
     * @param token
     * @param remain
     * @param pos
     * @returns {*}
     * @private
     */
    evothingsBluetooth._gtHeader = function(token, remain, pos) {
        var h = token.device.sendGtHeader + (remain);
        if(remain == 0) {
            token.device.sendGtHeader = (token.device.sendGtHeader + 0x20) & 0xff;
            if(token.device.sendGtHeader < 0x80) token.device.sendGtHeader = 0x80;
        }
        if(pos != 0) h &= 0x7f;
        return h;
    };

    evothingsBluetooth._bytesToHexString = function(data, offset, length) {
        offset = offset || 0;
        length = length || data.byteLength;
        var hex = '';
        for(var i=offset; i<(offset+length); i++) {
            hex += (data[i] >> 4).toString(16);
            hex += (data[i] & 0xF).toString(16);
        }
        return hex;
    };

    // Set as default communication driver
    AnyBoard.TokenManager.setDriver(AnyBoard.Drivers.get('evothings-easyble-bean'));
})();


