// Quarter-zip pullover, front view. Size M: 560 mm wide, 720 mm from the HPS to the hem. A stand-up collar 70 mm tall,
// zipped up; the zip runs 230 mm down the centre front from the collar's top edge, its slider at the top and the pull
// hanging from it. Set-in long sleeves with rib cuffs, a rib hem band, no hood, no pocket. The blank isn't picked yet:
// these are typical size-M measurements for a fleece quarter-zip.
//
// Drawn the way _top.cjs draws the fleece tops (crewneck, hoodie): the same shoulder, armhole and sleeve construction,
// rib cuffs and hem band, line weights and stitching. It doesn't call top(), whose necklines are a crew collar and a
// hood; the zip is drawn as on the anorak. Built with the helpers in _bezier.cjs, for the wearer's left (+x) and
// mirrored, with y = 0 at the high point of the shoulder (HPS); the result is moved so the top of the collar is at
// y = 0, as kit.compose expects.
'use strict';
const G = require('./_bezier.cjs');
const { V, add, sub, mul, len, unit, lerp, turn, meet, C, L, KAPPA } = G;

const STITCH = 6;                      // topstitching beside a seam, mm (as on the fleece tops)
const RIB = G.RIB_PITCH;               // mm between rib lines
const down = (deg) => V(Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)); // deg from vertical, + is outwards

const SIZE_M = {
  width: 560,                          // flat chest, side seam to side seam
  length: 720,                         // HPS to hem
  neck: { halfW: 98, drop: 74 },       // the collar seam: half-width at the HPS, depth at the centre front
  // The collar stands `height` mm above its seam all round. Its sides lean in `lean` mm towards the top and turn into
  // the top edge in a round of `corner` mm. Across the back, the top edge is `sag` mm lower at the centre back than at
  // the sides; across the front it dips to the zip, and between the two the inside of the back of the collar shows.
  collar: { height: 70, lean: 13, corner: 7, sag: 5 },
  zip: { length: 230, halfW: 11, teeth: 3, pitch: 5 }, // from the collar's top edge; placket half-width; chain
  shoulder: { x: 243, y: 46 },
  armhole: { underarm: { x: 283, y: 258 }, pit: { x: 246, y: 233 } },
  sleeve: { angle: 18, topW: 110, round: 0.9, length: 610, cuffW: 94, cuffH: 60, blouse: 6, blouseH: 18 },
  hem: { h: 60, halfW: 263, blouse: 45 },
  chest: { x: 95, y: 190 },            // the OFF SHFT logo, on the wearer's left chest, clear of the zip
};

