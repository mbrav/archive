// Created by Michael Braverman
// 9 March 2016

// Usese PaulStoffregen's optimized Adafruit_ST7735 library
// https://github.com/PaulStoffregen/Adafruit_ST7735

// MPU-6050 sensor setup
#include<Wire.h>
const int MPU_addr=0x68;  // I2C address of the MPU-6050
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;  

// ST7735 lcd setup
#include <Adafruit_GFX.h>    // Core graphics library
#include <Adafruit_ST7735.h> // Hardware-specific library
#include <SPI.h>

// This Teensy3 native optimized version requires specific pins
#define sclk 13  // SCLK can also use pin 14
#define mosi 11  // MOSI can also use pin 7
#define cs   10  // CS & DC can use pins 2, 6, 9, 10, 15, 20, 21, 22, 23
#define dc   9   //  but certain pairs must NOT be used: 2+10, 6+9, 20+23, 21+22
#define rst  8   // RST can use any pin
#define sdcs 4   // CS for SD card, can use any pin

#if defined(__SAM3X8E__)
    #undef __FlashStringHelper::F(string_literal)
    #define F(string_literal) string_literal
#endif

// Option 1: use any pins but a little slower
//Adafruit_ST7735 tft = Adafruit_ST7735(cs, dc, mosi, sclk, rst);

// Option 2: must use the hardware SPI pins
// (for UNO thats sclk = 13 and sid = 11) and pin 10 must be
// an output. This is much faster - also required if you want
// to use the microSD card (see the image drawing example)
Adafruit_ST7735 tft = Adafruit_ST7735(cs, dc, rst);
float p = 3.1415926;

// TIMERS
// nameOfTheTimerMillisX where "X" is its number
unsigned long timerMillis1;
int refreshInterval1 = 200; // in ms

void setup() { 
  pinMode(sdcs, INPUT_PULLUP);  // keep SD CS high when not using SD card
  Wire.begin();
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);           
  Serial.begin(115200);
  
  // If your TFT's plastic wrap has a Black Tab, use the following:
  tft.initR(INITR_BLACKTAB);   // initialize a ST7735S chip, black tab
  // If your TFT's plastic wrap has a Red Tab, use the following:
  //tft.initR(INITR_REDTAB);   // initialize a ST7735R chip, red tab
  // If your TFT's plastic wrap has a Green Tab, use the following:
  //tft.initR(INITR_GREENTAB); // initialize a ST7735R chip, green tab                    
}

void loop() {

  // READ SENSOR 
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_addr,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)     
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)

  // SEND TO PROCESSING 
  Serial.print(AcX);
  Serial.print(',');                
  Serial.print(AcY); 
  Serial.print(','); 
  Serial.print(AcZ); 
  Serial.print(',');              

  // DRAW SCREEN
  // display refresh timmer
  if ((millis() - timerMillis1) > refreshInterval1) {
    // record the time of when this action occured
    timerMillis1 = millis();
    // refresh display
    refreshDisplay();
  }                   
}

void refreshDisplay() {

  // draw settings 
  int barWidth = 113;

  // read values 
  int AcBarX = map(AcX, -15000, 15000, 0, barWidth);
  int AcBarY = map(AcY, -15000, 15000, 0, barWidth);
  int AcBarZ = map(AcZ, -15000, 15000, 0, barWidth);
  int GyBarX = map(GyX, -15000, 15000, 0, barWidth);
  int GyBarY = map(GyY, -15000, 15000, 0, barWidth);
  int GyBarZ = map(GyZ, -15000, 15000, 0, barWidth);

  // for some reason the number is negative and multiplied by 100
  // convert temp to a good value
  float temp = -Tmp;
  temp = temp /100;
  
  // text 
  tft.fillScreen(ST7735_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(10, 5);
  tft.print("Acceleration:");
  tft.setCursor(10, 80);
  tft.print("Gyro""); 
  tft.setCursor(50, 150);
  tft.print("Temp:");
  tft.setTextColor(ST7735_GREEN);
  tft.print(temp);
  tft.setTextColor(ST7735_WHITE);
  tft.print("C");
  
  // acceleration
  tft.fillRoundRect(10, 20, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 20, AcBarX, 10, 3, ST7735_CYAN);
  tft.fillRoundRect(10, 40, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 40, AcBarY, 10, 3, ST7735_YELLOW);
  tft.fillRoundRect(10, 60, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 60, AcBarZ, 10, 3, ST7735_MAGENTA);

  // gyro
  tft.fillRoundRect(10, 95, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 95, GyBarX, 10, 3, ST7735_RED);
  tft.fillRoundRect(10, 115, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 115, GyBarY, 10, 3, ST7735_GREEN);
  tft.fillRoundRect(10, 135, barWidth, 10, 3, ST7735_WHITE);
  tft.fillRoundRect(10, 135, GyBarZ, 10, 3, ST7735_BLUE);
}

