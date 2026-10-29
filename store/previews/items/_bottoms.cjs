// Shared tech flat for the fleece bottoms: sweatpants.cjs and shorts.cjs. Not an item itself: each of those calls
// bottoms(kit, spec) with its own size-M measurements.
//
// Front view, laid flat: an elastic rib waistband with a drawcord from two eyelets at the centre front, slanted side
// pockets, a centre front seam down to the crotch, and two legs that end in gathered rib cuffs (sweatpants) or a
// topstitched hem (shorts). Built for the wearer's left (+x) and mirrored, so both sides match exactly. y = 0 is the
// top of the waistband.
'use strict';
const G = require('./_bezier.cjs');
const { V, add, sub, mul, unit, lerp, turn, C, L } = G;

const STITCH = 6; // topstitching beside a seam, mm

// The outline of the right half, and the points the details hang on.
function shape(spec) {
  const { halfW: W, band: B } = spec.waist;
  const Hp = V(spec.hip.halfW, spec.hip.y);
  const Cr = V(0, spec.crotch);
  // Hip: from the waistband seam out to the widest point, leaving the band at hip.leave degrees from vertical.
  const leave = (spec.hip.leave * Math.PI) / 180;
  const hipDir = unit(spec.hip.dir);
  const hip = C(V(W, B), add(V(W, B), mul(V(Math.sin(leave), Math.cos(leave)), spec.hip.handles[0])), sub(Hp, mul(hipDir, spec.hip.handles[1])), Hp);
  const outseam = G.through([Hp, ...spec.outseam.points], hipDir, spec.outseam.end);
  const inseam = G.through([Cr, ...spec.inseam.points], spec.inseam.start, spec.inseam.end);
  const Ao = outseam.at(-1).d, Ai = inseam.at(-1).d; // where each seam reaches the cuff or hem
  const side = [hip, ...outseam];

  let bottom, cuff = null;
  if (spec.cuff) {
    // The leg gathers into a narrower rib cuff: each edge blouses in over blouseH and meets the cuff square.
    const c = spec.cuff, cx = (Ao.x + Ai.x) / 2, top = Math.max(Ao.y, Ai.y) + c.blouseH;
    const Ko = V(cx + c.width / 2, top), Ki = V(cx - c.width / 2, top);
    const outDir = unit(G.deriv(outseam.at(-1), 1)), inDir = unit(G.deriv(inseam.at(-1), 1));
    bottom = [
      C(Ao, add(Ao, mul(outDir, c.blouseH * 0.6)), add(Ko, V((Ao.x - Ko.x) * 0.75, -1)), Ko),
      L(Ko, Ki),
      C(Ki, add(Ki, V((Ai.x - Ki.x) * 0.75, -1)), add(Ai, mul(inDir, c.blouseH * 0.6)), Ai),
    ];
    const Bo = V(Ko.x - c.taper, top + c.height), Bi = V(Ki.x + c.taper, top + c.height);
    cuff = { cx, top, Ko, Ki, Bo, Bi, outline: G.corners([Ki, Ko, Bo, Bi], [0, 0, 4, 4], true) };
  } else {
    bottom = [L(Ao, Ai)];
  }
  const half = [L(V(0, B), V(W, B)), ...side, ...bottom, ...G.reverse(inseam)];
  return { W, B, Hp, Cr, hip, side, outseam, inseam, Ao, Ai, cuff, half };
}

