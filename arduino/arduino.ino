// in.fORM alpha
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
// 05 =  1st Half Max
// 06 =  1st Half Min
// 07 =  2nd Half Max
// 08 =  2nd Half Min
int AcXHistory[208+1];
int AcYHistory[208+1];
int AcZHistory[208+1];

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

  // do every 5 loops
  if (loopCount % 5 == 0) {
    AcXHistory[0] = AcX;
    AcYHistory[0] = AcY;
    AcZHistory[0] = AcZ;
    shiftArray(AcXHistory);
    shiftArray(AcYHistory);
    shiftArray(AcZHistory);
  }

  // do every 25 loops
  if (loopCount % 25 == 0) {
    calculateMedian(AcXHistory);
    calculateMedian(AcYHistory);
    calculateMedian(AcZHistory);
    findPeak(AcXHistory);
    findPeak(AcYHistory);
    findPeak(AcZHistory);
  }

  Serial.print(AcXHistory[201]);
  Serial.print('\t');
  Serial.print(AcXHistory[202]);
  Serial.print('\t');
  Serial.print(AcXHistory[203]);
  Serial.print('\t');
  Serial.print(AcXHistory[204]);
  Serial.print('\t');
  Serial.print(AcXHistory[205]);
  Serial.print('\t');
  Serial.print(AcXHistory[206]);
  Serial.print('\t');
  Serial.print(AcXHistory[207]);
  Serial.print('\t');
  Serial.print(AcXHistory[208]);
  Serial.println('\t');

  loopCount++;
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

// Find Peak
// Takes two parts of the array and calculates
// the minimum and maxims peaks in each one of them
void findPeak(int array[]) {
  // set min and max values to peaks
  int maxHalf1 = -32768;
  int minHalf1 = 32767;
  int maxHalf2 = -32768;
  int minHalf2 = 32767;

  // calculate peaks inn the first half
  for (int i = 0; i < arrayLength/2; i ++) {
    // register max
    if (maxHalf1 < array[i]) {
      array[arrayLength + 5] = array[i];
      maxHalf1 = array[i];
    }

    // register min
    else if (minHalf1 > array[i]) {
      array[arrayLength + 6] = array[i];
      minHalf1 = array[i];
    }
  }
  // calculate peaks inn the second half
  for (int i = arrayLength/2; i < arrayLength; i ++) {
    // register max
    if (maxHalf2 < array[i]) {
      array[arrayLength + 7] = array[i];
      maxHalf2 = array[i];
    }

    // register min
    else if (minHalf2 > array[i]) {
      array[arrayLength + 8] = array[i];
      minHalf2 = array[i];
    }
  }
}
