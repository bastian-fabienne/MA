// ---------------------------------------------------------------------------
// Atelier.js
// ---------------------------------------------------------------------------

import Phaser from "phaser";
import { ClickableObject } from "../ClickableObject.js";
import { GAME, OBJECT_TYPES } from "../config.js";
import { store } from "../Store.js";
import { UI } from "../UI.js";
import { Dialog } from '../Dialog.js';
import { ZolliScene } from "./ZolliScene.js";
//importiert Phaser-Bibliothek, Spiel-Konfigurationen, UI, usw.)

export class AtelierScene extends Phaser.Scene {
  constructor() {
    super({ key: "AtelierScene" });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle Schritt 1: Assets laden.
  // Phaser ruft preload() automatisch vor create() auf.
  // Hier werden alle Bild-Typen aus public/assets/images/ geladen.
  preload() {
    for (const type of OBJECT_TYPES) {
      this.load.image(type.key, `/assets/images/${type.key}.png`);
    }
   
    this.load.image(
        "Atelier",
        "/assets/images/Atelier.png"
    );
    this.load.image("Martha", "/assets/images/Martha.png");
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this._objects = [];
    this.add.image(640 / 2, 480 / 2, "Atelier");

    this._ui = new UI(this);
    this._dialog = new Dialog(this);

    this._addBackButton();
    this._setupInventoryToggle();
    


    const PLACED_OBJECTS = [
      {key: 'Martha_full', 
        x: 640 / 2.6, 
        y: 480 / 1.35,
        size: 1.5,
        speakerName: 'Martha',
        speakerImage: "Martha",
        dialog: () => {
        const count = store.getTalkCount('Martha_full');
         if ((store.getState().Feder?.collected ?? 0) > 1 ) {
          return [
            "!ITEM:Martha",
            "Na geh schon.",
            "Du willst doch auf Locarno."
        ]
      }
        if ((store.getState().Feder?.collected ?? 0) > 0) {
        return [
          "Hast du schon eine Feder",
          "für die Larve gefunden?",
        ]
        }
          if ((store.getState().Schluessel?.collected ?? 0) > 0) {
            return[
              "Mein Mann Otto?",
              "Nach Locarno?",
              "!ITEM:OttoAbt",
              "Bitte, Martha.",
              "Die Basler Fasnacht ist gerade",
              "erst zuendegegangen.",
              "Jetzt ist der perfekte Moment",
              "einmal in den Urlaub zu fahren.",
              "!ITEM:Martha",
              "Du hast noch Arbeit offen.",
              "Du muss erst den Pierro fertigmachen.",
              "Das ist die Larve auf dem Tisch.",
              "Danach darfst du los.",
              "Ihr fehlt noch eine Pfauenfeder.",
              "Im Zoo findest du sicher eine.",
              
            ]
          } 
        return [
            "Hallo.",
            "Ich bin Ottos' Frau, Martha Abt.",
        ]
      }
      },

      {key: 'Larve', 
        x: 640 / 1.75, 
        y: 480 / 1.70,
        speakerName: 'Larve',
        speakerImage: "OttoAbt",
       dialog: (clicked) => {
        const count = store.getTalkCount('Larve');
         if ((store.getState().Feder?.collected ?? 0) > 1 ) {
          return [
            "!ITEM:Martha",
            "Na geh schon.",
            "Du willst doch auf Locarno."
        ]
      }

      if ((store.getState().Feder?.collected ?? 0) > 0) {
        return store.collect('Feder'),
        [
            "!ITEM:Feder",
            "Du hast Martha die Feder gegeben.",
            "!ITEM:Martha",
            "Vielen Dank.",
            "Den Rest schaffe ich",
            "auch ohne Otto.",
            "Jetzt darf er nach Locarno.",
            "!ITEM:OttoAbt",
            "Hurra!",
            "Auf nach Locarno!",
            "",
            "!ITEM:Martha",
            "Otto...",
            "Willst du wirklich so",
            "nach Locarno?",
            "!ITEM:OttoAbt",
            "Stimmt!",
            "Ich muss unbedingt",
            "meinen Lieblingsmantel mitnehmen.",
            "Er ist noch im Nähatelier",
            "zur Reperatur.",
            "Es ist das gelbe Haus",
            "beim Marktplatz.",
            "!ITEM:Martha",
            "Na dann los.",
        ]
      }
              if ((store.getTalkCount('Martha') > 0) || (store.getTalkCount('Larve') > 0)) {
               clicked.sceneName = "ZolliScene";
               clicked.sceneClass = ZolliScene;
               return [
                 "!ITEM:OttoAbt",
                 "Meine Pierrot-Larve.", 
                 "Sie ist fast fertig.",
                 "Ihr fehlt nur noch die Pfauenfeder.",
                 "Du findest sicher eine im Zolli.",
                 "Ich bringe dich hin.",
               ];
        } 
          else {
               clicked.sceneName = "ZolliScene";
               clicked.sceneClass = ZolliScene;
             return [
                "!ITEM:Martha",
                "Die muss heute noch fertig ferden.",
                "!ITEM:OttoAbt",
                 "Mist das habe ich ganz vergessen!",
                 "Ich muss die Pierrot Larve dringend",
                 "fertig machen.",
                 "Ihr fehlt nur noch die Pfauenfeder.",
                 "Das geht schnell.",
                 "Du findest sicher eine im Zolli.",
                 "Ich bringe dich hin.",
               ];
      }
      }
      }
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
    btn.on("pointerdown", () => this.scene.start("MaertScene"));
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