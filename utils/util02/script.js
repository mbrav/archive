var geocoder;
var map;

init();

var storage = [];
var count = 0;

setInterval(function(){
  count++;
  if (count < farmerMarkets.length) {
    console.log("REQUEST: ", farmerMarkets[count][10]);
    var address = farmerMarkets[count][10] + ", " + farmerMarkets[count][8] + ", " + "NY";
    codeAddress(address);
  }
  if (count == farmerMarkets.length) {
    console.log(storage);
    // save result to a file
    console.save(storage, "data.js");
  }
},1020);

function displayDataInfo() {
  console.log("Lenght: " + farmerMarkets.length);
  for (var i = 0; i < farmerMarkets.length; i++) {
    var address = farmerMarkets[i][10] + ", " + farmerMarkets[i][8] + ", " + "NY";
    console.log(address);
  }
}

function init() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 13,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function codeAddress(address) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(count, "LAT: ", results[0].geometry.location.lat(), "LNG: ", results[0].geometry.location.lng());
      storage.push( results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// HACK: console save function
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
