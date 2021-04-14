import "./styles/reset.scss";
import "./styles/index.scss";
import PiecePool from "./gameLogic/piecePool";
import Board from "./gameLogic/board";

window.quartoSelect = true;
window.selectedPiece = null;
const p = new PiecePool(); 
p.initDisplay();
const b = new Board();

const piecePool = document.getElementById("piece-pool");
piecePool.addEventListener("click", p.handleClick);

