import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

const textureLoader = new THREE.TextureLoader ();
// const texture = textureLoader.load("/src/assets/textures/bamboo-wood-semigloss-albedo.png");
const texture = textureLoader.load("dist/assets/ZebranoVeneer_512_albedo.png");
const roughness = textureLoader.load("dist/assets/ZebranoVeneer_512_roughness.png");
const normal = textureLoader.load("dist/assets/ZebranoVeneer_512_normal.png")
// const textureD = textureLoader.load("dist/assets/Wenge_512_albedo.png");
// const roughnessD = textureLoader.load("dist/assets/Wenge_512_roughness.png");
// const normalD = textureLoader.load("dist/assets/Wenge_512_normal.png")
const textureD = textureLoader.load("dist/assets/bamboo-wood-semigloss-albedo.png");
const roughnessD = textureLoader.load("dist/assets/bamboo-wood-semigloss-roughness.png");
const normalD = textureLoader.load("dist/assets/bamboo-wood-semigloss-normal.png")

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
        let geometry = this.box ?
            new THREE.BoxGeometry(3, (this.tall ? 9 : 4.5), 3) :
            new THREE.CylinderGeometry(1.5, 1.5, (this.tall ? 9 : 4.5), 128);
        
        const material = this.dark ?
            new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
            new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );
        return new THREE.Mesh( geometry, material );
    }

    
}