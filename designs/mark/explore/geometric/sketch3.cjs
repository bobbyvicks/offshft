// Round 3 sketches: tick/check gestures, square fields, outline treatments.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r3';
fs.mkdirSync(OUT, { recursive: true });
const P = [0, 0];
const sketches = [];
function mk(name, { polys = [], holes = [], holePolys = [], field = null, fill = kit.T.ink, islands = [] }) {
  let loops, d;
  if (field) {
    const ko = union(polys);
    loops = [...field, ...ko];
    d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('') + islands.map(polyD).join('');
  } else {
    loops = union(polys);
    d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('') + holePolys.map(polyD).join('');
  }
  const bb = bbox(field ? field : loops);
  const pad = 0.5;
  const body = `<g transform="translate(${-bb.x0 + pad} ${-bb.y0 + pad})"><path fill="${fill}" fill-rule="evenodd" d="${d}"/></g>`;
  const file = `${OUT}/${name}.svg`;
  kit.writeSvg(file, { w: bb.w + 2 * pad, h: bb.h + 2 * pad, body });
  sketches.push({ name, file });
}
function capBar(P, deg, Lb, w, n = 48, tipCut = null) {
  const d = dir(deg), nn = lnorm(d);
  const pts = [add(P, add(mul(d, Lb), mul(nn, w / 2))), add(P, add(mul(d, Lb), mul(nn, -w / 2)))];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 2 - (i / n) * Math.PI;
    pts.push(add(P, mul(add(mul(d, Math.cos(t)), mul(nn, Math.sin(t))), w / 2)));
  }
  return pts;
}
const MT = (l) => add(P, mul(dir(0), l));
const HT = (l) => add(P, mul(dir(150), l));

// ---- ticks
mk('T1-tick-mitre', { polys: [stroke([MT(15), P, HT(8.5)], 4.2)] });
mk('T2-heavy-hour', { polys: [stroke([MT(15.5), P, HT(8.5)], 0, { wList: [2.8, 5.2] })] });
{
  // tapered minute: build as polygon manually: minute from width 4.6 at pivot to 1.8 at tip; hour 4.6 constant
  const wb = 4.6, wt = 1.9, Lm = 16, Lh = 8.5;
  const m = [[-wb / 2, 0], [-wt / 2, -Lm], [wt / 2, -Lm], [wb / 2, 0]];
  const h = bar(P, 150, { len: Lh, w: wb });
  mk('T3-taper-minute', { polys: [stroke([MT(0.01), P, HT(Lh)], wb), m, h] });
}
{
  // hour hand with tail up-left (crossing) + minute, union
  mk('T4-hour-tail', { polys: [bar(P, 0, { len: 15, w: 3.4 }), bar(P, 150, { len: 8.5, tail: 5, w: 3.6 })] });
}
{
  // heel spur: extend minute's left edge and hour's lower edge to a sharp point
  const w = 4.2;
  const s = stroke([MT(15), P, HT(8.5)], w);
  mk('T5-tick-pin', { polys: [s], holes: [[P, 0.8]] });
}
{
  // both terminals cut parallel to each other (perpendicular to angle bisector at 75deg)
  mk('T6-tick-parallel-cuts', { polys: [stroke([MT(15), P, HT(8.5)], 4.2, { startCut: 75 + 90, endCut: 75 + 90 })] });
}

// ---- square fields
{
  const S = 20, w = 2.8, c = [S / 2, S / 2];
  const m = bar(c, 0, { len: S / 2 - 2.8, w });
  const h = bar(c, 150, { len: 6.3, w: w * 1.08 });
  mk('F1-field-hub', { field: [rectPoly(0, 0, S, S)], polys: [m, h, circlePoly(c, w * 0.78)] });
}
{
  // layered knockout: hour hand (round end) over minute, separated by a positive line
  const S = 20, w = 2.8, g = 1.25, c = [S / 2, S / 2];
  const h = capBar(c, 150, 6.6, w * 1.1);
  const hg = capBar(c, 150, 6.6 + g, w * 1.1 + 2 * g);
  const m = bar(c, 0, { len: S / 2 - 2.8, w });
  mk('F2-field-layered', { field: [rectPoly(0, 0, S, S)], polys: [h, ...diffConvex(m, hg)], islands: [] });
}
{
  // diamond field
  const R = 13, w = 2.8, c = [R, R];
  const diamond = [[R, 0], [2 * R, R], [R, 2 * R], [0, R]];
  const m = bar(c, 0, { len: R - 4.2, w });
  const h = bar(c, 150, { len: 6.0, w: w * 1.08 });
  mk('F4-diamond-field', { field: [diamond], polys: [m, h, circlePoly(c, w * 0.75)] });
}
{
  // minute knockout opens the top edge
  const S = 20, w = 2.8, c = [S / 2, S / 2 + 1.5];
  const m = bar(c, 0, { len: S / 2 + 3, w });
  const h = bar(c, 150, { len: 6.0, w: w * 1.08 });
  const loops = L.difference([rectPoly(0, 0, S, S)], [m, h, circlePoly(c, w * 0.75)]);
  mk('F5-field-slot', { field: loops, polys: [] });
}

// ---- outlines
{
  // outline of layered hands (hour on top with round end), line t
  const t = 1.3, w = 4.4, g = 1.3, Lm = 15.5, Lh = 9.5;
  const hO = capBar(P, 150, Lh, w * 1.05), hI = capBar(P, 150, Lh - t, w * 1.05 - 2 * t);
  const hg = capBar(P, 150, Lh + g, w * 1.05 + 2 * g);
  const mO = bar(P, 0, { len: Lm, w }), mI = bar(P, 0, { len: Lm - t, w: w - 2 * t });
  // minute outline part = (mO - hg) minus (mI) : build polygon pieces then subtract inner via evenodd
  const mOut = union(diffConvex(mO, hg));
  const mIn = union(diffConvex(mI, grow(hg, t)));
  const loops = [...union([hO]), hI, ...mOut, ...mIn];
  const d = loops.map(polyD).join('') + circleD(P, 0.7);
  const bb = bbox(loops), pad = 0.5;
  const file = `${OUT}/O1-outline-layered.svg`;
  kit.writeSvg(file, { w: bb.w + 1, h: bb.h + 1, body: `<g transform="translate(${-bb.x0 + pad} ${-bb.y0 + pad})"><path fill="${kit.T.ink}" fill-rule="evenodd" d="${d}"/></g>` });
  sketches.push({ name: 'O1', file });
}
{
  // outline of the union of minute bar and hour capsule, with a pin dot island
  const t = 1.3, w = 4.4, Lm = 15.5, Lh = 9.5;
  const outer = union([bar(P, 0, { len: Lm, w }), capBar(P, 150, Lh, w * 1.05)]);
  const inner = union([bar(P, 0, { len: Lm - t, w: w - 2 * t }), capBar(P, 150, Lh - t, w * 1.05 - 2 * t)]);
  mk('O2-outline-capsule', { polys: [bar(P, 0, { len: Lm, w }), capBar(P, 150, Lh, w * 1.05)], holePolys: inner });
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
})();
