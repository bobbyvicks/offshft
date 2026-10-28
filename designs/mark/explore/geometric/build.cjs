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
  // G1 Rivet: the hour hand is laid over the minute hand on a square rivet; a 1.05u gap shows the layering.
  // Grid (u): minute 3 x 14; hour 3.6 wide, 6 long, round end r 1.8; gap 1.05; rivet side 1.05 (half-diagonal 0.74).
  G1(p = {}) {
    const o = { wm: 3, wh: 3.6, Lm: 14, Lh: 6, g: 1.05, rivet: 0.74, ...p };
    const hour = capBar(P, HR, o.Lh, o.wh);
    const hourGap = capBar(P, HR, o.Lh + o.g, o.wh + 2 * o.g);
    const minute = difference([bar(P, MIN, { len: o.Lm, w: o.wm })], [hourGap]);
    const loops = [...minute, ...union([hour]), diamond(P, o.rivet)];
    return { layers: [{ loops, role: 'main' }], o };
  },
  // G2 Checked: a square field; hands and hub are knocked out, the pin stays as thread.
  // Grid (u): field 16; minute 2.2 wide reaching 1.6 from the top edge; hour 2.6 wide, 5.4 long; hub r 2; pin r 0.85.
  G2(p = {}) {
    const o = { S: 16, wm: 2.2, wh: 2.6, top: 1.6, Lh: 5.4, hub: 2, pin: 0.85, ...p };
    const half = o.S / 2;
    const m = bar(P, MIN, { len: half - o.top, w: o.wm });
    const h = bar(P, HR, { len: o.Lh, w: o.wh });
    const loops = difference([rectPoly(-half, -half, o.S, o.S)], [m, h, circ(P, o.hub)]);
    loops.push(circ(P, o.pin, 120));
    return { layers: [{ loops, role: 'main' }], o };
  },
  // G3 Nut: a hex nut holds both hands; a 1u gap follows the nut, so the minute hand ends in a 120 deg notch
  // and the hour hand in a square cut parallel to a flat of the nut.
  // Grid (u): minute 2.2 x 12; hour 2.6 x 7.4; nut circumradius 2.3 (flat-to-flat 4); bore r 0.85; gap 1.
  G3(p = {}) {
    const o = { wm: 2.2, wh: 2.6, Lm: 12, Lh: 7.4, Rh: 2.3, g: 1, bore: 0.85, ...p };
    const nut = hexPoly(P, o.Rh);
    const nutGap = L.grow(nut, o.g);
    const m = difference([bar(P, MIN, { len: o.Lm, w: o.wm })], [nutGap]);
    const h = difference([bar(P, HR, { len: o.Lh, w: o.wh })], [nutGap]);
    return { layers: [{ loops: [...m, ...h], role: 'main' }, { loops: [nut, circ(P, o.bore, 120)], role: 'accent' }], o };
  },
  // G4 Skeleton: one continuous band of constant weight draws both hands and the hub; the pin floats in the middle.
  // Grid (u): hands 3.3 wide (hour x1.06), band 1; hub r 2.6; pin r 0.6.
  G4(p = {}) {
    const o = { w: 3.3, hk: 1.06, t: 1, R: 2.6, pin: 0.6, Lm: 12, Lh: 7.2, ...p };
    const wh = o.w * o.hk;
    const outer = union([bar(P, MIN, { len: o.Lm, w: o.w }), bar(P, HR, { len: o.Lh, w: wh }), circ(P, o.R)]);
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
  G3: { light: { main: T.ink, accent: T.ink }, dark: { main: T.bone, accent: T.bone }, lockup: { main: T.ink, accent: T.rust, word: T.ink } },
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

// Lockup. opts: markH (mm), cap (mm), font, track, gap (mm, or 'word'), baseU (baseline y in mark units)
function writeLockup(file, mk, colours, opts) {
  const bb = markBBox(mk);
  const k = opts.markH / bb.h; // mm per unit
  const margin = 1;
  const capU = opts.cap / k;
  const baseU = typeof opts.baseU === 'function' ? opts.baseU(bb, capU, mk) : opts.baseU;
  const gapMM = opts.gap === 'word' ? wordGap(opts.font, opts.cap, opts.track) : opts.gap;
  const top = Math.min(bb.y0, baseU - capU), bottom = Math.max(bb.y1, baseU);
  const markDx = margin - bb.x0 * k, markDy = margin - top * k;
  const baselineMM = margin + (baseU - top) * k;
  const probe = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, x: 0, y: 0 });
  const wx = margin + bb.w * k + gapMM - probe.letters[0].x1;
  const word = kit.text('OFF SHFT', { font: opts.font, cap: opts.cap, track: opts.track, fill: colours.word, x: wx, y: baselineMM });
  const W = word.letters[word.letters.length - 1].x2 + margin, H = (bottom - top) * k + 2 * margin;
  kit.writeSvg(file, { w: W, h: H, body: markBody(mk, k, markDx, markDy, colours) + '\n' + word.svg });
  return { k, W, H, gapMM, stem: kit.stem(opts.font, opts.cap) };
}

// ---------- variant configs ----------
// baseU helpers
const centre = (bb, capU) => (bb.y0 + bb.y1) / 2 + capU / 2;
const CONFIG = {
  G1: { lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gap: 'word', baseU: centre } },
  G2: { lock: { markH: 19, cap: 6.2, font: 'xbold', track: 0.16, gap: 'word', baseU: centre } },
  G3: { lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gap: 'word', baseU: centre } },
  G4: { lock: { markH: 22, cap: 6.2, font: 'xbold', track: 0.16, gap: 'word', baseU: centre } },
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

module.exports = { MARKS, SCHEME, CONFIG, capBar, circ, diamond, writeMark, writeLockup, wordGap, markBBox };

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
