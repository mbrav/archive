// Squarework

var x = 100;
var y = 100;

var xDiff;
var yDiff;

var randomX;
var randomY;

function setup() {

    createCanvas(windowWidth,windowHeight);
    background(191,183,159);
    noStroke();
    generateCordinate();
}

function draw() {

  if (randomX == x || randomY == y) {
    // if the cordinates reach the number
    // generate a new one
     generateCordinate();
     console.log("GENERATE!");
  } else {
    if (randomX > x) {
      x ++;
    } else {
      x --;
    }
    if (randomY > y) {
      y ++;
    } else {
      y --;
    }
  }

  background(191,183,159);
  fill(79,107,98, 60);

  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      drawRectangleGroup(x * i, y * j);
    }
  }

  // if (x % 60 < 30) {
  //   fill(255,255,255);
  // } else {
  //   fill(143,16,16);
  // }
  //
  // textSize(30);
  // text("Whats GUCCI?", 0, 600);
}

function generateCordinate() {
  randomX = int(random(0,windowWidth));
  randomY = int(random(0,windowHeight));
}

function drawRectangleGroup(_x, _y) {
  xDiff = _x - width/2;
  yDiff = _y - height/2;
  rect(width/2 + xDiff, height/2 - yDiff, xDiff, yDiff);
  rect(width/2 - xDiff, height/2 + yDiff, -xDiff, yDiff);
  rect(width/2 - xDiff, height/2 - yDiff, xDiff, -yDiff);
}
