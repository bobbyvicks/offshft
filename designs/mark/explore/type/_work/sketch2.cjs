// Round 2 sketches: clock-O refinements, dial-O without keyhole, divider and T constructions.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s2';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const outerOf = (item) => { const ch = (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)); return ch[0].clone({ insert: false }); };
const innerOf = (item) => { const ch = (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)); return ch[1].clone({ insert: false }); };
const RAD = Math.PI / 180;

// Hands meeting in a clean joint (no hub bulge). Joint rounded on the outside.
function joint(cx, cy, Lm, Lh, wm, wh, { round = true } = {}) {
  const m = L.hand(cx, cy, 0, -wh * 0.0, Lm, wm);
  const h = L.hand(cx, cy, 150, 0, Lh, wh);
  const parts = [m, h];
  if (round) parts.push(L.circle(cx, cy, Math.max(wm, wh) / 2));
  return L.unite(parts);
}

// ---- A. clock O variants (minute hand fused to the counter top) ----
for (const [font, cap, hub, tag] of [['xbold', 7.5, 0, 'xbold no hub'], ['xbold', 7.5, 1.0, 'xbold hub1.0w'], ['xsemi', 7.5, 0, 'xsemi no hub'], ['xblack', 7.5, 0, 'xblack no hub']]) {
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const O = g[0].item;
  const inner = innerOf(O); const ib = L.bounds(inner);
  const cx = ib.x + ib.w / 2, cy = ib.y + ib.h / 2;
  const w = Math.max(1.25, (L.bounds(outerOf(O)).h - ib.h) / 2 * 0.95);
  const Lm = ib.h / 2 + 0.3; // into the ring
  // hour: keep 1.25 mm from the counter edge
  let Lh = 0; for (let r = 0; r < 10; r += 0.02) { const [x, y] = kit.polar(cx, cy, 150, r + w * 0.5 + 1.25); if (!inner.contains(L.P(x, y))) { Lh = r; break; } }
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w), L.circle(cx, cy, hub ? w * hub : w / 2));
  const all = L.unite(g.filter((x) => x.item).map((x) => x.item));
  add(`A clock-O ${tag} cap${cap}`, [{ item: L.unite(all, hands), fill: INK }]);
}
// clock O standalone (xbold O scaled to 25mm) mono rust
{
  const font = 'xbold';
  const O = L.text('O', { font, cap: 19.2 }).item;
  const inner = innerOf(O); const ib = L.bounds(inner);
  const cx = ib.x + ib.w / 2, cy = ib.y + ib.h / 2;
  const w = 3.0; const Lm = ib.h / 2 + 0.5;
  let Lh = 0; for (let r = 0; r < 30; r += 0.02) { const [x, y] = kit.polar(cx, cy, 150, r + w * 0.5 + 2.0); if (!inner.contains(L.P(x, y))) { Lh = r; break; } }
  add('A clock-O mark 25mm', [{ item: L.unite(O, L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w), L.circle(cx, cy, w / 2)), fill: RUST }]);
}

// ---- B. dial O (solid, hands knocked out, no hub bulge) ----
{
  const font = 'xbold', cap = 7.5;
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const solid = outerOf(g[0].item); const b = L.bounds(solid);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const w = 1.25; const Lm = b.h / 2 - 1.3; const Lh = Lm * 0.66;
  const slot = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w), L.circle(cx, cy, w / 2));
  const rest = L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item));
  add('B dial-O lockup', [{ item: L.subtract(solid, slot), fill: RUST }, { item: rest, fill: INK }]);
  const s = 25 / b.w; const sm = L.scaled(solid, s, cx, cy); const bm = L.bounds(sm);
  const mx = bm.x + bm.w / 2, my = bm.y + bm.h / 2; const wM = 2.2; const LmM = bm.h / 2 - 2.6; const LhM = LmM * 0.66;
  add('B dial-O mark', [{ item: L.subtract(sm, L.unite(L.hand(mx, my, 0, 0, LmM, wM), L.hand(mx, my, 150, 0, LhM, wM), L.circle(mx, my, wM / 2))), fill: RUST }]);
}

