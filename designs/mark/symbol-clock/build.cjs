// Owner: "i like this logo [the symbol], can we make it uniform so that is the one in the name logo too".
// The symbol's clock (pivot dot, longer hands) inside the wordmark, two ways, next to the current lockup.
// Owner's pick: 1 (letter-sized O), now the default in final/the-o/build.cjs.
// Run: node /home/user/offshft/designs/mark/symbol-clock/build.cjs
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const OUT = __dirname, A = B.FONTS.unbounded;
const V = [
  ['0-now', 'Now: letter-sized O, short hands, no dot', { dot: false, wallFactor: 1.0, minuteLen: 0.657, hourLen: 0.5 }],
  // the symbol scaled to letter height: hands keep the symbol's proportion to the ring (0.936 / 1.15 cap),
  // ring wall 0.82 of the letter stem so a 1.5 mm dot keeps 1.3 mm of fabric around it
  ['1-letter-size', '1: symbol clock at letter size (ring a little thinner)', { dot: true, wallFactor: 0.82, minuteLen: 0.936 / 1.15, hourLen: 0.667 / 1.15 }],
  // the symbol exactly, O 1.15 x the letters
  ['2-symbol-size', '2: symbol clock exactly (O 15% bigger)', { dot: true, wallFactor: 1.0, oScale: 1.15, minuteLen: 0.936, hourLen: 0.667 }],
];
(async () => {
  const items = [];
  for (const c of [B.DARK, B.LIGHT]) for (const [slug, label, o] of V) {
    const lk = B.lockup(A, 7, c, o);
    const f = path.join(OUT, `logo-${slug}-${c.name}.svg`);
    kit.writeSvg(f, lk);
    await kit.render(f, f.replace('.svg', '.png'), { bg: c.bg, tile: '80x32', px: 9 });
    items.push([f.replace('.svg', '.png'), label]);
    const G = lk.G;
    if (c === B.DARK) console.log(slug, `ring ${(2 * G.R).toFixed(2)} wall ${(G.R - G.rx).toFixed(2)} dot ${lk.dot.toFixed(2)} fabric ${(G.rx - lk.dot / 2).toFixed(2)} minute ${(G.Lm - G.R - G.g).toFixed(2)} hour ${(G.Lh - G.R - G.g).toFixed(2)} lockup ${lk.w.toFixed(1)}x${lk.h.toFixed(1)}`);
  }
  const sym = path.join(OUT, 'symbol-dark.svg');
  kit.writeSvg(sym, B.symbol(A, 25, B.DARK, { channel: 1.2 }));
  await kit.render(sym, sym.replace('.svg', '.png'), { bg: kit.F.slate, tile: '80x32', px: 9 });
  await kit.close();
  const dark = items.slice(0, 3), light = items.slice(3);
  execFileSync('montage', [...[[sym.replace('.svg', '.png'), 'The symbol you like (25 mm)'], ...dark, ...light].flatMap(([f, l]) => ['-label', l, f]), '-tile', '1x', '-geometry', '720x288+8+6', '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, 'sheet.png')]);
})().catch((e) => { console.error(e); process.exit(1); });
