var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 4000;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var cube, controls, container;
var group;
var sphere;
var pointLight = new THREE.PointLight(0xFFFFFF);

var clock = new THREE.Clock();

function init() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 100;
  	controls.domElement = container;
  	controls.rollSpeed = 0.2;
  	controls.autoForward = false;
  	controls.dragToLook = false;

    createCube();
    createSphere();

    scene.add(group);
    scene.add(sphere);
    scene.add(pointLight);
    camera.position.z = 300;
    scene.add(camera);
}

function createCube() {
    var geometry = new THREE.BoxGeometry(30, 30, 30);
    for (var i = 0; i < geometry.faces.length; i += 2) {
        // var hex = Math.random()+0.5 * 0xCCCCCC;
        var hex =  0xCCCCCC + i/geometry.faces.length;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
    }
    var material = new THREE.MeshStandardMaterial({
        vertexColors: THREE.FaceColors,
        wireframe: false
    });
    group = new THREE.Group();
    for (var i = 0; i < 40; i++) {
			for (var j = 0; j < 40; j++) {
				var randomHeight = Math.round(Math.random() * 10);

				for (var z = 0; z < randomHeight; z++) {
					cube = new THREE.Mesh(geometry, material);
					// cube.position.x = Math.random() * 2000 - 1000;
					// cube.position.y = Math.random() * 2000 - 1000;
					cube.position.x = i * 50 - 1000;
					cube.position.y = j * 50 - 1000;
					cube.position.z = z * 25 - 500;
					// cube.scale.z = Math.random() * 30;
					cube.scale.set(Math.random(), Math.random(), 1.0);
					cube.updateMatrix();
					group.add(cube);
				}
			}

    }

    console.log(group);
}

function createSphere() {
    var radius = 50;
    var segments = 4;
    var rings = 4;
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xCCCCCC,
        wireframe: false
    });
    var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 200;
}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();
    controls.update(delta);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    var d = new Date();
    var n = d.getMilliseconds();
    var skyColor = new THREE.Color(Math.sin(n*0.0003) + 0.4, Math.cos(n*0.0001) + 0.4, Math.sin(n*0.0002) + 0.4);
    renderer.setClearColor(skyColor, 1.0);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


init();
animatedRender();
