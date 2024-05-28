export default class Instructions {
    constructor() {
        this.instructionsHTML = document.getElementById("instructions");
        this.setup = {
            element: document.getElementById("setup"),
            hidden: true
        };
        this.objective = {
            element: document.getElementById("objective"),
            hidden: true
        };
        this.gamePlay = {
            element: document.getElementById("game-play"),
            hidden: true
        };
        this.gameMechanics = {
            element: document.getElementById("game-mechanics"),
            hidden: true
        };
        this.prev = null;

        this.setup.element.addEventListener("click", () => {
            this.processClick("setup");
        });
        this.objective.element.addEventListener("click", () => {
            this.processClick("objective");
        });
        this.gamePlay.element.addEventListener("click", () => {
            this.processClick("gamePlay");
        });
        this.gameMechanics.element.addEventListener("click", () => {
            this.processClick("gameMechanics");
        });
    }
    
    processClick (field) {
        if (this[field].hidden) {
            // Only allow one open bullet at a time
            if (this.prev != null) {
                // Change the arrow
                this[this.prev].element.children[0].children[0].classList.replace("down-arrow","left-arrow");
                // Hide the instructions
                this[this.prev].element.children[1].classList.add("hidden");
                this[this.prev].hidden = true;
            }
            // Change the arrow
            this[field].element.children[0].children[0].classList.replace("left-arrow", "down-arrow");
            // Show instructions
            this[field].element.children[1].classList.remove("hidden");
            this.prev = field;
        }
        else {
            // Change the arrow
            this[field].element.children[0].children[0].classList.replace("down-arrow","left-arrow");
            // Hide the instructions
            this[field].element.children[1].classList.add("hidden");
            this.prev = null;
        }
        this[field].hidden = !this[field].hidden;
        this.prev = field;
    }
}
