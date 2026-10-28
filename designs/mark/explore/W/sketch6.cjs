// Round 2e: moon (Breguet) options for W4: two moons vs a single moon on the hour hand.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, frame, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];
const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);

function moon(w, tc, ro, sb, T) {
  const c1 = Math.sqrt(ro * ro - w * w), c2 = Math.sqrt(ro * ro - sb * sb);
  return { start: [0, w], segs: [['L', [tc - c1, w]], ['A', [tc, 0], ro, [tc + c2, sb], false], ['L', [T, 0]]] };
}
const baton = (w, T, ang) => poly([0, w], [T - tipLen(w, ang), w], [T, 0]);

function build({ R, pin, minute, hour, holes }) {
  const pb = handsOutline(new PathB(), C, R, [{ deg: 0, profile: minute }, { deg: 150, profile: hour }]);
  if (pin) circle(pb, C, pin);
  for (const [deg, tc, r] of holes) circle(pb, frame(C, deg)([tc, 0]), r);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
}

const S = {
  M1_two_moons: () => build({ R: 2.0, minute: moon(0.7, 12.6, 2.0, 0.95, 16.4), hour: moon(0.82, 6.9, 2.1, 1.05, 10.4), holes: [[0, 12.6, 0.78], [150, 6.9, 0.82]] }),
  M2_hour_moon: () => build({ R: 2.0, minute: baton(0.78, 16.4, 60), hour: moon(0.85, 6.6, 2.25, 1.1, 10.4), holes: [[150, 6.6, 0.95]] }),
  M3_hour_moon_pin: () => build({ R: 2.15, pin: 0.68, minute: baton(0.8, 16.4, 60), hour: moon(0.9, 6.6, 2.3, 1.1, 10.4), holes: [[150, 6.6, 0.95]] }),
  M4_hour_moon_bold: () => build({ R: 2.4, minute: baton(1.0, 16.2, 60), hour: moon(1.05, 6.5, 2.55, 1.25, 10.4), holes: [[150, 6.5, 1.05]] }),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.sizes(f, `${OUT}/${name}-sizes.png`, { bg: kit.F.bone });
    const c = await G.check(f, `${OUT}/${name}-chk25.png`, { size: 25 });
    console.log(name, JSON.stringify(c));
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study6.png`]);
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-sizes.png`), '-tile', '2x', '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study6-sizes.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
