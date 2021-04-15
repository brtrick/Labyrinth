import Piece from "./piecexy"
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

class PieceContainer {

    constructor() {
        // const canvas = document.getElementById("piece-to-play");
        this.camera = new THREE.PerspectiveCamera( 50, 50/120, 2, 200 );
        this.camera.position.set(2,1,3);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(100, 150);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

 
    }

    setLights (scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        scene.add(ambientLight);
        scene.add(dirLight);
    }
}

export default class PieceToPlay extends PieceContainer {

    constructor() {
        super();
        this.piece = null;
        this.scene = new THREE.Scene();
        this.setLights(this.scene);
        this.scene.background = new THREE.Color(0xd3d3d3);
        this.animationId = null;

        this.animate = this.animate.bind(this);
        this.animate();
    }
    
    animate () {
        this.animationId = requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
    
    addPiece(piece) {
        this.piece = piece.model.clone();
        this.scene.add(this.piece);
    }

    removePiece() {
        this.scene.remove(this.piece);
        this.piece = null;
    }
}