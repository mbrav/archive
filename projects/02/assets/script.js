var loopCount = 0;

init ();

// run until the laws of mathemtics break
while (loopCount < 100) {
	loop ();
}

function init() {
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

	for (var i = 0; i < 400; i++) {

		w = Math.cos(i/20) * 200 + 500;
		h = Math.cos(i/30) * 20 + 30;

		// var module = `
		// 	<div class="module" style="background-color:rgb(255,255,255)">
		// 	<p> i = ${i}, color = ${color}, w = ${w}, h = ${h}, deg = ${degrees}</p>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(${(Math.cos(i/100) * 255 + 100)},0,0);
		// 				transform: rotate(${degrees}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(0,${(Math.cos(i/100) * 255 + 100)},0);
		// 				transform: rotate(${degrees + 60}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(0,0,${(Math.cos(i/100) * 255 + 100)});
		// 				transform: rotate(${degrees + 120}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(${(Math.cos(i/100) * 255 + 100)},0,0);
		// 				transform: rotate(${degrees + 180}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(0,${(Math.cos(i/100) * 255 + 100)},0);
		// 				transform: rotate(${degrees + 240}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 		<div class="module_child"
		// 			style="
		// 				background-color:rgb(0,0,${(Math.cos(i/100) * 255 + 100)});
		// 				transform: rotate(${degrees + 300}deg);
		// 				width: ${w}px;
		// 				height: ${h}px;">
		// 		</div>
		// 	</div>
		// `;

		var module = `
			<div class="module" style="background-color:${pallete[0]}">
				<div class="module_child"
					style="
						background-color:${pallete[1]};
						transform: rotate(${degrees}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${pallete[2]};
						transform: rotate(${degrees + 60}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${pallete[3]};
						transform: rotate(${degrees + 120}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${pallete[1]};
						transform: rotate(${degrees + 180}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
					style="
						background-color:${pallete[2]};
						transform: rotate(${degrees + 240}deg);
						width: ${w}px;
						height: ${h}px;">
				</div>
				<div class="module_child"
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
	}
}

function loop() {
	var mod = document.getElementsByClassName('module');

	for (var i = 0; i < mod.length; i++) {
		for (var j = 0; j < mod[i].children.length; j++) {
			// console.log(mod[i].children[j].offsetWidth);
			// console.log(mod[5].children[1].offsetHeight);
			mod[i].children[j].style.transform = loopCount + "deg";
			// console.log(numbers[0]);
		}
	}
	// console.log(mod);
	loopCount ++;
}
