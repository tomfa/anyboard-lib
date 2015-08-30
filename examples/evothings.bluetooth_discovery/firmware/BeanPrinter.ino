
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
char sendData[20];
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
const uint8_t GET_BATTERY_STATUS   = 35;
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
const uint8_t HAS_PRINT            = 74;
const uint8_t LED_ON               = 129;
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

void readTemperature() {
	uint8_t temperatureBuffer[1];
    temperatureBuffer[0] = Bean.getTemperature();
    Bean.setScratchData(temperatureScratch, temperatureBuffer, 1);
}

void send(char *data, int length) {
    // TODO: impl
}

void parse(uint8_t command) {
    switch (command) {
        case GET_NAME:
            Serial.println("GET_NAME");
            len = strlen(NAME);
            send(NAME, len);
            break;
        case GET_VERSION:
            Serial.println("GET_VERSION");
            len = strlen(VERSION);
            send(VERSION, len);
            break;
        case GET_UUID:
            Serial.println("GET_UUID");
            len = strlen(UUID);
            send(UUID, len);
            break;
        case GET_BATTERY_STATUS:
            Serial.println("GET_BATTERY_STATUS");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_LED:
            Serial.println("HAS_LED");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_LED_COLOR:
            Serial.println("HAS_LED_COLOR");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_VIBRATION:
            Serial.println("HAS_VIBRATION");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_COLOR_DETECTION:
            Serial.println("HAS_COLOR_DETEC");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_LED_SCREEN:
            Serial.println("HAS_LED_SCREEN");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_RFID:
            Serial.println("HAS_RFID");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_NFC:
            Serial.println("HAS_NFC");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_ACCELEROMETER:
            Serial.println("HAS_ACCELEROMET");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_TEMPERATURE:
            Serial.println("HAS_TEMPERATURE");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case LED_ON:
            Serial.println("LED_ON");
            Bean.setLed(getData[0], getData[1], getData[2]);
            break;
        case PRINT_FEED:
            printer.feed(1);
            break;
        case PRINT_WRITE:
            printer.print((char *) getData);
            break;
        case PRINT_JUSTIFY:
            printer.justify(getData[0]);
            break;
        case PRINT_SET_SIZE:
            printer.setSize(getData[0]);
            break;
        case PRINT_NEWLINE:
            printer.println();
            break;
        default:
            Serial.print("command not supported: ");
            Serial.print(command);
            Serial.print("\n");
    }
}