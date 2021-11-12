class Plant {
  float xpos, ypos;

  int plantId;
  int imageId;
  float size;
  int stage;
  int stageDuration;
  int millisAge;
  boolean plantReset;

  PImage img0, img1, img2, img3, img4, img5;

  Plant(int _id, float _xpos, float _ypos, float _size, int dur) {
    plantId = _id;
    xpos = _xpos;
    ypos = _ypos;
    size = _size;
    stageDuration = dur;
    img0 = loadImage("mambooBaby.png");
    img1 = loadImage("mamboo1.png");
    img2 = loadImage("mamboo2.png");
    img3 = loadImage("mamboo3.png");
    img4 = loadImage("leafL.png");
    img5 = loadImage("leafR.png");

    resizeImage();
  }

 void update() {
   // update the position

    if (millis() > millisAge + stageDuration) {
      stage ++;
      millisAge = millis();
    }
  }

  void display () {
    if (stage == 0) {
      image(img0, xpos, ypos);
    } else
    if (stage == 1) {
      image(img1, xpos, ypos);
    } else
    if (stage == 2) {
      image(img1, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
    } else
    if (stage == 3) {
      image(img1, xpos, ypos - img1.height);
      image(img2, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
    } else
    if (stage == 4) {
      image(img1, xpos, ypos - img1.height);
      image(img2, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img5, xpos + img5.width/2, ypos);
    } else
    if (stage == 5) {
      image(img1, xpos, ypos - img1.height);
      image(img2, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img4, xpos - img4.width/2, ypos - img4.height);
      image(img5, xpos + img5.width/2, ypos);
    } else
    if (stage == 6) {
      image(img1, xpos, ypos - img1.height);
      image(img2, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img4, xpos - img4.width/2, ypos - img4.height);
      image(img5, xpos + img5.width/2, ypos);
      image(img5, xpos + img5.width/2, ypos - img5.height);
    } else
    if (stage == 7) {
      image(img1, xpos, ypos - img1.height*2);
      image(img2, xpos, ypos - img1.height);
      image(img3, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img4, xpos - img4.width/2, ypos - img4.height);
      image(img5, xpos + img5.width/2, ypos);
      image(img5, xpos + img5.width/2, ypos - img5.height);
    } else
    if (stage == 8) {
      image(img1, xpos, ypos - img1.height*2);
      image(img2, xpos, ypos - img1.height);
      image(img3, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img4, xpos - img4.width/2, ypos - img4.height);
      image(img4, xpos - img4.width/2, ypos - img4.height*2);
      image(img5, xpos + img5.width/2, ypos);
      image(img5, xpos + img5.width/2, ypos - img5.height);
    } else
    if (stage == 9) {
      image(img1, xpos, ypos - img1.height*2);
      image(img2, xpos, ypos - img1.height);
      image(img3, xpos, ypos);
      image(img4, xpos - img4.width/2, ypos);
      image(img4, xpos - img4.width/2, ypos - img4.height);
      image(img4, xpos - img4.width/2, ypos - img4.height*2);
      image(img5, xpos + img5.width/2, ypos);
      image(img5, xpos + img5.width/2, ypos - img5.height);
      image(img5, xpos + img5.width/2, ypos - img5.height*2);
    } else
    if (stage == 10) {
      stage = 0;
    }
  }

  void resizeImage() {
    if (size != 1.0) {
      img0.resize(int(img0.width * size), 0);
      img1.resize(int(img1.width * size), 0);
      img2.resize(int(img2.width * size), 0);
      img3.resize(int(img3.width * size), 0);
      img4.resize(int(img4.width * size), 0);
      img5.resize(int(img5.width * size), 0);
    }
  }
}
