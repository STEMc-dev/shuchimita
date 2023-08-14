// NeoPixel Ring simple sketch (c) 2013 Shae Erisson
// Released under the GPLv3 license to match the rest of the
// Adafruit NeoPixel library

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>  // Required for 16 MHz Adafruit Trinket
#endif

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN 6  // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 16  // Popular NeoPixel ring size

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

#define DELAYVAL 100  // Time (in milliseconds) to pause between pixels

void setup() {
  // These lines are specifically to support the Adafruit Trinket 5V 16 MHz.
  // Any other board, you can remove this part (but no harm leaving it):
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  // END of Trinket-specific code.

  pixels.begin();  // INITIALIZE NeoPixel strip object (REQUIRED)
}

void loop() {
  // The first NeoPixel in a strand is #0, second is 1, all the way up
  // to the count of pixels minus one.
  pixels.clear();
  loading();
  success();
  pixels.clear();
  loading();
  fail();
}

void loading() {
  for (int i = 0; i < 2; i++) {
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(60, 50, 5));
      pixels.show();    // Send the updated pixel colors to the hardware.
      delay(DELAYVAL);  // Pause before next pass through loop
    }
    for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...
      // pixels.Color() takes RGB values, from 0,0,0 up to 255,255,255
      // Here we're using a moderately bright green color:
      pixels.setPixelColor(i, pixels.Color(0, 0, 0));
      pixels.show();    // Send the updated pixel colors to the hardware.
      delay(DELAYVAL);  // Pause before next pass through loop
    }
  }
}

void success() {
  for (int i = 0; i < 2; i++) {
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(0, 50, 0));
    }
    pixels.show();  // Send the updated pixel colors to the hardware.
    delay(100);
    pixels.clear();
    pixels.show();  // Send the updated pixel colors to the hardware.
    delay(100);
  }
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(0, 50, 0));
  }
  pixels.show();  // Send the updated pixel colors to the hardware.
  delay(2000);
}

void fail() {
  for (int i = 0; i < 2; i++) {
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(50, 10, 0));
    }
    pixels.show();  // Send the updated pixel colors to the hardware.
    delay(100);
    pixels.clear();
    pixels.show();  // Send the updated pixel colors to the hardware.
    delay(100);
  }
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(50, 10, 0));
  }
  pixels.show();  // Send the updated pixel colors to the hardware.
  delay(2000);
}