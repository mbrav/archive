// Created by Michael Braverman
// 9 March 2016

// MPU-6050 sensor setup
#include<Wire.h>
const int address=0x68;  // I2C address of the MPU-6050
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;

const unsigned int arrayLength = 200;
int AcXHistory[200];
int AcYHistory[200];
int AcZHistory[200];

unsigned int loopCount;

int qarterMedian1;
int qarterMedian2;
int qarterMedian3;
int qarterMedian4;


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
    lookForChange(AcXHistory);
  }
}

void shiftArray(int array[]){
  // Shift all the records further by one index
  for(int i = arrayLength-1; i > 0; i--){
    array[i] = array[i-1];
  }
}

void lookForChange(int array[]) {

  for (int i = 0; i < 50; i ++) {
    qarterMedian1 += array[i];
    qarterMedian2 += array[i + 50];
    qarterMedian3 += array[i + 100];
    qarterMedian4 += array[i + 150];
  }

  qarterMedian1 = qarterMedian1/50;
  qarterMedian2 = qarterMedian2/50;
  qarterMedian3 = qarterMedian3/50;
  qarterMedian4 = qarterMedian4/50;

  Serial.print(qarterMedian1);
  Serial.print('\t');
  Serial.print(qarterMedian2);
  Serial.print('\t');
  Serial.print(qarterMedian3);
  Serial.print('\t');
  Serial.print(qarterMedian4);
  Serial.println('\t');
}

void updateSensorValues() {
  // READ SENSOR
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
