// Wave generators

// FOR REFERENCE
// attackTime;
// attackLevel;
// decayTime;
// decayLevel;
// sustainTime;
// sustainLevel;
// releaseTime;
// duration;

var voice = new SynthVoice(0.6, 0.7, 1.0, 0.1, 2.0, 0.04, 0.9, 1000);
var voice2 = new SynthVoice(0.1, 0.7, 0.4, 0.1, 1.0, 0.04, 0.7, 1000);
var voice3 = new SynthVoice(0.1, 0.7, 0.6, 0.1, 1.0, 0.0, 0.8, 1000);
var voice4 = new SynthVoice(0.1, 0.7, 0.6, 0.1, 1.0, 0.0, 0.6, 1000);
var voiceNote = new SynthVoice(0.1, 0.03, 0.1, 0.001, 0.2, 0.1, 0.1, 500);

// Set the note trigger
var beat = -5000;
var beatCount = 0;
var bpm = 20;

// An index to count up the notes
var note, note2, note3, note4;
var angle = 0;

var shake = 0.0;

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
  noStroke();

  // OPTIONS: 'sine', 'triangle', 'sawtooth', 'square'
  voice.setWaveform('sine');
  voice2.setWaveform('sine');
  voice3.setWaveform('sine');
  voice4.setWaveform('sine');
  voiceNote.setWaveform('sawtooth');
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
      voice.triggerAttack();
      shake = 1.0;
    }
    if (wakeUp > abs(angle%TWO_PI) - 0.001 && wakeUp < abs(angle%TWO_PI) + 0.01) {
      voice2.triggerAttack();
      shake = 1.0;
    }

    // lines
    stroke(240);
    strokeWeight(1);
    // line(120 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2 , 120 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 120 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 120 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2);

    // arc
    noFill();
    stroke(240);
    arc(width/2, height/2, 240 * sleepQuality, 240 * sleepQuality, goSleep+angle-PI/2, wakeUp+angle-PI/2);
    noStroke();

    // dots
    fill(130, 220,255);

    ellipse(120 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2, 120 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 5, 5);
    fill(30, 220,255);
    ellipse(120 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 120 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2, 5, 5);


  }

  for (var i = 0; i < sides; i++) {
    if ((note + i) % 24 == 0 || (note2 + i) % 24 == 0 || (note3 + i) % 24 == 0 || (note4 + i) % 24 == 0) {
      fill(i*255/sides, 220,255);
    } else {
      fill(i*255/sides, 20,255);
    }

    var circleAngle = TWO_PI/sides * i + angle;
    ellipse(160 * cos(circleAngle) + width/2, 160 * sin(circleAngle) + height/2, 30, 30);
  }

  // clockhand shaking
  if (abs(shake) < 0.01) {
    shake =0;
  } else {
    shake *= 0.76;
  }

  // clock hand
  stroke(200);
  fill(200);
  strokeWeight(3);
  var shakeAdd = (sin(shake*100.0)*10);
  line(width/2 + shakeAdd, height/2, width/2 - shakeAdd, height/2 - 200);

  // time
  noStroke();
  textSize(38);
  var hour = abs(angle%TWO_PI/TWO_PI)*24;
  var minute = (hour - Math.floor(hour))*60;
  text(doubleDigit(Math.round(hour)) + ":" + doubleDigit(Math.round(minute)),width/2 - 48, height/2 - 220);

  // project timing
  if (millis() > beat + 60000/bpm) {
    // console.log("beat");

    if (beatCount % 2 == 0) {
      note = 24 + fibonacci[(beatCount)%fibonacci.length]%24;
      note2 = 24 + fibonacci[(beatCount + 5)%fibonacci.length]%24;
      note3 = 24 + fibonacci[(beatCount - 7)%fibonacci.length]%24;
      note4 = 24 + fibonacci[(beatCount + 10)%fibonacci.length]%24;
    }

    voice.freq(notes[note]);
    voice2.freq(notes[note2]);
    voice3.freq(notes[note3]);
    voice4.freq(notes[note4]);
    voice.triggerAttack();
    voice2.triggerAttack();
    voice3.triggerAttack();
    voice4.triggerAttack();
    beat = millis();
    beatCount++;
  }
}

function doubleDigit(n) {
    return n > 9 ? "" + n: "0" + n;
}

// Multivoice Object
function SynthVoice(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime, duration) {

  this.osc = new p5.TriOsc();
  this.env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);

  this.osc.freq(440);
  this.osc.start();

  this.osc.amp(this.env);
}

SynthVoice.prototype.freq = function(freq) {
  this.osc.freq(freq);
};

SynthVoice.prototype.setWaveform = function(waveForm) {
  // OPTIONS: 'sine', 'triangle', 'sawtooth', 'square'
  this.osc.setType(waveForm);
};

SynthVoice.prototype.triggerAttack = function(freq) {
  this.env.triggerAttack();
};
