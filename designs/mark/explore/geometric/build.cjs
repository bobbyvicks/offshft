// OFF SHFT mark exploration, direction "Bold geometric".
// Builds G1..G4: mark.svg, mark-dark.svg, lockup.svg + PNG renders + sheet.png.
// All geometry is drawn on a unit grid (u) with the shared pivot at (0,0), then scaled to mm.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { kit, bar, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, circlePoly, lnorm, inter } = L;
const ROOT = __dirname;
const P = [0, 0];

// ---------- shape helpers (unit space) ----------
// bar from P with a round (capsule) end centred on P; square tip at Lb
function capBar(C, deg, Lb, w, n = 96) {
  const d = dir(deg), nn = lnorm(d);
  const pts = [add(C, add(mul(d, Lb), mul(nn, w / 2))), add(C, add(mul(d, Lb), mul(nn, -w / 2)))];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 - (i / n) * Math.PI;
    pts.push(add(C, mul(add(mul(d, Math.cos(t)), mul(nn, Math.sin(t))), w / 2)));
  }
  return pts;
}
const circ = (c, r, n = 160) => circlePoly(c, r, n);
const scaleLoops = (loops, k, dx = 0, dy = 0) => loops.map((p) => p.map(([x, y]) => [x * k + dx, y * k + dy]));

// ---------- the four marks (unit space) ----------
// Each returns { layers: [{loops, role}], pivot, notes } ; role picks the colour.
const MARKS = {
  // G1 Rivet: hour hand laid over the minute hand on a rivet; a 1u gap shows the layering.
  G1(p = {}) {
    const o = { wm: 2.5, wh: 3, Lm: 10, Lh: 6, g: 1, pin: 0.5, ...p };
    const hour = capBar(P, 150, o.Lh, o.wh);
    const hourGap = capBar(P, 150, o.Lh + o.g, o.wh + 2 * o.g);
    const minute = difference([bar(P, 0, { len: o.Lm, w: o.wm })], [hourGap]);
    const hourWithPin = [...union([hour]), circ(P, o.pin, 96)];
    return { layers: [{ loops: [...minute, ...hourWithPin], role: 'main' }], o };
  },
  // G2 Checked: square field, hands knocked out; pivot at the centre.
  G2(p = {}) {
    const o = { S: 16, wm: 2.25, wh: 2.6, top: 2.25, Lh: 4.6, hub: 1.75, ...p };
    const c = [0, 0];
    const half = o.S / 2;
    const sq = rectPoly(-half, -half, o.S, o.S);
    const m = bar(c, 0, { len: half - o.top, w: o.wm });
    const h = bar(c, 150, { len: o.Lh, w: o.wh });
    const loops = difference([sq], [m, h, circ(c, o.hub)]);
    return { layers: [{ loops, role: 'main' }], o };
  },
  // G3 Cap: a round cap pinned over both hands, separated by a 1u ring.
  G3(p = {}) {
    const o = { wm: 2.5, wh: 2.75, Lm: 10, Lh: 6, rc: 1.75, g: 1, ...p };
    const ring = circ(P, o.rc + o.g);
    const m = difference([bar(P, 0, { len: o.Lm, w: o.wm })], [ring]);
    const h = difference([bar(P, 150, { len: o.Lh, w: o.wh })], [ring]);
    return { layers: [{ loops: [...m, ...h], role: 'main' }, { loops: [circ(P, o.rc)], role: 'accent' }], o };
  },
  // G4 Line: outline treatment; one line weight draws the hour hand over the minute hand.
  G4(p = {}) {
    const o = { t: 0.85, wm: 2.9, wh: 3.4, Lm: 10, Lh: 6.2, pin: 0, ...p };
    const hO = capBar(P, 150, o.Lh, o.wh), hI = capBar(P, 150, o.Lh - o.t, o.wh - 2 * o.t);
    const mO = bar(P, 0, { len: o.Lm, w: o.wm }), mI = bar(P, 0, { len: o.Lm - o.t, w: o.wm - 2 * o.t });
    const mRing = difference([mO], [mI, hO]);
    const loops = difference([hO, ...mRing], [hI]);
    if (o.pin) loops.push(circ(P, o.pin, 96));
    return { layers: [{ loops, role: 'main' }], o };
  },
};

// ---------- colour schemes ----------
const T = kit.T, F = kit.F;
const SCHEME = {
  G1: { light: { main: T.ink }, dark: { main: T.bone }, lockup: { main: T.rust, word: T.ink } },
  G2: { light: { main: T.rust }, dark: { main: T.sun }, lockup: { main: T.rust, word: T.ink } },
  G3: { light: { main: T.ink, accent: T.ink }, dark: { main: T.bone, accent: T.bone }, lockup: { main: T.ink, accent: T.rust, word: T.ink } },
  G4: { light: { main: T.rust }, dark: { main: T.sun }, lockup: { main: T.rust, word: T.ink } },
};

