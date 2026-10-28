// Round 5b: dauphine silhouettes that keep the collet distinct: narrow roots vs a mild kite swell.
// Two-tone is stacked: full silhouette in the shade colour, lit facets on top running to the point.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, frame, place, svgPaths, sh, cutProfile, emitProfile } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];
const half = 20, tl = (s) => s / Math.tan(half * G.D2R);

function build(R, mE, hE, { mono, lit, shade }) {
  const H = [{ deg: 0, profile: poly(...mE), litSign: -1 }, { deg: 150, profile: poly(...hE), litSign: 1 }];
  const sil = handsOutline(new PathB(), C, R, H);
  if (mono) return [{ d: sil.str(), pts: sil.pts, fill: mono }];
  const parts = [{ d: sil.str(), pts: sil.pts, fill: shade }];
  for (const h of H) {
    const F = frame(C, h.deg), cut = cutProfile(h.profile, R), sg = h.litSign;
    const pb = new PathB();
    pb.M(F([R, 0]));
    pb.A(C, R, F([cut.start[0], sg * cut.start[1]]), sg > 0);
    emitProfile(pb, F, cut, { mirror: sg < 0, skipStart: true });
    pb.Z();
    parts.push({ d: pb.str(), pts: pb.pts, fill: lit });
  }
  return parts;
}
const straight = { R: 3.0, m: [[0, 1.5], [16.4 - tl(1.2), 1.2], [16.4, 0]], h: [[0, 1.95], [10.4 - tl(1.4), 1.4], [10.4, 0]] };
const kite = { R: 2.9, m: [[0, 1.25], [4.2, 1.62], [16.4 - tl(1.2), 1.2], [16.4, 0]], h: [[0, 1.55], [3.9, 2.05], [10.4 - tl(1.4), 1.4], [10.4, 0]] };

const S = {
  K1_straight_mono: () => build(straight.R, straight.m, straight.h, { mono: kit.T.rust }),
  K2_kite_mono: () => build(kite.R, kite.m, kite.h, { mono: kit.T.rust }),
  K3_straight_2t: () => build(straight.R, straight.m, straight.h, { lit: kit.T.rust, shade: kit.T.ink }),
  K4_kite_2t: () => build(kite.R, kite.m, kite.h, { lit: kit.T.rust, shade: kit.T.ink }),
  K5_kite_dark: () => build(kite.R, kite.m, kite.h, { lit: kit.T.bone, shade: kit.T.sun }),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    const bg = name.includes('dark') ? kit.F.slate : kit.F.bone;
    await kit.render(f, `${OUT}/${name}-50.png`, { bg, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.sizes(f, `${OUT}/${name}-sizes.png`, { bg });
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study12.png`]);
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-sizes.png`), '-tile', '3x', '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study12-sizes.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
