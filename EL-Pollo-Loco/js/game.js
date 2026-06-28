let canvas;
let world;
let isPaused = false;
let isMuted = false;

function init() {
    console.log("game.js geladen");
    console.log("init gestartet");

    canvas = document.getElementById("canvas");

    bindButtonEvents();


}

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
        .getElementById("start-game-btn")
        .addEventListener("click", startGame);

    document
        .getElementById("pause-btn")
        .addEventListener("click", pauseGame);
}

function startGame() {
    hideStartScreen();

    world = new World(canvas);

    console.log("Start Game geklickt");
}

function restartGame() {
    world = new World(canvas);
    showStartScreen();

    console.log("Restart Game geklickt");
}

function fullscreenGame() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }

    console.log("Fullscreen Game geklickt");
}

function toggleMute() {
    isMuted = !isMuted;

    const muteButton = document.getElementById("mute-btn");
    muteButton.textContent = isMuted ? "Unmute" : "Mute";

    console.log("Mute:", isMuted);
}

function pauseGame() {
    isPaused = !isPaused;

    const pauseButton = document.getElementById("pause-btn");
    pauseButton.textContent = isPaused ? "Resume" : "Pause";

    console.log("Pause:", isPaused);
}

function hideStartScreen() {
    document.getElementById("start-screen").classList.add("hidden");
}

function showStartScreen() {
    document.getElementById("start-screen").classList.remove("hidden");
}