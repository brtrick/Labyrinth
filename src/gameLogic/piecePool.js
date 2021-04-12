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

        this.handleClick = this.handleClick.bind(this);
    }

    display() {
        const ul = document.getElementById("piece-pool");
        this.pool.forEach ((piece, idx) => {

            let li = document.createElement('li');
            li.classList.add("piece-pool-item", `item${idx}`);
            li.setAttribute("data-idx", `${idx}`);

            // Create scene
            this.setScene(piece, li);
            
            const button = document.createElement("button");
            button.classList.add("select-button");
            button.setAttribute("data-idx", `${idx}`);
            button.setAttribute("type", "button");
            button.setAttribute("id", `button${idx}`);
            button.textContent = "Select";
            button.addEventListener("click", this.handleClick);
            li.append(button);
            

            ul.append(li);
        });
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
        const index = li.dataset.idx;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, 100 / 100, 2, 200 );
        const renderer = new THREE.WebGLRenderer({antialias: true});
        
        renderer.setSize( 100, 100 );
        renderer.domElement.setAttribute('id', `scene${index}`);
        li.append( renderer.domElement );
            
        const controls = new OrbitControls(camera, renderer.domElement);
        scene.add(piece.model);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        scene.add(ambientLight);
        scene.add(dirLight);
        scene.background = new THREE.Color (0xd3d3d3);
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
