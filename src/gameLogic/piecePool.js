import Piece from "./piece"
import PieceToPlay from './pieceToPlay'
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

export default class PiecePool {

    constructor() {
        this.pool = new Array(16);
        this.currentSelection = -1;
        this.player1PieceToPlay = new PieceToPlay();
        this.player2PieceToPlay = new PieceToPlay();
        for (let i=1; i <=2; i++) {
            let ptpHTML = document.getElementById(`player${i}-ptp`);
            ptpHTML.prepend(this[`player${i}PieceToPlay`].renderer.domElement);
        }
        this.scenes = [];

        this.camera = new THREE.PerspectiveCamera( 50, 50/120, .1, 5 );
        // this.camera.position.set(2,1,3);
        // this.camera.position.set(-0.5680264454765832, -2.4838988328553184, 3.0033411260362164);
        this.camera.position.set(-.7, -1.8, 3);
        // const gui = new dat.GUI();
        // gui.add(this.camera.position, "x").name("PPool Camera x");
        // gui.add(this.camera.position, "y").name("PPool Camera y");
        // gui.add(this.camera.position, "z").name("PPool Camera z");

        const canvas = document.getElementById("canvas");
        const piecePoolHTML = document.getElementById("piece-pool");
        const rect = piecePoolHTML.getBoundingClientRect();
        canvas.width = rect.right - rect.left;
        canvas.height = rect.bottom - rect.top;

        this.renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
        this.renderer.setScissorTest( true );
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        // this.controls.enablePan = false;
        // this.controls.enableRotate = false;

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

        this.animate = this.animate.bind(this);
        
        this.animationID = null;
        this.initDisplay();
    }

    reset() {
        for (let i=0; i < 16; i++) {
            const li = document.getElementById(`item${i}`);
            li.classList.remove("selected");
            this.pool[i].selected = false;
        }
        this.currentSelection = -1;
    }

    initDisplay() {
        const piecePool = document.getElementById("piece-pool");
        const canvas = piecePool.firstElementChild;
        this.pool.forEach ((piece, idx) => {
            let li = document.createElement('li');
            li.classList.add("piece-pool-item");
            li.setAttribute("id", `item${idx}`);
            li.setAttribute("data-idx", `${idx}`);
            piecePool.append(li);
            
            // Create scene
            const scene = new THREE.Scene();
            if (piece.tall) {
                piece.model.translateY(-.23);
                piece.model.translateX(-.1);
            }
            scene.add(piece.model);
            this.setLights(scene);
            scene.background = new THREE.Color(0xd3d3d3);
            scene.userData = {li: li};

            this.scenes.push(scene);
        });
        this.animate();
    }


    animate () {
        this.scenes.forEach((scene) => {
            const ul = document.getElementById("piece-pool");
            const ulRect = ul.getBoundingClientRect();
            const li = scene.userData.li;
            const index = li.dataset.idx;
            const rect = li.getBoundingClientRect();
            const top = rect.top - ulRect.top + li.clientTop;
            const left = rect.left - ulRect.left + li.clientLeft;
            const width = li.clientWidth;
            const height = li.clientHeight;
            const margin = getComputedStyle(li);

            this.renderer.setScissor(left, this.renderer.domElement.height - ((li.offsetHeight+parseInt(margin.marginTop)+parseInt(margin.marginBottom))  * (1+Math.floor(index/2))) + parseInt(margin.marginBottom) + li.clientTop, width, height);
            this.renderer.setViewport(left, this.renderer.domElement.height - ((li.offsetHeight+parseInt(margin.marginTop)+parseInt(margin.marginBottom))  * (1+Math.floor(index/2))) + parseInt(margin.marginBottom) + li.clientTop, width, height);
            // this.renderer.setScissor (left, this.renderer.domElement.height - height, width, height);
            // this.renderer.setViewport(left, this.renderer.domElement.height - height, width, height);
            this.camera.aspect = width/height;
            this.camera.updateProjectionMatrix();
            this.controls.update();
            this.renderer.render( scene, this.camera );
        
        }, this);
        this.animationID = requestAnimationFrame(this.animate);
    }

    setLights (scene) {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100, 2)
        pointLight.position.set(5,-10, 15);
        // var gui = new dat.GUI();
        // gui.add(pointLight.position, "x");
        // gui.add(pointLight.position, "y");
        // gui.add(pointLight.position, "z");
        scene.add(ambientLight);
        scene.add(dirLight);
        scene.add(pointLight);
    }
}
