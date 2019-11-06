// Eviction City
// Michael Braverman © 2019

import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

var renderer, scene, camera, controls;
var particleSystem, uniforms, geometry;

var mouse, raycaster;

var data = evictions, dataStatistics, particles;

init();

function init() {

	dataStatistics = calculateStatistics(data);
	particles = dataStatistics.length;

	// size of the area
	var radius = 200;
	var xOffset = -150;
	var yOffset = 0;
	var zOffset = -100;

	geometry = new THREE.BufferGeometry();

	var positions = [];
	var colors = [];
	var sizes = [];

	var color = new THREE.Color();

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.set(0, 200, 0);

	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 500;
	controls.maxPolarAngle = Math.PI / 2;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5; // fps

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

	for (var i = 0; i < particles; i++) {

		// X
		positions.push(
			mapFunction(
				clamp(
					data[i].lon,
					dataStatistics.settings.lon.min,
					dataStatistics.settings.lon.max
				),
				dataStatistics.settings.lon.min,
				dataStatistics.settings.lon.max,
				0,
				radius
			) + xOffset
		);

		// Y
		positions.push(yOffset);

		// Z
		positions.push(
			mapFunction(
				clamp(
					data[i].lat,
					dataStatistics.lat.min,
					dataStatistics.lat.max
				),
				dataStatistics.settings.lat.min,
				dataStatistics.settings.lat.max,
				0,
				radius
			) + zOffset
		);

		color.setHSL(i / particles, 1.0, 0.5);

		colors.push(color.r, color.g, color.b);

		sizes.push(3);

	}

	geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true));

	particleSystem = new THREE.Points(geometry, shaderMaterial);

	scene.add(particleSystem);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', onMouseMove, false );

	animate();

}

function animate() {

	requestAnimationFrame(animate);

	render();
	controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

}

function render() {

	var time = Date.now() * 0.0008;

	// particleSystem.rotation.z = 0.1 * time;

	var sizes = geometry.attributes.size.array;

	for (var i = 0; i < particles; i++) {

		// sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
		// sizes[i] = 30;

	}

	geometry.attributes.size.needsUpdate = true;

	// raycaster
	renderer.render(scene, camera);

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	// Just chose first interesect rather than iterating throught all of them
	if (intersects[0] != null) {
		// console.log(intersects[0]);

		// intersects[ i ].object.material.color.set( 0xff0000 );
		$("#info #name").html(data[intersects[0].index].first_name + " " + data[intersects[0].index].last_name);
		$("#info img").attr("src", data.FIELD2);
		$("#info #date span").html(data[intersects[0].index].date);
		$("#info #lon span").html(data[intersects[0].index].lon);
		$("#info #lat span").html(data[intersects[0].index].lat);
		$("#info").show();
	}

	renderer.render( scene, camera );

}

function calculateStatistics(dat) {

	var dataStats = {
		"length": data.length,
		"lat": {
			"min": 0,
			"max": 0,
			"avg": 0
		},
		"lon": {
			"min": 0,
			"max": 0,
			"avg": 0
		},
		"settings": {
			"lat": {
				"min": 40.45,
				"max": 40.9
			},
			"lon": {
				"min": -74.3,
				"max": -73.75
			}
		}
	};

	var goodDataIndexCount = 0, latCount = 0.0, lonCount = 0.0; // stat shit
	// calculate max, min and avg values of the data
	for (var i = 0; i < dat.length; i++) {

		// min, max, even for bad data
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

		// count good data
		if (dataStats.settings.lat.min < dat[i].lat || dataStats.settings.lat.max > dat[i].lat || dataStats.settings.lon.min < dat[i].lon || dataStats.settings.lon.max > dat[i].lon) {
			// count as good index
			goodDataIndexCount ++;
			// add to average count
			latCount = parseFloat(dat[i].lat);
			lonCount = parseFloat(dat[i].lon);
		} else {
			console.log("bad data");
		}
	}

	console.log(latCount, lonCount);

	// divide it up to get average
	latCount = latCount/goodDataIndexCount;
	lonCount = lonCount/goodDataIndexCount;
	//save into stats
	dataStats.lat.avg = latCount;
	dataStats.lon.avg = lonCount;



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

// Useful Math functions

function mapFunction(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}
