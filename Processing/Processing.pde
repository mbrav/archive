// Created by Michael Braverman
// 9 March 2016

import processing.serial.*;

// SERIAL 
Serial myPort;  
byte[] inBuffer;
int[] readings = new int[3];


// DOPE CUBE STUFF
float pos;
float posX;
float posY;
float posZ;
float size;
int r = 255, g = 0, b = 0;
boolean buttonStatePrev = false;

int count;

Button button1 = new Button(10, 10, 20, 20);
Button button2 = new Button(40, 10, 20, 20);
Button button3 = new Button(70, 10, 20, 20);
Button button4 = new Button(100, 10, 20, 20);
Button button5 = new Button(130, 10, 20, 20);
Button button6 = new Button(160, 10, 20, 20);
Button buttonFX1 = new Button(10, 40, 15, 15);

Button [] buttons = {button1, button2, button3, button4, button5, button6};

void setup() {
  size(750, 750, P3D);
  button1.buttonOnColor(240, 120, 0);
  button2.buttonOnColor(255, 255, 0);
  button3.buttonOnColor(0, 255, 0);
  button4.buttonOnColor(0, 255, 255);
  button5.buttonOnColor(30, 30, 200);
  button6.buttonOnColor(255, 255, 255);
  
  // initialize serial 
  myPort = new Serial(this, "/dev/tty.usbmodem819431", 115200);
}

void draw() {
  
  // SERIAL FUNCTIONALITY  
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
  
  // DRAW FUNCTIONALITY 
  background(0);
  lights();
  noStroke();

  if (mousePressed){
    // if pressed functionality
  }
  
  posX = map(readings[0], -15000, 15000, -1.0,1.0);
  posY = map(readings[1], -15000, 15000, -1.0,1.0);
  posZ = map(readings[2], -15000, 15000, -1.0,1.0);
  

  setCubeColor(r, g, b);

  // push matrix that effects only the 3D cube
  pushMatrix();
  translate(380, 380);
  rotateX(posX);
  rotateY(posY);
  rotateZ(posZ);
  box(200);
  translate(-250, -250);

  dopeCubeText(120, 110);
  dopeCubeText(120, 500);

  // pop the matrix
  popMatrix();

  for (Button button : buttons) {
    button.drawButton();
  }
}

void mouseReleased() {
 for (Button button : buttons) {
   if (button.checkButtonState()) {
      r = button.red;
     g = button.green;
    b = button.blue; 
   }
 }
}

void dopeCubeText(int x, int y) {
  fill(0,191,255);
  textSize(48);
  if (count < 10) {
    text("D    C   ", x, y);
  } else if (count < 20) {
    text(" O    U  ", x, y);
  } else if (count < 30) {
    text("  P    B ", x, y);
  } else if (count < 40) {
    text("   E    E", x, y);
  } else if (count < 50) {
    text("DOPE CUBE", x, y);
  } else if (count < 80) {
    ;
  } else if (count < 100) {
    text("DOPE CUBE", x, y);
  } else if (count < 120) {
    ;
  } else if (count < 179) {
    text("DOPE CUBE", x, y);
  } else if (count > 180) {
    count = 0;
  }
  count ++;
}

// checks the states of the buttons and assigns an according color
void setCubeColor(int r, int g, int b) {
  fill(r, g, b);
}

class Button {
  boolean state;
  float xPosition;
  float yPosition;
  float width;
  float height;
  int red, green, blue;
  

  Button(float xPos, float yPos, float w, float h) {
    xPosition = xPos;
    yPosition = yPos;
    width = w;
    height = h;
  }

  // check if the mouse is over the button
  boolean checkButtonState() {
    if(mouseX < width + xPosition && mouseX > xPosition && mouseY < yPosition + height && mouseY > yPosition) {
      return true;
    }
    return false;
  }

  // render the button
  void drawButton() {
    fill(red, green, blue);
    rect(xPosition, yPosition, width, height);
  }

  // sets the color of the button when its on
  void buttonOnColor(int r, int g, int b) {
    red = r;
    green = g;
    blue = b;
  }
}