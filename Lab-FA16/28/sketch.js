//0.95if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera,scene,renderer;
// spheres geomteries
var plane, spheres = [];
var pointLight;

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {
    var viewAngle = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 1000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    renderer.shadowMap.enabled = true;

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    camera.position.z = 400;
    // controls
    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 100;
    controls.domElement = container;
    controls.rollSpeed = 0.4;
    controls.autoForward = false;
    controls.dragToLook = false;

    pointLight = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
    pointLight.add(
      new THREE.Mesh( new THREE.SphereGeometry( 30, 16, 8 ),
      new THREE.MeshBasicMaterial( {
        color: 0xaaaaaa,
        wireframe: true
      } ) ) );
    pointLight.castShadow = true;
    pointLight.shadowCameraVisible = true;
    pointLight.shadowMapWidth = pointLight.shadowMapHeight = 4048;
    // pointLight.position.y = 300;
    pointLight.position.z = 300;
    var d = 5000;

    pointLight.shadowCameraLeft = -d;
    pointLight.shadowCameraRight = d;
    pointLight.shadowCameraTop = d;
    pointLight.shadowCameraBottom = -d;

    pointLight.shadowCameraFar = 500;
    pointLight.shadowDarkness = 0.2;

    pointLight2 = new THREE.DirectionalLight( 0xaaaaaa, 1.0);
    pointLight2.add( new THREE.Mesh(
      new THREE.SphereGeometry( 30, 16, 8 ),
      new THREE.MeshBasicMaterial( {
         color: 0x000000,
         wireframe: true
       } ) ) );
    pointLight.castShadow = true;
    pointLight2.position.y = -300;
    pointLight2.position.z = 300;

    var skyColor = new THREE.Color(0.95, 0.95, 0.95);
    renderer.setClearColor(skyColor, 1.0);

    // plane for the floor
    plane = new THREE.Mesh(
      new THREE.BoxGeometry(4000, 4000, 1),
      new THREE.MeshPhongMaterial({
        roughness: 0.5,
        metalness: 0.5,
        color: 0xffffff,
        opacity: 1,
        transparent: false,
        wireframe: false
      })
    );

    plane.position.z = -100;
    plane.receiveShadow = true;

    createSphere();

    scene.add(camera, plane, pointLight);
}


function animatedRender() {

  var time = new Date();

  requestAnimationFrame(animatedRender);

  // fly over control
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);

  // Spherical and Geographic Coordinates control
  for (var i = 0; i < spheres.length; i++) {

    // set the vertices so that they update
    spheres[i].sphere.geometry.verticesNeedUpdate = true;
    var vertices = spheres[i].sphere.geometry.vertices;
    var initCords = spheres[i].sphere.initCords;

    for (var j = 0; j < vertices.length; j++) {

      // trigonmetry stuff
      var radius = Math.sqrt(Math.pow(initCords[j].x, 2) + Math.pow(initCords[j].y, 2) + Math.pow(initCords[j].z, 2));
      var polar = Math.acos(initCords[j].z/radius);
      var azimuthal = Math.atan2(initCords[j].y, initCords[j].x);

      // variable
      var radiusVar = Math.cos(azimuthal*7 + polar*30+ time/1000) * 10;

      vertices[j].x = (radius + radiusVar) * Math.sin(polar) * Math.cos(azimuthal);
      vertices[j].y = (radius + radiusVar) * Math.sin(polar) * Math.sin(azimuthal);
      vertices[j].z = (radius + radiusVar) * Math.cos(polar);
    }

    spheres[i].sphere.updateMatrix();
  }

  pointLight.position.x = Math.cos(clock.elapsedTime*2) *100;
  pointLight.position.y = Math.sin(clock.elapsedTime*2) *100;
}

function createSphere() {
  var radius = 60;
  var segments = 200;
  var rings = 200;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);

  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });

  var sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  scene.add(sphere);

  var verticesArray = [];
  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    // keep track of the initial generated coordinates
    var initCords = {
      x : sphere.geometry.vertices[i].x,
      y : sphere.geometry.vertices[i].y,
      z : sphere.geometry.vertices[i].z,
    };
    verticesArray.push(initCords);
  }

  sphere.initCords = verticesArray;

  // add to array of shperes
  spheres.push({
    sphere
  });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
