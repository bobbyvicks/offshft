// Golf polo, front view; polo-back.cjs is the same drawing seen from behind. Size M, unisex, classic fit: 540 mm wide,
// 730 mm from the HPS to the front hem, the back hem 25 mm lower (a drop tail) with short side vents. Flat knit collar
// on a stand, a three-button placket 150 mm long, set-in short sleeves with flat knit cuffs, twin-needle hem, no pocket.
// The logo goes on the wearer's left chest (chest); on the back view the clock goes on the centre back below the
// collar (backNeck).
//
// Built like the tees (_tee.cjs), with the same helpers (_bezier.cjs): for the wearer's left (+x) and mirrored, y = 0 at
// the HPS, then moved so the top of the drawing, the collar's fold at the centre back, is at y = 0. Both views come
// from polo() below, so their outlines match. The front shows the drop tail below its hem (the inside of the back) and,
// through the neck, the inside of the collar stand; the back shows the collar from behind, with the back neck tape's
// stitching just below it. The shoulder seams are the outline along the top of the shoulders, as on the tees.
'use strict';
const G = require('./_bezier.cjs');
const { V, add, sub, mul, len, unit, lerp, turn, dir, meet, C, L } = G;

const STITCH = 6;      // topstitching beside a seam, mm (as on the tees)
const TWIN = [15, 21]; // twin-needle hems: the two rows of stitching, mm in from the folded edge (as on the tees)
// The collar and the cuffs are the same flat knit, so both are drawn plain: trim fill, no rib lines. Ribbed, the collar
// reads from behind as a crew neck's band.

const SIZE_M = {
  width: 540,                              // flat chest, side seam to side seam
  length: 730,                             // HPS to the front hem
  tail: 25,                                // the back hem hangs this much lower (drop tail)
  vent: 40,                                // side vents, up from the front hem (the back's are tail + vent long)
  splay: 7,                                // the front's vent edges part from the back's this much at the front hem
  neck: { halfW: 88, drop: 76, back: 19 }, // neck seam: half-width at the HPS; drop at the centre front (placket top), back
  // Flat knit collar: stand and fall at the centre back; its outer edge crosses the shoulder line `spread` mm out from
  // the HPS; the point, where the outer edge meets the collar's front end.
  collar: { stand: 33, fall: 46, spread: 40, point: { x: 82, y: 112 } },
  // Placket: half-width and length from the neck seam; the buttons' centres below its top, and their radius.
  placket: { halfW: 15, length: 150, buttons: [15, 65, 115], button: 6 },
  shoulder: { x: 236, y: 46 },             // shoulder point, where the sleeve is set in
  underarm: 255,                           // the armhole meets the side seam this far below the HPS
  // Sleeve, as on the tees: long axis 30° below horizontal, top edge 28°, 215 mm from the shoulder point to the cuff's
  // edge, 158 mm across where the cuff is sewn on, the shoulder running into the sleeve in a round of 32 mm. Flat knit
  // cuff 24 mm deep, 2 mm narrower each side at its edge.
  sleeve: { axis: 30, top: 28, length: 215, opening: 158, round: 32, cuff: 24, taper: 2 },
  chest: { x: 95, y: 190 },                // the wearer's left chest logo
  backMark: 45,                            // the back mark's centre, this far below the back neck seam
  tape: 4,                                 // the back neck tape's row of stitching, this far below the collar's edge
};

