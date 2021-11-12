// Utopia Tower
#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 180
#define DATA_PIN 15
#define CLOCK_PIN 14

CRGB leds[NUM_LEDS];

byte patternId;
byte receivedBytes[1];

int segmentLenghts[] = {10, 14, 16, 20};

byte hGlobal, sGlobal, vGlobal;

void setup() {
  Serial.begin(115200);
  Serial.println("Start LED Control Infrastructure...");

  // Change depending on the LED strip model
  FastLED.addLeds<APA102, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
  LEDS.setBrightness(100);
}

void loop() {
  // Read Serial Port
  while (Serial.available() > 0) {
    receivedBytes[0] = Serial.read();
    Serial.println(receivedBytes[0]);
  }

  // patternId = 1;
  patternId = receivedBytes[0];

  switch(patternId) {
    case 0:
    // default
      unicornThunder();
      break;
    case 1:
      unicornThunder();
      break;
    case 2:
      unicornPurpleRain();
      break;
    case 3:
      unicornPaparazzi(5, 10, random(0, 255), 100, 255);
      break;
    case 4:
      randomSegementLightUp(random(0,255),random(0,255),255);
      FastLED.show();
      break;
    case 5:
      break;
    default:
      break;
  }

}

// CONTROL LED FUNCTIONS

void setAllCHSV(byte h, byte s, byte v) {
  for(int i = 0; i < NUM_LEDS; i++) {
		leds[i] = CHSV(h, s, v);
  }
}

// Control the same pixel on each of the three sides of the tower
// num 0 - 59
void mirrorPixel(int pixel, byte h, byte s, byte v) {
  leds[pixel] = CHSV(h, s, v);
  leds[pixel+60] = CHSV(h, s, v);
  leds[pixel+120] = CHSV(h, s, v);
}

// Control one of the four of the segments that every side has
// Side 0,1,2
// segmentLenghts[0-3], from top to bottom
void controlSegment(byte side, byte segment, byte h, byte s, byte v) {
  byte startPixel = 60 * side;
  byte endPixel;

  if (segment > 0)  {
    startPixel += segmentLenghts[0];
  }

  if (segment > 1)  {
    startPixel += segmentLenghts[1];
  }

  if (segment > 2)  {
    startPixel += segmentLenghts[2];
  }

  endPixel = startPixel + segmentLenghts[segment];

  for(int i = startPixel; i < endPixel; i++) {
    leds[i] = CHSV(h, s, v);
  }
}


// ANIMATIONS

void unicornThunder() {
	// pick a random location where the thunder starts
	unsigned int startSpark = 60;
	// which direction way does the thunder move?
	// byte upOrDown = random(0,2);
	// pick a color between deepBlue and blue-green
	byte thunderColor = random(20,250);
	// define thunder frequency
	// time to wait until the next one in milleseconds
  int waitTime = random(500,3000);

	// fist spark
  mirrorPixel(startSpark,thunderColor, 255, 255);
	FastLED.show();
	delay(20);
  mirrorPixel(startSpark,thunderColor, 255, 10);
	FastLED.show();
	delay(20);
	mirrorPixel(startSpark,thunderColor, 255, 255);
	FastLED.show();
	delay(10);
	mirrorPixel(startSpark,0, 0, 0);

	// thunder strike up the led
	byte brigthtnessDecay = 0;
	for (int i = startSpark; i >= 0; i--) {
      mirrorPixel(i,thunderColor, 255 - brigthtnessDecay, 255 - brigthtnessDecay);
      brigthtnessDecay +=5;
      // set to black
      FastLED.show();
      mirrorPixel(i,0, 0, 0);
    	delay(20);
	}

	delay(10);
	// The Sky After Glow, less dim

	// if the thunder headed down
	// draw the brigtheest LED at bottom
	// dim the LED's as you go up

	// repeat flash 5 times
	for (int i = 0; i < 5; i++) {
		// glow flash on
		for(int i = 0; i <= NUM_LEDS/3; i++) {
      mirrorPixel(i,thunderColor, 100, 255 - 4*i);
		}
		FastLED.show();
		delay(20);
		// glow flash off
		for(int i = 0; i <= NUM_LEDS/3; i++) {
      mirrorPixel(i,thunderColor, 100, 0);
		}
		FastLED.show();
		delay(20);
	}

  delay(waitTime);
}

