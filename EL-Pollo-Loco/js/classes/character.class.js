class Character extends MoveableObject {
    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_IDLE = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png"
    ];

    IMAGES_LONG_IDLE = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    IMAGES_HURT = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_DEAD = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png"
    ];

    coins = 0;
    bottles = 0;
    deathAnimationFinished = false;
    lastActionAt = Date.now();

    constructor(keyboard, levelEndX) {
        super();
        this.keyboard = keyboard;
        this.levelEndX = levelEndX;

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 100;
        this.y = 250;
        this.groundY = 250;
        this.width = 150;
        this.height = 190;
        this.speed = 5;

        this.applyGravity();
        this.animate();
    }

    animate() {
        this.setGameInterval(() => this.handleMovement(), 1000 / 60);
        this.setGameInterval(() => this.updateAnimation(), 150);
    }

    handleMovement() {
        if (this.isDead()) return;

        if (this.keyboard.RIGHT && this.x < this.levelEndX - this.width) {
            this.otherDirection = false;
            this.moveRight();
            this.registerAction();
        }

        if (this.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
            this.registerAction();
        }

        if (this.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.registerAction();
        }
    }

    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimationOnce();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.keyboard.RIGHT || this.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    registerAction() {
        this.lastActionAt = Date.now();
    }

    isLongIdle() {
        return Date.now() - this.lastActionAt > 7000;
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

    bounceAfterStomp() {
        this.speedY = -12;
    }
    bounceAfterHit(pushRight) {
        const knockback = 12;
        this.x += pushRight ? knockback : -knockback;
        this.x = Math.max(0, Math.min(this.x, this.levelEndX - this.width));
    }



}
