# EL Pollo Loco

A 2D platformer built with Vanilla JavaScript using an object-oriented architecture. This project was created during the Developer Academy to apply OOP concepts such as inheritance and encapsulation in a practical environment instead of only learning them in theory.

## Project Approach

Before writing any code, I first planned the project structure. I created separate folders for classes (`classes`), level data (`levels`), and utility functions (`utils`) to keep the project organized and maintainable as it grew.

While implementing the game characters, I noticed that the Character, Chicken, BabyChicken, and Endboss shared many common features such as position, movement, gravity, and collision detection. Instead of duplicating this logic, I created a shared base class called `MoveableObject`, which all moving entities inherit from. This follows the DRY principle, reduces duplicated code, and makes debugging easier because movement-related fixes only need to be made in one place.

For the Endboss, I wanted to avoid a simple back-and-forth patrol from the beginning. Instead, the boss remains idle until the player enters a trigger radius. Once activated, it patrols faster than the normal chickens without constantly chasing the player, making the fight more predictable and balanced.

My workflow for every feature is always the same: first, I think about the best implementation and the reasoning behind it, and only then do I start coding. Roughly 70–80% of the development time is spent planning and debugging, while 20–30% is spent writing code.

## Current Features

### Core Architecture

* Object-oriented class hierarchy (`DrawableObject` → `MoveableObject` → `Character` / `Chicken` / `BabyChicken` / `Endboss`)
* Camera smoothly follows the player and respects the level boundaries
* JSDoc documentation for all classes and complex methods

### Character

* Walking, jumping, and collision detection
* Damage cooldown prevents continuous damage while touching enemies (300 ms)
* Knockback after side collisions with enemies
* Automatic idle animation after 7 seconds of inactivity
* Wakes up immediately after movement, taking damage, or throwing a bottle
* Health bar updates in 20% steps

### Collectibles & Combat

* Collectible coins and bottles with accurate collision boxes
* Bottle throwing system with a 700 ms cooldown
* Normal chickens and baby chickens can be defeated by jumping on them or hitting them with bottles

### Endboss

* Starts inactive and is triggered when the player enters a defined radius
* Moves faster than regular chickens after activation
* Uses separate hurt and death animations
* Has its own health bar
* Takes damage from bottle hits

### Audio

* Centralized `SoundManager` for handling all sound effects
* Jump, coin, throw, hit, splash, game over, and victory sounds
* Looping background music that automatically stops when the game ends or the player returns to the main menu
* Mute button correctly enables and disables all sounds

### Screens & User Interface

* Start screen, Game Over screen, and Victory screen with individual background images
* Consistent button design (Start, Fullscreen, Main Menu, Mute, Pause)
* In-game controls remain hidden until the game starts
* Fullscreen mode scales the entire game while keeping it centered
* Mobile touch controls support different screen sizes
* Keyboard controls are automatically hidden on touch devices
* Rotation hint for portrait mode on small screens
* The page no longer scrolls accidentally on mobile devices
* Imprint accessible through a dedicated button

### Additional Features

* Character death animation plays once and remains on the final frame
* No `console.log()` statements in the production code

## Technologies

* Vanilla JavaScript (Object-Oriented Programming)
* HTML5 Canvas
* CSS3
