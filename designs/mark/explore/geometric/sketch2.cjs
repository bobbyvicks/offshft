// Round 2 sketches: ways to articulate the pivot so the hands stop reading as a bent stick.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, polyD, circleD, rectPoly, dir, add, mul, bbox, diffConvex, grow, circlePoly } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r2';
fs.mkdirSync(OUT, { recursive: true });
const P = [0, 0];
const sketches = [];
function mk(name, { polys = [], holes = [], holePolys = [], fill = kit.T.ink }) {
  const loops = union(polys);
  const d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('') + holePolys.map(polyD).join('');
  const bb = bbox(loops);
  const pad = 0.5;
  const body = `<g transform="translate(${-bb.x0 + pad} ${-bb.y0 + pad})"><path fill="${fill}" fill-rule="evenodd" d="${d}"/></g>`;
  const file = `${OUT}/${name}.svg`;
  kit.writeSvg(file, { w: bb.w + 2 * pad, h: bb.h + 2 * pad, body });
  sketches.push({ name, file });
}
// capsule-ended bar: from P (round end centred on P, radius w/2) to len, square tip
function capBar(P, deg, Lb, w, n = 48) {
  const d = dir(deg), nn = L.lnorm(d);
  const tipL = add(P, add(mul(d, Lb), mul(nn, w / 2)));
  const tipR = add(P, add(mul(d, Lb), mul(nn, -w / 2)));
  const pts = [tipL, tipR];
  // semicircle from right side around the back to the left side
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 - (i / n) * Math.PI; // relative angle
    const v = add(mul(d, Math.cos(-Math.PI / 2 - (i / n) * Math.PI)), mul(nn, Math.sin(-Math.PI / 2 - (i / n) * Math.PI)));
    pts.push(add(P, mul(v, w / 2)));
  }
  return pts;
}
const wm = 3.4, wh = 3.8, Lm = 15.5, Lh = 9.5, g = 1.3, pr = 0.75;

// a: stacked, squared minute end with tail, gap to hour
{
  const m = bar(P, 0, { len: Lm, tail: wm / 2, w: wm });
  const h = bar(P, 150, { len: Lh, w: wh });
  mk('R2a-stacked-square', { polys: [m, ...diffConvex(h, grow(m, g))], holes: [[P, pr]] });
}
// b: stacked, round minute end
{
  const m = capBar(P, 0, Lm, wm);
  const mg = capBar(P, 0, Lm + g, wm + 2 * g);
  const h = bar(P, 150, { len: Lh, w: wh });
  mk('R2b-stacked-round', { polys: [m, ...diffConvex(h, mg)], holes: [[P, pr]] });
}
// c: hour on top, round end
{
  const h = capBar(P, 150, Lh, wh);
  const hg = capBar(P, 150, Lh + g, wh + 2 * g);
  const m = bar(P, 0, { len: Lm, w: wm });
  mk('R2c-hour-on-top', { polys: [h, ...diffConvex(m, hg)], holes: [[P, pr]] });
}
// d: hub disc + gap ring + hands
{
  const rh = 2.6;
  const ring = circlePoly(P, rh + g, 96);
  const m = bar(P, 0, { len: Lm, w: wm });
  const h = bar(P, 150, { len: Lh, w: wh });
  mk('R2d-hub-ring', { polys: [circlePoly(P, rh, 96), ...diffConvex(m, ring), ...diffConvex(h, ring)] });
}
// e: crossing, hour has a tail, minute on top
{
  const m = bar(P, 0, { len: Lm, tail: 2.6, w: wm });
  const h = bar(P, 150, { len: Lh, tail: 4.2, w: wh });
  mk('R2e-crossing', { polys: [m, ...diffConvex(h, grow(m, g))], holes: [[P, pr]] });
}
// f: tapered sword hands
{
  const trap = (deg, Lb, wb, wt, tail) => {
    const d = dir(deg), n = L.lnorm(d);
    const s = add(P, mul(d, -tail)), e = add(P, mul(d, Lb));
    return [add(s, mul(n, wb / 2)), add(e, mul(n, wt / 2)), add(e, mul(n, -wt / 2)), add(s, mul(n, -wb / 2))];
  };
  mk('R2f-tapered', { polys: [trap(0, Lm, 4.4, 2.2, 1.6), trap(150, Lh, 5.0, 2.8, 1.6)], holes: [[P, pr]] });
}
// h: square frame, minute hand breaks out of the top (checkbox wink)
{
  const S = 18, t = 1.7;
  const c = [S / 2, S / 2 + 1.0];
  const frame = [rectPoly(0, 0, S, t), rectPoly(0, S - t, S, t), rectPoly(0, 0, t, S), rectPoly(S - t, 0, t, S)];
  const m = bar(c, 0, { len: S / 2 + 6, w: 2.8 });
  const h = bar(c, 150, { len: 5.6, w: 3.0 });
  // gap where the minute hand crosses the frame
  const mg = grow(m, 1.3);
  const pieces = [];
  frame.forEach((f) => pieces.push(...diffConvex(f, mg)));
  mk('R2h-box-breakout', { polys: [...pieces, m, h], holes: [[c, 0.7]] });
}
// i: outline with hub eye
{
  const R = 3.3, t = 1.3, w = 4.0;
  const outer = [bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.05 }), circlePoly(P, R, 96)];
  const inner = [bar(P, 0, { len: Lm - t, w: w - 2 * t }), bar(P, 150, { len: Lh - t, w: w * 1.05 - 2 * t }), circlePoly(P, R - t, 96)];
  mk('R2i-outline-eye', { polys: outer, holePolys: union(inner) });
}
// j: solid with continuous inline channel
{
  const R = 3.4, w = 4.2, c = 1.3;
  const outer = [bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.05 }), circlePoly(P, R, 96)];
  const ch = stroke([add(P, mul(dir(0), Lm - 1.4)), P, add(P, mul(dir(150), Lh - 1.4))], c);
  mk('R2j-inline', { polys: outer, holePolys: [ch] });
}
// k: plain union with round hub, no hole (reference)
{
  const R = 3.0, w = 3.4;
  mk('R2k-hub-solid', { polys: [bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.08 }), circlePoly(P, R, 96)] });
}
// l: hub with pin + square terminals
{
  const R = 3.2, w = 3.2;
  mk('R2l-hub-pin', { polys: [bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.08 }), circlePoly(P, R, 96)], holes: [[P, 1.0]] });
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
})();
