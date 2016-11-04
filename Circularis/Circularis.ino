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
  Serial.print(sensorValue);
  Serial.print(", ");
  Serial.print(sensorValue2);
  Serial.println(" ");

  // tempoBeat = millis()/10;
  tempoBeat++;

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

// void setup() {
//   Serial.begin(9600);
//   // iterate over the notes of the melody:
//   for (int thisNote = 0; thisNote < 8; thisNote++) {
//
//     // to calculate the note duration, take one second
//     // divided by the note type.
//     //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
//     int noteDuration = 1000 / noteDurations[thisNote];
//     tone(8, melody[thisNote], noteDuration);
//
//     // to distinguish the notes, set a minimum time between them.
//     // the note's duration + 30% seems to work well:
//     int pauseBetweenNotes = noteDuration * 1.30;
//     delay(pauseBetweenNotes);
//     // stop the tone playing:
//     noTone(8);
//   }
// }
