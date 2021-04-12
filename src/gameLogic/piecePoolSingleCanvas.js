import Piece from "./piecexy"
import * as THREE from "three";
import Board from "./board"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default class PiecePool {

    constructor() {
        this.pool = new Array(16);
        this.currentSelection = -1;

        for (let i=0, dark = true; i<2; i++, dark = false) {
            for (let j=0, box = true; j<2; j++, box = false ) {
                 for (let k=0, hollow = true; k<2; k++, hollow = false) {
                       for (let l=0, tall = true; l<2; l++, tall = false) {
                             this.pool[i*8+j*4+k*2+l]= new Piece(dark, box, hollow, tall);
                       }
                  }
             }
        }

        this.scene = new THREE.Scene();
        this.scene.rotateX(-Math.PI/2);
        this.camera = new THREE.PerspectiveCamera( 75, 100 / 100, 2, 200 );
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.handleClick = this.handleClick.bind(this);
        
        this.display();
    }

    display() {
        this.renderer.setSize( 400, 400 );
        const piecePool = document.getElementById("piece-pool");
        piecePool.append (this.renderer.domElement);

        this.setLights();
        this.scene.background = new THREE.Color (0xd3d3d3);
        for (let i= 0; i < 16; i++) {
            this.pool[i].model.position.set(-1.5 + (i%4)*2, 1.5 - Math.floor(i/4), 0)
              this.pool[i].model.rotateY(-Math.PI/2);
            this.scene.add(this.pool[i].model);
        }
        this.camera.position.set(.24463,6.01908,-0.000281);
        
        const animate = function () {
            // if (this.pool[index].selected)
            //     this.scene.remove(this.pool[index].model);
            // else 
            requestAnimationFrame( animate.bind(this) );
            this.controls.update();
            this.renderer.render( this.scene, this.camera );
        };

        animate.bind(this)();
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        this.scene.add(ambientLight);
        this.scene.add(dirLight);
    }

    handleClick(e) {
        const idx = e.target.dataset.idx;
        if (this.pool[idx].selected) return;
        console.log(idx);
        this.pool[idx].selected = true;
        this.currentSelection = idx;
        document.getElementById(`button${idx}`).disabled = true;        
    }

    setScene(piece, li) {
        
        
        scene.add(piece.model);

        
        
        // scene.background = new THREE.Color (0xffffff);

        camera.position.set(10,9,7);
        
        const animate = function () {
            if (this.pool[index].selected)
                scene.remove(this.pool[index].model);
            else requestAnimationFrame( animate.bind(this) );
            controls.update();
            renderer.render( scene, camera );
        };

        animate.bind(this)();
    }
}
