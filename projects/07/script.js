//word-wave
//created by Michael Braverman on April 10, 2016

dt = [];
for (i = 0; i < 30; i ++) {
  dt[i]= i;
}

function render(){

  // shift array, carry first digit over
  var carryOn = dt[0];
  dt.shift();
  dt[dt.length] = carryOn;

  // DATA JOIN
  // Join new data with old elements, if any.
  var p = d3.select("body").selectAll("p").data(dt);

  // ENTER
  p.enter().append("p")
  .text(function(d) { return "I’m number " + d + "!"; })

  p.transition().duration(200)
  .style("font-size", function(d) {return d + "px";});

  // EXIT
  // Remove old elements as needed.
  // p.exit().remove();

}

// first update
render();

// set interval for further updates
setInterval(render, 200);
