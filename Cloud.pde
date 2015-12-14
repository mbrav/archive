class Cloud {

  float posx, posy;
  float velx, vely;
  float size;

  PImage cloud1, cloud2, cloud3;

  Cloud(float _x, float _y, float _speed, float _size) {

    posx = _x;
    posy = _y;
    velx = _speed;
    vely = random(0.1, 0.2);

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

    if (posx > width) {
      velx = -velx;
    } else
    if (posx < 0) {
      velx = -velx;
    }

    // if (vely > 10) {
    //   posx -= vely;
    //   vely = -vely;
    // }
    //
    // if (vely < -10) {
    //   posx -= vely;
    //   vely = -vely;
    // }

    posx += velx;
    // posy += vely;

    image(cloud1, posx, posy);
    image(cloud2, posx, posy);
    image(cloud3, posx, posy);
  }
}