function bottoms(kit, spec) {
  const pen = G.pen(kit);
  const { fabric, shade, rib } = kit.STYLE;
  const g = shape(spec);
  const { W, B, Cr, side, Ao, Ai, cuff } = g;
  const both = (fn, ch) => { fn(ch); fn(G.mirror(ch)); };

  // ---------- body and waistband ----------
  pen.fill(G.sym(g.half), fabric);
  const r = spec.waist.round;
  pen.fill(G.corners([V(-W, B), V(-W, 0), V(W, 0), V(W, B)], [0, r, r, 0], true), rib);
  pen.ribs(G.between([L(V(-W, 0), V(W, 0))], [L(V(-W, B), V(W, B))], G.RIB_PITCH));
  // Coverstitch below the waistband seam, across the body.
  {
    const y = B + STITCH, x = G.xAtY(side, y) - 4;
    pen.stitch([L(V(-x, y), V(x, y))]);
  }

  // ---------- centre front seam ----------
  pen.edge([L(V(0, B), Cr)]);

  // ---------- slanted side pockets: the opening runs from the waistband seam out to the side seam ----------
  {
    const p = spec.pocket;
    const Pa = V(p.x, B), Pb = V(G.xAtY(side, p.y), p.y);
    const along = sub(Pb, Pa), out = mul(turn(unit(along)), -p.bow); // bow: towards the side seam
    const opening = [C(Pa, add(lerp(Pa, Pb, 1 / 3), out), add(lerp(Pa, Pb, 2 / 3), out), Pb)];
    both(pen.edge, opening);
    both(pen.stitch, G.trimMM(G.offset(opening, STITCH), STITCH + 1, 5));
  }

  // ---------- leg ends ----------
  if (cuff) {
    const c = spec.cuff, { Ko, Ki, Bo, Bi } = cuff;
    for (const m of [false, true]) {
      const f = m ? G.mirror : (ch) => ch;
      pen.fill(f(cuff.outline), rib);
      pen.ribs(G.between(f([L(Ki, Ko)]), f([L(Bi, Bo)]), G.RIB_PITCH));
      pen.stitch(f([L(add(Ki, V(3, -STITCH)), add(Ko, V(-3, -STITCH)))]));
      // Gathers: the leg is wider than the cuff, so the fabric folds in just above it. Each fold rises from the cuff
      // and leans out a little, away from the middle of the leg.
      pen.folds(c.gathers.map(([fx, fy]) => {
        const a = V(cuff.cx + fx * c.width, cuff.top - STITCH - 2.5), rise = c.blouseH * fy;
        const d = add(a, V(fx * rise * 0.55, -rise));
        return f([C(a, add(a, V(0, -rise * 0.45)), add(d, V(-fx * rise * 0.2, rise * 0.3)), d)]);
      }));
    }
  } else {
    // Hem: folded up and topstitched, parallel to the hem edge.
    const hemDir = unit(sub(Ai, Ao)), up = turn(hemDir); // up: into the leg
    const base = add(Ao, mul(up, spec.hem.depth));
    const a = G.meet(Ao, unit(G.deriv(g.outseam.at(-1), 1)), base, hemDir);
    const b = G.meet(Ai, unit(G.deriv(g.inseam.at(-1), 1)), base, hemDir);
    both(pen.stitch, [L(add(a, mul(hemDir, 3)), sub(b, mul(hemDir, 3)))]);
  }

  // ---------- drawcord, last: it hangs over everything ----------
  {
    const { x, y, length: lc, width: cw, drift, tip } = spec.cord;
    const E = V(x, y), end = add(E, V(drift, lc));
    const centre = [C(E, add(E, V(0, lc * 0.35)), add(E, V(drift, lc * 0.6)), end)];
    const l = G.offset(centre, cw / 2, 3), rr = G.offset(centre, -cw / 2, 3);
    const cord = l.concat([L(l.at(-1).d, rr.at(-1).d)], G.reverse(rr), [L(rr[0].a, l[0].a)]);
    const aglet = G.corners([V(end.x - cw / 2 + 0.8, end.y - 3), V(end.x + cw / 2 - 0.8, end.y - 3), V(end.x + cw / 2 - 1.2, end.y + tip), V(end.x - cw / 2 + 1.2, end.y + tip)], [0, 0, 2.5, 2.5], true);
    for (const m of [false, true]) {
      const f = m ? G.mirror : (ch) => ch;
      pen.fill(f(cord), fabric);
      pen.fill(f(aglet), shade);
      const e = m ? G.flip(E) : E;
      pen.circle(e, 5, rib);
      pen.circle(e, 2.1, shade);
    }
  }

  // ---------- extent and anchor ----------
  const { top, w, h, body } = pen.finish();
  let leg;
  if (spec.leftLeg.below !== undefined) {
    // Upper front of the left leg: a set distance below the waistband, centred between the front seam and the side.
    const y = B + spec.leftLeg.below;
    leg = { x: G.xAtY(side, y) / 2, y };
  } else {
    // Lower front of the left leg: a set distance above the hem, centred between the inseam and the outseam.
    const mid = lerp(Ao, Ai, 0.5), y = mid.y - spec.leftLeg.above;
    leg = { x: (G.xAtY(side, y) + G.xAtY(g.inseam, y)) / 2, y };
  }
  return { name: spec.name, category: 'wear', w, h, body, anchors: { leftLeg: { x: leg.x, y: leg.y - top, rotate: 0 } } };
}

module.exports = { bottoms, shape };
