// Round 0: quick sketches of many watch-hand styles at 25 mm tall, to pick four to develop.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, closedShape, circle, frame, place, svgPaths, insetEdge, clipFrom, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];
const M = kit.FIVE.minute, Hr = kit.FIVE.hour;

// tip helper: a pointed tip of given full angle (deg) from half-width s at the end of a straight edge
const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);

const S = {};

// S1 pencil: parallel-ish batons, pointed tips at the same angle, ring hub
S.S1_pencil = () => {
  const R = 2.1, hole = 0.72, ang = 64;
  const mS0 = 1.05, mS1 = 0.82, mT = 16.4, hS0 = 1.6, hS1 = 1.36, hT = 10.2;
  const minute = poly([-1, mS0], [mT - tipLen(mS1, ang), mS1], [mT, 0]);
  const hour = poly([-1, hS0], [hT - tipLen(hS1, ang), hS1], [hT, 0]);
  const pb = handsOutline(new PathB(), C, R, [{ deg: M, profile: minute }, { deg: Hr, profile: hour }]);
  circle(pb, C, hole);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
};

// S2 leaf (feuille)
S.S2_leaf = () => {
  const R = 1.75, hole = 0;
  const leaf = (s0, smax, tmax, T) => ({
    start: [-0.5, s0],
    segs: [['C', [tmax * 0.45, s0], [tmax * 0.55, smax], [tmax, smax]], ['C', [tmax + (T - tmax) * 0.45, smax], [T - (T - tmax) * 0.2, smax * 0.35], [T, 0]]],
  });
  const pb = handsOutline(new PathB(), C, R, [{ deg: M, profile: leaf(0.62, 1.3, 6.0, 16.6) }, { deg: Hr, profile: leaf(0.75, 1.95, 4.4, 10.4) }]);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
};

// S3 lume / skeleton batons
S.S3_lume = () => {
  const R = 2.55, hole = 0.75, wall = 1.3, ang = 70;
  const mS = 1.95, mT = 16.4, hS = 2.3, hT = 10.4;
  const mEdge = [[-1, mS], [mT - tipLen(mS, ang), mS], [mT, 0]];
  const hEdge = [[-1, hS], [hT - tipLen(hS, ang), hS], [hT, 0]];
  const pb = handsOutline(new PathB(), C, R, [{ deg: M, profile: poly(...mEdge) }, { deg: Hr, profile: poly(...hEdge) }]);
  circle(pb, C, hole);
  const slot = (edge, deg) => {
    const inner = clipFrom(insetEdge(edge, wall), R + wall);
    closedShape(pb, frame(C, deg), poly(...inner));
  };
  slot(mEdge, M); slot(hEdge, Hr);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
};

// S4 pomme / Breguet: slim hands with an open ring near the tip
S.S4_pomme = () => {
  const R = 1.9, hole = 0.7, w = 0.66;
  const pb = new PathB();
  const mT = 16.4, hT = 10.4;
  const mRing = 12.0, hRing = 6.6, ro = 2.0, ri = 0.72;
  // stems + tips as union of overlapping parts (sketch only)
  handsOutline(pb, C, R, [{ deg: M, profile: poly([-1, w], [mRing, w]) }, { deg: Hr, profile: poly([-1, w + 0.15], [hRing, w + 0.15]) }]);
  const parts = [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
  for (const [deg, tr, T] of [[M, mRing, mT], [Hr, hRing, hT]]) {
    const q = new PathB();
    const F = frame(C, deg);
    circle(q, F([tr, 0]), ro); circle(q, F([tr, 0]), ri);
    closedShape(q, F, poly([tr + ro - 0.4, 0.75], [T, 0]));
    parts.push({ d: q.str(), pts: q.pts, fill: kit.T.ink });
  }
  const hh = new PathB(); circle(hh, C, hole);
  parts.push({ d: hh.str(), pts: hh.pts, fill: kit.F.bone });
  return parts;
};

// S5 alpha / kite: narrow neck, widest a third out, long straight taper to a short point
S.S5_alpha = () => {
  const R = 1.6, ang = 60;
  const mE = [[-0.5, 0.62], [5.4, 1.38], [14.8, 0.72], [16.6, 0]];
  const hE = [[-0.5, 0.8], [3.8, 2.0], [8.8, 1.05], [10.4, 0]];
  const pb = handsOutline(new PathB(), C, R, [{ deg: M, profile: poly(...mE) }, { deg: Hr, profile: poly(...hE) }]);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
};

// S6 sword + solid disc hub, no hole, wider hour hand with blunt tip angle
S.S6_sword = () => {
  const R = 2.4;
  const mE = [[-1, 1.15], [14.2, 0.78], [16.6, 0]];
  const hE = [[-1, 1.75], [8.2, 1.45], [10.4, 0]];
  const pb = handsOutline(new PathB(), C, R, [{ deg: M, profile: poly(...mE) }, { deg: Hr, profile: poly(...hE) }]);
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }];
};

