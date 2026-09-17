// ---------------------------------------------------------------------------
// ZolliScene.js
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';
import { store } from '../Store.js';
import { Dialog } from '../Dialog.js';

export class ZolliScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ZolliScene' });
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

       // Alle aktuell platzierten Objekte in der Szene
       this._objects = [];
   
     
       this.load.image(
           "Zolli",
           "/assets/images/Zolli.png",
       );
      
       const SPEAKER_IMAGES = [
    "Zoowärter_cut",
    "Glacema_cut",
    "Ballmaa",
    "BallKind",
    ];

     for (const key of SPEAKER_IMAGES) {
    this.load.image(
    key,
    `/assets/images/${key}.png`,
    );
   }

      }
     // Lifecycle Schritt 2: Szene aufbauen.
     // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
     create() {
       this.add.image(640 / 2, 480 / 2, "Zolli");
   
       this._ui = new UI(this);
       this._dialog = new Dialog(this);
   
       this._addBackButton();
       this._setupInventoryToggle();
   

      const PLACED_OBJECTS = [
         {key: 'Zoowärter_full', 
           x: 640 / 4, 
           y: 480 / 1.8,
           size: 1,
           speakerName: "Zoowerter",
           speakerImage: "Zoowärter_cut",
           dialog: () => {
            const count = store.getTalkCount('Zoowärter');

            if ((store.getState().Eis?.collected ?? 0) > 0 ) {
                store.registerType('Eis', 5)
                return[
                 "!ITEM:Eis",
                 "Du hast dem Wärter das Eis gegeben.",
                 "Er scheint abgelenkt...",
                 "",
               ]
              } 

                return [
                 "Stop!",
                 "",
                 "Besucher dürfen das Pfauengehege",
                 "nicht betreten!",
                 "Tut mir leid.",
                  "",
                 "",
                  "...",
                 "Mann ist mir heiss!",
                  "Jetzt ein leckeres Eis wäre himmlisch.",
                 ]
             }
          },

         {key: 'Glacema_full',
            x: 640 / 1.85,
            y: 480 / 2,
            size: 0.7,
           speakerName: "Eismann",
           speakerImage: "Glacema_cut",
           dialog: () => {
           const count = store.getTalkCount('Glacema');
            if ((store.getState().Eis?.collected ?? 0) > 0) {
                return[
                 "Noch ein Eis?",
                 "Du hast doch schon eins!",  
               ]
              } 
           return [
              "Eis!",
              "Leckeres Eis!",
              "Möchtest du ein Eis kaufen?",
              "Wie du hast kein Geld?",
              "Kein Geld, kein Eis.",
            ]
         },
        },

        {key: 'BallKind',
          x: 640 / 1.59,
          y: 480 / 1.42,
          size: 1,
          speakerName: "Kleines Kind",
          speakerImage: "BallKind",
          dialog: () => {
         const count = store.getTalkCount('BallKind');
          if ((store.getState().Ball?.collected ?? 0) > 0) {
          return [
            "Juhu ich habe meinen Ball!",
          ]
          }
         return [
          "Oh nein!",
          "Ich habe meinen Ball verloren!",
          ]
         }
        },
        
         {key: 'Ballmaa',
          x: 640 / 1.5,
          y: 480 / 1.5,
          size: 1,
          speakerName: "Vater",
          speakerImage: "Ballmaa",
          dialog: () => {
         const count = store.getTalkCount('Ballmaa');
         if ((store.getState().Ball?.collected ?? 0) > 0) {
            store.registerType('Eis', 1)
            store.collect('Eis') 
          return [
            "Wie kann ich dir nur danken?",
            "",
            "Du möchtest ein Eis?",
            "Ich kaufe dir eins!",
            "!ITEM:Eis",
            "Der Mann hat dir ein Eis gekauft.",
          ]
          }
         return [
          "Oh nein!",
          "Mein hat seinen Ball verloren!",
          "Ich wäre dir sehr dankbar,",
          "Wenn du ihn finden würdest.",
          ]
         }
        },

        {key: 'Ball',
          x: 648 / 2.18,
          y: 480 / 2.13,
          size: 0.8,
          speakerImage: "Ball",
          speakerName: "Neues Item",
          dialog: () => {
            const count = store.getTalkCount('Ball');
            store.registerType('Ball', 1)
            store.collect('Ball') 
            return [
            "!ITEM:Ball",
            "Du hast einen Ball gefunden!",
          ] 
        }
      },
        
      ]
      
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
         .text(16, 16, "Exit", {
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
   
   
  _placeObject(key, x, y, dialogLines, speakerName, speakerImage, size) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };




      if (dialogLines) {
        const lines = typeof dialogLines === 'function' ? dialogLines() : dialogLines;

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
      store.registerType(key, this._objects.filter(o => o.textureKey === key).length);
  }
}