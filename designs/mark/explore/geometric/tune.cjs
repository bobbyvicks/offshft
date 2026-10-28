// Tuning harness: render several parameter sets of one construction as size strips, then a sheet.
// usage: node tune.cjs <name>   (see SETS below)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { kit, bar, union, difference, polyD, rectPoly, dir, add, mul, bbox, circlePoly, lnorm, inter } = L;
const P = [0, 0];
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
const diamond = (c, k) => [[c[0], c[1] - k], [c[0] + k, c[1]], [c[0], c[1] + k], [c[0] - k, c[1]]];
// hour bar with a horizontal tip cut instead of square
function hourHcut(Lb, w, tail = 0) {
  const d = dir(150), n = lnorm(d);
  const e = add(P, mul(d, Lb));
  const Lp = add(P, mul(n, w / 2)), Rp = add(P, mul(n, -w / 2));
  const s = add(P, mul(d, -tail));
  return [inter(Lp, d, s, n), inter(Lp, d, e, [1, 0]), inter(Rp, d, e, [1, 0]), inter(Rp, d, s, n)];
}

const G1 = (o) => {
  const hour = capBar(P, 150, o.Lh, o.wh);
  const hourGap = capBar(P, 150, o.Lh + o.g, o.wh + 2 * o.g);
  const minute = difference([bar(P, 0, { len: o.Lm, w: o.wm })], [hourGap]);
  const pin = o.pinShape === 'diamond' ? [diamond(P, o.pin)] : o.pin ? [circ(P, o.pin, 96)] : [];
  return [...minute, ...union([hour]), ...pin];
};
const G3 = (o) => {
  const ring = circ(P, o.rc + o.g);
  const m = difference([bar(P, 0, { len: o.Lm, w: o.wm })], [ring]);
  const hb = o.hcut ? hourHcut(o.Lh, o.wh) : bar(P, 150, { len: o.Lh, w: o.wh });
  const h = difference([hb], [ring]);
  return [...m, ...h, circ(P, o.rc)];
};
const G1m = (o) => {
  // minute on top
  const minute = capBar(P, 0, o.Lm, o.wm);
  const mGap = capBar(P, 0, o.Lm + o.g, o.wm + 2 * o.g);
  const hour = difference([bar(P, 150, { len: o.Lh, w: o.wh })], [mGap]);
  const pin = o.pinShape === 'diamond' ? [diamond(P, o.pin)] : o.pin ? [circ(P, o.pin, 96)] : [];
  return [...union([minute]), ...hour, ...pin];
};

// ----- G2 square field options (S = side, pivot at centre)
const sq = (S) => rectPoly(-S / 2, -S / 2, S, S);
const G2sep = (o) => {
  // separated knockouts radiating from a solid centre
  const m = bar(add(P, mul(dir(0), o.r0)), 0, { len: o.S / 2 - o.top - o.r0, w: o.wm });
  const h = bar(add(P, mul(dir(150), o.r0)), 150, { len: o.Lh - o.r0, w: o.wh });
  return difference([sq(o.S)], [m, h]);
};
const G2layer = (o) => {
  const hour = capBar(P, 150, o.Lh, o.wh);
  const hourGap = capBar(P, 150, o.Lh + o.g, o.wh + 2 * o.g);
  const minute = difference([bar(P, 0, { len: o.S / 2 - o.top, w: o.wm })], [hourGap]);
  const ko = [...minute, ...union([hour])];
  const loops = difference([sq(o.S)], ko);
  if (o.rivet) loops.push(diamond(P, o.rivet));
  return loops;
};
const G2cap = (o) => {
  const ring = circ(P, o.rc + o.g);
  const m = difference([bar(P, 0, { len: o.S / 2 - o.top, w: o.wm })], [ring]);
  const h = difference([bar(P, 150, { len: o.Lh, w: o.wh })], [ring]);
  const loops = difference([sq(o.S)], [...m, ...h]);
  return loops;
};
const G2mitreDot = (o) => {
  const mt = add(P, mul(dir(0), o.S / 2 - o.top)), ht = add(P, mul(dir(150), o.Lh));
  const loops = difference([sq(o.S)], [L.stroke([mt, P, ht], o.wm), circ(P, o.hub)]);
  loops.push(circ(P, o.dot, 96));
  return loops;
};

