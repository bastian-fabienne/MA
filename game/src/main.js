// ---------------------------------------------------------------------------
// main.js
// Einstiegspunkt: Phaser-Konfiguration und Game-Initialisierung.
// Keine Spiellogik – nur Framework-Setup.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';  // Importiert die GameEngine
import { GAME } from './config.js';   // Importiert Konfigurationen; WICHTIG: Mehr dazu lesen in config.js
import { GameScene } from './scenes/GameScene.js'; // Importiert die erste Szene
import { InventoryScene } from './scenes/InventoryScene.js';

const config = {
  type: Phaser.AUTO,      // AUTO: bevorzugt WebGL, fällt auf Canvas zurück
  parent: 'game-container', // Phaser erstellt das Canvas selbst in diesem Element
  width: GAME.width,
  height: GAME.height,
  backgroundColor: GAME.backgroundColor,
  physics: {
    default: 'arcade',
    arcade: {
      debug: GAME.debug,  // Wenn true: Bounding Boxes und Positionen werden eingezeichnet
    },
  },
  // InventoryScene wird als Overlay über allen anderen Szenen gestartet,
  // daher muss sie von Anfang an registriert sein.
  scene: [GameScene, InventoryScene],
};

// Startet das Spiel mit der oben vorgegebenen Konfiguration
new Phaser.Game(config);
