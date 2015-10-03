PImage img2;

float x[] = new float[100];
float y[] = new float[100];
float speed[] = new float[100];
float xspeed[] = new float[100];
float gravity[] = new float[100];
float imageSize[] = new float[100];

// variables necessary for reseting the ball
boolean resurrect;
float lastMousePositionX;
float lastMousePositionY;

int balls = 1;

void setup() {
  size(700, 525);
  img2 = loadImage("earth.png");
}

void draw() {
  // draw the background
  background(0);

  x[balls] = random(10);
  y[balls] = random(2.0,10.0);
  speed[balls] = random(0.4, 1.9);
  xspeed[balls] = random(2.0, 8.0);
  gravity[balls] = random(0.7);
  imageSize[balls] = random(20.0, 40.0);

  for (int i = 0; i < balls; i++) {

    if (x[i] > width - imageSize[i] || x[i] < 0) {
      xspeed[i] = xspeed[i] * -0.9;
    }

    if (y[i] > height - imageSize[i] || y[i] < 0) {
      speed[i] = speed[i] * -0.8;

      // if the horizontal speed becomes small then also
      // force gravity and horizontal speeds to decrease as well
      if (abs(speed[i]) < 0.3) {
        xspeed[i] = xspeed[i] * 0.9;
        speed[i] = speed[i] * 0.6;
        gravity[i] = gravity[i] * 0.2;

        if (xspeed[i] < abs(0.02)) {
          xspeed[i] = 0;
        }
      }
      y[i] = height - imageSize[i];
    }

    speed[i] = speed[i] + gravity[i];

    x[i] = x[i] + xspeed[i];
    y[i] = y[i] + speed[i];
    image(img2, x[i], y[i], imageSize[i], imageSize[i]);
  }

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
}
