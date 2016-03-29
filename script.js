//infORM alpha
//created by Michael Braverman on March 12, 2016

// DOM elements
var submitBody, mapBody, title, aboutText, textField, submitButton, backButton;

// App elements
var rawInputText;
var serial;

var serialJSON = [];
var object
var received = false;

// number of events recieved
var n = 0;

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

  d3.select("svg")
    .attr("width",window.innerWidth)
    .attr("height",window.innerHeight);

  submitButton.mousePressed(function() {
    // Go into plot mode
    submitBody.hide();
    mapBody.show();

    // connect to Serial
    serial.open("/dev/cu.usbmodem819431"); // serial port
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

    var svg = d3.select("svg");
    var mapPage = d3.select("#map-page");
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    svg.append("circle").attr("id", "#eventCircle" + n)
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 0)
      .style("fill","white")
      .transition()
      .attr("r", serialJSON[n].eventSignificance)
      .style("fill", function(d) {return d3.rgb(120,140,200)});

    var eventInfo = mapPage.append("div")
      .attr("class", "event-info")
      .attr("id", "#eventInfo" + n)
      .style({"left": int(x - 15) + "px", "top": int(y - 20) + "px"});
    var eventTime = eventInfo.append("p").text(serialJSON[n].eventSignificance);

    // increase count of eventsprocessed & received
    n ++;
  }

  var circle = d3.selectAll("circle");
  var eventInfo = d3.selectAll(".event-info");
  circle.on("mouseover", function(){
    console.log("hello");
    eventInfo.style("display", "block");
  });
  circle.on("mouseout", function(){
    console.log("bye");
    eventInfo.style("display", "none");
  });
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
    serialJSON[n] = JSON.parse(serialString);
    console.log(serialJSON[n]);

    received = true;
  }
}
