  // Lines #5
// by Michael Braverman
// July 6th, 2016

int loop = 0;

PVector pos;

float size;

import gifAnimation.*;
GifMaker gifExport;

void setup() {
  gifExport = new GifMaker(this, "export.gif");
  gifExport.setRepeat(0);
  gifExport.setQuality(2);
  // pixelDensity(1);
  frameRate(60);
  size(400, 400, P2D);
  // background(42,51,54);
  //smooth(8);
  noFill();

  rectMode(CENTER);

  pos = new PVector(random(0, width), random(0, height));


}

void draw () {
  //background(42,51,54);
  //fill(42,51,54,100);
  //rect(0,0,width,height);
  stroke(247,248,251);

  //rect(width/2 - cos(loop/5.0)*(loop), height/2 - sin(loop/5.0)*(loop), 10 , 10);



  if (loop%60 == 0) {
    pos.x = random(0, width);
    pos.y = random(0, height);

    size = random(1, 10);
  }

  stroke(247,248,251);
  rect(pos.x + sin(loop/5.)*3+loop%60, pos.y + cos(loop/5.)*3+loop%60,  size,  size);
  stroke(42,51,54);
  rect(pos.x + sin(loop/5.)*3-loop%60, pos.y + cos(loop/5.)*3+loop%60,  size,  size);


  //fill(cos(loop)*255,sin(loop+2.)*255,sin(loop+3.)*255,255);

  int frames = 60; // total output frames
  int skips = 10; // skip frames
  int startLoop = 600; // set to 0 to start from beginning
  if (loop == startLoop + frames * skips) {
    gifExport.finish();
    println("GIF saved");
  } else if (loop < frames * skips + startLoop && loop%skips == 0 && loop > startLoop) {
    println("frame: " + loop/skips + ", loop:" + loop);
    gifExport.setDelay(1);
    gifExport.addFrame();
  }

  loop++;


}
