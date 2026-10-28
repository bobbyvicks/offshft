// The O at the same size as the other letters (owner's request). Run with O_SCALE=1.0:
//   O_SCALE=1.0 node /home/user/offshft/designs/mark/uniform/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const OUT = __dirname, A = B.FONTS.unbounded;
const V = [
  ['thick-no-dot', 'Same size, letter-weight O, no dot', { wallFactor: 1.0 }],
  ['thinner-dot', 'Same size, slightly thinner O, with dot', { wallFactor: 0.8 }],
];
(async () => {
  const items = [];
  for (const [slug, label, o] of V) {
    for (const c of [B.LIGHT, B.DARK]) {
      const lk = B.lockup(A, 7, c, o);
      const f = path.join(OUT, `logo-${slug}-${c.name}.svg`);
      kit.writeSvg(f, lk);
      await kit.render(f, f.replace('.svg', '.png'), { bg: c.bg, tile: '90x30', px: 8 });
      items.push([f.replace('.svg', '.png'), `${label} (${c.name})`]);
    }
    const sy = B.symbol(A, 25, B.LIGHT, { ...o, channel: 1.2 });
    const g = path.join(OUT, `symbol-${slug}.svg`);
    kit.writeSvg(g, sy);
    await kit.render(g, g.replace('.svg', '.png'), { bg: kit.F.bone, tile: '50x36', px: 8 });
    console.log(slug, 'wall', (B.lockup(A, 7, B.LIGHT, o).G.R - B.lockup(A, 7, B.LIGHT, o).G.rx).toFixed(2), 'dot', B.lockup(A, 7, B.LIGHT, o).dot.toFixed(2), '| symbol dot', sy.dot.toFixed(2));
  }
  await kit.close();
  const now = '/home/user/offshft/designs/mark/final/the-o/logo-light-cap7.png';
  execFileSync('montage', ['-label', 'Now: O 15% bigger', now, ...items.flatMap(([f, l]) => ['-label', l, f]), '-tile', '1x', '-geometry', '720x240+8+8', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
})().catch((e) => { console.error(e); process.exit(1); });
