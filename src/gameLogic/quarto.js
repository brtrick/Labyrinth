import PiecePool from "./piecePool";
import Board from "./board";
import {Raycaster, Vector2} from "three";

export default class Quarto {
    
    constructor () {
        this.piecePool = new PiecePool(); 
        this.board = new Board();
        this.piecePoolHTML = document.getElementById("piece-pool");
        this.boardHTML = document.getElementById("board");
        this.selectedPiece = null;
        this.player1 = "PLAYER 1";
        this.player2 = "PLAYER 2";
        this.currentPlayer = 1;
        this.opposingPlayer = 2;

        this.handlePiecePoolClick = this.handlePiecePoolClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
        
        printMessage(`${this['player' + this.opposingPlayer]}:\nSelect a piece for ${this['player' + this.currentPlayer]} to play`);
        this.activatePiecePool();
    }

    activatePiecePool () {
        this.piecePoolHTML.addEventListener("click", this.handlePiecePoolClick);
    }

    handlePiecePoolClick(e) {
        const idx = e.target.dataset.idx;
        if (this.piecePool.pool[idx].selected) return null;
        e.target.classList.add("selected");
        this.piecePool.pool[idx].selected = true;
        this.piecePool.currentSelection = idx;
        this.selectedPiece = this.piecePool.pool[idx];
        this.piecePool[`player${this.currentPlayer}PieceToPlay`].addPiece(this.selectedPiece);
        printMessage(`${this['player' + this.currentPlayer]}:\nClick a circle on the board to play the selected piece`);  
        this.piecePoolHTML.removeEventListener("click", this.handlePiecePoolClick);
        this.activateBoard();   
    }

    activateBoard () {
        this.boardHTML.addEventListener("click", this.handleBoardClick);
    }

    handleBoardClick (e) {
        const raycaster = new Raycaster();
        const mouse = new Vector2();
        const size = new Vector2();

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
                if (this.board.isGameWon(idx)) 
                    printMessage(`${this['player' + this.currentPlayer]} wins with 4 ${this.board.winningAttribute} pieces in a row!`);
                else if (this.board.isGameTie())
                    printMessage("Tie Game!");
                else {
                    [this.currentPlayer, this.opposingPlayer] = [this.opposingPlayer, this.currentPlayer]; 
                    printMessage(`${this['player' + this.opposingPlayer]}:\nSelect a piece for ${this['player' + this.currentPlayer]} to play`);
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