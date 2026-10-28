// Round 4: clock-axis divider, cap-height accent with ring hub, refined dial and monogram.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s4';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const kids = (item) => (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)).map((c) => c.clone({ insert: false }));
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;

// hands with ring hub; w = minute width; hour width = w*1.1; flat tips
function ringHands(cx, cy, Lm, Lh, w, { R = w * 1.25, hole = w * 0.45, solidHub = false, tipFlatH = null } = {}) {
  let m = L.hand(cx, cy, 0, 0, Lm, w);
  let h = L.hand(cx, cy, 150, 0, Lh + (tipFlatH ? w : 0), w * 1.1);
  if (tipFlatH !== null) h = L.intersect(h, L.rect(cx - 50, cy - 100, 100, tipFlatH - (cy - 100)));
  let u = L.unite(m, h, L.circle(cx, cy, R));
  if (!solidHub) u = L.subtract(u, L.circle(cx, cy, hole));
  return u;
}

// ---- clock-axis divider ----
function axis(font, cap, { hub = 'ring', track = 0.13, gapK = 1.0 } = {}) {
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track });
  const cy = cap / 2;
  const Lh = (cap / 2) / C30; // hour tip on the baseline
  const Lm = cap; // minute hand = one cap height
  const w = st * 0.92;
  const R = w * 1.3;
  // space: from F's right edge to the hub = R + gapK*st ; from hour tip to S = similar
  const offEnd = g[2].x2;
  const cx = offEnd + R + st * 1.35 * gapK;
  const tipX = cx + Lh * S30 + w * 1.1 / 2 * C30;
  const sStart = tipX + st * 1.1 * gapK;
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), sStart - g[4].x1, 0);
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const hands = ringHands(cx, cy, Lm, Lh, w, { R, hole: Math.max(1.2, w * 0.6) / 2 * 1.0, solidHub: hub === 'solid', tipFlatH: cap });
  return { off, shft, hands };
}
{
  const a = axis('xbold', 7);
  add('X1 axis ring hub xbold cap7', [{ item: a.off, fill: INK }, { item: a.hands, fill: RUST }, { item: a.shft, fill: INK }]);
  const b = axis('xbold', 7, { hub: 'solid' });
  add('X2 axis solid hub', [{ item: b.off, fill: INK }, { item: b.hands, fill: RUST }, { item: b.shft, fill: INK }]);
  const c = axis('xsemi', 7.5);
  add('X3 axis ring hub xsemi one colour', [{ item: L.unite(c.off, c.hands, c.shft), fill: INK }]);
}
// clock-axis mark: hands + 9/3 ticks
{
  const H = 25; const cx = 0, cy = 0; const w = 2.3; const Lm = 10, Lh = 5.77;
  const hands = ringHands(cx, cy, Lm, Lh, w, { R: w * 1.3, hole: 0.75 });
  const tickL = 4.2, off = 3.2 + w * 1.3;
  const ticks = L.unite(L.bar(cx - off - tickL, cy, cx - off, cy, w), L.bar(cx + off, cy, cx + off + tickL, cy, w));
  add('X4 axis mark with 9-3 ticks', [{ item: L.unite(hands, ticks), fill: RUST }], { tile: '60x40' });
  add('X5 axis mark hands only', [{ item: hands, fill: RUST }], { tile: '60x40' });
}

// ---- cap-height accent with ring hub (after SHFT) ----
{
  const font = 'xbold', cap = 7.5; const st = kit.stem(font, cap);
  const t = L.text('OFF SHFT', { font, cap, track: 0.13 });
  const hubY = cap * 0.62; // from top -> 0.38 cap above baseline
  const w = st * 0.9; const R = w * 1.3;
  const Lm = hubY; const Lh = (cap - hubY) / C30;
  const last = t.letters[7];
  const cx = last.x2 + st * 1.6 + R;
  const acc = ringHands(cx, hubY, Lm, Lh, w, { R, hole: 0.65, tipFlatH: cap });
  add('C1 accent after SHFT ring hub', [{ item: t.item, fill: INK }, { item: acc, fill: RUST }]);
  const cx2 = t.letters[0].x1 - st * 1.6 - R - Lh * S30;
  const acc2 = ringHands(cx2, hubY, Lm, Lh, w, { R, hole: 0.65, tipFlatH: cap });
  add('C2 accent before OFF ring hub', [{ item: acc2, fill: RUST }, { item: t.item, fill: INK }]);
}

