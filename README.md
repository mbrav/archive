# infORM alpha
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


## Technologies used
* [node.js](https://nodejs.org/en/)
* Arduino
* p5.js
* d3.js
* JSON

### Hardware
* MPU-6050 Accelerometer
* Teensy 3.1 (an Arduino Uno might not have enough space)

### Arduino Libraries
* [ArduinoJson](https://github.com/bblanchon/ArduinoJson) - An elegant and efficient JSON library for embedded systems.

* I2C Library
