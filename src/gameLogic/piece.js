import * as THREE from "three";

const textureLoader = new THREE.TextureLoader ();
// const texture = textureLoader.load("/src/assets/textures/bamboo-wood-semigloss-albedo.png");
const texture = textureLoader.load("/src/assets/textures/AnyConv.com__TexturesCom_Wood_ZebranoVeneer_512_albedo.png");
const roughness = textureLoader.load("src/assets/textures/AnyConv.com__TexturesCom_Wood_ZebranoVeneer_512_roughness.png");
const normal = textureLoader.load("src/assets/textures/AnyConv.com__TexturesCom_Wood_ZebranoVeneer_512_normal.png")
const textureD = textureLoader.load("/src/assets/textures/AnyConv.com__TexturesCom_Wood_Wenge_512_albedo.png");
const roughnessD = textureLoader.load("src/assets/textures/AnyConv.com__TexturesCom_Wood_Wenge_512_roughness.png");
const normalD = textureLoader.load("src/assets/textures/AnyConv.com__TexturesCom_Wood_Wenge_512_normal.png")

export default class Piece {
    constructor( dark, box, solid, tall) {
        this.tall = tall;
        this.dark = dark;
        this.solid = solid;
        this.box = box;
        this.selected = false;
        this.model = this.init_model();    
    }

    init_model() {
        const geometry = this.box ?
            new THREE.BoxGeometry(1, (this.tall ? 3 : 1.5), 1) :
            new THREE.CylinderGeometry(.5, .5, (this.tall ? 3 : 1.5), 100);
        const material = this.dark ?
            new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
            new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );
        return new THREE.Mesh( geometry, material );
    }
}