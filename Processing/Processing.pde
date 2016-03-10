
import processing.serial.*;

Serial myPort;  // Create object from Serial class
int x;
int y;
byte[] inBuffer;
void setup() 
{
  size(600, 400);
  myPort = new Serial(this, "/dev/tty.usbmodem819431", 115200);
}

void draw() 
{
  while (myPort.available() > 0) {
    inBuffer = myPort.readBytes();
    myPort.readBytes(inBuffer);
    if (inBuffer != null) {
      String myString = new String(inBuffer);
      println(myString);
    }
  }
}