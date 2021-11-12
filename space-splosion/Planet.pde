class Planet {
  PImage earth, moon;

  PVector pos;
  PVector vel;
  float friction, bounceFactor;
  float otherBodyX, otherBodyY, otherBodyMass;

  float mass;
  int id;
  int colorValue;

  float threshold = .01;

  Planet() {
    earth = loadImage("earth.png");
    moon = loadImage("moon.png");

    mass = 1.0;
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
      PVector dir = new PVector((mouseX/mass) + otherBodyX - pos.x,
         (mouseY/mass) + otherBodyY - pos.y);
      dir.normalize();
      float d = dist(otherBodyX, otherBodyY, pos.x, pos.y);
      d = map(d, 0, width, 10, 0);
      d = d/mass;
      vel = new PVector(dir.x * d, dir.y * d);
    }
  }

  void OtherBody(float _posX, float _posY, float _mass) {
    otherBodyX = _posX;
    otherBodyY = _posY;
    otherBodyMass = _mass;

  }

  void Earth() {
    friction = .01;
    mass = 6.0;
    id = 1;
  }

  void Moon() {
    friction = .03;
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
