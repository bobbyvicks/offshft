// Round 8: outline/line candidates for G4, with size strips.
const L = require('./lib.cjs');
const { kit, bar, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r8';
fs.mkdirSync(OUT, { recursive: true });
const P = [0, 0];
const sketches = [];
function mkLoops(name, loops, { fill = kit.T.ink } = {}) {
  const d = loops.map(polyD).join('');
  const bb = bbox(loops);
  const pad = 0.3;
  const body = `<g transform="translate(${-bb.x0 + pad} ${-bb.y0 + pad})"><path fill="${fill}" fill-rule="evenodd" d="${d}"/></g>`;
  const file = `${OUT}/${name}.svg`;
  kit.writeSvg(file, { w: bb.w + 2 * pad, h: bb.h + 2 * pad, body });
  sketches.push({ name, file });
}
function capBar(P, deg, Lb, w, n = 64) {
  const d = dir(deg), nn = lnorm(d);
  const pts = [add(P, add(mul(d, Lb), mul(nn, w / 2))), add(P, add(mul(d, Lb), mul(nn, -w / 2)))];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 - (i / n) * Math.PI;
    pts.push(add(P, mul(add(mul(d, Math.cos(t)), mul(nn, Math.sin(t))), w / 2)));
  }
  return pts;
}
const Lm = 15.5, Lh = 9.5, t = 1.4;

// a: two loops, gap
{
  const wm = 4.4, wh = 5.0, g = 1.3;
  const hO = capBar(P, 150, Lh, wh), hI = capBar(P, 150, Lh - t, wh - 2 * t);
  const mO = bar(P, 0, { len: Lm, w: wm }), mI = bar(P, 0, { len: Lm - t, w: wm - 2 * t });
  const mRing = difference([mO], [mI, capBar(P, 150, Lh + g, wh + 2 * g)]);
  mkLoops('Ga-two-loops', [hO, hI, ...mRing]);
}
// b: minute outline ends on hour outline (connected line drawing)
{
  const wm = 4.4, wh = 5.0;
  const hO = capBar(P, 150, Lh, wh), hI = capBar(P, 150, Lh - t, wh - 2 * t);
  const mO = bar(P, 0, { len: Lm, w: wm }), mI = bar(P, 0, { len: Lm - t, w: wm - 2 * t });
  const mRing = difference([mO], [mI, hO]);
  mkLoops('Gb-joined-lines', difference([hO, ...mRing], [hI]));
}
// c: union contour with big knuckle + pin dot
{
  const wm = 4.2, R = 3.4;
  const outer = union([bar(P, 0, { len: Lm, w: wm }), bar(P, 150, { len: Lh, w: wm * 1.05 }), circlePoly(P, R, 128)]);
  const inner = union([bar(P, 0, { len: Lm - t, w: wm - 2 * t }), bar(P, 150, { len: Lh - t, w: wm * 1.05 - 2 * t }), circlePoly(P, R - t, 128)]);
  mkLoops('Gc-knuckle-contour', [...difference(outer, inner), circlePoly(P, 0.75, 64)]);
}
// d: monoline hands attached to ring hub
{
  const w = 1.6, R = 2.6;
  const ringO = circlePoly(P, R, 128), ringI = circlePoly(P, R - w, 128);
  const m = bar(add(P, mul(dir(0), R - w / 2)), 0, { len: Lm - R + w / 2, w });
  const h = bar(add(P, mul(dir(150), R - w / 2)), 150, { len: Lh - R + w / 2, w: w * 1.06 });
  mkLoops('Gd-mono-ring', difference([ringO, m, h], [ringI]));
}
// e: bold hands attached to ring hub (the O)
{
  const w = 3.0, R = 3.4, r = 1.7;
  mkLoops('Ge-bold-ring', difference([bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.06 }), circlePoly(P, R, 128)], [circlePoly(P, r, 96)]));
}
// f: two loops, hour outline over minute with no gap but minute legs stop at hour outer edge, pin ring
{
  const wm = 4.6, wh = 5.4;
  const hO = capBar(P, 150, Lh, wh), hI = capBar(P, 150, Lh - t, wh - 2 * t);
  const mO = bar(P, 0, { len: Lm, w: wm }), mI = bar(P, 0, { len: Lm - t, w: wm - 2 * t });
  const mRing = difference([mO], [mI, hO]);
  const solid = difference([hO, ...mRing], [hI]);
  mkLoops('Gf-joined-pin', [...solid, circlePoly(P, 0.75, 64)]);
}

(async () => {
  for (const s of sketches) {
    await kit.sizes(s.file, s.file.replace('.svg', '-sizes.png'), { bg: kit.F.bone });
  }
  await kit.close();
})();
