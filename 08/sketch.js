// Time
var hoursPast = 0;
var daysPast = 0;
var lastHour = 0;

// Note trigger based on time
var loopCount = 0;
var angle = 0;
var beat = -5000;
var beatCount = 0;
var bpm = 80;

var fibonacci = [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,
 1597,2584,4181,6765,10946,17711,28657,46368,75025,
 121393,196418,317811,514229,832040,1346269,
 2178309,3524578,5702887,9227465,14930352,24157817,
 39088169];

 var notes = [33, 35, 37, 39, 41, 44, 46, 49, 52, 55, 58, 62, 65, 69, 73, 78, 82, 87, 93, 98, 104, 110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988, 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951];

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

 var voice = new SynthVoice(0.01, 0.8, 0.2, 0.2, 0.2, 0.0, 0.1, 100);
 var voice2 = new SynthVoice(0.01, 0.8, 0.2, 0.0, 0.2, 0.0, 0.1, 100);
 var voice3 = new SynthVoice(0.01, 0.4, 0.2, 0.0, 0.2, 0.0, 0.1, 100);
 var voice4 = new SynthVoice(0.01, 0.6, 0.2, 0.2, 0.2, 0.0, 0.1, 100);
 var voice5 = new SynthVoice(0.01, 0.2, 0.2, 0.0, 0.2, 0.0, 0.1, 100);
 var voice6 = new SynthVoice(0.01, 0.01, 0.2, 0.0, 0.2, 0.0, 0.1, 100);
 // An index to count up the notes
 var noteIndex=[0,0,0,0,0,0];

 var shake = 0.0; // for shaking the play head
 var sides = 24; // number of notes/circles
 var noteBegin = 24; // note to begin with

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  fill(255);
  noStroke();

  // OPTIONS: 'sine', 'triangle', 'sawtooth', 'square'
  voice.setWaveform('sine');
  voice2.setWaveform('sine');
  voice3.setWaveform('triangle');
  voice4.setWaveform('triangle');
  voice5.setWaveform('triangle');
  voice6.setWaveform('sine');

  for (var i = 0; i < noteIndex.length; i++) {
    noteIndex[i] = int(random(0,sides)) + noteBegin;
  }

  var body = select('body');
  var dataText = createDiv('data-text');
  dataText.id('data-text');
  body.child('data-text');

  highlightDataText();
}

function highlightDataText() {
  var dataText = select('#data-text');
  dataText.html(' ');
  var txt = "";
  for (var i = 0; i < sleepdata.length; i++) {

      var highlightData = false;
      for (var j = 0; j < noteIndex.length; j++) {
        if (noteIndex[j]%sides == i) {
          highlightData = true;
        }
      }

      if (highlightData) {
        txt += "<div id='highlight' style='color:hsla(" +
        i * 255/sleepdata.length + "," +
        100 + "%,"+
        50 +"%," +
        0.1+ ");'>";
      }

      txt += " Start:";
      txt += sleepdata[i].Start;
      txt += " End:";
      txt += sleepdata[i].End;
      txt += " SleepQuality:";
      txt += sleepdata[i].SleepQuality;
      txt += " TimeInBed:";
      txt += sleepdata[i].TimeInBed;

      if (highlightData) {
        txt += "</div>";
      }
  }
  dataText.html(txt);
}

