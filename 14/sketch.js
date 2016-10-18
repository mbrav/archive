var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 4000;
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var cube;
var group;
var sphere;
var pointLight = new THREE.PointLight(0xFFFFFF);
var mouseX = 0;
var mouseY = 0;

function init() {

  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  createCube();

  scene.add(group);
  scene.add(sphere);
  scene.add(pointLight);
  camera.position.z = 300;
  scene.add(camera);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function createCube() {
  var radius = 50;
  var segments = 4;
  var rings = 4;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);
  for (var i = 0; i < geometry.faces.length; i += 2) {
    // var hex = Math.random()+0.5 * 0xCCCCCC;
    var hex = 0xCCCCCC + i / geometry.faces.length;
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

function animatedRender() {
  requestAnimationFrame(animatedRender);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  console.log("mouseX: " + mouseX);
  console.log("mouseY: " + mouseY);
  camera.rotation.y -= (mouseX - camera.position.x) * 0.00005;
  camera.rotation.x += (-mouseY - camera.position.y) * 0.0001;

  var d = new Date();
  var n = d.getMilliseconds();
  console.log(n);
  var skyColor = new THREE.Color(Math.sin(n * 0.0003) + 0.4, Math.cos(n * 0.0001) + 0.4, Math.sin(n * 0.0002) + 0.4);
  renderer.setClearColor(skyColor, 1.0);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2);
  mouseY = (event.clientY - window.innerHeight / 2);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

document.onkeypress = function(evt) {
  evt = evt || window.event;
  var charCode = evt.keyCode || evt.which;
  var charStr = String.fromCharCode(charCode);

  if (charStr == "w" || charStr == "W") {
    camera.position.z -= 10.0;
  }
  if (charStr == "s" || charStr == "S") {
    camera.position.z += 10.0;
  }
  if (charStr == "a" || charStr == "A") {
    camera.position.x -= 10.0;
  }
  if (charStr == "d" || charStr == "D") {
    camera.position.x += 10.0;
  }
};

init();
animatedRender();
