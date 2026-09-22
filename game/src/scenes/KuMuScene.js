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
        `/assets/images/KuMu.png`,
      );
    }
    this.load.image(
        "KuMu_Türe", 
        `/assets/images/KuMu_Türe.png`,
      );
    this.load.image(
      "Rektor",
      `/assets/images/Rektor.png`
    );
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this._objects = [];
    this.add.image(640 / 2, 480 / 2, "KuMuOhniTüre1");

    this._ui = new UI(this);
    this._dialog = new Dialog(this);

    this._addBackButton();
    this._setupInventoryToggle();

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      {key: "Rektor",
        speakerName: "Museumsleiter",
        speakerImage: "Rektor",
        x: GAME.width / 2.5,
        y: GAME.height / 1.4,
        size: 2,
        dialog: () => {
        const count = store.getTalkCount('Museumsleiter');
          if (store.getTalkCount('Museumsleiter') > 0) {
          return [
            "Geht doch.",
            "Also ich brauche deine Hilfe.",
            "Uns wurde ein Kunstwerk gestohlen.",
            "Eine Gusskarte aus dem Jahre 1967.",
            "Der Künstler ist der Basler",
            "Larvenbauer Otto Abt",
            "Die Türe, durch die du gerade",
            "gehen wolltest,",
            "führt dich in meine Zeitmaschine.",
            "Da wolltest du ja sowieso hin.",
            "Finde seine Karte aus Locarno",
            "und bring sie zu mir zurück",
            "",
            "",
            "Bitte.",
          ]
          }
        return [
          "Guten Tag",
          "Wilkommen im Basler Kunstmuseum",
          "Das du uns gerade jetzt besuchst,",
          "muss Schicksal sein.",
          "Uns wurde ein Kunstwerk gestohlen!",
          "Eine Grusskarte aus dem Jahre 1967",
          "Sie war von dem basler Künstler und",
          "Larvenbauer Otto Abt und handbemalt.",
          "Ich würde ja auf die",
          "Polizei vertrauen...",
          "Aber wieso warten,",
          "wenn man eine Zeitmaschine hat?",
          "Du siehst naiv- ähm abendteuerlich",
          "genug aus, um sie auszutesten!",
          "Klicke einfach auf die graue Türe",
          "hinter mir, um einzusteigen.",
          "Keine Sorge, Ort und Zeit sind schon",
          "eingestellt.",
          "Ich schicke dich direkt nach Basel",
          "ins Jahre 1967.",
          "Otto sollte dort in der Nähe sein.",
          "Vielleicht braucht er etwas Überzegung,",
          "nach Locarno zu gehen.",
          "Ich habe aber volles Vertrauen in dich.",
          "Tu was du für nötig hälst.",
          "Bereit, wenn du es bist.",
        ]
      }
     },
      
     {key: "KuMu_Türe",
      speakerName: "Museumsleiter",
      speakerImage: "Rektor",
      x: 670 / 2,
      y: 565 / 2,
      dialog: (clicked) => {
      //if (store.getTalkCount('Museumsleiter') > 0) {
      return clicked.sceneName = "MaertScene",
        clicked.sceneClass = MaertScene,
        ["Suche den Künstler Otto Abt",
        "",
        "!ITEM:Grusskarte",
        "     und finde seine Grusskarte",
        "     Viel Glück!",
        "     Auf ins Jahre 1967!",]
        }
      //return [
      //  "",
       // "...",
       // "Willst du nicht erst wissen,",
      //  "in was du dich da einlässt?",
      //]
      //}
      },

    ];
  


    // Alle Objekte aus config.js an ihren festen Positionen platzieren
   for (const { key, x, y, dialog, speakerName, speakerImage, size} of PLACED_OBJECTS) {
         this._placeObject(key, x, y, dialog, speakerName, speakerImage, size);
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
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.scene.isActive('InventoryScene')) {
        this.scene.stop('InventoryScene');
      } else {
        this.scene.launch('InventoryScene');
      }
    });
  }

  // Erzeugt einen klickbaren "Zurück"-Button, der zur GameScene navigiert.
  _addBackButton() {
    const btn = this.add
      .text(16, 16, "Zurück", {
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
    
    _startScene(sceneName, sceneClass) {
      this.scene.start(sceneName);
  }


    
  _placeObject(key, x, y, dialogLines, speakerName, speakerImage, size) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };




      if (dialogLines) {
        const lines = typeof dialogLines === 'function' ? dialogLines(clicked) : dialogLines;

        if (speakerName) {
           store.timesTalked(speakerName);
          }

           this._dialog.show(lines, goToLevel, speakerName, speakerImage);
           }

       else {
        goToLevel();
       }
        
    }, size,
    );
     
    this._objects.push(obj);
   
     const typeDef = OBJECT_TYPES.find(t => t.key === key);
    if (typeDef?.collectible) {
      store.registerType(key, this._objects.filter(o => o.textureKey === key).length);
    }
  }
}