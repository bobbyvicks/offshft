// Round 3e: geometric leaf: each hand is a vesica (two circular arcs) whose rear point hides in the collet.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// vesica from t=a (rear point, inside the hub) to t=T (tip), max half-width h at the middle.
// Edge is one circular arc: emitted as an 'A' segment (centre on the -s side of the axis).
function vesica(a, T, h) {
  const c = (T - a) / 2, rho = (c * c + h * h) / (2 * h), mid = (a + T) / 2;
  const centre = [mid, h - rho];
  // start point must lie on the arc and inside the hub: take the arc point at t = a + 0.35 (near the rear point)
  const t0 = a + 0.35, s0 = centre[1] + Math.sqrt(rho * rho - (t0 - mid) ** 2);
  // the arc runs over the +s side from rear to tip: angle decreases in (t, s) terms -> inc = false
  return { start: [t0, s0], segs: [['L', [t0 + 0.01, centre[1] + Math.sqrt(rho * rho - (t0 + 0.01 - mid) ** 2)]], ['A', centre, rho, [T, 0], false]], rho };
}

const S = {
  V1: { R: 2.2, pin: 0.7, m: vesica(-1.0, 16.3, 1.45), h: vesica(-1.0, 10.3, 1.75) },
  V2: { R: 2.2, pin: 0.7, m: vesica(-2.0, 16.3, 1.5), h: vesica(-1.6, 10.3, 1.85) },
  V3: { R: 2.3, pin: 0.72, m: vesica(-3.0, 16.3, 1.6), h: vesica(-2.4, 10.3, 2.0) },
  V4: { R: 2.3, pin: 0.72, m: vesica(0.0, 16.3, 1.45), h: vesica(0.0, 10.3, 1.9) },
};

(async () => {
  const names = [];
  for (const [name, o] of Object.entries(S)) {
    const pb = handsOutline(new PathB(), C, o.R, [{ deg: 0, profile: o.m }, { deg: 150, profile: o.h }]);
    circle(pb, C, o.pin);
    const parts = [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    const c = await G.check(f, `${OUT}/${name}-chk25.png`, { size: 25 });
    console.log(name, JSON.stringify(c), 'tip half-angle', (Math.asin(((16.3 - -1) / 2) / o.m.rho) * 180 / Math.PI).toFixed(1));
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study10.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
