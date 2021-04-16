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

        this.setup.element.addEventListener("click", () => {
            if (this.setup.hidden)
                this.setup.element.classList.remove("hidden");
            else
                this.setup.element.classList.add("hidden");
        });
        // displayInstructions();
    }

    // displayInstructions(){

    // }


}