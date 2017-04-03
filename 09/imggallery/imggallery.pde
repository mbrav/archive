

//declraing an array of images
// PImage[] images = new PImage[maxImages];
ImageBox[] boxImages;
int maxImages = 100; //total images
int imageIndex = 0; //initial image to be displayed is the first

int loop;

import gifAnimation.*;
GifMaker gifExport;

void setup() {
  gifExport = new GifMaker(this, "export.gif");
  gifExport.setRepeat(0);
  gifExport.setQuality(2);

  size(200, 200, P3D);

  pixelDensity(1);

  // for (int i = 0; i < images.length; i ++ ) {
  //
  //   images[i] = loadImage( "img" + i + ".jpg" );
  // }
  boxImages = new ImageBox[maxImages];
  for (int i = 0; i < maxImages; i++) {
    boxImages[i] = new ImageBox(40, "img" + i + ".jpg");
  }

  frameRate(10);
}

void draw() {

  background(0);

  // for (int i = 0; i < maxImages; i++) {
    boxImages[int(random(0, maxImages))].update();
  // }

  // for (int i = 0; i < maxImages; i ++ ) {
  //   for (int j = 0; j < maxImages; j ++ ) {
  //     image(images[(imageIndex + loop + j) % maxImages], 10*i, 10*j, 10, 10);
  //
  //     imageIndex = (imageIndex + 1) % images.length;
  //   }
  // }

  // background(0);
  // translate(random(1, width), random(1, height));
  // for (int j = 0; j < maxImages; j ++ ) {
  //   int h = 30;
  //   beginShape();
  //   texture(images[j]);
  //   vertex(-100, -100, 0, 0, 0);
  //   vertex( 100, -100, 0, 400, 0);
  //   vertex( 100, 100, 0, 400, 400);
  //   vertex(-100, 100, 0, 0, 400);
  //   endShape();
  // }

  // int frames = 30;
  // if (loop == frames) {
  //   gifExport.finish();
  //   println("gif saved");
  // } else if (loop < frames) {
  //   gifExport.setDelay(1);
  //   gifExport.addFrame();
  // }

  loop++;
}
