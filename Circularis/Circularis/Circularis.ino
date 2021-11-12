/*
  Melody

 Plays a melody

 circuit:
 * 8-ohm speaker on digital pin 8

 created 21 Jan 2010
 modified 30 Aug 2011
 by Tom Igoe

This example code is in the public domain.

 http://www.arduino.cc/en/Tutorial/Tone

 */
#include "pitches.h"

// shift register
int datapin = 11;
int clockpin = 10;
int latchpin = 9;

byte data = 0;

int sensorPin = A0;    // select the input pin for the potentiometer
int sensorPin2 = A1;    // select the input pin for the potentiometer
int sensorValue = 0;  // variable to store the value coming from the sensor
int sensorValue2 = 0;  // variable to store the value coming from the sensor

// notes in the melody:
int melody[] = {
  NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4
};

// note durations: 4 = quarter note, 8 = eighth note, etc.:
int noteDurations[] = {
  4, 8, 8, 4, 4, 4, 4, 4
};

int tempoBeat;
int melodyLength;

void setup() {
  pinMode(datapin, OUTPUT);
  pinMode(clockpin, OUTPUT);
  pinMode(latchpin, OUTPUT);
  Serial.begin(115200);

  melodyLength = sizeof(melody);
  // iterate over the notes of the melody:
  for (int thisNote = 0; thisNote < 8; thisNote++) {

    // to calculate the note duration, take one second
    // divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(8, melody[thisNote], noteDuration);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    // stop the tone playing:
    noTone(8);
  }
}

void loop() {
  // read the value from the sensor:
  sensorValue = analogRead(sensorPin);
  sensorValue2 = analogRead(sensorPin2);
  // Serial.print(sensorValue);
  // Serial.print(", ");
  // Serial.print(sensorValue2);
  // Serial.println(" ");

  tempoBeat++;

  // for(int index = 0; index <= 7; index++) {
    shiftWrite(tempoBeat%8, HIGH);    // turn LED on
    shiftWrite((tempoBeat-1)%8, LOW);    // turn LED on
    // delay(10);
    // shiftWrite(tempoBeat%8, LOW); // turn LED off
  // }

  // to calculate the note duration, take one second
  // divided by the note type.
  //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
  // int noteDuration = 1000 / noteDurations[tempoBeat%melodyLength];
  tone(8,  melody[tempoBeat%melodyLength]+sensorValue, sensorValue2/2);

  // to distinguish the notes, set a minimum time between them.
  // the note's duration + 30% seems to work well:
  // int pauseBetweenNotes = noteDuration * 1.30;
  delay(sensorValue2 + 40);
  // stop the tone playing:
  noTone(8);
}

void shiftWrite(int desiredPin, boolean desiredState)

// This function lets you make the shift register outputs
// HIGH or LOW in exactly the same way that you use digitalWrite().

// Like digitalWrite(), this function takes two parameters:

//    "desiredPin" is the shift register output pin
//    you want to affect (0-7)

//    "desiredState" is whether you want that output
//    to be HIGH or LOW

// Inside the Arduino, numbers are stored as arrays of "bits",
// each of which is a single 1 or 0 value. Because a "byte" type
// is also eight bits, we'll use a byte (which we named "data"
// at the top of this sketch) to send data to the shift register.
// If a bit in the byte is "1", the output will be HIGH. If the bit
// is "0", the output will be LOW.

// To turn the individual bits in "data" on and off, we'll use
// a new Arduino commands called bitWrite(), which can make
// individual bits in a number 1 or 0.
{
  // First we'll alter the global variable "data", changing the
  // desired bit to 1 or 0:

  bitWrite(data,desiredPin,desiredState);

  // Now we'll actually send that data to the shift register.
  // The shiftOut() function does all the hard work of
  // manipulating the data and clock pins to move the data
  // into the shift register:

  shiftOut(datapin, clockpin, MSBFIRST, data);

  // Once the data is in the shift register, we still need to
  // make it appear at the outputs. We'll toggle the state of
  // the latchPin, which will signal the shift register to "latch"
  // the data to the outputs. (Latch activates on the low-to
  // -high transition).

  digitalWrite(latchpin, HIGH);
  digitalWrite(latchpin, LOW);
}
