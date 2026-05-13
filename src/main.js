// ---------------------------------------------------------------------------
// main.js
// Einstiegspunkt: Phaser-Konfiguration und Game-Initialisierung.
// Keine Spiellogik – nur Framework-Setup.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';  // Importiert die GameEngine
import { GAME } from './config.js';   // Importiert Konfigurationen
import { GameScene } from './GameScene.js'; // Importiert die erste Szene

const config = {
  type: Phaser.CANVAS,    // Kann auch Phaser.WEBGL verwenden, bessere Performance
  canvas: document.getElementById('game-canvas'),   // In welches Element das Spiel geladen wird
  width: GAME.width,
  height: GAME.height,
  backgroundColor: GAME.backgroundColor,
  scene: GameScene, // Welche Scene im Spiel geladen wird
};

// Startet das Spiel mit der oben vorgegebenen Konfiguration
new Phaser.Game(config);
