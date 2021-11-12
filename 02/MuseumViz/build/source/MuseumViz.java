import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import processing.sound.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class MuseumViz extends PApplet {




//audio
SinOsc[] sineWaves; // Array of sines
int numSines = 6; // Number of oscillators to use
float[] sineFreq; // Array of frequencies

Table table;
int tableLength;

//data
PVector[] gyro, acc, heading;

int playbackSpeed = 50;
int count;

public void setup() {
  frameRate(60);
  
  

  //audio
  sineWaves = new SinOsc[numSines]; // Initialize the oscillators
  sineFreq = new float[numSines]; // Initialize array for Frequencies

  for (int i = 0; i < numSines; i++) {
    float sineVolume = (1.0f / numSines) / (i + 1);
    sineWaves[i] = new SinOsc(this);
    sineWaves[i].play();
    sineWaves[i].amp(sineVolume);
  }

  table = loadTable("data/test.csv", "header");
  tableLength = table.getRowCount();
  println(tableLength + " total rows in table");

  // setup vectors
  gyro = new PVector[tableLength];
  acc = new PVector[tableLength];
  heading = new PVector[tableLength];

  for(int i = 0; i < tableLength; i++) {

    TableRow row = table.getRow(i);

    gyro[i] = new PVector(
      row.getFloat("gyroRotationX"),
      row.getFloat("gyroRotationY"),
      row.getFloat("gyroRotationZ"));
    acc[i] = new PVector(
      row.getFloat("accelerometerAccelerationX"),
      row.getFloat("accelerometerAccelerationY"),
      row.getFloat("accelerometerAccelerationZ"));
    heading[i] = new PVector(
      row.getFloat("locationHeadingX"),
      row.getFloat("locationHeadingY"),
      row.getFloat("locationHeadingZ"));

    // println(gyro[i], acc[i], heading[i]);
  }

}

public void draw() {
  background(252,240,230); // light light brown

  drawGraph();
  updateSound(400);

  count = (count + playbackSpeed) % tableLength;
}

public void drawGraph() {
  for(int i = 0; i < tableLength; i++) {
    float incriment = width/PApplet.parseFloat(tableLength);
    fill(0,40);

    if ( i < count) {
      stroke(100,255);
    } else {
      stroke(0,40);
    }
    // noStroke();

    // circles
    // ellipse(incriment*i, 50, abs(acc[i].x)*3,abs(acc[i].x)*3);
    // ellipse(incriment*i, 100, abs(acc[i].y)*3,abs(acc[i].y)*3);
    // ellipse(incriment*i, 150, abs(acc[i].z)*3,abs(acc[i].z)*3);
    // ellipse(incriment*i, 200, abs(gyro[i].x)*3,abs(gyro[i].x)*3);
    // ellipse(incriment*i, 250, abs(gyro[i].y)*3,abs(gyro[i].y)*3);
    // ellipse(incriment*i, 300, abs(gyro[i].z)*3,abs(gyro[i].z)*3);

    // lines
    strokeWeight(1);
    line(incriment*i, 50 - acc[i].x*10,incriment*i, 50 + acc[i].x*10);
    line(incriment*i, 100 - acc[i].y*10,incriment*i, 100 + acc[i].y*10);
    line(incriment*i, 150 - acc[i].z*10,incriment*i, 150 + acc[i].z*10);
    line(incriment*i, 200 - gyro[i].x*10,incriment*i, 200  + gyro[i].x*10);
    line(incriment*i, 250 - gyro[i].y*10,incriment*i, 250 + gyro[i].y*10);
    line(incriment*i, 300 - gyro[i].z*10,incriment*i, 300 + gyro[i].z*10);
  }
}

public void updateSound(int detune){
  sineFreq[0] = 500;
  sineWaves[0].freq(sineFreq[0] + (detune * acc[count].x));
  sineFreq[1] = 300;
  sineWaves[1].freq(sineFreq[1] + (detune * acc[count].y));
  sineFreq[2] = 100;
  sineWaves[2].freq(sineFreq[2] + (detune * acc[count].z));
  sineFreq[3] = 1000;
  sineWaves[3].freq(sineFreq[3] + (detune * gyro[count].x));
  sineFreq[4] = 2000;
  sineWaves[4].freq(sineFreq[4] + (detune * gyro[count].y));
  sineFreq[5] = 1400;
  sineWaves[5].freq(sineFreq[5] + (detune * gyro[count].z));
}
  public void settings() {  size(800,350);  pixelDensity(2); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MuseumViz" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
