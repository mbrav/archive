if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene,renderer;
var cube,group;
var ambientLight1, spotLight1, spotLight2;
var lightHelper1, lightHelper2;

var floorGeometry = new THREE.BoxGeometry( 4000, 4000, 1 );
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0x555555,
  // opacity: 0.4,
  // transparent: true,
});

var meshFloor = new THREE.Mesh( floorGeometry, floorMaterial);

var scale = 150; //   scale/n

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
    var far = 1000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    // calculate statistics
    for (var i = 0; i < graffitData.length; i++) {
      if (maxXcordinate < parseInt(graffitData[i][1])) {
        maxXcordinate = parseInt(graffitData[i][1]);
      }
      if (minXcordinate > parseInt(graffitData[i][1])) {
        minXcordinate = parseInt(graffitData[i][1]);
      }
      if (maxYcordinate < parseInt(graffitData[i][2])) {
        maxYcordinate = parseInt(graffitData[i][2]);
      }
      if (minYcordinate > parseInt(graffitData[i][2])) {
        minYcordinate = parseInt(graffitData[i][2]);
      }
    }

    middleX = maxXcordinate - minXcordinate;
    middleY = maxYcordinate - minYcordinate;

    console.log("minXcordinate", minXcordinate, "maxXcordinate", maxXcordinate);
    console.log("minYcordinate", minYcordinate, "maxYcordinate", maxYcordinate);

    createCubes();

    ambientLight = new THREE.AmbientLight( 0x111111, 0.3 );
    ambientLight.position.set( 0, 0, 400).normalize();

    // spotlight
    spotLight1 = createSpotlight( 0xFF7F00 );
    spotLight2 = createSpotlight( 0x00FF7F );
    spotLight1.position.set( 0, 0, 0 );
		spotLight2.position.set( 0, 0, 0 );
    lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
    lightHelper2 = new THREE.SpotLightHelper( spotLight2 );

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 100;
    controls.domElement = container;
    controls.rollSpeed = 0.3;
    controls.autoForward = false;
    controls.dragToLook = false;

    // floor
    meshFloor.receiveShadow = true;
		meshFloor.position.set( 0, 0, -1);

    scene.fog = new THREE.Fog(0x777777, near, 400);
    var skyColor = new THREE.Color(0, 0, 0);
    renderer.setClearColor(skyColor, 1.0);

    scene.add(group);
    scene.add(meshFloor);
    scene.add(ambientLight);
    scene.add(spotLight1, spotLight2);
    scene.add( lightHelper1, lightHelper2);
    scene.add(camera);

    // set camare postion
    camera.position.z = 100;
}

function createCubes() {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
        opacity: 0.4,
        // transparent: true,
        vertexColors: THREE.FaceColors,
        wireframe: false
    });

    group = new THREE.Group();

    for (var i = 0; i < graffitData.length; i++) {

      cube = new THREE.Mesh(geometry, material);
      cube.position.x = ((parseInt(graffitData[i][1]) - minXcordinate) - middleX/2)/scale;
      cube.position.y = ((parseInt(graffitData[i][2]) - minYcordinate) - middleY/2)/scale;
      cube.position.z = Math.random()*20;

      cube.updateMatrix();
      group.add(cube);

    }

    console.log(group);
}

function createSpotlight( color ) {
		var newObj = new THREE.SpotLight( color, 2 );
		newObj.castShadow = true;
		newObj.angle = 0.3;
		newObj.penumbra = 0.5;
		newObj.decay = 1.2;
		newObj.distance = 500;
		newObj.shadow.mapSize.width = 1024;
		newObj.shadow.mapSize.height = 1024;
		return newObj;
	}

function animatedRender() {
  // update time
  var d = new Date();
  var t = d.getMilliseconds();
  requestAnimationFrame(animatedRender);
  var delta = clock.getDelta();

  // fly over control
  controls.update(delta);
  renderer.render(scene, camera);

  //animated spotlight
  // spotLight1.position.x = Math.cos(camera.position.x/7.5) * 40;
  // spotLight1.position.y = Math.sin(camera.position.y/4.5) * 40;
  // spotLight2.position.x = -Math.cos(camera.position.x/8.1) * 40;
  // spotLight2.position.y = -Math.sin(camera.position.y/5.7) * 40;

  // spotLight1.position = camera.position;

  if ( lightHelper1 ) lightHelper1.update();
	if ( lightHelper2 ) lightHelper2.update();

  spotLight1.target = camera;


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
