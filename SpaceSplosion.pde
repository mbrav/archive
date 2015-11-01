Bodies[] objects;
Planet earth, moon;

void setup() {
  size(800, 800);
  noStroke();
  objects = new Bodies[2000];
  earth = new Planet();
  moon = new Planet();

  for (int i = 0; i < objects.length; i++) {
    objects[i] = new Bodies();
  }

  earth.Earth();
  moon.Moon();
}


void draw() {
  background(0);
  for (int i = 0; i < objects.length; i++) {
    objects[i].CollisionCheck();
    objects[i].Update();
    objects[i].Dampen();
    objects[i].Animate();
  }
  
  earth.Update();
  moon.Update();

  earth.OtherBody(moon.pos.x, moon.pos.y, moon.mass);
  moon.OtherBody(earth.pos.x, earth.pos.y, earth.mass);

  earth.Animate();
  moon.Animate();
}
