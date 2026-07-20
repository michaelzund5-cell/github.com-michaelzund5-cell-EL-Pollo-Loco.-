/** Zeigt den Fortschritt beim Coin-Sammeln an (0-100% in 20er-Schritten). */
class CoinStatusBar extends DrawableObject {
    IMAGES = [
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 65;
        this.width = 200;
        this.height = 50;
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        const safePercentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.IMAGES[this.resolveImageIndex(safePercentage)]];
    }

    resolveImageIndex(percentage) {
        if (percentage >= 100) return 5;
        if (percentage >= 80) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        if (percentage >= 20) return 1;
        return 0;
    }
}
