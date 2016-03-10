// Created by Michael Braverman
// 9 March 2016

import processing.serial.*;

Serial myPort;  
byte[] inBuffer;
int[] readings = new int[3];
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
      String[] token = splitTokens(myString, ",");
      readings[0] = int(token[0]);
      readings[1] = int(token[1]);
      readings[2] = int(token[2]);
      println(readings[0]);
      println(readings[1]);
      println(readings[2]);
    }
  }
}