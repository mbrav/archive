class Bodies {
  PVector pos;
  PVector vel;
  float friction, bounceFactor;
  float flySize;
  float mass;

  int colorValue;
  boolean blasted = false;

  float threshold = .01;

  Bodies() {

    mass = random(0.8, 1.5);
    colorValue = int(random(150, 230));

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

  void Animate() {
    fill(colorValue);
    ellipse(pos.x, pos.y, flySize/(mass*mass), flySize/(mass*mass));
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
