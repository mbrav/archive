var img, img2, img3;
var colorArray = [];

var averageRGB = [];
var timer = 0;
var slide = 0;
var slideDuration = 1000;

function preload(){
  img = loadImage("assets/mountains.jpg");
  img2 = loadImage("assets/food.jpg");
  img3 = loadImage("assets/castle.jpg");
}

function setup(){
  noStroke()
  createCanvas(600, 760);
  image(img,0,0);
  loadPixels();
  updatePixels();

  getAverages();
}

function draw(){
  background(255);
  var change = false;
  if (millis() > timer + slideDuration) {
    timer = millis();
    slide++;
    change = true;
  }

  if (slide % 3 == 0) {
    image(img,0,0);
  } else if (slide % 3 == 1) {
    image(img2,0,0);
  } else if (slide % 3 == 2){
    image(img3,0,0);
  }

  if (change) {
    change == false;
    reset();
    if (slide % 3 == 0) {
        image(img,0,0);
        console.log("1");
    } else if (slide % 3 == 1) {
        image(img2,0,0);
        console.log("2");
    } else if (slide % 3 == 2){
        image(img3,0,0);
        console.log("3");
    }
    updatePixels();
    getAverages();
  }



  // fill(averageRGB[0], averageRGB[1], averageRGB[2]);
  // RED
  fill(averageRGB[0], 0, 0);
  ellipse(width/2 - 200, height - 100, averageRGB[0], averageRGB[0]);
  // ORANGE
  fill(averageRGB[0], averageRGB[1], 0);
  ellipse(width/2 - 100, height - 100, (averageRGB[0]+averageRGB[1])/2, (averageRGB[0]+averageRGB[1])/2);
  // GREEN
  fill(0, averageRGB[1], 0);
  ellipse(width/2, height - 100, averageRGB[1], averageRGB[1]);
  // GREEN-BLUE
  fill(0, averageRGB[1], averageRGB[2]);
  ellipse(width/2 + 100, height - 100, (averageRGB[1]+averageRGB[2])/2, (averageRGB[1]+averageRGB[2])/2);
  // BLUE
  fill(0, 0, averageRGB[2]);
  ellipse(width/2 + 200, height - 100, averageRGB[2], averageRGB[2]);
}

function getAverages() {
  var sumRGB = [0,0,0];
  for (var i = 0; i < pixels.length; i+=4) {
    colorArray.push({
      r: pixels[i],
      g: pixels[i+1],
      b: pixels[i+2],
      a: pixels[i+3]
    });

     sumRGB[0] += pixels[i];
     sumRGB[1] += pixels[i+1];
     sumRGB[2] += pixels[i+2];
  }
  averageRGB[0] = sumRGB[0]/colorArray.length;
  averageRGB[1] = sumRGB[1]/colorArray.length;
  averageRGB[2] = sumRGB[2]/colorArray.length;
  console.log(averageRGB);
}

function reset() {
  averageRGB = [];
  colorArray = [];
}
