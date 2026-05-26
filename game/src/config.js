// ---------------------------------------------------------------------------
// config.js
// Zentrale Spielkonfiguration – alle Magic Numbers an einem Ort.
// Diese Datei wird verwendet, um alle Werte die in verschiedenen Dateien
// verwendet werden, zu speichern. So gibt es weniger Probleme wenn ein Wert
// einmal geändert werden muss. Zusätzlich haben die Werte im Code dann einen
// Namen, statt nur eine Zahl, das macht den Code besser lesbar.
// ---------------------------------------------------------------------------

import { CoinScene } from "./scenes/CoinScene";
import { StarScene } from "./scenes/StarScene";

// In diesem Objekt wird alles definiert was mit dem Spiel zu tun hat.
export const GAME = {
  width: 640,
  height: 480,
  backgroundColor: '#161649',
  debug: true,  // Debug-Modus: Bounding Boxes und Positionen einzeichnen
};

// Objekt-Typen mit ihren Texturnamen und Punktwerten.
// image: true  → Textur wird per preload() aus public/assets/images/ geladen.
// size wird für programmatisch erzeugte Texturen genutzt (image-Typen ignorieren es).
export const OBJECT_TYPES = [
  { key: 'star', sceneName: "StarScene", sceneClass: StarScene },
  { key: 'coin', sceneName: "CoinScene", sceneClass: CoinScene },
];
