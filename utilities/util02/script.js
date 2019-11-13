var geocoder;
var map;

// specify data variable based on the .js file included in the .html
var data = evictions;

// new object storage
var storage = [];

// keep count, useful once requests become exausted
var count = 35110;
var start_count = count;

init();

function init() {

	objectSaveHackInit(); // the big boy
	getDataInfo();
	startGeocoding(); // another big boy
}

function getDataInfo() {
	console.log("Data Length: " + data.length);
}

function startGeocoding() {
	setInterval(function() {
		if (count < data.length) {

      var request = data[count];

      console.log("GEOCODE REQUEST FOR ", count, ": ", request);

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": encodeURI("https://us1.locationiq.com/v1/search.php?key=pk.3b4a08769fbd2a9d62d5844fd1539ca2&q="
        + request.address
        + ", "
        + request.zip
        + ", "
        + request.borough
        + ", NY, USA"
        + "&format=json"),
        "method": "GET"
      }

      $.ajax(settings).done(function(response) {
        console.log("GEOCODE RESPONSE: ", response[0]);
        var output = {
          lon: response[0].lon,
          lat: response[0].lat,
          date: data[count].date,
          first_name: data[count].first_name,
          last_name: data[count].last_name
        };

        storage.push(output);

      });

			count++;

		}

    // save file once it is finished
		if (count == data.length) {
			console.log(storage);
			// save result to a file
			console.save(storage, "geocoded-data.js");
		}
	}, 1100);
}


// HACK: console save file function
// allows to save an object file
// console.save(yourObject, "yourFileName.js");
function objectSaveHackInit() {
	(function(console) {

		console.save = function(data, filename) {

			if (!data) {
				console.error('Console.save: No data')
				return;
			}

			if (!filename) filename = 'console.json'

			if (typeof data === "object") {
				data = JSON.stringify(data, undefined, 4)
			}

			var blob = new Blob([data], {
					type: 'text/json'
				}),
				e = document.createEvent('MouseEvents'),
				a = document.createElement('a')

			a.download = filename
			a.href = window.URL.createObjectURL(blob)
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
			e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
			a.dispatchEvent(e)
		}
	})(console)
}
