// Shared tech flat for the short-sleeve tees: tee.cjs (Comfort Colors 1717) and pocket-tee.cjs (Comfort Colors 6030).
// Not an item itself. Both tees are this one drawing at the same size-M measurements (SIZE_M); the pocket tee only adds
// its patch pocket and takes its mark on the sleeve instead of the chest.
//
// Built for the wearer's left (+x) and mirrored, so both sides match exactly. y = 0 is the high point of the shoulder
// (HPS), which is the top of the drawing.
'use strict';
const G = require('./_bezier.cjs');
const { V, add, sub, mul, len, unit, lerp, turn, dir, meet, C, L } = G;

const STITCH = 6;      // topstitching beside a seam, mm
const TWIN = [15, 21]; // double-needle hems: the two rows of stitching, mm in from the folded edge

// Size M, relaxed fit (Comfort Colors 1717 and 6030 share the body).
const SIZE_M = {
  width: 560,                                       // flat chest, side seam to side seam
  length: 720,                                      // HPS to hem
  neck: { halfW: 86, drop: 80, rib: 20, back: 16 }, // collar: inner edge half-width and front drop, rib band, back drop
  shoulder: { x: 246, y: 48 },                      // shoulder point, where the sleeve is set in
  underarm: 262,                                    // the armhole meets the side seam this far below the HPS
  // Sleeve: long axis 32° below horizontal; top edge 30°, 220 mm from the shoulder point; hem square to the axis,
  // 176 mm across; the shoulder runs into the sleeve in a round of 34 mm.
  sleeve: { axis: 32, top: 30, length: 220, opening: 176, round: 34 },
  chest: { x: 95, y: 190 },                         // the wearer's left chest logo
};

