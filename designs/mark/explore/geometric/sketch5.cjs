// Round 5 sketches: more pivot articulations + checkbox field options.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r5';
fs.mkdirSync(OUT, { recursive: true });
const P = [0, 0];
const sketches = [];
function mkLoops(name, loops, { holes = [], fill = kit.T.ink } = {}) {
  const d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('');
  const bb = bbox(loops);
  const pad = 0.5;
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
const Lm = 15.5, Lh = 9.5;

// B1 separated hands
{
  const w = 3.4, r0 = 2.2;
  const m = bar(add(P, mul(dir(0), r0)), 0, { len: Lm - r0, w });
  const h = bar(add(P, mul(dir(150), r0)), 150, { len: Lh - r0, w: w * 1.06 });
  mkLoops('B1-separated', union([m, h]));
}
// B2 separated + hub dot
{
  const w = 3.4, rh = 1.5, g = 1.3;
  const ring = circlePoly(P, rh + g, 96);
  const m = bar(P, 0, { len: Lm, w });
  const h = bar(P, 150, { len: Lh, w: w * 1.06 });
  mkLoops('B2-hub-small', union([circlePoly(P, rh, 96), ...diffConvex(m, ring), ...diffConvex(h, ring)]));
}
// B3 minute tail branch
{
  const w = 3.4;
  mkLoops('B3-tail-branch', union([bar(P, 0, { len: Lm, tail: 3.4, w }), bar(P, 150, { len: Lh, w: w * 1.06 })]), { holes: [[P, 0.75]] });
}
// B4 figure-ground square at pivot
{
  const w = 3.0, s = 9.0;
  const sq = rectPoly(-s / 2, -s / 2, s, s);
  const m = bar(P, 0, { len: Lm, w });
  const h = bar(P, 150, { len: Lh, w: w * 1.06 });
  // positive: (square minus hands) union (hands minus square)
  const sqMinus = difference([sq], [m, h]);
  const handsOut = difference([m, h], [sq]);
  mkLoops('B4-figure-ground', [...sqMinus, ...handsOut]);
}
// B5 diamond rivet in layered hour-top
{
  const wm = 3.3, wh = 3.9, g = 1.3;
  const hh = capBar(P, 150, Lh, wh);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const m = bar(P, 0, { len: Lm, w: wm });
  const k = 0.95;
  const hole = [[0, -k], [k, 0], [0, k], [-k, 0]].map((p) => p);
  mkLoops('B5-layered-square-rivet', [...union([hh, ...diffConvex(m, hG)]), hole]);
}
// B6 checkbox fields
{
  const S = 18, c = [S / 2, S / 2];
  const w = 2.9;
  const mt = add(c, mul(dir(0), S / 2 - 2.9)), ht = add(c, mul(dir(150), 5.6));
  mkLoops('B6a-box-mitre', difference([rectPoly(0, 0, S, S)], [stroke([mt, c, ht], w)]));
  const m = bar(c, 0, { len: S / 2 - 2.9, w, tail: w / 2 });
  const h = bar(c, 150, { len: 5.8, w: w * 1.06 });
  mkLoops('B6b-box-bars', difference([rectPoly(0, 0, S, S)], [m, h]));
  // pivot below centre, longer minute
  const c2 = [S / 2, S * 0.56];
  const m2 = bar(c2, 0, { len: c2[1] - 2.9, w });
  const h2 = bar(c2, 150, { len: 5.2, w: w * 1.06 });
  mkLoops('B6c-box-low-pivot', difference([rectPoly(0, 0, S, S)], [m2, h2, circlePoly(c2, w * 0.72, 96)]));
}
// B7 outline single contour of layered silhouette + pin
{
  const t = 1.35, wm = 4.2, wh = 4.6;
  const outer = union([bar(P, 0, { len: Lm, w: wm }), capBar(P, 150, Lh, wh)]);
  const inner = union([bar(P, 0, { len: Lm - t, w: wm - 2 * t }), capBar(P, 150, Lh - t, wh - 2 * t)]);
  mkLoops('B7-outline-contour', [...outer, ...inner, circlePoly(P, 0.7, 48)]);
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
})();
