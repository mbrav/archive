// http://threejs.org/examples/webgl_shader2.html

var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 1000;

var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

var mesh;
var uniforms1;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild(renderer.domElement);

var pointLight = new THREE.PointLight(0xFFFFFF);

var mouseX = 0;
var mouseY = 0;

function init() {

    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // createCube();

    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshStandardMaterial({
        color: 0xCC0000,
        wireframe: false
    });

		// SHADER
		uniforms1 = {
        u_time: {
            value: 4.0
        },
        u_mouse: {
            value: new THREE.Vector2(100, 100)
        },
        u_resolution: {
            value: new THREE.Vector2(500.0, 500.0)
        }
    };

    var shaderMaterial = new THREE.ShaderMaterial({

        uniforms: uniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent

    });

    mesh = new THREE.Mesh(geometry, material);
		// mesh = new THREE.Mesh( geometry, shaderMaterial);
    console.log(shaderMaterial);
    console.log(mesh);

    scene.add(mesh);
    scene.add(pointLight);
    camera.position.z = 300;
    scene.add(camera);
}

function createCube() {
}

function animatedRender() {
    requestAnimationFrame(animatedRender);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onDocumentMouseMove() {
    mouseX = (event.clientX);
    mouseY = (event.clientY);
}

init();
animatedRender();
