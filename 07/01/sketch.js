// Wiki Faces
// Created by Michael Braverman on March 13, 2017
//
// MIT License
// Copyright (c) 2017 Michael G. Braverman

if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, camera, scene, renderer, clock;

var group1, group2, group3, group4, group5, group6, group7, group8, group9, group10;
var control, raycaster, mouse, INTERSECTED;

init();
animate();

function init() {

  container = document.getElementById('container');

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 3000);
  controls = new THREE.TrackballControls(camera);
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xaaaaaa, 0.001);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.requestAnimationFrame(render);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setClearColor(0xeeeeee);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  var group1 = createCubeGroup(biologist, getRandomColor(), 0);
  var group2 = createCubeGroup(chemists, getRandomColor(), 1);
  var group3 = createCubeGroup(climate_scientists, getRandomColor(), 2);
  var group4 = createCubeGroup(computer_scientists, getRandomColor(), 3);
  var group5 = createCubeGroup(cosmologists, getRandomColor(), 4);
  var group6 = createCubeGroup(geneticists, getRandomColor(), 5);
  var group7 = createCubeGroup(geophysicists, getRandomColor(), 6);
  var group8 = createCubeGroup(logicians, getRandomColor(), 7);
  var group9 = createCubeGroup(physicists, getRandomColor(), 8);
  var group10 = createCubeGroup(statisticians, getRandomColor(), 9);

  scene.add(group1, group2, group3, group4, group5, group6, group7, group8, group9, group10);

  // GUI controls
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
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// creates a cube with data inside
function createCubeGroup(data, shapeColor, offset) {

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

    cube.data = data[i];

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
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff0000);
      var data = INTERSECTED.data;
      // console.log(data.FIELD1, "Born: " + data.FIELD3, "Died: " + data.FIELD4, "Words on Wiki: " + data.FIELD5);

      // set info about the person
      $("#info #name").html(data.FIELD1);
      $("#info img").attr("src", data.FIELD2);
      $("#info #birth span").html(data.FIELD3);
      $("#info #birth span").html(data.FIELD3);
      $("#info #death span").html(data.FIELD4);
      $("#info #words span").html(data.FIELD5);
      $("#info").show();

    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;

    // hide the info box
    $("#info").hide();

  }

  renderer.render(scene, camera);
}
