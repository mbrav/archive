
//declraing an array of images
ImageBox[] boxImages;
int maxImages = 100; //total images
int imageIndex = 0; //initial image to be displayed is the first
float imgSize = 40;

int loop;

import gifAnimation.*;
GifMaker gifExport;

void setup() {
  gifExport = new GifMaker(this, "export.gif");
  gifExport.setRepeat(0);
  gifExport.setQuality(2);

  size(600, 600, P3D);

  pixelDensity(2);

  boxImages = new ImageBox[maxImages];
  for (int i = 0; i < maxImages; i++) {
    boxImages[i] = new ImageBox(i * imgSize, imgSize * int(((i * imgSize)/width)), imgSize, "img" + i + ".jpg");
  }

  frameRate(30);
}

void draw() {

  background(0);

  for (int i = 0; i < maxImages; i++) {
    boxImages[i].update();
  }

  // int frames = 60; // total output frames
  // int skips = 2; // skip frames
  // int startLoop = 0; // set to 0 to start from beginning
  // if (loop == startLoop + frames * skips) {
  //   gifExport.finish();
  //   println("GIF saved");
  // } else if (loop < frames * skips + startLoop && loop%skips == 0 && loop > startLoop) {
  //   println("frame: " + loop/skips + ", loop:" + loop);
  //   gifExport.setDelay(1);
  //   gifExport.addFrame();
  // }

  loop++;
}
