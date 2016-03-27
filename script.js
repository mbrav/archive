//infORM alpha
//created by Michael Braverman on March 12, 2016

// DOM elements
var submitBody, mapBody, title, aboutText, textField, submitButton, backButton;

// App elements
var rawInputText;
var serial;

var serialJSON;
var received = false;

function setup() {
  // Instantiate our SerialPort object
 serial = new p5.SerialPort();

 // Let's list the ports available
 var portlist = serial.list();

  noCanvas();

  submitBody = select('#submit-page');
  mapBody = select('#map-page');

  title = select('#title');
  aboutText = select('#about-text');
  submitButton = select('#submit-button');
  backButton = select('#back-button');
  aboutText.hide();

  submitButton.mousePressed(function() {
    // Go into the list mode
    submitBody.hide();
    mapBody.show();

    // connect to Serial
    serial.open("/dev/cu.usbmodem819431");

    serial.on('connected', serverConnected);
    serial.on('list', gotList);
    serial.on('data', gotData);
    serial.on('error', gotError);
    serial.on('open', gotOpen);
  });

  backButton.mousePressed(function() {

    // go back to homescreen
    submitBody.show();
    mapBody.hide();
    serial.close();
  });

  title.mouseOver(function(){
    aboutText.show();
  });

  title.mouseOut(function(){
    aboutText.hide();
  });
}

function draw() {
  if(received) {
    received = false;
  }
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
    received = true;
  }
}
