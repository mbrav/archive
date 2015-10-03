PImage img2;

float x = 10;
float y = 10;
float speed = 1.2;
float xspeed = 5.2;
float gravity = 0.7;
float imageSize = 35;

// variables necessary for reseting the ball
boolean resurrect;
float lastMousePositionX;
float lastMousePositionY;

int count;

void setup() {
  size(700, 525);
  img2 = loadImage("earth.png");
}

void draw() {
  // draw the background
  background(0);

  if (mousePressed) {
    stroke(255);
    line(lastMousePositionX, lastMousePositionY, mouseX, mouseY);
    image(img2, mouseX - imageSize, mouseY - imageSize, imageSize*2, imageSize*2);
    resurrect = true;
  } else {
    if (resurrect) {
      gravity = 0.7;
      x = lastMousePositionX;
      y = lastMousePositionY;
      xspeed = map(mouseX - lastMousePositionY, -200, 200, 8, -8);
      speed = map(mouseY - lastMousePositionY, -200, 200, 10, -10);
      resurrect = false;
    }
    lastMousePositionX = mouseX;
    lastMousePositionY = mouseY;
  }

  if (x > width - imageSize || x < 0) {
    xspeed = xspeed * -0.9;
  }

  // if (y < 0 + imageSize) {
  //   xspeed = xspeed * -0.9;
  // }

  if (y > height - imageSize) {
    speed = speed * -0.8;

    // if the horizontal speed becomes small then also
    // force gravity and horizontal speeds to decrease as well
    if (abs(speed) < 0.3) {
      xspeed = xspeed * 0.5;
      speed = speed * 0.6;
      gravity = gravity * 0.2;
      print("MEOW!! ");
      println(count);
      if (xspeed < abs(0.02)) {
        xspeed = 0;
      }
    }

    y = height - imageSize;
  }

  speed = speed + gravity;

  x = x + xspeed;
  y = y + speed;

  count ++;

  image(img2, x, y, imageSize, imageSize);

  text(speed, 620, 20);
  text(xspeed, 620, 40);
  text(gravity, 620, 60);
}
