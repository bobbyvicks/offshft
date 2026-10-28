// Round 1 concept sketches. Renders each idea on Bone fabric, then a contact sheet.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s1';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
function add(name, parts, opts = {}) { sketches.push({ name, parts, opts }); }

function outerOf(item) { // largest child of a compound path
  const ch = item.children ? item.children.slice() : [item];
  ch.sort((a, b) => Math.abs(b.area) - Math.abs(a.area));
  return ch[0].clone({ insert: false });
}

// ---------- S1: dial O (solid O, hands knocked out) ----------
{
  const cap = 8, font = 'xbold';
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.12 });
  const O = g[0];
  const solid = outerOf(O.item);
  const b = L.bounds(solid);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const w = 1.25, Lm = b.h / 2 - 1.35, Lh = Lm * 0.62;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.1), L.circle(cx, cy, w * 0.95));
  const dial = L.subtract(solid, hands);
  const rest = L.unite(g.slice(1).map((x) => x.item));
  add('S1 dial-O lockup cap8', [{ item: dial, fill: RUST }, { item: rest, fill: INK }]);
  // mark at 25mm
  const s = 25 / b.w;
  const solidM = L.scaled(solid, s, cx, cy);
  const bm = L.bounds(solidM); const mx = bm.x + bm.w / 2, my = bm.y + bm.h / 2;
  const wM = 2.1, LmM = bm.h / 2 - 2.4, LhM = LmM * 0.62;
  const handsM = L.unite(L.hand(mx, my, 0, 0, LmM, wM), L.hand(mx, my, 150, 0, LhM, wM * 1.1), L.circle(mx, my, wM * 1.0));
  add('S1 dial-O mark 25mm', [{ item: L.subtract(solidM, handsM), fill: RUST }]);
}

// ---------- S2: ring-O monogram ----------
{
  // monogram from the xmed O scaled to 25 mm wide
  const font = 'xsemi';
  const t = L.text('O', { font, cap: 10 });
  const ob = L.bounds(t.item);
  const s = 25 / ob.w;
  const O = L.scaled(t.item, s, ob.x, ob.y);
  const b = L.bounds(O); const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const innerH = (0.834 - 0.168) * 10 * s; // xsemi counter height
  const w = 2.0, Lm = innerH / 2 - 1.7, Lh = Lm * 0.62;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.12), L.circle(cx, cy, w * 1.05));
  add('S2 ring-O monogram 25mm', [{ item: O, fill: INK }, { item: hands, fill: RUST }]);
  // lockup: monogram + wordmark
  const cap = 6.5;
  const wm = L.text('OFF SHFT', { font: 'xbold', cap, track: 0.14 });
  const scaleMono = (2.4 * cap) / b.h;
  const mono = L.scaled(L.unite(O), scaleMono, b.x, b.y);
  const handsS = L.scaled(hands, scaleMono, b.x, b.y);
  const mb = L.bounds(mono);
  const gap = kit.stem('xbold', cap) * 2;
  const tx = mb.x2 + gap - wm.letters[0].x1;
  const ty = mb.y + mb.h / 2 - cap / 2;
  add('S2 monogram + wordmark', [{ item: mono, fill: INK }, { item: handsS, fill: RUST }, { item: L.moved(wm.item, tx, ty), fill: INK }]);
  // initial-cap lockup: big O-clock replaces O of OFF
  const g = L.glyphs('OFF SHFT', { font: 'xbold', cap, track: 0.14 });
  const rest = L.unite(g.slice(1).map((x) => x.item));
  const k = (cap * 1.9) / b.h;
  const bigO = L.scaled(O, k, b.x, b.y), bigH = L.scaled(hands, k, b.x, b.y);
  const bb = L.bounds(bigO);
  const dx = g[1].x1 - (kit.stem('xbold', cap) * 1.2) - bb.x2, dy = (cap - bb.h) / 2 - bb.y;
  add('S2 big-initial lockup', [{ item: L.moved(bigO, dx, dy), fill: INK }, { item: L.moved(bigH, dx, dy), fill: RUST }, { item: rest, fill: INK }]);
}

// ---------- S3: divider glyph at cap height ----------
{
  const cap = 8, font = 'xbold';
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.14 });
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const shft = L.unite(g.slice(4).map((x) => x.item));
  // hands: hub at 0.34 cap; minute to cap line (flat), hour to baseline (flat horizontal cut)
  const hubY = cap - 0.34 * cap; const hubX = (g[2].x2 + g[4].x1) / 2 - 0.1 * cap;
  const w = st;
  const min = L.bar(hubX, hubY, hubX, 0, w);
  const [hx, hy] = kit.polar(hubX, hubY, 150, (cap - hubY) / Math.cos(Math.PI / 6) + w);
  let hour = L.bar(hubX, hubY, hx, hy, w * 1.06);
  hour = L.intersect(hour, L.rect(hubX - 20, -5, 40, cap + 5));
  const hub = L.circle(hubX, hubY, w * 0.85);
  add('S3 divider glyph cap-locked', [{ item: off, fill: INK }, { item: L.unite(min, hour, hub), fill: RUST }, { item: shft, fill: INK }]);
}

