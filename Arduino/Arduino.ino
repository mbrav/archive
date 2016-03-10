// Created by Michael Braverman
// 9 March 2016

int switchPin = 4;
byte x = 111;
byte y = 121;  
byte z = 222;                        

void setup() {            
  Serial.begin(115200);                    
}

void loop() {
  Serial.print(x);
  Serial.print(',');                
  Serial.print(y); 
  Serial.print(','); 
  Serial.print(z); 
  Serial.print(',');              

  delay(25);                            
}

