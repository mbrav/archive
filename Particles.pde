class Particle {
  float initxPos;
  float xpos, ypos, yspeed;
  float size;

  float rot, rotationRate;

  PImage img1, img2;

  int id;
  int imageId;

  Particle (int _id, float _size) {
    xpos = random(0, width);
    ypos = random(0, height);
    imageId = int(random(1,3));
    initxPos = xpos;
    id = _id;
    size = _size;

    if (id == 1) {
      // sakura
      rotationRate = random (0.01, 0.005) * (1/size);
      rot = random(0, PI/4);
      yspeed = random(0.4, 0.2) * size;

      // load image acording to the particles id
      if (imageId == 1) {
        img1 = loadImage("sakura1.png");
      } else
      if (imageId == 2) {
        img2 = loadImage("sakura2.png");
      }
    } else if (id == 2) {
      // leafs
      rotationRate = random (0.01, 0.005) * (1/size);
      rot = random(0, PI/4);
      yspeed = random(0.4, 0.2) * size;

      // load image acording to the particles id
      if (imageId == 1) {
        img1 = loadImage("leaf1.png");
      } else
      if (imageId == 2) {
        img2 = loadImage("leaf2.png");
      }
    }

    if (size != 1.0) {
      if (imageId == 1) {
        img1.resize(int(img1.width * size), 0);
      } else
      if (imageId == 2) {
        img2.resize(int(img2.width * size), 0);
      }
    }
  }

  void update() {
    ypos = ypos + yspeed;


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
  }

  void display () {

    pushMatrix();
    translate(xpos, ypos);
    rotate(rot);
    if (imageId == 1) {
      image(img1, 0, 0);
    } else
    if (imageId == 2) {
      image(img2, 0, 0);
    }
    popMatrix();

  }
}
