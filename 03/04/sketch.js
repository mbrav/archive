if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, controls, scene, renderer;

var clock = new THREE.Clock();

init();
animate();

var control, loader;

var group;

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 80, 50);

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xaaaaaa, 0.0025);

    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );


    // controls
    control = new function() {
      this.rotX = 0;
      this.rotY = 80;
      this.rotZ = 50;
    };

    // var gui = new dat.GUI();
    //
    // gui.add(control, 'rotX', 0, 500);
    // gui.add(control, 'rotY', 0, 500);
    // gui.add(control, 'rotZ', 0, 500);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });


    // STL loader

    loader = new THREE.STLLoader();
    group = new THREE.Object3D();
    loader.load( '../models/BuddhaShakyamuni.stl', function ( geometry ) {
      // console.log(geometry);
      var mat = new THREE.MeshBasicMaterial( { color: 0x333333, wireframe: true} );
      group = new THREE.Mesh(geometry, mat);
      group.rotation.x = -0.5 * Math.PI;
      group.scale.set(0.6, 0.6, 0.6);
      scene.add(group);
    });

    renderer.setClearColor(0xFFFFFF);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    // controls.handleResize();

}

function animate() {

    // camera.position.x = controls.rotX;
    // camera.position.y = controls.rotY;
    // camera.position.z = controls.rotZ;

    // camera.position.x = Math.sin(clock.elapsedTime/10.)*50;
    // camera.position.y = Math.sin(clock.elapsedTime/3.)*50;
    // camera.position.z = Math.cos(clock.elapsedTime/6.)*50;


    // camera.lookAt(scene.position);

    requestAnimationFrame(animate);
    render();

    controls.update();

    group.rotation.z += 0.01;

}


function render() {

    var delta = clock.getDelta(scene.position);

    renderer.render(scene, camera);

}
