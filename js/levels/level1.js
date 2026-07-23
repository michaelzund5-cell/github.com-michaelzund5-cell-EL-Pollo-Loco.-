/**
 * Creates the first playable game level.
 *
 * @returns {Level} Configured first level.
 */
function createLevel1() {
    return new Level({
        endX: 2880,
        backgroundObjects: createBackgrounds(),
        clouds: createClouds(),
        enemies: createEnemies(),
        coins: createCoins(),
        bottles: createBottles()
    });
}

/** Creates all clouds for level one. @returns {Cloud[]} Level clouds. */
function createClouds() {
    return [new Cloud(150, 1), new Cloud(1150, 2), new Cloud(2250, 1)];
}

/** Creates all enemies for level one. @returns {(Chicken|BabyChicken|Endboss)[]} Level enemies. */
function createEnemies() {
    return [
        new Chicken(650), new BabyChicken(1050), new Chicken(1450),
        new BabyChicken(1850), new Chicken(2150), new Endboss()
    ];
}

/** Creates all collectable coins. @returns {Coin[]} Level coins. */
function createCoins() {
    return [
        new Coin(400, 220), new Coin(700, 200), new Coin(1000, 250),
        new Coin(1300, 180), new Coin(1650, 240), new Coin(2050, 190)
    ];
}

/** Creates all collectable bottles. @returns {Bottle[]} Level bottles. */
function createBottles() {
    return [
        new Bottle(500, 370), new Bottle(850, 370), new Bottle(1200, 370),
        new Bottle(1700, 370), new Bottle(2200, 370)
    ];
}

/**
 * Creates the layered desert background.
 *
 * @returns {BackgroundObject[]} Background layers for the complete level.
 */
function createBackgrounds() {
    const backgrounds = [];
    for (let section = 0; section < 4; section++) {
        addBackgroundSection(backgrounds, section);
    }
    return backgrounds;
}

/**
 * Adds one four-layer background section.
 *
 * @param {BackgroundObject[]} backgrounds - Target background array.
 * @param {number} section - Section index.
 * @returns {void}
 */
function addBackgroundSection(backgrounds, section) {
    const x = section * 720;
    const layer = section % 2 === 0 ? 1 : 2;
    backgrounds.push(
        new BackgroundObject("./assets/img/img_pollo_locco/img/5_background/layers/air.png", x),
        new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/3_third_layer/${layer}.png`, x),
        new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/2_second_layer/${layer}.png`, x),
        new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/1_first_layer/${layer}.png`, x)
    );
}
