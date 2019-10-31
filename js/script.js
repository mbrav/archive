// Eviction City
// Michael Braverman © 2019


var renderer, scene, camera;
var particleSystem, uniforms, geometry;

var mouse, raycaster;

var data = evictions;
var dataStatistics = calculateStatistics(data);
var particles = dataStatistics.length;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 300;

	scene = new THREE.Scene();

	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	uniforms = {

		pointTexture: {
			value: new THREE.TextureLoader().load("images/particle.png")
		}

	};

	var shaderMaterial = new THREE.ShaderMaterial({

		uniforms: uniforms,
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent,

		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		vertexColors: true

	});


	var radius = 100;

	geometry = new THREE.BufferGeometry();

	var positions = [];
	var colors = [];
	var sizes = [];

	var color = new THREE.Color();

	for (var i = 0; i < particles; i++) {

		// X
		positions.push(
			mapFunction(
				data[i].lon,
				dataStatistics.lon.min,
				dataStatistics.lon.max,
				0,
				radius
			)
		);

		// Y
		positions.push(
			mapFunction(
				data[i].lat,
				dataStatistics.lat.min,
				dataStatistics.lat.max,
				0,
				radius
			)
		);

		// Z
		positions.push(0);

		// positions.push((Math.random() * 2 - 1) * radius);
		// positions.push((Math.random() * 2 - 1) * radius);
		// positions.push((Math.random() * 2 - 1) * radius);

		color.setHSL(i / particles, 1.0, 0.5);

		colors.push(color.r, color.g, color.b);

		sizes.push(20);

	}

	geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	scene.add(particleSystem);

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', onMouseMove, false );

	// console.log(scene.children);

}

function animate() {

	requestAnimationFrame(animate);

	render();

}

function render() {

	var time = Date.now() * 0.0008;

	particleSystem.rotation.z = 0.1 * time;

	var sizes = geometry.attributes.size.array;

	for (var i = 0; i < particles; i++) {

		// sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
		sizes[i] = 30;

	}

	geometry.attributes.size.needsUpdate = true;

	// raycaster
	renderer.render(scene, camera);

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	for ( var i = 0; i < intersects.length; i++ ) {

		console.log(intersects[ i ]);

		// intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );


}

function calculateStatistics(dat) {

	var dataStats = {
		"length": data.length,
		"lat": {
			"min": 0,
			"max": 0
		},
		"lon": {
			"min": 0,
			"max": 0
		},
		"settings": {
			"lat": {
				"min": 39,
				"max": 41
			},
			"lon": {
				"min": -75.0,
				"max": -73.0
			}
		}
	};

	// calculate max and min values of the data
	for (var i = 0; i < dat.length; i++) {
		if (dataStats.lat.min > dat[i].lat) {
			dataStats.lat.min = dat[i].lat;
		}
		if (dataStats.lat.max < dat[i].lat) {
			dataStats.lat.max = dat[i].lat;
		}
		if (dataStats.lon.min > dat[i].lon) {
			dataStats.lon.min = dat[i].lon;
		}
		if (dataStats.lon.max < dat[i].lon) {
			dataStats.lon.max = dat[i].lon;
		}
	}

	console.log(dataStats);
	return dataStats;

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function onMouseMove(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function mapFunction(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
