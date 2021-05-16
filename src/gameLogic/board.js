import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {printMessage} from './quarto'
import BasicBoard from './basicBoard'

export default class Board {
    constructor() {
        this.board = new BasicBoard();

        this.scene = new THREE.Scene();
        this.scene.rotateX(-Math.PI/2);
        this.camera = new THREE.PerspectiveCamera( 50, 100 / 100, .5, 15 );
        const canvas = document.getElementById("board");
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        
        this.animate = this.animate.bind(this);
        this.initScene();
    }

    reset() {
        this.board.winningSquares.forEach ((square) => {
            const mesh = this.scene.getObjectByName(square);
            mesh.material.uniforms.fill.value = false;
        });
        let piece;
        while (piece = this.scene.getObjectByName("piece"))
            this.scene.remove(piece);
        this.board.initBoard();
        this.animate();
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
        this.scene.background = new THREE.Color (0xffffff);

        this.camera.position.set(0.5, 4.345, -6);
        // this.camera.position.set(-0.125, 5.345, -6);
        // this.camera.position.set(1.275, 5.345, -5.725);
        // this.camera.position.set(1.82195, 3.06664, -3.48534);
        // this.camera.position.set(1.7018, 5.07284, -2.976548);
        
        this.init3DBoard();

        this.animate();
    }

    animate () {
            requestAnimationFrame( this.animate );
            this.controls.update();
            this.renderer.render( this.scene, this.camera );
    }

    init3DBoard() {
        const boxGeo = new THREE.BoxGeometry(6, 6, .5);
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
        const boardCircleGeo = new THREE.PlaneGeometry(6, 6);
        const boardCircle = new THREE.Mesh(boardCircleGeo, new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: circleVertexShader(),
                    fragmentShader: bigCircleFragmentShader()
        })); 
        boardCircle.rotateZ(Math.PI/4);
        boardCircle.position.set(0, 0, 0);
        boardCircle.receiveShadow = true;
        this.scene.add(boardCircle);

        const unitSquare = new THREE.PlaneGeometry(1,1,1,1);
        
        uniforms.radius.value = .4;
        uniforms.strokeWidth.value = .05;
        let index = 0;
        const material = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: circleVertexShader(),
                    fragmentShader: circleFragmentShader()
        });
        for (let y = 1.5; y >= -1.5; y--) {
            for (let x = -1.5; x <=1.5; x++) {
                let square = new THREE.Mesh(unitSquare, material.clone());
                square.name=index; // used to find and highlight winning Board squares 
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
        model.name = "piece"
        this.scene.add(model);
        this.board.numMoves++;
    }

    markWin() {
        this.board.winningSquares.forEach ((square) => {
            const mesh = this.scene.getObjectByName(square);
            mesh.material.uniforms.fill.value = true;
        })
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
