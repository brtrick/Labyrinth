import PiecePool from "./piecePool";
import Board3D from "./board3D";
import {Raycaster, Vector2} from "three";

export default class Quarto {
    
    constructor () {
        this.piecePool = new PiecePool(); 
        this.board = new Board3D();
        this.piecePoolHTML = document.getElementById("piece-pool");
        this.boardHTML = document.getElementById("board");
        this.selectedPiece = null;
        this.player1 = "";
        this.player2 = "";
        this.AILevel = 1;
        this.currentPlayer = 1;
        this.opposingPlayer = 2;

        this.modal = document.getElementById("modal");
        this.modalSubmitButton = document.getElementById("modal-submit");
        this.body = document.getElementsByClassName("modal-open")[0];

        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        // Listen for click instead of submit so url will not update
        this.modalSubmitButton.addEventListener("click", this.handleModalSubmit);
        this.initializeModalRadioButtons();

        this.resetButton = document.getElementById("play-again-button");
        this.resetGame = this.resetGame.bind(this);
        this.resetButton.addEventListener("click", this.resetGame)

        this.handlePiecePoolClick = this.handlePiecePoolClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
    }
    
    startGame () {
        printMessage(`${this['player' + this.opposingPlayer]}:\nSelect a piece for ${this['player' + this.currentPlayer]} to play`);
        this.activatePiecePool();
    }

    resetGame(e) {
        //e.preventDefault();
        this.board.reset();
        this.piecePool.reset(); 
        // this.piecePool = new PiecePool(); 
        this.currentPlayer = 1;
        this.opposingPlayer = 2;
        this.body.classList.add("modal-open");
        this.modal.classList.remove("hidden"); 
        this.resetButton.style.visibility = "hidden"
    }

    // initializeModalRadioButtons and handlePlayer2ModalInput enable the 
    // textbox for Player 2's Name to appear in the modal only when Human Player is checked.
    initializeModalRadioButtons () {
        const AI1RadioButton = document.getElementById("player2-input-AI1");
        const AI2RadioButton = document.getElementById("player2-input-AI2");
        const humanRadioButton = document.getElementById("player2-input-human");

        AI1RadioButton.addEventListener("click", this.handlePlayer2ModalInput);
        AI2RadioButton.addEventListener("click", this.handlePlayer2ModalInput);
        humanRadioButton.addEventListener("click", this.handlePlayer2ModalInput);
        
        const humanNameInput = document.getElementById("player2-input")
        humanNameInput.style.visibility = humanRadioButton.checked ? "visible" : "hidden";
    }

    handlePlayer2ModalInput () {
        const humanRadioButton = document.getElementById("player2-input-human");
        const humanNameInput = document.getElementById("player2-input")
        humanNameInput.style.visibility = humanRadioButton.checked ? "visible" : "hidden";
    }

    handleModalSubmit (e) {
        //e.preventDefault();
        //e.stopPropagation();
        let player1Input = document.getElementById("player1-input").value;
        player1Input = (player1Input === "" ? "Player 1" : player1Input);
        this.player1 = player1Input;
        const player1PieceToPlay = document.getElementById("player1-piece-to-play-text");
        player1PieceToPlay.innerHTML = player1Input;
        
        const player2Inputs = document.getElementsByName("player2");
        for (let i=0; i<player2Inputs.length; i++) {
            if (!player2Inputs[i].checked) continue;
            const player2PieceToPlay = document.getElementById("player2-piece-to-play-text");
            switch (i) {
                case 0:
                case 1:
                    this.AILevel = i+1;
                    this.player2 = `${player2Inputs[i].value}`;
                    player2PieceToPlay.innerHTML = this.player2;
                    break;
                default:
                    this.AILevel = 0;
                    let player2Input = document.getElementById("player2-input").value;
                    player2Input = (player2Input === "" ? "Player 2" : player2Input);
                    this.player2 = player2Input;
                    player2PieceToPlay.innerHTML = player2Input;
            }
            break;
        }
        this.body.classList.remove("modal-open");
        this.modal.classList.add("hidden"); 
        this.startGame();
    }

    activatePiecePool () {
        if (this.currentPlayer === 2 || this.AILevel === 0)
            this.piecePoolHTML.addEventListener("click", this.handlePiecePoolClick);
        else {
            const piece = this['AIChoosePiece' + this.AILevel]();
            this.choosePiece(piece);
        }
    }

    handlePiecePoolClick(e) {
        const idx = e.target.dataset.idx;
        if (this.piecePool.pool[idx].selected) return null;
        this.choosePiece(idx);   
    }

    AIChoosePiece1() {
        let idx = Math.floor(Math.random() * 16);
        while (this.piecePool.pool[idx].selected)
            idx = (idx + 1) % 16;
        return idx;
    }

