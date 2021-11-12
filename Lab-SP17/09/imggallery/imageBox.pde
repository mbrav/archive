// Created by: Michael Braverman
// April 1, 2017

class ImageBox {
  PImage img;

  float imgSize;
  PVector initPos;
  PVector pos;
  PVector posDisplace;
  PVector rotDisplace;
  PVector avgColor;

  ImageBox(float posX, float posY, float iSize, String imgPath) {
    // to keep track of where it was positioned initially
    initPos = new PVector(posX, posY, 0);
    pos = initPos;
    posDisplace = new PVector(0,0,0);
    rotDisplace = new PVector(0,0,0);

    // img
    imgSize = iSize;
    img = loadImage(imgPath);

    // calculate average color of image
    avgColor = extractColorFromImage(img);
  }

  // a function that swaps the postions of two ImageBoxes
  void boxSwap(ImageBox swapBox) {
    PVector temPos = swapBox.pos;
    posDisplace.set(swapBox.pos.x, swapBox.pos.y, 100);
    rotDisplace.set(random(0, PI/2), random(0, PI/2), random(0, PI/2));
    swapBox.pos = pos;
    pos = temPos;
  }

  // set postion of box
  void setPos(float newX, float newY, float newZ) {
    pos.set(newX, newY, newZ);
  }

  void update() {
    rotateX(rotDisplace.x);
    rotateY(rotDisplace.y);
    rotateZ(rotDisplace.z);

    // simple image
    // image(img, pos.x + posDisplace.x, pos.y + posDisplace.y, pos.z + posDisplace.z, imgSize);

    // vertex image
    beginShape();
    texture(img);
    float minus = (abs(posDisplace.x) + abs(posDisplace.y))/2;
    tint(255, 255 - minus, 255 - minus, 255); // fade tint based on distance
    vertex(pos.x - imgSize + posDisplace.x, pos.y - imgSize + posDisplace.y, pos.z + posDisplace.z, 0, 0);
    vertex(pos.x + imgSize + posDisplace.x, pos.y - imgSize + posDisplace.y, pos.z + posDisplace.z, 200, 0);
    vertex(pos.x + imgSize + posDisplace.x, pos.y + imgSize + posDisplace.y, pos.z + posDisplace.z, 200, 200);
    vertex(pos.x - imgSize + posDisplace.x, pos.y + imgSize + posDisplace.y, pos.z + posDisplace.z, 0, 200);
    endShape();

    // dampen displacement
    posDisplace.mult(0.95);
    rotDisplace.mult(0.95);
  }
}

// avg color of image
// from: http://stackoverflow.com/questions/34723998/getting-the-dominant-color-in-processing
PVector extractColorFromImage(PImage img) {
  img.loadPixels();
  int r = 0, g = 0, b = 0;
  for (int i=0; i<img.pixels.length; i++) {
    color c = img.pixels[i];
    r += c>>16&0xFF;
    g += c>>8&0xFF;
    b += c&0xFF;
  }
  r /= img.pixels.length;
  g /= img.pixels.length;
  b /= img.pixels.length;

  return new PVector(r,g,b);
}
