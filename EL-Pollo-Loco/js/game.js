let canvas;
let world;

function init() {
    canvas = document.getElementById("canvas");

    world = new World(canvas);
}
//html buttons 
function bindButtonEvents() {
    document
        .getElementById("fullscreen-btn")
        .addEventListener("click", fullscreenGame);

    document
        .getElementById("restart-btn")
        .addEventListener("click", restartGame);

    document
        .getElementById("mute-btn")
        .addEventListener("click", toggleMute);

        document
        .getElementById("unmute-btn")
        .addEventListener("click", toggleMute); 

        document
        .getElementById("start-game-btn")
        .addEventListener("click", startGame);  

        document
        .getElementById("pause-btn")
        .addEventListener("click", pauseGame);

     
}