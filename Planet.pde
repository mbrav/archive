class Planet {
  PImage earth, moon;

  PVector pos;
  PVector vel;
  float friction, bounceFactor;

  float mass;
  int id;
  int colorValue;

  float threshold = .01;

  Planet() {
    earth = loadImage("earth.png");
    moon = loadImage("moon.png");

    mass = random(0.8, 1.5);
    colorValue = int(random(150, 230));
    id = 0;

    pos = new PVector(random(width), random(height));
    vel = new PVector(0, 0);
    friction = .05;
    bounceFactor = 2;
  }

  void Update() {

    pos.x += vel.x;
    pos.y += vel.y;

    if (mousePressed) {
      PVector dir = new PVector(mouseX - pos.x, mouseY - pos.y);
      dir.normalize();
      float d = dist(mouseX, mouseY, pos.x, pos.y);
      d = map(d, 0, width, 10, 0);
      d = d/mass;
      vel = new PVector(dir.x * d, dir.y * d);
    }
  }

  void Earth() {
    mass = 6.0;
    id = 1;
  }

  void Moon() {
    mass = 2.5;
    id = 2;
  }

  void Animate() {
    fill(colorValue);

    if (id == 0) {
      //mystery planet
    } else if (id == 1) {
      image(earth, pos.x, pos.y);
    } else if (id == 2) {
      image(moon, pos.x, pos.y);
    }
  }

  void CollisionCheck() {
  }

  void Dampen(){
  }
}
