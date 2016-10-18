var output = document.getElementById("data-output");

var lead = new SynthVoice();
var bass = new SynthVoice();
var soloGuitar = new SynthVoice();
var posX, posY;

function showPosition(pos) {
  posX = pos.coords.latitude;
  posY = pos.coords.longitude;
  console.log("POS", pos.coords.latitude, pos.coords.longitude);

  output.innerHTML += "<br>LATITUDE: " + posX + "<br>LONGITUDE: " + posY;
}

console.log( navigator.geolocation.getCurrentPosition(showPosition));

// setInterval(function(){
//   oscillator.frequency.value = 30 + 300*Math.cos(Math.random());
//   oscillator2.frequency.value = 30 + 300*Math.sin(Math.random());
// }, 400);

var onOrientationChange = function(data) {
  console.log("DEVICE DATA UPDATE!", data);

  output.innerHTML = "ALPHA: " + data.alpha + "<br>BETA: " + data.beta + "<br>GAMMA: " +  data.gamma;
}

if(window.DeviceOrientationEvent) {
  console.log("YES!");
  window.addEventListener('deviceorientation', onOrientationChange, false);
} else {
  console.log("NOPE!");
}

setInterval(function () {
  lead.setWaveform('square');
  bass.setWaveform('square');
  lead.freq(500 + 500* Math.random());
  lead.volume(0);
  bass.volume(0);
  bass.freq(20 + 200 * Math.random());
}, 300);

setInterval(function () {
  soloGuitar.setWaveform('square');
  soloGuitar.freq(400 + 100* Math.random());
  soloGuitar.volume(0);
}, 150);

// Multivoice Object
function SynthVoice() {
  this.audioCtx = new (window.AudioContext || window.webkit.Audio.Context)();
  this.oscillator = this.audioCtx.createOscillator();
  this.gainNode = this.audioCtx.createGain();
  this.oscillator.connect(this.gainNode);
  this.gainNode.connect(this.audioCtx.destination);
  this.oscillator.start(0);
}

// SynthVoice.prototype.sequencer = function(delay) {
//   setInterval(function () {
//     this.oscillator.frequency.value = 300 + 50* Math.random();
//   }, delay);
// }

SynthVoice.prototype.freq = function(freq) {
  this.oscillator.frequency.value = freq;
};

SynthVoice.prototype.volume = function(freq) {
  this.oscillator.frequency.value = freq;
  this.oscillator.gain.value = 0;
};

SynthVoice.prototype.setWaveform = function(waveForm) {
  // OPTIONS: 'sine', 'triangle', 'sawtooth', 'square'
  this.oscillator.type = waveForm;
};

SynthVoice.prototype.triggerAttack = function(freq) {
  this.env.triggerAttack();
};
