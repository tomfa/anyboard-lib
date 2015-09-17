/*
 * AnyBoard Bean Pawn firmware
 * Code based on LightBlue Bean hardware (http://legacy.punchthrough.com/bean/)
 *
 * The bean parses incoming arrays of uint8 (numbers 0-255) over bluetooth.
 *      [cmd, data, data, data etc...]
 *
 * If the cmd matches one of the COMMANDS specified, it will execute that command and respond back
 * Else it will respond 0 back
 *
 */

#include <string.h>

// VARIABLES
uint8_t resetBuffer[20] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
uint8_t cmd;
bool connected;
int i;
int len;
uint8_t sendData[20];
uint8_t getData[20];

// BOARD CONSTANTS
String beanName = "AnyBoard Bean Pawn";
const int RED_LED_PIN   = 2;
const int GREEN_LED_PIN = 3;
const int BLUE_LED_PIN  = 4;
const uint8_t sendDataScratch = 2;
const uint8_t ledScratch = 3;
const uint8_t temperatureScratch = 4;
const uint8_t accelerationScratch = 5;

// TOKEN FIRMWARE METADATA
#define NAME    "AnyBoard Bean Pawn"
#define VERSION "0.1"
#define UUID    "2071-5c87-364f"

// COMMANDS
const uint8_t GET_NAME             = 32;
const uint8_t GET_VERSION          = 33;
const uint8_t GET_UUID             = 34;
const uint8_t GET_TEMPERATURE      = 36;
const uint8_t HAS_LED              = 64;
const uint8_t HAS_LED_COLOR        = 65;
const uint8_t HAS_VIBRATION        = 66;
const uint8_t HAS_COLOR_DETECTION  = 67;
const uint8_t HAS_LED_SCREEN       = 68;
const uint8_t HAS_RFID             = 71;
const uint8_t HAS_NFC              = 72;
const uint8_t HAS_ACCELEROMETER    = 73;
const uint8_t HAS_TEMPERATURE      = 74;
const uint8_t HAS_PRINT            = 75;
const uint8_t LED_OFF              = 128;
const uint8_t LED_ON               = 129;
const uint8_t LED_BLINK            = 130;

void setup() {
    Serial.begin(9600);

    // Setup bean
    Bean.setBeanName(NAME);         // Sets the discoverable name
    Bean.enableWakeOnConnect(true); // Enables breaking out of Bean.sleep if being connected to
    Bean.setLed(255, 0, 0);         // Sets LED color to red

    Bean.setScratchData(ledScratch, resetBuffer, 20);
    Bean.setScratchData(temperatureScratch, resetBuffer, 20);
    Bean.setScratchData(accelerationScratch, resetBuffer, 20);
}

// loop running over and over
void loop() {
    connected = Bean.getConnectionState();

    if(connected) {
        if (Serial.available() > 0) {

            // Stores the first integer to cmd variable
            cmd = (uint8_t) Serial.read();

            // Resets the incoming data array
            memset(getData, 0, sizeof(getData));

            // Stores the rest of the incoming data in getData array
            for (i = 0; Serial.available() > 0; i++)
            {
                getData[i] = (uint8_t) Serial.read();
            }

            // Executes the command
            parse(cmd);
        }
        Bean.sleep(200);
    }
    else {
        Bean.sleep(0xFFFFFFFF);
    }
}

// Turns on LED
void ledOn(uint8_t r, uint8_t g, uint8_t b) {
    Bean.setLed(r, g, b);
}

// Turns off LED
void ledOff() {
    Bean.setLed(0, 0, 0);
}

// Blinks LED
void ledBlink(uint8_t r, uint8_t g, uint8_t b, int delayTime) {
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

// Sends data to the client
void send_uint8(uint8_t *data, int length) {
    Serial.write(data, length);
}

// Sends data (uint8 + String) to client
void send_string(uint8_t command, char* string) {
    len = strlen(string);
    sendData[0] = command;
    for (i = 0; i < len; i++) {
        sendData[i+1] = string[i];
    }
    send_uint8(sendData, len+1);
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
        case GET_TEMPERATURE:
            sendData[1] = Bean.getTemperature();
            send_uint8(sendData, 2);
            break;
        case HAS_LED:
            sendData[1] = 1;    // Sets the result data to 1 (true)
            send_uint8(sendData, 2);
            break;
        case HAS_LED_COLOR:
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        case HAS_VIBRATION:
            sendData[1] = 0;  // Sets the result data to 0 (false)
            send_uint8(sendData, 2);
            break;
        case HAS_COLOR_DETECTION:
            sendData[1] = 0;
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
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        case HAS_PRINT:
            sendData[1] = 0;
            send_uint8(sendData, 2);
            break;
        case HAS_TEMPERATURE:
            sendData[1] = 1;
            send_uint8(sendData, 2);
            break;
        default:
            sendData[0] = 0;  // If command is not supported, send back 0
            send_uint8(sendData, 1);
    }
}