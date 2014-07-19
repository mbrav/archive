/*
 ThermoStar v1.3 "Second Breath"
  
 This program uses and external DHT sensor library by Adafruit
 https://github.com/adafruit/DHT-sensor-library

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

//================ EXPERIMENTAL FEATURES ================
// Turn them off by setting them to "false" instead of "true"

boolean GRAPH = true;

//=======================================================

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
int hourCount;
boolean refresh = true;
boolean screenToggle;
const int refreshInterval = 15000; 

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
    if (screenToggle){
      if (GRAPH){
        graphScreen();
      }
    } else {
      mainScreen();
    }
    screenToggle = !screenToggle;
  }
  
  refresh = false; // Set to false until triggered again
  
  // If "previosMillis" milliSeconds pass 
  if ((millis() - previosMillis) > refreshInterval){
    previosMillis = millis();
    refresh = true;
  }
  
  // If "oneHour" milliSeconds pass 
  if ((millis() - previosTimeMillis) > oneHour){
    previosTimeMillis = millis();
    shiftArray();
    hourCount ++;
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
  
  // Screen Outlines
  TFTscreen.background(0, 0, 0);
  TFTscreen.fill(0, 0, 0);
  TFTscreen.stroke(100, 100, 100);
  TFTscreen.rect(0, 106, 160, 22); // Bottom rectangle (more dark)
  TFTscreen.stroke(255, 255, 255);
  TFTscreen.rect(0, 0, 160, 107);  // Top rectangle (more light)
  
  TFTscreen.setTextSize(2);
  TFTscreen.stroke(0, 233, 242);
  TFTscreen.text("Temperature:", 10, 5);
  TFTscreen.setTextSize(5);
  TFTscreen.text(temperaturePrintout, 12, 25);
  TFTscreen.setTextSize(3);
  TFTscreen.text("C", 132, 39);
  
  TFTscreen.setTextSize(1);
  TFTscreen.stroke(67, 175, 58);
  TFTscreen.text("Humidity", 100, 67);
  TFTscreen.setTextSize(3);
  TFTscreen.text(humidityPrintout, 100, 80);
  TFTscreen.text("%", 137, 80);
  
  // The graph lines and text
  TFTscreen.setTextSize(1);
  TFTscreen.stroke(255, 255, 255);
  TFTscreen.text("ThermoStar v1.3", 2, 119);
  TFTscreen.text("12h", 32, 67);
  TFTscreen.text("24h", 63, 67);
  TFTscreen.line(5, 76, 85, 76);
  TFTscreen.line(5, 89, 85, 89);
  TFTscreen.line(26, 67, 26, 102);
  TFTscreen.line(57, 67, 57, 102);
  // To display the hourCount on the TFT screen
  TFTscreen.stroke(253, 164, 252);
  TFTscreen.text("Hours Up:", 2, 109); 
  String(hourCount).toCharArray(temperaturePrintout, 5); 
  TFTscreen.text(temperaturePrintout, 59, 109);
  
  // Numbers and names in the graph
  TFTscreen.stroke(0, 0, 255);
  TFTscreen.text("Max", 5, 80);
  // Find the hottest record in the past 12 hours (-1)
  temperatureMaxString[maxTemp(11)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 29, 80);
  
  // Unless 12 hours have passed, don't display the 24 hours maximum record
  if (hourCount < 12) { 
    TFTscreen.text("-", 70, 80); // Instead show that not enought hours passed
  } else {
    // Find the hottest record in the past 24 hours (-1)
    temperatureMaxString[maxTemp(23)].toCharArray(temperaturePrintout, 5);
    TFTscreen.text(temperaturePrintout, 60, 80);
  }
  
  TFTscreen.stroke(255, 150, 0);
  TFTscreen.text("Min", 5, 92);
  // Find the coldest record in the past 12 hours (-1)
  temperatureMinString[minTemp(11)].toCharArray(temperaturePrintout, 5);
  TFTscreen.text(temperaturePrintout, 29, 92);
  
  // Unless 12 hours have passed, don't display the 24 hours minimum record
  if (hourCount < 12) { 
    TFTscreen.text("-", 70, 92); // Instead show that not enought hours passed
  } else {
    // Find the coldest record in the past 24 hours (-1)
    temperatureMinString[minTemp(23)].toCharArray(temperaturePrintout, 5);
    TFTscreen.text(temperaturePrintout, 60, 92);
  }
}

void graphScreen(){
  TFTscreen.background(0, 0, 0);
  TFTscreen.setTextSize(1);
  
  // Hour Marks
  TFTscreen.stroke(255, 255, 255);
  TFTscreen.text("Hour", 5, 107);
  TFTscreen.text("0", 34, 107);
  TFTscreen.text("2", 44, 107);
  TFTscreen.text("4", 54, 107);
  TFTscreen.text("6", 64, 107);
  TFTscreen.text("8", 74, 107);
  TFTscreen.text("10", 82, 107);
  TFTscreen.text("15", 107, 107);
  TFTscreen.text("20", 132, 107);
  TFTscreen.text("24", 148, 107);
  
  TFTscreen.stroke(0, 0, 255);
  if (hourCount < 23){
    temperatureMaxString[maxTemp(hourCount)].toCharArray(temperaturePrintout, 5);
    TFTscreen.text(temperaturePrintout, 5, 5);
    temperatureMinString[minTemp(hourCount)].toCharArray(temperaturePrintout, 5);
    TFTscreen.stroke(255, 150, 0);
    TFTscreen.text(temperaturePrintout, 5, 98);
  } else {
    temperatureMaxString[maxTemp(23)].toCharArray(temperaturePrintout, 5);
    TFTscreen.text(temperaturePrintout, 5, 5);
    temperatureMinString[minTemp(23)].toCharArray(temperaturePrintout, 5);
    TFTscreen.stroke(255, 150, 0);
    TFTscreen.text(temperaturePrintout, 5, 98);
  }
  TFTscreen.stroke(255, 255, 255);
  TFTscreen.rect(30, 5, 130, 100);
  float recordGap = temperatureMax[maxTemp(23)] - temperatureMin[minTemp(23)];
  
  // Set the measuremnt value between two plotted lines based on the recordGap
  float oneMeasure;
  if (recordGap > 0.1 && recordGap < 1.0){
    oneMeasure = 0.1;
  } else if (recordGap >= 1.0 && recordGap <= 10){
    oneMeasure = 0.5;
  } else if (recordGap > 10){
    oneMeasure = 2.0;
  } 
  
  // The most confusing way in the world of plotting lines but it works!
  int lineDistance;
  for (int i = 0; i <= (recordGap / oneMeasure); i++){
    lineDistance = 5 + ((100 / (recordGap / oneMeasure)) * i);
    TFTscreen.line(30, lineDistance, 160, lineDistance);
  } 
  
  TFTscreen.fill(255, 255, 255);
  float maxCap;
  float minCap;
  for (int i = 0; i <= 23; i++){
    maxCap = temperatureMax[maxTemp(23)] - temperatureMax[i];
    maxCap = map(maxCap, 0, recordGap, 0, 98);
    TFTscreen.fill(0, 0, 255);
    TFTscreen.stroke(0, 0, 255);
    TFTscreen.rect(35 + (i * 5), 6 + maxCap, 4, 98 - maxCap);
  } 
}

// Find the hottest record in the array
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

// Find the coldest record in the array
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
