import ddf.minim.*;

AudioPlayer player;
Minim minim;//audio context

PImage bg, bg1, bg2, bg3, bg4, bg5, pagoda;
Cloud cloud1;
Cloud cloud2;

int seasonCount;
boolean nextSeason;
int seasonDuration = 3000; // in milliseconds

Particle[] particels = new Particle[100];

void setup() {
  minim = new Minim(this);
  player = minim.loadFile("soundtrack.mp3", 2048);
  player.play();

  size(640, 480);
  pixelDensity(1);
  bg = loadImage("bg.png");
  bg1 = loadImage("bg1.png");
  bg2 = loadImage("bg2.png");
  bg3 = loadImage("bg3.png");
  bg4 = loadImage("bg4.png");
  bg5 = loadImage("bg5.png");
  pagoda = loadImage("pagoda.png");

  cloud1 = new Cloud(600, 120, -0.2, 1.7);
  cloud2 = new Cloud(0, 200, 0.35, 1.0);

  for (int i = 0; i < particels.length; i++) {
    particels[i] = new Particle(1, random(0.3, 0.6));
  }

}

void draw() {
  background(bg);
  frameRate(60);
  stroke(255);

  image(bg1, 0, 0);
  cloud1.display();
  image(bg2, 0, 0);
  image(bg3, 0, 0);
  cloud2.display();
  image(bg4, 0, 0);
  image(bg5, 0, 0);
  image(pagoda, 240, 0);

  if (millis() > seasonCount * seasonDuration) {
    seasonCount++;
    nextSeason = true;
  }

  for (int i = 0; i < particels.length; i++) {
    if (nextSeason) {
      particels[i].changeIdTo = (seasonCount % 2) + 1;
    }
    particels[i].update();
    particels[i].display();
  }
  nextSeason = false;
  println(seasonCount % 2);
}

void stop() {
  player.close();
  minim.stop();
  super.stop();
}
