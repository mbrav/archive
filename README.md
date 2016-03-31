# infORM alpha2
A Physical Computing and Object Relational Mapping tool

## Instructions

add your serial port in *script.js* on the following line:
```
// connect to Serial
serial.open("/dev/cu.usbmodem819431");
```

if you know what you are doing then do...
```
node node/startserver.js
```

if the server does not start, npm dependencies must be install first


## Technologies used
* Software
  * A node.js server
  * p5.js JavaScript library
  * d3.js JavaScript library
  * JSON
* Hardware
  * Teensy 3.1 running at 120 MHz (an Arduino Uno might not have enough space or power)
  * MPU-6050 Accelerometer
  * HMC5883 Magnetometer
* Arduino Libraries
  * I2C Library
  * [ArduinoJson](https://github.com/bblanchon/ArduinoJson) - An elegant and efficient JSON library for embedded systems.
  * Adafruit's [Sensor Library](https://github.com/adafruit/Adafruit_Sensor)
  * Adafruit's [HMC5883L Library](https://github.com/adafruit/Adafruit_HMC5883_Unified)

## Changes
**alpha2** - March 31, 2016
* Implemented MPU-6050's temperature readings
* Added the HMC5883 magnetometer to the project
* Added magnetometer reads
* Added different event triggers for each of the type of readings
* Improved the calculation of *event significance* thanks to the added sensors

**alpha** - March 28, 2016
* First release
