<h1>Thermo Star ☀️⛅️☔️⭐️</h1>

<h2>Setup </h2> 
Plant Star is oriented towards creating a simple setup that can get anyone to start monitoring their climate requiring not much knowledge in electronics. The sketch **DOES USE** an external [Adafruit DHT library](https://github.com/adafruit/DHT-sensor-library) that is necessary to install before using it.

The circut for the setup can be found in the the "Schematics" folder. Depending on what kind of TFT screen you have these [instructions (Arduino)](http://arduino.cc/en/Tutorial/TFTDisplayText) or these [instructions (AdaFruit)](https://learn.adafruit.com/1-8-tft-display?view=all) might be helpful.

<h2>Connections </h2> 
- A ST7735 TFT screen connected throught the SPI pins.
- A DHT sensor connected to the A1(15) pin on the Arduino Uno

<h2> Change Log </h2>

<b>PlantStar v1.1 "Beyond Perfection"</b>
- Some functions now return bytes instead of floats, this freed 222 bytes of program memory and 7 bytes of RAM and slightly increased the performance. 💎

<b>PlantStar v1.0 "First Commitment"</b>
- Displays the current air temperature and moisture. ⛅️☔️❄️
- Keeps track of the coldest and hottest temperature readings during
the past 12 and 24 hours. 🕛🕝🕢🕥

