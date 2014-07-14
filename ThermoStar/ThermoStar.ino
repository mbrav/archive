/*
 Thermo Star v1.1 "Beyond Perfection"
  
 Created 25 June 2014
 by Michael Braverman
*/

#include "DHT.h"  // Adafruit's DHT library
#include <TFT.h>  // Arduino LCD library
#include <SPI.h>  // SPI for the display

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11 
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

#define DHTPIN 14     // What pin the DHT sensor is connected to

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

#define cs   10
#define dc   9
#define rst  8

TFT TFTscreen = TFT(cs, dc, rst);
DHT dht(DHTPIN, DHTTYPE);

// Variables necessary for outputing strings
String temperatureString; 
char temperaturePrintout[5];
String humidityString;
char humidityPrintout[3];

float temperatureValue;

// Two arrays for every measurment
float temperatureMax[24]; // One for floats
String temperatureMaxString[24]; // And one for strings
float temperatureMin[24];
String temperatureMinString[24];

// Variables that allow the program to run without delays
unsigned long previosMillis; // For screen and sensor refreshing
unsigned long previosTimeMillis; // For counting one hour
const long oneHour = 3600000;
boolean refresh = true;
const int RefreshInterval = 15000;

void setup() {
  dht.begin(); 
  TFTscreen.begin();
  
  TFTscreen.background(0, 0, 0);
  TFTscreen.stroke(255, 255, 255);
  
  // Necessary to set values instead of default (zero)
  for(int i = 1; i <= 23; i++){
    temperatureMax[i] = -99;
    temperatureMin[i] = 99;
  }

  temperatureValue = dht.readTemperature();
  temperatureMax[0] = temperatureValue;
  temperatureMin[0] = temperatureValue;
  temperatureString = String(dht.readTemperature());
  temperatureMaxString[0] = temperatureString;
  temperatureMinString[0] = temperatureString;
}

void loop() {
  // Update the screen and sensor readings only when requested
  if (refresh){
    sensorUpdate();
    mainScreen();
  }
  
  refresh = false; // Set to false until triggered again
  
  // If "previosMillis" milliSeconds pass 
  if ((millis() - previosMillis) > RefreshInterval){
    previosMillis = millis();
    refresh = true;
  }
  
  // If "oneHour" milliSeconds pass 
  if ((millis() - previosTimeMillis) > oneHour){
    previosTimeMillis = millis();
    shiftArray();
  }
  
  // If millis() overflows it will equal less than previosMillis 
  if (millis() < previosMillis){
    previosMillis = 0; // therfore previosMillis should always be less than millis()
    previosTimeMillis = 0;
  }
}

void sensorUpdate(){
  temperatureValue = dht.readTemperature();
  temperatureString = String(dht.readTemperature());
  humidityString = String(dht.readHumidity());
  
  // Set the maximum temperature of the current hour
  if (temperatureValue > temperatureMax[0]){
    temperatureMax[0] = temperatureValue;
    temperatureMaxString[0] = temperatureString;
  }
  
  // Set the minimum temperature of the current hour
  if (temperatureValue < temperatureMin[0]){
    temperatureMin[0] = temperatureValue;
    temperatureMinString[0] = temperatureString;
  }
}

void mainScreen(){
  // Convert strings to chars that the display can render 
  temperatureString.toCharArray(temperaturePrintout, 5);
  humidityString.toCharArray(humidityPrintout, 3);
  
  TFTscreen.background(0, 0, 0);
  TFTscreen.setTextSize(2);
  TFTscreen.stroke(0, 233, 242);
  TFTscreen.text("Temperature:", 5, 20);
  TFTscreen.setTextSize(5);
  TFTscreen.text(temperaturePrintout, 12, 42);
  TFTscreen.setTextSize(3);
  TFTscreen.text("C", 132, 56);
  
  TFTscreen.setTextSize(1);
  TFTscreen.stroke(67, 175, 58);
  TFTscreen.text("Humidity", 100, 92);
  TFTscreen.setTextSize(3);
  TFTscreen.text(humidityPrintout, 100, 105);
  TFTscreen.text("%", 137, 105);
  
  // The graph lines and text
  TFTscreen.setTextSize(1);
  TFTscreen.stroke(255, 255, 255);
  TFTscreen.text("Thermo Star v1.1", 5, 5);
  TFTscreen.text("12h", 32, 92);
  TFTscreen.text("24h", 63, 92);
  TFTscreen.line(5, 101, 85, 101);
  TFTscreen.line(5, 114, 85, 114);
  TFTscreen.line(26, 92, 26, 127);
  TFTscreen.line(57, 92, 57, 127);
  
  // Numbers and names in the graph
  TFTscreen.stroke(0, 0, 255);
  TFTscreen.text("Max", 5, 105);
  // Find the hottest record in the past 12 hours (-1)
  temperatureMaxString[maxTemp(11)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 29, 105);
  // Find the hottest record in the past 24 hours (-1)
  temperatureMaxString[maxTemp(23)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 60, 105);
  TFTscreen.stroke(255, 150, 0);
  TFTscreen.text("Min", 5, 117);
  // Find the coldest record in the past 12 hours (-1)
  temperatureMinString[minTemp(11)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 29, 117);
  // Find the coldest record in the past 24 hours (-1)
  temperatureMinString[minTemp(23)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 60, 117);
}

// Find the hottest record from the array
byte maxTemp(byte pastHours){
  float Max = temperatureValue;
  byte maxIndex;
  for(int i = 1; i <= pastHours; i++){
    if(Max < temperatureMax[i]){  // If the number is more extreme
      Max = temperatureMax[i];    // The number will become the record
      maxIndex = i;               // Register the index of its location in the array
    }
  }
  return maxIndex;
}

// Find the coldest record from the array
byte minTemp(byte pastHours){
  float Min = temperatureValue;
  byte minIndex;
  for(int i = 1; i <= pastHours; i++){
    if(Min > temperatureMin[i]){  // If the number is more extreme
      Min = temperatureMin[i];    // The number will become the record
      minIndex = i;               // Register the index of its location in the array
    }
  }
  return minIndex;
}

void shiftArray(){
  // Shift all the records further by one index
  for(int i = 22; i >= 0; i--){
    temperatureMax[i+1] = temperatureMax[i];
    temperatureMaxString[i+1] = temperatureMaxString[i];
    temperatureMin[i+1] = temperatureMin[i];
    temperatureMinString[i+1] = temperatureMinString[i];
  }
  
  // Set the first records as the current temperature 
  temperatureMax[0] = temperatureValue;
  temperatureMin[0] = temperatureValue;
  temperatureMaxString[0] = temperatureString;
  temperatureMinString[0] = temperatureString;
}
