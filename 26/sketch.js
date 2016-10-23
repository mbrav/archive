//0.95if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera,scene,renderer;
// spheres geomteries
var spheres = [];
var pointLight, pointLight2;

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {
    var viewAngle = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 5000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    camera.position.z = 500;
    // controls
    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 100;
    controls.domElement = container;
    controls.rollSpeed = 0.04;
    controls.autoForward = false;
    controls.dragToLook = false;

    pointLight = new THREE.PointLight( 0xe8c878);
    pointLight.add( new THREE.Mesh( new THREE.SphereGeometry( 30, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xe8c878, wireframe: true} ) ) );

    pointLight2 = new THREE.PointLight( 0x78e8c8);
    pointLight2.add( new THREE.Mesh( new THREE.SphereGeometry( 30, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0x78e8c8, wireframe: true} ) ) );
    pointLight2.position.x = -300;

    var skyColor = new THREE.Color(0.95, 0.95, 0.95);
    renderer.setClearColor(skyColor, 1.0);

    for (var i = 0; i < 9; i++) {
      createSphere();
    }

    scene.add(camera, pointLight, pointLight2);
}

function animatedRender() {
  requestAnimationFrame(animatedRender);

  // update time
  time = clock.elapsedTime;

  // fly over control
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);

  // rotate light
  pointLight.position.x = Math.cos(time*0.2) * 300;
  pointLight.position.z = Math.sin(time*0.2) * 300;

  // rotate spheres
  updateSpheres();

}

function createSphere() {
  // sphere setup
  var radius = Math.random() * 10 + spheres.length*10;
  var segments = Math.random() * 10 + 10 + spheres.length*5;
  var rings = Math.random() * 10 + 10;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);
  var material = new THREE.MeshStandardMaterial({
    shading: THREE.FlatShading,
    roughness: 0.9,
    metalness: 0.9,
    // opacity : 1,
    // transparent: true,
    color: 0xffffff,
    emissive: 0xaa0,
    emissiveIntensity: 0.3,
    wireframe: false,
    wireframeLinewidth: 1
  });

  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // temp array for storing vertices data
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

  // store all the generated variables with evey sphere object
  sphere.initCords = verticesArray;
  // store all the generated variables with evey sphere object
  sphere.settings = {
    radius: radius,
    segments: segments,
    rings: rings,
    initRotation: Math.random() * Math.PI
  };

  // add the pshere to the sphere array
  spheres.push({
    sphere
  });

  // TESTING
  // console.log(spheres[0].sphere.geometry.vertices[673]);
  // console.log(spheres[0].sphere.initCords[673]);
}

function updateSpheres() {
  // Spherical and Geographic Coordinates control
  for (var i = 0; i < spheres.length; i++) {

    spheres[i].sphere.position.x = Math.cos(time/8 + spheres[i].sphere.settings.initRotation) * (i+1) * 120;
    spheres[i].sphere.position.z = Math.sin(time/8 + spheres[i].sphere.settings.initRotation) * (i+1) * 120;
    spheres[i].sphere.rotation.z += 0.0005 * i/2;

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
      var radiusVar = Math.cos(azimuthal*7 + polar*30+ time*5) * 5;

      vertices[j].x = (radius + radiusVar) * Math.sin(polar) * Math.cos(azimuthal);
      vertices[j].y = (radius + radiusVar) * Math.sin(polar) * Math.sin(azimuthal);
      vertices[j].z = (radius + radiusVar) * Math.cos(polar);
    }

    spheres[i].sphere.updateMatrix();
  }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
