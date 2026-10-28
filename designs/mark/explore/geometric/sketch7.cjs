// Round 7: cap variants for G3 and size tests of leading candidates.
const L = require('./lib.cjs');
const { kit, bar, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm, inter } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r7';
fs.mkdirSync(OUT, { recursive: true });
const P = [0, 0];
const sketches = [];
function mkLoops(name, loops, { holes = [], fill = kit.T.ink } = {}) {
  const d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('');
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
// hour hand as parallelogram with horizontal cuts between y0 and y1 (axis through P at 150deg)
function hourPara(y0, y1, w) {
  const d = dir(150), n = lnorm(d);
  const Lp = add(P, mul(n, w / 2)), Rp = add(P, mul(n, -w / 2));
  const h = [1, 0];
  return [inter(Lp, d, [0, y0], h), inter(Lp, d, [0, y1], h), inter(Rp, d, [0, y1], h), inter(Rp, d, [0, y0], h)];
}
const Lm = 15.5, Lh = 9.5;

// round cap
{
  const w = 3.4, rh = 1.9, g = 1.3;
  const ring = circlePoly(P, rh + g, 128);
  mkLoops('C1-round-cap', union([circlePoly(P, rh, 128), ...diffConvex(bar(P, 0, { len: Lm, w }), ring), ...diffConvex(bar(P, 150, { len: Lh, w: w * 1.06 }), ring)]));
}
// square cap, horizontal cuts everywhere
{
  const w = 3.4, s = 3.4, g = 1.3;
  const sq = rectPoly(-s / 2, -s / 2, s, s);
  const m = rectPoly(-w / 2, -Lm, w, Lm - s / 2 - g);
  const hy1 = Lh * Math.cos(Math.PI / 6);
  const hh = hourPara(s / 2 + g, hy1, w * 1.06);
  mkLoops('C2-square-cap-hcut', union([sq, m, hh]));
}
// square cap, square cut hour tip
{
  const w = 3.4, s = 3.4, g = 1.3;
  const sq = rectPoly(-s / 2, -s / 2, s, s);
  const sqG = grow(sq, g);
  const m = diffConvex(bar(P, 0, { len: Lm, w }), sqG);
  const hh = diffConvex(bar(P, 150, { len: Lh, w: w * 1.06 }), sqG);
  mkLoops('C3-square-cap', union([sq, ...m, ...hh]));
}
// diamond cap
{
  const w = 3.4, k = 2.5, g = 1.3;
  const dm = [[0, -k], [k, 0], [0, k], [-k, 0]];
  const dG = grow(dm, g);
  mkLoops('C4-diamond-cap', union([dm, ...diffConvex(bar(P, 0, { len: Lm, w }), dG), ...diffConvex(bar(P, 150, { len: Lh, w: w * 1.06 }), dG)]));
}
// hex nut cap with pin hole
{
  const w = 3.4, R = 2.6, g = 1.2;
  const hex = [...Array(6)].map((_, i) => [R * Math.cos((i * Math.PI) / 3), R * Math.sin((i * Math.PI) / 3)]);
  const hG = grow(hex, g);
  mkLoops('C5-hex-cap', [...union([hex, ...diffConvex(bar(P, 0, { len: Lm, w }), hG), ...diffConvex(bar(P, 150, { len: Lh, w: w * 1.06 }), hG)]), circlePoly(P, 1.0, 64)]);
}
// rivet (G1 reference)
{
  const wm = 3.3, wh = 3.9, g = 1.3;
  const hh = capBar(P, 150, Lh, wh);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  mkLoops('C6-rivet', [...union([hh, ...diffConvex(bar(P, 0, { len: Lm, w: wm }), hG)]), circlePoly(P, 0.8, 64)]);
}

(async () => {
  for (const s of sketches) {
    await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
    await kit.sizes(s.file, s.file.replace('.svg', '-sizes.png'), { bg: kit.F.bone });
  }
  await kit.close();
})();