module.exports = (kit, spec = SIZE_M) => {
  const pen = G.pen(kit);
  const { fabric, shade, rib } = kit.STYLE;
  const same = (ch) => ch;

  // ---------- collar ----------
  const { halfW: R, drop: D } = spec.neck;
  const cl = spec.collar;
  const Hs = V(R, 0);                                  // HPS: the collar seam on the shoulder line
  const N = V(0, D);                                   // the collar seam at the centre front
  const neckSeam = [C(N, V(R * 0.6, D), V(R, D * 0.42), Hs)];
  // The collar's outline, from the HPS: up its side to the top corner, round the corner and across the back's top edge
  // to the centre back. The front's top edge leaves the outline at the fold, halfway round the corner, and dips to the
  // centre front, where the zip starts.
  const Tc = V(R - cl.lean, -cl.height);               // the top corner, before it is rounded
  const up = unit(sub(Tc, Hs)), inward = unit(V(-1, 0.06));
  const A = sub(Tc, mul(up, cl.corner)), B = add(Tc, mul(inward, cl.corner));
  const side = L(Hs, A);
  const [roundLow, roundHigh] = G.split(C(A, add(A, mul(up, cl.corner * KAPPA)), sub(B, mul(inward, cl.corner * KAPPA)), B), 0.5);
  const fold = roundLow.d;
  const yB = -cl.height + cl.sag;                      // top edge at the centre back
  const backTop = C(B, add(B, mul(inward, B.x * 0.3)), V(B.x * 0.4, yB), V(0, yB));
  const outline = [side, roundLow, roundHigh, backTop];
  const yF = D - cl.height;                            // top edge at the centre front
  const frontTop = C(V(0, yF), V(R * 0.5, yF), add(fold, mul(unit(V(-0.32, 1)), 34)), fold);

  // ---------- body ----------
  const W = spec.width / 2;
  const hemBottom = spec.length;
  const hemSeam = hemBottom - spec.hem.h;
  const S = V(spec.shoulder.x, spec.shoulder.y);
  const ush = unit(sub(S, Hs));
  const U = V(spec.armhole.underarm.x, spec.armhole.underarm.y);
  const P = V(spec.armhole.pit.x, spec.armhole.pit.y);
  const bandW = spec.hem.halfW;
  const armholeBody = C(S, add(S, mul(turn(ush), 0.45 * len(sub(U, S)))), sub(U, V(18, 40)), U);
  const sideTop = V(W, U.y + 30);
  const blouseStart = V(W, hemSeam - spec.hem.blouse);
  const sideSeam = [
    C(U, lerp(U, sideTop, 0.5), V(W, sideTop.y - 10), sideTop),
    L(sideTop, blouseStart),
    C(blouseStart, V(W, blouseStart.y + spec.hem.blouse * 0.55), V(bandW + (W - bandW) * 0.45, hemSeam), V(bandW, hemSeam)),
  ];
  const bodyHalf = neckSeam.concat([L(Hs, S), armholeBody], sideSeam, [L(V(bandW, hemSeam), V(0, hemSeam))]);

  // ---------- sleeve (right; the left is its mirror), as on the fleece tops ----------
  // The sleeve hangs at sl.angle from vertical. It is sl.topW across at the armpit and tapers in straight lines to the
  // cuff, where the fabric blouses a little over the rib. The outer edge meets the shoulder line in one smooth round.
  const sl = spec.sleeve;
  const ax = down(sl.angle);           // down the arm
  const nx = V(ax.y, -ax.x);           // across the arm, outwards
  const T = add(P, mul(nx, sl.topW));  // outer edge, across the arm from the armpit
  const ct = 2;                        // the rib narrows a little towards its edge
  const shape = (reachDown) => {
    const Ct = add(add(P, mul(nx, sl.topW / 2)), mul(ax, reachDown)); // centre of the cuff seam
    const Ko = add(Ct, mul(nx, sl.cuffW / 2)), Ki = sub(Ct, mul(nx, sl.cuffW / 2));
    const Kbo = add(sub(Ko, mul(ax, sl.blouseH)), mul(nx, sl.blouse));
    const Kbi = sub(sub(Ki, mul(ax, sl.blouseH)), mul(nx, sl.blouse));
    const uOut = unit(sub(Kbo, T));
    const X = meet(S, ush, T, uOut);    // where the shoulder line meets the outer edge, extended
    const leg = len(sub(X, S));
    const J = add(X, mul(uOut, leg * sl.round));
    const roundSeg = C(S, add(S, mul(ush, leg * 0.56)), sub(J, mul(uOut, leg * sl.round * 0.56)), J);
    const length = G.arc([roundSeg]) + len(sub(Kbo, J)) + len(sub(Ko, Kbo)) + sl.cuffH;
    return { Ct, Ko, Ki, Kbo, Kbi, uOut, J, roundSeg, length };
  };
  // Find how far down the arm the cuff sits for the sleeve length asked for (shoulder point to cuff edge).
  let lo = 100, hi = 1000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (shape(mid).length < sl.length) lo = mid;
    else hi = mid;
  }
  const { Ct, Ko, Ki, Kbo, Kbi, uOut, J, roundSeg } = shape(lo);
  const Cb = add(Ct, mul(ax, sl.cuffH));
  const Bo = add(Cb, mul(nx, sl.cuffW / 2 - ct)), Bi = sub(Cb, mul(nx, sl.cuffW / 2 - ct));
  const dIn = unit(sub(Kbi, P));
  const seamSP = C(S, add(S, mul(turn(ush), 0.42 * len(sub(P, S)))), sub(P, mul(unit(V(0.42, 1)), 0.32 * len(sub(P, S)))), P);
  const sleeve = [
    roundSeg,
    L(J, Kbo),
    C(Kbo, add(Kbo, mul(uOut, sl.blouseH * 0.6)), add(Ko, add(mul(nx, sl.blouse * 0.75), mul(ax, -1))), Ko),
    L(Ko, Ki),
    C(Ki, add(Ki, add(mul(nx, -sl.blouse * 0.75), mul(ax, -1))), add(Kbi, mul(dIn, sl.blouseH * 0.6)), Kbi),
    L(Kbi, P),
    ...G.reverse([seamSP]),
  ];
  const cuff = G.corners([Ki, Ko, Bo, Bi], [0, 0, 4, 4], true);

  // ---------- draw, back to front ----------
  // The whole collar, filled with the inside of its back, which shows above the front.
  pen.fill(G.sym(G.reverse(outline).concat(G.reverse(neckSeam))), shade);

  pen.fill(G.sym(bodyHalf), fabric);
  // Topstitching below the collar seam, on the body.
  const neckStitch = G.trimMM(G.offset(neckSeam, STITCH), 0, 3);
  pen.stitch(G.reverse(G.mirror(neckStitch)).concat(neckStitch));

  // The front of the collar, from its seam up to the top edge, which dips to the zip at the centre front.
  pen.fill(G.sym([frontTop].concat(G.reverse([side, roundLow]), G.reverse(neckSeam))), fabric);

  // Hem band.
  pen.fill(G.corners([V(-bandW, hemSeam), V(bandW, hemSeam), V(bandW - ct, hemBottom), V(-(bandW - ct), hemBottom)], [0, 0, 5, 5], true), rib);
  pen.ribs(G.between([L(V(-bandW, hemSeam), V(bandW, hemSeam))], [L(V(-(bandW - ct), hemBottom), V(bandW - ct, hemBottom))], RIB * 1.15));
  // Hem stitch, just above the band, across the body.
  {
    const y = hemSeam - STITCH, x = G.xAtY(sideSeam, y) - 4;
    pen.stitch([L(V(-x, y), V(x, y))]);
  }

  // Sleeves and cuffs.
  for (const f of [same, G.mirror]) {
    pen.fill(f(sleeve), fabric);
    pen.fill(f(cuff), rib);
    pen.ribs(G.between(f([L(Ki, Ko)]), f([L(Bi, Bo)]), RIB));
    pen.stitch(f([L(add(Ki, add(mul(ax, -6), mul(nx, 3))), add(Ko, add(mul(ax, -6), mul(nx, -3))))]));
    pen.stitch(f(G.trim(G.offset([seamSP], STITCH), 0.02, 0.9)));
  }

  // The zip, as on the anorak: a narrow placket from the collar's top edge, stitched down both sides and boxed across
  // the foot, the chain down its middle, and the slider at the top with its pull hanging down. A bar-tack (drawn as the
  // polo's are, a short line) across the placket below the chain's bottom stop holds the foot of the opening.
  {
    const z = spec.zip, hw = z.halfW;
    const zipTop = G.hit([frontTop], V(hw, 0), V(0, 1)).y;
    const zipEnd = zipTop + z.length;
    const sx = hw - 3.5, sy = zipEnd - 3.5;
    pen.fill(G.corners([V(-hw, zipTop), V(hw, zipTop), V(hw, zipEnd), V(-hw, zipEnd)], [0, 0, 3, 3], true), fabric);
    pen.stitch(G.corners([V(-sx, zipTop + 3), V(-sx, sy), V(sx, sy), V(sx, zipTop + 3)], [0, 2.5, 2.5, 0]));
    const chainEnd = zipEnd - 11;
    const teeth = [];
    for (let y = zipTop + 16; y < chainEnd - 2; y += z.pitch) teeth.push([V(-z.teeth, y), V(z.teeth, y)]);
    pen.ribs(teeth);
    pen.edge([L(V(0, zipTop), V(0, chainEnd))]);
    pen.edge([L(V(-z.teeth, chainEnd), V(z.teeth, chainEnd))]); // bottom stop
    pen.edge([L(V(-(sx - 3), chainEnd + 3.5), V(sx - 3, chainEnd + 3.5))]); // bar-tack, clear of the stitching
    pen.fill(G.corners([V(-3.5, zipTop + 8), V(3.5, zipTop + 8), V(5, zipTop + 36), V(-5, zipTop + 36)], [1, 1, 4.5, 4.5], true), shade);
    pen.fill(G.corners([V(-6, zipTop - 2), V(6, zipTop - 2), V(5, zipTop + 12), V(-5, zipTop + 12)], [2, 2, 3, 3], true), shade);
  }

  // ---------- extent and anchors ----------
  const { top, w, h, body } = pen.finish();
  return {
    name: 'quarter-zip',
    category: 'wear',
    w,
    h,
    body,
    // Only the left chest. There is no big centre-front spot: the zip runs down the centre front (noBigFront below), so
    // Punched Out. goes on the chest as the centred stack (63.6 mm); the one line would leave 2 mm each side of the 4 in
    // area (designs/09-punched-out/v3/notes.md).
    anchors: { chest: { x: spec.chest.x, y: spec.chest.y - top } },
    noBigFront: true,   // the zip runs down the centre front
  };
};
module.exports.SIZE_M = SIZE_M;
