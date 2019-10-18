// data display
var scale = 150; //   scale/n
var maxXcordinate = 0;
var minXcordinate = 999999999;
var maxYcordinate = 0;
var minYcordinate = 999999999;
var middleX;
var middleY;

var w = window.innerWidth;
var h = window.innerHeight;

console.log(graffitData.length);

var loopCount = 0;

init ();

// run until the laws of mathemtics break
// while (1 < 2) {
// 	loop ();
// }

function init() {
	generateModules();
	selectModules();
}

function loop() {
	loopCount ++;
}

function selectModules() {
	var modules = $(".module_child");

	$(".module_child").hover(
		function() {
			$(this).css("background-color", "black")
		}, function() {
			$(this).css("background-color", "white")
		}
	);
}



function generateModules() {
	var myWrap =  document.getElementById('wrapper');
	var element = document.createElement("div");
	element.className = "module";

	var numberOfPoints = 1000;

	  // calculate statistics
	for (var i = 0; i < numberOfPoints; i++) {
		if (maxXcordinate < parseInt(graffitData[i][1])) {
			maxXcordinate = parseInt(graffitData[i][1]);
		}
		if (minXcordinate > parseInt(graffitData[i][1])) {
			minXcordinate = parseInt(graffitData[i][1]);
		}
		if (maxYcordinate < parseInt(graffitData[i][2])) {
			maxYcordinate = parseInt(graffitData[i][2]);
		}
		if (minYcordinate > parseInt(graffitData[i][2])) {
			minYcordinate = parseInt(graffitData[i][2]);
		}
	}

	middleX = maxXcordinate - minXcordinate;
	middleY = maxYcordinate - minYcordinate;

	console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
	console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);
	console.log("middleX", minYcordinate, "middleY", maxYcordinate);


	for (var i = 0; i < numberOfPoints; i++) {

		var posX = parseInt(((graffitData[i][1] - minXcordinate))/scale);
		var posY = h-parseInt(((graffitData[i][2] - minYcordinate))/scale);


		var module = `
			<div class="module">
				<div class="module_child"
					style="
					left: ${posX}px;
					top: ${posY}px;
					">
				</div>
			</div>
		`;

		document.getElementById('wrapper').innerHTML += module;

	}
}
