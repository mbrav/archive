// Created by Michael Braverman
// 9 March 2016

int switchPin = 4;
int x = 111;
int y = 222;  
int z = 333;                        

void setup() {            
  Serial.begin(115200);                    
}

void loop() {
                              
  Serial.print(x);  
  Serial.print(y); 
  Serial.print(z);              

  delay(100);                            
}

