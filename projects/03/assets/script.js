


// run until the laws of mathemtics break
// while (loopCount < 100) {
// 	loop ();
// }

var myWrap =  document.getElementById('wrapper');
var element = document.createElement("div");
element.className = "module"

// color pallete
var pallete = [
	"#464159",
	"#6c7b95",
	"#8bbabb",
	"#c7f0db"
];

var color = 0;
var degrees = 0;
var w = 0;
var h = 0;

var i = 0;

init ();

var myInterval = setInterval(appendFunc, 500);

function init() {
	// setInterval(appendFunc, 200);

	setTimeout( function(){
		clearInterval(myInterval)
	}, 20000);
}


function appendFunc() {

		console.log("test!");

		w = Math.cos(i/20) * 200 + 500;
		h = Math.cos(i/30) * 20 + 30;

		var module = `
			<div class="module" style="background-color:${pallete[0]}">
				<div class="module_child" id="module-${i}-0"
					style="
						background-color:${pallete[1]};
						transform: rotate(${degrees}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child" id="module-${i}-1"
					style="
						background-color:${pallete[2]};
						transform: rotate(${degrees + 60}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child" id="module-${i}-2"
					style="
						background-color:${pallete[3]};
						transform: rotate(${degrees + 120}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child" id="module-${i}-3"
					style="
						background-color:${pallete[1]};
						transform: rotate(${degrees + 180}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child" id="module-${i}-4"
					style="
						background-color:${pallete[2]};
						transform: rotate(${degrees + 240}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child" id="module-${i}-5"
					style="
						background-color:${pallete[3]};
						transform: rotate(${degrees + 300}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
			</div>
		`;

		// myWrap.innerHTML = module;
		// element.insertAdjacentHTML('beforebegin', module);
		document.getElementById('wrapper').innerHTML += module;

		color ++;
		degrees += 5;
		i++;

		// if(i >= 10){ // defining the maximum amount of cycles
		// 	console.log("we're done!");
		// 	clearInterval(myInterval);
		// }
}
