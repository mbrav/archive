// infORM alpha
// Created by Michael Braverman
// 9 March 2016

// JSON parding library
#include <ArduinoJson.h>

// MPU-6050 and HMC5883 sensor setup
#include<Wire.h>
const int address=0x68;  // I2C address of the MPU-6050

// necessary forthe HMC5883 sesor
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>

// Assign a unique ID to this sensor at the same time
Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);

// From the MPU-6050:
// Ac - accelerometer readings
// Gy - gyroscope readings
// Tmp - temperature readings

// From the HMC5883:
// Mg - magnetometer readings
int16_t AcX,AcY,AcZ,GyX,GyY,GyZ,MgX,MgY,MgZ,Tmp;

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
int MgXHistory[212+1];
int MgYHistory[212+1];
int MgZHistory[212+1];
// EVENTS
// eventThreshold() values
// also used in other parts of the code
int minimumAbruptness = 15;
int minimumDiff = 20000;

// value that stores the "significance" of the event
float eventSignificance;
float eventSignificanceThreshold = 4.5;

// TIMERS
// read values 40 times per second
unsigned long timerMillis1;
int refreshInterval1 = 10; // in ms

// do statistics 1000/x times per second
unsigned long timerMillis2;
int refreshInterval2 = 60; // in ms

// counts the number of readings the program made
unsigned long readingCount;
// keeps track of when the last triggered readings/event was made
unsigned long lastTriggeredEvent;
// number of indexes they must be appart
int minimumEventProximity = 30;

// keeps track of program's loop performace
unsigned int FPS;

void setup() {
  Wire.begin();
  Wire.beginTransmission(address);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(115200);

  if(!mag.begin()) {
    // if here was a problem detecting the HMC5883 ... check your connections
    Serial.println("Ooops, no HMC5883 detected ... Check your wiring!");
    while(1);
  }
}

