// Round 6b: leaf flanks as cubics: belly per flank (optical correction) but the same tip angle on both sides.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// flank from (0, s0) [inside the collet] to the tip (T, 0). Belly set by `belly` (height of the first handle),
// tip direction set by tip half-angle `a` (deg) and handle length k2*T.
function flank(s0, T, belly, a, k1 = 0.32, k2 = 0.34) {
  const r = a * G.D2R;
  return { start: [0, s0], segs: [['C', [T * k1, belly], [T - k2 * T * Math.cos(r), k2 * T * Math.sin(r)], [T, 0]]] };
}
function leafMark({ m, hUp, hLo }) {
  const pb = handsOutline(new PathB(), C, 2.25, [{ deg: 0, profile: m }, { deg: 150, profile: hLo, left: hUp }]);
  circle(pb, C, 0.75);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
}
const minute = flank(0.9, 16.3, 1.95, 16);
const S = {
  R1_sym: () => leafMark({ m: minute, hUp: flank(1.2, 10.3, 2.55, 24), hLo: flank(1.2, 10.3, 2.55, 24) }),
  R2_comp12: () => leafMark({ m: minute, hUp: flank(1.2, 10.3, 2.55 * 1.12, 24), hLo: flank(1.2, 10.3, 2.55 * 0.88, 24) }),
  R3_comp20: () => leafMark({ m: minute, hUp: flank(1.2, 10.3, 2.55 * 1.2, 24), hLo: flank(1.2, 10.3, 2.55 * 0.8, 24) }),
  R4_comp20_tip20: () => leafMark({ m: minute, hUp: flank(1.2, 10.3, 2.55 * 1.2, 20), hLo: flank(1.2, 10.3, 2.55 * 0.8, 20) }),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-25.png`, { bg: kit.F.bone, width: pl.w * (25 / pl.h), tile: '20x30', px: 6 });
    const c = await G.check(f, `${OUT}/${name}-chk25.png`, { size: 25 });
    console.log(name, JSON.stringify(c));
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study14.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
