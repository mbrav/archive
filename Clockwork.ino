// The Endevour's Guide for the 21st Century
// Created Feb 16, 2016
// by Michael Braverman

int pot = 14;
int count;
int timeDelay;

int sensorValue = 0;        // value read from the pot
int output = 0;        // value output to the PWM (analog out)

// DISPLAY PINS
int aPin = 13;
int bPin = 12;
int cPin = 11;
int dPin = 10;
int ePin = 9;
int fPin = 8;
int gPin = 7;

void setup() {
  pinMode(pot, INPUT);

  pinMode(aPin, OUTPUT);
  pinMode(bPin, OUTPUT);
  pinMode(cPin, OUTPUT);
  pinMode(dPin, OUTPUT);
  pinMode(ePin, OUTPUT);
  pinMode(fPin, OUTPUT);
  pinMode(gPin, OUTPUT);

  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB
  }

  Serial.println("Please Enter a delay value");
}

// the loop routine runs over and over again forever:
void loop() {
  while (Serial.available() > 0) {
    int inByte = Serial.parseInt();
    inByte  = constrain(inByte, 0, 255);
    timeDelay = inByte;
  }

  sensorValue = analogRead(pot);
  output = map(sensorValue, 0, 1023, 5, 200);

  for (int i = 7; i <= 13; i++) {
    displayDigit(99);
    displayDigit(i-7);
    delay(timeDelay);
    displayDigit(99);
  }

  Serial.println(timeDelay);
}

byte displayDigit(byte digit) {
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