// ---- C. divider: hands centred between words, ring hub ----
{
  const font = 'xbold', cap = 7;
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const space = 9.0; // word gap
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const offEnd = g[2].x2; const shift = offEnd + space - g[4].x1;
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), shift, 0);
  const cx = offEnd + space / 2 - 0.6; const cy = cap * 0.62;
  const w = 1.4; const Lm = cap * 0.62 + 2.2; const Lh = Lm * 0.6;
  const hubR = 1.9;
  const hands = L.subtract(L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.1), L.circle(cx, cy, hubR)), L.circle(cx, cy, 0.7));
  add('C divider ring hub', [{ item: off, fill: INK }, { item: hands, fill: RUST }, { item: shft, fill: INK }]);
  // divider exactly cap height, no hub, hands as type strokes, minute = stem weight
  const cx2 = offEnd + 4.2; const hubY = cap * (1 - 0.36);
  const m2 = L.bar(cx2, hubY + st / 2, cx2, 0, st);
  const [hx, hy] = kit.polar(cx2, hubY, 150, 20);
  const h2 = L.intersect(L.bar(cx2, hubY, hx, hy, st * 1.08), L.rect(cx2 - 30, -5, 60, cap + 5));
  const shft2 = L.moved(L.unite(g.slice(4).map((x) => x.item)), offEnd + 8.6 - g[4].x1, 0);
  add('C2 divider type-stroke glyph', [{ item: off, fill: INK }, { item: L.unite(m2, h2, L.circle(cx2, hubY, st / 2)), fill: RUST }, { item: shft2, fill: INK }]);
}

// ---- D. T constructions ----
{
  const font = 'xbold', cap = 7.5;
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const T = g[7]; const tb = L.bounds(T.item); const sx = tb.x + tb.w / 2;
  const rest = L.unite(g.slice(0, 7).filter((x) => x.item).map((x) => x.item));
  // D1: T stem + hour-hand leg from lower third
  const hubY = cap * (1 - 0.36);
  const [hx, hy] = kit.polar(sx, hubY, 150, 20);
  const leg = L.intersect(L.bar(sx, hubY, hx, hy, st * 0.9), L.rect(sx - 30, -5, 60, cap + 5));
  add('D1 T plus hour leg', [{ item: rest, fill: INK }, { item: L.unite(T.item, leg), fill: INK }]);
  // D2: T stem as minute hand, hub at baseline, hour hand below baseline (descender)
  const [hx2, hy2] = kit.polar(sx, cap, 150, cap * 0.55);
  const tail = L.bar(sx, cap - st * 0.3, hx2, hy2, st * 0.95);
  add('D2 T with hour-hand descender', [{ item: rest, fill: INK }, { item: L.unite(T.item, tail), fill: INK }]);
  // D3: T where crossbar removed above the hub? -> T stem rises past crossbar as minute hand
  const up = L.bar(sx, cap * 0.5, sx, -cap * 0.45, st);
  add('D3 T stem rises above crossbar', [{ item: rest, fill: INK }, { item: L.unite(T.item, up), fill: INK }]);
}

// ---- E. stacked compact block: OFF + hands / SHFT ----
{
  const font = 'xbold', cap = 7;
  const st = kit.stem(font, cap);
  const a = L.text('OFF', { font, cap, track: 0.13 });
  const b = L.text('SHFT', { font, cap, track: 0.13, y: cap * 2.45 });
  const offEnd = a.letters[2].x2; const shEnd = b.letters[3].x2;
  const cx = (offEnd + shEnd) / 2 + 0.3; const hubY = cap * (1 - 0.36);
  const m = L.bar(cx, hubY, cx, 0, st);
  const [hx, hy] = kit.polar(cx, hubY, 150, 20);
  const h = L.intersect(L.bar(cx, hubY, hx, hy, st * 1.08), L.rect(cx - 30, -5, 60, cap + 5));
  add('E stacked block', [{ item: a.item, fill: INK }, { item: L.unite(m, h, L.circle(cx, hubY, st / 2)), fill: RUST }, { item: b.item, fill: INK }], { tile: '60x40' });
}

(async () => {
  const files = [];
  for (const s of sketches) {
    const f = `${OUT}/${s.name.replace(/[^A-Za-z0-9]+/g, '_')}`;
    L.writeArt(f + '.svg', s.parts, { pad: 1 });
    await kit.render(f + '.svg', f + '.png', { bg: kit.F.bone, tile: s.opts.tile || '100x34' });
    files.push(f + '.png');
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '2x', '-geometry', '760x258+6+6', '-pointsize', '16', '-background', '#888', OUT + '/sheet.png']);
  await L.closeAll();
  console.log('ok', files.length);
})();