// ----- G4 outline options
const G4two = (o) => {
  const hO = capBar(P, 150, o.Lh, o.wh), hI = capBar(P, 150, o.Lh - o.t, o.wh - 2 * o.t);
  const hG = capBar(P, 150, o.Lh + o.g, o.wh + 2 * o.g);
  const mO = bar(P, 0, { len: o.Lm, w: o.wm }), mI = bar(P, 0, { len: o.Lm - o.t, w: o.wm - 2 * o.t });
  const mRing = difference([mO], [mI, hG]);
  return [...difference([hO], [hI]), ...mRing];
};
const G4hairpin = (o) => {
  // minute hand drawn as an open hairpin whose legs stop at the gap; hour hand closed capsule outline
  const hO = capBar(P, 150, o.Lh, o.wh), hI = capBar(P, 150, o.Lh - o.t, o.wh - 2 * o.t);
  const hG = capBar(P, 150, o.Lh + o.g, o.wh + 2 * o.g);
  const mO = bar(P, 0, { len: o.Lm, w: o.wm, tail: 3 }), mI = bar(P, 0, { len: o.Lm - o.t, w: o.wm - 2 * o.t, tail: 4 });
  const mRing = difference([mO], [mI, hG]);
  return [...difference([hO], [hI]), ...mRing];
};

const G4skel = (o) => {
  const outer = union([bar(P, 0, { len: o.Lm, w: o.w }), bar(P, 150, { len: o.Lh, w: o.w * (o.hk || 1) }), circ(P, o.R)]);
  const inner = union([bar(P, 0, { len: o.Lm - o.t, w: o.w - 2 * o.t }), bar(P, 150, { len: o.Lh - o.t, w: o.w * (o.hk || 1) - 2 * o.t }), circ(P, o.R - o.t)]);
  const loops = difference(outer, inner);
  if (o.dot) loops.push(circ(P, o.dot, 96));
  return loops;
};

