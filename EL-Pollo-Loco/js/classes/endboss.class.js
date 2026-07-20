/**
 * Der Endgegner. Steht zunächst still und wird erst aktiv ("getriggert"),
 * sobald der Charakter nah genug herankommt. Danach patrouilliert er
 * schneller als normale Chicken (siehe patrol()). Wird nur durch
 * Flaschentreffer besiegt, nicht durch Draufspringen.
 */
class Endboss extends Chicken {
    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_HURT = [
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_DEAD = [
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    energy = 100;
    isDefeated = false;
    deathAnimationFinished = false;
    isTriggered = false;
    world = null;

    constructor() {
        super(2500, 2250, 2680);

        this.imageFacesRight = false;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.y = 45;
        this.width = 250;
        this.height = 400;
        this.speed = 0;
        this.triggeredSpeed = 2.6;
        this.alertRange = 500;
        this.energy = 100;
        this.lastHit = 0;
        this.leftBorder = 100;
        this.rightBorder = 2880;
        this.otherDirection = true;
    }

    /**
     * Prüft, ob der Charakter nah genug ist, um den Boss erstmals zu
     * "triggern". Einmal ausgelöst, patrouilliert der Boss danach dauerhaft
     * mit erhöhter Geschwindigkeit – unabhängig davon, wo der Charakter
     * sich als Nächstes hinbewegt (kein ständiges Verfolgen).
     */
    patrol() {
        if (this.isDefeated) return;

        if (!this.isTriggered) {
            const character = this.world?.character;
            const distanceToCharacter = character ? Math.abs(character.x - this.x) : Infinity;

            if (distanceToCharacter < this.alertRange) {
                this.isTriggered = true;
                this.speed = this.triggeredSpeed;
            } else {
                return;
            }
        }

        super.patrol();
    }

    /** Zeigt Tod-, Verletzt- oder Lauf-Animation je nach Zustand. */
    updateAnimation() {
        if (this.isDefeated) {
            this.playDeathAnimationOnce();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Fügt dem Boss Schaden durch einen Flaschentreffer zu.
     * Besiegt ihn automatisch, sobald die Energie 0 erreicht.
     * @param {number} [damage=20] - Schaden pro Treffer.
     * @returns {boolean} true, wenn der Treffer angewendet wurde.
     */
    takeBottleHit(damage = 20) {
        if (this.isDefeated || this.isHurt()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        this.resetAnimation();

        if (this.energy === 0) {
            this.isDefeated = true;
            this.speed = 0;
        }

        return true;
    }

    /** Spielt die Todesanimation einmal durch und bleibt auf dem letzten Bild. */
    playDeathAnimationOnce() {
        if (this.deathAnimationFinished) return;

        const index = Math.min(this.currentImage, this.IMAGES_DEAD.length - 1);
        const path = this.IMAGES_DEAD[index];
        this.img = this.imageCache[path];

        if (this.currentImage < this.IMAGES_DEAD.length - 1) {
            this.currentImage++;
        } else {
            this.deathAnimationFinished = true;
        }
    }

    /**
     * Der Endboss wird nie automatisch aus dem Spiel entfernt (im Gegensatz
     * zu normalen Chicken), da er für den Sieg-Bildschirm gebraucht wird.
     * @returns {boolean} immer false.
     */
    canBeRemoved() {
        return false;
    }
}