// ---- dial O refinements ----
function dialO(font, cap, { wM = 1.25, margin = 1.3, ratio = 0.64, hubR = 0, track = 0.13 } = {}) {
  const g = L.glyphs('OFF SHFT', { font, cap, track });
  const solid = kids(g[0].item)[0]; const b = L.bounds(solid);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const Lm = b.h / 2 - margin; const Lh = Lm * ratio;
  const slot = L.unite(L.hand(cx, cy, 0, 0, Lm, wM), L.hand(cx, cy, 150, 0, Lh, wM * 1.1), L.circle(cx, cy, hubR || wM / 2));
  return { dial: L.subtract(solid, slot), rest: L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item)), solid, cx, cy, b };
}
{
  const a = dialO('xbold', 7.5, { wM: 1.25, ratio: 0.62 });
  add('D1 dial xbold 7.5 rust', [{ item: a.dial, fill: RUST }, { item: a.rest, fill: INK }]);
  const b = dialO('xbold', 7.5, { wM: 1.25, ratio: 0.62, hubR: 1.0 });
  add('D2 dial with round hub', [{ item: b.dial, fill: RUST }, { item: b.rest, fill: INK }]);
  // the mark: dial alone at 25mm wide
  const s = 25 / a.b.w;
  const sm = L.scaled(a.solid, s, a.cx, a.cy); const bm = L.bounds(sm);
  const mx = bm.x + bm.w / 2, my = bm.y + bm.h / 2;
  for (const [wM, mg, tag] of [[2.1, 2.6, 'w2.1'], [2.6, 2.6, 'w2.6']]) {
    const Lm = bm.h / 2 - mg, Lh = Lm * 0.62;
    const slot = L.unite(L.hand(mx, my, 0, 0, Lm, wM), L.hand(mx, my, 150, 0, Lh, wM * 1.1), L.circle(mx, my, wM / 2));
    add(`D3 dial mark ${tag}`, [{ item: L.subtract(sm, slot), fill: RUST }], { tile: '60x40' });
  }
}

// ---- monogram + stacked name, refined ----
{
  const cap = 6; const st = kit.stem('xbold', cap);
  const lead = cap * 0.75; const H = cap * 2 + lead;
  // heavy Archivo-like ring: use xbold O outer, inner from xmed proportions
  const ot = L.text('O', { font: 'xbold', cap: 10 }); const [outer] = kids(ot.item);
  const ob = L.bounds(outer); const k = H / ob.h; const O = L.scaled(outer, k, ob.x, ob.y); const bb = L.bounds(O);
  const cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2;
  const ringSide = st * 1.0, ringTop = st * 0.85;
  const inn = O.clone({ insert: false }); inn.scale((bb.w - 2 * ringSide) / bb.w, (bb.h - 2 * ringTop) / bb.h, L.P(cx, cy));
  const ring = L.subtract(O, inn); const ib = L.bounds(inn);
  const w = st * 0.72; const Lm = ib.h / 2 - 1.5; const Lh = Lm * 0.62;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.1), L.circle(cx, cy, w * 0.5));
  const gap = st * 2.0;
  const x0 = bb.x + bb.w + gap;
  const a = L.text('OFF', { font: 'xbold', cap, track: 0.16, x: x0, y: bb.y + cap });
  const b2 = L.text('SHFT', { font: 'xbold', cap, track: 0.16, x: x0, y: bb.y + H });
  add('M1 monogram + stack', [{ item: ring, fill: INK }, { item: hands, fill: RUST }, { item: a.item, fill: INK }, { item: b2.item, fill: INK }], { tile: '90x30' });
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
