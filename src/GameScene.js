// ---------------------------------------------------------------------------
// GameScene.js
// Hauptszene: orchestriert Spawn-Logik, Objekte und UI.
// Enthält keine Render- oder Input-Details – diese liegen in den Entities.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME } from './config.js';
import { createTextures } from './TextureFactory.js';
import { ClickableObject } from './ClickableObject.js';
import { UI } from './UI.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle:
  // Jede Phaser Szene hat das, so Teilt sich die GameEngine die einzelnen
  // Frames auf. Zuerst wird `create()` automatisch aufgerufen, dann in
  // jedem neuen Frame wird `update()` aufgerufen.
  create() {
    this._drawBackground();
    createTextures(this);

    this._ui = new UI(this);

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle', x: number, y: number }
    const PLACED_OBJECTS = [
      { key: 'star',   x: 100, y: 150 },
      { key: 'gem',    x: 320, y: 240 },
      { key: 'circle', x: 540, y: 350 },
      { key: 'circle', x: 560, y: 350 },
    ];

    // Alle manuell definierten Objekte aus der Config platzieren
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
