// Round 6a: W2 hour-leaf tip vs droop compensation; W4 collet colour in the light lockup colours.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

function vesica(a, T, h) {
  const c = (T - a) / 2, rho = (c * c + h * h) / (2 * h), mid = (a + T) / 2, centre = [mid, h - rho];
  const sAt = (t) => centre[1] + Math.sqrt(rho * rho - (t - mid) ** 2);
  const t0 = a + 0.3;
  return { start: [t0, sAt(t0)], segs: [['L', [t0 + 0.01, sAt(t0 + 0.01)]], ['A', centre, rho, [T, 0], false]] };
}
const tipAngle = (a, T, h) => { const c = (T - a) / 2, rho = (c * c + h * h) / (2 * h); return Math.asin(c / rho) * 180 / Math.PI; };
function leafMark(hh, opt, a = -1.0) {
  const R = 2.25;
  const up = hh * (1 + opt), lo = hh * (1 - opt);
  const pb = handsOutline(new PathB(), C, R, [
    { deg: 0, profile: vesica(-1.0, 16.3, 1.45) },
    { deg: 150, profile: vesica(a, 10.3, lo), left: vesica(a, 10.3, up) },
  ]);
  circle(pb, C, 0.75);
  console.log(`hh=${hh} opt=${opt} a=${a}: NE flank arrives at ${(150 + tipAngle(a, 10.3, up)).toFixed(1)} deg, SW flank at ${(150 - tipAngle(a, 10.3, lo)).toFixed(1)} deg`);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
}

const S = {
  Q1_sym: () => leafMark(1.9, 0),
  Q2_opt08: () => leafMark(1.9, 0.08),
  Q3_fat_opt08: () => leafMark(2.15, 0.08),
  Q4_long_rear: () => leafMark(1.85, 0.08, -2.4),
  Q5_opt18: () => leafMark(1.9, 0.18),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study13.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
