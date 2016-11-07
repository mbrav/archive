if (!Detector.webgl) Detector.addGetWebGLMessage();

// socket
var socket = io();
var userId; // user id

// var camera,scene,renderer;
var light;

// player geomteries
var players = [];

// fly over control
var controls;
var clock = new THREE.Clock();

var thisPlayer = {
  color : {
    r: Math.floor(Math.random() * 100) + 155,
    g: Math.floor(Math.random() * 100) + 155,
    b: Math.floor(Math.random() * 100) + 155,
    a: 1
  }
};

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
  var near = 5.2; // set to the radius of the balls to avoid flcikering
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
  controls.movementSpeed = 40;
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
    id:userId,
    color: {
      r: thisPlayer.color.r,
      g: thisPlayer.color.g,
      b: thisPlayer.color.b,
      a: thisPlayer.color.a
    }
  });
}

function animatedRender() {
  // update time
  var d = new Date();
  var t = d.getMilliseconds();

  // wiggle wiggle <--
  for (var i = 0; i < players.length; i++) {
    for (var j = 0; j < players[i].sphere.geometry.vertices.length; j++) {
      var initValues = players[i].sphere.initValues;

      players[i].sphere.geometry.vertices[j].x = initValues.x + Math.random()*10 - 5;
      players[i].sphere.geometry.vertices[j].y = initValues.y + Math.random()*10 - 5;
      // players[i].sphere.geometry.vertices[j].y = initValues.y + Math.random()*2 - 1;
      // players[i].sphere.geometry.vertices[j].z += Math.random() * 0.1 - 0.05;
    }
    players[i].sphere.geometry.verticesNeedUpdate = true;
  }


  // render
  requestAnimationFrame(animatedRender);
  renderer.render(scene, camera);

  // fly over control
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}

// fetch other player positions
socket.on('newPositions', function(data){
  // set the positions of all other players
  for (var i = 0; i < data.length; i++) {

    // update player positions
    players[i].sphere.position.x = data[i].x;
    players[i].sphere.position.y = data[i].y;
    players[i].sphere.position.z = data[i].z;

    players[i].sphere.material.emissive = new THREE.Color(
      "rgba(" + data[i].color.r + "," + data[i].color.g + "," + data[i].color.b + "," + data[i].color.a + ")"
    );
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

function createPlayers() {
  var radius = 5;
  var segments = 20;
  var rings = 20;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);

  var material = new THREE.MeshStandardMaterial({
    color: 0x555555,
    wireframe: false
  });

  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  sphere.position.x = Math.random() * 200;
  sphere.position.y = Math.random() * 200;
  sphere.position.z = Math.random() * 200 - 200;

  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    // keep track of the initial generate values
    sphere.initValues = {
      x : sphere.geometry.vertices[i].x,
      y : sphere.geometry.vertices[i].y,
      z : sphere.geometry.vertices[i].z,
    };
  }

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
