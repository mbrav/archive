// Wave generators
var osc, osc2;
var env, env2;

// Times and levels for the ADSR envelope
var attackTime = 0.6;
var attackLevel = 0.9;
var decayTime = 4.0;
var decayLevel = 0.1;
var sustainTime = 2.0;
var sustainLevel = 0.04;
var releaseTime = 1.0;
var duration = 1000;

var attackTime2 = 0.01;
var attackLevel2 = 0.2;
var decayTime2 = 0.1;
var decayLevel2 = 0.01;
var sustainTime2 = 0.4;
var sustainLevel2 = 0.01;
var releaseTime2 = 0.5;
var duration2 = 500;

// Set the note trigger
var beat = -5000;
var bpm = 40;

// An index to count up the notes
var note = 0;
var add = 0;
var angle = 0;

var shake = 0.0;

var notes = [33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 93, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951];

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  fill(255);
  noStroke();

  osc = new p5.TriOsc();
  osc2 = new p5.TriOsc();
  osc.freq(220);
  osc2.freq(1000);
  osc.setType('triangle');
  osc2.setType('square');
  osc.start();
  osc2.start();
  env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);
  env2 = new p5.Env(attackTime2, attackLevel2, decayTime2, decayLevel2, sustainTime2, sustainLevel2, releaseTime2);
  osc.amp(env);
  osc2.amp(env2);
}

function draw(){
  background(255);
  var sides = 24;
  angle -= 0.005;

  for (var i = 0; i < sleepdata.length; i++) {
    // position of data points (0 - TWO_PI)
    var t = new Date(sleepdata[i].Start);
    var goSleep  = TWO_PI * (t.getMinutes() + t.getHours() * 60) / (60*24);
    var t = new Date(sleepdata[i].End);
    var wakeUp = TWO_PI * (t.getMinutes() + t.getHours() * 60) / (60*24);
    var sleepQuality = sleepdata[i].SleepQuality.match(/\d+/)[0]/100; // 0 - 1.0

    // pin hits
    if (goSleep > abs(angle%TWO_PI) - 0.001 && goSleep < abs(angle%TWO_PI) + 0.01) {
      osc2.freq(sleepQuality * 1000);
      env2.triggerAttack();
      shake = 1.0;
    }
    if (wakeUp > abs(angle%TWO_PI) - 0.001 && wakeUp < abs(angle%TWO_PI) + 0.01) {
      osc2.freq(sleepQuality * 1000);
      env2.triggerAttack();
      shake = 1.0;
    }


    // lines
    stroke(240);
    strokeWeight(1);
    line(120 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2 , 120 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 120 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 120 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2);
    noStroke();

    // dots
    fill(130, 220,255);
    ellipse(120 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2, 120 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 6, 6);
    fill(30, 220,255);
    ellipse(120 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 120 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2, 6, 6);

  }

  for (var i = 0; i < sides; i++) {
    if ((note + i) % 24 == 0) {
      fill(i*255/sides, 220,255);
    } else {
      fill(i*255/sides, 20,255);
    }

    var circleAngle = TWO_PI/sides * i + angle;
    ellipse(160 * cos(circleAngle) + width/2, 160 * sin(circleAngle) + height/2, 30, 30);
  }

  // clock hand
  if (abs(shake) < 0.01) {
    shake =0;
  } else {
    shake *= 0.76;
  }
  var shakeAdd = (sin(shake*100.0)*10);

  stroke(200);
  fill(200);
  strokeWeight(3);
  line(width/2 + shakeAdd, height/2, width/2 - shakeAdd, height/2 - 200);
  noStroke();
  textSize(38);
  var hour = abs(angle%TWO_PI/TWO_PI)*24;
  var minute = (hour - Math.floor(hour))*60;
  text(doubleDigit(Math.round(hour)) + ":" + doubleDigit(Math.round(minute)),width/2 - 48, height/2 - 220);

  if (millis() > beat + 60000/bpm) {
    // console.log("beat");
    add ++;
    note = int(random(12, 24));
    // env.triggerRelease();
    osc.freq(notes[note]);
    env.triggerAttack();
    beat = millis();
  }

}

function doubleDigit(n){
    return n > 9 ? "" + n: "0" + n;
}
