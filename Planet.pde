class Planet {
  PImage earth, moon;

  PVector pos;
  PVector vel;
  float friction, bounceFactor;
  float flySize;
  float mass;
  int id;
  int colorValue;
  boolean blasted = false;

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

    flySize = 2;
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
      ellipse(pos.x, pos.y, flySize/(mass*mass), flySize/(mass*mass));
    } else if (id == 1) {
      image(earth, pos.x, pos.y);
    } else if (id == 2) {
      image(moon, pos.x, pos.y);
    }
  }

  void CollisionCheck() {
    if (pos.y <= flySize/2) {
      pos.y = 1 + (flySize/2);
      vel.y *= bounceFactor;
    } else if (pos.y >= height - flySize/2) {
      pos.y = height - flySize/2 - 1;
      vel.y *=  bounceFactor;
    }

    //Collision with walls
    if (pos.x <= flySize/2) {
      pos.x = 1 + (flySize/2);
      vel.x *= bounceFactor;
    } else if (pos.x >= width - flySize/2) {
      pos.x = width - flySize/2 - 1;
      vel.x *=  bounceFactor;
    }
  }

  void Dampen(){
    if (abs(vel.x) > 0) {
      if (vel.x > 0) {
        vel.x -= friction;
      }
      else {
        vel.x+=friction;
      }
    }

    if (abs(vel.y) > 0) {
      if (vel.y > 0) {
        vel.y -= friction;
      }
      else {
        vel.y+=friction;
      }
    }
  }
}
