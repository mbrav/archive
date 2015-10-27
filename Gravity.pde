Ball planet;
Ball[] planets = new Ball[10];

void setup() {
  size(700, 525);
  pixelDensity(2);
  planet = new Ball();

  for (int i = 0; i < planets.length; i++) {
    planets[i] = new Ball();
  }
}

void draw() {
  // draw the background
  background(0);
  planet.update();

  for (int i = 0; i < planets.length; i++) {
    planets[i].update();
  }
}
