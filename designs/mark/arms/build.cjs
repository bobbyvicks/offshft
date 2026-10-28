// Smaller clock hands for the letter-sized O (owner: "the arms feel too big for the clock").
// Run: node /home/user/offshft/designs/mark/arms/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const OUT = __dirname, A = B.FONTS.unbounded, L = B.LIGHT;
// visible lengths in mm at cap 7 -> cap units
const len = (mm) => mm / 7;
const V = [
  ['A-now', 'Now: 1.9 mm wide, 6.6 / 4.7 mm long', {}],
  ['B-slimmer', 'Slimmer: 1.5 mm wide, same length', { handW: 1.5 }],
  ['C-shorter', 'Shorter: same width, 4.6 / 3.5 mm long', { minuteLen: len(4.6), hourLen: len(3.5) }],
  ['D-smaller', 'Slimmer + shorter: 1.5 mm, 4.6 / 3.5 mm', { handW: 1.5, minuteLen: len(4.6), hourLen: len(3.5) }],
  ['E-smallest', 'Smallest: 1.5 mm, 3.9 / 3.0 mm', { handW: 1.5, minuteLen: len(3.9), hourLen: len(3.0) }],
];
(async () => {
  const items = [];
  for (const [slug, label, o] of V) {
    const lk = B.lockup(A, 7, L, o);
    const f = path.join(OUT, `logo-${slug}.svg`);
    kit.writeSvg(f, lk);
    await kit.render(f, f.replace('.svg', '.png'), { bg: kit.F.bone, tile: '80x30', px: 9 });
    items.push([f.replace('.svg', '.png'), label]);
    const G = lk.G;
    console.log(slug, `minute ${(2 * G.sM).toFixed(2)} x ${(G.Lm - G.R - G.g).toFixed(2)}`, `hour ${(2 * G.sH).toFixed(2)} x ${(G.Lh - G.R - G.g).toFixed(2)}`, `hour ratio ${((G.Lh - G.R - G.g) / (2 * G.sH)).toFixed(2)}`, `lockup ${lk.w.toFixed(1)} x ${lk.h.toFixed(1)}`);
  }
  await kit.close();
  execFileSync('montage', [...items.flatMap(([f, l]) => ['-label', l, f]), '-tile', '1x', '-geometry', '720x234+8+6', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
})().catch((e) => { console.error(e); process.exit(1); });
