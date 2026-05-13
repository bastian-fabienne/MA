// ---------------------------------------------------------------------------
// config.js
// Zentrale Spielkonfiguration – alle Magic Numbers an einem Ort.
// ---------------------------------------------------------------------------

export const GAME = {
  width: 640,
  height: 480,
  backgroundColor: '#161649',
};

// Objekt-Typen mit ihren Texturnamen und Punktwerten
export const OBJECT_TYPES = [
  { key: 'star',    points: 30, size: 60 },
  { key: 'gem',     points: 20, size: 50 },
  { key: 'circle',  points: 10, size: 48 },
];

export const SPAWN = {
  intervalMs: 1200,   // Millisekunden zwischen neuen Objekten
  maxObjects: 12,     // Maximale gleichzeitige Objekte auf dem Feld
  marginX: 60,        // Randabstand links/rechts beim Spawnen
  marginY: 60,        // Randabstand oben/unten beim Spawnen
  fallSpeed: 80,      // Pixel/Sekunde nach unten
};

export const COLORS = {
  star:   0xfbbf24,   // Gold
  gem:    0xa78bfa,   // Lila
  circle: 0x60a5fa,   // Blau
};
