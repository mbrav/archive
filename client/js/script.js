if (!Detector.webgl) Detector.addGetWebGLMessage();

// socket
var socket = io();
var userId; // user id

var camera,scene,renderer;
var pointLight;

// player geomteries
var players = [];

// fly over control
var controls;
var clock = new THREE.Clock();

// fetch other player positions
socket.on('newPositions', function(data){
  // draw players
  for (var i = 0; i < data.length; i++) {
    players[i].cube.position.x = data[i].x;
    players[i].cube.position.y = data[i].y;
    players[i].cube.position.z = data[i].z + 20; // avoid the cube getting into the view
  }
});

// send postions
setInterval(function(){
  if (userId != null) {
    socket.emit('playerPosition', {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      id: userId
    });
  }
}, 30);

init();
animatedRender();

function init() {

  // renderer setup
  renderSetup();

  // camera setup
  var viewAngle = 75;
  var aspectRatio = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 40000;
  camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);

  // create scene
  scene = new THREE.Scene();

  // createPlayers
  for (var i = 0; i < 99; i++) {
    createPlayers();
  }

  // lights
  pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // eviornment
  var skyColor = new THREE.Color(0.4, 0.5, 0.3);
  renderer.setClearColor(skyColor, 1.0);

  // fly controls
  controls = new THREE.FlyControls( camera );
  controls.movementSpeed = 100;
  controls.domElement = container;
  controls.rollSpeed = 0.3;
  controls.autoForward = false;
  controls.dragToLook = false;

  // add everyhting to the scene
  scene.add(pointLight);
  scene.add(camera);

  camera.position.x = Math.random() * 100;
  camera.position.y = Math.random() * 100;
  camera.position.z = Math.random() * 100;

  userId = Math.random();

  // send player object
  socket.emit('settings', {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    id:userId
  });
}

function animatedRender() {
  // update time
  var d = new Date();
  var t = d.getMilliseconds();

  // render
  requestAnimationFrame(animatedRender);
  renderer.render(scene, camera);

  // fly over control
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}

function createPlayers() {
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshStandardMaterial({
    color: 0xCCAA00,
    wireframe: false
  });

  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = Math.random() * 100;
  cube.position.y = Math.random() * 100;
  cube.position.z = Math.random() * 100 - 200;

  // add to array of players
  players.push({
    cube
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function renderSetup() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}
