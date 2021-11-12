var storage = [];
var count = 0;

// specify what the data variable is
var data = evictions;

init();

function init() {
  objectSaveHackInit();
  getDataInfo();
  generateCleanDataFile();
}

function getDataInfo() {
  console.log("Data Length: " + data.length);
}

function generateCleanDataFile() {
  for (var data_id = 0; data_id < data.length; data_id++) {
    // add new variables to the custom object
    storage.push({
      address:data[data_id].EVICTION_ADDRESS,
      zip:data[data_id].EVICTION_ZIP,
      borough:data[data_id].BOROUGH,
      date:data[data_id].EXECUTED_DATE,
      first_name:data[data_id].MARSHAL_FIRST_NAME,
      last_name:data[data_id].MARSHAL_LAST_NAME,
    });
  }
  console.log(storage);
  console.save(storage, "evictions.js");
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
