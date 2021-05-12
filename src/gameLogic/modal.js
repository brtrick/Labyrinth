export default class Modal {
    constructor() {
        this.form = document.getElementById("modal-form");
        this.submitButton = document.getElementById("modal-submit");
        this.body = document.getElementsByClassName("modal-open")[0];

        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitButton.addEventListener("click", handleSubmit);
    }

    handleSubmit (e) {
        e.preventDefault();
        
    }
}