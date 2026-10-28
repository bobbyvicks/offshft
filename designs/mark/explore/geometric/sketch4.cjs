// Round 4 sketches: candidates for the 3rd and 4th variants.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm, clipHalf } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r4';
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

// 1. mitre seam: bars cut along the bisector, separated by gap g
{
  const w = 4.0, g = 1.3;
  const bis = dir(75); // bisector of the 0..150 opening
  const nb = lnorm(bis); // normal to seam line
  // seam line through P with direction bis; minute keeps side toward 0deg, hour toward 150deg
  const m = bar(P, 0, { len: Lm, tail: w, w });
  const h = bar(P, 150, { len: Lh, tail: w, w: w * 1.06 });
  // side test: point at minute direction
  const sm = L.dot(dir(0), nb) > 0 ? 1 : -1;
  const mC = clipHalf(m, add(P, mul(nb, sm * g / 2)), mul(nb, sm));
  const hC = clipHalf(h, add(P, mul(nb, -sm * g / 2)), mul(nb, -sm));
  mkLoops('A1-mitre-seam', union([mC, hC]));
  mkLoops('A2-mitre-seam-pin', union([mC, hC]), {});
}
// 3. crossing tails, minute on top
{
  const wm = 3.4, wh = 3.8, g = 1.3;
  const m = bar(P, 0, { len: Lm, tail: 3.6, w: wm });
  const h = bar(P, 150, { len: Lh, tail: 5.6, w: wh });
  mkLoops('A3-crossing', union([m, ...diffConvex(h, grow(m, g))]), { holes: [[P, 0.75]] });
}
// 4. stencil square hub (diamond) with gap, hands outside
{
  const w = 3.4, g = 1.3, s = 3.2;
  const hub = [[0, -s], [s, 0], [0, s], [-s, 0]];
  const hubG = grow(hub, g);
  const m = bar(P, 0, { len: Lm, w });
  const h = bar(P, 150, { len: Lh, w: w * 1.06 });
  mkLoops('A4-stencil-diamond', union([hub, ...diffConvex(m, hubG), ...diffConvex(h, hubG)]));
  const sq = rectPoly(-2.9, -2.9, 5.8, 5.8);
  const sqG = grow(sq, g);
  mkLoops('A4b-stencil-square', union([sq, ...diffConvex(m, sqG), ...diffConvex(h, sqG)]));
}
// 5. patch border: solid layered hands, gap, contour line
{
  const wm = 3.0, wh = 3.4, g = 1.25, t = 1.25;
  const h = capBar(P, 150, Lh, wh);
  const m = bar(P, 0, { len: Lm, w: wm });
  const solid = union([h, m]);
  const inner = union([grow(m, g), capBar(P, 150, Lh + g, wh + 2 * g)]);
  const outer = union([grow(m, g + t), capBar(P, 150, Lh + g + t, wh + 2 * (g + t))]);
  mkLoops('A5-patch-border', [...outer, ...inner, ...solid], { holes: [[P, 0.7]] });
}
// 6. outline of layered hands (refined): hour capsule outline with pin, minute bar outline
{
  const t = 1.35, wm = 4.2, wh = 4.6, g = 1.3;
  const hO = capBar(P, 150, Lh, wh), hI = capBar(P, 150, Lh - t, wh - 2 * t);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const mO = bar(P, 0, { len: Lm, w: wm, tail: wm / 2 }), mI = bar(P, 0, { len: Lm - t, w: wm - 2 * t, tail: wm / 2 });
  const mRing = difference(diffConvex(mO, hG), [mI]);
  mkLoops('A6-outline-layered', [hO, hI, ...mRing], { holes: [] });
}
// 7. inline in layered hands
{
  const wm = 4.0, wh = 4.4, g = 1.3, c = 1.25;
  const h = capBar(P, 150, Lh, wh);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const m = bar(P, 0, { len: Lm, w: wm });
  const solid = union([h, ...diffConvex(m, hG)]);
  // inline channels: minute: from 1.3 below tip down to gap edge; hour: ring around pin + channel to tip
  const mCh = diffConvex(bar(P, 0, { len: Lm - 1.3, w: c }), grow(hG, 1.3));
  const hCh = bar(P, 150, { len: Lh - 1.3, w: c });
  mkLoops('A7-inline-layered', [...solid, ...union(mCh), ...union([hCh, circlePoly(P, 0.9, 64)])]);
}
// 8. layered, minute on top with round end (for comparison with hour-on-top)
{
  const wm = 3.4, wh = 3.9, g = 1.3;
  const m = capBar(P, 0, Lm, wm);
  const mG = capBar(P, 0, Lm + g, wm + 2 * g);
  const h = bar(P, 150, { len: Lh, w: wh });
  mkLoops('A8-layered-minute-top', union([m, ...diffConvex(h, mG)]), { holes: [[P, 0.75]] });
}
// 9. layered hour on top (reference R2c) with both widths equal-ish
{
  const wm = 3.3, wh = 3.9, g = 1.3;
  const h = capBar(P, 150, Lh, wh);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const m = bar(P, 0, { len: Lm, w: wm });
  mkLoops('A9-layered-hour-top', union([h, ...diffConvex(m, hG)]), { holes: [[P, 0.8]] });
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
})();
