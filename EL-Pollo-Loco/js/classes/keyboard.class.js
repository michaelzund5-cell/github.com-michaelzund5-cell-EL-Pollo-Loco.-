/** Represents the Keyboard game component. */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    THROW = false;

    /** Initializes a new instance. */
    constructor() {
        this.keyDownHandler = (event) => this.handleKey(event, true);
        this.keyUpHandler = (event) => this.handleKey(event, false);
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }

    /** Executes the handleKey operation. */
    handleKey(event, isPressed) {
        const key = event.key.toLowerCase();

        if (key === "arrowleft" || key === "a") this.LEFT = isPressed;
        if (key === "arrowright" || key === "d") this.RIGHT = isPressed;
        if (key === " ") this.SPACE = isPressed;
        if (key === "k") this.THROW = isPressed;

        if (["arrowleft", "arrowright", " "].includes(key)) {
            event.preventDefault();
        }
    }

    /** Executes the reset operation. */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.SPACE = false;
        this.THROW = false;
    }

    /** Executes the destroy operation. */
    destroy() {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
        this.reset();
    }
}
