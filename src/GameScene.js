// ---------------------------------------------------------------------------
// GameScene.js
// Hauptszene: lädt Assets, erzeugt programmatische Texturen und platziert
// alle Spielobjekte anhand der in config.js definierten PLACED_OBJECTS-Liste.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES, PLACED_OBJECTS } from './config.js';
import { createTextures } from './TextureFactory.js';
import { ClickableObject } from './ClickableObject.js';
import { UI } from './UI.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle Schritt 1: Assets laden.
  // Phaser ruft preload() automatisch vor create() auf.
  // Hier werden alle Bild-Typen aus public/assets/images/ geladen.
  preload() {
    for (const type of OBJECT_TYPES) {
      if (type.image) {
        this.load.image(type.key, `/assets/images/${type.key}.png`);
      }
    }
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this._drawBackground();
    createTextures(this);  // Programmatische Texturen (star, gem, circle) erzeugen

    this._ui = new UI(this);

    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    for (const { key, x, y } of PLACED_OBJECTS) {
      this._placeObject(key, x, y);
    }
  }

  // update() wird hier nicht benötigt, da die Objekte feststehen.

  // ── Private Hilfsmethoden ─────────────────────────────────────────────────

  _drawBackground() {
    // Lies Höhe und Breite aus dem Spiel (nicht die Configversion, könnte sich ja im Spiel ändern...)
    const { width, height } = this.scale;

    // Füge eine neue Grafik zur Szene hinzu
    const bg = this.add.graphics();

    // Setze Farbe in der gezeichnet wird
    bg.fillStyle(Phaser.Display.Color.ValueToColor(GAME.backgroundColor).color, 1);
    
    // Fülle ein Rechteck mit der gesetzten Farbe
    bg.fillRect(0, 0, width, height);
  }

  _placeObject(key, x, y) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      this._ui.addPoints(clicked.points);
    });

    // Fügt das Objekt in die Liste von dieser Szene ein, so wissen wir wie viele Objekte aktuell auf dem Bildschirm sind.
    this._objects.push(obj);
  }
}