    AIChoosePiece2() {
        if (this.board.numMoves < 3)
            return this.AIChoosePiece1();
        let idx = Math.floor(Math.random() * 16);
        for (let i=0; i < 16; i++, idx = (idx + 1) % 16) {
            if (this.piecePool.pool[idx].selected) continue;
            if (this.findWinningMove(this.piecePool.pool[idx]) !== -1) 
                continue;
            return idx;
        }
        return this.AIChoosePiece1();
    }

    choosePiece(idx) {
        const li = document.getElementById(`item${idx}`);
        li.classList.add("selected");
        this.piecePool.pool[idx].selected = true;
        this.piecePool.currentSelection = idx;
        this.selectedPiece = this.piecePool.pool[idx];
        this.piecePool[`player${this.currentPlayer}PieceToPlay`].addPiece(this.selectedPiece);
        printMessage(`${this['player' + this.currentPlayer]}:\nClick a circle on the board to play the selected piece`);  
        if (this.currentPlayer === 2 || this.AILevel === 0)
            this.piecePoolHTML.removeEventListener("click", this.handlePiecePoolClick);
        this.activateBoard();
    }

    activateBoard () {
        if (this.currentPlayer === 1 || this.AILevel === 0)
            this.boardHTML.addEventListener("click", this.handleBoardClick);
        else {
            const move = this['AIChooseBoardSpot' + this.AILevel]();
            this.makeMove(move);
        }
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
        if (intersects[0] && intersects[0].object.userData.piece) return;
        
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.boardId !== undefined) {
                const idx = intersects[i].object.userData.boardId;
                if (this.board.board[idx] !== undefined) return;
                this.makeMove(idx);
            }
        }
    }

    makeMove(idx) {
        this.board.board[idx] = this.selectedPiece;
        this.board.placePieceOnBoard(this.selectedPiece, idx);
        this.selectedPiece = null;
        this.piecePool[`player${this.currentPlayer}PieceToPlay`].removePiece();
        if (this.board.isGameWon(idx)) {
            this.board.markWin(); 
            printMessage(`${this['player' + this.currentPlayer]} wins with 4 ${this.board.winningAttribute} pieces in a row!`);
        }
        else if (this.board.isGameTie())
            printMessage("Tie Game!");
        else {
            [this.currentPlayer, this.opposingPlayer] = [this.opposingPlayer, this.currentPlayer]; 
            printMessage(`${this['player' + this.opposingPlayer]}:\nSelect a piece for ${this['player' + this.currentPlayer]} to play`);
            if (this.AILevel === 0 || this.currentPlayer === 2)
                this.boardHTML.removeEventListener("click", this.handleBoardClick);
            this.activatePiecePool();
            return;
        }
        
        if (this.AILevel === 0 || this.currentPlayer === 1)
            this.boardHTML.removeEventListener('click', this.handleBoardClick);
        this.resetButton.style.visibility = "visible";
    }

    AIChooseBoardSpot1() {
        let idx = Math.floor(Math.random() * 16);
        while (this.board.board[idx] !== undefined)
            idx = (idx + 1) % 16;      
        return idx;
    }
    
    AIChooseBoardSpot2() {
        if (this.board.numMoves < 3)
            return this.AIChooseBoardSpot1();
        let idx = this.findWinningMove(this.selectedPiece);
        if (idx !== -1) return idx;
        
        // If did not find a winning move,
        // find a move that does not set up opponent for win
        idx = Math.floor(Math.random() * 16);
        for (let i=0; i < 16; i++, idx = (idx + 1) % 16) {
            if (this.board.board[idx] !== undefined) continue;
            this.board.board[idx] = this.selectedPiece;
            if (!this.nextPieceMustWin()) {
                this.board.board[idx] = undefined;
                return idx;
            }
            this.board.board[idx] = undefined;
        }
        return this.AIChooseBoardSpot1();
    }

    // Returns the index of winning move for given piece or -1 if no move wins
    findWinningMove(piece) {
        for (let idx = 0; idx < 16; idx++) {
            if (this.board.board[idx] !== undefined) continue;
            this.board.board[idx] = piece;
            if (this.board.isGameWon(idx)) {
                this.board.board[idx] = undefined;
                return idx;
            }
            else this.board.board[idx] = undefined;
        }
        return -1;
    }

    nextPieceMustWin() {
        for (let i=0; i < 16; i++) {
            if (this.piecePool.pool[i].selected) continue;
            if (this.findWinningMove(this.piecePool.pool[i]) === -1) return false;
        }
        return true;
    }
}


export const printMessage = (msg) => {
    const msgHTML = document.getElementById("message");
    msgHTML.innerHTML = msg;      
}