// ---------- SVG writers ----------
function markBody(mk, k, dx, dy, colours) {
  return mk.layers
    .map((ly) => `<path fill="${colours[ly.role] || colours.main}" fill-rule="evenodd" d="${scaleLoops(ly.loops, k, dx, dy).map(polyD).join('')}"/>`)
    .join('\n');
}
function markBBox(mk) {
  return bbox(mk.layers.flatMap((l) => l.loops));
}
// mark alone, longest side = size mm, with a small margin
function writeMark(file, mk, size, colours, margin = 0.5) {
  const bb = markBBox(mk);
  const k = size / Math.max(bb.w, bb.h);
  const w = bb.w * k + 2 * margin, h = bb.h * k + 2 * margin;
  kit.writeSvg(file, { w, h, body: markBody(mk, k, -bb.x0 * k + margin, -bb.y0 * k + margin, colours) });
  return { k, w, h };
}

// ---------- lockup ----------
// opts: markH (mm, mark height), cap (mm), font, track, gapU (gap in mark units), align
function writeLockup(file, mk, colours, opts) {
  const bb = markBBox(mk);
  const k = opts.markH / bb.h; // mm per unit
  const margin = 1;
  // baseline position in unit space relative to mark: choose by alignment
  // align: { pivotTo: 'cap'|'base'|'mid', or bottomTo:'base', or centre:true }
  let baseU; // baseline y in unit space
  const capU = opts.cap / k;
  if (opts.align === 'centre') baseU = (bb.y0 + bb.y1) / 2 + capU / 2;
  else if (opts.align === 'bottom') baseU = bb.y1;
  else if (opts.align === 'pivotCap') baseU = 0 + capU;
  else if (opts.align === 'pivotBase') baseU = 0;
  else if (typeof opts.align === 'number') baseU = opts.align; // explicit
  const word = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, fill: colours.word, x: 0, y: 0 });
  const wordX0 = (bb.x1 - bb.x0) * k + opts.gapU * k; // where the wordmark starts (relative to mark left)
  // mm coordinates: mark left at margin
  const top = Math.min(bb.y0, baseU - capU) * 1;
  const bottom = Math.max(bb.y1, baseU);
  const dyU = -top; // shift so top is 0
  const markDx = margin - bb.x0 * k, markDy = margin + dyU * k;
  const baselineMM = margin + (baseU + dyU) * k;
  const wordLeftInk = word.letters[0].x1; // ink left of O (side bearing)
  const wx = margin + wordX0 - wordLeftInk;
  const textSvg = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, fill: colours.word, x: wx, y: baselineMM });
  const lastInk = textSvg.letters[textSvg.letters.length - 1].x2;
  const W = lastInk + margin, H = (bottom - top) * k + 2 * margin;
  const body = markBody(mk, k, markDx, markDy, colours) + '\n' + textSvg.svg;
  kit.writeSvg(file, { w: W, h: H, body });
  return { k, W, H, baselineMM, capTop: baselineMM - opts.cap, stem: kit.stem(opts.font, opts.cap) };
}

// ---------- variant configs ----------
const CONFIG = {
  G1: { mark: {}, lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gapU: 3, align: 'centre' } },
  G2: { mark: {}, lock: { markH: 19, cap: 6.2, font: 'xbold', track: 0.16, gapU: 2, align: 'centre' } },
  G3: { mark: {}, lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gapU: 3, align: 'centre' } },
  G4: { mark: {}, lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gapU: 3, align: 'centre' } },
};

async function buildVariant(id) {
  const dirV = path.join(ROOT, id);
  fs.mkdirSync(dirV, { recursive: true });
  const cfg = CONFIG[id];
  const mk = MARKS[id](cfg.mark);
  const sc = SCHEME[id];
  const info = writeMark(path.join(dirV, 'mark.svg'), mk, 25, sc.light);
  writeMark(path.join(dirV, 'mark-dark.svg'), mk, 25, sc.dark);
  const lk = writeLockup(path.join(dirV, 'lockup.svg'), mk, sc.lockup, cfg.lock);
  await kit.render(path.join(dirV, 'mark.svg'), path.join(dirV, 'mark.png'), { bg: F.bone });
  await kit.render(path.join(dirV, 'mark-dark.svg'), path.join(dirV, 'mark-dark.png'), { bg: F.slate });
  await kit.render(path.join(dirV, 'lockup.svg'), path.join(dirV, 'lockup.png'), { bg: F.bone });
  await kit.sizes(path.join(dirV, 'mark.svg'), path.join(dirV, 'sizes.png'), { bg: F.bone });
  return { id, mk, unitMM25: info.k, lockup: lk };
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

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['G1', 'G2', 'G3', 'G4'];
  const out = [];
  for (const id of ids) out.push(await buildVariant(id));
  await kit.close();
  for (const r of out) console.log(r.id, 'unit at 25mm =', r.unitMM25.toFixed(3), 'mm', 'lockup', JSON.stringify(r.lockup, (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)));
  if (ids.length === 4) sheet(ids);
})();

module.exports = { MARKS, capBar };
