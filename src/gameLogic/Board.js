import Piece from "./piece"
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxGeometry, PlaneGeometry, Vector4 } from "three";


export default class Board {
    constructor() {
        this.board = Array(16);
        this.winningAttribute = "";

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, 100 / 100, 2, 200 );
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.initScene();
    }

    isGameWon (move) {
        if (this.rowWinner(move)) return true;
        if (this.columnWinner(move)) return true;
        return this.diagonalWinner(move);
    }

    rowWinner(move) {
        const rowOffset = Math.floor(move/4)*4;
        for (let i = rowOffset; i < rowOffset+4; i++)
            if (this.board[i] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        for (let a = 0; a < 4; a++) {
            for (let i = rowOffset + 1; i < rowOffset+4; i++) {
                if (this.board[rowOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === rowOffset+3) {
                    this.winningAttribute = attributes[a];
                    this.markWin([rowOffset, rowOffset + 1, rowOffset + 2, rowOffset + 3]);
                    return true;
                }
            }
        }
    }

    columnWinner(move) {
        const columnOffset = move%4;
        for (let i = columnOffset; i < 16; i += 4)
            if (this.board[i] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        for (let a = 0; a < 4; a++) {
            for (let i = columnOffset + 4; i < 16; i += 4) {
                if (this.board[columnOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === columnOffset+12) {
                    this.winningAttribute = attributes[a];
                    this.markWin([columnOffset, columnOffset + 4, columnOffset + 8, columnOffset + 12]);
                    return true;
                }
            }
        }
    }

    diagonalWinner(move) {
        let diagonal = [0, 5, 10, 15];
        if (!diagonal.includes(move)) {
            diagonal = [3, 6, 9, 12];
            if (!diagonal.includes(move)) 
                return false;
        }

        for (let i = 0; i < 4; i++)
            if (this.board[diagonal[i]] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        for (let a = 0; a < 4; a++) {
            for (let i = 1; i < 4; i++) {
                if (this.board[diagonal[0]][attributes[a]] !== this.board[diagonal[i]][attributes[a]]) break;
                if (i === 3) {
                    this.winningAttribute = attributes[a];
                    this.markWin(diagonal);
                    return true;
                }
            }
        }
        
    }

    markWin(winningSquares) {
        console.log(`Win with ${this.winningAttribute} on ${winningSquares}!`)
    }

    initScene() {
        this.renderer.setSize( 400, 250 );
        const boardDiv = document.getElementById("board");
        boardDiv.append (this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10,20,5);
        this.scene.add(ambientLight);
        this.scene.add(dirLight);
        // this.scene.background = new THREE.Color (0xd3d3d3);
        this.scene.background = new THREE.Color (0xffffff);

        this.camera.position.set(0,0,5);
        // this.camera.position.set(10,9,7);
        
        this.initBoard();

        const animate = function () {
            requestAnimationFrame( animate.bind(this) );
            this.controls.update();
            this.renderer.render( this.scene, this.camera );
        };

        animate.bind(this)();
    }

    initBoard() {
        const boxGeo = new BoxGeometry(6, 6, 0.1);
        const board = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({color: 0x800000}));
        board.rotateZ(Math.PI/4);
        board.position.set(0, 0, -0.1001);
        // board.position.set(0,-.5, 0);
        this.scene.add(board)

        const unitSquare = new PlaneGeometry(1,1,1,1);
        
        let uniforms = {
            innerColor: {type: 'vec3', value: new THREE.Color(0x800080)},
            borderColor: {type: 'vec3', value: new THREE.Color(0xbc8f8f)},
            radius: {value: .4},
            strokeWidth: {value: .05}
        }
        let index = 0;
        for (let y = 1.5; y >= -1.5; y--) {
            for (let x = -1.5; x <=1.5; x++) {
                // let square = new THREE.Mesh(unitSquare, new THREE.MeshStandardMaterial({color: 0xff0000}));
                let square = new THREE.Mesh(unitSquare, new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: circleVertexShader(),
                    fragmentShader: circleFragmentShader()
                }));
                square.boardId = index++;
                square.empty = true;
                square.position.set (x, y, 0);
                //square.rotateX(-Math.PI/2);
                this.scene.add(square);
            }
        }

    }

}

const circleVertexShader = function () {
    return `
        varying vec3 vUv;
        
        void main() {
            vUv = position;
            gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
        }
    `
}

const circleFragmentShader = function () {
    return `
        uniform vec3 borderColor;
        uniform vec3 innerColor;
        uniform float radius;
        uniform float strokeWidth;

        varying vec3 vUv;

        void main() {
            vec2 pos = abs(vUv.xy);
            if (pos.x >= 1.0) pos.x -= 1.0;
            if (pos.y >= 1.0) pos.y -= 1.0;

            float d = distance(pos, vec2 (0, 0));
            if ( d < radius) discard;
            else if (d < radius + strokeWidth) gl_FragColor = vec4(borderColor, 1.0);
            else discard;
        }
    `
}
//if ( d < radius) gl_FragColor = vec4(innerColor, 1.0);


//(from Fragment Shader)
// uniform vec3 borderColor;
//         uniform vec3 innerColor;
//         uniform float radius;
//         uniform float strokeWidth;

//         varying vec3 vUv;

// const d = distance(vec2 (uVu.x, uVu.z), vec2 (.5, .5));
//             if (d < radius.value) gl_FragColor = innerColor;
//             else if (d < radius.value + strokeWidth.value) gl_FragColor = borderColor;
//             else discard;