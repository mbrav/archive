// The Endevour's Guide for the 21st Century
// Created Feb 16, 2016
// by Michael Braverman

int pot = 14;
int count;
int timeDelay;

int sensorValue = 0;        // value read from the pot
int output = 0;        // value output to the PWM (analog out)

void setup() {                
  pinMode(pot, INPUT);
  
  for (int i = 6; i <= 13; i++) {
    pinMode(i, OUTPUT);
  }
  
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
    digitalWrite(i, HIGH);   // turn the LED on (HIGH is the voltage level)
    delay(timeDelay);               // wait for a second
    digitalWrite(i, LOW);    // turn the LED off by making the voltage LOW
  }

  Serial.println(timeDelay);
}
