#include <string.h>

// VARIABLES
uint8_t resetBuffer[20] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
uint8_t cmd;
bool connected;
int i;
int len;
char sendData[20];
uint8_t getData[20];

// BOARD CONSTANTS
String beanName = "LightBlueBean";
const int RED_LED_PIN   = 2;
const int GREEN_LED_PIN = 3;
const int BLUE_LED_PIN  = 4;
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
const uint8_t LED_OFF              = 128;
const uint8_t LED_ON               = 129;
const uint8_t LED_BLINK            = 130;

void setup() {
    Serial.begin(9600);

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
            getData[20] = {0};
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

void readAcceleration() {
	// TODO
}

void readLed() {
	uint8_t ledReading[3];
	ledReading[0] = Bean.getLedRed();
	ledReading[1] = Bean.getLedGreen();
	ledReading[2] = Bean.getLedBlue();
	Bean.setScratchData(ledScratch, ledReading, 3);
}

void ledOn(uint8_t r, uint8_t g, uint8_t b) {
    Bean.setLed(r, g, b);
}

void ledOff() {
    Bean.setLed(0, 0, 0);
}

void ledBlink(uint8_t r, uint8_t g, uint8_t b, int delayTime) {
    readLed();
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
        case LED_ON:
            Serial.println("LED_ON");
            ledOn(getData[0], getData[1], getData[2]);
            break;
        case LED_OFF:
            Serial.println("LED_OFF");
            ledOff();
            break;
        case LED_BLINK:
            Serial.println("LED_BLINK");
            ledBlink(getData[0], getData[1], getData[2], getData[3]);
            break;
        case GET_BATTERY_STATUS:
            Serial.println("GET_BATTERY_STATUS");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_LED:
            Serial.println("HAS_LED");
            sendData[0] = 1;
            send(sendData, 1);
            break;
        case HAS_LED_COLOR:
            Serial.println("HAS_LED_COLOR");
            sendData[0] = 1;
            send(sendData, 1);
            break;
        case HAS_VIBRATION:
            Serial.println("HAS_VIBRATION");
            sendData[0] = 0;
            send(sendData, 1);
            break;
        case HAS_COLOR_DETECTION:
            Serial.println("HAS_COLOR_DETEC");
            sendData[0] = 1;
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
        default:
            Serial.print("command not supported: ");
            Serial.print(command);
            Serial.print("\n");
    }
}