#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 15

// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806, define both DATA_PIN and CLOCK_PIN
#define DATA_PIN 4
#define CLOCK_PIN 5

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup() {
	Serial.begin(57600);
	Serial.println("resetting");

	// Change depending on the LED strip model
	LEDS.addLeds<DOTSTAR, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
	LEDS.setBrightness(84);
}

void loop() {
	static uint8_t hue = 0;
	Serial.print("x");
	// First slide the led in one direction
	for(int i = 0; i < NUM_LEDS; i++) {
		// if it passes half way
		if (i+4 == NUM_LEDS/2) {
			// now supports 4.25 colors!
			hue = hue + 60;
		}

		leds[i] = CHSV(hue, 255, (255/5)*1);
		leds[i+1] = CHSV(hue, 255, (255/5)*2);
		leds[i+2] = CHSV(hue, 255, (255/5)*3);
		leds[i+3] = CHSV(hue, 255, (255/5)*4);
		leds[i+4] = CHSV(hue, 255, 255);
		// Show the leds
		FastLED.show();
		// go Back to Black
		leds[i] = CRGB::Black;

		delay(50);
	}

	for(int i = (NUM_LEDS)-1; i >= 0; i--) {
		// if it passes half way
		if (i == NUM_LEDS/2) {
			// now supports 4.25 colors!
			hue = hue + 60;
		}

		leds[i] = CHSV(hue, 255, 255);
		leds[i+1] = CHSV(hue, 255, (255/5)*4);
		leds[i+2] = CHSV(hue, 255, (255/5)*3);
		leds[i+3] = CHSV(hue, 255, (255/5)*2);
		leds[i+4] = CHSV(hue, 255, (255/5)*1);
		// Show the leds
		FastLED.show();
		// go Back to Black
		leds[i+4] = CRGB::Black;

		delay(50);
	}
}
