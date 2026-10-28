// Round 1b: tip shape and weight studies for the baton (Pin) hands.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// ogive (gothic arch) tip: from shoulder half-width s at t0 to the point at T, as one cubic per side
function ogiveProfile(base, s, T, tipLenK = 1.6) {
  const L = s * tipLenK;      // tip length
  const t0 = T - L;
  return { start: base, segs: [['L', [t0, s]], ['C', [t0 + L * 0.5, s], [T - L * 0.18, s * 0.42], [T, 0]]] };
}
const roof = (base, s, T, ang) => poly(base, [T - s / Math.tan((ang / 2) * G.D2R), s], [T, 0]);

const variants = {
  a_roof60: { tip: 'roof', ang: 60 },
  b_roof90: { tip: 'roof', ang: 90 },
  c_roof76: { tip: 'roof', ang: 76 },
  d_ogive: { tip: 'ogive', k: 1.7 },
  e_ogive_heavy: { tip: 'ogive', k: 1.7, wm: 2.5, wh: 3.5, R: 2.6 },
  f_roof90_heavy: { tip: 'roof', ang: 90, wm: 2.5, wh: 3.5, R: 2.6 },
};

(async () => {
  const names = [];
  for (const [name, o] of Object.entries(variants)) {
    const wm = o.wm || 2.2, wh = o.wh || 3.2, R = o.R || 2.3, hole = R / 3;
    const Lm = 16, Lh = 10;
    const prof = (w, L) => (o.tip === 'roof' ? roof([-1, w / 2], w / 2, L, o.ang) : ogiveProfile([-1, w / 2], w / 2, L, o.k));
    const pb = handsOutline(new PathB(), C, R, [{ deg: 0, profile: prof(wm, Lm) }, { deg: 150, profile: prof(wh, Lh) }]);
    circle(pb, C, hole);
    const parts = [{ d: pb.str(), pts: pb.pts, fill: kit.T.rust }];
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '30x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-25.png`, { bg: kit.F.bone, width: pl.w * (25 / pl.h), tile: '30x56', px: 6 });
    names.push(name);
  }
  await kit.close();
  const files = names.flatMap((n) => [`${OUT}/${n}-50.png`]);
  sh('montage', ['-label', '%t', ...files, '-tile', `${files.length}x`, '-geometry', '+4+4', '-pointsize', '16', '-background', '#888888', `${OUT}/tips.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
