
// Printer's firmware working copy
// Code based on BEAN hardware
// The bean parses json, process the text for the printer and communicates with it over serial/wired interface
// PRINTER <----serial/wired----> BEAN <---serial/BT-----> PHONE


#include "Adafruit_Thermal.h"
#include "SoftwareSerial.h"
#include <ArduinoJson.h>


//Printer variables
#define TX_PIN 5 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 4 // Arduino receive   GREEN WIRE   labeled TX on printer
SoftwareSerial mySerial(RX_PIN, TX_PIN); // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);     // Pass addr to printer constructor

#include <string.h>

// VARIABLES
uint8_t resetBuffer[20] = {0};
uint8_t cmd;
bool connected;
int i;
int len;
uint8_t sendData[20];
uint8_t getData[20];
String temp_string;

// BOARD CONSTANTS
String beanName = "AnyBoard Printer";
const int RED_LED_PIN             = 2;
const int GREEN_LED_PIN           = 3;
const int BLUE_LED_PIN            = 4;
const uint8_t ledScratch          = 3;
const uint8_t temperatureScratch  = 4;
const uint8_t accelerationScratch = 5;

// TOKEN FIRMWARE METADATA
#define NAME       "AnyBoard Printer"
#define VERSION    "0.1"
#define UUID       "2071-5c87-3642"

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
const uint8_t PRINT_FEED           = 137;
const uint8_t PRINT_JUSTIFY        = 138;
const uint8_t PRINT_SET_SIZE       = 139;
const uint8_t PRINT_WRITE          = 140;
const uint8_t PRINT_NEWLINE        = 141;


void setup() {
    Serial.begin(57600);
    Serial.setTimeout(25);

    mySerial.begin(19200);
    printer.begin();
    printer.justify('L');
    printer.setSize('M');

    // Setup bean
    Bean.setBeanName(beanName);
    Bean.enableWakeOnConnect(true);
    Bean.setLed(255, 0, 0);

    Bean.setScratchData(ledScratch, resetBuffer, 20);
    Bean.setScratchData(temperatureScratch, resetBuffer, 20);
    Bean.setScratchData(accelerationScratch, resetBuffer, 20);
}

// the loop routine runs over and over again forever:
void loop() {
    connected = Bean.getConnectionState();

    if(connected) {
        if (Serial.available() > 0) {
            cmd = (uint8_t) Serial.read();
            memset(getData, 0, sizeof(getData));
            for (i = 0; Serial.available() > 0; i++)
            {
                getData[i] = (uint8_t) Serial.read();
            }

            parse(cmd);
        }
        Bean.sleep(500);
    }
    else {
        Bean.sleep(0xFFFFFFFF);
    }
}

void send_uint8(uint8_t *data, int length) {
    Serial.write(data, length);
}

void send_string(uint8_t command, char* string) {
    len = strlen(string);
    sendData[0] = command;
    for (i = 0; i < len; i++) {
        sendData[i+1] = string[i];
    }
    send_uint8(sendData, len+1);
}

void parse(uint8_t command) {
    memset(sendData, 0, sizeof(sendData));
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
        case HAS_LED:
            sendData[1] = 0;
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
        case PRINT_FEED:
            printer.feed(1);
            send_uint8(sendData, 1);
            break;
        case PRINT_WRITE:
            printer.print((char *) getData);
            send_uint8(sendData, 1);
            break;
        case PRINT_JUSTIFY:
            printer.justify(getData[0]);
            send_uint8(sendData, 1);
            break;
        case PRINT_SET_SIZE:
            printer.setSize(getData[0]);
            send_uint8(sendData, 1);
            break;
        case PRINT_NEWLINE:
            printer.println();
            send_uint8(sendData, 1);
            break;
        default:
            sendData[0] = 0;
            send_uint8(sendData, 1);
    }
}
