// Token's firmware working copy
// Code based on RFDUINO hardware, uses C char arrays

#include <ArduinoJson.h>
#include <RFduinoBLE.h>
#include <Wire.h>
#include "Adafruit_TCS34725.h"

#define RED_LED_PIN   2
#define GREEN_LED_PIN 3
#define BLUE_LED_PIN  4
#define NAME          "AnyToken 1"
#define VERSION       "0.1"

#define GET_NAME      1
#define GET_VERSION   2
#define LED_ON        65

void setup() {
	  // put your setup code here, to run once:

	// Enable outputs.
	pinMode(RED_LED_PIN, OUTPUT);
	pinMode(GREEN_LED_PIN, OUTPUT);
	pinMode(BLUE_LED_PIN, OUTPUT);

	// Enable serial debug, type cntrl-M at runtime.
	Serial.begin(9600);
	Serial.println("RFduino example started");
	Serial.println("Serial rate set to 9600 baud");

	// Turn Off all LEDs initially
	digitalWrite(RED_LED_PIN, LOW);
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, LOW);

	// Indicate RGB LED is operational to user.
	digitalWrite(RED_LED_PIN, HIGH);    // red
	delay (500);
	digitalWrite(RED_LED_PIN, LOW);
	digitalWrite(GREEN_LED_PIN, HIGH);  // green
	delay (500);
	digitalWrite(RED_LED_PIN, LOW);
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, HIGH);   // blue
	delay (500);
	digitalWrite(RED_LED_PIN, LOW);     // lights out
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, LOW);

	// configure the RFduino BLE properties
	RFduinoBLE.advertisementData = "ledbtn";
	RFduinoBLE.advertisementInterval = 500;
	RFduinoBLE.deviceName = "RFduino";
	RFduinoBLE.txPowerLevel = -20;
	Serial.println("RFduino BLE Advertising interval is 500ms");
	Serial.println("RFduino BLE DeviceName: RFduino");
	Serial.println("RFduino BLE Tx Power Level: -20dBm");

	// start the BLE stack
	RFduinoBLE.begin();
	Serial.println("RFduino BLE stack started");

}

void loop()
{
  // switch to lower power mode
  RFduino_ULPDelay(INFINITE);
}

// Turns on the LED on a specific color: r=red, g=gree, osv..
void ledON(int r, int g, int b) {
  if (r > 200) {
    digitalWrite(RED_LED_PIN, HIGH);
  } else {
    digitalWrite(RED_LED_PIN, LOW);
  }
  if (g > 200) {
    digitalWrite(GREEN_LED_PIN, HIGH);
  } else {
    digitalWrite(GREEN_LED_PIN, HIGH);
  } 
  if (b > 200) {
    digitalWrite(BLUE_LED_PIN, HIGH);
  } else {
    digitalWrite(BLUE_LED_PIN, HIGH);
  }
}


void RFduinoBLE_onAdvertisement()
{
	Serial.println("RFduino is doing BLE advertising ...");
	digitalWrite(RED_LED_PIN, LOW);
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, LOW);
}

void RFduinoBLE_onConnect()
{
	Serial.println("RFduino BLE connection successful");
	digitalWrite(RED_LED_PIN, HIGH);
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, HIGH);
}

void RFduinoBLE_onDisconnect()
{
	Serial.println("RFduino BLE disconnected");
	digitalWrite(RED_LED_PIN, LOW);
	digitalWrite(GREEN_LED_PIN, LOW);
	digitalWrite(BLUE_LED_PIN, LOW);
}

void RFduinoBLE_onReceive(char *data, int len)
{
    if (data[0] == GET_NAME) {
      Serial.println(NAME);
    }
    if (data[0] == GET_VERSION) {
      Serial.println(VERSION);
    }
    if (data[0] == LED_ON) {
      ledON(data[1], data[2], data[3]);
    } 
}