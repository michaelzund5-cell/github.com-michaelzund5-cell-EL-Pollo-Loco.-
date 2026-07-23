let canvas;
let world;
let isMuted = false;
window.isGamePaused = false;
window.isMuted = false;
let wasPausedBeforeModal = false;

/** Initializes the page controls and restores saved settings. */
function init() {
    canvas = document.getElementById("canvas");
    restoreMuteSetting();
    bindButtonEvents();
    bindMobileControls();
    bindFullscreenChangeListener();
    hideGameInterface();
}

/** Restores the saved mute state from local storage. */
function restoreMuteSetting() {
    isMuted = localStorage.getItem("elPolloLocoMuted") === "true";
    window.isMuted = isMuted;
    updateMuteButton();
}

/** Registers fullscreen state listeners. */
function bindFullscreenChangeListener() {
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
}

/** Updates the fullscreen button without changing its width. */
function updateFullscreenButton() {
    const button = document.getElementById("fullscreen-btn");
    const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    button.classList.toggle("active", active);
    button.textContent = active ? "Exit Fullscreen" : "Fullscreen";
}

/** Opens the imprint and pauses an active game. @returns {void} */
function openImprint() {
    wasPausedBeforeModal = window.isGamePaused;
    if (world && !world.gameFinished) pauseGameForModal();
    document.getElementById("imprint-modal").classList.remove("hidden");
}

/** Closes the imprint and restores the previous pause state. @returns {void} */
function closeImprint() {
    document.getElementById("imprint-modal").classList.add("hidden");
    if (world && !world.gameFinished && !wasPausedBeforeModal) resumeGameAfterModal();
}

/** Pauses gameplay while a modal is open. @returns {void} */
function pauseGameForModal() {
    window.isGamePaused = true;
    world.keyboard.reset();
    updatePauseButton();
}

/** Resumes gameplay after closing a modal. @returns {void} */
function resumeGameAfterModal() {
    window.isGamePaused = false;
    updatePauseButton();
}

/** Connects all permanent interface buttons. */
function bindButtonEvents() {
    bindClick("fullscreen-btn", fullscreenGame);
    bindClick("restart-btn", restartGame);
    bindClick("mute-btn", toggleMute);
    bindClick("start-game-btn", startGame);
    bindClick("pause-btn", togglePause);
}

/** Connects one click handler to an element. */
function bindClick(elementId, handler) {
    document.getElementById(elementId)?.addEventListener("click", handler);
}

/** Starts a fresh game and displays the game controls. */
function startGame() {
    stopCurrentWorld();
    resetPauseState();
    hideStartScreen();
    hideEndScreen();
    showGameInterface();
    world = new World(canvas);
}

/** Stops the current game instance when one exists. */
function stopCurrentWorld() {
    world?.stop();
    world = null;
}

/** Starts the game again immediately after an end screen. @returns {void} */
function replayGame() {
    startGame();
}

/** Returns to the start screen. */
function restartGame() {
    stopCurrentWorld();
    resetPauseState();
    hideEndScreen();
    hideGameInterface();
    showStartScreen();
}

/** Resets pause state and closes the pause overlay. */
function resetPauseState() {
    window.isGamePaused = false;
    updatePauseButton();
    hidePauseOverlay();
}

/** Displays all controls required during gameplay. */
function showGameInterface() {
    document.querySelector(".game-actions")?.classList.remove("hidden");
    document.querySelector(".mobile-controls")?.classList.remove("hidden");
}

/** Hides controls that are not required on the start screen. */
function hideGameInterface() {
    document.querySelector(".game-actions")?.classList.add("hidden");
    document.querySelector(".mobile-controls")?.classList.add("hidden");
}

/** Toggles fullscreen mode for the page. */
function fullscreenGame() {
    const target = document.querySelector(".page") || document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else target.requestFullscreen?.();
}

/** Toggles audio and saves the choice in local storage. */
function toggleMute() {
    isMuted = !isMuted;
    window.isMuted = isMuted;
    localStorage.setItem("elPolloLocoMuted", String(isMuted));
    updateMuteButton();
    world?.sound.setMuted(isMuted);
}

/** Updates the mute button label. */
function updateMuteButton() {
    const button = document.getElementById("mute-btn");
    if (button) button.textContent = isMuted ? "Unmute" : "Mute";
}

/** Pauses or resumes the current game. */
function togglePause() {
    if (!world || world.gameFinished) return;
    window.isGamePaused = !window.isGamePaused;
    world.keyboard.reset();
    updatePauseButton();
    togglePauseOverlay();
}

/** Shows the pause overlay only while the game is paused. */
function togglePauseOverlay() {
    if (window.isGamePaused) showPauseOverlay();
    else hidePauseOverlay();
}

/** Updates the pause button label. */
function updatePauseButton() {
    const button = document.getElementById("pause-btn");
    if (button) button.textContent = window.isGamePaused ? "Resume" : "Pause";
}

/** Connects the four touch controls. */
function bindMobileControls() {
    bindHoldButton("btn-left", "LEFT");
    bindHoldButton("btn-right", "RIGHT");
    bindHoldButton("btn-jump", "SPACE");
    bindHoldButton("btn-throw", "THROW");
}

/** Connects press and release events to one touch control. */
function bindHoldButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    bindControlEvents(button, keyName, ["pointerdown"], true);
    bindControlEvents(button, keyName, ["pointerup", "pointercancel", "pointerleave"], false);
}

/** Registers multiple pointer events for one keyboard state. */
function bindControlEvents(button, keyName, eventNames, value) {
    eventNames.forEach((eventName) => {
        button.addEventListener(eventName, (event) => {
            event.preventDefault();
            setKeyboardState(keyName, value);
        });
    });
}

/** Updates a key state in the active world. */
function setKeyboardState(keyName, value) {
    if (world?.keyboard) world.keyboard[keyName] = value;
}

/** Hides the start screen. */
function hideStartScreen() {
    document.getElementById("start-screen").classList.add("hidden");
}

/** Displays the start screen. */
function showStartScreen() {
    document.getElementById("start-screen").classList.remove("hidden");
}

/** Hides and resets the end screen. */
function hideEndScreen() {
    const screen = document.getElementById("end-screen");
    screen?.classList.add("hidden");
    screen?.classList.remove("won", "lost");
}

/** Displays the pause overlay. */
function showPauseOverlay() {
    document.getElementById("pause-overlay")?.classList.remove("hidden");
}

/** Hides the pause overlay. */
function hidePauseOverlay() {
    document.getElementById("pause-overlay")?.classList.add("hidden");
}
