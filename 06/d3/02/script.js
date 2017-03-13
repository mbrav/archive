var parsedData = d3.timeParse("%m/%d/%Y");

d3.csv("prices.csv")
  .row(function(d){return{
    month:parsedData(d.month),
    price:Number(d.price.trim().slice(1))
  }
  .get(function(error,data){

    var h = 300;
    var w = 500;

    var max = d3.max(data, function(d) { return d.price });
    // var min= d3.min(data, function(d) { return d.price });
    var maxDate = d3.max(data, function(d) { return d.month });
    var minDate = d3.min(data, function(d) { return d.month });

    var y = d3.scaleLinear().domain([0, max]).range([height, 0]);
    var x = d3.scaleLinear().domain([minDate, maxDate]).range([0, height]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    var svg = d3.select('body').append("svg").attr("height", "100%").attr("width", "100%");

    var margin = {left:50, right:50, top:40, bottom:0};

    var chartGroup = svg.append("g")
      .attr("transform", "transform(+margin.left+", margin.top +")");

    var line = d3.line()
      .x(function(d){return x(d.month);})
      .y(function(d){return x(d.price);});

    console.log(x, y);
  })
})
