var storage = [];

// continue where left off
var count = 235;
setInterval(function(){
  var apiKey = "9c8db1be-29e6-4d82-826c-f65a3db0424d";

 var req = $.getJSON( "https://www.leaksapi.com/clinton-emails/id/" + apiKey + "/" + count, function(data) {
    console.log( "success ", data);
  })
  .done(function(data) {
    storage.push(data);
    console.log( "second success ", data);
  })
  .fail(function(err) {
    console.log( "error ", err);
  })
  .always(function(com) {
    console.log( "complete". com);
  });

  count +=1;
}, 20000);

function saveFile() {
  console.save(storage, "emails.js");
}

// HACK: console save file function
// allows to save an object file
// console.save(yourObject, "yourFileName.js");
(function(console){

  console.save = function(data, filename){

    if(!data) {
      console.error('Console.save: No data')
      return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
    e    = document.createEvent('MouseEvents'),
    a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
})(console)
