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

// API url
const String API_URL = "https://shuchimita-backend.vercel.app";

// wifi creds
const char *ssid = "Access Denied";
const char *password = "[Axis@12]";

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
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(jsonString);
  String payload = http.getString();

  Serial.println(httpCode);
  Serial.println(payload);

  if (httpCode == 202)
  {
    Serial.println("Scan successful");
  }
  else if (httpCode == 406)
  {
    Serial.println("Please come later");
  }
  else if (httpCode == 404)
  {
    Serial.println("ID doesn't exist");
  }
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
  }
}