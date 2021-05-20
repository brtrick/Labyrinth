import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

const textureLoader = new THREE.TextureLoader ();
const texture = textureLoader.load("dist/assets/ZebranoVeneer_512_albedo.png");
const roughness = textureLoader.load("dist/assets/ZebranoVeneer_512_roughness.png");
const normal = textureLoader.load("dist/assets/ZebranoVeneer_512_normal.png")
const textureD = textureLoader.load("dist/assets/Wenge_512_albedo.png");
const roughnessD = textureLoader.load("dist/assets/Wenge_512_roughness.png");
const normalD = textureLoader.load("dist/assets/Wenge_512_normal.png")

const array = [texture, roughness, normal, textureD, roughnessD, normalD];
for (let i=0; i < array.length; i++) {
    [array[i]].wrapT = THREE.RepeatWrapping;
    array[i].wrapS = THREE.RepeatWrapping;
    array[i].repeat.set(2,2);
    array[i].offset.set(10, 9);
}

export default class Piece {
    constructor( dark, box, hollow, tall) {
        this.tall = tall;
        this.dark = dark;
        this.hollow = hollow;
        this.box = box;
        this.selected = false;
        this.model = this.initModel();      
    }

    initModel() {
        const shape = new THREE.Shape();
        if (this.box) {
            shape.moveTo(-.20, .20);
            shape.lineTo(-.20, -.20);
            shape.lineTo(.20, -.20);
            shape.lineTo(.20, .20);
        }
        else { 
            shape.moveTo(0, .25);
            shape.absarc(0,0,.25, 0, 2*Math.PI, false);
            shape.closePath();
        }
        if (this.hollow) {
            const hole = new THREE.Shape();
            hole.absarc(0,0,.2, 0, 2*Math.PI, true);
            shape.holes.push(hole);
        }
        const height = this.tall ? 1.5 : .75;
        
        const geometry = new THREE.ExtrudeGeometry(shape, {depth: height, curveSegments: 32, steps: 8, bevelThickness: .1, bevelSize: .07, bevelSegments: 8})
        
        const material = this.dark ?
            new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
            new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );
        const model = new THREE.Mesh( geometry, material );
        model.castShadow = true;
        model.userData = {piece: true};
        return model;
    }
}