if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer, controls;

var clock = new THREE.Clock();

init();
animate();

var control, group1, group2, group3, group4, group5, group6, group7, group8, group9, group10;

// hover objects from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
var raycaster, mouse, INTERSECTED;


function init() {

  container = document.getElementById('container');

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();


  // controls
  parameters = {
    visible1: true,
    visible2: true,
    visible3: true,
    visible4: true,
    visible5: true,
    visible6: true,
    visible7: true,
    visible8: true,
    visible9: true,
    visible10: true
  };

  var gui = new dat.GUI();

  gui.add(parameters, 'visible1').name("Biologist").listen().onChange(function(value) {
    group1.visible = value;
  });
  gui.add(parameters, 'visible2').name("Chemists").listen().onChange(function(value) {
    group2.visible = value;
  });
  gui.add(parameters, 'visible3').name("ClimateScientists").listen().onChange(function(value) {
    group3.visible = value;
  });
  gui.add(parameters, 'visible4').name("ComputerScientists").listen().onChange(function(value) {
    group4.visible = value;
  });
  gui.add(parameters, 'visible5').name("Cosmologists").listen().onChange(function(value) {
    group5.visible = value;
  });
  gui.add(parameters, 'visible6').name("Geneticists").listen().onChange(function(value) {
    group6.visible = value;
  });
  gui.add(parameters, 'visible7').name("Geophysicists").listen().onChange(function(value) {
    group7.visible = value;
  });
  gui.add(parameters, 'visible8').name("Logicians").listen().onChange(function(value) {
    group8.visible = value;
  });
  gui.add(parameters, 'visible9').name("Physicists").listen().onChange(function(value) {
    group9.visible = value;
  });
  gui.add(parameters, 'visible10').name("Statisticians").listen().onChange(function(value) {
    group10.visible = value;
  });


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 3000);

  controls = new THREE.TrackballControls(camera);

  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2(0xaaaaaa, 0.0025);

  var group1 = createCube(biologist, getRandomColor(), 0);
  var group2 = createCube(chemists, getRandomColor(), 1);
  var group3 = createCube(climate_scientists, getRandomColor(), 2);
  var group4 = createCube(computer_scientists, getRandomColor(), 3);
  var group5 = createCube(cosmologists, getRandomColor(), 4);
  var group6 = createCube(geneticists, getRandomColor(), 5);
  var group7 = createCube(geophysicists, getRandomColor(), 6);
  var group8 = createCube(logicians, getRandomColor(), 7);
  var group9 = createCube(physicists, getRandomColor(), 8);
  var group10 = createCube(statisticians, getRandomColor(), 9);

  // console.log(cosmologists);
  // scene.add(group1);
  scene.add(group1, group2, group3, group4, group5, group6, group7, group8, group9, group10);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);

  window.requestAnimationFrame(render);

  // for selecting objects
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setClearColor(0xeeeeee);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createCube(data, shapeColor, offset) {

  var group = new THREE.Group();
  for (var i = 0; i < data.length; i++) {

    // data
    var birth = new Date(data[i].FIELD3);
    var death = new Date(data[i].FIELD4);

    // geometry
    var cube = new THREE.Mesh(
      new THREE.BoxGeometry(10, death.getFullYear() - birth.getFullYear(), parseFloat(data[i].FIELD5) / 1000),
      new THREE.MeshStandardMaterial({
        color: shapeColor,
        emissive: shapeColor,
        emissiveIntensity: 1,
        // color: colorr.offsetHSL((death.getFullYear() - birth.getFullYear())/600, 1., 1. ),
        // wireframe: false,
        opacity: .8,
        transparent: true
      })
    );

    cube.position.x = i * 3 - data.length / 2 * 3;
    cube.position.y = death.getFullYear() - 1700;
    cube.position.z = offset * 100;

    // cube.scale.z = Math.random() * 30;
    // cube.scale.set(Math.random(), Math.random(), 1.0);
    // cube.scale.set(0.4, 0.4, 0.4);
    cube.updateMatrix();
    group.add(cube);
  }

  return group;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  // control.handleResize();
}

function onMouseMove(event) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function animate() {

  camera.lookAt(scene.position);

  camera.updateMatrixWorld();

  // for (var i = 0; i < line.geometry.vertices.length; i++) {
  //   line.geometry.vertices[i].x = Math.cos(i/12) * 42 * clock.getDelta(scene.position);
  //   line.geometry.vertices[i].y = Math.cos(i/22) * 42 * clock.getDelta(scene.position);
  //   line.geometry.vertices[i].z = Math.cos(i/12) * 42 * clock.getDelta(scene.position);
  // }

  controls.update();

  requestAnimationFrame(animate);

  // RENDER
  render();

}

function render() {
  var delta = clock.getDelta(scene.position);

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object.parent) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      // console.log(intersects[0].object);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff0000);
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }

  renderer.render(scene, camera);
}