void unicornPurpleRain(){
	// unicorn rainDrop falls dim
	for(int i = 0; i < NUM_LEDS; i++) {
		leds[i] = CHSV(220, 255, 50);
		leds[i + 60] = CHSV(220, 255, 50);
		leds[i + 120] = CHSV(220, 255, 50);

		if (i == NUM_LEDS-1) {
			leds[i] = CHSV(220, 255, 255);
			leds[i + 60] = CHSV(220, 255, 255);
			leds[i + 120] = CHSV(220, 255, 255);
		}
		// show led
		FastLED.show();
		// go Back to Black
		leds[i] = CRGB::Black;
		leds[i + 60] = CRGB::Black;
		leds[i + 120] = CRGB::Black;

		// gravity effect
		delay(80 - constrain(i * 7, 7, 70));
	}

	// bounce/splash drop back for 3 leds
	int dropBounces = 0;
	byte brigthtness = 255;
	while(brigthtness > 20) {

		// bouncing routine
		while(dropBounces < 3) {
		// bounce down
			for(int i = (NUM_LEDS)-1; i >= (NUM_LEDS)-3+dropBounces; i--) {
				leds[i] = CHSV(220, 255, brigthtness);
				leds[i + 60] = CHSV(220, 255, brigthtness);
				leds[i + 120] = CHSV(220, 255, brigthtness);
				FastLED.show();
				leds[i] = CRGB::Black;
				leds[i + 60] = CRGB::Black;
				leds[i + 120] = CRGB::Black;
				delay(80 - (NUM_LEDS - i) * 20);
				brigthtness -= 10;
			}

			// bounce up
			for(int i =(NUM_LEDS)-3+dropBounces; i < NUM_LEDS; i++) {
				leds[i] = CHSV(220, 255, brigthtness);
        leds[i + 60] = CHSV(220, 255, brigthtness);
				leds[i + 120] = CHSV(220, 255, brigthtness);
				FastLED.show();
				leds[i] = CRGB::Black;
				leds[i + 60] = CRGB::Black;
				leds[i + 120] = CRGB::Black;
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
			leds[NUM_LEDS-1 + 60] = CHSV(220, 255, brigthtness + i);
			leds[NUM_LEDS-1 + 120] = CHSV(220, 255, brigthtness + i);
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
      leds[NUM_LEDS-1 + 60] = CHSV(220, 255, brigthtness + i);
			leds[NUM_LEDS-1 + 120] = CHSV(220, 255, brigthtness + i);
			FastLED.show();
			delay(7);

			// for every 4 loops
			if (i % 4 == 0 ) {
				// decrease brightness
				brigthtness--;
			}
		}

		leds[NUM_LEDS-1] = CRGB::Black;
		leds[NUM_LEDS-1 + 60] = CRGB::Black;
		leds[NUM_LEDS-1 + 120] = CRGB::Black;
		delay(20);
	}
}

void unicornPaparazzi(byte popularity, byte delayy, byte h, byte s, byte v) {

  for (int i = 0; i < popularity; i ++) {
    leds[random(0, NUM_LEDS-1)] = CHSV(h, s, v);
  }

  FastLED.show();
  setAllCHSV(0, 0, 0);
  delay(delayy);
}

// lights up random segment, depends on controlSegment();
void randomSegementLightUp(byte h, byte s, byte v) {
  byte leg = random(0, 3);
  byte seg = random(0, 4);
  controlSegment(leg, seg, h, s, v);
}
