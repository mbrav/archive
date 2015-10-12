// Sound Space
// by Michael Braverman
// Created October 14th 2015

import processing.sound.*;

// Declare the processing sound variables
SoundFile sample;
SoundFile lead;
SoundFile drums;
SoundFile brake;

Amplitude rms1;
Amplitude rms2;
Amplitude rms3;
Amplitude rms4;

// Declare a scaling factor
float scale=5;

// Declare a smooth factor
float smooth_factor=0.25;

// Used for smoothing
float sum1;
float sum2;
float sum3;
float sum4;

public void setup() {
    size(640,360);

    sample = new SoundFile(this, "sample.mp3");
    sample.loop();

    lead = new SoundFile(this, "lead.mp3");
    lead.loop();

    drums = new SoundFile(this, "drums.mp3");
    drums.loop();

    brake = new SoundFile(this, "brake.mp3");
    brake.loop();

    // Create and patch the rms tracker
    rms1 = new Amplitude(this);
    rms1.input(sample);

    rms2 = new Amplitude(this);
    rms2.input(lead);

    rms3 = new Amplitude(this);
    rms3.input(drums);

    rms4 = new Amplitude(this);
    rms4.input(brake);
}

public void draw() {
    // Set background color, noStroke and fill color
    background(125,255,125);
    noStroke();
    fill(255,0,150);

    // smooth the rms data by smoothing factor
    sum1 += (rms1.analyze() - sum1) * smooth_factor;
    sum2 += (rms2.analyze() - sum2) * smooth_factor;
    sum3 += (rms3.analyze() - sum3) * smooth_factor;
    sum4 += (rms4.analyze() - sum4) * smooth_factor;

    // rms.analyze() return a value between 0 and 1. It's
    // scaled to height/2 and then multiplied by a scale factor
    float rms1_scaled = sum1 * (height/2) * scale;
    float rms2_scaled = sum2 * (height/2) * scale;
    float rms3_scaled = sum3 * (height/2) * scale;
    float rms4_scaled = sum4 * (height/2) * scale;

    // We draw an ellispe coupled to the audio analysis
    ellipse(width/2, height/2, rms1_scaled, rms1_scaled);
    ellipse(100, 100, rms2_scaled, rms2_scaled);
    ellipse(200, 200, rms3_scaled, rms3_scaled);
    ellipse(300, 300, rms4_scaled, rms4_scaled);
    println(rms1_scaled);
}
