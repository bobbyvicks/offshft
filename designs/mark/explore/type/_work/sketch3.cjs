// Round 3: pivot constructions, refined dial, monogram layouts, T retries.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const { execFileSync } = require('child_process');
const OUT = __dirname + '/s3';
require('fs').mkdirSync(OUT, { recursive: true });
const INK = kit.T.ink, RUST = kit.T.rust;
const sketches = [];
const add = (name, parts, opts = {}) => sketches.push({ name, parts, opts });
const kids = (item) => (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)).map((c) => c.clone({ insert: false }));
const C30 = Math.cos(Math.PI / 6);

// ---------- pivot studies at 25 mm tall (symbol alone) ----------
function pivotSet(cx, cy, H, kind) {
  // H = minute tip to hour tip vertical extent approx. Returns item.
  const w = H * 0.085;
  const Lm = H * 0.62, Lh = Lm * 0.62;
  if (kind === 'exploded') {
    const r = w * 0.8, g = w * 0.75;
    return L.unite(L.circle(cx, cy, r), L.hand(cx, cy, 0, r + g, Lm, w), L.hand(cx, cy, 150, r + g, Lh, w * 1.15));
  }
  if (kind === 'ringhub') {
    const R = w * 1.35;
    return L.subtract(L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.15), L.circle(cx, cy, R)), L.circle(cx, cy, R - w * 0.9));
  }
  if (kind === 'tails') {
    return L.unite(L.hand(cx, cy, 0, -Lm * 0.22, Lm, w), L.hand(cx, cy, 150, -Lh * 0.3, Lh, w * 1.2), L.circle(cx, cy, w * 0.95));
  }
  if (kind === 'blades') {
    return L.unite(L.taper(cx, cy, 0, 0, Lm, w * 1.6, w * 0.75), L.taper(cx, cy, 150, 0, Lh, w * 2.0, w * 0.95), L.circle(cx, cy, w * 0.95));
  }
  if (kind === 'pin') { // hands overlap a solid hub that has a pin hole
    const R = w * 1.5;
    return L.subtract(L.unite(L.hand(cx, cy, 0, 0, Lm, w), L.hand(cx, cy, 150, 0, Lh, w * 1.15), L.circle(cx, cy, R)), L.circle(cx, cy, w * 0.55));
  }
  if (kind === 'counter') { // hands both pass the hub: minute tail + hour tail, no hub
    return L.unite(L.hand(cx, cy, 0, -Lm * 0.18, Lm, w), L.hand(cx, cy, 150, -Lh * 0.28, Lh, w * 1.2));
  }
}
for (const kind of ['exploded', 'ringhub', 'tails', 'blades', 'pin', 'counter']) {
  add(`P pivot ${kind}`, [{ item: pivotSet(0, 0, 25, kind), fill: RUST }], { tile: '60x40' });
}

// ---------- dial O refined ----------
function dialO(font, cap, { wM = 1.25, margin = 1.3, ratio = 0.64, hub = 0 } = {}) {
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const solid = kids(g[0].item)[0]; const b = L.bounds(solid);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const Lm = b.h / 2 - margin; const Lh = Lm * ratio;
  const slot = L.unite(L.hand(cx, cy, 0, -wM / 2, Lm, wM), L.hand(cx, cy, 150, 0, Lh, wM * 1.12), hub ? L.circle(cx, cy, hub) : L.circle(cx, cy, wM * 0.56));
  return { dial: L.subtract(solid, slot), rest: L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item)), g };
}
{
  const a = dialO('xbold', 8);
  add('D dial xbold cap8 rust', [{ item: a.dial, fill: RUST }, { item: a.rest, fill: INK }]);
  const b = dialO('xsemi', 8, { wM: 1.25 });
  add('D dial xsemi cap8 one colour', [{ item: L.unite(b.dial, b.rest), fill: INK }]);
  const c = dialO('xblack', 7, { wM: 1.2, margin: 1.25 });
  add('D dial xblack cap7 rust', [{ item: c.dial, fill: RUST }, { item: c.rest, fill: INK }]);
}

