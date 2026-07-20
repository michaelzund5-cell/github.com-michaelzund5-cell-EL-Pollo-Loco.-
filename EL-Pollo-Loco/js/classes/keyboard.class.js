/**
 * Wandelt physische Tastatur-Events in einfache boolesche Zustände um
 * (LEFT, RIGHT, SPACE, THROW), die von Character und World ausgelesen
 * werden. Mobile-Touch-Buttons setzen dieselben Eigenschaften direkt.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    THROW = false;

    constructor() {
        this.keyDownHandler = (event) => this.handleKey(event, true);
        this.keyUpHandler = (event) => this.handleKey(event, false);
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }

    /**
     * Verarbeitet ein einzelnes Tastatur-Event und setzt die entsprechende
     * Eigenschaft. Verhindert das Standard-Browserverhalten (z.B. Scrollen)
     * für die genutzten Tasten.
     * @param {KeyboardEvent} event
     * @param {boolean} isPressed - true bei keydown, false bei keyup.
     */
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

    /** Setzt alle Tasten-Zustände zurück (z.B. beim Pausieren). */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.SPACE = false;
        this.THROW = false;
    }

    /** Entfernt die Event-Listener wieder (z.B. beim Beenden des Spiels). */
    destroy() {
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
        this.reset();
    }
}
