var camera, scene,renderer;
var cube,group;
var pointLight;

// data file
var data;
var scale = 0.006; //   scale/n

// data statistics
var maxXcordinate = 0;
var minXcordinate = 999999999;
var maxYcordinate = 0;
var minYcordinate = 999999999;
var middleX;
var middleY;

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {

    // specify the dataFile
    data = farmerMarketsCords;

    var viewAngle = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 10000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    console.log("Lenght: " + data.length);
    for (var i = 0; i < data.length; i++) {
      var locations = data[i];
      // console.log(locations);
    }

    // calculate statistics
    for (var i = 0; i < data.length; i++) {
      if (maxXcordinate > data[i].lng) {
        maxXcordinate = data[i].lng;
      }
      if (minXcordinate > data[i].lng) {
        minXcordinate = data[i].lng;
      }
      if (maxYcordinate < data[i].lat) {
        maxYcordinate = data[i].lat;
      }
      if (minYcordinate > data[i].lat) {
        minYcordinate = data[i].lat;
      }
    }

    middleX = maxXcordinate - minXcordinate;
    middleY = maxYcordinate - minYcordinate;

    console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
    console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);

    // light
    pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.z = 10;
    camera.position.z = -100;
    camera.rotation.x = Math.PI;
    camera.rotation.z = -Math.PI/2;

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 40;
    controls.domElement = container;
    controls.rollSpeed = 0.3;
    controls.autoForward = false;
    controls.dragToLook = false;

    // fog and background
    scene.fog = new THREE.Fog(0xffffff, near, 600);
    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);

    // create geometries
    createCubes();
    createLines();

    camera.position.x = group.children[50].position.x;
    camera.position.y = group.children[50].position.y;

    scene.add(group);
    scene.add(pointLight);
    scene.add(camera);
}


function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();
    controls.update(delta);

    renderer.render(scene, camera);

}

function createCubes() {

  var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    wireframe: false
  });
  group = new THREE.Group();

  for (var i = 0; i < data.length; i++) {

    cube = new THREE.Mesh(geometry, material);
    cube.position.x = (data[i].lat - minXcordinate)/scale;
    cube.position.y = (data[i].lng - minYcordinate)/scale;
    cube.position.z = 0;

    // cube.updateMatrix();
    group.add(cube);

  }
}

function createLines() {
  var x, y, z, vertices = [], holes = [];
  var mesh;
  var geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa
  });

  for ( var i = 0; i < data.length; i ++ ) {
    x = (data[i].lat - minXcordinate)/scale;
    y = (data[i].lng - minYcordinate)/scale;
    // z = -Math.random() * 30;

    vertices.push(new THREE.Vector3(x, y, z));
  }

  geometry.vertices = vertices;

  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  mesh = new THREE.Line( geometry, material );
  scene.add(mesh);
}


// function createLines() {
//   var x, y, z, max = 1.0,min = 0.1,points = [];
//
//   for ( var i = 0; i < data.length; i ++ ) {
//     x = (data[i].lat - minXcordinate)/scale;
//     y = (data[i].lng - minYcordinate)/scale;
//     z = -Math.random() * 30;
//
//     points.push(new THREE.Vector3(x, y, z));
//   }
//
//   var material = new THREE.MeshPhongMaterial({
//   color: 0xaaaaaa,
//     wireframe: true
//   });
//   var geometry = new THREE.ConvexGeometry(points);
//   var mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);
//
//   console.log(mesh.geometry.vertices.length);
// }


// function createLines() {
//   var geometry = new THREE.BufferGeometry();
// 	var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
// 	var positions = new Float32Array( data.length * 3 );
// 	var colors = new Float32Array( data.length * 3 );
//
//   for ( var i = 0; i < data.length; i ++ ) {
// 			var x = (data[i].lat - minXcordinate)/scale;
// 			var y = (data[i].lng - minYcordinate)/scale;
// 			var z = Math.random();
// 			// positions
// 			positions[ i * 3 ] = x;
// 			positions[ i * 3 + 1 ] = y;
// 			positions[ i * 3 + 2 ] = z;
// 			// colors
// 			colors[ i * 3 ] = 0.8;
// 			colors[ i * 3 + 1 ] = 0.8;
// 			colors[ i * 3 + 2 ] = 0.8;
// 		}
//
//     geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
// 		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
//     geometry.computeBoundingSphere();
//     mesh1 = new THREE.Line( geometry, material );
// 		scene.add( mesh1 );
// }


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
