import Piece from "./piecexy"
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

class PieceContainer {

    constructor() {
        // const canvas = document.getElementById("piece-to-play");
        // this.camera = new THREE.PerspectiveCamera( 50, 50/120, 2, 200 );
        this.camera = new THREE.PerspectiveCamera( 50, 100/150, 2, 100 );
        // this.camera.position.set(2,1,3);
        // this.camera.position.set(-.1,-2.8,2.4);
        this.camera.position.set(-.1,-5,3);
        // const gui = new dat.GUI();
        // gui.add(this.camera.position, "x").name("PTP Camera.x").listen();
        // gui.add(this.camera.position, "y").listen();
        // gui.add(this.camera.position, "z").listen();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(100, 150);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
    }

    setLights (scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100, 2)
        pointLight.position.set(-5,-10, 15);
        // var gui = new dat.GUI();
        // gui.add(pointLight.position, "x").name("PTPPointLight.x");
        // gui.add(pointLight.position, "y");
        // gui.add(pointLight.position, "z");
        scene.add(ambientLight);
        scene.add(dirLight);
        scene.add(pointLight);
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
        if (this.scene.userData.tall) this.camera.position.set(0, -3, 2.2);
        else this.camera.position.set(-.1,-2.8,2.4);
        this.camera.updateMatrix();
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
    
    addPiece(piece) {
        this.piece = piece.model.clone();
        this.scene.add(this.piece);
        this.scene.userData.tall = piece.tall;
    }
    
    removePiece() {
        this.scene.remove(this.piece);
        this.piece = null;
        this.scene.userData.tall = null;
    }
}