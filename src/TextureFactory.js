// ---------------------------------------------------------------------------
// TextureFactory.js
// Erzeugt alle programmatischen Texturen einmalig in der Phaser-Textur-Registry.
// Texturen werden direkt per Canvas 2D API gezeichnet – das ist mit dem
// Canvas-Renderer am zuverlässigsten (kein RenderTexture-Umweg nötig).
// ---------------------------------------------------------------------------

import { COLORS, OBJECT_TYPES } from './config.js';

/** Wandelt eine Phaser-Hex-Farbe (0xRRGGBB) in einen CSS-Farbstring um. */
function toCSS(hex, alpha = 1) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >>  8) & 0xff;
  const b =  hex        & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Zeichnet einen 5-zackigen Stern auf einen Canvas-Kontext.
 */
function drawStar(ctx, cx, cy, outer, inner) {
  const points = 5;
  const step = Math.PI / points;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Zeichnet eine Diamant-/Edelstein-Form auf einen Canvas-Kontext.
 */
function drawGem(ctx, cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  const path = [
    [cx,        cy - hh      ],
    [cx + hw,   cy - hh * 0.3],
    [cx + hw,   cy + hh * 0.1],
    [cx,        cy + hh      ],
    [cx - hw,   cy + hh * 0.1],
    [cx - hw,   cy - hh * 0.3],
  ];
  ctx.beginPath();
  ctx.moveTo(path[0][0], path[0][1]);
  for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
  ctx.closePath();
  ctx.fill();

  // Glanz-Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  const shine = [
    [cx - hw * 0.6, cy - hh * 0.9],
    [cx,            cy - hh * 0.9],
    [cx - hw * 0.1, cy - hh * 0.2],
    [cx - hw * 0.7, cy - hh * 0.2],
  ];
  ctx.beginPath();
  ctx.moveTo(shine[0][0], shine[0][1]);
  for (let i = 1; i < shine.length; i++) ctx.lineTo(shine[i][0], shine[i][1]);
  ctx.closePath();
  ctx.fill();
}

/**
 * Registriert alle Spielobjekt-Texturen in der Phaser-Textur-Registry.
 * Muss einmalig in Scene.create() aufgerufen werden.
 * @param {Phaser.Scene} scene
 */
export function createTextures(scene) {
  const typeMap = Object.fromEntries(OBJECT_TYPES.map((t) => [t.key, t]));

  // ── STERN ────────────────────────────────────────────────────────────────
  if (!scene.textures.exists('star')) {
    const { size } = typeMap['star'];
    const tex = scene.textures.createCanvas('star', size, size);
    const ctx = tex.getContext();

    ctx.fillStyle = toCSS(COLORS.star, 1);
    drawStar(ctx, size / 2, size / 2, size / 2 - 2, size / 5);

    // Innerer Glanz
    ctx.fillStyle = toCSS(0xfde68a, 0.6);
    drawStar(ctx, size / 2, size / 2, size / 4, size / 8);

    tex.refresh();
  }

  // ── EDELSTEIN ────────────────────────────────────────────────────────────
  if (!scene.textures.exists('gem')) {
    const { size } = typeMap['gem'];
    const tex = scene.textures.createCanvas('gem', size, size);
    const ctx = tex.getContext();

    ctx.fillStyle = toCSS(COLORS.gem, 1);
    drawGem(ctx, size / 2, size / 2, size * 0.8, size * 0.95);

    tex.refresh();
  }

  // ── KREIS ─────────────────────────────────────────────────────────────────
  if (!scene.textures.exists('circle')) {
    const { size } = typeMap['circle'];
    const tex = scene.textures.createCanvas('circle', size, size);
    const ctx = tex.getContext();

    ctx.fillStyle = toCSS(COLORS.circle, 1);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Glanz
    ctx.fillStyle = toCSS(0xbfdbfe, 0.5);
    ctx.beginPath();
    ctx.arc(
      size / 2 - size * 0.15,
      size / 2 - size * 0.15,
      size * 0.18,
      0, Math.PI * 2,
    );
    ctx.fill();

    tex.refresh();
  }
}