void loop() {

  // sensor refresh timmer
  if ((millis() - timerMillis1) > refreshInterval1) {
    // record the time of when this action occured
    timerMillis1 = millis();
    // update sensors
    updateSensorValues();

    // readings have to get old eventually...
    shiftArray(AcXHistory);
    shiftArray(AcYHistory);
    shiftArray(AcZHistory);
    shiftArray(MgXHistory);
    shiftArray(MgYHistory);
    shiftArray(MgZHistory);

    // register newborn readings
    AcXHistory[0] = AcX;
    AcYHistory[0] = AcY;
    AcZHistory[0] = AcZ;
    MgXHistory[0] = MgX;
    MgYHistory[0] = MgY;
    MgZHistory[0] = MgZ;

    // keep track of the number of readings
    readingCount ++;
  }

  // statisitics calculation timer
  if ((millis() - timerMillis2) > refreshInterval2) {
    // record the time of when this action occured
    timerMillis2 = millis();

    // calculate Accelerometer readings statistics
    calculateMedian(AcXHistory);
    calculateMedian(AcYHistory);
    calculateMedian(AcZHistory);
    findPeak(AcXHistory);
    findPeak(AcYHistory);
    findPeak(AcZHistory);

    // calculate Magnetometer readings statistics
    calculateMedian(MgXHistory);
    calculateMedian(MgYHistory);
    calculateMedian(MgZHistory);
    findPeak(MgXHistory);
    findPeak(MgYHistory);
    findPeak(MgZHistory);

    // reset event significance
    eventSignificance = 1.0;
    // counts the number of readings that passed eventThreshold()
    int readingstriggered = 0;

    // add up event significance based on Accelerometer readings
    if (eventThreshold(AcXHistory)) {
      eventSignificance *= 2.0;
      eventSignificance *= map(constrain(AcXHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.8, 1.2);
      eventSignificance *= map(constrain(AcXHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.5, 1.2);
      readingstriggered ++;
    }

    if (eventThreshold(AcYHistory)) {
      eventSignificance *= 1.8;
      eventSignificance *= map(constrain(AcYHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.8, 1.2);
      eventSignificance *= map(constrain(AcYHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.5, 1.2);
      readingstriggered ++;
    }

    if (eventThreshold(AcZHistory)) {
      eventSignificance *= 1.7;
      eventSignificance *= map(constrain(AcZHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.8, 1.2);
      eventSignificance *= map(constrain(AcZHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.5, 1.2);
      readingstriggered ++;
    }

    // add up event significance based on Magnetomete readings
    if (eventThreshold(MgXHistory)) {
      eventSignificance *= 1.8;
      eventSignificance *= map(constrain(MgXHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.6, 1.1);
      eventSignificance *= map(constrain(MgXHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.3, 1.1);
      readingstriggered ++;
    }

    if (eventThreshold(MgYHistory)) {
      eventSignificance *= 1.7;
      eventSignificance *= map(constrain(MgYHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.6, 1.1);
      eventSignificance *= map(constrain(MgYHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.3, 1.1);
      readingstriggered ++;
    }

    if (eventThreshold(MgZHistory)) {
      eventSignificance *= 1.5;
      eventSignificance *= map(constrain(MgZHistory[209], 0, minimumAbruptness), 0, minimumAbruptness, 1.6, 1.1);
      eventSignificance *= map(constrain(MgZHistory[211], minimumDiff, minimumDiff*2), 0, minimumDiff, 1.3, 1.1);
      readingstriggered ++;
    }

    // increase as more readings are triggered
    eventSignificance *= map(readingstriggered, 0, 6, 0, 12);

    // check if the event is significant enought
    if (eventSignificance > eventSignificanceThreshold) {

      // don't overwhelm the serial port with to much JSON events
      // minimumEventProximity is a basic limitation technique
      if (readingCount - lastTriggeredEvent > minimumEventProximity) {
        lastTriggeredEvent= readingCount;
        // send the JSON of the event vis Serial
        sendJSON();
      }
    }
  }

  // monitopr program performace every 2 seconds
  fps(2);
}

// Update sensor readings
void updateSensorValues() {
  // read MPU-6050
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

  // read HMC5883
  sensors_event_t event;
  mag.getEvent(&event);
  MgX = event.magnetic.x;
  MgY = event.magnetic.y;
  MgZ = event.magnetic.z;
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

  // calculate peaks in the second** half
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

  // abruptness < 15 & Diff between max an min > 20000
  if (array[209] < minimumAbruptness && array[211] > minimumDiff) {
    return true;
  } else {
    return false;
  }
}

void sendJSON() {
  // Memory pool for JSON object tree.
  StaticJsonBuffer<2000> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  // Event Significance
  root["eventSignificance"] = eventSignificance;
  // program performace
  root["fps"] = FPS;
  // time since the sketch started running
  root["millis"] = millis();

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

  // Magnetometer X reading statistics
  JsonArray& MgXstats = root.createNestedArray("MgXstats");
  MgXstats.add(MgXHistory[arrayLength + 1]);
  MgXstats.add(MgXHistory[arrayLength + 2]);
  MgXstats.add(MgXHistory[arrayLength + 3]);
  MgXstats.add(MgXHistory[arrayLength + 4]);
  MgXstats.add(MgXHistory[arrayLength + 5]);
  MgXstats.add(MgXHistory[arrayLength + 6]);
  MgXstats.add(MgXHistory[arrayLength + 7]);
  MgXstats.add(MgXHistory[arrayLength + 8]);
  MgXstats.add(MgXHistory[arrayLength + 9]);
  MgXstats.add(MgXHistory[arrayLength + 10]);
  MgXstats.add(MgXHistory[arrayLength + 11]);
  MgXstats.add(MgXHistory[arrayLength + 12]);

  // Magnetometer Y reading statistics
  JsonArray& MgYstats = root.createNestedArray("MgYstats");
  MgYstats.add(MgYHistory[arrayLength + 1]);
  MgYstats.add(MgYHistory[arrayLength + 2]);
  MgYstats.add(MgYHistory[arrayLength + 3]);
  MgYstats.add(MgYHistory[arrayLength + 4]);
  MgYstats.add(MgYHistory[arrayLength + 5]);
  MgYstats.add(MgYHistory[arrayLength + 6]);
  MgYstats.add(MgYHistory[arrayLength + 7]);
  MgYstats.add(MgYHistory[arrayLength + 8]);
  MgYstats.add(MgYHistory[arrayLength + 9]);
  MgYstats.add(MgYHistory[arrayLength + 10]);
  MgYstats.add(MgYHistory[arrayLength + 11]);
  MgYstats.add(MgYHistory[arrayLength + 12]);

  // Magnetometer Z reading statistics
  JsonArray& MgZstats = root.createNestedArray("MgZstats");
  MgZstats.add(MgZHistory[arrayLength + 1]);
  MgZstats.add(MgZHistory[arrayLength + 2]);
  MgZstats.add(MgZHistory[arrayLength + 3]);
  MgZstats.add(MgZHistory[arrayLength + 4]);
  MgZstats.add(MgZHistory[arrayLength + 5]);
  MgZstats.add(MgZHistory[arrayLength + 6]);
  MgZstats.add(MgZHistory[arrayLength + 7]);
  MgZstats.add(MgZHistory[arrayLength + 8]);
  MgZstats.add(MgZHistory[arrayLength + 9]);
  MgZstats.add(MgZHistory[arrayLength + 10]);
  MgZstats.add(MgZHistory[arrayLength + 11]);
  MgZstats.add(MgZHistory[arrayLength + 12]);

  // SEND RAW READING (unecessary while commented out)

  // // Magnetometer X RAW readings
  // JsonArray& AcX = root.createNestedArray("AcX");
  // for (int i = 0; i < arrayLenght; i ++) {
  //   AcX.add(AcXHistory[i]);
  // }
  //
  // // Magnetometer Y RAW readings
  // JsonArray& AcY = root.createNestedArray("AcY");
  // for (int i = 0; i < arrayLenght; i ++) {
  //   AcY.add(AcYHistory[i]);
  // }
  //
  // // Magnetometer Z RAW readings
  // JsonArray& AcZ = root.createNestedArray("AcZ");
  // for (int i = 0; i < arrayLenght; i ++) {
  //   AcZ.add(AcZHistory[i]);
  // }

  // send JSON
  root.printTo(Serial);
  Serial.print("\r\n");
}

static inline void fps(const int seconds){
  // Create static variables so that the code and variables can
  // all be declared inside a function
  static unsigned long lastMillis;
  static unsigned long frameCount;
  static unsigned int framesPerSecond;

  // It is best if we declare millis() only once
  unsigned long now = millis();
  frameCount ++;
  if (now - lastMillis >= seconds * 1000) {
    framesPerSecond = frameCount / seconds;
    frameCount = 0;
    lastMillis = now;
    FPS = framesPerSecond;
  }
}
