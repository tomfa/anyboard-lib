/*
 * AnyBoard Pawn firmware
 * Code based on RFduino (http://www.rfduino.com/) and
 * AdaFruit Color Sensor TCS34725 (https://www.adafruit.com/products/1334)
 *
 * Dependencies: RFduinoBLE.h and Wire.h (https://github.com/RFduino/RFduino)
 *               Adafruit_TCS34725.h (https://github.com/adafruit/Adafruit_TCS34725)
 *
 * Reference: https://cdn.sparkfun.com/datasheets/Dev/RFduino/rfduino.ble_.programming.reference.pdf
 *
 * The bean parses incoming arrays of uint8 (numbers 0-255) over bluetooth.
 *      [cmd, data, data, data etc...]
 *
 * If the cmd matches one of the COMMANDS specified, it will execute that command and respond back
 * Else it will respond 0 back
 *
 */

#include <RFduinoBLE.h>  //
#include <Wire.h>
#include "Adafruit_TCS34725.h"
#include <string.h>

// VARIABLES
uint8_t cmd;
int i;
bool connected;
int len;
uint8_t sendData[20];
uint8_t getData[20];
uint8_t last_sector_ID = 0;
uint8_t current_sector_ID = 0;

uint16_t r, g, b, color, colorTemp, lux;

// BOARD CONSTANTS
#define RED_LED_PIN   2
#define GREEN_LED_PIN 3
#define BLUE_LED_PIN  4

/* Initialise color sensor with default values (int time = 2.4ms, gain = 1x) */
// Adafruit_TCS34725 tcs = Adafruit_TCS34725();

/* Initialise color sensor with specific int time and gain values */
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_1X);

// TOKEN FIRMWARE METADATA
#define NAME    "AnyBoard Pawn"
#define VERSION "0.1"
#define UUID    "3191-6275-32g4"

// COMMANDS
const uint8_t GET_NAME             = 32;
const uint8_t GET_VERSION          = 33;
const uint8_t GET_UUID             = 34;
const uint8_t HAS_LED              = 64;
const uint8_t HAS_LED_COLOR        = 65;
const uint8_t HAS_VIBRATION        = 66;
const uint8_t HAS_COLOR_DETECTION  = 67;
const uint8_t HAS_LED_SCREEN       = 68;
const uint8_t HAS_RFID             = 71;
const uint8_t HAS_NFC              = 72;
const uint8_t HAS_ACCELEROMETER    = 73;
const uint8_t HAS_TEMPERATURE      = 74;
const uint8_t LED_OFF              = 128;
const uint8_t LED_ON               = 129;
const uint8_t LED_BLINK            = 130;
const uint8_t READ_COLOR           = 136;
const uint8_t MOVE                 = 194;

void setup() {
    // Enable outputs.
    pinMode(RED_LED_PIN, OUTPUT);
    pinMode(GREEN_LED_PIN, OUTPUT);
    pinMode(BLUE_LED_PIN, OUTPUT);
    
    // Turn Off all LEDs initially
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(BLUE_LED_PIN, LOW);;

    // configure the RFduino BLE properties
    RFduinoBLE.advertisementData = "ledbtn";
    RFduinoBLE.advertisementInterval = 500;
    RFduinoBLE.deviceName = "RFduino";
    RFduinoBLE.txPowerLevel = -20;

    // start the BLE stack
    RFduinoBLE.begin();
}

// Loops and reads color. Sends signal to client if detecting a changed color
void loop() {
    // Read color codes, based on the code in https://learn.adafruit.com/adafruit-color-sensors/programming

    tcs.getRawData(&r, &g, &b, &color);
    colorTemp = tcs.calculateColorTemperature(r, g, b);

    // Color hex translation to sector IDs
    // Sector_NAMES     Sector_ID       Color_ID (approx value given by the sensor)
    // START            1               12228
    // STOP             2               5737
    // A                3               18330
    // B                4               9560
    // C                5               8550
    // D                6               6806
    // E                7               5920
    // F                8               15454

    if (color > 12000 && color < 13000)
        current_sector_ID = 1;
    else if (color > 5300 && color < 5800)
        current_sector_ID = 2;
    else if (color > 18000 && color < 19000)
        current_sector_ID = 3;
    else if (color > 9000 && color < 10000)
        current_sector_ID = 4;
    else if (color > 8000 && color < 9000)
        current_sector_ID = 5;
    else if (color > 6500 && color < 7500)
        current_sector_ID = 6;
    else if (color > 5801 && color < 6300)
        current_sector_ID = 7;
    else if (color > 15000 && color < 16000)
        current_sector_ID = 8;

    // Sends sectors ID of the sector that has been left and the sector that has been reached
    if (current_sector_ID != last_sector_ID) {
        sendData[0] = MOVE;
        sendData[1] = current_sector_ID;
        sendData[2] = last_sector_ID;
        RFduinoBLE.send((char*) sendData, 3);

        // Update sector_ID variables
        last_sector_ID = current_sector_ID;
    }
    delay(300);
}

