import PiecePool from "./piecePool";
import Board from "./board";
import * as THREE from "three";

export default class Quarto {
    
    constructor () {
        this.piecePool = new PiecePool(); 
        this.board = new Board();
        this.piecePoolHTML = document.getElementById("piece-pool");
        this.boardHTML = document.getElementById("board");
        this.selectedPiece = null;
        this.player1 = "Player 1";
        this.player2 = "Player 2";
        this.currentPlayer = 1;
        this.opposingPlayer = 2;

        this.handlePiecePoolClick = this.handlePiecePoolClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
        
        // const msg = document.getElementById("message");
        // msg.innerHTML =`${this['player' + this.opposingPlayer]}, select a piece for ${this['player' + this.currentPlayer]} to play.`;
        printMessage(`${this['player' + this.opposingPlayer]}, select a piece for ${this['player' + this.currentPlayer]} to play.`);
        this.activatePiecePool();
    }

    activatePiecePool () {
        this.piecePoolHTML.addEventListener("click", this.handlePiecePoolClick);
    }

    handlePiecePoolClick(e) {
        const idx = e.target.dataset.idx;
        if (this.piecePool.pool[idx].selected) return null;
        console.log(idx);
        e.target.classList.add("selected");
        this.piecePool.pool[idx].selected = true;
        this.piecePool.currentSelection = idx;
        this.selectedPiece = this.piecePool.pool[idx];
        this.piecePool[`player${this.currentPlayer}PieceToPlay`].addPiece(this.selectedPiece);
        printMessage(`${this['player' + this.currentPlayer]}, click on a board space to play the selected piece.`);  
        this.piecePoolHTML.removeEventListener("click", this.handlePiecePoolClick);
        this.activateBoard();   
    }

    activateBoard () {
        this.boardHTML.addEventListener("click", this.handleBoardClick);
    }

    handleBoardClick (e) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const size = new THREE.Vector2();

        this.board.renderer.getSize(size);
        mouse.x= (e.offsetX / size.x) * 2 - 1;
        mouse.y= -(e.offsetY / size.y) * 2 + 1;

        raycaster.setFromCamera( mouse, this.board.camera);
        const intersects = raycaster.intersectObjects(this.board.scene.children);
        
        // Don't want to select board spaces _through_ a piece,
        // so just return if first object hit is a piece 
        if (intersects[0].object.userData.piece) return;
        
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.boardId !== undefined) {
                const idx = intersects[i].object.userData.boardId;
                if (this.board.board[idx] !== undefined) return;
                this.board.board[idx] = this.selectedPiece;

                this.board.placePieceOnBoard(this.selectedPiece, idx);
                this.selectedPiece = null;
                this.piecePool[`player${this.currentPlayer}PieceToPlay`].removePiece();
                if (!this.board.isGameWon(idx) && !this.board.isGameTie()) {
                    [this.currentPlayer, this.opposingPlayer] = [this.opposingPlayer, this.currentPlayer]; 
                    printMessage(`${this['player' + this.opposingPlayer]}, select a piece for ${this['player' + this.currentPlayer]} to play.`);
                    this.boardHTML.removeEventListener("click", this.handleBoardClick);
                    this.activatePiecePool();
                    return;
                }
                
                this.boardHTML.removeEventListener('click', this.handleBoardClick);
            }
        }
    }

}

export const printMessage = (msg) => {
    const msgHTML = document.getElementById("message");
    msgHTML.innerHTML = msg;      
}