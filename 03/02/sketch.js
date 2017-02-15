if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer, controls;

var clock = new THREE.Clock();

init();
animate();

var control;

var lines;

function init() {

    lines = {
        gyro: {},
        accelerometer: {}
    };

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 100);

    controls = new THREE.TrackballControls( camera );

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0xaaaaaa, 0.0025);


    //create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({
        color: 0x4e683f
    });
    var material2 = new THREE.LineBasicMaterial({
        color: 0x3f4e68
    });
    var material3 = new THREE.LineBasicMaterial({
        color: 0x68593f
    });

    var geometry = new THREE.Geometry();
    var geometry2 = new THREE.Geometry();
    var geometry3 = new THREE.Geometry();
    var geometry4 = new THREE.Geometry();
    var geometry5 = new THREE.Geometry();
    var geometry6 = new THREE.Geometry();

    for (var i = 0; i < data.length; i++) {
        geometry.vertices.push(new THREE.Vector3(i * 0.02, data[i].accX * 10.0, 0));
        geometry2.vertices.push(new THREE.Vector3(i * 0.02, data[i].accY * 10.0, 2));
        geometry3.vertices.push(new THREE.Vector3(i * 0.02, data[i].accZ * 10.0, 4));
        geometry4.vertices.push(new THREE.Vector3(i * 0.02, data[i].gyroX * 10.0, 20));
        geometry5.vertices.push(new THREE.Vector3(i * 0.02, data[i].gyroY * 10.0, 22));
        geometry6.vertices.push(new THREE.Vector3(i * 0.02, data[i].gyroZ * 10.0, 24));
    }

    lines.accelerometer.x = new THREE.Line(geometry, material);
    lines.accelerometer.y = new THREE.Line(geometry2, material2);
    lines.accelerometer.z = new THREE.Line(geometry3, material3);

    lines.gyro.x = new THREE.Line(geometry4, material);
    lines.gyro.y = new THREE.Line(geometry5, material2);
    lines.gyro.z = new THREE.Line(geometry6, material3);

    scene.add(lines.gyro.x, lines.gyro.y, lines.gyro.z,lines.accelerometer.x, lines.accelerometer.y, lines.accelerometer.z);

    // control
    control = new function() {
        this.rotX = 0.4;
        this.rotY = 0.4;
        this.rotZ = 0.4;
    };

    // var gui = new dat.GUI();

    // gui.add(control, 'rotX', 0, 2);
    // gui.add(control, 'rotY', 0, 2);
    // gui.add(control, 'rotZ', 0, 2);

    console.log(lines.gyro.x.geometry.vertices.length);

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

    control.handleResize();

}

function animate() {
  
    camera.lookAt(scene.position);

    for (var i = data.length-1; i >5; i--) {

      lines.gyro.x.geometry.verticesNeedUpdate = true;
      lines.gyro.y.geometry.verticesNeedUpdate = true;
      lines.gyro.z.geometry.verticesNeedUpdate = true;

      lines.gyro.x.geometry.vertices[i].y = Math.cos(i/2.) * data[i].accX*10;
      lines.gyro.y.geometry.vertices[i].y = Math.cos(i/2.) * data[i].accY*10;
      lines.gyro.z.geometry.vertices[i].y = Math.cos(i/2.) * data[i].accZ*10;


    }

    console.log(lines.gyro.x.geometry.vertices[24].y);

    controls.update();

    requestAnimationFrame(animate);
    render();


}


function render() {

    var delta = clock.getDelta(scene.position);

    renderer.render(scene, camera);

}
