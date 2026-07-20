/**
 * Baut Level 1 komplett zusammen: Hintergrund, Wolken, Gegner-Platzierung,
 * Sammelobjekte und die Levelbreite. Wird einmal pro Spielstart aufgerufen.
 * @returns {Level}
 */
function createLevel1() {
    const endX = 2880;

    return new Level({
        endX,
        backgroundObjects: createBackgrounds(),
        clouds: [
            new Cloud(150, 1),
            new Cloud(1150, 2),
            new Cloud(2250, 1)
        ],
        enemies: [
            new Chicken(650),
            new BabyChicken(1050),
            new Chicken(1450),
            new BabyChicken(1850),
            new Chicken(2150),
            new Endboss()
        ],
        coins: [
            new Coin(400, 250),
            new Coin(700, 200),
            new Coin(1000, 250),
            new Coin(1300, 180),
            new Coin(1650, 240),
            new Coin(2050, 190)
        ],
        bottles: [
            new Bottle(500, 370),
            new Bottle(850, 370),
            new Bottle(1200, 370),
            new Bottle(1700, 370),
            new Bottle(2200, 370)
        ]
    });
}

function createBackgrounds() {
    const backgrounds = [];

    for (let section = 0; section < 4; section++) {
        const x = section * 720;
        const layerNumber = section % 2 === 0 ? 1 : 2;

        backgrounds.push(
            new BackgroundObject("./assets/img/img_pollo_locco/img/5_background/layers/air.png", x),
            new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/3_third_layer/${layerNumber}.png`, x),
            new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/2_second_layer/${layerNumber}.png`, x),
            new BackgroundObject(`./assets/img/img_pollo_locco/img/5_background/layers/1_first_layer/${layerNumber}.png`, x)
        );
    }

    return backgrounds;
}
