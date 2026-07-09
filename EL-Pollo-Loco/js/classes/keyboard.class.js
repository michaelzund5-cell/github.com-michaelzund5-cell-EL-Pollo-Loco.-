class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false; //akutuell wird nur die Leertaste gedrückt weiter taste können spätter ergänzt werden
    THROW = false;
    H = false;

    constructor() {
        this.bindKeyPressEvents();
    }

    bindKeyPressEvents() {
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft" || event.key === "a") {
                this.LEFT = true;
            }

            if (event.key === "ArrowRight" || event.key === "d") {
                this.RIGHT = true;
            }

            if (event.key === " ") {
                this.SPACE = true;
            }

            if (event.key === "k") {
                this.THROW = true;
            }
            if (event.key === "h") {
                this.H = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft" || event.key === "a") {
                this.LEFT = false;
            }

            if (event.key === "ArrowRight" || event.key === "d") {
                this.RIGHT = false;
            }

            if (event.key === " ") {
                this.SPACE = false;
            }

            if (event.key === "k") {
                this.THROW = false;
            }
            if (event.key === "h") {
                this.H = false;
            }
        });
    }
}