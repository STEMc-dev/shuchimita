// ****** LIBRARIES ******
#include <Arduino.h>
#include <WiFi.h>              // utilizes the ESP32 WiFi capabilities
#include <HTTPClient.h>        // does http requests
#include <ArduinoJson.h>       // parses json
#include <rdm6300.h>           // get data from the rdm6300 RFID reader
#include <Wire.h>              // establishes i2c communication
#include <LiquidCrystal_I2C.h> // library for the LCD

// ****** SETUP STARTS ******

// set software serial pin for reading the RFID
#define RDM6300_RX_PIN 4
Rdm6300 rdm6300;

// sonar pins and variables
const int trigPin = 5;
const int echoPin = 18;

// define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch;

// API url
const String API_URL = "https://shuchimita-backend.vercel.app";

// wifi creds
const char *ssid = "Shihabixel";
const char *password = "Shuchimita123";

// connect to wifi and print current local IP
void setupWiFi()
{
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// Set the LCD address to 0x3F for a 20 chars and 4 line display
LiquidCrystal_I2C lcd(0x3F, 20, 4);

void setupLCD()
{
  lcd.init();
  lcd.backlight();

  lcd.print("Areh!!!");
  delay(250);
  lcd.setCursor(0, 1);
  lcd.print("Shihab Bhai");
  delay(1200);
  lcd.setCursor(0, 1);
  lcd.print("Welcome :) ");
  delay(3000);
  lcd.clear();
}

void setup()
{
  setupLCD();
  Serial.begin(115200);
  setupWiFi();

  // set sonar pins
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);  // Sets the echoPin as an Input

  rdm6300.begin(RDM6300_RX_PIN);
  Serial.println("\nPlace RFID tag near the rdm6300...");
}

// ****** LOOPS STARTS ******

void scanAPI(int rfid)
{
  StaticJsonDocument<200> jsonBody;
  jsonBody["scannedId"] = rfid;
  String jsonString;
  serializeJson(jsonBody, jsonString);

  String url = API_URL + "/api/scanRFID";

  // Make the HTTP request
  HTTPClient http;
  http.setTimeout(15000);

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(jsonString);
  String payload = http.getString();

  if (httpCode == 404)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("You're not");
    lcd.setCursor(0, 1);
    lcd.print("registered");

    Serial.println("You're not registered");
  }
  else
  {
    StaticJsonDocument<1000> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (error)
    {
      Serial.print("JSON parsing error: ");
      Serial.println(error.c_str());
    }
    else
    {
      // Retrieve message field
      String message = doc["scanInfo"]["message"].as<String>();

      if (httpCode == 202)
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print(message);

        Serial.println(message);
      }
      else if (httpCode == 406)
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print(message);

        Serial.println(message);
      }
    }
  }
  http.end();
}

void measureDistance()
{
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance
  distanceCm = duration * SOUND_SPEED / 2;

  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;

  // Prints the distance in the Serial Monitor
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);
}

void loop()
{
  /* get_new_tag_id returns the tag_id of a "new" near tag,
  following calls will return 0 as long as the same tag is kept near. */
  if (rdm6300.get_new_tag_id())
  {
    int lastScannedID = rdm6300.get_tag_id();
    Serial.println(lastScannedID);
    scanAPI(lastScannedID);
    measureDistance();
  }
}