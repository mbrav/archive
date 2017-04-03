class ImageBox {
  PImage img;

  PVector pos;
  PVector speed;
  float imgSize;

  ImageBox(float posX, float posY, float iSize, String imgPath) {
    imgSize = iSize;
    img = loadImage(imgPath);
    pos = new PVector(posX, posY, 10);
    speed = new PVector(random(1.0, 5.0), random(1.0, 5.0), random(1.0, 5.0));
  }

  void update() {
    // simple image
    // image(img, pos.x, pos.y, 30, 30);

    // vertex image
    // translate(pos.x, pos.y);

    beginShape();
    texture(img);
    vertex(pos.x - imgSize, pos.y - imgSize, -pos.z, 0, 0);
    vertex(pos.x + imgSize, pos.y - imgSize, -pos.z, 100, 0);
    vertex(pos.x + imgSize, pos.y + imgSize, pos.z, 100, 100);
    vertex(pos.x - imgSize, pos.y + imgSize, -pos.z, 0, 100);
    endShape();


    pos.x += speed.x;
    pos.y += speed.y;
    pos.z += speed.z;

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
