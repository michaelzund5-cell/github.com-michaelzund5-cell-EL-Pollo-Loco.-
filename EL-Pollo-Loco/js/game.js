let canvas;
let world;
let isMuted = false;
window.isGamePaused = false;

function init() {
    canvas = document.getElementById("canvas");
    bindButtonEvents();
    bindMobileControls();
}

function bindButtonEvents() {
    document.getElementById("fullscreen-btn").addEventListener("click", fullscreenGame);
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    document.getElementById("mute-btn").addEventListener("click", toggleMute);
    document.getElementById("start-game-btn").addEventListener("click", startGame);
    document.getElementById("pause-btn").addEventListener("click", togglePause);
}

function startGame() {
    if (world) world.stop();

    window.isGamePaused = false;
    updatePauseButton();
    hideStartScreen();
    hideEndScreen();
    hidePauseOverlay();
    world = new World(canvas);
}

function restartGame() {
    if (world) {
        world.stop();
        world = null;
    }

    window.isGamePaused = false;
    updatePauseButton();
    hideEndScreen();
    hidePauseOverlay();
    showStartScreen();
}

function fullscreenGame() {
    const gameWrapper = document.querySelector(".game-wrapper");
    const target = gameWrapper || canvas;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (target.requestFullscreen) {
        target.requestFullscreen();
    }
}

function toggleMute() {
    isMuted = !isMuted;
    document.getElementById("mute-btn").textContent = isMuted ? "Unmute" : "Mute";
}

function togglePause() {
    if (!world || world.gameFinished) return;

    window.isGamePaused = !window.isGamePaused;
    world.keyboard.reset();
    updatePauseButton();

    if (window.isGamePaused) {
        showPauseOverlay();
    } else {
        hidePauseOverlay();
    }
}

function updatePauseButton() {
    const pauseButton = document.getElementById("pause-btn");
    pauseButton.textContent = window.isGamePaused ? "Resume" : "Pause";
}

function bindMobileControls() {
    bindHoldButton("btn-left", "LEFT");
    bindHoldButton("btn-right", "RIGHT");
    bindHoldButton("btn-jump", "SPACE");
    bindHoldButton("btn-throw", "THROW");
}

function bindHoldButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const setKey = (value) => {
        if (!world?.keyboard) return;
        world.keyboard[keyName] = value;
    };

    ["pointerdown", "touchstart"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => {
            event.preventDefault();
            setKey(true);
        });
    });

    ["pointerup", "pointercancel", "pointerleave", "touchend"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => {
            event.preventDefault();
            setKey(false);
        });
    });
}

function hideStartScreen() {
    document.getElementById("start-screen").classList.add("hidden");
}

function showStartScreen() {
    document.getElementById("start-screen").classList.remove("hidden");
}

function hideEndScreen() {
    const endScreen = document.getElementById("end-screen");
    if (!endScreen) return;
    endScreen.classList.add("hidden");
    endScreen.classList.remove("won", "lost");
}

function showPauseOverlay() {
    document.getElementById("pause-overlay")?.classList.remove("hidden");
}

function hidePauseOverlay() {
    document.getElementById("pause-overlay")?.classList.add("hidden");
}
