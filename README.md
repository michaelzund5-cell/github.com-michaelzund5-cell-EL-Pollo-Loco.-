# EL Pollo Loco

Ein 2D Jump-'n'-Run-Spiel in Vanilla JavaScript, objektorientiert aufgebaut. Entstanden als Lernprojekt bei der Developer Academy, um OOP-Konzepte (Vererbung, Kapselung) praktisch anzuwenden statt nur in der Theorie zu verstehen.

## Wie ich das Projekt angegangen bin

Bevor ich angefangen habe zu coden, habe ich mir zuerst die Ordnerstruktur überlegt: eigene Ordner für Klassen (`classes`), Level-Daten (`levels`) und Hilfsfunktionen (`utils`), damit das Projekt auch bei wachsendem Umfang übersichtlich bleibt.

Beim Aufbau der Spielfiguren ist mir aufgefallen, dass Charakter, Chicken, BabyChicken und Endboss viele gemeinsame Eigenschaften haben (Position, Bewegung, Schwerkraft, Kollision). Statt das für jede Figur einzeln zu schreiben, habe ich eine gemeinsame Basisklasse `MoveableObject` gebaut, von der alle erben. Das hält den Code kleiner, vermeidet Wiederholung (DRY) und macht Bugs leichter auffindbar – ein Fehler in der Bewegungslogik muss nur an einer Stelle gefixt werden, nicht in vier.

Mein Vorgehen pro Feature: zuerst überlegen, wie ich es angehe und warum genau so – erst danach coden. Grober Zeitaufwand liegt bei ca. 70–80 % Überlegen/Debuggen und 20–30 % tatsächlichem Tippen.

## Aktueller Stand

- Grundgerüst: Klassenstruktur mit Vererbung (`DrawableObject` → `MoveableObject` → `Character`/`Chicken`/`BabyChicken`/`Endboss`)
- Kamera folgt dem Charakter, Grenzen sauber an die Levelbreite gekoppelt
- Kollisionserkennung zwischen Charakter und Gegnern
- Hit-Cooldown: Charakter wird bei Gegnerkontakt nicht durchgehend, sondern nur alle 1 Sekunde beschädigt
- Lebensanzeige (Statusbar) oben links, zeigt den Energiestand des Charakters in 20%-Schritten
- Sammelbare Coins und Flaschen im Level platziert
- Wurfsystem: Flaschen sammeln und auf Gegner werfen
- Kampfsystem: Flaschentreffer und Sprung-auf-Gegner töten normale Chicken/BabyChicken
- Seitliche Gegnerberührung zieht weiterhin Energie ab (mit Cooldown)
- Eigener Endboss mit eigener Lebensanzeige, Hurt- und Death-Animation
- Endboss verliert Energie durch Flaschentreffer
- Character-Death-Animation läuft einmal durch und bleibt im letzten Bild stehen
- Game-Over- und You-Win-Bildschirm

## Was als Nächstes kommt

- Feinschliff an der Endboss-Statusbar-Position
- Mobile-Steuerung und Vollbild-Funktion (aktuell nur als leere Platzhalterdateien angelegt)
- Code-Kommentare an Klassen und komplexeren Methoden ergänzen, damit sich das Projekt bei wachsender Größe weiterhin schnell lesen lässt
- console.log-Reste im Produktivcode entfernen

## Technologien

Vanilla JavaScript (objektorientiert), HTML5 Canvas, CSS