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

export default class Piece {
    constructor( dark, box, hollow, tall) {
        this.tall = tall;
        this.dark = dark;
        this.hollow = hollow;
        this.box = box;
        this.selected = false;
        this.model = this.initModel();
        // this.hollowTop = this.solid ? null : this.initHollowTop();
        // if (!this.solid) {
        //     this.model.setAttribute("position", [0,0,0]);
        //     this.hollowTop.setAttribute("position", [0, (this.tall ? 3 : 1.5), 0]);
        //     this.model = BufferGeometryUtils.mergeBufferGeometries([this.model, this.hollowTop]);
        //     console.log (this.model)
        // }      
    }

    initModel() {
        // new THREE.BoxGeometry(3, 3, (this.tall ? 9 : 4.5)) :
        // new THREE.CylinderGeometry(1.5, 1.5, (this.tall ? 9 : 4.5), 64);
        let geometry, shape = new THREE.Shape();
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
            // const sphereGeo = new THREE.SphereGeometry (.4, 200, 200, 0, Math.PI*2, Math.PI/2, Math.PI);
            // sphereGeo.setAttribute("position", [0, (this.tall ? 1.5 : .75), 0]);
            // geometry = BufferGeometryUtils.mergeBufferGeometries([geometry, sphereGeo]);
        }
        const height = this.tall ? 1.5 : .75;
        
        geometry = new THREE.ExtrudeGeometry(shape, {depth: height, curveSegments: 24, steps: 8, bevelThickness: .1, bevelSize: .07, bevelSegments: 8})
        
        const material = this.dark ?
            new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
            new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );
        const model = new THREE.Mesh( geometry, material );
        model.castShadow = true;
        model.userData = {piece: true};
        // if (this.hollow) {
        //     const sphereGeo = new THREE.SphereGeometry (.4, 200, 200, 0, Math.PI*2, Math.PI/2, Math.PI);
        //     sphereGeo.setAttribute("position", [0, (this.tall ? 1.5 : .75), 0]);
        //     const sphereModel = new THREE.Mesh( sphereGeo, material);
        //     sphereModel.castShadow = false;
        //     model = new THREE.Group();
        //     model.add (new THREE.Mesh( geometry, material ));
        //     model.add (sphereModel);
        // }
        return model;
    }

    // initHollowTop() {
    //     const sphereGeo = new THREE.SphereGeometry (.4, 200, 200, 0, Math.PI*2, Math.PI/2, Math.PI);
    //     const material = this.dark ?
    //         new THREE.MeshStandardMaterial( { map: textureD, normalMap: normalD, roughnessMap: roughnessD} ) :
    //         new THREE.MeshStandardMaterial( { map: texture, normalMap: normal, roughnessMap: roughness} );material.side = THREE.DoubleSide;
    //     return new THREE.Mesh (sphereGeo, material);
    // }
}