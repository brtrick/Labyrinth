import Piece from "./piece"

export default class piecePool {

    constructor() {
        this.pool = new Array(16);
        for (let i=0, dark = true; i<2; i++, dark = false) {
            for (let j=0, box = true; j<2; j++, box = false ) {
                 for (let k=0, solid = true; k<2; k++, solid = false) {
                       for (let l=0, tall = true; l<2; l++, tall = false) {
                             this.pool[i*8+j*4+k*2+l]= new Piece(dark, box, solid, tall);
                       }
                  }
             }
        }
    }
}
