// OFF SHFT logo: "The O". The O in OFF is a clock face; two hands at 5:00 (quitting time) stand out of it.
// Chosen by the owner, and refined from two blind reading tests (see ../../the-o/ and notes.md).
//
// Rules of construction (cap height = 7 mm reference; everything scales from it):
// - Wordmark: Archivo Expanded Bold, letter-spacing 0.14 em.
// - The O is a perfect ring 1.2 x the height of the type's own O (owner's pick), centred on the cap band,
//   ring stroke = 1.05 x the letter stem.
// - Hands are drawn with the same pen as the letters: minute hand = 1.0 stem wide, hour hand = 1.16 stems,
//   square (90 degree) points. They start just outside the ring, so in two colours they read as hands laid
//   on the dial, not as a Q's tail.
// - Minute hand stands 1 cap height above the ring; hour hand reaches 0.62 cap beyond it at exactly 150 degrees.
// - Pivot: a small ring at the centre, outer diameter 3/7 of the cap height, hole 42% of that.
//
// Run: node /home/user/offshft/designs/mark/final/the-o/build.cjs

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const OUT = __dirname;
const FONT = 'xbold', TRACK = 0.14;
const T = kit.T, F = kit.F;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

function geometry(cap) {
  const ref = kit.text('OFF SHFT', { font: FONT, cap, track: TRACK, x: 0, y: 0 });
  const O = ref.letters[0];
  const stem = kit.stem(FONT, cap);
  const oh = O.bottom - O.top;
  const R = (oh / 2) * 1.2;
  const wall = stem * 1.05;
  return {
    cap, ref, O, stem, R, wall,
    r: R - wall,
    sM: stem * 0.5, sH: stem * 0.58,
    gap: Math.max(0.45, cap * 0.064),
    Lm: R + cap * 1.0, Lh: R + cap * 0.62,
    pr: cap * 3 / 14, prHole: (cap * 3 / 14) * 0.42,
  };
}

function hand(cx, cy, deg, r0, L, s) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const pts = [P(r0, -s), P(L - s, -s), P(L, 0), P(L - s, s), P(r0, s)];
  return `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`;
}
const circ = (cx, cy, r) => `M${n(cx - r)} ${n(cy)} a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0 a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0 Z`;

// The clock O on its own, centred at (cx, cy).
function clockO(g, cx, cy, { ring, hands }) {
  return `<path fill="${ring}" fill-rule="evenodd" d="${circ(cx, cy, g.R)} ${circ(cx, cy, g.r)}"/>` +
    `<path fill="${hands}" d="${hand(cx, cy, 0, g.R + g.gap, g.Lm, g.sM)} ${hand(cx, cy, 150, g.R + g.gap, g.Lh, g.sH)}"/>` +
    `<path fill="${hands}" fill-rule="evenodd" d="${circ(cx, cy, g.pr)} ${circ(cx, cy, g.prHole)}"/>`;
}
function extents(g) {
  const a = (150 * Math.PI) / 180;
  const hourTip = [g.Lh * Math.sin(a), -g.Lh * Math.cos(a)];
  return { up: g.Lm, down: Math.max(g.R, hourTip[1] + g.sH * 0.5), left: g.R, right: Math.max(g.R, hourTip[0] + g.sH) };
}

function lockup(cap, colours) {
  const g = geometry(cap);
  const e = extents(g);
  const pad = cap * 0.25;
  const cx = pad + g.R, cy = pad + e.up;
  const baseY = cy - (g.O.top + g.O.bottom) / 2;                 // ring centred on the type's O
  const L = g.ref.letters;
  const gapAfterO = L[1].x1 - g.O.x2;                            // the font's own O-to-F spacing
  const restX = cx + g.R + gapAfterO - (L[1].x1 - L[1].x);
  const rest = kit.text('FF SHFT', { font: FONT, cap, track: TRACK, fill: colours.letters, x: restX, y: baseY });
  return {
    w: restX + rest.width + pad,
    h: cy + e.down + pad,
    body: clockO(g, cx, cy, { ring: colours.letters, hands: colours.hands }) + rest.svg,
  };
}

function symbol(size, colours) {
  // size = overall height in mm
  const g0 = geometry(7), e0 = extents(g0);
  const k = size / (e0.up + e0.down);
  const g = geometry(7 * k), e = extents(g);
  const pad = 0;
  const cx = pad + e.left, cy = pad + e.up;
  return { w: e.left + e.right, h: e.up + e.down, body: clockO(g, cx, cy, { ring: colours.ring || colours.letters, hands: colours.hands }) };
}

const LIGHT = { letters: T.ink, hands: T.rust, bg: F.bone, name: 'light' };
const DARK = { letters: T.bone, hands: T.sun, bg: F.slate, name: 'dark' };
const ONE_INK = { letters: T.ink, hands: T.ink, bg: F.oat, name: 'one-colour-ink' };
const ONE_BONE = { letters: T.bone, hands: T.bone, bg: F.spruce, name: 'one-colour-bone' };

(async () => {
  const files = [];
  const write = (name, d) => { const f = path.join(OUT, name); kit.writeSvg(f, d); return f; };
  for (const c of [LIGHT, DARK, ONE_INK, ONE_BONE]) {
    const lk = write(`logo-${c.name}.svg`, lockup(7, c));
    await kit.render(lk, lk.replace('.svg', '.png'), { bg: c.bg, tile: '100x40', px: 6 });
    const sy = write(`symbol-${c.name}.svg`, symbol(25, c));
    await kit.render(sy, sy.replace('.svg', '.png'), { bg: c.bg, tile: '60x40', px: 6 });
    files.push(lk.replace('.svg', '.png'), sy.replace('.svg', '.png'));
  }
  // size tests: symbol at 13/25/50 mm, and the lockup at three hat-front widths
  await kit.sizes(path.join(OUT, 'symbol-light.svg'), path.join(OUT, 'symbol-sizes.png'), { bg: F.bone });
  for (const cap of [4.5, 6, 7.5]) {
    const f = write(`logo-light-cap${cap}.svg`, lockup(cap, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '110x30', px: 8, width: undefined });
  }
  await kit.close();
  const label = (f) => path.basename(f, '.png');
  const args = [];
  for (const f of files) args.push('-label', label(f), f);
  execFileSync('montage', [...args, '-tile', '2x', '-geometry', '600x240+10+10', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
  const L = lockup(7, LIGHT), S = symbol(25, LIGHT);
  console.log('lockup at cap 7:', n(L.w), 'x', n(L.h), 'mm; symbol:', n(S.w), 'x', n(S.h), 'mm');
  const g = geometry(7);
  console.log('stem', n(g.stem), 'ring wall', n(g.wall), 'minute hand', n(2 * g.sM), 'hour hand', n(2 * g.sH), 'gap', n(g.gap), 'pivot', n(2 * g.pr), 'hole', n(2 * g.prHole), 'counter radius', n(g.r));
})().catch((e) => { console.error(e); process.exit(1); });
