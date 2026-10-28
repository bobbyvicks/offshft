// OFF SHFT mark exploration, direction "Bold geometric".
// Builds G1..G4: mark.svg, mark-dark.svg, lockup.svg + PNG renders + sheet.png.
// All geometry is drawn on a unit grid (u) with the shared pivot at (0,0), y down, then scaled to mm.
// Clock angles: minute hand 0 deg (straight up), hour hand 150 deg (kit.FIVE).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { kit, bar, union, difference, polyD, rectPoly, dir, add, mul, bbox, circlePoly, lnorm, inter } = L;
const ROOT = __dirname;
const P = [0, 0];
const MIN = kit.FIVE.minute, HR = kit.FIVE.hour;

// ---------- shape helpers (unit space) ----------
// bar from C with a round end centred on C (radius w/2); square tip at distance Lb
function capBar(C, deg, Lb, w, n = 120) {
  const d = dir(deg), nn = lnorm(d);
  const pts = [add(C, add(mul(d, Lb), mul(nn, w / 2))), add(C, add(mul(d, Lb), mul(nn, -w / 2)))];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 - (i / n) * Math.PI;
    pts.push(add(C, mul(add(mul(d, Math.cos(t)), mul(nn, Math.sin(t))), w / 2)));
  }
  return pts;
}
const circ = (c, r, n = 180) => circlePoly(c, r, n);
const diamond = (c, k) => [[c[0], c[1] - k], [c[0] + k, c[1]], [c[0], c[1] + k], [c[0] - k, c[1]]];
const scaleLoops = (loops, k, dx = 0, dy = 0) => loops.map((p) => p.map(([x, y]) => [x * k + dx, y * k + dy]));

// ---------- the four marks (unit space) ----------
const hexPoly = (c, R) => [...Array(6)].map((_, i) => { const a = (i * Math.PI) / 3; return [c[0] + R * Math.sin(a), c[1] - R * Math.cos(a)]; }); // vertex at 12
const MARKS = {
  // G1 Overlap: the hour hand is laid over the minute hand; a 1.05u hairline of fabric shows the layering.
  // Round where it turns (hour hand end, concentric with the minute hand's cupped end), square where it points.
  // Grid (u): minute 3.3 x 13.6; hour 3.5 wide (optical +6% for the diagonal), 6.2 long, round end r 1.75; gap 1.05.
  G1(p = {}) {
    const o = { wm: 3.3, wh: 3.5, Lm: 13.6, Lh: 6.2, g: 1.05, ...p };
    const hour = capBar(P, HR, o.Lh, o.wh);
    const hourGap = capBar(P, HR, o.Lh + o.g, o.wh + 2 * o.g);
    const minute = difference([bar(P, MIN, { len: o.Lm, w: o.wm })], [hourGap]);
    return { layers: [{ loops: [...minute, ...union([hour])], role: 'main' }], o };
  },
  // G2 Checked: a square field; hands and hub are knocked out, the pin stays as thread.
  // Grid (u): field 16; minute 2.5 wide reaching 1.6 from the top edge; hour 2.8 wide, 5.5 long; hub r 1.85; pin r 0.72.
  G2(p = {}) {
    const o = { S: 16, wm: 2.5, wh: 2.8, top: 1.6, Lh: 5.5, hub: 1.85, pin: 0.72, ...p };
    const half = o.S / 2;
    const m = bar(P, MIN, { len: half - o.top, w: o.wm });
    const h = bar(P, HR, { len: o.Lh, w: o.wh });
    const loops = difference([rectPoly(-half, -half, o.S, o.S)], [m, h, circ(P, o.hub)]);
    loops.push(circ(P, o.pin, 120));
    return { layers: [{ loops, role: 'main' }], o };
  },
  // G3 Nut: a hex nut holds both hands; a 1u gap follows the nut, so the minute hand ends in a 120 deg notch
  // and the hour hand in a square cut parallel to a flat of the nut.
  // Grid (u): minute 2.2 x 11.5; hour 2.4 x 8.6; nut circumradius 2.3 (flat-to-flat 4); bore r 0.85; gap 1.05.
  G3(p = {}) {
    const o = { wm: 2.2, wh: 2.4, Lm: 11.5, Lh: 8.6, Rh: 2.3, g: 1.05, bore: 0.85, ...p };
    const nut = hexPoly(P, o.Rh);
    const nutGap = L.grow(nut, o.g);
    const m = difference([bar(P, MIN, { len: o.Lm, w: o.wm })], [nutGap]);
    const h = difference([bar(P, HR, { len: o.Lh, w: o.wh })], [nutGap]);
    return { layers: [{ loops: [...m, ...h], role: 'main' }, { loops: o.bore ? [nut, circ(P, o.bore, 120)] : [nut], role: 'accent' }], o };
  },
  // G4 Skeleton: one continuous band of constant weight draws both hands and the hub; the pin floats in the middle.
  // Grid (u): hands 4 wide (hour x1.05), band 1; hub r 2.8; pin r 0.65; minute 11.5, hour 7.8.
  G4(p = {}) {
    const o = { w: 4, hk: 1.05, t: 1, R: 2.8, pin: 0.65, Lm: 11.5, Lh: 7.8, ...p };
    const wh = o.w * o.hk;
    const outer = union([bar(P, MIN, { len: o.Lm, w: o.w }), bar(P, HR, { len: o.Lh, w: wh }), circ(P, o.R)]);
    if (o.filled) return { layers: [{ loops: [...outer, circ(P, o.filled, 120)], role: 'main' }], o }; // small-size version: solid with a pin hole
    const inner = union([bar(P, MIN, { len: o.Lm - o.t, w: o.w - 2 * o.t }), bar(P, HR, { len: o.Lh - o.t, w: wh - 2 * o.t }), circ(P, o.R - o.t)]);
    const loops = difference(outer, inner);
    loops.push(circ(P, o.pin, 120));
    return { layers: [{ loops, role: 'main' }], o };
  },
};

