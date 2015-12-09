class Particle {
  float initxPos;
  float xpos, ypos, yspeed;
  float size;

  float rot, rotationRate;

  PImage img1, img2;

  int id = 0;

  Particle (float x, int _id, float _size) {
    initxPos = x;
    xpos = x;
    id = _id;
    ypos = - 20;
    size = _size;

    if (id == 1) {
      // sakura
      rotationRate = random (0.01, 0.003) * size;
      yspeed = 0.4 * size;
      img1 = loadImage("sakura1.png");
      img2 = loadImage("sakura2.png");
    }

    if (size != 1.0) {
      img1.resize(int(img1.width * size), 0);
      img2.resize(int(img2.width * size), 0);
    }
  }

  void update() {
    ypos = ypos + yspeed;


    if (ypos > height) {
      // above the screen
      ypos = -20;
    }
    if (ypos < height-20) {
      if (rot > PI/2 || rot < 0) {
        rotationRate = -rotationRate;
      }
      rot += rotationRate;
    }
  }

  void display () {

    pushMatrix();
    translate(xpos, ypos);
    rotate(rot);
    image(img1, 0, 0);
    popMatrix();

  }
}