// ---------- S4: divider hands taller than caps ----------
{
  const cap = 7, font = 'xbold';
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.14 });
  // open a wider word space
  const shift = 3.5;
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), shift, 0);
  const hubX = (g[2].x2 + g[4].x1 + shift) / 2 - 1.2, hubY = cap * 0.62;
  const w = st * 0.9;
  const Lm = cap * 1.0, Lh = Lm * 0.62;
  const hands = L.unite(L.hand(hubX, hubY, 0, 0, Lm, w, { cap2: 'flat' }), L.hand(hubX, hubY, 150, 0, Lh, w * 1.08), L.circle(hubX, hubY, w * 0.95));
  add('S4 divider tall hands', [{ item: off, fill: INK }, { item: hands, fill: RUST }, { item: shft, fill: INK }]);
}

// ---------- S5: kicked T (stem bends at the hub into the hour hand) ----------
{
  const cap = 8, font = 'xbold';
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.14 });
  const T = g[7];
  const tb = L.bounds(T.item);
  const stemX = tb.x + tb.w / 2;
  const hubY = cap - 0.34 * cap;
  // remove the T stem below the hub
  const cut = L.rect(stemX - st / 2 - 0.05, hubY, st + 0.1, cap);
  let Tm = L.subtract(T.item, cut);
  const [hx, hy] = kit.polar(stemX, hubY, 150, (cap - hubY) / Math.cos(Math.PI / 6) + st);
  let hour = L.intersect(L.bar(stemX, hubY, hx, hy, st * 1.04), L.rect(stemX - 20, -5, 40, cap + 5));
  const hub = L.circle(stemX, hubY, st * 0.8);
  const rest = L.unite(g.slice(0, 7).filter((x) => x.item).map((x) => x.item));
  add('S5 kicked T', [{ item: rest, fill: INK }, { item: L.unite(Tm, hour, hub), fill: INK }]);
  add('S5b kicked T two-colour', [{ item: rest, fill: INK }, { item: Tm, fill: INK }, { item: L.subtract(L.unite(hour, hub, L.rect(stemX - st / 2, hubY - 0.01, st, 0.02)), Tm), fill: RUST }]);
}

// ---------- S6: O ring with minute hand joined to the top ----------
{
  const cap = 8, font = 'xmed';
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.14 });
  const O = g[0];
  const b = L.bounds(O.item); const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const w = 1.3;
  const topInner = cy - (0.86 - 0.141) * cap / 2;
  const min = L.bar(cx, cy, cx, topInner + 0.2, w);
  const hr = L.hand(cx, cy, 150, 0, 1.9, w);
  const hub = L.circle(cx, cy, w * 0.9);
  const rest = L.unite(g.filter((x) => x.item).map((x) => x.item));
  add('S6 O with joined minute hand', [{ item: L.unite(rest, min, hr, hub), fill: INK }]);
}

// ---------- S7: leading accent glyph locked to cap height ----------
{
  const cap = 8, font = 'xbold';
  const st = kit.stem(font, cap);
  const t = L.text('OFF SHFT', { font, cap, track: 0.14 });
  const hubX = -0.2 * cap - 0.5 * cap, hubY = cap * 0.62;
  const min = L.bar(hubX, hubY, hubX, 0, st);
  const [hx, hy] = kit.polar(hubX, hubY, 150, 10);
  const hour = L.intersect(L.bar(hubX, hubY, hx, hy, st * 1.06), L.rect(hubX - 20, -5, 40, cap + 5));
  const hub = L.circle(hubX, hubY, st * 0.9);
  add('S7 leading accent', [{ item: L.unite(min, hour, hub), fill: RUST }, { item: t.item, fill: INK }]);
}

(async () => {
  const files = [];
  for (const s of sketches) {
    const f = `${OUT}/${s.name.replace(/[^A-Za-z0-9]+/g, '_')}`;
    L.writeArt(f + '.svg', s.parts, { pad: 1 });
    await kit.render(f + '.svg', f + '.png', { bg: kit.F.bone, tile: s.opts.tile || '110x40' });
    files.push(f + '.png');
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '2x', '-geometry', '760x276+6+6', '-pointsize', '16', '-background', '#888', OUT + '/sheet.png']);
  await L.closeAll();
  console.log('ok', files.length);
})();
