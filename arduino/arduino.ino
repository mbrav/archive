// Created by Michael Braverman
// 9 March 2016

// MPU-6050 sensor setup
#include<Wire.h>
const int address=0x68;  // I2C address of the MPU-6050
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;


// DATA STORAGE
const unsigned int arrayLength = 200;
// Spaces after arrayLength store calculations
// 01 =  1st Quarter Median
// 02 =  2nd Quarter Median
// 03 =  3rd Quarter Median
// 04 =  4th Quarter Median
int AcXHistory[204];
int AcYHistory[204];
int AcZHistory[204];

unsigned int loopCount;


void setup() {
  Wire.begin();
  Wire.beginTransmission(address);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(115200);
}

void loop() {
  updateSensorValues();

  shiftArray(AcXHistory);
  shiftArray(AcYHistory);
  shiftArray(AcZHistory);
  AcXHistory[0] = AcX;
  AcYHistory[0] = AcY;
  AcZHistory[0] = AcZ;

  if (loopCount % 25 == 0) {
    calculateMedian(AcXHistory);
    calculateMedian(AcYHistory);
    calculateMedian(AcZHistory);
  }

  Serial.print(AcXHistory[201]);
  Serial.print('\t');
  Serial.print(AcXHistory[202]);
  Serial.print('\t');
  Serial.print(AcXHistory[203]);
  Serial.print('\t');
  Serial.print(AcXHistory[204]);
  Serial.println('\t');
}

// Update sensor readings
void updateSensorValues() {
  // read accelerometer
  Wire.beginTransmission(address);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(address,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
}

// Shift all the records further by one index
void shiftArray(int array[]){
  for(int i = arrayLength-1; i > 0; i--){
    array[i] = array[i-1];
  }
}

// Takes four parts of the array and calculates
// the median of each on of them
// Values are stored in the four parts after the arrayLenght
void calculateMedian(int array[]) {
  for (int i = 0; i < 50; i ++) {
    array[arrayLength + 1] += array[i];
    array[arrayLength + 2]+= array[i + 50];
    array[arrayLength + 3] += array[i + 100];
    array[arrayLength + 4] += array[i + 150];
  }

  array[arrayLength + 1] = array[arrayLength + 1]/50;
  array[arrayLength + 2] = array[arrayLength + 2]/50;
  array[arrayLength + 3] = array[arrayLength + 3]/50;
  array[arrayLength + 4] = array[arrayLength + 4]/50;
}
