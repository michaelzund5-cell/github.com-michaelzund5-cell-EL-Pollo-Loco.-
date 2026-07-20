/**
 * Container-Klasse für alle Daten eines Levels: Gegner, Wolken,
 * Hintergrundobjekte, Sammelobjekte und die Levelbreite.
 * Wird typischerweise über eine Fabrikfunktion wie createLevel1() erzeugt.
 */
class Level {
    /**
     * @param {object} config
     * @param {MoveableObject[]} config.enemies
     * @param {Cloud[]} config.clouds
     * @param {BackgroundObject[]} config.backgroundObjects
     * @param {Coin[]} config.coins
     * @param {Bottle[]} config.bottles
     * @param {number} config.endX - X-Koordinate des Levelendes.
     */
    constructor({ enemies, clouds, backgroundObjects, coins, bottles, endX }) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.endX = endX;
    }
}
