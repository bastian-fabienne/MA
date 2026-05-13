// ---------------------------------------------------------------------------
// config.js
// Zentrale Spielkonfiguration – alle Magic Numbers an einem Ort.
// ---------------------------------------------------------------------------

export const GAME = {
  width: 640,
  height: 480,
  backgroundColor: '#161649',
};

// Objekt-Typen mit ihren Texturnamen und Punktwerten.
// image: true  → Textur wird per preload() aus public/assets/images/ geladen.
// size wird für programmatisch erzeugte Texturen genutzt (image-Typen ignorieren es).
export const OBJECT_TYPES = [
  { key: 'star',    points: 30, size: 60 },
  { key: 'gem',     points: 20, size: 50 },
  { key: 'circle',  points: 10, size: 48 },
  { key: 'coin',    points: 15, image: true },
];

// Hier kannst du die Objekte manuell platzieren.
// Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
export const PLACED_OBJECTS = [
  { key: 'star',   x: 100, y: 150 },
  { key: 'gem',    x: 320, y: 240 },
  { key: 'circle', x: 540, y: 350 },
  { key: 'coin',   x: 200, y: 350 },
];

export const COLORS = {
  star:   0xfbbf24,   // Gold
  gem:    0xa78bfa,   // Lila
  circle: 0x60a5fa,   // Blau
};