// Where a segment reaches x (or y) = v, as a parameter; the segment must run one way in that coordinate.
function tAt(s, k, v) {
  const up = G.pt(s, 1)[k] > G.pt(s, 0)[k];
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((G.pt(s, mid)[k] < v) === up) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// A chain cut in two where it first crosses the line through p along u.
function cutAcross(ch, p, u) {
  const side = (s, t) => G.cross(u, sub(G.pt(s, t), p));
  for (let i = 0; i < ch.length; i++) {
    const s = ch[i], n = 64;
    for (let j = 1; j <= n; j++) {
      let lo = (j - 1) / n, hi = j / n;
      if (side(s, lo) * side(s, hi) > 0) continue;
      for (let it = 0; it < 50; it++) {
        const mid = (lo + hi) / 2;
        if (side(s, lo) * side(s, mid) <= 0) hi = mid;
        else lo = mid;
      }
      const [a, b] = G.split(s, (lo + hi) / 2);
      return [ch.slice(0, i).concat([a]), [b].concat(ch.slice(i + 1))];
    }
  }
  throw new Error('chain never crosses the line');
}

function polo(kit, view, spec = SIZE_M) {
  const behind = view === 'back';
  const pen = G.pen(kit);
  const { fabric, shade, rib } = kit.STYLE;
  const same = (ch) => ch;
  const W = spec.width / 2;
  const frontHem = spec.length, backHem = spec.length + spec.tail;
  const hemY = behind ? backHem : frontHem;
  const ventTop = frontHem - spec.vent;

  // ---------- neck and collar ----------
  const { halfW: R, drop: D, back: bd } = spec.neck;
  const H = V(R, 0);                               // HPS: the neck seam on the shoulder line
  const S = V(spec.shoulder.x, spec.shoulder.y);
  const ush = unit(sub(S, H));                     // along the shoulder line, outwards
  const N = V(0, D);                               // the neck seam at the centre front: the top of the placket
  const k = 0.58;
  const frontNeck = [C(N, V(R * k, D), V(R, D * (1 - k)), H)];
  const backNeck = [C(V(0, bd), V(R * 0.55, bd), V(R * 0.95, bd * 0.45), H)];
  const cl = spec.collar;
  const top = bd - cl.stand;                       // the collar's fold at the centre back: the top of the drawing
  const A = sub(H, mul(ush, 4));                   // the fold comes down to the shoulder line just inside the HPS
  const O = add(H, mul(ush, cl.spread));           // the collar's outer edge crosses the shoulder line
  const P = V(cl.point.x, cl.point.y);
  // The fold across the back of the neck, from the centre back down to the shoulder line. Between A and O the collar
  // lies over the shoulder, so there its top is the shoulder line.
  const fold = C(V(0, top), V(A.x * 0.55, top), sub(A, mul(dir(30), A.x * 0.22)), A);
  // Front leaves: each folds over along its roll line, from the centre front up to A, where the fold carries on round
  // the back; the outer edge runs from the shoulder down to the point, the front end from the point back to the centre.
  const roll = C(N, add(N, mul(unit(V(0.42, -1)), 30)), sub(A, mul(unit(V(0.18, -1)), 34)), A);
  const outer = C(O, add(O, V(-1, 32)), add(P, V(6, -32)), P);
  const end = C(P, lerp(P, N, 1 / 3), add(lerp(P, N, 2 / 3), V(0, 1.5)), N);
  const leaf = [roll, L(A, O), outer, end];
  // Inside the neck, between the leaves: the back collar stand down to the back neck seam, which meets the roll line at X.
  const [rollLow, rollHigh] = G.split(roll, tAt(roll, 'y', 4));
  const X = rollLow.d;
  const backSeamIn = [C(V(0, bd), V(X.x * 0.55, bd), V(X.x * 0.94, X.y + (bd - X.y) * 0.45), X)];
  // From behind: the fall, from the fold down to its outer edge, which comes off the shoulder at O and round the back.
  const fallY = top + cl.fall;
  const outerBack = C(O, add(O, V(-7, 16)), V(R * 0.7, fallY), V(0, fallY));

  // ---------- shoulder round, armhole and sleeve (as on the tees) ----------
  const sl = spec.sleeve;
  const ax = dir(sl.axis);            // the sleeve's long axis, shoulder to cuff
  const across = turn(ax);            // across the sleeve, from its top edge to its underarm edge
  const topDir = dir(sl.top);
  const r = sl.round;
  const F1 = sub(S, mul(ush, r)), F2 = add(S, mul(topDir, r));
  const [roundIn, roundOut] = G.split(C(F1, add(F1, mul(ush, r * 0.55)), sub(F2, mul(topDir, r * 0.55)), F2), 0.5);
  const M = roundIn.d;                // the armhole seam starts on the round
  const U = V(W, spec.underarm);      // underarm: armhole meets side seam
  const depth = len(sub(U, M));
  const seam = [C(M, add(M, mul(turn(ush), depth * 0.3)), sub(U, mul(unit(V(0.22, 1)), depth * 0.3)), U)];
  const edge = add(S, mul(topDir, sl.length));                     // the cuff's edge, on the line of the top edge
  const Ko = meet(S, topDir, sub(edge, mul(ax, sl.cuff)), across); // cuff seam, outer end
  const Ki = add(Ko, mul(across, sl.opening));                     // cuff seam, underarm end
  const Co = add(add(Ko, mul(ax, sl.cuff)), mul(across, sl.taper));
  const Ci = sub(add(Ki, mul(ax, sl.cuff)), mul(across, sl.taper));
  const sleeve = [roundOut, L(F2, Ko), L(Ko, Ki), L(Ki, U), ...G.reverse(seam)];
  const cuff = G.corners([Ko, Co, Ci, Ki], [0, 3, 3, 0], true);
  const lowDir = unit(sub(Ki, U));
  const above = sub(Ko, mul(ax, STITCH));                          // stitching just above the cuff seam
  const cuffStitch = [L(add(meet(S, topDir, above, across), mul(across, 3)),
    sub(meet(U, lowDir, above, across), mul(across, 3)))];

  // Side seams down to the vents. Below the vent tops the front's edges part a little from the back's, which carry
  // straight on down to the back hem: the front view shows the back between them, the back view hides the front.
  const splay = behind ? 0 : spec.splay;
  const sideX = (y) => W - (y > ventTop ? (splay * (y - ventTop)) / (frontHem - ventTop) : 0); // the side edge at y
  const bodyHalf = (behind ? backNeck : frontNeck).concat([L(H, F1), roundIn], seam,
    G.corners([U, V(W, ventTop), V(sideX(hemY), hemY), V(0, hemY)], [0, 0, 4, 0]));

  // ---------- draw, back to front ----------
  if (!behind) {
    // The drop tail, below the front hem: the inside of the back.
    pen.fill(G.corners([V(W, ventTop), V(W, backHem), V(-W, backHem), V(-W, ventTop)], [0, 4, 4, 0], true), shade);
    // Through the neck: the inside of the back, and the inside of the collar stand.
    pen.fill(G.sym([fold, ...G.reverse([roll])]), shade);
    pen.fill(G.sym([fold, ...G.reverse([rollHigh]), ...G.reverse(backSeamIn)]), rib);
  }

  pen.fill(G.sym(bodyHalf), fabric);

  // Armhole topstitching, on the body side of the seam.
  const armStitch = G.trim(G.offset(seam, STITCH), 0.03, 0.93);
  pen.stitch(armStitch);
  pen.stitch(G.mirror(armStitch));

  if (!behind) {
    // Placket: stitched down both sides and boxed across the foot; three buttons, each sewn on with a cross.
    const pk = spec.placket, hw = pk.halfW, foot = D + pk.length, sx = hw - 3.5;
    pen.fill(G.corners([V(-hw, D), V(hw, D), V(hw, foot), V(-hw, foot)], [0, 0, 3, 3], true), fabric);
    pen.stitch(G.corners([V(-sx, D + 2), V(-sx, foot - 3.5), V(sx, foot - 3.5), V(sx, D + 2)], [0, 2.5, 2.5, 0]));
    pen.stitch([L(V(-sx, foot - 12), V(sx, foot - 12))]);
    for (const b of pk.buttons) {
      const c = V(0, D + b), a = pk.button * 0.33;
      pen.circle(c, pk.button, rib);
      pen.stitch([L(sub(c, V(a, a)), add(c, V(a, a)))]);
      pen.stitch([L(add(c, V(-a, a)), add(c, V(a, -a)))]);
    }
    // The collar's front leaves, over the top of the placket.
    for (const f of [same, G.mirror]) pen.fill(f(leaf), rib);
  } else {
    // The back neck tape crosses the back between the shoulder seams, under the collar: one row of its stitching shows
    // just below the collar's edge, from shoulder to shoulder, stopping 3 mm short of the shoulder line where the edge
    // comes off it. It doesn't run on along the shoulders.
    const row = G.offset([outerBack], -spec.tape);                         // from the shoulder in to the centre back
    const [, tapeRow] = cutAcross(row, add(H, mul(turn(ush), 3)), ush);
    pen.stitch(G.mirror(tapeRow).concat(G.reverse(tapeRow)));
    // The collar from behind: the fall, folded down over its stand.
    pen.fill(G.sym([fold, L(A, O), outerBack]), rib);
  }

  // Hem, twin-needle; the side vents, bar-tacked at the top and stitched down their edges.
  for (const d of TWIN) {
    const y = hemY - d, x = sideX(y) - 3;
    pen.stitch([L(V(-x, y), V(x, y))]);
  }
  for (const f of [same, G.mirror]) {
    pen.edge(f([L(V(W - 7, ventTop), V(W, ventTop))]));
    const y0 = ventTop + 3, y1 = hemY - TWIN[1];
    pen.stitch(f([L(V(sideX(y0) - STITCH, y0), V(sideX(y1) - STITCH, y1))]));
  }

  // Sleeves and their flat knit cuffs, plain like the collar, topstitched on the sleeve above the cuff seam.
  for (const f of [same, G.mirror]) {
    pen.fill(f(sleeve), fabric);
    pen.fill(f(cuff), rib);
    pen.stitch(f(cuffStitch));
  }

  // ---------- extent and anchors ----------
  const { top: minY, w, h, body } = pen.finish();
  // The sleeve mark (the clock, on the polos with no back embroidery) sits halfway along the sleeve's centre line,
  // between the armhole seam and the cuff seam, turned so its top points up the arm, as on the tees.
  const cuffMid = lerp(Ko, Ki, 0.5);
  const sleeveMid = lerp(G.hit(seam, cuffMid, ax), cuffMid, 0.5);
  const anchors = behind
    ? { backNeck: { x: 0, y: bd + spec.backMark - minY } }
    : {
      chest: { x: spec.chest.x, y: spec.chest.y - minY },
      leftSleeve: { x: sleeveMid.x, y: sleeveMid.y - minY, rotate: sl.axis - 90 },
    };
  // noBigFront: the placket runs down the centre front, so no big centred design goes there.
  return { name: behind ? 'polo-back' : 'polo', category: 'wear', w, h, body, anchors, noBigFront: true };
}

module.exports = (kit) => polo(kit, 'front');
module.exports.polo = polo;
module.exports.SIZE_M = SIZE_M;
