// ---------------------------------------------------------------------------
// config.js
// Zentrale Spielkonfiguration – alle Magic Numbers an einem Ort.
// ---------------------------------------------------------------------------

import { CoinScene } from "./scenes/CoinScene";
import { StarScene } from "./scenes/StarScene";

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
