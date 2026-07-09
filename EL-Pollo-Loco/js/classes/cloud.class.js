class Cloud extends MoveableObject {

    constructor() {
        super();

        this.loadImage("./assets/img/img_pollo_locco/img/5_background/layers/4_clouds/1.png");

        this.x = 100;
        this.y = 20;
        this.width = 500;
        this.height = 250;

        this.speed = 0.15;

        this.animate();
       
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}