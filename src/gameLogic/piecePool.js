import Piece from "./piecexy"
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default class PiecePool {

    constructor() {
        this.pool = new Array(16);
        this.currentSelection = -1;
        this.scenes = [];

        this.camera = new THREE.PerspectiveCamera( 50, 50/120, 2, 200 );
        this.camera.position.set(2,1,2);
        
        const canvas = document.getElementById("canvas");
        const piecePoolHTML = document.getElementById("piece-pool");
        const rect = piecePoolHTML.getBoundingClientRect();
        canvas.width = rect.right - rect.left;
        canvas.height = rect.bottom - rect.top;

        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        this.renderer.setScissorTest( true );
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //Populate the pool
        for (let i=0, dark = true; i<2; i++, dark = false) {
            for (let j=0, box = true; j<2; j++, box = false ) {
                 for (let k=0, hollow = true; k<2; k++, hollow = false) {
                       for (let l=0, tall = true; l<2; l++, tall = false) {
                             this.pool[i*8+j*4+k*2+l]= new Piece(dark, box, hollow, tall);
                       }
                  }
             }
        }

        this.handleClick = this.handleClick.bind(this);
        this.animate = this.animate.bind(this);
        
        this.animationId = null;
    }

    initDisplay() {
        const piecePool = document.getElementById("piece-pool");
        this.pool.forEach ((piece, idx) => {

            let li = document.createElement('li');
            li.classList.add("piece-pool-item", `item${idx}`);
            li.setAttribute("data-idx", `${idx}`);
            piecePool.append(li);
            
            // Create scene
            const scene = new THREE.Scene();
            scene.add(piece.model);
            this.setLights(scene);
            scene.background = new THREE.Color(0xd3d3d3);
            scene.userData = {li: li};

            this.scenes.push(scene);
        });
        this.animate();
    }

    handleClick(e) {
        if (window.quartoSelect) {
            const idx = e.target.dataset.idx;
            if (this.pool[idx].selected) return;
            console.log(idx);
            this.pool[idx].selected = true;
            this.currentSelection = idx;
            // document.getElementById(`button${idx}`).disabled = true; 
            window.quartoSelect = false;
            window.selectedPiece = this.pool[idx];
            const msg = document.getElementById("message");
            msg.innerHTML =  "Click on a board space to play the selected piece. (Hold mouse down and move to rotate board.)"  
            // test to modify
        }   
    }

    animate () {
        this.scenes.forEach((scene) => {
            const li = scene.userData.li;
            const index = li.dataset.idx;
            if (this.pool[index].selected) {
                if (this.currentSelection === index) scene.remove(this.pool[index].model);
            }

            const rect = li.getBoundingClientRect();
            const top = rect.top;
            const left = rect.left;
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;

            // this.renderer.setScissor(left, this.renderer.domElement.height - height  * (1+Math.floor(index/4)), width, height);
            // this.renderer.setViewport(left, this.renderer.domElement.height - height * (1+Math.floor(index/4)), width, height);
            this.renderer.setScissor (left, this.renderer.domElement.height - height, width, height);
            this.renderer.setViewport(left, this.renderer.domElement.height - height, width, height);
            this.camera.aspect = width/height;
            this.camera.updateProjectionMatrix();
            this.controls.update();
            this.renderer.render( scene, this.camera );
        
        }, this);
        this.animationId = requestAnimationFrame(this.animate);
    }

    setLights (scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        scene.add(ambientLight);
        scene.add(dirLight);
    }
}
