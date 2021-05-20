import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

class PieceContainer {

    constructor() {
        this.camera = new THREE.PerspectiveCamera( 50, 100/150, 2, 5 );
        this.camera.position.set(-.1, -5, 3);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(100, 150);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
    }

    setLights (scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100, 2);
        pointLight.position.set(-5,-10, 15);
        
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
        this.animationID = null;

        this.animate = this.animate.bind(this);
        this.animate(false);
    }
    
    animate (shouldAnimate) {
        this.animationID = shouldAnimate ?  requestAnimationFrame(this.animate) : null;
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
    
    addPiece(piece) {
        this.piece = piece.model.clone();
        if (piece.tall) {
            this.piece.translateY(-.95); 
            this.piece.translateX(+.1);
            this.camera.position.set(0, -3.4, 2.6); 
        }
        else this.camera.position.set(-.1,-1.8,2.6);
        this.camera.updateMatrix();
        this.scene.add(this.piece);
        this.scene.userData.tall = piece.tall;
        this.animate(true);
    }
    
    removePiece() {
        this.scene.remove(this.piece);
        this.piece = null;
        this.scene.userData.tall = null;
        cancelAnimationFrame(this.animationID);
        // render once to remove the piece
        this.animate(false);
    }
}