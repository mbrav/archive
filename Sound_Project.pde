// Sound Space
// by Michael Braverman
// Created October 14th 2015

import processing.sound.*;

// Declare the processing sound variables
SoundFile sample;

Amplitude rms1;

// Declare a scaling factor
float scale=5;

// Declare a smooth factor
float smooth_factor=0.25;

// Used for smoothing
float sum1;

int num = 500;
float range = 6;

float[] ax = new float[num];
float[] ay = new float[num];

public void setup() {
    size(640,360);

    for(int i = 0; i < num; i++) {
      ax[i] = width/2;
      ay[i] = height/2;
    }

    sample = new SoundFile(this, "sample.mp3");
    sample.loop();

    // Create and patch the rms tracker
    rms1 = new Amplitude(this);
    rms1.input(sample);

}

public void draw() {
    // Set background color, noStroke and fill color
    background(78,132,222);
    noStroke();
    fill(255,0,150);

    // smooth the rms data by smoothing factor
    sum1 += (rms1.analyze() - sum1) * smooth_factor;

    // rms.analyze() return a value between 0 and 1. It's
    // scaled to height/2 and then multiplied by a scale factor
    float rms1_scaled = sum1 * (height/2) * scale;
    float add = map(rms1_scaled, 80, 200, 0, 10);

    ellipse(width/2, height/2, rms1_scaled, rms1_scaled);
    println(rms1_scaled);

    // Shift all elements 1 place to the left
    for(int i = 1; i < num; i++) {
      ax[i-1] = ax[i];
      ay[i-1] = ay[i];
    }

    // Put a new value at the end of the array
    ax[num-1] += random(-range - add, range + add);
    ay[num-1] += random(-range - add, range + add);

    // Constrain all points to the screen
    ax[num-1] = constrain(ax[num-1], 0, width);
    ay[num-1] = constrain(ay[num-1], 0, height);

    // Draw a line connecting the points
    for(int i=1; i<num; i++) {
      float val = float(i)/num * 204.0 + 51;
      stroke(val);
      line(ax[i-1], ay[i-1], ax[i], ay[i]);
    }
}
