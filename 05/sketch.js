// Wave generators
var triOsc;
var env;
var triOsc2;
var env2;

// Times and levels for the ADSR envelope
var attackTime = 0.6;
var attackLevel = 0.8;
var decayTime = 4.0;
var decayLevel = 0.1;
var sustainTime = 2.0;
var sustainLevel = 0.04;
var releaseTime = 1.0;
var duration = 1000;

// Times and levels for the ADSR envelope
var attackTime2 = 0.6;
var attackLevel2 = 0.7;
var decayTime2 = 4.5;
var decayLevel2 = 0.1;
var sustainTime2 = 2.0;
var sustainLevel2 = 0.04;
var releaseTime2 = 1.0;
var duration2 = 800;

// Set the note trigger
var beat = -5000;
var bpm = 14;

// An index to count up the notes
var note = 0;
var note2 = 0;
var add = 0;
var angle = 0;

var notes = [33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 93, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951];

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  fill(255);
  noStroke();

  triOsc = new p5.TriOsc();
  triOsc.freq(220);
  triOsc.start();
  env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);
  triOsc.amp(env);

  triOsc2 = new p5.TriOsc();
  triOsc2.freq(220);
  triOsc2.start();
  env2 = new p5.Env(attackTime2, attackLevel2, decayTime2, decayLevel2, sustainTime2, sustainLevel2, releaseTime2);
  triOsc.amp(env2);
}

function draw(){
  background(255);
  var sides = 24;
  angle += 0.005;
  for (var i = 0; i < sides; i++) {
    if ((note + i) % 24 == 0 || ((note2 + i) % 24 == 0)) {
      fill(i*255/sides, 220,255);
    } else {
      fill(i*255/sides, 20,255);
    }

    var circleAngle = TWO_PI/sides * i + angle;
    ellipse(160 * cos(circleAngle) + width/2, 160 * sin(circleAngle) + height/2, 30, 30);
  }

  if (millis() > beat + 60000/bpm) {
    console.log("beat");
    add ++;
    note = int(random(6, 30));
    note2 = int(random(6, 30));
    // env.triggerRelease();
    triOsc.freq(notes[note]);
    triOsc2.freq(notes[note2]);
    console.log(note, note2);
    env.triggerAttack();
    env2.triggerAttack();
    beat = millis();
  }
}
