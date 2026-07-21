/** Represents the StatusBar game component. */
class StatusBar extends DrawableObject {
    IMAGES = [
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png"
    ];

    percentage = 100;

    /** Initializes a new instance. */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    /** Executes the setPercentage operation. */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
    }

    /** Executes the resolveImageIndex operation. */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        if (this.percentage < 40) return 1;
        if (this.percentage < 60) return 2;
        if (this.percentage < 80) return 3;
        if (this.percentage < 100) return 4;
        return 5;
    }
}
