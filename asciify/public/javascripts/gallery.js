$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "list.csv",
    dataType: "text",
    success: function(data) {
      processData(data);
    }
  });
});

function processData(allText) {
  var allTextLines = allText.split(/\n/);
  for (var i = 0; i < allTextLines.length; i++) {
    if (allTextLines[i] == null || allTextLines[i] == "") {
    } else {
      console.log(allTextLines[i]);
      $('.list').append( '<div> <a href="ascii/' + allTextLines[i] + '.html"> ' + i + ' </a> </div>' );

    }
  }
}
