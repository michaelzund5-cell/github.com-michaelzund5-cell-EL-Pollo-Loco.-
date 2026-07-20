/**
 * Basisklasse für alle beweglichen Objekte (Charakter, Gegner, Wurfobjekte).
 * Stellt gemeinsame Funktionen bereit: Bewegung, Schwerkraft, Kollisionserkennung
 * und Schadenslogik. Erbt das Zeichnen von DrawableObject.
 */
class MoveableObject extends DrawableObject {
    speed = 0;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    groundY = 250;
    intervalIds = [];

    /**
     * Wie setInterval, aber pausiert automatisch, solange das Spiel
     * pausiert ist (window.isGamePaused). Merkt sich die Interval-ID,
     * damit sie später sauber wieder gestoppt werden kann.
     * @param {Function} callback - Funktion, die wiederholt ausgeführt wird.
     * @param {number} delay - Abstand in Millisekunden.
     * @returns {number} Die Interval-ID.
     */
    setGameInterval(callback, delay) {
        const intervalId = setInterval(() => {
            if (!window.isGamePaused) callback();
        }, delay);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /**
     * Stoppt alle laufenden Intervalle dieses Objekts (z.B. beim Entfernen
     * aus dem Spiel oder beim Beenden des Levels).
     */
    clearAllIntervals() {
        this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
        this.intervalIds = [];
    }

    /** Bewegt das Objekt um seine Geschwindigkeit nach rechts. */
    moveRight() {
        this.x += this.speed;
    }

    /** Bewegt das Objekt um seine Geschwindigkeit nach links. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Löst einen Sprung aus, indem eine negative Y-Geschwindigkeit gesetzt wird. */
    jump() {
        this.speedY = -25;
    }

    /**
     * Startet die Schwerkraft-Simulation: Solange das Objekt in der Luft ist
     * oder sich noch nach oben bewegt, wird die Position laufend angepasst.
     * Landet es auf dem Boden, wird die Position auf Bodenhöhe fixiert.
     */
    applyGravity() {
        this.setGameInterval(() => {
            if (this.isAboveGround() || this.speedY < 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            } else {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /** @returns {boolean} true, wenn sich das Objekt über der Bodenhöhe befindet. */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /** @returns {boolean} true, wenn die Energie aufgebraucht ist. */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Fügt Schaden zu, sofern das Objekt nicht bereits kurz zuvor getroffen
     * wurde (siehe isHurt) oder schon besiegt ist.
     * @param {number} [damage=5] - Höhe des Schadens.
     * @returns {boolean} true, wenn der Treffer tatsächlich angewendet wurde.
     */
    hit(damage = 5) {
        if (this.isHurt() || this.isDead()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        this.resetAnimation();
        return true;
    }

    /**
     * Kurzer Schutz-Cooldown nach einem Treffer, damit nicht mehrfach pro
     * Sekunde Schaden genommen wird, während man einen Gegner berührt.
     * @returns {boolean}
     */
    isHurt() {
        return Date.now() - this.lastHit < 300;
    }

    /**
     * Prüft per Bounding-Box-Vergleich, ob dieses Objekt ein anderes berührt.
     * Nutzt getCollisionBox() beider Objekte, falls vorhanden, statt der
     * vollen Sprite-Größe, damit die Kollision realistischer wirkt.
     * @param {object} object - Das zu prüfende andere Objekt.
     * @returns {boolean}
     */
    isColliding(object) {
        const a = this.getCollisionBox();
        const b = object.getCollisionBox ? object.getCollisionBox() : object;

        return a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height;
    }

    /**
     * Liefert die Kollisionsbox für humanoide/gegnerische Objekte:
     * etwas kleiner als der volle Sprite, damit transparente Ränder
     * im Bild nicht fälschlich als Treffer zählen.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getCollisionBox() {
        return {
            x: this.x + this.width * 0.18,
            y: this.y + this.height * 0.12,
            width: this.width * 0.64,
            height: this.height * 0.82
        };
    }
}
