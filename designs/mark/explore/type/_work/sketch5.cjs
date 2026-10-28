// Round 5: settle the 4th concept. T split, H axis, big initial refined, clock axis spacing.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s5';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const kids = (item) => (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)).map((c) => c.clone({ insert: false }));
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;

// ---- T split: crossbar stays (Ink), stem becomes the hands (Rust) ----
for (const [gapMm, tag] of [[1.25, 'stencil gap'], [0, 'joined']]) {
  const font = 'xbold', cap = 8; const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const T = g[7]; const tb = L.bounds(T.item); const sx = tb.x + tb.w / 2;
  const barH = 0.2 * cap; // approx crossbar thickness
  const crossbar = L.intersect(T.item, L.rect(tb.x - 1, -1, tb.w + 2, barH + 1 + 0.001));
  const hubY = cap - 0.36 * cap;
  const w = st;
  const m = L.bar(sx, hubY, sx, barH + gapMm, w);
  const [hx, hy] = kit.polar(sx, hubY, 150, 20);
  const h = L.intersect(L.bar(sx, hubY, hx, hy, w * 1.06), L.rect(sx - 30, -5, 60, cap + 5));
  const hands = L.subtract(L.unite(m, h, L.circle(sx, hubY, w * 0.5)), crossbar);
  const rest = L.unite(g.slice(0, 7).filter((x) => x.item).map((x) => x.item));
  add(`T split ${tag}`, [{ item: rest, fill: INK }, { item: crossbar, fill: INK }, { item: hands, fill: RUST }]);
  add(`T split ${tag} one colour`, [{ item: L.unite(rest, crossbar, hands), fill: INK }]);
}

// ---- H axis: crossbar = 9-3 axis, hands rise/drop from its centre ----
{
  const font = 'xbold', cap = 8; const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const H = g[5]; const hb = L.bounds(H.item); const cx = hb.x + hb.w / 2, cy = cap / 2;
  const w = st * 0.75;
  const hands = L.unite(L.hand(cx, cy, 0, 0, cap / 2 - 0.0, w), L.hand(cx, cy, 150, 0, (cap / 2) / C30 * 0.8, w));
  const rest = L.unite(g.filter((x) => x.item).map((x) => x.item));
  add('H axis', [{ item: rest, fill: INK }, { item: L.subtract(hands, H.item), fill: RUST }]);
}

// ---- big initial refined: ring weight = stem, hands lighter, centred on cap band ----
function bigInitial({ cap = 6.5, k = 1.7, font = 'xbold', track = 0.13, handK = 0.62, oneColour = false } = {}) {
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track });
  const ot = L.text('O', { font, cap: 10 }); const [outer] = kids(ot.item);
  const ob = L.bounds(outer); const H = cap * k * 1.036; const s = H / ob.h;
  const O = L.scaled(outer, s, ob.x, ob.y); const bb = L.bounds(O);
  const cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2;
  const side = st * 1.08, top = st * 0.9;
  const inn = O.clone({ insert: false }); inn.scale((bb.w - 2 * side) / bb.w, (bb.h - 2 * top) / bb.h, L.P(cx, cy));
  const ring = L.subtract(O, inn); const ib = L.bounds(inn);
  const w = st * 0.7; const Lm = ib.h / 2 - 1.35; const Lh = Lm * handK;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.1), L.circle(cx, cy, w * 0.5));
  // place: right edge of ring at F's left edge minus a round-letter gap
  const gap = st * 1.25;
  const dx = g[1].x1 - gap - (bb.x + bb.w), dy = cap / 2 - cy;
  const rest = L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item));
  return [{ item: L.moved(ring, dx, dy), fill: INK }, { item: L.moved(hands, dx, dy), fill: oneColour ? INK : RUST }, { item: rest, fill: INK }];
}
add('B big initial k1.7', bigInitial({}));
add('B big initial k1.55', bigInitial({ k: 1.55 }));
add('B big initial one colour', bigInitial({ oneColour: true }));

// ---- clock axis with more air + lighter hands ----
function axis({ font = 'xbold', cap = 7, track = 0.13, wK = 0.72, air = 1.9, oneColour = false } = {}) {
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track });
  const cy = cap / 2; const Lh = (cap / 2) / C30; const Lm = cap;
  const w = st * wK; const R = Math.max(w * 1.45, 1.8); const hole = 0.65;
  const offEnd = g[2].x2;
  const cx = offEnd + st * air + R;
  let m = L.hand(cx, cy, 0, 0, Lm, w);
  let h = L.intersect(L.hand(cx, cy, 150, 0, Lh + w, w * 1.1), L.rect(cx - 50, -50, 100, 50 + cap));
  const hands = L.subtract(L.unite(m, h, L.circle(cx, cy, R)), L.circle(cx, cy, hole));
  const tipX = cx + Lh * S30 + (w * 1.1 / 2) * C30;
  const sStart = Math.max(tipX, cx + R) + st * air;
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), sStart - g[4].x1, 0);
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  return [{ item: off, fill: INK }, { item: hands, fill: oneColour ? INK : RUST }, { item: shft, fill: INK }];
}
add('X axis air1.9', axis({}));
add('X axis air1.9 one colour', axis({ oneColour: true }));

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
