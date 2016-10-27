var camera, scene,renderer;
var cube,group;
var pointLight;

// data file
var data;
var scale = 0.002; //   scale/n

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {

    // specify the dataFile
    data = publicRecyclingBins;

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

    console.log("Data Lenght: " + data.length);
    for (var i = 0; i < data.length; i++) {
      // console.log(data[i]);
    }

    // light
    pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.z = 10;
    camera.position.z = -100;
    camera.rotation.x = Math.PI;
    camera.rotation.z = -Math.PI/2;

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 30;
    controls.domElement = container;
    controls.rollSpeed = 0.2;
    controls.autoForward = false;
    controls.dragToLook = false;

    // fog and background
    scene.fog = new THREE.Fog(0xffffff, near, 600);
    var skyColor = new THREE.Color(1.0, 1.0, 1.0);
    renderer.setClearColor(skyColor, 1.0);

    // create geometries
    createCubes();

    camera.position.x = group.children[5].position.x;
    camera.position.y = group.children[5].position.y;

    scene.add(group);
    scene.add(pointLight);
    scene.add(camera);
}


function animatedRender() {
    requestAnimationFrame(animatedRender);
    var delta = clock.getDelta();
    controls.update(delta);

    renderer.render(scene, camera);

    animateCubes();

}

function createCubes() {

  var geometry;
  var material = new THREE.MeshStandardMaterial({
    color: 0xb9fc99,
    emissive: 0xb9fc99,
    emissiveIntensity: 0.5,
    vertexColors: THREE.FaceColors,
    wireframe: false
  });
  group = new THREE.Group();

  for (var i = 0; i < data.length; i++) {
    geometry = new THREE.TorusKnotBufferGeometry( 0.7, 0.15, 24, 8 );

    cube = new THREE.Mesh(geometry, material);
    cube.position.x = data[i].lat/scale;
    cube.position.y = data[i].lng/scale;
    cube.position.z = 0;


    // random rotation when generated
    cube.rotation.x = Math.random() * Math.PI*2

    // cube.updateMatrix();
    group.add(cube);

  }
}

function animateCubes() {
  for (var i = 0; i < group.children.length; i++) {

    var pos = group.children[i].position;

    group.children[i].rotation.x += 0.01;
    group.children[i].rotation.y += 0.01;

  }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
