// variables necessary for reseting the ball
boolean resurrect;
float lastMousePositionX;
float lastMousePositionY;

Ball planet;

void setup() {
  size(700, 525);
  pixelDensity(2);
  planet = new Ball();
}

void draw() {
  // draw the background
  background(0);
  planet.update();

}
