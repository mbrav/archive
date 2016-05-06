// Utopia Tower
#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 60
#define DATA_PIN 12
#define CLOCK_PIN 11

CRGB leds[NUM_LEDS];

byte patternId;
byte receivedBytes[1];

void setup() {
  Serial.begin(115200);
  Serial.println("sdfasd");

  // Change depending on the LED strip model
  FastLED.addLeds<APA102, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  LEDS.setBrightness(255);
}

void loop() {
  // Read Serial Port
  while (Serial.available() > 0)
  {
      receivedBytes[0] = Serial.read();
      Serial.println(receivedBytes[0]);
  }
   patternId = receivedBytes[0];

  switch(patternId) {
    case 0:
      setAllCHSV(0,0,0);
      break;
    case 1:
      unicornThunder();
      break;
    case 2:
      unicornPurpleRain();
      break;
    case 3:
      unicornPaparazzi();
      // setAllCHSV(240, 255, 255);
      break;
    default:
      break;
  }
}

void unicornThunder() {
	// pick a random location where the thunder starts
	unsigned int startSpark = random(0, (NUM_LEDS)-1);
	// which direction way does the thunder move?
	byte upOrDown = random(0,2);
	// pick a color between deepBlue and blue-green
	byte thunderColor = random(20,50);
	// define thunder frequency
	// time to wait until the next one in milleseconds
	unsigned int thunderDelay= random(500, 3000);

	// fist spark
	leds[startSpark] = CHSV(thunderColor, 255, 255);
	FastLED.show();
	delay(20);
	leds[startSpark] = CHSV(thunderColor, 255, 10);
	FastLED.show();
	delay(20);
	leds[startSpark] = CHSV(thunderColor, 255, 255);
	FastLED.show();
	delay(10);
	leds[startSpark] = CRGB::Black;

	Serial.println(upOrDown);

	// thunder strike up the led
	if (upOrDown == 0) {
		byte brigthtnessDecay = 0;
		for (int i = startSpark; i < (NUM_LEDS)-1; i++ ) {
			// fade Down
			for (int j = 255; j > 150; j--) {
				leds[i] = CHSV(thunderColor, 255, j - brigthtnessDecay );

				// only show every 20 loops for faster timing
				// light speed doesn't like big delays
				if (j % 20 == 0) {
					FastLED.show();
					brigthtnessDecay++;
				}
			}
			// fade Up next one
			for (int j = 0; j < 255; j++) {
				leds[i+1] = CHSV(thunderColor, 255, j - brigthtnessDecay);

				// only show every 20 loops for faster timing
				// light speed doesn't like big delays
				if (j % 20 == 0) {
					FastLED.show();
					brigthtnessDecay++;
				}
			}

			// set to black
			leds[i] = CRGB::Black;
			leds[i+1] = CRGB::Black;
		}
	}

	// hunder strike down the led
	else {
		for (int i = startSpark; i >= 0; i-- ) {
			// fade Down
			for (int j = 255; j > 150; j--) {
				leds[i] = CHSV(thunderColor, 255, j);

				// only show every 20 loops for faster timing
				// light speed doesn't like big delays
				if (j % 20 == 0) {
					FastLED.show();
				}
			}
			// fade Up next one
			for (int j = 0; j < 255; j++) {
				leds[i-1] = CHSV(thunderColor, 255, j);

				// only show every 20 loops for faster timing
				// light speed doesn't like big delays
				if (j % 20 == 0) {
					FastLED.show();
				}
			}

			// set to black
			leds[i] = CRGB::Black;
			leds[i-1] = CRGB::Black;
		}
	}

	delay(50);
	// The Sky After Glow, less dim

	// if the thunder headed down
	// draw the brigtheest LED at bottom
	// dim the LED's as you go up
	if (upOrDown == 0) {
		// repeat flash 5 times
		for (int i = 0; i < 5; i++) {
			// glow flash on
			for(int i = 0; i < NUM_LEDS-1; i++) {
				leds[i] = CHSV(thunderColor, 255, 100 - (100/NUM_LEDS)*i);
			}
			FastLED.show();
			delay(20);
			// glow flash off
			for(int i = 0; i < NUM_LEDS-1; i++) {
				leds[i] = CHSV(thunderColor, 255, 0);
			}
			FastLED.show();
			delay(20);
		}
	}
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

void unicornPaparazzi() {
  int startSpark = random(0, (NUM_LEDS)-1);
  boolean upOrDown = random(0,1);

  leds[startSpark] = CHSV(30, 255, 255);
  FastLED.show();
  delay(20);
  leds[startSpark] = CHSV(30, 255, 10);
  FastLED.show();
  delay(20);
  leds[startSpark] = CHSV(30, 255, 255);
  FastLED.show();
  delay(10);
  leds[startSpark] = CRGB::Black;
}

void setAllCHSV(byte h, byte s, byte v) {
  for(int i = 0; i < NUM_LEDS; i++) {
		leds[i] = CHSV(h, s, v);
  }
  FastLED.show();
}
