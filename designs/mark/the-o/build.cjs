// "The O": the O in OFF is the clock. Explores how big the O should be and how the hands meet it.
// Run: node /home/user/offshft/designs/mark/the-o/build.cjs
'use strict';
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const { execFileSync } = require('child_process');

const OUT = '/home/user/offshft/designs/mark/the-o';
const INK = kit.T.ink;
const CAP = 7, FONT = 'xbold', TRACK = 0.14;
const STEM = kit.stem(FONT, CAP);
const f = (v) => (Math.round(v * 1000) / 1000).toString();
const pol = (cx, cy, deg, r) => kit.polar(cx, cy, deg, r);

// A clock hand as a polygon: from radius r0 to tip length L from the centre, half-width s, 90 degree point.
function hand(cx, cy, deg, r0, L, s) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a);   // along the hand
  const nx = -uy, ny = ux;                     // across the hand
  const tip = L, shoulder = L - s;             // 90 degree point: point length = half-width
  const P = (t, n) => [cx + ux * t + nx * n, cy + uy * t + ny * n];
  const pts = [P(r0, -s), P(shoulder, -s), P(tip, 0), P(shoulder, s), P(r0, s)];
  return `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L')} Z`;
}
const ring = (cx, cy, R, r) =>
  `M${f(cx - R)} ${f(cy)} a${f(R)} ${f(R)} 0 1 0 ${f(2 * R)} 0 a${f(R)} ${f(R)} 0 1 0 ${f(-2 * R)} 0 Z ` +
  `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0 Z`;
const disc = (cx, cy, r) => `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0 Z`;

// Build the lockup. scale = O height as a multiple of the normal O.
// mode: 'outside' (hands start at the ring), 'pin' (outside + pivot dot), 'through' (hands run from the pivot, across the ring)
function theO({ scale = 1.0, mode = 'outside', minExt = 0.75, hrExt = 0.42, fill = INK, handFill, hourInside = false, detach = 0, wM = 0.62, wH = 0.72 }) {
  const hf = handFill || fill;
  const t = kit.text('OFF SHFT', { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const O = t.letters[0];
  const oh = O.bottom - O.top;
  const R = (oh / 2) * scale;
  const wall = STEM * 1.05;
  const r = R - wall;
  const sM = STEM * wM, sH = STEM * wH;         // hand half-widths: hour a bit heavier
  const Lm = R + CAP * minExt, Lh = R + CAP * hrExt;
  const PAD = 3;
  const hrA = (150 * Math.PI) / 180;
  const topExt = Lm, botExt = hourInside ? R : Math.max(R, Lh * -Math.cos(hrA) + sH * Math.sin(hrA));
  const cx = PAD + R, cy = PAD + topExt;
  const baseY = cy - (O.top + O.bottom) / 2;   // centre the O on the cap band
  let body = `<path fill="${fill}" fill-rule="evenodd" d="${ring(cx, cy, R, r)}"/>`;
  const start = mode === 'through' ? 0 : R - wall * 0.5;
  // when the hands are a different colour they start just outside the ring, so the two read as separate pieces
  const startOut = hf !== fill ? R + 0.45 : start + detach;
  body += `<path fill="${hf}" d="${hand(cx, cy, 0, startOut, Lm, sM)}"/>`;
  const pr = Math.max(sH * 1.9, 1.5);
  if (hourInside) {
    // hour hand lives inside the O: from the centre to just short of the O's inner edge, on a small pivot dot
    body += `<path fill="${hf}" d="${hand(cx, cy, 150, 0, r - 0.55, sH * 0.8)}"/>`;
    body += `<path fill="${hf}" d="${disc(cx, cy, Math.max(sH * 1.05, 0.95))}"/>`;
  } else {
    body += `<path fill="${hf}" d="${hand(cx, cy, 150, startOut, Lh, sH)}"/>`;
  }
  if (mode === 'pin' || mode === 'through') body += `<path fill="${hf}" d="${disc(cx, cy, Math.max(sH * 1.55, 1.25))}"/>`;
  if (mode === 'pinring' && !hourInside) body += `<path fill="${hf}" fill-rule="evenodd" d="${ring(cx, cy, pr, pr * 0.42)}"/>`;
  // letters after the O keep their normal spacing from the O's right edge
  const gapAfterO = t.letters[1].x1 - O.x2;
  const restX = cx + R + gapAfterO - (t.letters[1].x1 - t.letters[1].x);
  const rest = kit.text('FF SHFT', { font: FONT, cap: CAP, track: TRACK, fill, x: restX, y: baseY });
  body += rest.svg;
  return { w: restX + rest.width + PAD, h: cy + botExt + PAD, body };
}

// The O and hands on their own, as a standalone symbol (no letters).
function symbol(opts) {
  const d = theO(opts);
  return d;
}

const RUST = kit.T.rust;
const V = [
  ['G-1.35-pinring', 'G: 35% + pivot ring (last round best)', { scale: 1.35, mode: 'pinring' }],
  ['H-rust-hands', 'H: same, rust hands', { scale: 1.35, mode: 'pinring', handFill: RUST }],
  ['M-long', 'M: longer, slimmer hands', { scale: 1.35, mode: 'pinring', minExt: 1.0, hrExt: 0.62, wM: 0.5, wH: 0.58 }],
  ['N-long-rust', 'N: longer, slimmer, rust hands', { scale: 1.35, mode: 'pinring', minExt: 1.0, hrExt: 0.62, wM: 0.5, wH: 0.58, handFill: RUST }],
];

(async () => {
  const args = [];
  for (const [slug, label, o] of V) {
    const d = theO(o);
    const svg = `${OUT}/${slug}.svg`;
    kit.writeSvg(svg, d);
    await kit.render(svg, `${OUT}/${slug}.png`, { bg: kit.F.bone, tile: '110x48', px: 6 });
    args.push('-label', label, `${OUT}/${slug}.png`);
    console.log(slug, f(d.w), 'x', f(d.h), 'mm');
  }
  await kit.close();
  execFileSync('montage', [...args, '-tile', '2x', '-geometry', '640x280+10+10', '-pointsize', '22', '-background', '#d9d4c8', `${OUT}/sheet.png`]);
  console.log('sheet');
})().catch((e) => { console.error(e); process.exit(1); });
