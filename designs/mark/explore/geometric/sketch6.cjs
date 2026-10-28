// Round 6 sketches: outline / inline candidates.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, difference, polyD, circleD, rectPoly, dir, add, sub, mul, bbox, diffConvex, grow, circlePoly, lnorm } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r6';
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

// a: outline of layered hands, line 1.35
{
  const t = 1.35, wm = 4.3, wh = 4.7, g = 1.35;
  const hO = capBar(P, 150, Lh, wh), hI = capBar(P, 150, Lh - t, wh - 2 * t);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const mO = bar(P, 0, { len: Lm, w: wm }), mI = bar(P, 0, { len: Lm - t, w: wm - 2 * t });
  const mOut = union(diffConvex(mO, hG));
  const mIn = union(diffConvex(mI, capBar(P, 150, Lh + g + t, wh + 2 * (g + t))));
  mkLoops('a-outline-layered', [hO, hI, ...mOut, ...mIn, circlePoly(P, 0.0001, 3)].slice(0, -1), { holes: [] });
}
// b: inline ringing the pin, on hub-pin silhouette
{
  const w = 4.3, R = 3.6, c = 1.25, pin = 0.9;
  const outer = union([bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.05 }), circlePoly(P, R, 128)]);
  // channel: minute channel + hour channel + ring channel around pin (ring radius pin+c)
  const ringO = circlePoly(P, pin + c, 96);
  const chans = union([bar(P, 0, { len: Lm - 1.4, w: c }), bar(P, 150, { len: Lh - 1.4, w: c }), ringO]);
  mkLoops('b-inline-ring', [...outer, ...chans, circlePoly(P, pin, 64)]);
}
// c: ring hub (the O) + solid hands
{
  const w = 3.2, R = 3.6, r = 2.0;
  const outer = union([bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.06 }), circlePoly(P, R, 128)]);
  mkLoops('c-ring-hub', [...outer, circlePoly(P, r, 96)]);
}
// d: outline of cap pictogram
{
  const t = 1.3, w = 4.2, rh = 2.6, g = 1.3;
  const ring = circlePoly(P, rh + g, 128);
  const m = diffConvex(bar(P, 0, { len: Lm, w }), ring), h = diffConvex(bar(P, 150, { len: Lh, w: w * 1.05 }), ring);
  const mi = diffConvex(bar(P, 0, { len: Lm - t, w: w - 2 * t }), circlePoly(P, rh + g + t, 128));
  const hi = diffConvex(bar(P, 150, { len: Lh - t, w: w * 1.05 - 2 * t }), circlePoly(P, rh + g + t, 128));
  mkLoops('d-outline-cap', [...union(m), ...union(mi), ...union(h), ...union(hi), circlePoly(P, rh, 96), circlePoly(P, rh - t, 96)]);
}
// e: outline square + solid hands (checked box)
{
  const S = 19, t = 1.5, c = [S / 2, S / 2];
  const w = 2.7;
  const frame = [rectPoly(0, 0, S, S), rectPoly(t, t, S - 2 * t, S - 2 * t)];
  const m = bar(c, 0, { len: S / 2 - t - 1.6, w });
  const h = bar(c, 150, { len: 5.3, w: w * 1.06 });
  mkLoops('e-outline-box', [...frame, ...union([m, h, circlePoly(c, w * 0.75, 96)])]);
}
// f: patch border - solid layered hands + gap + continuous contour line
{
  const wm = 3.0, wh = 3.4, g = 1.25, t = 1.25;
  const h = capBar(P, 150, Lh, wh);
  const hG = capBar(P, 150, Lh + g, wh + 2 * g);
  const m = bar(P, 0, { len: Lm, w: wm });
  const solid = union([h, ...diffConvex(m, hG)]);
  const inner = union([bar(P, 0, { len: Lm + g, w: wm + 2 * g }), capBar(P, 150, Lh + g, wh + 2 * g)]);
  const outer = union([bar(P, 0, { len: Lm + g + t, w: wm + 2 * (g + t) }), capBar(P, 150, Lh + g + t, wh + 2 * (g + t))]);
  mkLoops('f-patch-border', [...outer, ...inner, ...solid], { holes: [[P, 0.7]] });
}
// g: double-line (inline) hands: each hand two parallel bars, joined at pivot by ring
{
  const w = 4.6, c = 1.3, R = 3.4;
  const outer = union([bar(P, 0, { len: Lm, w }), bar(P, 150, { len: Lh, w: w * 1.04 }), circlePoly(P, R, 128)]);
  const chans = union([bar(P, 0, { len: Lm + 1, w: c }), bar(P, 150, { len: Lh + 1, w: c }), circlePoly(P, 1.4, 96)]);
  // channels run out through the tips -> use difference for clean geometry
  mkLoops('g-split-inline', difference(outer, chans));
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
})();
