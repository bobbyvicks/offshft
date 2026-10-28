// Thinner O ring to make room for inside ticks (owner's idea). Uses the options in final/the-o/build.cjs.
// Run: node /home/user/offshft/designs/mark/thin/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const OUT = __dirname, A = B.FONTS.unbounded, L = B.LIGHT;
const V = [
  ['now', 'Now: thick O, no ticks', {}],
  ['thin', 'Thin O, no ticks', { wallFactor: 0.72 }],
  ['thin-four', 'Thin O + 4 ticks', { wallFactor: 0.72, ticks: 'four' }],
  ['thin-three', 'Thin O + 3 ticks (12 left to the hand)', { wallFactor: 0.72, ticks: 'three' }],
];
(async () => {
  const items = [];
  for (const [slug, label, o] of V) {
    const lk = B.lockup(A, 7, L, o);
    const f = path.join(OUT, `logo-${slug}.svg`);
    kit.writeSvg(f, lk);
    await kit.render(f, f.replace('.svg', '.png'), { bg: kit.F.bone, tile: '90x30', px: 8 });
    const sy = B.symbol(A, 25, L, { ...o, channel: 1.2 });
    const g = path.join(OUT, `symbol-${slug}.svg`);
    kit.writeSvg(g, sy);
    await kit.render(g, g.replace('.svg', '.png'), { bg: kit.F.bone, tile: '50x36', px: 8 });
    items.push([f.replace('.svg', '.png'), label], [g.replace('.svg', '.png'), label + ' (symbol)']);
    console.log(slug, 'wall', (lk.G.R - lk.G.rx).toFixed(2), 'dot', lk.dot.toFixed(2), '| symbol dot', sy.dot.toFixed(2));
  }
  await kit.close();
  execFileSync('montage', [...items.flatMap(([f, l]) => ['-label', l, f]), '-tile', '2x', '-geometry', '640x230+8+8', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
})().catch((e) => { console.error(e); process.exit(1); });
