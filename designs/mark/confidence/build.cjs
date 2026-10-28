// What makes the standalone clock-O symbol read as a clock with more confidence?
// Variants of the symbol, same scale, for a blind reading test.
// Run: node /home/user/offshft/designs/mark/confidence/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const n = (v) => (Math.round(v * 1000) / 1000).toString();
const INK = kit.T.ink, RUST = kit.T.rust;
const font = B.FONTS.unbounded;
const CAP = 8.8; // the 25 mm symbol is built at about this cap height
const G = B.geometry(font, CAP, { channel: 1.2 });

const ell = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)} a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;
function frame(deg) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  return (t, k) => [ux * t + nx * k, uy * t + ny * k];
}
const poly = (pts) => `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`;

// straight hand with a 90 degree point, from radius t0 (flat base) to L
function straight(deg, t0, L, s) { const P = frame(deg); return poly([P(t0, -s), P(L - s, -s), P(L, 0), P(L - s, s), P(t0, s)]); }
// tapered hand: wide at the pivot, narrowing to a point (classic clock hand)
function tapered(deg, t0, L, s) { const P = frame(deg); const sb = s * 1.45, st = s * 0.6; return poly([P(t0, -sb), P(L - st * 1.6, -st), P(L, 0), P(L - st * 1.6, st), P(t0, sb)]); }
// concave-based hand outside the ring (current construction)
function outside(deg, rho, L, s) {
  const P = frame(deg); const t0 = Math.sqrt(rho * rho - s * s);
  const pts = [P(t0, -s), P(L - s, -s), P(L, 0), P(L - s, s), P(t0, s)];
  return `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} A${n(rho)} ${n(rho)} 0 0 0 ${n(pts[0][0])} ${n(pts[0][1])} Z`;
}
function ticks(deg = [90, 180, 270]) {
  const len = CAP * 0.2, w = G.stem * 0.62, r0 = G.R + G.g;
  return deg.map((d) => { const P = frame(d); return poly([P(r0, -w / 2), P(r0 + len, -w / 2), P(r0 + len, w / 2), P(r0, w / 2)]); }).join(' ');
}

const ring = `<path fill="${INK}" fill-rule="evenodd" d="${ell(0, 0, G.R, G.R)} ${ell(0, 0, G.rx, G.ry)}"/>`;
const dot = (r) => `<path fill="${RUST}" d="${ell(0, 0, r, r)}"/>`;
const VARIANTS = {
  'S0-now': () => ring + `<path fill="${RUST}" d="${outside(0, G.R + G.g, G.Lm, G.sM)} ${outside(150, G.R + G.g, G.Lh, G.sH)}"/>` + dot(G.dot / 2),
  'S1-from-centre': () => ring + `<path fill="${RUST}" d="${straight(0, 0, G.Lm, G.sM)} ${straight(150, 0, G.Lh, G.sH)}"/>` + dot(G.sH * 1.6),
  'S2-tapered-from-centre': () => ring + `<path fill="${RUST}" d="${tapered(0, 0, G.Lm, G.sM)} ${tapered(150, 0, G.Lh, G.sH)}"/>` + dot(G.sH * 1.7),
  'S3-now-with-ticks': () => ring + `<path fill="${INK}" d="${ticks()}"/>` + `<path fill="${RUST}" d="${outside(0, G.R + G.g, G.Lm, G.sM)} ${outside(150, G.R + G.g, G.Lh, G.sH)}"/>` + dot(G.dot / 2),
  'S4-tapered-with-ticks': () => ring + `<path fill="${INK}" d="${ticks()}"/>` + `<path fill="${RUST}" d="${tapered(0, 0, G.Lm, G.sM)} ${tapered(150, 0, G.Lh, G.sH)}"/>` + dot(G.sH * 1.7),
};

(async () => {
  const ext = Math.max(G.Lm, G.R + G.g + CAP * 0.2) + 1;
  const files = [];
  for (const [slug, draw] of Object.entries(VARIANTS)) {
    const f = path.join(OUT, `${slug}.svg`);
    kit.writeSvg(f, { w: ext * 2, h: ext * 2, body: `<g transform="translate(${n(ext)} ${n(ext)})">${draw()}</g>` });
    await kit.render(f, f.replace('.svg', '.png'), { bg: kit.F.bone, tile: '60x40', px: 6 });
    files.push(f.replace('.svg', '.png'));
  }
  await kit.close();
  execFileSync('montage', [...files.flatMap((f) => ['-label', path.basename(f, '.png'), f]), '-tile', '5x', '-geometry', '360x240+8+8', '-pointsize', '18', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
  console.log('done', files.length);
})().catch((e) => { console.error(e); process.exit(1); });