// Turns on LED
void ledOn(int r, int g, int b) {
    if (r < 127) {
        digitalWrite(RED_LED_PIN, LOW);
    } else {
        digitalWrite(RED_LED_PIN, HIGH);
    }
    if (g < 127) {
        digitalWrite(GREEN_LED_PIN, LOW);
    } else {
        digitalWrite(GREEN_LED_PIN, HIGH);
    }
    if (b < 127) {
        digitalWrite(BLUE_LED_PIN, LOW);
    } else {
        digitalWrite(BLUE_LED_PIN, HIGH);
    }
}

// Turns off LED
void ledOff() {
    ledOn(0,0,0);
}

// Blinks LED
void ledBlink(int r, int g, int b, int delayTime) {
    ledOn(r, g, b);
    delay(delayTime*10);
    ledOff();
    delay(delayTime*10);
    ledOn(r, g, b);
    delay(delayTime*10);
    ledOff();
    delay(delayTime*10);
    ledOn(r, g, b);
    delay(delayTime*10);
    ledOff();
    delay(delayTime*10);
    ledOn(r, g, b);
    delay(delayTime*10);
    ledOff();
    delay(delayTime*10);
    ledOn(r, g, b);
    delay(delayTime*10);
    ledOff();
    delay(delayTime*10);
    ledOn(r, g, b);
}

// Code that executes everytime the radio advertises
void RFduinoBLE_onAdvertisement() {
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(BLUE_LED_PIN, LOW);
}

// Code that executes everytime token is being connected to
void RFduinoBLE_onConnect() {
    connected = true;
}

// Code that executes everytime token is being disconnected from
void RFduinoBLE_onDisconnect() {
    connected = false;
}

// Sends data to the connected client
void send_uint8(uint8_t *data, int length) {
    char charData[length];
    for (i = 0; i < length; i++) {
        charData[i] = data[i];
    }
    RFduinoBLE.send(charData, length);
}

// Sends data (uint8 + String) to the connected client
void send_string(uint8_t command, char* string) {
    len = strlen(string);
    sendData[0] = command;
    for (i = 0; i < len; i++) {
        sendData[i+1] = string[i];
    }
    send_uint8(sendData, len+1);
}

// Code to run upon receiving data over bluetooth
void RFduinoBLE_onReceive(char *data, int length) {

    // Stores the first integer to cmd variable
    cmd = data[0];

    // Resets the incoming data array
    memset(getData, 0, sizeof(getData));

    // Stores the rest of the incoming data in getData array
    for (i = 1; i < length; i++) {
        getData[i-1] = data[i];
    }

    // Executes the command
    parse(cmd);
}

// Executes command
void parse(uint8_t command) {

    // Resets the outcoming data array
    memset(sendData, 0, sizeof(sendData));

    // Sets the command as the first data to send
    sendData[0] = command;

    switch (command) {
        case GET_NAME:
            send_string(GET_NAME, NAME);
            break;
        case GET_VERSION:
            send_string(GET_VERSION, VERSION);
            break;
        case GET_UUID:
            send_string(GET_UUID, UUID);
            break;
        case LED_ON:
            ledOn(getData[0], getData[1], getData[2]);
            send_uint8(sendData, 1);
            break;
        case LED_OFF:
            ledOff();
            send_uint8(sendData, 1);
            break;
        case LED_BLINK:
            ledBlink(getData[0], getData[1], getData[2], getData[3]);
            send_uint8(sendData, 1);
            break;
        case HAS_LED:
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        case HAS_LED_COLOR:
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        case HAS_VIBRATION:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_COLOR_DETECTION:
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        case HAS_LED_SCREEN:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_RFID:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_NFC:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_ACCELEROMETER:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_TEMPERATURE:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        default:
            sendData[0] = 0;
            send_uint8(sendData, 1);
    }
}