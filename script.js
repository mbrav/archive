//infORM alpha
//created by Michael Braverman on March 12, 2016

// DOM elements
var submitBody, mapBody, title, aboutText, textField, submitButton, backButton;

// App elements
var rawInputText;
var serial;

var serialJSON;

function setup() {
  // Instantiate our SerialPort object
 serial = new p5.SerialPort();

 // Let's list the ports available
 var portlist = serial.list();

 // Assuming our Arduino is connected, let's open the connection to it
 // Change this to the name of your arduino's serial port
 serial.open("/dev/cu.usbmodem819431");

 // Register some callbacks

 // When we connect to the underlying server
 serial.on('connected', serverConnected);

 // When we get a list of serial ports that are available
 serial.on('list', gotList);

 // When we some data from the serial port
 serial.on('data', gotData);

 // When or if we get an error
 serial.on('error', gotError);

 // When our serial port is opened and ready for read/write
 serial.on('open', gotOpen);

  noCanvas();

  submitBody = select('#submit-page');
  mapBody = select('#map-page');

  title = select('#title');
  aboutText = select('#about-text');
  submitButton = select('#submit-button');
  backButton = select('#back-button');
  aboutText.hide();

  submitButton.mousePressed(submit);
  backButton.mousePressed(back);

  title.mouseOver(function(){
    aboutText.show();
  });

  title.mouseOut(function(){
    aboutText.hide();
  });
}

function draw() {
  if(serialJSON != null) {
    console.log("hello");
  }
}

function submit() {
  // DOM rendering
  submitBody.hide();
  mapBody.show();

  // App function
}

function back() {
  submitBody.show();
  mapBody.hide();
}

// We are connected and ready to go
function serverConnected() {
    println("We are connected!");
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    println(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  println("Serial Port is open!");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  println(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  var serialString = serial.readLine();

  // fixes "Uncaught SyntaxError: Unexpected end of input" error
  if (serialString.length > 0) {
    var serialJSON = JSON.parse(serialString);
    console.log(serialJSON);
  }
}
