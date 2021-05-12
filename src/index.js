import "./styles/reset.scss";
import "./styles/index.scss";
import "./styles/instructions.scss";
import "./styles/modal.scss";
import Quarto from "./gameLogic/quarto";
import Instructions from './gameLogic/instructions';

document.addEventListener("DOMContentLoaded", () => {
    const i = new Instructions();
    const q = new Quarto();
});