function tee(kit, spec) {
  const pen = G.pen(kit);
  const { fabric, shade, rib } = kit.STYLE;
  const W = spec.width / 2, hemY = spec.length;

  // ---------- crew collar ----------
  const { halfW: R, drop: D, rib: rw, back: bd } = spec.neck;
  const H = V(R, 0);                              // HPS: where the collar's edge meets the shoulder line
  const S = V(spec.shoulder.x, spec.shoulder.y);
  const ush = unit(sub(S, H));                    // along the shoulder line, outwards
  const Hs = add(H, mul(ush, rw));                // the collar seam on the shoulder line
  const k = 0.58;
  const neckCurve = (y0, x1, y1) => [C(V(0, y0), V(x1 * k, y0), V(x1, y1 + (y0 - y1) * (1 - k)), V(x1, y1))];
  const frontEdge = neckCurve(D, R, 0);
  const neckSeam = [C(V(0, D + rw), V(Hs.x * k, D + rw), V(Hs.x, Hs.y + (D + rw - Hs.y) * (1 - k)), Hs)];
  const backEdge = [C(V(0, bd), V(R * 0.5, bd), V(R * 0.86, bd * 0.42), H)];
  const backLow = [C(V(0, bd + rw), V(R * 0.55, bd + rw), V(R * 0.97, (bd + rw) * 0.5), H)];

  // ---------- shoulder round, armhole and sleeve ----------
  const sl = spec.sleeve;
  const ax = dir(sl.axis);            // the sleeve's long axis, shoulder to hem
  const across = turn(ax);            // across the sleeve, from its top edge to its underarm edge
  const topDir = dir(sl.top);
  const r = sl.round;
  const F1 = sub(S, mul(ush, r)), F2 = add(S, mul(topDir, r));
  const [roundIn, roundOut] = G.split(C(F1, add(F1, mul(ush, r * 0.55)), sub(F2, mul(topDir, r * 0.55)), F2), 0.5);
  const M = roundIn.d;                // the armhole seam starts on the round
  const U = V(W, spec.underarm);      // underarm: armhole meets side seam
  const depth = len(sub(U, M));
  const seam = [C(M, add(M, mul(turn(ush), depth * 0.3)), sub(U, mul(unit(V(0.22, 1)), depth * 0.3)), U)];
  const Ho = add(S, mul(topDir, sl.length));      // hem, outer corner
  const Hi = add(Ho, mul(across, sl.opening));    // hem, underarm corner

  const bodyHalf = neckSeam.concat([L(Hs, F1), roundIn], seam, G.corners([U, V(W, hemY), V(0, hemY)], [0, 4, 0]));
  const sleeve = [roundOut].concat(G.corners([F2, Ho, Hi, U], [0, 3, 3, 0]), G.reverse(seam));

  // ---------- draw, back to front ----------
  // Inside of the neck: the back of the opening, and the back collar band seen through it.
  pen.fill(G.sym(backEdge.concat(G.reverse(frontEdge))), shade);
  pen.fill(G.sym(backEdge.concat(G.reverse(backLow))), rib);
  pen.ribs(G.mirrorPairs(G.between(backEdge, backLow, G.RIB_PITCH, true).slice(0, -2)));

  pen.fill(G.sym(bodyHalf), fabric);

  // Front collar band, and the topstitching below its seam.
  pen.fill(G.sym(frontEdge.concat([L(H, Hs)], G.reverse(neckSeam))), rib);
  pen.ribs(G.mirrorPairs(G.between(frontEdge, neckSeam, G.RIB_PITCH * 0.85, true)));
  const Hst = add(Hs, mul(ush, STITCH));
  const collarStitch = [C(V(0, D + rw + STITCH), V(Hst.x * k, D + rw + STITCH), V(Hst.x, Hst.y + (D + rw - Hs.y) * (1 - k)), Hst)];
  pen.stitch(G.reverse(G.mirror(collarStitch)).concat(collarStitch));

  // Armhole topstitching, on the body side of the seam.
  const armStitch = G.trim(G.offset(seam, STITCH), 0.03, 0.93);
  pen.stitch(armStitch);
  pen.stitch(G.mirror(armStitch));

  // Patch pocket on the wearer's left chest: folded hem at the top, sides and bottom topstitched.
  if (spec.pocket) {
    const p = spec.pocket, x0 = p.cx - p.w / 2, x1 = p.cx + p.w / 2, y0 = p.top, y1 = p.top + p.h, rc = p.corner;
    pen.fill(G.corners([V(x0, y0), V(x1, y0), V(x1, y1), V(x0, y1)], [0, 0, rc, rc], true), fabric);
    const i = p.stitch;
    pen.stitch(G.corners([V(x0 + i, y0 + 2), V(x0 + i, y1 - i), V(x1 - i, y1 - i), V(x1 - i, y0 + 2)], [0, rc, rc, 0]));
    pen.stitch([L(V(x0 + 2.5, y0 + p.hem), V(x1 - 2.5, y0 + p.hem))]);
  }

  // Bottom hem: double-needle.
  for (const d of TWIN) pen.stitch([L(V(-(W - 3), hemY - d), V(W - 3, hemY - d))]);

  // Sleeves, and their double-needle hems.
  const lowDir = unit(sub(Hi, U));
  const sleeveHem = TWIN.map((d) => {
    const base = sub(Ho, mul(ax, d));
    const a = meet(S, topDir, base, across), b = meet(U, lowDir, base, across);
    return [L(add(a, mul(across, 3)), sub(b, mul(across, 3)))];
  });
  for (const m of [false, true]) {
    const f = m ? G.mirror : (ch) => ch;
    pen.fill(f(sleeve), fabric);
    for (const st of sleeveHem) pen.stitch(f(st));
  }

  // ---------- extent and anchors ----------
  const { top, w, h, body } = pen.finish();
  // The sleeve's centre line runs square to its hem from the hem's middle; the sleeve mark sits halfway along it,
  // between the armhole seam and the hem, turned so its top points up the arm to the shoulder.
  const hemMid = lerp(Ho, Hi, 0.5);
  const sleeveMid = lerp(G.hit(seam, hemMid, ax), hemMid, 0.5);
  const all = {
    chest: { x: spec.chest.x, y: spec.chest.y - top },
    leftSleeve: { x: sleeveMid.x, y: sleeveMid.y - top, rotate: sl.axis - 90 },
    // Centre front, at the height of the left-chest logo: for a design placed on the centre (the pocket tee's logo).
    centre: { x: 0, y: spec.chest.y - top },
  };
  const anchors = {};
  for (const n of spec.anchors) anchors[n] = all[n];
  return { name: spec.name, category: 'wear', w, h, body, anchors };
}

module.exports = { tee, SIZE_M };
