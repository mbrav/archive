// The Endeavour's Guide for the 21st Century
// Created Feb 16, 2016
// by Michael Braverman

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>

Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);

// PROGRAM MODES
const byte modesCount = 4;
byte currentMode ;
byte lastMode;
const byte headingMode = 1;
const byte compassMode = 2;
const byte directMode = 3;
const byte saveMode = 4;

// POTENTIOMETER PIN
const byte potPin = 14;
int potValue = 0;    // value read from the pot

// DISPLAY PINS
const byte aPin = 13;
const byte bPin = 12;
const byte cPin = 11;
const byte dPin = 10;
const byte ePin = 9;
const byte fPin = 8;
const byte gPin = 7;

// SEGMENT CONTROL PINS
const byte seg1 = 6;
const byte seg2 = 5;
const byte seg3 = 3;
const byte segments[] = {seg1, seg2, seg3};
byte currentSeg;

// number to be displayed on screen
unsigned int displayNum;
// array version of the number
byte displayNumParse[3];

int refreshInterval = 1; // in ms
int refreshInterval2 = 25; // in ms
int modeViewDuration = 1000; // in ms

// TIMERS
// nameOfTheTimerMillisX where "X" is its number
unsigned long timerMillis1;
unsigned long sensorRefreshMillis2;
unsigned long modeViewMillis3;
unsigned long directionSetMillis4;

float headingDegrees = 0.0; // direction of the sensor
int savedDirection = 134;

void setup() {
  pinMode(potPin, INPUT);

  pinMode(aPin, OUTPUT);
  pinMode(bPin, OUTPUT);
  pinMode(cPin, OUTPUT);
  pinMode(dPin, OUTPUT);
  pinMode(ePin, OUTPUT);
  pinMode(fPin, OUTPUT);
  pinMode(gPin, OUTPUT);

  pinMode(seg1, OUTPUT);
  pinMode(seg2, OUTPUT);
  pinMode(seg3, OUTPUT);

  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }

  /* Initialise the sensor */
 if(!mag.begin())
 {
   /* There was a problem detecting the HMC5883 ... check your connections */
   Serial.println("Ooops, no HMC5883 detected ... Check your wiring!");
   while(1);
 }
}

// the loop routine runs over and over again forever:
void loop() {

  // a function that allows to send command throught the Serial monitor
  while (Serial.available() > 0) {
    byte inByte = Serial.parseInt();
    inByte  = constrain(inByte, 0, 255);
    refreshInterval = inByte;
  }

  // if (currentMode == headingMode) {
  //   Serial.println("1");
  // } else if (currentMode == compassMode) {
  //   Serial.println("2");
  // } else if (currentMode == directMode) {
  //   Serial.println("3");
  // } else if (currentMode == saveMode) {
  //   Serial.println("4");
  // }

  // display refresh timmer
  if ((millis() - timerMillis1) > refreshInterval) {
    // record the time of when this action occured
    timerMillis1 = millis();
    // refresh display
    refreshDisplay();
  }

  // sensor refresh timmer
  if ((millis() - sensorRefreshMillis2) > refreshInterval2) {
    // record the time of when this action occured
    sensorRefreshMillis2 = millis();
    //read sensor
    refreshSensorReading();
  }

  // read the pot
  potValue = analogRead(potPin);
  // calculate the current mode based on reading
  currentMode = potValue / (1024/modesCount) + 1;

  // check if the mode changed since the last registered mode
  if (currentMode != lastMode) {
    // set the last registered mode to current mode
    lastMode = currentMode;
    // record the time of when this action occured
    modeViewMillis3 = millis();
  }

  // timer for viewing what mode it is currently
  if (millis() < modeViewMillis3 + modeViewDuration) {
    displayNum = currentMode * 111;
    // display the current mode less than modeViewTimer ms have passed
  } else {
    // otherwise display based on current modes:
    if (currentMode == headingMode) {
      // display heading
      displayNum = headingDegrees;
    } else if (currentMode == compassMode) {
      // display a compass on a 7 segment display
      // ToDo
    } else if (currentMode == directMode) {
      // display the relative direction
      displayNum = abs(headingDegrees - savedDirection);
    } else if (currentMode == saveMode) {
      // save a new direction after 5 seconds
        if (millis() > directionSetMillis4 + 5000) {
          directionSetMillis4 = millis();
          // set the direction
          savedDirection = headingDegrees;
          Serial.print("SET TO:");
          Serial.println(savedDirection);
        }
    }

    if (currentMode != saveMode) {
      // keep the timer necessary for the saveMode fresh
      directionSetMillis4 = millis();
    }
  }

  // The display does not display numbers bigger than 999
  if (displayNum > 999) {
    displayNum = 999;
  }

  // number parser for displaying single digits
  int displayNum2 = displayNum;
  for (int i = 0; i < sizeof(displayNumParse); i++) {
    int y = displayNum2/10;
    displayNumParse[i] = displayNum2-(10*y);
    displayNum2 = y;
  }

  // print the performance every 5 seconds
  fps(5);
}