// S7 counterweight: minute passes through the hub, short tail
S.S7_counter = () => {
  const R = 2.0, hole = 0.7;
  const mE = [[-4.6, 0.75], [14.8, 0.75], [16.4, 0]];
  const hE = [[-1, 1.5], [8.6, 1.3], [10.4, 0]];
  const pb = handsOutline(new PathB(), C, R, [{ deg: Hr, profile: poly(...hE) }, { deg: M, profile: poly([-1, 0.75], [14.8, 0.75], [16.4, 0]) }]);
  circle(pb, C, hole);
  const t = new PathB();
  closedShape(t, frame(C, 180), poly([0, 0.9], [3.6, 0.9], [4.6, 0.9]));
  return [{ d: pb.str(), pts: pb.pts, fill: kit.T.ink }, { d: t.str(), pts: t.pts, fill: kit.T.ink }];
};

// S8 dauphine two-tone (facet split along the axis)
S.S8_dauphine2 = () => {
  const R = 1.5;
  const mE = [[0, 1.7], [14.8, 0.7], [16.6, 0]];
  const hE = [[0, 2.3], [8.8, 1.0], [10.4, 0]];
  const parts = [];
  for (const [deg, E] of [[M, mE], [Hr, hE]]) {
    const F = frame(C, deg);
    const a = new PathB(); a.M(F([0, 0])); for (const p of E) a.L(F(p)); a.Z();
    const b = new PathB(); b.M(F([0, 0])); for (const p of E) b.L(F([p[0], -p[1]])); b.Z();
    parts.push({ d: a.str(), pts: a.pts, fill: kit.T.rust }, { d: b.str(), pts: b.pts, fill: kit.T.ink });
  }
  const h = new PathB(); circle(h, C, R); parts.push({ d: h.str(), pts: h.pts, fill: kit.T.ink });
  return parts;
};

(async () => {
  const list = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.5 });
    const file = `${OUT}/${name}.svg`;
    kit.writeSvg(file, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    const k = 25 / pl.h;
    await kit.render(file, `${OUT}/${name}.png`, { bg: kit.F.bone, width: pl.w * k, tile: '40x32', px: 8 });
    await kit.render(file, `${OUT}/${name}-13.png`, { bg: kit.F.bone, width: pl.w * (13 / pl.h), tile: '40x32', px: 8 });
    list.push(name);
  }
  await kit.close();
  const args = [];
  for (const n of list) args.push(`${OUT}/${n}.png`, `${OUT}/${n}-13.png`);
  sh('montage', ['-label', '%t', ...args, '-tile', '6x', '-geometry', '320x256+6+6', '-pointsize', '16', '-background', '#888888', `${OUT}/sheet0.png`]);
  console.log('ok', list.join(' '));
})().catch((e) => { console.error(e); process.exit(1); });
