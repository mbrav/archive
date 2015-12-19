class Particle {
  float initxPos;
  float xpos, ypos, yspeed;
  float size;

  float rot, rotationRate;

  PImage img1, img2;

  int seasonId;
  int imageId;
  int changeIdTo;
  boolean seasonChange;
  boolean particleReset;

  Particle (int _id, float _size) {
    xpos = random(0, width);
    ypos = random(0, height);
    imageId = int(random(1,3));
    initxPos = xpos;
    seasonId = _id;
    size = _size;
    changeIdTo = 0;

    if (_id == 1) {
      // sakura leafs
      setSpring();
    } else if (_id == 2) {
      // summer sakura leafs
      setSummer();
    }
    resizeImage();
  }

  void update() {
    // update the position
    ypos = ypos + yspeed;


    if (ypos > height) {
      // set it above the screen
      ypos = -20;
      particleReset = true;
    }
    if (ypos < height-20) {
      // rotate the particle 45 degrees back and forth
      if (rot > PI/4 || rot < 0) {
        rotationRate = -rotationRate;
      }
      rot += rotationRate;
    }
  }

  void display () {
    if (changeIdTo == 1 && seasonChange == true) {
      if (particleReset) {
        setSpring();
        resizeImage();
        changeIdTo = 0;
        seasonChange = false;
        particleReset = false;
      }
    } else
    if (changeIdTo == 2 && seasonChange == true) {
      if (particleReset) {
        setSummer();
        resizeImage();
        changeIdTo = 0;
        seasonChange = false;
        particleReset = false;
      }
    } else
    if (changeIdTo == 3 && seasonChange == true) {
      if (particleReset) {
        setAutumn();
        resizeImage();
        changeIdTo = 0;
        seasonChange = false;
        particleReset = false;
      }
    } else
    if (changeIdTo == 4 && seasonChange == true) {
      if (particleReset) {
        setWinter();
        resizeImage();
        changeIdTo = 0;
        seasonChange = false;
        particleReset = false;
      }
    }

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

  void setSpring() {
    rotationRate = random (0.01, 0.004) * (1/size);
    rot = random(0, PI/4);
    yspeed = random(0.5, 0.9) * size;
    size = random(0.3, 0.6);
    // load image acording to the particles seasonId
    if (imageId == 1) {
      img1 = loadImage("sakura1.png");
    } else
    if (imageId == 2) {
      img2 = loadImage("sakura2.png");
    }
  }

  void setSummer() {
    rotationRate = random (00.01, 0.004) * (1/size);
    rot = random(0, PI/4);
    yspeed = random(0.8, 1.1) * size;
    size = random(0.4, 0.8);
    // load image acording to the particles seasonId
    if (imageId == 1) {
      img1 = loadImage("leaf1.png");
    } else
    if (imageId == 2) {
      img2 = loadImage("leaf2.png");
    }
  }

  void setAutumn() {
    rotationRate = random (00.01, 0.004) * (1/size);
    rot = random(0, PI/4);
    yspeed = random(0.8, 1.1) * size;
    size = random(0.4, 0.8);
    // load image acording to the particles seasonId
    if (imageId == 1) {
      img1 = loadImage("leaf1Autumn.png");
    } else
    if (imageId == 2) {
      img2 = loadImage("leaf2Autumn.png");
    }
  }

  void setWinter() {
    rotationRate = random (00.01, 0.004) * (1/size);
    rot = random(0, PI/4);
    yspeed = random(1.2, 1.9) * size;
    size = random(0.4, 0.8);
    // load image acording to the particles seasonId
    if (imageId == 1) {
      img1 = loadImage("snowflake1.png");
    } else
    if (imageId == 2) {
      img2 = loadImage("snowflake2.png");
    }
  }

  void resizeImage() {
    if (size != 1.0) {
      if (imageId == 1) {
        img1.resize(int(img1.width * size), 0);
      } else
      if (imageId == 2) {
        img2.resize(int(img2.width * size), 0);
      }
    }
  }
}