void refreshDisplay() {
  if (currentSeg == 0) {
    displayDigit(displayNumParse[0], seg1);
  } else if (currentSeg == 1) {
    // hack that allows to display number that are shorter than two digits
    if (displayNum < 10) {
      // this makes displayDigit() to turn off the digit completley
      displayDigit(10, seg2);
    } else {
      displayDigit(displayNumParse[1], seg2);
    }
  } else if (currentSeg == 2) {
    // hack that allows to display numbers that are shorter than three digits
    if (displayNum < 100) {
      // this makes displayDigit() to turn off the digit completley
      displayDigit(10, seg3);
    } else {
      displayDigit(displayNumParse[2], seg3);
    }
  }

  currentSeg++;

  if (currentSeg > 2) {
    currentSeg = 0;
  }
}

void refreshSensorReading() {
  /* Get a new sensor event */
  sensors_event_t event;
  mag.getEvent(&event);

  // Hold the module so that Z is pointing 'up' and you can measure the heading with x&y
  // Calculate heading when the magnetometer is level, then correct for signs of axis.
  float heading = atan2(event.magnetic.y, event.magnetic.x);

  // Once you have your heading, you must then add your 'Declination Angle', which is the 'Error' of the magnetic field in your location.
  // Find yours here: http://www.magnetic-declination.com/
  // Mine is: -13* 2' W, which is ~13 Degrees, or (which we need) 0.22 radians
  // If you cannot find your Declination, comment out these two lines, your compass will be slightly off.
  float declinationAngle = 0.22;
  heading += declinationAngle;

  // Correct for when signs are reversed.
  if(heading < 0)
  heading += 2*PI;

  // Check for wrap due to addition of declination.
  if(heading > 2*PI)
  heading -= 2*PI;

  // Convert radians to degrees for readability.
  headingDegrees = heading * 180/M_PI;
}

void displayDigit(byte digit, byte segment) {

  // clear segments and digits
  digitalWrite(aPin, LOW);
  digitalWrite(bPin, LOW);
  digitalWrite(cPin, LOW);
  digitalWrite(dPin, LOW);
  digitalWrite(ePin, LOW);
  digitalWrite(fPin, LOW);
  digitalWrite(gPin, LOW);
  digitalWrite(seg1, HIGH);
  digitalWrite(seg2, HIGH);
  digitalWrite(seg3, HIGH);

  // set the current digit
  digitalWrite(segment, LOW);

  switch (digit) {
    case 0:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(ePin, HIGH);
      digitalWrite(gPin, HIGH);
      break;
    case 1:
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      break;
    case 2:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(ePin, HIGH);
      digitalWrite(fPin, HIGH);
      break;
    case 3:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(fPin, HIGH);
      break;
    case 4:
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(gPin, HIGH);
      digitalWrite(fPin, HIGH);
      break;
    case 5:
      digitalWrite(aPin, HIGH);
      digitalWrite(fPin, HIGH);
      digitalWrite(gPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      break;
    case 6:
      digitalWrite(aPin, HIGH);
      digitalWrite(fPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(ePin, HIGH);
      digitalWrite(gPin, HIGH);
      break;
    case 7:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      break;
    case 8:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(ePin, HIGH);
      digitalWrite(fPin, HIGH);
      digitalWrite(gPin, HIGH);
      break;
    case 9:
      digitalWrite(aPin, HIGH);
      digitalWrite(bPin, HIGH);
      digitalWrite(cPin, HIGH);
      digitalWrite(dPin, HIGH);
      digitalWrite(fPin, HIGH);
      digitalWrite(gPin, HIGH);
      break;
    default:
      digitalWrite(aPin, LOW);
      digitalWrite(bPin, LOW);
      digitalWrite(cPin, LOW);
      digitalWrite(dPin, LOW);
      digitalWrite(ePin, LOW);
      digitalWrite(fPin, LOW);
      digitalWrite(gPin, LOW);
      break;
  }
}

// program performance monitoring function
static inline void fps(const int seconds) {
  // Create static variables so that the code and variables can
  // all be declared inside a function
  static unsigned long lastMillis;
  static unsigned long frameCount;
  static unsigned int framesPerSecond;

  // It is best if we declare millis() only once
  unsigned long now = millis();
  frameCount ++;
  if (now - lastMillis > seconds * 1000) {
    framesPerSecond = frameCount / seconds;
    Serial.println(framesPerSecond);
    frameCount = 0;
    lastMillis = now;
  }
}
