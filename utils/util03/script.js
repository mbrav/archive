var storage = [];
var count = 0;

// specify what the data variable is
var data = publicRecyclingBins.data;
init();

function init() {
  objectSaveHackInit();
  getDataInfo();
  generateCleanDataFile();
}

function getDataInfo() {
  console.log(data);
  console.log("Data Length: " + data.length);
  for (var i = 0; i < data[30].length; i++) {
    console.log(i, data[30][i]);
  }
}

function generateCleanDataFile() {
  for (var i = 17; i < data.length; i++) {
    // add new variables to the custom object
    storage.push({
      lat: data[i][12],
      lng: data[i][13]
    });
  }
  console.log(storage);
  console.save(storage, "cords.js");
}

// HACK: console save file function
// allows to save an object file
// console.save(yourObject, "yourFileName.js");
function objectSaveHackInit() {
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
}
