// Created by Michael Braverman
// 9 March 2016

int switchPin = 4;                      

void setup() {
  pinMode(switchPin, INPUT);             
  Serial.begin(115200);                    
}

void loop() {
  if (digitalRead(switchPin) == HIGH) {  
    Serial.println(1);               
  } else {                               
    Serial.println(0);               
  }
  delay(100);                            
}

