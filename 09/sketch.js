if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer,controls, container, clock;
var pointLight, pointLight2, pointLight3;

// settings for the rings
var ringGroups = [];
var ringSettings = [];
var ringsNum = 14;

init();
animatedRender();

function init() {
  var viewAngle = 75;
  var aspectRatio = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 4000;
  camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
  camera.position.z = 800;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  pointLight = new THREE.PointLight();
  pointLight2 = new THREE.PointLight();
  pointLight3 = new THREE.PointLight();

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  controls = new THREE.FlyControls( camera );
  controls.movementSpeed = 100;
	controls.domElement = container;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;

  createSpheres();

  scene.add(camera);
  scene.add(pointLight, pointLight2, pointLight3);
  scene.fog = new THREE.Fog(0xffffff, near, 800);

  audio_player.src = 'http://mbrav.github.io/audio/la1.mp3';
  audio_player.play();
}

function createSpheres() {
  var radius = 20;
  var segments = 20;
  var rings = 20;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);

  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    wireframe: true
  });

  for (var j = 0; j < ringsNum; j++) {
    var group = new THREE.Object3D();
    for (var i = 0; i < 24; i++) {
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = Math.cos(2 * Math.PI / 24 * i) * 80*(j+2.0);
      sphere.position.y = Math.sin(2 * Math.PI / 24 * i) * 80*(j+2.0);

      sphere.scale.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

      // add aphere to a ring
      group.add(sphere);
    }
    // add ring to the ring group
    ringGroups[j] = group;
  }

  // generate random settings for each ring
  for (var i = 0; i < ringGroups.length; i++) {
    scene.add(ringGroups[i]);
    ringSettings.push({
      // for rings
      rotationX : 0.002 * Math.random(),
      rotationY : 0.002 * Math.random(),
      rotationZ : 0.0002 * Math.random(),
      // for shapes inside the rings
      childrenRotationX: 0.02 * Math.random(),
      childrenRotationY: 0.02 * Math.random(),
      childrenRotationZ: 0.02 * Math.random(),
    });
  }

}

function animatedRender() {
  requestAnimationFrame(animatedRender);
  var delta = clock.getDelta();
  controls.update(delta);

  var d = new Date();
  var n = d.getTime();

  pointLight.position.x = Math.cos(2 * Math.PI / 24 * n / 1000) * 300;
  pointLight.position.y = Math.sin(2 * Math.PI / 24 * n / 1000) * 300;
  pointLight.color.setHSL(Math.sin(n / 1345), 1, 0.6512);

  pointLight2.position.x = Math.cos(2 * Math.PI / 24 * n / 1000 + Math.PI / 1.5) * 300;
  pointLight2.position.y = Math.sin(2 * Math.PI / 24 * n / 1000 + Math.PI / 1.5) * 300;
  pointLight2.color.setHSL(Math.sin(n / 1345 + Math.PI / 1.5), 1, 0.6512);

  pointLight3.position.x = Math.cos(2 * Math.PI / 24 * n / 1000 + Math.PI / 1.5 * 2) * 300;
  pointLight3.position.y = Math.sin(2 * Math.PI / 24 * n / 1000 + Math.PI / 1.5 * 2) * 300;
  pointLight3.color.setHSL(Math.sin(n / 1345 + Math.PI / 1.5 * 2), 1, 0.6512);

  for (var j = 0; j < ringsNum; j++) {
    if (j%2 == 0) {
      ringGroups[j].rotation.x += ringSettings[j].rotationX;
      ringGroups[j].rotation.y += ringSettings[j].rotationY;
      ringGroups[j].rotation.z += ringSettings[j].rotationZ;
    } else {
      ringGroups[j].rotation.x -= ringSettings[j].rotationX;
      ringGroups[j].rotation.y -= ringSettings[j].rotationY;
      ringGroups[j].rotation.z -= ringSettings[j].rotationZ;
    }

    for (var i = 0; i < 24; i++) {
        ringGroups[j].children[i].rotation.x += ringSettings[j].childrenRotationX;
        ringGroups[j].children[i].rotation.y += ringSettings[j].childrenRotationY;
        ringGroups[j].children[i].rotation.z += ringSettings[j].childrenRotationZ;
    }
  }

  // var skyColor = new THREE.Color(Math.sin(n * 0.0003) + 0.4, Math.cos(n * 0.0001) + 0.4, Math.sin(n * 0.0002) + 0.4);
  var skyColor = new THREE.Color(0xffffff);
  renderer.setClearColor(skyColor, 1.0);
  renderer.render(scene, camera);

}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
