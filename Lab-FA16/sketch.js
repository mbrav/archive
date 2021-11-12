var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 8000;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var controls, container;
var group;
var sphere;
var pointLight = new THREE.PointLight(0xffaa88);

var clock = new THREE.Clock();

function init() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

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
    camera.position.z = 200;
    camera.rotation.y = -Math.PI/4;
    camera.rotation.x = Math.PI/2;
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
        wireframe: false,
        opacity : 0.8,
        transparent: true
    });
    group = new THREE.Group();
    for (var i = 0; i < 40; i++) {
			for (var j = 0; j < 40; j++) {
				var randomHeight = Math.round(Math.random() * 8);

				for (var z = 0; z < randomHeight; z++) {
					var cube = new THREE.Mesh(geometry, material);
					// cube.position.x = Math.random() * 2000 - 1000;
					// cube.position.y = Math.random() * 2000 - 1000;
					cube.position.x = i * 50 - 1000;
					cube.position.y = j * 50 - 1000;
					cube.position.z = z * 25;
					// cube.scale.z = Math.random() * 30;
					cube.scale.set(Math.random(), Math.random(), 1.0);
					cube.updateMatrix();
					group.add(cube);
				}
			}

    }
}

function createSphere() {
    var radius = 400;
    var segments = 100;
    var rings = 100;
    var sphereMaterial = new THREE.MeshStandardMaterial({
        opacity : 0.8,
        transparent: true,
        color: 0xffffff,
        wireframe: false
    });
    var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // console.log(sphere.geometry.vertices);

}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();
    controls.update(delta);
    renderer.render(scene, camera);
    var d = new Date();
    var n = d.getMilliseconds();
    var skyColor = new THREE.Color(0.9,0.9,0.9);
    renderer.setClearColor(skyColor, 1.0);


    for (var i = 0; i < sphere.geometry.vertices.length; i++) {
      sphere.geometry.vertices[i].x += Math.random() * 30 - 15;
      sphere.geometry.vertices[i].y += Math.random() * 30 - 15;
      sphere.geometry.vertices[i].z += Math.random() * 30 - 15;
    }

    // update the sphere.geometry.vertices
    sphere.geometry.verticesNeedUpdate = true;
    sphere.position.x = Math.sin(d*0.0002) * 1500;
    sphere.position.z = Math.cos(d*0.0002) * 1500;

    pointLight.position.x = sphere.position.x;
    pointLight.position.y = sphere.position.y;
    pointLight.position.z = sphere.position.z;

    for (var i = 0; i < group.children.length; i++) {
      for (var j = 0; j < group.children[i].geometry.vertices.length; j++) {
        group.children[i].geometry.vertices[j].x += Math.random() * 0.02 - 0.01;
        group.children[i].geometry.vertices[j].y += Math.random() * 0.02 - 0.01;
        // group.children[i].geometry.vertices[j].z += Math.random() * 0.1 - 0.05;
      }
      // update the city vertices
      group.children[i].geometry.verticesNeedUpdate = true;
    }

    // console.log(group.children[5].geometry.vertices[2]);

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


init();
animatedRender();
