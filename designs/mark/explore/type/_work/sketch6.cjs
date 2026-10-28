// Round 6: pick the fourth concept; fix the axis divider in one colour.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s6';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const kids = (item) => (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)).map((c) => c.clone({ insert: false }));
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;

function ringHands(cx, cy, Lm, Lh, w, { R, hole = 0.65, hourW = w * 1.1, flatY = null } = {}) {
  const m = L.hand(cx, cy, 0, 0, Lm, w);
  let h = L.hand(cx, cy, 150, 0, Lh + (flatY !== null ? w : 0), hourW);
  if (flatY !== null) h = L.intersect(h, L.rect(cx - 50, cy - 100, 100, flatY - (cy - 100)));
  return L.subtract(L.unite(m, h, L.circle(cx, cy, R)), L.circle(cx, cy, hole));
}

// axis, one colour, lighter + taller
function axis({ font = 'xbold', cap = 7, track = 0.13, wK = 0.62, mK = 1.25, air = 2.0, colour = RUST } = {}) {
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track });
  const cy = cap / 2; const Lh = (cap / 2) / C30; const Lm = cap * mK;
  const w = Math.max(1.25, st * wK); const R = Math.max(w * 1.5, 1.9);
  const offEnd = g[2].x2; const cx = offEnd + st * air + R;
  const hands = ringHands(cx, cy, Lm, Lh, w, { R, hole: 0.62, flatY: cap });
  const tipX = cx + Lh * S30 + (w * 1.1 / 2) * C30;
  const sStart = Math.max(tipX, cx + R) + st * air;
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), sStart - g[4].x1, 0);
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  return [{ item: off, fill: INK }, { item: hands, fill: colour }, { item: shft, fill: INK }];
}
add('X axis light tall rust', axis({}));
add('X axis light tall one colour', axis({ colour: INK }));
add('X axis light mK1.0 one colour', axis({ colour: INK, mK: 1.0 }));

// accent before OFF, bolder, cap-locked
{
  const font = 'xbold', cap = 7.5; const st = kit.stem(font, cap);
  const t = L.text('OFF SHFT', { font, cap, track: 0.13 });
  const hubY = cap * 0.6; const w = st * 0.8; const R = w * 1.45;
  const Lm = hubY; const Lh = (cap - hubY) / C30;
  const cx = t.letters[0].x1 - st * 2.2 - Lh * S30 - w;
  add('A accent before OFF', [{ item: ringHands(cx, hubY, Lm, Lh, w, { R, flatY: cap }), fill: RUST }, { item: t.item, fill: INK }]);
}

// two-line drop cap: big O spans both lines, FF / SHFT to the right
{
  const cap = 6; const st = kit.stem('xbold', cap); const lead = cap * 0.7; const H = cap * 2 + lead;
  const ot = L.text('O', { font: 'xbold', cap: 10 }); const [outer] = kids(ot.item);
  const ob = L.bounds(outer); const s = (H + 0.25) / ob.h; const O = L.scaled(outer, s, ob.x, ob.y); const bb = L.bounds(O);
  const cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2;
  const side = st * 1.05, top = st * 0.9;
  const inn = O.clone({ insert: false }); inn.scale((bb.w - 2 * side) / bb.w, (bb.h - 2 * top) / bb.h, L.P(cx, cy));
  const ring = L.subtract(O, inn); const ib = L.bounds(inn);
  const w = st * 0.72; const Lm = ib.h / 2 - 1.4; const Lh = Lm * 0.62;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.1), L.circle(cx, cy, w * 0.5));
  const x0 = bb.x + bb.w + st * 1.3;
  const ff = L.text('FF', { font: 'xbold', cap, track: 0.13, x: x0, y: bb.y + 0.12 + cap });
  const sh = L.text('SHFT', { font: 'xbold', cap, track: 0.13, x: x0, y: bb.y + 0.12 + H });
  add('Q two-line drop cap', [{ item: ring, fill: INK }, { item: hands, fill: RUST }, { item: ff.item, fill: INK }, { item: sh.item, fill: INK }], { tile: '70x30' });
}

(async () => {
  const files = [];
  for (const s of sketches) {
    const f = `${OUT}/${s.name.replace(/[^A-Za-z0-9]+/g, '_')}`;
    L.writeArt(f + '.svg', s.parts, { pad: 1 });
    await kit.render(f + '.svg', f + '.png', { bg: kit.F.bone, tile: s.opts.tile || '96x30' });
    files.push(f + '.png');
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '2x', '-geometry', '760x238+6+6', '-pointsize', '16', '-background', '#888', OUT + '/sheet.png']);
  await L.closeAll();
  console.log('ok', files.length);
})();
