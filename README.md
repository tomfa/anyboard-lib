# AnyboardJS

A simple JS-framework for creating (mobile) games (using IoT devices).

## Use AnyboardJS without IoT devices

1. Click [here to download a full version](https://github.com/tomfa/anyboardjs/raw/master/dist/anyboard.js) or [here to download a minified one](https://github.com/tomfa/anyboardjs/raw/master/dist/anyboard.min.js).
2. Include the following in your head of your html file
``` <script src="dist/AnyBoard.js"></script> ```

For an examples, check out the [examples/html-deck/](./examples/html-deck/).

## Use AnyboardJS with IoT devices
AnyboardJS is decoupled from any bluetooth communication and environment. The communication is handled by separate drivers, which implement the sending and receiving of data from IoT devices.

However, some [drivers](./drivers) and [firmware](./firmware) is available for [LightBlue Bean](http://legacy.punchthrough.com/bean/)
and [rfduino](http://www.rfduino.com/) which is based on a [evothings](evothings.com) + cordova environment.

**You can use the existing drivers and firmware by**

1. Download and install [Evothings](https://evothings.com/download/) to your PC/Mac
2. Download and install [Evothings](https://evothings.com/download/) on your phone
3. Acquire a Anyboard rfduino Token **or** a [LightBlue Bean](http://legacy.punchthrough.com/bean/).
4. Upload [firmware](./firmware) to the device via [Arduino-software](https://www.arduino.cc/en/Main/Software)
5. Create an index.html with the following inside ```<head>```:
```
    <!-- cordova.js -->
	<script src="cordova.js"></script>

    <!-- AnyBoard libraries -->
    <script src="dist/AnyBoard.js"></script>

    <!-- Include evothings -->
    <script src="libs/evothings/evothings.js"></script>
    <script src="libs/evothings/easyble/easyble.js"></script>
    
    <!-- Include bluetooth discovery driver -->
    <script src="drivers/discovery.evothings.bluetooth.js"></script>
    
    <!-- Include driver for LightBlue Bean -->
    <script src="drivers/bean.evothings.bluetooth.js"></script>
    
    <!-- Include driver for AnyboardJS rfduino Pawn-->
    <script src="drivers/rfduino.evothings.bluetooth.js"></script>
```
6. Start writing some code, e.g.
```
<script>
    AnyBoard.TokenManager.scan(function(token) {
            token.connect(function() {
                token.ledBlink("white");
            })
        }
    )
</script>
```

For more examples, check out the [examples](./examples).

## Develop AnyboardJS further
If you wish to contribute to the development of the AnyBoard library, clone this repo. 

### Setup
- Install [node](http://nodejs.org/)
- clone this repo ```git clone git@github.com:tomfa/anyboard.js.git``
- navigate to this folder in console 
- ```npm install``` - installs dependencies

### Create new drivers
There are two type of drivers. One for discovering devices 
(like [discovery.evothings.bluetooth.js](./drivers/discovery.evothings.bluetooth.js)) and one for spesific chips
(like [rfdino.evothings.bluetooth.js](./drivers/rfdino.evothings.bluetooth.js)). If you wish to create a driver
for a new device, copy rfdino.evothing.bluetooth.js and adjust it to the new device.

A new firmware will also have to be made. Copy [BeanToken.ino](./firmware/BeanToken.ino) and adjust
it to the new device.

### Change or add AnyboardJS entities
Change or add AnyboardJS entities by editing or adding files to the [libs](./libs) folder. 
The changes will be automatically added to a new build of Anyboard.js upon ```grunt build```.

### Commands
- ```grunt test``` - runs all tests from files in the folder ```test```
- ```grunt build``` - creates a compiled version under ```/dist``` (full and minified) 
- ```grunt doc``` - creates a new version of [documentation.md](documentation.md)
- ```grunt copy``` - copies ```/dist/anyboard.js``` to ```/dist/examples/*/dist/anyboard.js``` as well as replacing firmware in the examples.

## Documentation
See [documentation.md](documentation.md)

## Examples
See [examples](examples)