<h1>ThermoStar ☀️⛅️☔️⭐️</h1>

<h2>Setup </h2> 
Thermo Star is oriented towards creating a simple setup that can get anyone to start monitoring their climate requiring not much knowledge in electronics. The sketch **DOES USE** an external Adafruit DHT library that is necessary to install in the Arduino IDE.

The circut for the setup can be found in the the ["Schematics"](https://github.com/miXania/ThermoStar/tree/master/Schematics) folder. Depending on what kind of TFT screen you have these [instructions (Arduino)](http://arduino.cc/en/Tutorial/TFTDisplayText) or these [instructions (AdaFruit)](https://learn.adafruit.com/1-8-tft-display?view=all) might be helpful.

<h2>Connections </h2> 
- A ST7735 TFT screen connected throught the SPI pins.
- A DHT sensor connected to the A1(15) pin on the Arduino Uno

![Schematic](https://github.com/mbrav/thermo-star/blob/master/Schematics/SchematicImage.png)

<h2>Dependencies </h2> 
[Adafruit DHT library](https://github.com/adafruit/DHT-sensor-library)

<h2> Change Log </h2>
<b>ThermoStar v1.3 "Second Breath"</b>
- Added a graph as an "EXPERIMENTAL FEATURE" which turns on every other
screenUpdate. Is currently very, very buggy. 🐞🐜🐝

<b>ThermoStar v1.2 "Counting Stars"</b>
- Rearranged the screen by moving the least important stuff to the
bottom. ↕️
- Changed the GUI a bit by placing two rectangles over the edges of the
screen. 💻
- Added an hour counter at the bottom of the screen that shows how long
the program has been running. 🏇
- The 24 hour records don’t display unless 12 hours have passed since
they will be the same anyway. 📊

<b>ThermoStar v1.1 "Beyond Perfection"</b>
- Some functions now return bytes instead of floats, this freed 222 bytes of program memory and 7 bytes of RAM plus slightly increased the performance. 💎

<b>ThermoStar v1.0 "First Commitment"</b>
- Displays the current air temperature and moisture. ⛅️☔️❄️
- Keeps track of the coldest and hottest temperature readings during
the past 12 and 24 hours. 🕛🕝🕢🕥
