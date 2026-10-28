// Round 3b: faceted dauphine test (two-tone facets) vs refined moon tips.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, frame, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// Dauphine: kite-like blade, widest at the collet, flanks taper to a shoulder, then a point.
// Facet split along the axis: the clockwise half in one colour, the other half in another.
function dauphine({ R, m, h, lit, shade, mono }) {
  const parts = [];
  if (mono) {
    const pb = handsOutline(new PathB(), C, R, [{ deg: 0, profile: poly(...m) }, { deg: 150, profile: poly(...h) }]);
    return [{ d: pb.str(), pts: pb.pts, fill: mono }];
  }
  const hub = new PathB(); circle(hub, C, R);
  for (const [deg, E] of [[0, m], [150, h]]) {
    const F = frame(C, deg);
    const a = new PathB(); a.M(F([0, 0])); for (const p of E) a.L(F(p)); a.Z();
    const b = new PathB(); b.M(F([0, 0])); for (const p of E) b.L(F([p[0], -p[1]])); b.Z();
    parts.push({ d: a.str(), pts: a.pts, fill: shade }, { d: b.str(), pts: b.pts, fill: lit });
  }
  parts.push({ d: hub.str(), pts: hub.pts, fill: shade });
  return parts;
}
const D = { R: 2.7, m: [[0, 1.75], [14.2, 1.2], [16.4, 0]], h: [[0, 2.45], [8.0, 1.5], [10.4, 0]] };

const S = {
  F1_dauphine_2tone: () => dauphine({ ...D, lit: kit.T.sun, shade: kit.T.rust }),
  F2_dauphine_2tone_ink: () => dauphine({ ...D, lit: kit.T.rust, shade: kit.T.ink }),
  F3_dauphine_mono: () => dauphine({ ...D, mono: kit.T.ink }),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: name.includes('ink') || name.includes('mono') ? kit.F.bone : kit.F.slate, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.sizes(f, `${OUT}/${name}-sizes.png`, { bg: name.includes('ink') || name.includes('mono') ? kit.F.bone : kit.F.slate });
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), ...names.map((n) => `${OUT}/${n}-sizes.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study7.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
