/*
 * AnyBoard Printer firmware
 * Code based on LightBlue Bean hardware (http://legacy.punchthrough.com/bean/)
 * to communicate with AdaFruit Mini Thermal Receipt Printer (https://learn.adafruit.com/mini-thermal-receipt-printer)
 *
 * Dependencies: Adafruit_Thermal.h (https://github.com/adafruit/Adafruit-Thermal-Printer-Library)
 *
 * The bean parses incoming arrays of uint8 (numbers 0-255) over bluetooth.
 *      [cmd, data, data, data etc...]
 *
 * If the cmd matches one of the COMMANDS specified, it will execute that command and respond back
 * Else it will respond 0 back
 *
 * PRINTER <----serial/wired----> BEAN <---serial/BT-----> PHONE
 */

#include "Adafruit_Thermal.h"
#include "SoftwareSerial.h"
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
const int TX_PIN = 5;
const int RX_PIN = 4;
SoftwareSerial mySerial(RX_PIN, TX_PIN);    // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);        // Pass addr to printer constructor

// TOKEN FIRMWARE METADATA
#define NAME       "AnyBoard Printer"       // Name of token
#define VERSION    "0.1"                    // Firmware version
#define UUID       "2071-5c87-3642"         // Unique identifer

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
const uint8_t HAS_PRINT            = 75;
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
    printer.justify('L');           // Justifies text left by default (options: L, C, R)
    printer.setSize('M');           // Sets size of text to medium (options: L, M, S)

    // Setup bean
    Bean.setBeanName(NAME);         // Sets the discoverable name
    Bean.enableWakeOnConnect(true); // Enables breaking out of Bean.sleep if being connected to
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
        case HAS_LED:
            sendData[1] = 0;  // Sets the result data to 0 (false)
            send_uint8(sendData, 2);
            break;
        case HAS_LED_COLOR:
            sendData[1] = 0;
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
            sendData[1] = 1;  // Sets the result data to 1 (true)
            send_uint8(sendData, 2);
            break;
        case HAS_TEMPERATURE:
            sendData[1] = 0;
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
            sendData[0] = 0;  // If command is not supported, send back 0
            send_uint8(sendData, 1);
    }
}
