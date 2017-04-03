class ImageBox {
  float boxSize;
  PImage img;

  PVector pos;
  PVector speed;

  ImageBox(float bSize, String imgPath) {
    boxSize = bSize;
    img = loadImage(imgPath);
    pos = new PVector(random(0, boxSize), random(0, boxSize));
    speed = new PVector(random(0.1, 0.6), random(0.1, 0.6));
  }

  void update() {
    image(img, 10,10, 100, 100);
    pos.x += speed.x;
    pos.y += speed.y;

    if (pos.x >= boxSize || pos.x <= 0) {
      pos.x += -speed.x;
      speed.x = -speed.x;
    }
    if (pos.y >= boxSize || pos.y <= 0) {
      pos.y += -speed.y;
      speed.y = -speed.y;
    }
  }

}
