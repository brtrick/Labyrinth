export default class Board {

    constructor () {
        this.initBoard();
    }

    initBoard() {
        this.board = Array(16);
        this.winningAttribute = "";
        this.winningSquares = [];
        this.currentPiece = null;
        this.numMoves = 0;
    }

    isGameTie() {
        // Assumes game has already checked for win
        if (this.numMoves === 16) {
            return true;
        }
        return false;
    }

    isGameWon (move) {
        if (this.rowWinner(move)) return true;
        if (this.columnWinner(move)) return true;
        return this.diagonalWinner(move);
    }

    rowWinner(move) {
        const rowOffset = Math.floor(move/4)*4;
        for (let i = rowOffset; i < rowOffset+4; i++)
            if (this.board[i] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = rowOffset + 1; i < rowOffset+4; i++) {
                if (this.board[rowOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === rowOffset+3) {
                    this.winningAttribute = this.board[rowOffset][attributes[a]] ? attributes[a] : opposites[a];
                    this.winningSquares = [rowOffset, rowOffset + 1, rowOffset + 2, rowOffset + 3];
                    return true;
                }
            }
        }
    }

    columnWinner(move) {
        const columnOffset = move%4;
        for (let i = columnOffset; i < 16; i += 4)
            if (this.board[i] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = columnOffset + 4; i < 16; i += 4) {
                if (this.board[columnOffset][attributes[a]] !== this.board[i][attributes[a]]) break;
                if (i === columnOffset + 12) {
                    this.winningAttribute = this.board[columnOffset][attributes[a]] ? attributes[a] : opposites[a];
                    this.winningSquares = [columnOffset, columnOffset + 4, columnOffset + 8, columnOffset + 12];
                    return true;
                }
            }
        }
    }

    diagonalWinner(move) {
        let diagonal = [0, 5, 10, 15];
        if (!diagonal.includes(move)) {
            diagonal = [3, 6, 9, 12];
            if (!diagonal.includes(move)) 
                return false;
        }

        for (let i = 0; i < 4; i++)
            if (this.board[diagonal[i]] === undefined) return false;
        
        const attributes = ["tall", "dark", "hollow","box"];
        const opposites = ["small", "light", "solid", "cylinder"];
        for (let a = 0; a < 4; a++) {
            for (let i = 1; i < 4; i++) {
                if (this.board[diagonal[0]][attributes[a]] !== this.board[diagonal[i]][attributes[a]]) break;
                if (i === 3) {
                    this.winningAttribute = this.board[diagonal[0]][attributes[a]] ? attributes[a] : opposites[a];
                    this.winningSquares = diagonal;
                    return true;
                }
            }
        }
        
    }
}