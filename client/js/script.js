if (!Detector.webgl) Detector.addGetWebGLMessage();

// socket
var socket = io();
var userId; // user id

var camera,scene,renderer;
var light;

// player geomteries
var players = [];

// fly over control
var controls;
var clock = new THREE.Clock();

// fetch other player positions
socket.on('newPositions', function(data){
  // set the positions of all other players
  for (var i = 0; i < data.length; i++) {
    players[i].sphere.position.x = data[i].x;
    players[i].sphere.position.y = data[i].y;
    players[i].sphere.position.z = data[i].z + 20; // avoid the cube getting into the view
  }
});

// send positions to the server at a regular interval
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
  // create scene
  scene = new THREE.Scene();

  // camera setup
  var viewAngle = 75;
  var aspectRatio = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 40000;
  camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);

  // createPlayers
  for (var i = 0; i < 99; i++) {
    createPlayers();
  }

  // lights
  light = new THREE.DirectionalLight( 0xffffff, 2);
  light.position.x = 10;
  light.position.y = 50;
  light.position.z = 130;

  // eviornment
  var skyColor = new THREE.Color(0.8, 0.8, 0.8);
  renderer.setClearColor(skyColor, 1.0);

  // fly controls
  controls = new THREE.FlyControls( camera );
  controls.movementSpeed = 100;
  controls.domElement = container;
  controls.rollSpeed = 0.3;
  controls.autoForward = false;
  controls.dragToLook = false;

  // add everyhting to the scene
  scene.add(light);
  scene.add(camera);

  camera.position.x = Math.random() * 100;
  camera.position.y = Math.random() * 100;
  camera.position.z = Math.random() * 100;

  userId = Math.random();

  // send player settings
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
  var radius = 5;
  var segments = 20;
  var rings = 20;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);

  var color = {
    r: Math.floor(Math.random() * 100) + 155,
    g: Math.floor(Math.random() * 100) + 155,
    b: Math.floor(Math.random() * 100) + 155,
    a: Math.random()
  };

  var material = new THREE.MeshStandardMaterial({
    color: 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')',
    wireframe: false
  });

  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  sphere.position.x = Math.random() * 200;
  sphere.position.y = Math.random() * 200;
  sphere.position.z = Math.random() * 200 - 200;

  // add to array of players
  players.push({
    sphere
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
