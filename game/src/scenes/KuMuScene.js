// ---------------------------------------------------------------------------
// KuMuScene.js
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { ClickableObject } from "../ClickableObject.js";
import { GAME, OBJECT_TYPES } from "../config.js";
import { store } from "../Store.js";
import { UI } from "../UI.js";
import { Dialog } from '../Dialog.js';
import { MaertScene } from "./MaertScene.js";
//importiert Phaser-Bibliothek, Spiel-Konfigurationen, UI, usw.)

export class KuMuScene extends Phaser.Scene {
  constructor() {
    super({ key: "KuMuScene" });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle Schritt 1: Assets laden.
  // Phaser ruft preload() automatisch vor create() auf.
  // Hier werden alle Bild-Typen aus public/assets/images/ geladen.
  preload() {
    for (const type of OBJECT_TYPES) {
      this.load.image(type.key, `/assets/images/${type.key}.png`);
      // REVIEW: Die Bilder sind in einem weiteren Unterordner, deshalb haben
      // wir sie nicht gefunden, wenn die "Hintergruende" einfügen, dann
      // funktioniert es.
      this.load.image(
        "KuMuOhniTüre1",
        `/assets/images/Hintergruende/KuMuOhniTüre1.png`,
      );
    }
    this.load.image(
        "KuMu_Türe", 
        `/assets/images/KuMu_Türe.png`,
      );
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this.add.image(640 / 2, 480 / 2, "KuMuOhniTüre1");
    this._ui = new UI(this);
    this._dialog = new Dialog(this);
    this._addBackButton();
    this._addMaertButton();
    this._setupInventoryToggle();

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      {
         key: "KuMu_Türe",
          x: 670 / 2, 
          y: 565 / 2,
        }
    ];
    for (const { key, x, y } of PLACED_OBJECTS) {
    this._placeObject(key, x, y);
}
    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    // REVIEW: Ich denke das können Sie entfernen, sieht nicht so aus als
    // würden Sie das in dieser Szene verwenden
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
    bg.fillStyle(
      Phaser.Display.Color.ValueToColor(GAME.backgroundColor).color,
      1,
    );

    // Fülle ein Rechteck mit der gesetzten Farbe
    bg.fillRect(0, 0, width, height);
  }

  // Leertaste öffnet / schließt das Inventar-Overlay.
  _setupInventoryToggle() {
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.scene.isActive("InventoryScene")) {
        this.scene.stop("InventoryScene");
      } else {
        this.scene.launch("InventoryScene");
      }
    });
  }

  // Erzeugt einen klickbaren "Zurück"-Button, der zur GameScene navigiert.
  _addBackButton() {
    const btn = this.add
      .text(16, 16, "← Zurück", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#333366",
        padding: { x: 10, y: 6 },
      })
      .setDepth(20)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ color: "#ffff00" }));
    btn.on("pointerout", () => btn.setStyle({ color: "#ffffff" }));
    btn.on("pointerdown", () => this.scene.start("GameScene"));
  }

  _addMaertButton() {
    const butn = this.add
      .text(160, 300, "Märt", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#333322",
        padding: { x: 3, y: 6 },
      })
      .setDepth(20)
      .setInteractive({ useHandCursor: true });

    butn.on("pointerover", () => butn.setStyle({ color: "#ffff00" }));
    butn.on("pointerout", () => butn.setStyle({ color: "#ffffff" }));
    butn.on("pointerdown", () => {
  this.scene.start('MaertScene');
});
  };

  _placeObject(key, x, y) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      this._ui.addPoints(clicked.points);


      // Wenn alle Objekte weggeklickt wurden, zurück zur GameScene.
      // delayedCall wartet bis die Pop-Animation (180ms) fertig ist.
      if (this._objects.every(obj => !obj.alive)) {
        this.time.delayedCall(300, () => this.scene.start('MaertScene'));
      }
    });

    // Static Physics Body hinzufügen, damit Arcade Physics die Bounding Box
    // kennt und im Debug-Modus einzeichnen kann. true = statisch (bewegt sich nicht).
    this.physics.add.existing(obj.sprite, true);

  }
}