function draw(){
  clear();
  background(255, 0.1);

  // get current time of the visualization
  var hour = abs(angle%TWO_PI/TWO_PI)*24;
  var minute = (hour - Math.floor(hour))*60;

  //count hours
  if (lastHour != Math.round(hour-0.5)) {
    lastHour = Math.round(hour-0.5);
    hoursPast++;

    if (hoursPast %24 == 0) {
      daysPast++;

      highlightDataText();

      for (var i = 0; i < noteIndex.length; i++) {
        noteIndex[i] = int(random(0,sides)) + noteBegin;
      }

      console.log("Indexes: ", noteIndex[0],noteIndex[1],noteIndex[2],noteIndex[3],noteIndex[4],noteIndex[5], "Pitches: ", notes[noteIndex[0]],notes[noteIndex[1]],notes[noteIndex[2]],notes[noteIndex[3]],notes[noteIndex[4]],notes[noteIndex[5]]);

      voice.freq(notes[noteIndex[0]]);
      voice2.freq(notes[noteIndex[1]]);
      voice3.freq(notes[noteIndex[2]]);
      voice4.freq(notes[noteIndex[3]]);
      voice5.freq(notes[noteIndex[4]]);
      voice6.freq(notes[noteIndex[5]]);
      voice.triggerAttack();
      voice2.triggerAttack();
      voice3.triggerAttack();
      voice4.triggerAttack();
      voice5.triggerAttack();
      voice6.triggerAttack();
    }
  }

  angle -= 0.02;

  for (var i = 0; i < sleepdata.length; i++) {
    // check if the chord is hit
    voice.freq(200);
    if (goSleep > abs(angle%TWO_PI) - 0.001 && goSleep < abs(angle%TWO_PI) + 0.01) {
      voice.triggerAttack();
      voice2.triggerAttack();
      voice3.triggerAttack();
      voice4.triggerAttack();
      voice5.triggerAttack();
      voice6.triggerAttack();
      shake = 1.0;
    }
    if (wakeUp > abs(angle%TWO_PI) - 0.001 && wakeUp < abs(angle%TWO_PI) + 0.01) {
      // trigger off
      voice.triggerRelease();
      voice2.triggerRelease();
      voice3.triggerRelease();
      voice4.triggerRelease();
      voice5.triggerRelease();
      voice6.triggerRelease();
      shake = 0;
    }

    var t = new Date(sleepdata[i].Start);
    var goSleep  = TWO_PI * (t.getMinutes() + t.getHours() * 60) / (60*24);
    var t = new Date(sleepdata[i].End);
    var wakeUp = TWO_PI * (t.getMinutes() + t.getHours() * 60) / (60*24);
    var sleepQuality = sleepdata[i].SleepQuality.match(/\d+/)[0]/100; // 0 - 1.0

    // arc
    noFill();

    // current notes
    for (var j = 0; j < noteIndex.length; j++) {

      // stroke for arc
      if (noteIndex[j]%sides == i) {
        stroke(150);
      } else {
        stroke(240);
      }

      // console.log(noteIndex[j]%sides);

      // lines between data
      strokeWeight(1);
      noFill();
      arc(width/2, height/2, 480 * sleepQuality, 480 * sleepQuality, goSleep+angle-PI/2, wakeUp+angle-PI/2);

      noStroke();
      if (noteIndex[j]%sides == i) {
        // dots
        fill(130, 220,255);
        ellipse(240 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2, 240 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 6, 6);
        fill(30, 220,255);
        ellipse(240 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 240 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2, 6, 6);
      } else {
        // dots
        fill(240);
        ellipse(240 *sleepQuality * cos(goSleep - PI/2 + angle) + width/2, 240 *sleepQuality * sin(goSleep - PI/2 + angle) + height/2, 6, 6);
        fill(240);
        ellipse(240 *sleepQuality * cos(wakeUp - PI/2 + angle) + width/2, 240 *sleepQuality * sin(wakeUp - PI/2 + angle) + height/2, 6, 6);
      }
    }
  }

  for (var i = 0; i < sides; i++) {

    // go through the note an check if any of them are equal to the number of circles
    var noteOn = false;
    for (var j = 0; j < noteIndex.length; j++) {
      if (noteIndex[j]%sides == i) {
        noteOn = true;
      }
    }

    if (noteOn) {
      fill(i*255/sides, 220,255);
      noteOn = false;
    } else {
      fill(i*255/sides, 20,255);
    }

      var circleAngle = TWO_PI/sides * i + angle;
      ellipse(80 * cos(circleAngle) + width/2, 80 * sin(circleAngle) + height/2, 16, 16);
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
  line(width/2 + shakeAdd, height/2 - 100, width/2 - shakeAdd, height/2 - 260);

  // time
  noStroke();
  textSize(38);
  text(doubleDigit(Math.round(hour)) + ":" + doubleDigit(Math.round(minute)),width/2 - 48, height/2 + 16);

  // project timing
  if (millis() > beat + 60000/bpm) {
    beat = millis();
    beatCount++;
  }
}

function doubleDigit(n) {
    return n > 9 ? "" + n: "0" + n;
}

Math.map = function(valueToMap,min,max,minToMap,maxToMap){
	var mappedValue = minToMap + (maxToMap - minToMap) * ((valueToMap - min) / (max - min));
	return mappedValue;
};

// Multivoice Object
function SynthVoice(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime, duration) {

  this.osc = new p5.TriOsc();
  this.reverb = new p5.Reverb();
  this.env = new p5.Env(attackTime, attackLevel, decayTime, decayLevel, sustainTime, sustainLevel, releaseTime);

  this.osc.freq(440);
  this.osc.start();
  this.osc.amp(this.env);

  this.osc.disconnect();

  // source, reverbTime, decayRate
  this.reverb.process(this.osc, 6, 0.9);
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

SynthVoice.prototype.triggerRelease = function(freq) {
  this.env.triggerRelease();
};
