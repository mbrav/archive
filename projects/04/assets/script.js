// color colorPallete
var colorPallete = [
	"#464159",
	"#6c7b95",
	"#8bbabb",
	"#c7f0db"
];


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
			$(this).css("background-color", colorPallete[0])
		}, function() {
			$(this).css("background-color", colorPallete[2])
		}
	);
}

function generateModules() {
	var myWrap =  document.getElementById('wrapper');
	var element = document.createElement("div");
	element.className = "module"

	var color = 0;
	var degrees = 0;
	var w = 0;
	var h = 0;

	for (var i = 0; i < 100; i++) {

		w = Math.cos(i/20) * 200 + 500;
		h = Math.cos(i/30) * 20 + 30;

		var module = `
			<div class="module" style="background-color:${colorPallete[0]}">
				<div class="module_child"
					style="
						background-color:${colorPallete[1]};
						transform: rotate(${degrees}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${colorPallete[2]};
						transform: rotate(${degrees + 60}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${colorPallete[3]};
						transform: rotate(${degrees + 120}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${colorPallete[1]};
						transform: rotate(${degrees + 180}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${colorPallete[2]};
						transform: rotate(${degrees + 240}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${colorPallete[3]};
						transform: rotate(${degrees + 300}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
			</div>
		`;

		// myWrap.innerHTML = module;
		// element.insertAdjacentHTML('beforebegin', module);
		document.getElementById('wrapper').innerHTML += module;

		// you can add the addEventListener here

		color ++;
		degrees += 5;
	}
}
