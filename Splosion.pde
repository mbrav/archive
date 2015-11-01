Fly[] objects;

void setup() {
  size(800, 800);
  noStroke();
  objects = new Fly[2000];

  for (int i = 0; i < objects.length; i++) {
    objects[i] = new Fly();
  }

  objects[333].Earth();
  objects[111].Moon();
}


void draw() {
  background(0);
  for (int i = 0; i < objects.length; i++) {
    objects[i].CollisionCheck();
    objects[i].Update();
    objects[i].Dampen();
    objects[i].Animate();
  }
}