const SETS = {
  g4s: [
    ['a-skel-dot', G4skel, { w: 2.8, R: 2.3, t: 0.85, Lm: 10, Lh: 6.3, dot: 0.6, fill: kit.T.rust }],
    ['b-skel-nodot', G4skel, { w: 2.8, R: 1.9, t: 0.85, Lm: 10, Lh: 6.3, dot: 0, fill: kit.T.rust }],
    ['c-skel-dot-wide', G4skel, { w: 3.0, R: 2.4, t: 0.85, Lm: 10, Lh: 6.4, dot: 0.6, hk: 1.06, fill: kit.T.rust }],
    ['d-skel-flush', G4skel, { w: 3.0, R: 1.5, t: 0.85, Lm: 10, Lh: 6.4, dot: 0, hk: 1.06, fill: kit.T.rust }],
  ],
  g2: [
    ['a-sep', G2sep, { S: 16, wm: 2.2, wh: 2.6, top: 2.2, Lh: 5.0, r0: 1.4, fill: kit.T.rust }],
    ['b-layer', G2layer, { S: 16, wm: 2.0, wh: 2.4, top: 2.2, Lh: 5.0, g: 0.85, fill: kit.T.rust }],
    ['c-layer-rivet', G2layer, { S: 16, wm: 2.0, wh: 2.6, top: 2.2, Lh: 5.0, g: 0.85, rivet: 0.62, fill: kit.T.rust }],
    ['d-cap', G2cap, { S: 16, wm: 2.1, wh: 2.4, top: 2.2, Lh: 5.4, rc: 1.3, g: 0.85, fill: kit.T.rust }],
    ['e-mitre-dot', G2mitreDot, { S: 16, wm: 2.2, top: 2.2, Lh: 5.0, hub: 1.9, dot: 0.8, fill: kit.T.rust }],
    ['f-sep-close', G2sep, { S: 16, wm: 2.2, wh: 2.6, top: 2.0, Lh: 5.2, r0: 0.9, fill: kit.T.rust }],
  ],
  g4: [
    ['a-two', G4two, { t: 0.8, wm: 2.8, wh: 3.2, Lm: 10, Lh: 6.2, g: 0.8, fill: kit.T.rust }],
    ['b-hairpin', G4hairpin, { t: 0.8, wm: 2.8, wh: 3.2, Lm: 10, Lh: 6.2, g: 0.8, fill: kit.T.rust }],
    ['c-two-wide', G4two, { t: 0.8, wm: 3.0, wh: 3.6, Lm: 10, Lh: 6.4, g: 0.8, fill: kit.T.rust }],
  ],
  g3: [
    ['a-cap', (o) => G3(o), { wm: 2.1, wh: 2.5, Lm: 10, Lh: 6.4, rc: 1.6, g: 0.8 }],
    ['b-cap-small', (o) => G3(o), { wm: 2.1, wh: 2.5, Lm: 10, Lh: 6.4, rc: 1.25, g: 0.8 }],
    ['c-cap-big', (o) => G3(o), { wm: 2.1, wh: 2.5, Lm: 10, Lh: 6.6, rc: 1.9, g: 0.8 }],
    ['d-cap-hcut', (o) => G3(o), { wm: 2.1, wh: 2.5, Lm: 10, Lh: 6.6, rc: 1.6, g: 0.8, hcut: true }],
  ],
  g1: [
    ['a-hourtop-slim', G1, { wm: 2.0, wh: 2.4, Lm: 10, Lh: 6, g: 0.8, pin: 0.5 }],
    ['b-hourtop-diamond', G1, { wm: 2.0, wh: 2.4, Lm: 10, Lh: 6, g: 0.8, pin: 0.62, pinShape: 'diamond' }],
    ['c-minutetop', G1m, { wm: 2.2, wh: 2.5, Lm: 10, Lh: 6, g: 0.8, pin: 0.5 }],
    ['d-hourtop-nopin', G1, { wm: 2.0, wh: 2.4, Lm: 10, Lh: 6, g: 0.8, pin: 0 }],
    ['e-hourtop-wide', G1, { wm: 2.0, wh: 2.8, Lm: 10, Lh: 6.3, g: 0.8, pin: 0.62, pinShape: 'diamond' }],
    ['f-minutetop-diamond', G1m, { wm: 2.3, wh: 2.5, Lm: 10, Lh: 6.2, g: 0.8, pin: 0.62, pinShape: 'diamond' }],
  ],
};

(async () => {
  const name = process.argv[2] || 'g1';
  const OUT = path.join(__dirname, 'sketch', 'tune-' + name);
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const files = [];
  for (const [id, fn, o] of SETS[name]) {
    const loops = fn(o);
    const bb = bbox(loops);
    const k = 25 / Math.max(bb.w, bb.h), m = 0.4;
    const d = loops.map((p) => polyD(p.map(([x, y]) => [(x - bb.x0) * k + m, (y - bb.y0) * k + m]))).join('');
    const file = path.join(OUT, id + '.svg');
    kit.writeSvg(file, { w: bb.w * k + 2 * m, h: bb.h * k + 2 * m, body: `<path fill="${o.fill || kit.T.ink}" fill-rule="evenodd" d="${d}"/>` });
    const png = file.replace('.svg', '.png');
    await kit.sizes(file, png, { bg: kit.F.bone });
    files.push(png);
    console.log(id, 'u(mm@25)=', k.toFixed(3));
  }
  await kit.close();
  execFileSync('montage', ['-label', '%t', ...files, '-tile', '3x', '-geometry', '520x+4+4', '-pointsize', '16', '-background', '#888', path.join(OUT, '_sheet.png')]);
})();

module.exports = { capBar, circ, diamond, hourHcut, G1, G1m };
