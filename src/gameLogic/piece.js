import * as THREE from "three";

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
        const material = new THREE.MeshPhongMaterial( { color: (this.dark ? 0x483C32 : 0xfbf3d4 )} );
        return new THREE.Mesh( geometry, material );
    }
}