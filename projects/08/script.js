//happy-api
//created by Michael Braverman on April 10, 2016

var URIbase = "https://api.wordnik.com/v4/word.json/";
var URIword = "fast";
var URIquery = "/relatedWords?useCanonical=false&limitPerRelationshipType=25&";
var apiKey = "api_key=f25591c2a98764f728a0102bd600927221ca11d96990888de";

var data;

var input = d3.select('#input');
var button = d3.select('#submit');
// setup canvas

button.on("click", generate);

function generate() {
  URIword = document.getElementById("input").value;
  // URIword = input.value();
  var path = URIbase + URIword + URIquery + apiKey;
  var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)

  // add main word
  svg.append("text")
  .text(URIword)
  .attr("dx", window.innerWidth/2-20)
  .attr("dy", window.innerHeight/2-20)
  .attr("class", "fill-red")
  .style("font-size", "40px");

  // generate JSON
  d3.json(path, function(error, json) {
    if (error) return console.warn(error);
    data = json;

    var elem = svg.selectAll("g")
    .data(json[4].words)

    var elemEnter = elem.enter()
    .append("g")

    // Create the text for each block
    elemEnter.append("text")
    .attr("dx", window.innerWidth/2-20)
    .attr("dy", window.innerHeight/2-20)
    .transition()
    .attr("dx", function() { return (Math.random() * window.innerWidth);})
    .attr("dy", function() { return (Math.random() * window.innerHeight);})
    .text(function(d){ console.log(d); return d})

    // .exit().remove();

    // TODO Create lines for each block
    // elemEnter.append("line")
    // .attr("x1", window.innerWidth/2-20)
    // .attr("y1", window.innerHeight/2-20)
    // .transition()
    // .attr("x2", function() { return (Math.random() * window.innerWidth);})
    // .attr("y2", function() { return (Math.random() * window.innerHeight);})
  });
}