// ---------- monogram layouts ----------
function ringO(W, ring, handW) { // monoline-ish ring using the xmed O outer shape scaled to width W
  const t = L.text('O', { font: 'xsemi', cap: 10 });
  const [outer, inner] = kids(t.item);
  const ob = L.bounds(outer); const s = W / ob.w;
  const o = L.scaled(outer, s, ob.x, ob.y); const bb = L.bounds(o);
  // inner = outer offset inwards approximately by scaling about centre
  const cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2;
  const inn = o.clone({ insert: false }); inn.scale((bb.w - 2 * ring * 1.12) / bb.w, (bb.h - 2 * ring) / bb.h, L.P(cx, cy));
  const ib = L.bounds(inn);
  const Lm = ib.h / 2 - Math.max(1.4, ring * 0.75); const Lh = Lm * 0.62;
  const hands = L.unite(L.hand(cx, cy, 0, 0, Lm, handW), L.hand(cx, cy, 150, 0, Lh, handW * 1.12), L.circle(cx, cy, handW * 0.5));
  return { ring: L.subtract(o, inn), hands, bb, cx, cy };
}
{
  // M1: monogram + two-line stack
  const cap = 6;
  const st = kit.stem('xbold', cap);
  const lead = cap * 0.8;
  const H = cap * 2 + lead;
  const r = ringO(H * 1.24, st * 1.05, st * 0.8);
  const k = H / r.bb.h; // ensure height
  const gap = st * 2.2;
  const a = L.text('OFF', { font: 'xbold', cap, track: 0.16, x: r.bb.x + r.bb.w + gap, y: r.bb.y + cap });
  const b2 = L.text('SHFT', { font: 'xbold', cap, track: 0.16, x: r.bb.x + r.bb.w + gap, y: r.bb.y + H });
  add('M1 monogram + stacked name', [{ item: r.ring, fill: INK }, { item: r.hands, fill: RUST }, { item: a.item, fill: INK }, { item: b2.item, fill: INK }], { tile: '90x34' });
  // M2: big initial monoline ring replacing O
  const cap2 = 6.5; const st2 = kit.stem('xbold', cap2);
  const g = L.glyphs('OFF SHFT', { font: 'xbold', cap: cap2, track: 0.13 });
  const r2 = ringO(cap2 * 1.75 * 1.25, st2, st2 * 0.75);
  const dx = g[1].x1 - st2 * 1.3 - (r2.bb.x + r2.bb.w); const dy = cap2 / 2 - (r2.bb.y + r2.bb.h / 2);
  const rest = L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item));
  add('M2 big initial monoline', [{ item: L.moved(r2.ring, dx, dy), fill: INK }, { item: L.moved(r2.hands, dx, dy), fill: RUST }, { item: rest, fill: INK }], { tile: '100x34' });
  // M3: big initial, baseline-aligned
  const dy3 = cap2 - (r2.bb.y + r2.bb.h) + 0.15;
  add('M3 big initial baseline aligned', [{ item: L.moved(r2.ring, dx, dy3), fill: INK }, { item: L.moved(r2.hands, dx, dy3), fill: RUST }, { item: rest, fill: INK }], { tile: '100x34' });
}

// ---------- divider with exploded hands, hub on the text midline ----------
for (const [kind, tag] of [['exploded', 'exploded'], ['blades', 'blades'], ['counter', 'counter']]) {
  const font = 'xbold', cap = 7;
  const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const space = cap * 1.5;
  const offEnd = g[2].x2; const shift = offEnd + space - g[4].x1;
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), shift, 0);
  const cx = offEnd + space / 2 - cap * 0.12, cy = cap / 2;
  // scale pivotSet so the hour tip lands on the baseline: Lh = (cap/2)/cos30 + overshoot
  const Lh = (cap / 2) / C30; const Lm = Lh / 0.62; const H = Lm / 0.62;
  add(`V divider ${tag}`, [{ item: off, fill: INK }, { item: pivotSet(cx, cy, H, kind), fill: RUST }, { item: shft, fill: INK }], { tile: '100x34' });
}

// ---------- T retries ----------
{
  const font = 'xbold', cap = 7.5; const st = kit.stem(font, cap);
  const g = L.glyphs('OFF SHFT', { font, cap, track: 0.13 });
  const T = g[7]; const tb = L.bounds(T.item); const sx = tb.x + tb.w / 2;
  const rest = L.unite(g.slice(0, 7).filter((x) => x.item).map((x) => x.item));
  // kicked T without hub, one colour
  const hubY = cap * 0.64;
  const cut = L.rect(sx - st, hubY, st * 2, cap);
  const Tm = L.subtract(T.item, cut);
  const [hx, hy] = kit.polar(sx, hubY, 150, 20);
  const kick = L.intersect(L.bar(sx, hubY - st * 0.3, hx, hy, st * 1.04), L.rect(sx - 30, -5, 60, cap + 5));
  add('T kicked T no hub', [{ item: rest, fill: INK }, { item: L.unite(Tm, kick, L.circle(sx, hubY, st / 2)), fill: INK }], { tile: '100x34' });
  // T with rust descender hour hand and hub at foot
  const [h2x, h2y] = kit.polar(sx, cap, 150, cap * 0.62);
  add('T rust descender', [{ item: rest, fill: INK }, { item: T.item, fill: INK }, { item: L.subtract(L.unite(L.hand(sx, cap, 150, 0, cap * 0.62, st * 1.05), L.circle(sx, cap, st * 0.62)), T.item), fill: RUST }], { tile: '100x34' });
}

// ---------- cap-height exploded accent ----------
{
  const font = 'xsemi', cap = 8.5; const st = kit.stem(font, cap);
  const t = L.text('OFF SHFT', { font, cap, track: 0.13 });
  const w = st * 0.78, r = w * 0.72, gp = 1.25;
  const hubY = cap - cap * 0.4; const cx = -cap * 0.75;
  const Lm = hubY; const Lh = (cap - hubY) / C30;
  const acc = L.unite(L.circle(cx, hubY, r), L.bar(cx, hubY - r - gp, cx, 0, w), L.intersect(L.hand(cx, hubY, 150, r + gp, Lh + w, w * 1.12), L.rect(cx - 20, -2, 40, cap + 2)));
  add('A accent exploded cap-locked', [{ item: acc, fill: RUST }, { item: t.item, fill: INK }], { tile: '100x34' });
}

(async () => {
  const files = [];
  for (const s of sketches) {
    const f = `${OUT}/${s.name.replace(/[^A-Za-z0-9]+/g, '_')}`;
    L.writeArt(f + '.svg', s.parts, { pad: 1 });
    await kit.render(f + '.svg', f + '.png', { bg: kit.F.bone, tile: s.opts.tile || '100x34' });
    files.push(f + '.png');
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '3x', '-geometry', '600x240+6+6', '-pointsize', '15', '-background', '#888', OUT + '/sheet.png']);
  await L.closeAll();
  console.log('ok', files.length);
})();
