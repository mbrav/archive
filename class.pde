class Ball {
  float x;
  float y;
  float speed;
  float xspeed;
  float gravity;
  float imageSize;

  Ball() {
    x = random(10);
    y = random(2.0,10.0);
    speed = random(0.4, 1.9);
    xspeed = random(2.0, 8.0);
    gravity = random(0.7);
    imageSize = random(15.0, 55.0);
  }

  void update() {
    if (x[i] >= width - imageSize || x - imageSize/2 <= 0) {
      xspeed = xspeed * -0.9;
    }

    if (y[i] >= height - imageSize || y - imageSize/2  <= 0) {
      speed = speed * -0.9;

      // if the horizontal speed becomes small then also
      // force gravity and horizontal speeds to decrease as well
      if (abs(speed) < 0.3) {
        // xspeed[i] = xspeed[i] * 0.9;
        speed = speed * 0.6;
        gravity = gravity * 0.2;

        if (xspeed < abs(0.02)) {
          xspeed = 0;
        }
      }
      y = height - imageSize;
    }

    speed = speed + gravity;

    x = x + xspeed;
    y = y + speed;
    image(img2, x, y, imageSize, imageSize);

    if (mousePressed) {
      stroke(255);
      line(lastMousePositionX, lastMousePositionY, mouseX, mouseY);
      image(img2, mouseX - imageSize[balls]/2, mouseY - imageSize[balls]/2, imageSize[balls], imageSize[balls]);
      resurrect = true;
    } else {
      if (resurrect) {
        gravity[balls] = 0.7;
        x[balls] = lastMousePositionX;
        y[balls] = lastMousePositionY;
        xspeed[balls] = map(mouseX - lastMousePositionY, -200, 200, 15, -15);
        speed[balls] = map(mouseY - lastMousePositionY, -200, 200, 15, -15);
        resurrect = false;
        balls ++;
      }
      lastMousePositionX = mouseX;
      lastMousePositionY = mouseY;
    }

    if (balls >= objects - 1) {
      balls = 0;
    }
}
