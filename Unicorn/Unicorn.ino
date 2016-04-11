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

unsigned long bounces;
unsigned int timeDelay = 30;
uint8_t hue = 0;

void setup() {
	Serial.begin(57600);
	Serial.println("resetting");

	// Change depending on the LED strip model
	LEDS.addLeds<DOTSTAR, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
	LEDS.setBrightness(255);
}

void loop() {
	Serial.print("x");

	// every 4 bounces or 2 loops
	if (bounces%2 == 0) {
		// now supports 4.25 colors!
		hue = hue + 60;
	}

	unicornPurpleRain();
	// fadeUp();
	// fadeDown();

	// count as a bounce
	bounces ++;
}

void unicornPurpleRain(){
	// unicorn rainDrop falls dim
	for(int i = 0; i < NUM_LEDS; i++) {
		leds[i] = CHSV(220, 255, 50);

		if (i == NUM_LEDS-1) {
			leds[i] = CHSV(220, 255, 255);
		}
		// show led
		FastLED.show();
		// go Back to Black
		leds[i] = CRGB::Black;

		// gravity effect
		delay(80 - constrain(i * 7, 7, 70));
	}

	// bounce/splash drop back for 3 leds
	int dropBounces = 0;
	uint8_t brigthtness = 255;
	while(brigthtness > 20) {

		// bouncing routine
		while(dropBounces < 3) {
		// bounce down
			for(int i = (NUM_LEDS)-1; i >= (NUM_LEDS)-3+dropBounces; i--) {
				leds[i] = CHSV(220, 255, brigthtness);
				FastLED.show();
				leds[i] = CRGB::Black;
				delay(80 - (NUM_LEDS - i) * 20);
				brigthtness -= 10;
			}

			// bounce up
			for(int i =(NUM_LEDS)-3+dropBounces; i < NUM_LEDS; i++) {
				leds[i] = CHSV(220, 255, brigthtness);
				FastLED.show();
				leds[i] = CRGB::Black;
				delay(80 + (dropBounces * 50));
				brigthtness -= 10;
			}
			dropBounces ++;
		}


		// flow and glow then fade out
		// like water on a cold fullmoon night...

		// glow UP
		for (int i = 0; i < 40; i ++) {
			leds[NUM_LEDS-1] = CHSV(220, 255, brigthtness + i);
			FastLED.show();
			delay(7);

			// for every 4 loops
			if (i % 4 == 0 ) {
				// decrease brightness 
				brigthtness--;
			}
		}

		// glow down
		for (int i = 40; i > 0; i --) {
			leds[NUM_LEDS-1] = CHSV(220, 255, brigthtness + i);
			FastLED.show();
			delay(7);

			// for every 4 loops
			if (i % 4 == 0 ) {
				// decrease brightness
				brigthtness--;
			}
		}

		leds[NUM_LEDS-1] = CRGB::Black;
		delay(20);
	}
}

void fadeUp() {
	// First slide the led in one direction
	for(int i = 0; i < NUM_LEDS; i++) {
		// // if it passes half way
		// if (i+4 == NUM_LEDS/2) {
		// 	// now supports 4.25 colors!
		// 	hue = hue + 60;
		// }

		leds[i] = CHSV(hue, 255, (255/5)*1);
		leds[i+1] = CHSV(hue, 255, (255/5)*2);
		leds[i+2] = CHSV(hue, 255, (255/5)*3);
		leds[i+3] = CHSV(hue, 255, (255/5)*4);
		leds[i+4] = CHSV(hue, 255, 255);

		hue++;
		// Show the leds
		FastLED.show();
		// go Back to Black
		leds[i] = CRGB::Black;

		delay(timeDelay);
	}
}

void fadeDown() {
	// then slide the LED into the other direction
	for(int i = (NUM_LEDS)-1; i >= 0; i--) {
		// // if it passes half way
		// if (i == NUM_LEDS/2) {
		// 	// now supports 4.25 colors!
		// 	hue = hue + 60;
		// }

		leds[i] = CHSV(hue, 255, 255);
		leds[i+1] = CHSV(hue, 255, (255/5)*4);
		leds[i+2] = CHSV(hue, 255, (255/5)*3);
		leds[i+3] = CHSV(hue, 255, (255/5)*2);
		leds[i+4] = CHSV(hue, 255, (255/5)*1);

		hue++;
		// Show the leds
		FastLED.show();
		// go Back to Black
		leds[i+4] = CRGB::Black;

		delay(timeDelay);
	}
}
