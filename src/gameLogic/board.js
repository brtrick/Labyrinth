import Piece from "./piecexy";
import PiecePool from "./piecePoolIndiv";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxGeometry, PlaneGeometry, Raycaster, Vector4 } from "three";
import {printMessage} from './quarto'

export default class Board {
    constructor() {
        this.board = Array(16);
        this.winningAttribute = "";

        this.scene = new THREE.Scene();
        this.scene.rotateX(-Math.PI/2);
        this.camera = new THREE.PerspectiveCamera( 50, 100 / 100, .5, 100 );
        const canvas = document.getElementById("board");
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;

        this.currentPiece = null;
        this.numMoves = 0;
        this.initScene();
    }

    isGameTie() {
        // Assumes game has already checked for win
        if (this.numMoves === 16) {
            printMessage("Tie Game!");
            return true;
        }
        return false;
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
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = rowOffset + 1; i < rowOffset+4; i++) {
                if (this.board[rowOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === rowOffset+3) {
                    this.winningAttribute = this.board[rowOffset][attributes[a]] ? attributes[a] : opposites[a];
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
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = columnOffset + 4; i < 16; i += 4) {
                if (this.board[columnOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === columnOffset + 12) {
                    this.winningAttribute = this.board[columnOffset][attributes[a]] ? attributes[a] : opposites[a];
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
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = 1; i < 4; i++) {
                if (this.board[diagonal[0]][attributes[a]] !== this.board[diagonal[i]][attributes[a]]) break;
                if (i === 3) {
                    this.winningAttribute = this.board[diagonal[0]][attributes[a]] ? attributes[a] : opposites[a];
                    this.markWin(diagonal);
                    return true;
                }
            }
        }
        
    }

    markWin(winningSquares) {
        winningSquares.forEach ((square) => {
            const mesh = this.scene.getObjectByName(square);
            mesh.material.uniforms.fill.value = true;
        })
        // printMessage(`Win with ${this.winningAttribute} on ${winningSquares}!`);
    }

    initScene() {
        // this.renderer.setSize( 400, 250 );
        const boardDiv = document.getElementById("board-container");
        boardDiv.append (this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.castShadow = true;
        dirLight.position.set(10,20,5);
        this.scene.add(ambientLight);
        this.scene.add(dirLight);
        // this.scene.background = new THREE.Color (0xd3d3d3);
        this.scene.background = new THREE.Color (0xffffff);

        this.camera.position.set(0.5, 4.345, -6);
        // this.camera.position.set(-0.125, 5.345, -6);
        // this.camera.position.set(1.275, 5.345, -5.725);
        // this.camera.position.set(1.82195, 3.06664, -3.48534);
        // this.camera.position.set(1.7018, 5.07284, -2.976548);
        
        this.initBoard();

        const animate = function () {
            requestAnimationFrame( animate.bind(this) );
            this.controls.update();
            this.renderer.render( this.scene, this.camera );
        };

        animate.bind(this)();
    }

    initBoard() {
        const boxGeo = new BoxGeometry(6, 6, .5);
        // const boxGeo = new BoxGeometry(6, 6, 0.1);
        const board = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({color: 0x800000}));
        board.rotateZ(Math.PI/4);
        board.position.set(0, 0, -.3501);
        // board.position.set(0, 0, -.1001);
        board.receiveShadow = true;
        this.scene.add(board);

        let uniforms = {
            innerColor: {type: 'vec3', value: new THREE.Color(0xffff00)},
            borderColor: {type: 'vec3', value: new THREE.Color(0xbc8f8f)},
            fill: {type: 'bool', value: false },
            radius: {type: 'float', value: 1.05},
            strokeWidth: {type:'float', value: .02}
        }
        const boardCircleGeo = new PlaneGeometry(6, 6);
        const boardCircle = new THREE.Mesh(boardCircleGeo, new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: circleVertexShader(),
                    fragmentShader: bigCircleFragmentShader()
                })); 
        boardCircle.rotateZ(Math.PI/4);
        boardCircle.position.set(0, 0, 0);
        boardCircle.receiveShadow = true;
        this.scene.add(boardCircle);

        const unitSquare = new PlaneGeometry(1,1,1,1);
        
        uniforms.radius.value = .4;
        uniforms.strokeWidth.value = .05;
        let index = 0;
        const material = new THREE.ShaderMaterial({
                    uniforms: Object.assign({}, uniforms),
                    vertexShader: circleVertexShader(),
                    fragmentShader: circleFragmentShader()
                });
        for (let y = 1.5; y >= -1.5; y--) {
            for (let x = -1.5; x <=1.5; x++) {
                let square = new THREE.Mesh(unitSquare, material.clone());
                square.name=index;
                square.userData = {
                    boardId: index++,
                    empty: true
                }
                square.position.set (x, y, 0);
                this.scene.add(square);
            }
        }
    }

    placePieceOnBoard(piece, index) {
        const model = piece.model.clone();
        model.position.set(-1.5 + (index%4), 1.5 - Math.floor(index/4), 0);
            // (piece.tall ? .75 : .375));
        this.scene.add(model);
        this.numMoves++;
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
        uniform bool fill;

        varying vec3 vUv;
        varying vec3 vColor;

        void main() {
            vec2 pos = abs(vUv.xy);
            if (pos.x >= 1.0) pos.x -= 1.0;
            if (pos.y >= 1.0) pos.y -= 1.0;

            float d = distance(pos, vec2 (0, 0));
            if ( d < radius) {
                if (fill) gl_FragColor = vec4(innerColor, 1.0);
                else discard;
            }
            else if (d < radius + strokeWidth) gl_FragColor = vec4(borderColor, 1.0);
            else discard;
        }
    `
}
const bigCircleFragmentShader = function () {
    return `
        uniform vec3 borderColor;
        uniform vec3 innerColor;
        uniform float radius;
        uniform float strokeWidth;

        varying vec3 vUv;

        void main() {
            vec2 pos = abs(vUv.xy)/vec2 (6.0, 6.0);

            float d = distance(pos, vec2 (0, 0));
            if ( d < radius + .05) discard;
            else if (d < radius + .06) gl_FragColor = vec4(borderColor, 1.0);
            else discard;
        }
    `
}