// ---------- colour schemes ----------
const T = kit.T, F = kit.F;
const SCHEME = {
  G1: { light: { main: T.ink }, dark: { main: T.bone }, lockup: { main: T.rust, word: T.ink } },
  G2: { light: { main: T.rust }, dark: { main: T.bone }, lockup: { main: T.rust, word: T.ink } },
  G3: { light: { main: T.ink, accent: T.ink }, dark: { main: T.sun, accent: T.sun }, lockup: { main: T.ink, accent: T.rust, word: T.ink } },
  G4: { light: { main: T.rust }, dark: { main: T.sun }, lockup: { main: T.rust, word: T.ink } },
};

// ---------- SVG writers ----------
function markBody(mk, k, dx, dy, colours) {
  return mk.layers
    .map((ly) => `<path fill="${colours[ly.role] || colours.main}" fill-rule="evenodd" d="${scaleLoops(ly.loops, k, dx, dy).map(polyD).join('')}"/>`)
    .join('\n');
}
const markBBox = (mk) => bbox(mk.layers.flatMap((l) => l.loops));
function writeMark(file, mk, size, colours, margin = 0.5) {
  const bb = markBBox(mk);
  const k = size / Math.max(bb.w, bb.h);
  const w = bb.w * k + 2 * margin, h = bb.h * k + 2 * margin;
  kit.writeSvg(file, { w, h, body: markBody(mk, k, -bb.x0 * k + margin, -bb.y0 * k + margin, colours) });
  return { k, w, h };
}

// word gap of the wordmark (ink of last F to ink of S), in mm
function wordGap(font, cap, track) {
  const t = kit.text('OFF SHFT', { font, cap, track, x: 0, y: cap });
  return t.letters[4].x1 - t.letters[2].x2;
}

// rightmost x of the mark inside the horizontal band y0..y1 (unit space)
function bandRight(mk, y0, y1) {
  let xr = -Infinity;
  for (const ly of mk.layers) for (const loop of ly.loops) {
    let part = L.clipHalf(loop, [0, y0], [0, 1]);
    if (part.length >= 3) part = L.clipHalf(part, [0, y1], [0, -1]);
    if (part.length >= 3) for (const [x] of part) xr = Math.max(xr, x);
  }
  return xr;
}

// Lockup.
// opts: cap (mm cap height), and either markH (mm mark height) or capU (cap height in mark units, ties type to the grid);
// font, track; baseU (baseline y in mark units, or fn(bb, capU)); gap: 'word' | mm | {u}; gapFrom: 'bbox' | 'band'
function writeLockup(file, mk, colours, opts) {
  const bb = markBBox(mk);
  const k = opts.capU ? opts.cap / opts.capU : opts.markH / bb.h; // mm per unit
  const margin = 1;
  const capU = opts.cap / k;
  const baseU = typeof opts.baseU === 'function' ? opts.baseU(bb, capU, mk) : opts.baseU;
  const gapMM = (opts.gap === 'word' ? wordGap(opts.font, opts.cap, opts.track) : typeof opts.gap === 'object' ? opts.gap.u * k : opts.gap) * (opts.gapScale || 1);
  const top = Math.min(bb.y0, baseU - capU), bottom = Math.max(bb.y1, baseU);
  const markDx = margin - bb.x0 * k, markDy = margin - top * k;
  const baselineMM = margin + (baseU - top) * k;
  const probe = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, x: 0, y: 0 });
  const rightU = opts.gapFrom === 'band' ? bandRight(mk, baseU - capU, baseU) : bb.x1;
  const wx = markDx + rightU * k + gapMM - probe.letters[0].x1;
  const word = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, fill: colours.word, x: wx, y: baselineMM });
  const W = Math.max(word.letters[word.letters.length - 1].x2, markDx + bb.x1 * k) + margin, H = (bottom - top) * k + 2 * margin;
  kit.writeSvg(file, { w: W, h: H, body: markBody(mk, k, markDx, markDy, colours) + '\n' + word.svg });
  const markRightMM = markDx + bb.x1 * k, wordLeftMM = word.letters[0].x1;
  return { k, W, H, gapMM, markH: bb.h * k, stem: kit.stem(opts.font, opts.cap), clearance: wordLeftMM - markRightMM };
}

