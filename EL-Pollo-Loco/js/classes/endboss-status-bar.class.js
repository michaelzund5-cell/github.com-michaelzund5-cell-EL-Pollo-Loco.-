class EndbossStatusBar extends DrawableObject {
    IMAGES = [
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "./assets/img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange100.png"
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 490;
        this.y = 20;
        this.width = 210;
        this.height = 55;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
