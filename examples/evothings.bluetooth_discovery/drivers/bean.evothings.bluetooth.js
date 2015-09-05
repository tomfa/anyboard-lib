"use strict";

/**
 * Driver for evothings.ble based on cordova
 * requires evothings.easyble, evothings.ble
 */

(function(){
    var beanBluetooth = new AnyBoard.Driver({
        name: 'anyboard-bean-token',
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

    beanBluetooth._devices = {};

    beanBluetooth._GenericSend = function(name, functionId, hasParams, useCache) {
        var internalSend = function(token, data, win, fail) {
            AnyBoard.Logger.debug("Executing " + name, token);
            if (useCache && token.cache[name]) {
                win && win(token.cache[name]);
                return;
            }
            beanBluetooth.send(
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
            if (typeof data === 'string') data = beanBluetooth._stringToUint8(data);
            var newData = new Uint8Array(data.length+1);
            newData[0] = functionId;
            for (var index in data) {
                if (data.hasOwnProperty(index))
                    newData[parseInt(index)+1] = data[index];
            }
            internalSend(token, newData, win, fail);
        }
    };

    beanBluetooth._CMD_CODE = {
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
        HAS_TEMPERATURE: 74,
        HAS_PRINT: 75,
        PRINT_FEED: 137,
        PRINT_JUSTIFY: 138,
        PRINT_SET_SIZE: 139,
        PRINT_WRITE: 140,
        PRINT_NEWLINE: 141
    };


    // Internal mapping between color strings to Uint8 array of RGB colors
    beanBluetooth._COLORS = {
        'red': new Uint8Array([255, 0, 0]),
        'green': new Uint8Array([0, 255, 0]),
        'blue': new Uint8Array([0, 0, 255]),
        'white': new Uint8Array([255, 255, 255]),
        'pink': new Uint8Array([255, 0, 255]),
        'yellow': new Uint8Array([255, 255, 0]),
        'aqua': new Uint8Array([0, 255, 255]),
        'off': new Uint8Array([0, 0, 0])
    };

    // Internal mapping and generation of commands
    var NO_PARAMS = false;
    var HAS_PARAMS = true;
    var USE_CACHE = true;
    beanBluetooth._COMMANDS = {
        GET_NAME: beanBluetooth._GenericSend(
            "GET_NAME",
            beanBluetooth._CMD_CODE.GET_NAME,
            NO_PARAMS,
            USE_CACHE),
        GET_VERSION: beanBluetooth._GenericSend(
            "GET_VERSION",
            beanBluetooth._CMD_CODE.GET_VERSION,
            NO_PARAMS,
            USE_CACHE),
        GET_UUID: beanBluetooth._GenericSend(
            "GET_UUID",
            beanBluetooth._CMD_CODE.GET_UUID,
            NO_PARAMS,
            USE_CACHE),
        GET_BATTERY_STATUS: beanBluetooth._GenericSend(
            "GET_BATTERY_STATUS",
            beanBluetooth._CMD_CODE.GET_BATTERY_STATUS,
            NO_PARAMS),
        LED_OFF: beanBluetooth._GenericSend(
            "LED_OFF",
            beanBluetooth._CMD_CODE.LED_OFF,
            NO_PARAMS),
        LED_ON: beanBluetooth._GenericSend(
            "LED_ON",
            beanBluetooth._CMD_CODE.LED_ON,
            HAS_PARAMS),
        LED_BLINK: beanBluetooth._GenericSend(
            "LED_BLINK",
            beanBluetooth._CMD_CODE.LED_BLINK,
            HAS_PARAMS),
        HAS_LED: beanBluetooth._GenericSend(
            "HAS_LED",
            beanBluetooth._CMD_CODE.HAS_LED,
            NO_PARAMS,
            USE_CACHE),
        HAS_LED_COLOR: beanBluetooth._GenericSend(
            "HAS_LED_COLOR",
            beanBluetooth._CMD_CODE.HAS_LED_COLOR,
            NO_PARAMS,
            USE_CACHE),
        HAS_VIBRATION: beanBluetooth._GenericSend(
            "HAS_VIBRATION",
            beanBluetooth._CMD_CODE.HAS_VIBRATION,
            NO_PARAMS,
            USE_CACHE),
        HAS_COLOR_DETECTION: beanBluetooth._GenericSend(
            "HAS_COLOR_DETECTION",
            beanBluetooth._CMD_CODE.HAS_COLOR_DETECTION,
            NO_PARAMS,
            USE_CACHE),
        HAS_LED_SCREEN: beanBluetooth._GenericSend(
            "HAS_LED_SCREEN",
            beanBluetooth._CMD_CODE.HAS_LED_SCREEN,
            NO_PARAMS,
            USE_CACHE),
        HAS_RFID: beanBluetooth._GenericSend(
            "HAS_RFID",
            beanBluetooth._CMD_CODE.HAS_RFID,
            NO_PARAMS,
            USE_CACHE),
        HAS_NFC: beanBluetooth._GenericSend(
            "HAS_NFC",
            beanBluetooth._CMD_CODE.HAS_NFC,
            NO_PARAMS,
            USE_CACHE),
        HAS_ACCELEROMETER: beanBluetooth._GenericSend(
            "HAS_ACCELEROMETER",
            beanBluetooth._CMD_CODE.HAS_ACCELEROMETER,
            NO_PARAMS,
            USE_CACHE),
        HAS_TEMPERATURE: beanBluetooth._GenericSend(
            "HAS_TEMPERATURE",
            beanBluetooth._CMD_CODE.HAS_TEMPERATURE,
            NO_PARAMS,
            USE_CACHE),
        HAS_PRINT: beanBluetooth._GenericSend(
            "HAS_PRINT",
            beanBluetooth._CMD_CODE.HAS_PRINT,
            NO_PARAMS,
            USE_CACHE),
        PRINT_FEED: beanBluetooth._GenericSend(
            "PRINT_FEED",
            beanBluetooth._CMD_CODE.PRINT_FEED,
            NO_PARAMS),
        PRINT_JUSTIFY: beanBluetooth._GenericSend(
            "PRINT_JUSTIFY",
            beanBluetooth._CMD_CODE.PRINT_JUSTIFY,
            HAS_PARAMS),
        PRINT_SET_SIZE: beanBluetooth._GenericSend(
            "PRINT_SET_SIZE",
            beanBluetooth._CMD_CODE.PRINT_SET_SIZE,
            HAS_PARAMS),
        PRINT_WRITE: beanBluetooth._GenericSend(
            "PRINT_WRITE",
            beanBluetooth._CMD_CODE.PRINT_WRITE,
            HAS_PARAMS),
        PRINT_NEWLINE: beanBluetooth._GenericSend(
            "PRINT_NEWLINE",
            beanBluetooth._CMD_CODE.PRINT_NEWLINE,
            NO_PARAMS)
    };
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
    beanBluetooth.connect = function (token, win, fail) {
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
    beanBluetooth.disconnect = function (token) {
        AnyBoard.Logger.debug('Disconnecting from device: ' + token, this);
        token.device && token.device.close()
        token.device.haveServices = false;
    };

    beanBluetooth.getName = function (token, win, fail) {
        this._COMMANDS.GET_NAME(token, win, fail);
    };

    beanBluetooth.getVersion = function (token, win, fail) {
        this._COMMANDS.GET_VERSION(token, win, fail);
    };

    beanBluetooth.getUUID = function (token, win, fail) {
        this._COMMANDS.GET_UUID(token, win, fail);
    };

    beanBluetooth.hasLed = function(token, win, fail) {
        this._COMMANDS.HAS_LED(token, win, fail);
    };

    beanBluetooth.hasLedColor = function(token, win, fail) {
        this._COMMANDS.HAS_LED_COLOR(token, win, fail);
    };

    beanBluetooth.hasVibration = function(token, win, fail) {
        this._COMMANDS.HAS_VIBRATION(token, win, fail);
    };

    beanBluetooth.hasColorDetection = function(token, win, fail) {
        this._COMMANDS.HAS_COLOR_DETECTION(token, win, fail);
    };

    beanBluetooth.hasLedSceen = function(token, win, fail) {
        this._COMMANDS.HAS_LED_SCREEN(token, win, fail);
    };

    beanBluetooth.hasRfid = function(token, win, fail) {
        this._COMMANDS.HAS_RFID(token, win, fail);
    };

    beanBluetooth.hasNfc = function(token, win, fail) {
        this._COMMANDS.HAS_NFC(token, win, fail);
    };

    beanBluetooth.hasAccelometer = function(token, win, fail) {
        this._COMMANDS.HAS_ACCELEROMETER(token, win, fail);
    };

    beanBluetooth.hasTemperature = function(token, win, fail) {
        this._COMMANDS.HAS_TEMPERATURE(token, win, fail);
    };

    beanBluetooth.ledOn = function (token, value, win, fail) {
        value = value || 'white';

        if (typeof value === 'string' && value in this._COLORS) {
            this._COMMANDS.LED_ON(token, this._COLORS[value], win, fail);
        } else if ((value instanceof Array || value instanceof Uint8Array) && value.length === 3) {
            this._COMMANDS.LED_ON(token, new Uint8Array([value[0], value[1], value[2]]), win, fail);
        } else {
            fail && fail('Invalid or unsupported color parameters');
        }
    };

    beanBluetooth.ledBlink = function (token, value, win, fail) {
        value = value || 'white';

        if (typeof value === 'string' && value in this._COLORS) {
            beanBluetooth.ledBlink(token, this._COLORS[value], win, fail);
        } else if ((value instanceof Array || value instanceof Uint8Array) && value.length === 3) {
            this._COMMANDS.LED_BLINK(token, new Uint8Array([value[0], value[1], value[2], 30]), win, fail);
        } else {
            fail && fail('Invalid or unsupported color parameters');
        }
    };

    beanBluetooth.ledOff = function (token, win, fail) {
        this._COMMANDS.LED_OFF(token, win, fail);
    };

    beanBluetooth.hasPrint = function (token, win, fail) {
        COMMANDS.HAS_PRINT(token, win, fail);
    };

    beanBluetooth.print = function (token, string, win, fail) {
        if (token._isPrinting) {
            setTimeout(
                function(){beanBluetooth.print(token, string, win, fail)}
                , 3000
            );
            return;
        }
        token._isPrinting = true;
        var commands = {
            "##l": function() {beanBluetooth._COMMANDS.PRINT_JUSTIFY(token, 'l')} ,
            "##c": function() {beanBluetooth._COMMANDS.PRINT_JUSTIFY(token, 'c')} ,
            "##r": function() {beanBluetooth._COMMANDS.PRINT_JUSTIFY(token, 'r')} ,
            "##L": function() {beanBluetooth._COMMANDS.PRINT_SET_SIZE(token, 'L')} ,
            "##S": function() {beanBluetooth._COMMANDS.PRINT_SET_SIZE(token, 'S')} ,
            "##M": function() {beanBluetooth._COMMANDS.PRINT_SET_SIZE(token, 'M')} ,
            "##f": function() {beanBluetooth._COMMANDS.PRINT_FEED(token)},
            "##n": function() {beanBluetooth._COMMANDS.PRINT_NEWLINE(token)}
        };

        var run = function(inc) {
            if (!inc) {
                token._isPrinting = false;
                win && win();
                return;
            }
            var remains = "";
            var command;
            var sleep = 800;

            var firstpos = inc.indexOf("##");
            if (firstpos === -1) {
                beanBluetooth._COMMANDS.PRINT_WRITE(token, inc.substr(0, 12));
                remains = inc.substr(12);
                sleep = 2000;
            } else if (firstpos !== 0) {
                beanBluetooth._COMMANDS.PRINT_WRITE(token, inc.substr(0, Math.min(12, firstpos)));
                remains = inc.substr(Math.min(12, firstpos));
                sleep = 2000;
            } else {
                command = inc.substr(0, 3);
                remains = inc.substr(3);
                if (command in commands) {
                    commands[command]();
                }
            }
            setTimeout(function(){
                run(remains);
            }, sleep)
        };

        run(string);
    };
    /**
     * Reads a scratchBank on the LightBlue Bean
     * @param {AnyBoard.BaseToken} token
     * @param {number} scratchNumber which scratchBank to read from
     * @param {function} win callback function to be executed with param Uint8Array once return
     * @param {function} fail callback function to be executed upon error
     */
    beanBluetooth.readScratchBank = function(token, scratchNumber, win, fail) {
        var uuidScratchCharacteristic = ['a495ff21-c5b1-4b44-b512-1370f02d74de',
                'a495ff22-c5b1-4b44-b512-1370f02d74de',
                'a495ff23-c5b1-4b44-b512-1370f02d74de',
                'a495ff24-c5b1-4b44-b512-1370f02d74de',
                'a495ff25-c5b1-4b44-b512-1370f02d74de'][scratchNumber - 1];

        evothings.ble.readCharacteristic(
            token.device.deviceHandle,
            token.device.characteristics[uuidScratchCharacteristic].handle,
            win,
            fail);
    };

    /**
     * Sending data to bean.
     *
     * See https://github.com/PunchThrough/bean-documentation/blob/master/app_message_types.md
     * and https://github.com/PunchThrough/bean-documentation/blob/master/serial_message_protocol.md
     * for information on Bean spesific BLE protocol
     *
     * @param token
     * @param data
     * @param win
     * @param fail
     */
    beanBluetooth.rawSend = function(token, data, win, fail) {
        // 6 = length+reserved+messageId+crc.
        var gstPacketLength = data.byteLength + 6;
        var buffer = this._gtBuffer(token, gstPacketLength);

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
            if (i == buffer.packetCount) {
                win();
            } else {
                var packet = buffer.packet(i);
                AnyBoard.Logger.debug("write packet "+ beanBluetooth._bytesToHexString(packet), token);
                evothings.ble.writeCharacteristic(
                    token.device.deviceHandle,
                    token.device.serialChar, packet, partWin, fail);
                i++;
            }
        };
        partWin();
    };

    /**
     * Send data to device
     * @param {AnyBoard.BaseToken} token token to send data to
     * @param {ArrayBuffer|Uint8Array} data data to be sent
     * @param {function} win function to be executed upon success
     * @param {function} fail function to be executed upon failure
     */
    beanBluetooth.send = function(token, data, win, fail) {
        var self = this;

        if (!(token.device.haveServices)) {
            this.getServices(token, function() {
                self.send(token, data, win, fail);
            }, fail);
            return;
        }

        if (typeof data === 'string')
            data = beanBluetooth._stringToUint8(data);

        if (data.buffer) {
            if (!(data instanceof Uint8Array)) {
                data = new Uint8Array(data.buffer);
            }
        } else if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        } else {
            AnyBoard.Logger.error("send data is not an ArrayBuffer.", this);
            fail && fail('Invalid send data');
            return;
        }

        if (data.byteLength > 13) {
            AnyBoard.Logger.warn("cannot send data of length over 13 byte.", this);
        }

        if (token.sendQueue.length === 0) {  // this was first command
            token.sendQueue.push(function(){ beanBluetooth.rawSend(token, data, win, fail); });
            beanBluetooth.rawSend(token, data, win, fail);

        } else {
            token.sendQueue.push(function(){ beanBluetooth.rawSend(token, data, win, fail); });

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
            }, 2000)
        }

    };

    /**
     * Scans for nearby active Bluetooth devices
     * @param {function} win function to be executed upon each result with parameter AnyBoard.BaseToken
     * @param {function} fail function to be executed upon failure with parameter errorCode
     * @param {number} timeout *(default: 5000)* number of milliseconds before stopping scan
     */
    beanBluetooth.scan = function (win, fail, timeout) {
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

    beanBluetooth.getToken = function(address) {
        return this._devices[address];
    };

    beanBluetooth._completeScan = function(callback) {
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
    beanBluetooth._initializeDevice = function(device) {
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
    beanBluetooth.getServices = function(token, win, fail) {
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
                    fail('Services not found!');
                }
            },
            function(errorCode) {
                device.gettingServices = false;
                AnyBoard.Logger.error('Could not fetch services for token ' + device.name + '. ' + errorCode, self);
                fail && fail(errorCode);
            }
        );
    };

    /**
     * Internal method that subscribes to updates from the token
     * @param token
     * @param callback
     * @param success
     * @param fail
     */
    beanBluetooth._subscribe = function(token, callback, success, fail) {
        evothings.ble.writeDescriptor(
            token.device.deviceHandle,
            token.device.serialDesc,
            new Uint8Array([1, 0]),
            function (data) {
                AnyBoard.Logger.log("successfully subscribed to notifications from", token);
                success && success();
            },
            function (data) {
                AnyBoard.Logger.log("failed at subscribing to notifications from", token);
                fail && fail();
            }
        );

        evothings.ble.enableNotification(token.device.deviceHandle, token.device.serialChar, function (data) {
            data = new Uint8Array(data);
            var gtHeader = data[0];

            if ((gtHeader & 0x9f) != 0x80) {
                beanBluetooth._handleMultiGST(token, data, gtHeader, callback);
                return;
            }

            if (data.byteLength < 8) {
                AnyBoard.Logger.log("ignoring GT packet with bad length: " + data.byteLength, token);
                return;
            }

            var length = data[1];
            var majorId = data[3];
            var minorId = data[4];

            if (length != data.byteLength - 5) {
                AnyBoard.Logger.warn("ignoring incoming serial msg with bad length: " + length, token);
                return;
            }
            if (majorId != 0 || minorId != 0) {
                AnyBoard.Logger.log("Ignoring incoming serial msg with unknown ID " + beanBluetooth._bytesToHexString(data, 3, 2), token);
                return;
            }

            // TODO: The Cycle Redundency Check value fails, and I don't know why
            //var crc = beanBluetooth._computeCRC16(data, 1, length + 2);
            //if(data[data.byteLength-1] != ((crc >> 8) & 0xff) || data[data.byteLength-2] != (crc & 0xff)) {
            //    AnyBoard.Logger.log("ignoring GST message with bad CRC (our crc "+crc.toString(16)+", data "+bean.bytesToHexString(data, 1, length+2)+")");
            //    return;
            //}

            callback(data.subarray(5, data.byteLength - 2));
        }, function (error) {
            AnyBoard.Logger.warn("Failed at parsing incoming serial message: " + error, token)
        });
    };

    /**
     * Handle multipackets
     * @param data
     * @param gtHeader
     * @private
     */
    beanBluetooth._handleMultiGST = function(token, data, gtHeader, callback) {
        var counter = gtHeader & 0x60;
        var remain = gtHeader & 0x1f;
        var first = (gtHeader & 0x80) == 0x80;
        var length = data[1];

        if(first) {
            if(length > 66) {
                AnyBoard.Logger.log("ignoring GST packet with bad length: "+length);
                return;
            }

            token._gstBuffer = new Uint8Array(length+4);
            // copy data, after GT header, length byte and Reserved byte, into buffer.
            token._gstBuffer.set(data.subarray(1));
            token._gstPosition = data.byteLength - 1;
            token._gstCounter = counter;
        } else {
            if(!token._gstBuffer) {
                AnyBoard.Logger.log("second packet received before first!");
                return;
            }
            if(counter != token._gstCounter) {
                AnyBoard.Logger.log("GT counter mismatch!");
                return;
            }
            if(remain != token._gstRemain - 1) {
                AnyBoard.Logger.log("GT remain mismatch!");
                return;
            }
            // copy data after GT header into the unwritten part of gstBuffer.
            token._gstBuffer.subarray(token._gstPosition).set(data.subarray(1));
            token._gstPosition += data.byteLength - 1;
        }
        token._gstRemain = remain;
        if(remain == 0) {
            data = token._gstBuffer;
            // check message id
            if(data[2] != 0 || data[3] != 0) {
                AnyBoard.Logger.log("ignoring App message with unknown ID " + bean.bytesToHexString(data, 2, 2));
                return;
            }

            //// check crc
            //var crc = beanBluetooth._computeCRC16(data, 0, data.byteLength-2);
            //if(data[data.byteLength-1] != ((crc >> 8) & 0xff) || data[data.byteLength-2] != (crc & 0xff)) {
            //    AnyBoard.Logger.log("ignoring GST message with bad CRC (our crc "+crc.toString(16)+", data "+bean.bytesToHexString(data)+")");
            //    return;
            //}
            token._gstBuffer = false;
            callback(data.subarray(4, data.byteLength-2));

        }
    };

    /**
     * The initialize-methods is called automatically (or should be) from the master communication driver upon connect
     * to a device.
     *
     * In this initialize method, we subscribe to notifications sent by the rfduino device, and trigger events
     * on the token class upon receiving data.
     */
    beanBluetooth.initialize = function(token) {
        var cb = function(uint8array) {
            var cmd = uint8array[0];
            var strData = "";

            switch (cmd) {
                case beanBluetooth._CMD_CODE.GET_BATTERY_STATUS:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_BATTERY_STATUS', {"value": strData});
                    break;
                case beanBluetooth._CMD_CODE.MOVE:
                    token.trigger('MOVE', {"value": uint8array[1], "newTile": uint8array[1], "oldTile": uint8array[2]});
                    break;
                case beanBluetooth._CMD_CODE.GET_NAME:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_NAME', {"value": strData});
                    break;
                case beanBluetooth._CMD_CODE.GET_VERSION:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_VERSION', {"value": strData});
                    break;
                case beanBluetooth._CMD_CODE.GET_UUID:
                    for (var i = 1; i < uint8array.length; i++)
                        strData += String.fromCharCode(uint8array[i])
                    token.trigger('GET_UUID', {"value": strData});
                    break;
                case beanBluetooth._CMD_CODE.LED_BLINK:
                    token.trigger('LED_BLINK');
                    break;
                case beanBluetooth._CMD_CODE.LED_OFF:
                    token.trigger('LED_OFF');
                    break;
                case beanBluetooth._CMD_CODE.LED_ON:
                    token.trigger('LED_ON');
                    break;
                case beanBluetooth._CMD_CODE.HAS_LED:
                    token.trigger('HAS_LED', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_LED_COLOR:
                    token.trigger('HAS_LED_COLOR', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_VIBRATION:
                    token.trigger('HAS_VIBRATION', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_COLOR_DETECTION:
                    token.trigger('HAS_COLOR_DETECTION', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_LED_SCREEN:
                    token.trigger('HAS_LED_SCREEN', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_RFID:
                    token.trigger('HAS_RFID', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_NFC:
                    token.trigger('HAS_NFC', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_ACCELEROMETER:
                    token.trigger('HAS_ACCELEROMETER', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_TEMPERATURE:
                    token.trigger('HAS_TEMPERATURE', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.HAS_PRINT:
                    token.trigger('HAS_PRINT', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.PRINT_FEED:
                    token.trigger('PRINT_FEED', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.PRINT_JUSTIFY:
                    token.trigger('PRINT_JUSTIFY', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.PRINT_SET_SIZE:
                    token.trigger('PRINT_SET_SIZE', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.PRINT_WRITE:
                    token.trigger('PRINT_WRITE', {"value": uint8array[1]})
                    break;
                case beanBluetooth._CMD_CODE.PRINT_NEWLINE:
                    token.trigger('PRINT_NEWLINE', {"value": uint8array[1]})
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

        this._subscribe(token, cb);
    };

    beanBluetooth._scanError = function(errorCode) {
        AnyBoard.Logger.error('Scan failed: ' + errorCode, this);
        this.scanning = false;
    };

    beanBluetooth._connectError = function(errorCode) {
        AnyBoard.Logger.error('Connect failed: ' + errorCode, this);
    };

    beanBluetooth._readServicesError = function(errorCode) {
        AnyBoard.Logger.error('Read services failed: ' + errorCode, this);
    };

    beanBluetooth._computeCRC16 = function(data) {
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
    beanBluetooth._gtBuffer = function(token, gstPacketLength) {
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
                if ((pos % 20) == 0) {

                    // Decrement the local packetCount. This should not affect the member packetCount.
                    buf[pos] = beanBluetooth._gtHeader(token, --packetCount, pos);
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
    beanBluetooth._gtHeader = function(token, remain, pos) {
        var h = token.device.sendGtHeader + (remain);
        if (remain == 0) {
            token.device.sendGtHeader = (token.device.sendGtHeader + 0x20) & 0xff;
            if (token.device.sendGtHeader < 0x80) token.device.sendGtHeader = 0x80;
        }
        if (pos != 0) h &= 0x7f;
        return h;
    };

    beanBluetooth._bytesToHexString = function(data, offset, length) {
        offset = offset || 0;
        length = length || data.byteLength;
        var hex = '';
        for(var i=offset; i<(offset+length); i++) {
            hex += (data[i] >> 4).toString(16);
            hex += (data[i] & 0xF).toString(16);
        }
        return hex;
    };

    beanBluetooth._stringToUint8 = function(string) {
        return new Uint8Array(evothings.ble.toUtf8(string));
    };

    // Set as default communication driver
    AnyBoard.TokenManager.setDriver(AnyBoard.Drivers.get('anyboard-bean-token'));

})();
