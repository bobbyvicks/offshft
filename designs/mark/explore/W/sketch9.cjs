// Round 3d: leaf (feuille) shapes that stay convex to the point.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// leaf: neck half-width s0 at t=0, widest sm at tm = f*T, point at T with tip half-angle h (deg).
// k1: how long the flank stays full after the widest point (0..1); n: neck fullness
function leaf(s0, sm, f, T, h, k1 = 0.45, n = 0.45) {
  const tm = f * T, L2 = T - tm;
  const d = L2 * 0.42;                                // tip handle length
  const c2 = [T - d * Math.cos(h * G.D2R), d * Math.sin(h * G.D2R)];
  return { start: [0, s0], segs: [['C', [tm * n, s0], [tm * (1 - n * 0.7), sm], [tm, sm]], ['C', [tm + L2 * k1, sm], c2, [T, 0]]] };
}

const S = {
  A_convex: { R: 2.25, pin: 0.72, m: leaf(0.95, 1.38, 0.44, 16.3, 24), h: leaf(1.15, 1.75, 0.44, 10.3, 24) },
  B_fuller: { R: 2.3, pin: 0.72, m: leaf(1.0, 1.45, 0.42, 16.3, 26, 0.55), h: leaf(1.2, 1.85, 0.42, 10.3, 26, 0.55) },
  C_slender: { R: 2.2, pin: 0.7, m: leaf(0.92, 1.3, 0.46, 16.3, 22, 0.5), h: leaf(1.1, 1.62, 0.46, 10.3, 22, 0.5) },
  D_low_neck: { R: 2.3, pin: 0.72, m: leaf(1.1, 1.42, 0.4, 16.3, 24, 0.5, 0.3), h: leaf(1.3, 1.8, 0.4, 10.3, 24, 0.5, 0.3) },
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
    console.log(name, JSON.stringify(c));
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study9.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
