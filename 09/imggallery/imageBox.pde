class ImageBox {
  PImage img;

  float imgSize;
  PVector initPos;
  PVector pos;
  PVector posDisplace;
  PVector rotDisplace;
  PVector speed;
  PVector avgColor;

  ImageBox(float posX, float posY, float iSize, String imgPath) {
    initPos = new PVector(posX, posY, 10);
    pos = initPos;
    speed = new PVector(random(1.0, 5.0), random(1.0, 5.0), 0);
    posDisplace = new PVector(0,0,0);
    rotDisplace = new PVector(0,0,0);

    // img
    imgSize = iSize;
    img = loadImage(imgPath);

    // calculate average color of image
    avgColor = extractColorFromImage(img);
  }

  void imgSwap(PImage swapImage) {
    img = swapImage;
    posDisplace.set(0, 0, random(0, 100));
    posDisplace.set(random(0, 100), random(0, 100), random(0, 100));
  }

  void setPos(float newX, float newY, float newZ) {
    pos.set(newX, newY, newZ);
  }

  void update() {
    // simple image
    // image(img, pos.x, pos.y, 30, 30);

    // vertex image
    // translate(pos.x, pos.y);
    rotateX(rotDisplace.x);
    rotateY(rotDisplace.y);
    rotateZ(rotDisplace.z);
    beginShape();
    texture(img);
    vertex(pos.x - imgSize + posDisplace.x, pos.y - imgSize + posDisplace.y, pos.z + posDisplace.z, 0, 0);
    vertex(pos.x + imgSize + posDisplace.x, pos.y - imgSize + posDisplace.y, pos.z + posDisplace.z, 200, 0);
    vertex(pos.x + imgSize + posDisplace.x, pos.y + imgSize + posDisplace.y, pos.z + posDisplace.z, 200, 200);
    vertex(pos.x - imgSize + posDisplace.x, pos.y + imgSize + posDisplace.y, pos.z + posDisplace.z, 0, 200);
    endShape();

    // dampen displacement
    posDisplace.mult(0.8);
    rotDisplace.mult(0.8);

    // pos.x += speed.x;
    // pos.y += speed.y;
    // pos.z += speed.z;

    if (pos.x >= width || pos.x <= 0) {
      pos.x += -speed.x;
      speed.x = -speed.x;
    }
    if (pos.y >= height || pos.y <= 0) {
      pos.y += -speed.y;
      speed.y = -speed.y;
    }
    if (pos.z >= imgSize|| pos.y <= 0) {
      pos.z += -speed.z;
      speed.z = -speed.z;
    }
  }
}

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

  // PVector col = new PVector(r,g,b);
  return new PVector(r,g,b);
}
