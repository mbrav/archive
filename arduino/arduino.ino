// in.fORM alpha
// Created by Michael Braverman
// 9 March 2016

// MPU-6050 sensor setup
#include<Wire.h>
#include <ArduinoJson.h>
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
// 09 =  1st Half Abruptness
// 10 =  2nd Half Abruptness
// 11 =  1st Half Difference between Max and Min
// 12 =  2nd Half Difference between Max and Min
int AcXHistory[212+1];
int AcYHistory[212+1];
int AcZHistory[212+1];

// value that stores the "significance" of the event
float eventSignificance;

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

  // do every 20 loops
  if (loopCount % 25 == 0) {

    calculateMedian(AcXHistory);
    calculateMedian(AcYHistory);
    calculateMedian(AcZHistory);
    findPeak(AcXHistory);
    findPeak(AcYHistory);
    findPeak(AcZHistory);

    // reset event significance
    eventSignificance = 1.0;

    // add up event significance

    if (eventThreshold(AcXHistory)) {
      eventSignificance *= 2.2;
    }

    if (eventThreshold(AcYHistory)) {
      eventSignificance *= 2.1;
    }

    if (eventThreshold(AcZHistory)) {
      eventSignificance *= 2.0;
    }


    // eventSignificance trigger
    if (eventSignificance > 5.0) {
      // Memory pool for JSON object tree.
      StaticJsonBuffer<2000> jsonBuffer;
      JsonObject& root = jsonBuffer.createObject();

      // Event Significance
      root["eventSignificance"] = eventSignificance;

      // Accelerometer X reading statistics
      JsonArray& AcXstats = root.createNestedArray("AcXstats");
      AcXstats.add(AcXHistory[arrayLength + 1]);
      AcXstats.add(AcXHistory[arrayLength + 2]);
      AcXstats.add(AcXHistory[arrayLength + 3]);
      AcXstats.add(AcXHistory[arrayLength + 4]);
      AcXstats.add(AcXHistory[arrayLength + 5]);
      AcXstats.add(AcXHistory[arrayLength + 6]);
      AcXstats.add(AcXHistory[arrayLength + 7]);
      AcXstats.add(AcXHistory[arrayLength + 8]);
      AcXstats.add(AcXHistory[arrayLength + 9]);
      AcXstats.add(AcXHistory[arrayLength + 10]);
      AcXstats.add(AcXHistory[arrayLength + 11]);
      AcXstats.add(AcXHistory[arrayLength + 12]);

      // Accelerometer Y reading statistics
      JsonArray& AcYstats = root.createNestedArray("AcYstats");
      AcYstats.add(AcYHistory[arrayLength + 1]);
      AcYstats.add(AcYHistory[arrayLength + 2]);
      AcYstats.add(AcYHistory[arrayLength + 3]);
      AcYstats.add(AcYHistory[arrayLength + 4]);
      AcYstats.add(AcYHistory[arrayLength + 5]);
      AcYstats.add(AcYHistory[arrayLength + 6]);
      AcYstats.add(AcYHistory[arrayLength + 7]);
      AcYstats.add(AcYHistory[arrayLength + 8]);
      AcYstats.add(AcYHistory[arrayLength + 9]);
      AcYstats.add(AcYHistory[arrayLength + 10]);
      AcYstats.add(AcYHistory[arrayLength + 11]);
      AcYstats.add(AcYHistory[arrayLength + 12]);

      // Accelerometer Z reading statistics
      JsonArray& AcZstats = root.createNestedArray("AcZstats");
      AcZstats.add(AcZHistory[arrayLength + 1]);
      AcZstats.add(AcZHistory[arrayLength + 2]);
      AcZstats.add(AcZHistory[arrayLength + 3]);
      AcZstats.add(AcZHistory[arrayLength + 4]);
      AcZstats.add(AcZHistory[arrayLength + 5]);
      AcZstats.add(AcZHistory[arrayLength + 6]);
      AcZstats.add(AcZHistory[arrayLength + 7]);
      AcZstats.add(AcZHistory[arrayLength + 8]);
      AcZstats.add(AcZHistory[arrayLength + 9]);
      AcZstats.add(AcZHistory[arrayLength + 10]);
      AcZstats.add(AcZHistory[arrayLength + 11]);
      AcZstats.add(AcZHistory[arrayLength + 12]);

      // Accelerometer X readings
      JsonArray& AcX = root.createNestedArray("AcX");
      for (int i = 10; i < 30; i ++) {
        AcX.add(AcXHistory[i]);
      }

      // Accelerometer Y readings
      JsonArray& AcY = root.createNestedArray("AcY");
      for (int i = 10; i < 30; i ++) {
        AcY.add(AcYHistory[i]);
      }

      // Accelerometer Z readings
      JsonArray& AcZ = root.createNestedArray("AcZ");
      for (int i = 10; i < 30; i ++) {
        AcZ.add(AcZHistory[i]);
      }

      root.prettyPrintTo(Serial);
      // send JSON
    }
  }


  // Serial.print(AcXHistory[201]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[202]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[203]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[204]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[205]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[206]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[207]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[208]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[209]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[210]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[211]);
  // Serial.print('\t');
  // Serial.print(AcXHistory[212]);
  // Serial.print('\t');
  // Serial.print(eventSignificance);
  // Serial.println('\t');

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

  // Find Peak Abruptness
  // Takes the found maxs and mins and calculates the distance
  // between the time they occured
  int abruptnessHalf1;
  int abruptnessHalf2;
  int indexMax;
  int indexMin;

  // calculate peaks in the first half
  for (int i = 0; i < arrayLength/2; i ++) {
    // register max of the first half
    if (maxHalf1 < array[i]) {
      array[arrayLength + 5] = array[i];
      maxHalf1 = array[i];
      // register index
      indexMax = i;
    }

    // register min of the first half
    else if (minHalf1 > array[i]) {
      array[arrayLength + 6] = array[i];
      minHalf1 = array[i];
      // register index
      indexMin = i;
    }
  }

  // find the abruptness of the first half
  // the less it is, the more abrupt
  abruptnessHalf1 = abs(indexMax-indexMin);
  array[arrayLength + 9] = abruptnessHalf1;

  // calculate peaks in the second half
  for (int i = arrayLength/2; i < arrayLength; i ++) {
    // register max of the second half
    if (maxHalf2 < array[i]) {
      array[arrayLength + 7] = array[i];
      maxHalf2 = array[i];
      // register index
      indexMax = i;
    }

    // register min of the second half
    else if (minHalf2 > array[i]) {
      array[arrayLength + 8] = array[i];
      minHalf2 = array[i];
      // register index
      indexMin = i;
    }
  }

  // find the abruptness of the second half
  // the less it is, the more abrupt
  abruptnessHalf2 = abs(indexMax-indexMin);
  array[arrayLength + 10] = abruptnessHalf2;

  // set 1st Half Difference between Max and Min
  array[arrayLength + 11] = maxHalf1 - minHalf1;
  // set 2nd Half Difference between Max and Min
  array[arrayLength + 12] = maxHalf2 - minHalf2;
}

// A True value is returned if an event occured
boolean eventThreshold(int array[]) {
  if (array[209] < 15 && array[211] > 20000) {
    return true;
  } else {
    return false;
  }
}
