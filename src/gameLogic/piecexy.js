import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

const textureLoader = new THREE.TextureLoader ();
// const texture = textureLoader.load("/src/assets/textures/bamboo-wood-semigloss-albedo.png");
const texture = textureLoader.load("dist/assets/ZebranoVeneer_512_albedo.png");
const roughness = textureLoader.load("dist/assets/ZebranoVeneer_512_roughness.png");
const normal = textureLoader.load("dist/assets/ZebranoVeneer_512_normal.png")
const textureD = textureLoader.load("dist/assets/Wenge_512_albedo.png");
const roughnessD = textureLoader.load("dist/assets/Wenge_512_roughness.png");
const normalD = textureLoader.load("dist/assets/Wenge_512_normal.png")

// texture.minFilter = THREE.LinearFilter;
const array = [texture, roughness, normal, textureD, roughnessD, normalD];
for (let i=0; i < array.length; i++) {
    array[i].wrapS = [array[i]].wrapT = THREE.RepeatWrapping;
    array[i].repeat.set(2,2);
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
        // new THREE.BoxGeometry(3, 3, (this.tall ? 9 : 4.5)) :
        // new THREE.CylinderGeometry(1.5, 1.5, (this.tall ? 9 : 4.5), 64);
        const shape = new THREE.Shape();
        if (this.box) {
            // geometry = new THREE.BoxGeometry(.5, .5, (this.tall ? 1.5 : 0.75));
            shape.moveTo(-.20, .20);
            shape.lineTo(-.20, -.20);
            shape.lineTo(.20, -.20);
            shape.lineTo(.20, .20);
        }
        else { 
            shape.absarc(0,0,.25, 0, 2*Math.PI, false);

            // geometry = new THREE.CylinderGeometry(.25, .25, (this.tall ? 1.5 : 0.75), 64);
            // geometry.rotateX(-Math.PI/2);
        }
        if (this.hollow) {
            const hole = new THREE.Shape();
            hole.absarc(0,0,.2, 0, 2*Math.PI, true);
            // hole.absarc(0,0,.125, 0, 2*Math.PI, true);
            shape.holes.push(hole);
        }
        const height = this.tall ? 1.5 : .75;
        
        const geometry = new THREE.ExtrudeGeometry(shape, {depth: height, curveSegments: 24, steps: 8, bevelThickness: .1, bevelSize: .07, bevelSegments: 8})
        // const geometry = new THREE.ExtrudeGeometry(shape, {depth: height, curveSegments: 12, steps: 4, bevelThickness: .1, bevelSize: .07, bevelSegments: 8})
        
        const material = this.dark ?
            new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
            new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );
        const model = new THREE.Mesh( geometry, material );
        model.castShadow = true;
        model.userData = {piece: true};
        return model;
    }
}