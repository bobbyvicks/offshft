// Round 2c: proper Breguet (moon) construction, leaf on a pinned collet, and a tapered lume option.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, closedShape, circle, frame, place, svgPaths, insetEdge, clipFrom, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// Breguet hand profile: shaft half-width w, moon ring centred at tc with outer radius ro,
// a short point from half-width sb at the ring to the tip T.
function moon(w, tc, ro, sb, T) {
  const c1 = Math.sqrt(ro * ro - w * w), c2 = Math.sqrt(ro * ro - sb * sb);
  return { start: [0, w], segs: [['L', [tc - c1, w]], ['A', [tc, 0], ro, [tc + c2, sb], false], ['L', [T, 0]]] };
}
function breguet({ hubR, hubHole = 0, m, h, fill }) {
  const pb = handsOutline(new PathB(), C, hubR, [{ deg: 0, profile: moon(...m.p) }, { deg: 150, profile: moon(...h.p) }]);
  if (hubHole) circle(pb, C, hubHole);
  for (const [deg, o] of [[0, m], [150, h]]) circle(pb, frame(C, deg)([o.p[1], 0]), o.hole);
  return [{ d: pb.str(), pts: pb.pts, fill }];
}
function leaf(s0, sm, f, T, a = 0.5, b = 0.42) {
  const tm = T * f;
  return { start: [0, s0], segs: [['C', [tm * b, s0], [tm * (1 - b * 0.8), sm], [tm, sm]], ['C', [tm + (T - tm) * a, sm], [T - (T - tm) * 0.25, sm * (1 - a) * 1.1], [T, 0]]] };
}

const S = {
  B1_breguet: () => breguet({ hubR: 1.95, m: { p: [0.68, 12.3, 2.05, 0.9, 16.4], hole: 0.78 }, h: { p: [0.76, 6.75, 2.05, 0.95, 10.4], hole: 0.78 }, fill: kit.T.ink }),
  B2_breguet_pin: () => breguet({ hubR: 2.2, hubHole: 0.72, m: { p: [0.7, 12.4, 2.0, 0.9, 16.4], hole: 0.75 }, h: { p: [0.8, 6.85, 2.15, 1.0, 10.4], hole: 0.8 }, fill: kit.T.ink }),
  B3_breguet_big: () => breguet({ hubR: 2.05, m: { p: [0.7, 12.0, 2.35, 0.95, 16.4], hole: 1.0 }, h: { p: [0.8, 6.5, 2.35, 1.05, 10.4], hole: 1.0 }, fill: kit.T.ink }),
  L5_leaf_pin: () => {
    const pb = handsOutline(new PathB(), C, 2.3, [{ deg: 0, profile: leaf(0.95, 1.4, 0.42, 16.3, 0.5) }, { deg: 150, profile: leaf(1.15, 1.75, 0.42, 10.3, 0.5) }]);
    circle(pb, C, 0.72);
    return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
  },
  L6_leaf_pin_slim: () => {
    const pb = handsOutline(new PathB(), C, 2.2, [{ deg: 0, profile: leaf(0.9, 1.3, 0.45, 16.3, 0.55) }, { deg: 150, profile: leaf(1.1, 1.6, 0.45, 10.3, 0.55) }]);
    circle(pb, C, 0.7);
    return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
  },
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-25.png`, { bg: kit.F.bone, width: pl.w * (25 / pl.h), tile: '26x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-13.png`, { bg: kit.F.bone, width: pl.w * (13 / pl.h), tile: '26x56', px: 6 });
    const c = await G.check(f, `${OUT}/${name}-chk25.png`, { size: 25 });
    console.log(name, JSON.stringify(c));
    names.push(name);
  }
  await kit.close();
  const files = names.flatMap((n) => [`${OUT}/${n}-50.png`]);
  sh('montage', ['-label', '%t', ...files, '-tile', `${files.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study4.png`]);
  const f2 = names.flatMap((n) => [`${OUT}/${n}-25.png`, `${OUT}/${n}-13.png`]);
  sh('montage', ['-label', '%t', ...f2, '-tile', `${f2.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study4-small.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
