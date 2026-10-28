// Round 7: pendulum (hub on baseline) vs axis; and a dial-in-the-space check.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s7';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
function ringHands(cx, cy, Lm, Lh, w, { R, hole = 0.65, hourW = w * 1.1 } = {}) {
  const m = L.hand(cx, cy, 0, 0, Lm, w);
  const h = L.hand(cx, cy, 150, 0, Lh, hourW);
  return L.subtract(L.unite(m, h, L.circle(cx, cy, R)), L.circle(cx, cy, hole));
}
for (const [colour, tag] of [[RUST, 'rust'], [INK, 'one colour']]) {
  const font = 'xbold', cap = 7; const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const w = Math.max(1.25, st * 0.62); const R = 1.9;
  const Lm = cap; const Lh = Lm * 0.6;
  const offEnd = g[2].x2; const cx = offEnd + st * 2 + R; const cy = cap; // hub on baseline
  const hands = ringHands(cx, cy, Lm, Lh, w, { R });
  const sStart = cx + R + st * 2;
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), sStart - g[4].x1, 0);
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  add(`P pendulum ${tag}`, [{ item: off, fill: INK }, { item: hands, fill: colour }, { item: shft, fill: INK }]);
}
(async () => {
  const files = [];
  for (const s of sketches) {
    const f = `${OUT}/${s.name.replace(/[^A-Za-z0-9]+/g, '_')}`;
    L.writeArt(f + '.svg', s.parts, { pad: 1 });
    await kit.render(f + '.svg', f + '.png', { bg: kit.F.bone, tile: '96x30' });
    files.push(f + '.png');
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '2x', '-geometry', '760x238+6+6', '-pointsize', '16', '-background', '#888', OUT + '/sheet.png']);
  await L.closeAll();
})();
