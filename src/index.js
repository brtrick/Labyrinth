import "./styles/index.scss";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js';
import piecePool from "./gameLogic/piecePool"

const p = new piecePool();
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 100 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const controls = new OrbitControls(camera, renderer.domElement);
const controls = new TrackballControls(camera, renderer.domElement);

for (let i=0; i<16; i++) {
    p.pool[i].model.position.set ((i%4)*3, (i/4)*5, 0);
    scene.add (p.pool[i].model);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10,20,5);
scene.add(ambientLight);
scene.add(dirLight);
scene.background = new THREE.Color (0xffffff);

camera.position.set(25,0, 0)
camera.lookAt(0,0,0);
controls.update();

// renderer.render( scene, camera );
const animate = function () {
requestAnimationFrame( animate );

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;
    controls.update();
	renderer.render( scene, camera );
};

animate();