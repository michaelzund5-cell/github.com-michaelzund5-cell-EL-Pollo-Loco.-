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

    constructor() {
        super();

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.y = 45;
        this.width = 250;
        this.height = 400;
        this.speed = 0.35;
        this.energy = 100;
        this.lastHit = 0;
    }

    updateAnimation() {
        if (this.isDefeated) {
            this.playDeathAnimationOnce();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    takeBottleHit(damage = 20) {
        if (this.isDefeated || this.isHurt()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        this.currentImage = 0;

        if (this.energy === 0) {
            this.isDefeated = true;
            this.speed = 0;
        }

        return true;
    }

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

    canBeRemoved() {
        return false;
    }
}
