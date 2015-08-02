//
// Copyright 2014, Evothings AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// LightBlue Bean - Basic
// version: 1.0 - 2014-10-28
//
// This implementation makes it possible to connect to a LightBlue Bean
// and control the LED. It also fetches the temperature from the board.
//
// The LightBlue Bean needs to run the arduino sketch example named
// LightBlue Bean - Basic

console.log = hyper.log;

var bean = evothings.bean;

var app = {
	fail: function(error) {
		console.log("fail: "+error);
		var span = document.getElementById('status');
		span.innerHTML = "failed";
	},

	// Called when device plugin functions are ready for use.
	onDeviceReady: function() {
		var span = document.getElementById('status');
		bean.observeConnectionState(function(state) {
			console.log(state);
			span.innerHTML = state;
		});

		bean.connectToFirstDevice(function() {
			// set up serial comms
			bean.startSerialRead(app.handleSerialRead, app.fail);
			app.serialWrite();
		}, app.fail);
	},

	bytesToHexString: function(data) {
		var hex = '';
		for(var i=0; i<data.byteLength; i++) {
			hex += (data[i] >> 4).toString(16);
			hex += (data[i] & 0xF).toString(16);
		}
		return hex;
	},

	handleSerialRead: function(data) {
		//console.log(data.byteLength + " bytes.");
		// dump raw data
		var hex = app.bytesToHexString(data);
		console.log('SerialRead: ' + hex + " ("+evothings.ble.fromUtf8(data)+")");
	},

	computeCRC16: function(data) {
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
	},

	whiteLed: function() {
		app.serialWriteString('{"device":"LED","event":"on","color":"white"}');
	},

	redLed: function() {
		app.serialWriteString('{"device":"LED","event":"on","color":"red"}');
	},

	blueLed: function() {
		app.serialWriteString('{"device":"LED","event":"on","color":"blue"}');
	},

	greenLed: function() {
		app.serialWriteString('{"device":"LED","event":"on","color":"green"}');
	},

	noLed: function() {
		app.serialWriteString('{"device":"LED","event":"off"}');
	},

	serialWrite: function() {
		var data = new Uint8Array([0x01]);
		app.serialWriteData(data);
	},

	serialWriteString: function(string) {
		var data = new Uint8Array(evothings.ble.toUtf8(string));
		app.serialWriteData(data);
	},

	serialWriteData: function(data) {
		bean.serialWrite(
			data,
			function() {
				console.log("write success");
				// Send data. When commented out evaluate app.serialWrite()
				// in the Workbench Tools window to send data.
				/*if(app.writeCount < 5) {
					app.writeCount++;
					setTimeout(function(){app.serialWrite()}, 1000);
				}*/
			},
			app.fail);
	}
}

document.addEventListener('deviceready', app.onDeviceReady, false);