// ---------------------------------------------------------------------------
// GameScene.js
// Hauptszene: orchestriert Spawn-Logik, Objekte und UI.
// Enthält keine Render- oder Input-Details – diese liegen in den Entities.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES, SPAWN } from './config.js';
import { createTextures } from './TextureFactory.js';
import { ClickableObject } from './ClickableObject.js';
import { UI } from './UI.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });  // Name der Scene, wird gebraucht
    
    // Private Objekte die nur in diesem Objekt verwendet werden dürfen.
    this._objects = [];
    this._spawnTimer = null;
  }

  // Lifecycle:
  // Jede Phaser Szene hat das, so Teilt sich die GameEngine die einzelnen
  // Frames auf. Zuerst wird `create()` automatisch aufgerufen, dann in
  // jedem neuen Frame wird `update()` aufgerufen.
  create() {
    this._drawBackground();
    createTextures(this);

    this._ui = new UI(this);

    // Spawn-Timer starten
    this._spawnTimer = this.time.addEvent({
      delay: SPAWN.intervalMs,
      callback: this._spawnObject,
      callbackScope: this,
      loop: true,
    });

    // Ersten Schwung sofort spawnen
    for (let i = 0; i < 4; i++) this._spawnObject();
  }

  update(_time, delta) {
    const deltaSeconds = delta / 1000;

    // Alle lebenden Objekte nach unten bewegen
    for (let i = this._objects.length - 1; i >= 0; i--) {
      const obj = this._objects[i];

      if (!obj.alive) {
        // Bereits per Klick erledigt – aus Liste entfernen
        this._objects.splice(i, 1);
        continue;
      }

      const newY = obj.getY() + SPAWN.fallSpeed * deltaSeconds;
      obj.setY(newY);

      // Objekt ist unten aus dem Bild → entfernen (Punktabzug möglich)
      if (newY > GAME.height + 40) {
        obj.destroy();
        this._objects.splice(i, 1);
      }
    }
  }

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

  _spawnObject() {
    // Das ist ein Funktion-Guard: Wenn es mehr Objekte schon in der Szene gibt, wie die 
    // maximale Anzahl an Objekten, dann wird einfach nichts gemacht.
    if (this._objects.length >= SPAWN.maxObjects) return;

    const { width } = this.scale;

    // Zufälligen Typ wählen
    const typeDef = Phaser.Utils.Array.GetRandom(OBJECT_TYPES);

    // Zufällige X-Position mit Randabstand
    const x = Phaser.Math.Between(
      SPAWN.marginX,
      width - SPAWN.marginX,
    );

    // Startet knapp über dem oberen Rand
    const y = 10

    console.log("Neues Objekt erstellen")

    // Hier wird das neue Objekt erstellt und zur Szene hinzugefügt.
    const obj = new ClickableObject(this, x, y, typeDef.key, (clicked) => {
      this._ui.addPoints(clicked.points);
    });

    // Fügt das Objekt in die Liste von dieser Szene ein, so wissen wir wie viele Objekte aktuell auf dem Bildschirm sind.
    this._objects.push(obj);
  }
}
