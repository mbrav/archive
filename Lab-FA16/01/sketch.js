var mic;
var ellipseX, ellipseY;

var objects = [];
var numOfObjects = 200;

var add = 0.0;
var index = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    stroke(255);
    // text = createP("Hello my name is Michael");
    // text.class("coffee");
    // text.position(windowWidth/2, windowHeight/2);

    for (var i = 0; i < numOfObjects; i++) {
        objects.push({
            x: windowWidth / 2,
            y: windowHeight / 2,
            x2: windowWidth / 2,
            y2: windowHeight / 2,
            b: 1.0,
            mic: 0.0
        });
    }

    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    micLevel = mic.getLevel();
    micLevel = log(micLevel) * 0.2 / 2.0;
    println(micLevel);
    background(255);
    colorMode(HSB, 1.0);

    add += 0.03;
    ellipseX = windowWidth / 2 + windowWidth / 10 * sin(add) * (micLevel * 2.0 + 0.2);
    ellipseY = windowHeight / 2 + windowWidth / 10 * cos(add) * (micLevel * 2.0 + 0.2);
    ellipseX2 = windowWidth / 2 + windowWidth / 10 * -sin(add) * (micLevel * 2.0 + 0.2);
    ellipseY2 = windowHeight / 2 + windowWidth / 10 * -cos(add) * (micLevel * 2.0 + 0.2);
    // console.log(objects[numOfObjects-1].b, objects[34].b);

    index = (index + 1) % numOfObjects;
    objects[index].x = ellipseX;
    objects[index].y = ellipseY;
    objects[index].x2 = ellipseX2;
    objects[index].y2 = ellipseY2;
    objects[index].b = 1.0;
    objects[index].mic = micLevel;

    for (var i = 1; i < numOfObjects; i++) {
        stroke(0.6, 0.5, objects[i - 1].b);
        fill(0.5, 0, objects[i - 1].b);
        strokeWeight(2);
        textSize(6);

        ellipse(objects[i - 1].x, objects[i - 1].y, 2, 2);

        // avoids tailing
        if (index == i - 1) {;
        } else {
            // text(objects[i].mic, objects[i].x, objects[i].y);
            line(objects[i].x, objects[i].y, objects[i - 1].x, objects[i - 1].y);
            line(objects[i].x2, objects[i].y2, objects[i - 1].x2, objects[i - 1].y2);
        }

        objects[i - 1].b *= 0.992;
    }
}
