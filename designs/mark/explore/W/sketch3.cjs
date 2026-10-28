// Round 2b: studies for the leaf (W2) and for the fourth style (W4).
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, closedShape, circle, frame, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];
const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);

// leaf with explicit shape controls: neck half-width s0 at t=0, max sm at fraction f, tip at T,
// a = fullness of the tip curve (0..1), b = fullness of the neck curve
function leaf(s0, sm, f, T, a = 0.5, b = 0.42) {
  const tm = T * f;
  return { start: [0, s0], segs: [['C', [tm * b, s0], [tm * (1 - b * 0.8), sm], [tm, sm]], ['C', [tm + (T - tm) * a, sm], [T - (T - tm) * 0.25, sm * (1 - a) * 1.1], [T, 0]]] };
}
// vesica: circular arc edge from (0, s0') through max at T/2 to the tip, as two cubics
function vesica(W, T) {
  const h = W / 2, rho = (T * T / 4 + h * h) / (2 * h);
  const cy = h - rho, cx = T / 2;
  const pts = [];
  for (let i = 0; i <= 24; i++) { const t = (T * i) / 24; pts.push([t, cy + Math.sqrt(rho * rho - (t - cx) ** 2)]); }
  return poly(...pts);
}

const S = {};
// ---- W2 leaf studies
S.L1_slim = () => ({ R: 2.1, hands: [[0, leaf(0.95, 1.45, 0.42, 16.3, 0.5)], [150, leaf(1.2, 1.85, 0.42, 10.3, 0.5)]] });
S.L2_vesica = () => ({ R: 2.1, hands: [[0, vesica(3.0, 16.4)], [150, vesica(3.9, 10.4)]] });
S.L3_willow = () => ({ R: 2.0, hands: [[0, leaf(1.25, 1.5, 0.3, 16.3, 0.45, 0.3)], [150, leaf(1.55, 2.0, 0.3, 10.3, 0.45, 0.3)]] });
S.L4_slim_ring = () => ({ R: 2.3, hole: 0.75, hands: [[0, leaf(0.95, 1.45, 0.42, 16.3, 0.5)], [150, leaf(1.2, 1.85, 0.42, 10.3, 0.5)]] });
// ---- W4 studies
S.D1_dauphine_bold = () => ({ R: 2.6, hands: [[0, poly([0, 1.75], [14.3, 1.0], [16.3, 0])], [150, poly([0, 2.4], [8.0, 1.45], [10.3, 0])]] });
S.D2_alpha = () => ({ R: 1.9, hands: [[0, poly([0, 0.75], [5.0, 1.55], [14.6, 0.72], [16.4, 0])], [150, poly([0, 0.95], [3.4, 2.05], [8.9, 1.0], [10.4, 0])]] });
S.D3_sword_roof = () => ({ R: 2.7, hands: [[0, poly([0, 1.45], [15.0, 0.85], [16.2, 0])], [150, poly([0, 2.05], [8.5, 1.35], [10.2, 0])]] });
S.D4_breguet = () => {
  // slim shaft + ring near the tip + short point; built from parts (union by overlap, holes via evenodd per part)
  return { R: 1.9, custom: true };
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const o = fn();
    let parts;
    if (o.custom) {
      const pb = new PathB();
      const sh0 = 0.68, mT = 16.3, hT = 10.3, mr = [11.9, 2.05, 0.8], hr = [6.7, 2.05, 0.8];
      handsOutline(pb, C, o.R, [{ deg: 0, profile: poly([0, sh0], [mr[0], sh0]) }, { deg: 150, profile: poly([0, sh0 + 0.12], [hr[0], sh0 + 0.12]) }]);
      const parts0 = [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
      for (const [deg, r, T] of [[0, mr, mT], [150, hr, hT]]) {
        const F = frame(C, deg);
        const q = new PathB();
        circle(q, F([r[0], 0]), r[1]); circle(q, F([r[0], 0]), r[2]);
        parts0.push({ d: q.str(), pts: q.pts, fill: kit.T.ink });
        const tip = new PathB();
        closedShape(tip, F, poly([r[0] + r[1] - 0.25, 0.95], [T, 0]));
        parts0.push({ d: tip.str(), pts: tip.pts, fill: kit.T.ink });
      }
      parts = parts0;
    } else {
      const pb = handsOutline(new PathB(), C, o.R, o.hands.map(([deg, profile]) => ({ deg, profile })));
      if (o.hole) circle(pb, C, o.hole);
      parts = [{ d: pb.str(), pts: pb.pts, fill: name.startsWith('L') ? kit.T.ink : kit.T.rust }];
    }
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-13.png`, { bg: kit.F.bone, width: pl.w * (13 / pl.h), tile: '26x56', px: 6 });
    names.push(name);
  }
  await kit.close();
  const big = names.map((n) => `${OUT}/${n}-50.png`);
  sh('montage', ['-label', '%t', ...big, '-tile', `${big.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study3.png`]);
  const small = names.map((n) => `${OUT}/${n}-13.png`);
  sh('montage', ['-label', '%t', ...small, '-tile', `${small.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study3-13.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
