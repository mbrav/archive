

//
// setInterval(function() {
//   // d3.selectAll("p").style("color", function() {
//   //   return "hsl(" + Math.random() * 360 + ",100%,50%)";
//   // });
//   d3.selectAll("p")
//     .data([20, 8, 15, 16, 23, 42])
//     .transition()
//     .duration(500)
//     // .style("font-size", function() { return Math.random()*50 + "px"; })
//     .style("width", function() { return Math.random()*50+80 + "px"; })
//     .style("color", function() { return "hsl(" + Math.random() * 360 + ",100%,20%)";})
//     .style("background-color", function() { return "hsl(" + Math.random() * 360 + ",100%,80%)";});
// }, 1000);


d3.csv("prices.csv", function(loadedRows) {
  rows = loadedRows;
  console.log(rows[10].price);

  d3.selectAll("p")
    .data(rows)
    .transition()
    .duration(500)
    // .style("font-size", function() { return Math.random()*50 + "px"; })
    .style("width", function(t) { return t.price.trim().slice(1) + "px"; })
    .style("color", function() { return "hsl(" + Math.random() * 360 + ",100%,20%)";})
    .style("background-color", function() { return "hsl(" + Math.random() * 360 + ",100%,80%)";});
});
