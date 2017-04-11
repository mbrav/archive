// Created by: Michael Braverman
// April 1, 2017

//declraing an array of images
ImageBox[] boxImages;
int maxImages = 100; //total images
int imageIndex = 0; //initial image to be displayed is the first
float imgSize = 40;
float varX, pressX, varY, pressY = 0;

int loop;
int sortLoop; // loop for doing sorting stuff
int frameSkip = 10;

// gif library: https://github.com/01010101/GifAnimation
import gifAnimation.*;
GifMaker gifExport;

void setup() {
  gifExport = new GifMaker(this, "export.gif");
  gifExport.setRepeat(0);
  gifExport.setQuality(2);

  size(600, 600, P3D);

  // pixelDensity(2);

  boxImages = new ImageBox[maxImages];

  float imgSize = 40;
  for (int i = 0; i < maxImages; i++) {
    boxImages[i] = new ImageBox(((i*imgSize)%width)+imgSize/2, (int((i*imgSize)/width)+0.5) * imgSize, imgSize/2, "img" + i + ".jpg");
  }

  frameRate(60);
}

void draw() {

  background(0);

  // 3D transform
  pushMatrix();
  rotateX(varX/100.0);
  rotateY(varY/100.0);
  // rotateY(PI/6.0);
  for (int i = 0; i < maxImages; i++) {
    boxImages[i].update();
    float rhytm = map(pow(abs(exp(sin(mouseX/6. * 0.03 - i * 0.01))), 50), 0, 1, -500, 500);
    // boxImages[i].setPos(boxImages[i].pos.x, boxImages[i].pos.y, rhytm );
  }
  popMatrix();

  if (sortLoop < maxImages) {
    for (int i = sortLoop; i < boxImages.length; i++) {
      // box swap
      int swap1 = i;
      int swap2 = sortLoop;

      if (boxImages[swap1].avgColor.x < boxImages[swap2].avgColor.x ) {
        // swap class
        boxImages[swap1].boxSwap(boxImages[swap2]);
        // swap in array boxImages[] array
        ImageBox temp = boxImages[swap1];
        boxImages[swap1] = boxImages[swap2];
        boxImages[swap2] = temp;
      }
    }
  }

  // rotation interaction
  if (mousePressed) {
    varX = pressX-mouseX;
    varY = pressY-mouseY;
  }

  // apply sorting every other frameSkip frame
  if (loop % frameSkip == 0) {
    sortLoop ++;
  }

  // GIF
  captureGifFrame(60, 5, 600);

  // count as a loop
  loop++;
}

// frames - total output frames
// skips - skip frames
// startLoop - from what loop to start
void captureGifFrame(int frames, int skips, int startLoop) {
  if (loop == startLoop + frames * skips) {
    gifExport.finish();
    println("GIF saved");
  } else if (loop < frames * skips + startLoop && loop%skips == 0 && loop > startLoop) {
    println("frame: " + loop/skips + ", loop:" + loop);
    gifExport.setDelay(1);
    gifExport.addFrame();
  }
}

void mousePressed()
{
  pressX = mouseX;
  pressY = mouseY;
}
