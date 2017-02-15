if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, controls, scene, renderer;

var clock = new THREE.Clock();

init();
animate();

var controls;
var line, line2;

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 100);

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xaaaaaa, 0.0025);


    //create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({ color: 0x4e683f });
    var material2 = new THREE.LineBasicMaterial({ color: 0x3f4e68});
    var geometry = new THREE.Geometry();
    var geometry2 = new THREE.Geometry();

    for (var i = 0; i < data.length; i++) {
      geometry.vertices.push(new THREE.Vector3(data[i].accX*20, data[i].accY*20.0, data[i].accZ*20.0));
      geometry2.vertices.push(new THREE.Vector3(data[i].gyroX*10, data[i].gyroY*3.0, data[i].gyroZ*3.0));
    }

    line = new THREE.Line(geometry, material);
    line2 = new THREE.Line(geometry2, material2);
    scene.add(line, line2);
    // renderer.render(scene, camera);

    // controls
    controls = new function() {
        this.rotX = 0.4;
        this.rotY = 0.4;
        this.rotZ = 0.4;
    };

    // var gui = new dat.GUI();
    //
    // gui.add(controls, 'rotX', 0, 2);
    // gui.add(controls, 'rotY', 0, 2);
    // gui.add(controls, 'rotZ', 0, 2);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setClearColor(0xf9f1e3);
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

    controls.handleResize();

}

function animate() {

    camera.position.x = Math.cos(clock.elapsedTime)*100*controls.rotX;
    camera.position.y = Math.sin(clock.elapsedTime)*100*controls.rotY;
    camera.position.z = Math.sin(clock.elapsedTime)*100*controls.rotZ;


    camera.lookAt(scene.position);

    for (var i = 0; i < line.geometry.vertices.length; i++) {
    }

    requestAnimationFrame(animate);
    render();

}


function render() {

    var delta = clock.getDelta(scene.position);

    renderer.render(scene, camera);

}
