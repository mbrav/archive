var triOsc;
var env;
var a;

// Times and levels for the ADSR envelope
var attackTime = 0.04;
var attackLevel = 1.0;
var decayTime = 0.3;
var decayLevel = 0.1;
var sustainTime = 0.1;
var sustainLevel = 0.0;
var releaseTime = .8;
var duration = 1000;

// Set the note trigger
var beat;
var bpm = 140;

// An index to count up the notes
var note = 0;
var add = 0;
var angle = 0;

var notes = [33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 93, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951];

var fibonacci = [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,
 1597,2584,4181,6765,10946,17711,28657,46368,75025,
 121393,196418,317811,514229,832040,1346269,
 2178309,3524578,5702887,9227465,14930352,24157817,
 39088169];

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  fill(255);

  beat = millis();

  triOsc = new p5.TriOsc();
  triOsc.freq(220);
  triOsc.start();
  env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);
  triOsc.amp(env);
}

function draw(){
  background(255);
  for (var i = 0; i < 12; i++) {
    if ((note + i) % 12 == 0) {
      fill(i*255/12, 120,255);
    } else {
      fill(255);
    }
    ellipse(160 * cos(angle) + width/2, 160 * sin(angle) + height/2, 30, 30);
    angle += TWO_PI/12 + 0.0003;
  }

  if (millis() > beat + 60000/bpm) {
    add ++;
    note = notes[fibonacci[add%fibonacci.length]%12];
    console.log("note", note, " fibonacci num ", fibonacci[add%fibonacci.length], "index", add%fibonacci.length);
    // env.triggerRelease();
    triOsc.freq(notes[note]);
    env.triggerAttack();
    beat = millis();
  }
}
