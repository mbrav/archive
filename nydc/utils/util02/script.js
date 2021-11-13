var geocoder;
var map;

// specify data variable based on the .js file included in the .html
var data = nycDomainRegistrations.data;

// new object storage
var storage = [];
var count = 0;

init();

function init() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(40.88, -73.82);
  var mapOptions = {
    zoom: 13,
    center: latlng
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  objectSaveHackInit(); // the big boy
  getDataInfo();
  startGeocoding(); // another big boy
}

function getDataInfo() {
  console.log("Length of Address Data: " + data.length);
  for (var i = 0; i < data[3].length; i++) {
    console.log(i, data[0][i]);
  }
}

function startGeocoding() {
  setInterval(function(){
    if (count < data.length) {
      // var address = data[count][12] + ", " + data[count][16] + ", " + "NY";
      var address = data[count][8];
      console.log("GEOCODE REQUEST: ", address);

      // extra data to include in object storage
      var additionalData = {
        count : parseInt(data[count][10])
      };

      // request address to geocode (and include additionalData in output)
      codeAddress(address, additionalData);
    }
    if (count == data.length) {
      console.log(storage);
      // save result to a file
      console.save(storage, "geocoded-data.js");
    }
    count++;
  },2000);
}

// geocode address using Google Maps API
function codeAddress(address, additionalData) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(count, "RESPONSE - LAT: ", results[0].geometry.location.lat(), "LNG: ", results[0].geometry.location.lng());
      var output = {
        location: results[0].geometry.location,
        info: additionalData
      };
      storage.push(output);
    } else {
      console.log('ERROR: Geocode was not successful for the following reason: ' + status);
    }
  });
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
