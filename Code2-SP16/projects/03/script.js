// bubbles

var bubbles = [];

function setup() {
  createCanvas(windowWidth,windowHeight);
  b = new Bubble;
  for (var i = 0; i < 50; i++ ) {
    bubbles[i] = new Bubble();
  }

  for (var i = 0; i < 50; i++ ) {
  }
}

function draw() {
  clear();
  noStroke();
  for (var i = 0; i < 50; i++ ) {
    bubbles[i].update();
    bubbles[i].display();

    if(bubbles[i].dead()) {
      bubbles.splice(i,0);
    }
  }
}

function Bubble() {
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  this.speedX = random(-3, 3);
  this.speedY = random(-3, 3);

  this.size = random(10, 50);
  this.life = random(100, 255);

  this.display = function() {
    fill(this.life ,0,0,150)
    ellipse(this.x, this.y, this.size, this.size)
  }

  this.update = function() {

    if (this.life <= 0) {
      this.x += this.speedX;
      this.y += this.speedY;
    } else {
      this.x += random(-1, 1);
      this.y += random(-1, 1);
    }

    this.life -= 1;

    if (this.x < 0 || this.x > width) {
      this.speedX = -this.speedX;
    }
    if (this.y < 0 || this.y > width) {
      this.speedY = -this.speedY;
    }
  }

  this.dead = function() {
    if (self.life == 0) {
      return true;
    } else {
      return false;
    }
  }

  this.intersects = function() {

  }
}

function mousePressed() {
}
