class Cloud {

  PVector pos;
  PVector vel;
  float size;

  PImage cloud1;
  PImage cloud2;
  PImage cloud3;

  Cloud(float _x, float _y, float _speed, float _size) {

    pos = new PVector(_x, _y);
    vel = new PVector(_speed, 0);

    size = _size;
    cloud1 = loadImage("cloud1.png");
    cloud2 = loadImage("cloud2.png");
    cloud3 = loadImage("cloud3.png");

    if (size != 1.0) {
      cloud1.resize(int(cloud1.width * size), 0);
      cloud2.resize(int(cloud2.width * size), 0);
      cloud3.resize(int(cloud2.width * size), 0);
    }
  }

  void display() {
    pos.x += vel.x;
    pos.y += vel.y;

    image(cloud1, pos.x, pos.y);
    image(cloud2, pos.x, pos.y + 30);
    image(cloud3, pos.x - 30, pos.y);
  }
}
