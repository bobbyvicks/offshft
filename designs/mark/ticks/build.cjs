// Inside tick marks on the clock O, like a real clock face. Only fits where the O is big enough to stitch
// (symbols 40 mm and up) or in print. Run: node /home/user/offshft/designs/mark/ticks/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const n = (v) => (Math.round(v * 1000) / 1000).toString();
const A = B.FONTS.unbounded;

// Radius of the counter (inner ellipse) along clock angle deg.
const innerR = (G, deg) => { const a = (deg * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a); return 1 / Math.sqrt((ux / G.rx) ** 2 + (uy / G.ry) ** 2); };
// A tick attached to the ring's inner edge, pointing at the centre.
function tick(cx, cy, G, deg, len, w) {
  const a = (deg * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const r = innerR(G, deg);
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const pts = [P(r + 0.3, -w / 2), P(r - len, -w / 2), P(r - len, w / 2), P(r + 0.3, w / 2)];
  return `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`;
}
// Ticks: 'four' = 12, 3, 6, 9; 'twelve' = long at 12/3/6/9, short at the other hours.
function ticksSvg(G, cx, cy, kind, fill) {
  const space = G.rx - G.dotR;                       // room between the dot and the O
  const long = Math.min(space - 1.0, Math.max(1.0, space * 0.42));
  const short = long * 0.6;
  const wl = Math.max(1.0, G.stem * 0.55), ws = Math.max(1.0, G.stem * 0.45);
  const hours = kind === 'four' ? [0, 90, 180, 270] : Array.from({ length: 12 }, (_, i) => i * 30);
  return `<path fill="${fill}" d="${hours.map((d) => (d % 90 === 0 ? tick(cx, cy, G, d, long, wl) : tick(cx, cy, G, d, short, ws))).join(' ')}"/>`;
}

// Add ticks to a built symbol or lockup: find the clock centre from the group's translate.
function withTicks(design, kind, colours) {
  const m = design.body.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
  const cx = +m[1], cy = +m[2];
  const G = { ...design.G, dotR: design.dot / 2 };
  const body = design.body.replace('</g>', '') ;
  // ticks go under the hands: insert right after the ring path
  const ringEnd = design.body.indexOf('/>') + 2;
  const t = ticksSvg(G, 0, 0, kind, colours.letters);
  return { ...design, body: design.body.slice(0, ringEnd) + t + design.body.slice(ringEnd) };
}

(async () => {
  const L = B.LIGHT;
  const items = [];
  const variants = [
    ['40-now', B.symbol(A, 40, L, { channel: 1.5 })],
    ['40-four-ticks', withTicks(B.symbol(A, 40, L, { channel: 1.5 }), 'four', L)],
    ['40-twelve-ticks', withTicks(B.symbol(A, 40, L, { channel: 1.5 }), 'twelve', L)],
  ];
  for (const [slug, d] of variants) {
    const f = path.join(OUT, `symbol-${slug}.svg`);
    kit.writeSvg(f, { w: d.w, h: d.h, body: d.body });
    await kit.render(f, f.replace('.svg', '.png'), { bg: kit.F.bone, tile: '70x56', px: 6 });
    items.push(f.replace('.svg', '.png'));
  }
  // print-only lockup with four inside ticks (too small to stitch): dot reduced so the ticks have room
  const lk = B.lockup(A, 7, L);
  const G = { ...lk.G, dotR: 1.2 / 2 };
  const ringEnd = lk.body.indexOf('/>') + 2;
  let body = lk.body.slice(0, ringEnd) + ticksSvg({ ...G, rx: G.rx, ry: G.ry }, 0, 0, 'four', L.letters) + lk.body.slice(ringEnd);
  body = body.replace(/<path fill="#B4552D" d="M-0\.9\d* 0 a[^"]*"\/>/, `<path fill="${L.hands}" d="M-0.6 0 a0.6 0.6 0 1 0 1.2 0 a0.6 0.6 0 1 0 -1.2 0 Z"/>`);
  const pf = path.join(OUT, 'logo-print-four-ticks.svg');
  kit.writeSvg(pf, { w: lk.w, h: lk.h, body });
  await kit.render(pf, pf.replace('.svg', '.png'), { bg: kit.F.bone, tile: '100x40', px: 8 });
  items.push(pf.replace('.svg', '.png'));
  await kit.close();
  execFileSync('montage', [...items.flatMap((f) => ['-label', path.basename(f, '.png'), f]), '-tile', '2x', '-geometry', '560x380+8+8', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
