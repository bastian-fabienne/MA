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



export const COLORS = {
  star:   0xfbbf24,   // Gold
  gem:    0xa78bfa,   // Lila
  circle: 0x60a5fa,   // Blau
};
