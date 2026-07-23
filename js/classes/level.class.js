/** Represents the Level game component. */
class Level {

    /** Initializes a new instance. */
    constructor({ enemies, clouds, backgroundObjects, coins, bottles, endX }) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.endX = endX;
    }
}
