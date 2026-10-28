// Round 2d: lance / sword studies for W4 (continuous convex taper, no shoulder kink).
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// lance: straight-ish flank that bends into a point. s0 base half-width, T length,
// k1 = how far the flank stays full (0..1), k2 = fullness near the tip
const lance = (s0, T, k1 = 0.55, k2 = 0.5) => ({ start: [0, s0], segs: [['C', [T * k1, s0 * 0.97], [T * 0.93, s0 * k2], [T, 0]]] });
// half-width of a profile at t (for reporting)
function widthAt(prof, t) {
  const Q = [prof.start, ...prof.segs[0].slice(1)];
  let best = 0, bd = 1e9;
  for (let i = 0; i <= 2000; i++) { const p = G.bez(Q, i / 2000); const d = Math.abs(p[0] - t); if (d < bd) { bd = d; best = p[1]; } }
  return best * 2;
}

const S = {
  N1_lance: { R: 2.6, m: lance(1.35, 16.3, 0.55, 0.45), h: lance(1.95, 10.3, 0.5, 0.5) },
  N2_lance_full: { R: 2.6, m: lance(1.3, 16.3, 0.7, 0.62), h: lance(1.9, 10.3, 0.65, 0.62) },
  N3_lance_heavy: { R: 2.9, m: lance(1.5, 16.3, 0.62, 0.55), h: lance(2.2, 10.3, 0.6, 0.55) },
  N4_straight_sword: { R: 2.7, m: poly([0, 1.45], [13.8, 0.8], [16.3, 0]), h: poly([0, 2.1], [7.6, 1.2], [10.3, 0]) },
};

(async () => {
  const names = [];
  for (const [name, o] of Object.entries(S)) {
    const pb = handsOutline(new PathB(), C, o.R, [{ deg: 0, profile: o.m }, { deg: 150, profile: o.h }]);
    const parts = [{ d: pb.str(), pts: pb.pts, fill: kit.T.rust }];
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    const c = await G.check(f, `${OUT}/${name}-chk25.png`, { size: 25 });
    if (o.m.segs[0][0] === 'C') console.log(name, 'minute width @T-1.5', widthAt(o.m, 16.3 - 1.5).toFixed(2), 'hour @T-1.5', widthAt(o.h, 10.3 - 1.5).toFixed(2), JSON.stringify(c));
    else console.log(name, JSON.stringify(c));
    names.push(name);
  }
  await kit.close();
  const files = names.flatMap((n) => [`${OUT}/${n}-50.png`, `${OUT}/${n}-chk25.png`]);
  sh('montage', ['-label', '%t', ...files, '-tile', `${files.length}x`, '-geometry', '+3+3', '-pointsize', '14', '-background', '#888888', `${OUT}/study5.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
