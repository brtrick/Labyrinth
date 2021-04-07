//  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
// const OrbitControls = require('three/examples/jsm/controls/OrbitControls.js');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = THREE.OrbitControls(camera, renderer.domElement);
const geometry1 = new THREE.BoxGeometry(1, 3, 1);
const material = new THREE.MeshPhongMaterial( { color: 0xfbf3d4 } );
const cube = new THREE.Mesh( geometry1, material );
scene.add( cube );

const geometry2 = new THREE.CylinderGeometry(.5, .5, 3, 100);
const material2 = new THREE.MeshPhongMaterial( { color: 0x483c32})
const cylinder = new THREE.Mesh( geometry2, material2);
scene.add( cylinder );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(10,20,5);
scene.add(ambientLight);
scene.add(dirLight);

camera.position.z = 10;
 camera.position.y = 2;
 camera.position.x = 1;

// renderer.render( scene, camera );
const animate = function () {
requestAnimationFrame( animate );

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();