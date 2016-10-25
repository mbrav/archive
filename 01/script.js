var camera, scene,renderer;
var cube,group;
var pointLight;

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

    console.log("Lenght: " + farmerMarketsCords.length);
    for (var i = 0; i < farmerMarketsCords.length; i++) {
      var locations = farmerMarketsCords[i];
      // console.log(locations);
    }

    // calculate statistics
    for (var i = 0; i < farmerMarketsCords.length; i++) {
      if (maxXcordinate > farmerMarketsCords[i].lng) {
        maxXcordinate = farmerMarketsCords[i].lng;
      }
      if (minXcordinate > farmerMarketsCords[i].lng) {
        minXcordinate = farmerMarketsCords[i].lng;
      }
      if (maxYcordinate < farmerMarketsCords[i].lat) {
        maxYcordinate = farmerMarketsCords[i].lat;
      }
      if (minYcordinate > farmerMarketsCords[i].lat) {
        minYcordinate = farmerMarketsCords[i].lat;
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

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors,
    wireframe: false
  });
  group = new THREE.Group();

  for (var i = 0; i < farmerMarketsCords.length; i++) {

    cube = new THREE.Mesh(geometry, material);
    cube.position.x = (farmerMarketsCords[i].lat - minXcordinate)/scale;
    cube.position.y = (farmerMarketsCords[i].lng - minYcordinate)/scale;
    cube.position.z = 0;

    cube.updateMatrix();
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

  for ( var i = 0; i < farmerMarketsCords.length; i ++ ) {
    x = (farmerMarketsCords[i].lat - minXcordinate)/scale;
    y = (farmerMarketsCords[i].lng - minYcordinate)/scale;
    // z = -Math.random() * 30;

    vertices.push(new THREE.Vector3(x, y, z));
  }

  geometry.vertices = vertices;

  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  mesh = new THREE.Line( geometry, material );
  scene.add(mesh);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
