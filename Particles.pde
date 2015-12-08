class Particle {
  float initxPos;
  float xpos, ypos, yspeed, xspeed;

  float rot, rotationRate;

  PImage img1, img2;

  int id = 0;

  Particle (float x, int _id) {
    initxPos = x;
    xpos = x;
    ypos = - 20;
    id = _id;
    rot = 0;

    if (id == 1) {
      // sakura
      rotationRate = 0.005;
      yspeed = 0.5;
      img1 = loadImage("sakura1.png");
      img2 = loadImage("sakura2.png");
    }
  }

  void display () {
    ypos = ypos + yspeed;
    xpos = xpos + xspeed;


    if (ypos > height) {
      // above the screen
      ypos = -20;
    }
    if (ypos < height-20) {
      if (rot > PI/4 || rot < 0) {
        rotationRate = -rotationRate;
      }
      rot += rotationRate;
    }

    pushMatrix();
    rotate(rot);
    image(img1, xpos, ypos);
    popMatrix();
  }
}
