// The Endevour's Guide for the 21st Century
// Created Feb 16, 2016
// by Michael Braverman

const byte pot = 14;

int sensorValue = 0;        // value read from the pot
int output = 0;        // value output to the PWM (analog out)

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

int refreshInterval = 2; // in ms
unsigned long previosMillis;
boolean refresh;

boolean state;
void setup() {
  pinMode(pot, INPUT);

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

  Serial.println("Please Enter a delay value");
}

// the loop routine runs over and over again forever:
void loop() {
  while (Serial.available() > 0) {
    byte inByte = Serial.parseInt();
    inByte  = constrain(inByte, 0, 255);
    refreshInterval = inByte;
  }

  if ((millis() - previosMillis) > refreshInterval){
    previosMillis = millis();
    refresh = true;
  }

  if (refresh) {
      displayDigit(2, segments[currentSeg]);
      currentSeg++;
      if (currentSeg > 3) {
          currentSeg = 0;
      }
      refresh = false;
  }

  // sensorValue = analogRead(pot);
  // output = map(sensorValue, 0, 1023, 5, 200);

  Serial.println(refreshInterval);
}

byte displayDigit(byte digit, byte segment) {

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
      digitalWrite(fPin, HIGH);
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