// ---------- variant configs ----------
// baseU helpers
const centre = (bb, capU) => (bb.y0 + bb.y1) / 2 + capU / 2;
const CONFIG = {
  // pivot (centre of the hour hand's round end) on the baseline; cap = 5.5u
  G1: { lock: { cap: 6.7, capU: 5.5, font: 'xbold', track: 0.16, gap: 'word', gapFrom: 'band', baseU: 0 } },
  // cap band = middle third of the square; gap = a quarter of the square
  G2: { lock: { cap: 6.35, capU: 16 / 3, font: 'xbold', track: 0.16, gap: { u: 4 }, gapFrom: 'bbox', baseU: 8 / 3 } },
  // the nut spans the cap band (points overshoot 1.5%)
  G3: { lock: { cap: 5.8, capU: 4.6 * 0.97, font: 'xbold', track: 0.16, gap: 'word', gapScale: 1.15, gapFrom: 'band', baseU: 2.3 * 0.97 } },
  // the hub ring spans the cap band (round overshoot like the O)
  G4: { lock: { cap: 6.9, capU: 5.6 / 1.038, font: 'xsemi', track: 0.18, gap: 'word', gapFrom: 'band', baseU: 2.8 / 1.038 } },
};

// Simplified versions for 13 mm (side of the hat): same drawing, gaps and holes opened up to >= 1.2 mm at 13 mm.
const SMALL = {
  G1: { g: 1.9 },
  G2: { hub: 2.3, pin: 0.78 },
  G3: { g: 1.85, bore: 0 },
  G4: { filled: 0.95 },
};

async function buildVariant(id) {
  const dirV = path.join(ROOT, id);
  fs.mkdirSync(dirV, { recursive: true });
  const cfg = CONFIG[id];
  const mk = MARKS[id](cfg.mark || {});
  const sc = SCHEME[id];
  const info = writeMark(path.join(dirV, 'mark.svg'), mk, 25, sc.light);
  writeMark(path.join(dirV, 'mark-dark.svg'), mk, 25, sc.dark);
  const lk = writeLockup(path.join(dirV, 'lockup.svg'), mk, sc.lockup, cfg.lock);
  await kit.render(path.join(dirV, 'mark.svg'), path.join(dirV, 'mark.png'), { bg: F.bone });
  await kit.render(path.join(dirV, 'mark-dark.svg'), path.join(dirV, 'mark-dark.png'), { bg: F.slate });
  await kit.render(path.join(dirV, 'lockup.svg'), path.join(dirV, 'lockup.png'), { bg: F.bone });
  await kit.sizes(path.join(dirV, 'mark.svg'), path.join(dirV, 'sizes.png'), { bg: F.bone });
  // small-size version, written at 13 mm and shown enlarged next to the full mark at 13 mm
  const sm = MARKS[id]({ ...(cfg.mark || {}), ...SMALL[id] });
  writeMark(path.join(dirV, 'mark-small.svg'), sm, 13, sc.light, 0.3);
  const tmp = path.join(ROOT, '_small');
  fs.mkdirSync(tmp, { recursive: true });
  writeMark(path.join(tmp, 'full.svg'), mk, 13, sc.light, 0.3);
  const A = path.join(tmp, `${id} full mark at 13mm.png`), Bp = path.join(tmp, `${id} small version at 13mm.png`);
  await kit.render(path.join(tmp, 'full.svg'), A, { bg: F.bone, px: 16, tile: '24x18' });
  await kit.render(path.join(dirV, 'mark-small.svg'), Bp, { bg: F.bone, px: 16, tile: '24x18' });
  execFileSync('montage', ['-label', '%t', A, Bp, '-tile', '2x', '-geometry', '+6+6', '-pointsize', '22', '-background', '#888888', path.join(dirV, 'small.png')]);
  fs.rmSync(tmp, { recursive: true, force: true });
  return { id, unitMM25: info.k, lockup: lk };
}

function sheet(ids) {
  const tmp = path.join(ROOT, '_sheet');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  const files = [];
  for (const id of ids) {
    for (const n of ['mark', 'mark-dark', 'lockup', 'sizes']) {
      const dst = path.join(tmp, `${id}-${n}.png`);
      fs.copyFileSync(path.join(ROOT, id, `${n}.png`), dst);
      files.push(dst);
    }
  }
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '4x', '-geometry', '440x256+8+8', '-pointsize', '18', '-background', '#888888', path.join(ROOT, 'sheet.png')]);
}

module.exports = { MARKS, SCHEME, CONFIG, SMALL, capBar, circ, diamond, writeMark, writeLockup, wordGap, markBBox };

if (require.main === module) {
  (async () => {
    const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['G1', 'G2', 'G3', 'G4'];
    const out = [];
    for (const id of ids) out.push(await buildVariant(id));
    await kit.close();
    for (const r of out) console.log(r.id, 'u@25mm =', r.unitMM25.toFixed(3), 'mm', JSON.stringify(r.lockup, (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)));
    if (ids.length === 4) sheet(ids);
  })();
}
