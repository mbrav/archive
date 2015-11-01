Fly[] swarm;

void setup() {
  size(800, 800);
  swarm = new Fly[2000];

  for (int i = 0; i < swarm.length; i++) {
    swarm[i] = new Fly();
  }
}


void draw() {
  background(255);
  for (int i = 0; i < swarm.length; i++) {
    swarm[i].CollisionCheck();
    swarm[i].Update();
    swarm[i].Dampen();
    swarm[i].Animate();
  }
}
