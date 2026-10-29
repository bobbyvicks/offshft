// Shared tech-flat drawing for the fleece tops: crewneck, crewneck-oversized, hoodie and hoodie-oversized.
// Not an item itself: each of those item files calls top(kit, spec) with its own size-M measurements.
//
// Everything is drawn for the wearer's left (+x) and mirrored, so both sides match exactly. Shapes are built in
// drawing mm with y = 0 at the high point of the shoulder (HPS); the result is shifted so the top of the drawing
// (the HPS on a crew, the crown of the hood on a hoodie) sits at y = 0, as kit.compose expects.
'use strict';

// ---------- vectors ----------
const V = (x, y) => ({ x, y });
const add = (a, b) => V(a.x + b.x, a.y + b.y);
const sub = (a, b) => V(a.x - b.x, a.y - b.y);
const mul = (a, k) => V(a.x * k, a.y * k);
const len = (a) => Math.hypot(a.x, a.y);
const unit = (a) => mul(a, 1 / len(a));
const lerp = (a, b, t) => V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const turn = (a) => V(-a.y, a.x); // a quarter turn to the right of the direction of travel, as seen on screen
const down = (deg) => V(Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)); // deg from vertical, + is outwards
const KAPPA = 0.5523; // handle length of a quarter circle

// ---------- cubic Bézier segments {a, b, c, d} and chains of them ----------
const C = (a, b, c, d) => ({ a, b, c, d });
const L = (a, d) => C(a, lerp(a, d, 1 / 3), lerp(a, d, 2 / 3), d);
function pt(s, t) {
  const u = 1 - t, k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t;
  return V(k0 * s.a.x + k1 * s.b.x + k2 * s.c.x + k3 * s.d.x, k0 * s.a.y + k1 * s.b.y + k2 * s.c.y + k3 * s.d.y);
}
function split(s, t) {
  const ab = lerp(s.a, s.b, t), bc = lerp(s.b, s.c, t), cd = lerp(s.c, s.d, t);
  const abc = lerp(ab, bc, t), bcd = lerp(bc, cd, t), m = lerp(abc, bcd, t);
  return [C(s.a, ab, abc, m), C(m, bcd, cd, s.d)];
}
const mirror = (ch) => ch.map((s) => C(V(-s.a.x, s.a.y), V(-s.b.x, s.b.y), V(-s.c.x, s.c.y), V(-s.d.x, s.d.y)));
const reverse = (ch) => ch.slice().reverse().map((s) => C(s.d, s.c, s.b, s.a));
// A right half that runs from the centre line back to the centre line, closed through its mirror image.
const sym = (half) => half.concat(reverse(mirror(half)));

function samples(ch, per = 48) {
  const out = [ch[0].a];
  for (const s of ch) for (let i = 1; i <= per; i++) out.push(pt(s, i / per));
  return out;
}
function arc(ch) {
  const p = samples(ch);
  let l = 0;
  for (let i = 1; i < p.length; i++) l += len(sub(p[i], p[i - 1]));
  return l;
}
// Points at the given fractions of a chain's length.
function along(ch, fracs) {
  const p = samples(ch, 96), cum = [0];
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + len(sub(p[i], p[i - 1])));
  const total = cum[cum.length - 1];
  return fracs.map((f) => {
    const target = f * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    return lerp(p[i - 1], p[i], (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1));
  });
}
// x where a chain first crosses height y.
function xAtY(ch, y) {
  const p = samples(ch, 128);
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i];
    if ((a.y - y) * (b.y - y) <= 0 && a.y !== b.y) return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
  }
  throw new Error(`chain never reaches y = ${y}`);
}
// Derivative of a segment.
function deriv(s, t) {
  const u = 1 - t;
  const k0 = 3 * u * u, k1 = 6 * u * t, k2 = 3 * t * t;
  return V(k0 * (s.b.x - s.a.x) + k1 * (s.c.x - s.b.x) + k2 * (s.d.x - s.c.x), k0 * (s.b.y - s.a.y) + k1 * (s.c.y - s.b.y) + k2 * (s.d.y - s.c.y));
}
// A parallel curve, dist mm to the right of the direction of travel. Each segment is cut in parts, and each part is
// replaced by the cubic that matches the true parallel curve's end points and end derivatives (a Hermite fit).
function offset(ch, dist, parts = 6) {
  const at = (s, t) => {
    let d = deriv(s, t);
    if (len(d) < 1e-9) d = sub(s.d, s.a);
    return add(pt(s, t), mul(turn(unit(d)), dist));
  };
  const off = (s) => {
    const h = 1e-4;
    const a = at(s, 0), d = at(s, 1);
    const da = mul(sub(at(s, h), a), 1 / h), dd = mul(sub(d, at(s, 1 - h)), 1 / h);
    return C(a, add(a, mul(da, 1 / 3)), sub(d, mul(dd, 1 / 3)), d);
  };
  const out = [];
  for (const s of ch) {
    let rest = s;
    for (let i = parts; i > 1; i--) {
      const [head, tail] = split(rest, 1 / i);
      out.push(off(head));
      rest = tail;
    }
    out.push(off(rest));
  }
  return out;
}
// Cut a chain where it first crosses x = x0 (ignoring its very start), keeping the part before.
function cutAtX(ch, x0) {
  for (let i = 0; i < ch.length; i++) {
    const s = ch[i], f = (t) => pt(s, t).x - x0, n = 96;
    for (let k = 1; k <= n; k++) {
      let lo = (k - 1) / n, hi = k / n;
      if (i === 0 && k === 1) lo = 1e-4;
      if (f(lo) * f(hi) > 0) continue;
      for (let it = 0; it < 50; it++) {
        const mid = (lo + hi) / 2;
        if (f(lo) * f(mid) <= 0) hi = mid;
        else lo = mid;
      }
      const head = split(s, (lo + hi) / 2)[0];
      head.d = V(x0, head.d.y);
      return ch.slice(0, i).concat([head]);
    }
  }
  return ch;
}
// Trim a chain to the part between two fractions of its length (approximately, by segment parameter).
function trim(ch, from, to) {
  const total = arc(ch);
  const out = [];
  let acc = 0;
  for (const s of ch) {
    const l = arc([s]);
    const a = Math.max(0, (from * total - acc) / l), b = Math.min(1, (to * total - acc) / l);
    acc += l;
    if (b <= 0 || a >= 1 || b <= a) continue;
    let seg = s;
    if (b < 1) seg = split(seg, b)[0];
    if (a > 0) seg = split(seg, a / b)[1];
    out.push(seg);
  }
  return out;
}
// Closed outline through corner points, each corner rounded with its own radius (0 = sharp).
function rounded(points, radii) {
  const n = points.length, ins = [], outs = [];
  for (let i = 0; i < n; i++) {
    const p = points[i], r = radii[i];
    const u = unit(sub(p, points[(i + n - 1) % n])), v = unit(sub(points[(i + 1) % n], p));
    ins.push(sub(p, mul(u, r)));
    outs.push(add(p, mul(v, r)));
  }
  const ch = [];
  for (let i = 0; i < n; i++) {
    const p = points[i], r = radii[i];
    if (r > 0) {
      const u = unit(sub(p, points[(i + n - 1) % n])), v = unit(sub(points[(i + 1) % n], p));
      ch.push(C(ins[i], add(ins[i], mul(u, r * KAPPA)), sub(outs[i], mul(v, r * KAPPA)), outs[i]));
    }
    ch.push(L(outs[i], ins[(i + 1) % n]));
  }
  return ch.filter((s) => len(sub(s.d, s.a)) > 1e-6);
}

// ---------- SVG ----------
const num = (v) => String(Math.round(v * 100) / 100);
const xy = (p) => `${num(p.x)} ${num(p.y)}`;
function pathD(ch, close = false) {
  let out = `M${xy(ch[0].a)}`;
  for (const s of ch) out += `C${xy(s.b)} ${xy(s.c)} ${xy(s.d)}`;
  return out + (close ? 'Z' : '');
}

// Rib lines are drawn with the kit's outline, lightened so they read as fine texture and not as edges.
const RIB_OPACITY = 0.4;
const RIB_PITCH = 9; // mm between rib lines

module.exports = function top(kit, spec) {
  const s = kit.strokes(kit.WEAR_PX);
  const { fabric, shade, rib } = kit.STYLE;
  const svg = [];
  const bounds = [];
  const fill = (ch, colour) => {
    bounds.push(ch);
    svg.push(`<path d="${pathD(ch, true)}" ${s.fill(colour)}/>`);
  };
  const edge = (ch) => svg.push(`<path d="${pathD(ch)}" ${s.outline}/>`);
  const stitch = (ch) => svg.push(`<path d="${pathD(ch)}" ${s.stitch}/>`);
  const both = (fn, ch) => { fn(ch); fn(mirror(ch)); };
  const ribLines = (pairs) => svg.push(`<path d="${pairs.map(([a, b]) => `M${xy(a)}L${xy(b)}`).join('')}" ${s.outline} stroke-opacity="${RIB_OPACITY}"/>`);
  const mirrorPairs = (pairs) => pairs.concat(pairs.map(([a, b]) => [V(-a.x, a.y), V(-b.x, b.y)]));
  // Rib lines between two rails, evenly spaced along them. Whole bands put a line every pitch between their ends;
  // half bands that start on the centre line ('half') start half a pitch from it, so that once mirrored the spacing
  // runs on evenly across the centre. skipEnd drops lines at the far end, where a band tapers to nothing.
  const between = (railA, railB, pitch = RIB_PITCH, { half = false, skipEnd = 0 } = {}) => {
    const n = Math.max(2, Math.round(Math.max(arc(railA), arc(railB)) / pitch));
    const fr = [];
    if (half) for (let i = 0; i < n - skipEnd; i++) fr.push((i + 0.5) / n);
    else for (let i = 1; i < n; i++) fr.push(i / n);
    const A = along(railA, fr), B = along(railB, fr);
    return A.map((p, i) => [p, B[i]]);
  };

  const W = spec.width / 2;            // half the flat chest width
  const hemBottom = spec.length;       // HPS to hem
  const hemSeam = hemBottom - spec.hem.h;
  const S = V(spec.shoulder.x, spec.shoulder.y);

  // ---------- neckline: crew collar or hood ----------
  let neckSeam;      // right half of the seam the body hangs from, centre front -> shoulder line
  let shoulderStart; // where the shoulder line starts at the neck
  let cords = null;  // drawcords: where they come out and how they hang
  const back = [];   // things drawn behind the body: inside of the neck or hood
  const front = [];  // collar band and hood front, drawn over the body's neck edge

  if (spec.neck.kind === 'crew') {
    const { halfW: R, drop: D, rib: rw, back: bd } = spec.neck;
    const H = V(R, 0);
    const ush = unit(sub(S, H));
    const Hs = add(H, mul(ush, rw));
    const k = 0.58;
    const frontEdge = [C(V(0, D), V(R * k, D), V(R, D * (1 - k)), H)];
    neckSeam = [C(V(0, D + rw), V(Hs.x * k, D + rw), V(Hs.x, Hs.y + (D + rw - Hs.y) * (1 - k)), Hs)];
    shoulderStart = Hs;
    const backEdge = [C(V(0, bd), V(R * 0.5, bd), V(R * 0.86, bd * 0.42), H)];
    const backLow = [C(V(0, bd + rw), V(R * 0.55, bd + rw), V(R * 0.97, (bd + rw) * 0.5), H)];
    back.push(() => {
      fill(sym(backEdge.concat(reverse(frontEdge))), shade);           // the neck opening: inside of the back
      fill(sym(backEdge.concat(reverse(backLow))), rib);               // back collar band, seen through the opening
      ribLines(mirrorPairs(between(backEdge, backLow, RIB_PITCH, { half: true, skipEnd: 2 })));
    });
    front.push(() => {
      fill(sym(frontEdge.concat([L(H, Hs)], reverse(neckSeam))), rib);   // front collar band
      ribLines(mirrorPairs(between(frontEdge, neckSeam, RIB_PITCH * 0.85, { half: true })));
      const st = [C(V(0, D + rw + 6), V((Hs.x + 6 * ush.x) * k, D + rw + 6), V(Hs.x + 6 * ush.x, Hs.y + 6 * ush.y + (D + rw - Hs.y) * (1 - k)), add(Hs, mul(ush, 6)))];
      both(stitch, st);
    });
  } else {
    const { halfW: R, drop: nD } = spec.neck;
    const h = spec.hood;
    const H = V(R, 0);
    const N = V(0, nD);
    neckSeam = [C(N, V(R * 0.6, nD), V(R, nD * 0.42), H)];
    shoulderStart = H;
    const top = h.top;
    // Outer silhouette of the hood, from the crown down behind the shoulder line (the body covers its foot).
    const Wp = V(h.wide.x, h.wide.y), Bp = V(h.base.x, h.base.y);
    const silhouette = [
      C(V(0, top), V(Wp.x * 0.6, top), V(Wp.x, Wp.y - (Wp.y - top) * 0.55), Wp),
      C(Wp, V(Wp.x, Wp.y + (Bp.y - Wp.y) * 0.45), V(Bp.x + 8, Bp.y - 40), Bp),
    ];
    // Front edge of the hood: outer edge of the rim, from the crown to where the two sides meet at the neck.
    const Rp = V(h.rim.x, h.rim.y);
    const rimOuter = [
      C(V(0, top), V(Rp.x * 0.56, top), V(Rp.x, Rp.y - (Rp.y - top) * 0.56), Rp),
      C(Rp, V(Rp.x, Rp.y + (nD - Rp.y) * 0.5), V(h.meet * 0.9, nD - h.meet * 1.15), N),
    ];
    const rimInner = cutAtX(offset(rimOuter, h.rimW), 0); // the face opening
    const O = rimInner[rimInner.length - 1].d;
    back.push(() => {
      fill(sym(silhouette.concat([L(Bp, V(0, nD + 40))])), fabric);
      fill(sym(rimInner), shade); // inside of the hood, seen through the opening
      // Inside: the hood's centre seam and the back neck seam, through the opening.
      const yb = h.backNeck;
      const xb = xAtY(rimInner, yb);
      edge([C(V(-xb, yb), V(-xb * 0.45, yb + 14), V(xb * 0.45, yb + 14), V(xb, yb))]);
      edge([L(V(0, top + h.rimW), V(0, yb + 10.5))]);
    });
    front.push(() => {
      // The rim (the hood's front edge), one shape for both sides; they meet at the centre front.
      bounds.push(rimOuter);
      svg.push(`<path d="${pathD(sym(rimOuter), true)}${pathD(sym(rimInner), true)}" fill-rule="evenodd" ${s.fill(fabric)}/>`);
      edge([L(O, N)]);                              // the two front edges meet at the centre front
      edge([L(V(0, top), V(0, top + h.rimW))]);     // the hood's centre seam, across the rim at the crown
      if (h.lined) {
        // Lined hood: the lining shows as a second layer along the opening.
        const lining = cutAtX(offset(rimOuter, h.rimW - h.lined), 0);
        both(edge, lining);
        both(stitch, cutAtX(offset(rimOuter, 6), 0));
      } else {
        both(stitch, cutAtX(offset(rimOuter, 5), 0)); // drawcord channel
      }
      both(stitch, offset(neckSeam, 6));
    });
    if (h.cords) {
      const mid = offset(rimOuter, h.rimW / 2);
      const eyelet = V(xAtY(mid, h.cords.y), h.cords.y);
      cords = { eyelet, ...h.cords };
    }
  }

  // ---------- body ----------
  const ush = unit(sub(S, shoulderStart));
  const shoulder = L(shoulderStart, S);
  const U = V(spec.armhole.underarm.x, spec.armhole.underarm.y);
  const P = V(spec.armhole.pit.x, spec.armhole.pit.y);
  const dropped = spec.armhole.kind === 'dropped';
  const bandW = spec.hem.halfW;
  const armholeBody = dropped
    ? L(S, U)
    : C(S, add(S, mul(turn(ush), 0.45 * len(sub(U, S)))), sub(U, V(18, 40)), U);
  const sideTop = V(W, U.y + 30);
  const blouseStart = V(W, hemSeam - spec.hem.blouse);
  const side = [
    C(U, lerp(U, sideTop, 0.5), V(W, sideTop.y - 10), sideTop),
    L(sideTop, blouseStart),
    C(blouseStart, V(W, blouseStart.y + spec.hem.blouse * 0.55), V(bandW + (W - bandW) * 0.45, hemSeam), V(bandW, hemSeam)),
  ];
  const bodyHalf = neckSeam.concat([shoulder, armholeBody], side, [L(V(bandW, hemSeam), V(0, hemSeam))]);

  // ---------- sleeve (right; the left is its mirror) ----------
  // The sleeve hangs at sl.angle from vertical. It is sl.topW across at the armpit and tapers in straight lines to
  // the cuff, where the fabric blouses a little over the rib. The outer edge meets the shoulder line in one smooth
  // round (a fillet), so the shoulder runs into the sleeve without a corner.
  const sl = spec.sleeve;
  const ax = down(sl.angle);           // down the arm
  const nx = V(ax.y, -ax.x);           // across the arm, outwards
  const T = add(P, mul(nx, sl.topW));  // outer edge, across the arm from the armpit
  const meet = (p, u, q, v) => add(p, mul(u, ((q.x - p.x) * v.y - (q.y - p.y) * v.x) / (u.x * v.y - u.y * v.x)));
  const ct = 2; // the rib narrows a little towards its edge
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
    const length = arc([roundSeg]) + len(sub(Kbo, J)) + len(sub(Ko, Kbo)) + sl.cuffH;
    return { Ct, Ko, Ki, Kbo, Kbi, uOut, X, J, roundSeg, length };
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
  const seamSP = dropped
    ? C(S, add(S, mul(unit(sub(P, S)), len(sub(P, S)) * 0.33)), sub(P, mul(unit(sub(P, S)), len(sub(P, S)) * 0.33)), P)
    : C(S, add(S, mul(turn(ush), 0.42 * len(sub(P, S)))), sub(P, mul(unit(V(0.42, 1)), 0.32 * len(sub(P, S)))), P);
  const sleeve = [
    roundSeg,
    L(J, Kbo),
    C(Kbo, add(Kbo, mul(uOut, sl.blouseH * 0.6)), add(Ko, add(mul(nx, sl.blouse * 0.75), mul(ax, -1))), Ko),
    L(Ko, Ki),
    C(Ki, add(Ki, add(mul(nx, -sl.blouse * 0.75), mul(ax, -1))), add(Kbi, mul(dIn, sl.blouseH * 0.6)), Kbi),
    L(Kbi, P),
    ...reverse([seamSP]),
  ];
  const cuff = rounded([Ki, Ko, Bo, Bi], [0, 0, 4, 4]);

  // ---------- draw, back to front ----------
  back.forEach((f) => f());
  fill(sym(bodyHalf), fabric);
  front.forEach((f) => f());

  // Hem band.
  const hemOutline = rounded([V(-bandW, hemSeam), V(bandW, hemSeam), V(bandW - ct, hemBottom), V(-(bandW - ct), hemBottom)], [0, 0, 5, 5]);
  fill(hemOutline, rib);
  ribLines(between([L(V(-bandW, hemSeam), V(bandW, hemSeam))], [L(V(-(bandW - ct), hemBottom), V(bandW - ct, hemBottom))], RIB_PITCH * 1.15));

  // Kangaroo pocket.
  if (spec.pocket) {
    const p = spec.pocket;
    const Tc = V(p.topHalf, p.top), Sc = V(p.sideX, p.sideY), Bc = V(p.sideX + 2, hemSeam);
    const dx = Sc.x - Tc.x, dy = Sc.y - Tc.y;
    const opening = C(Tc, add(Tc, V(dx * 0.4, dy * 0.26)), sub(Sc, V(dx * 0.08, dy * 0.42)), Sc);
    const half = [L(V(0, p.top), Tc), opening, L(Sc, Bc), L(Bc, V(0, hemSeam))];
    fill(sym(half), fabric);
    stitch([L(V(-(p.topHalf - 5), p.top + 6), V(p.topHalf - 5, p.top + 6))]);
    both(stitch, trim(offset([opening, L(Sc, Bc)], 6), 0.03, 0.97));
  }

  // Hem stitch, just above the band, across the body (and through the pocket's foot).
  {
    const y = hemSeam - 6;
    const x = xAtY(side, y) - 4;
    stitch([L(V(-x, y), V(x, y))]);
  }

  // Sleeves and cuffs.
  const drawSleeve = (m) => {
    const f = m ? mirror : (ch) => ch;
    fill(f(sleeve), fabric);
    fill(f(cuff), rib);
    ribLines(between(f([L(Ki, Ko)]), f([L(Bi, Bo)]), RIB_PITCH));
    stitch(f([L(add(Ki, add(mul(ax, -6), mul(nx, 3))), add(Ko, add(mul(ax, -6), mul(nx, -3))))]));
    stitch(f(trim(offset([seamSP], dropped ? 5 : 6), 0.02, 0.9)));
  };
  drawSleeve(false);
  drawSleeve(true);

  // Drawcords, last: they hang over everything.
  if (cords) {
    const { eyelet: E, length: lc, width: cw, drift } = cords;
    const centre = [C(E, add(E, V(0, lc * 0.35)), add(E, V(drift, lc * 0.6)), add(E, V(drift, lc)))];
    const leftEdge = offset(centre, cw / 2), rightEdge = offset(centre, -cw / 2);
    const end = add(E, V(drift, lc));
    const cord = leftEdge.concat([L(leftEdge[leftEdge.length - 1].d, rightEdge[rightEdge.length - 1].d)], reverse(rightEdge), [L(rightEdge[0].a, leftEdge[0].a)]);
    const tip = rounded([V(end.x - cw / 2 + 1, end.y - 4), V(end.x + cw / 2 - 1, end.y - 4), V(end.x + cw / 2 - 1.5, end.y + 20), V(end.x - cw / 2 + 1.5, end.y + 20)], [0, 0, 2.5, 2.5]);
    for (const m of [false, true]) {
      const f = m ? mirror : (ch) => ch;
      fill(f(cord), fabric);
      fill(f(tip), shade);
      const e = m ? V(-E.x, E.y) : E;
      bounds.push([L(e, e)]);
      svg.push(`<circle cx="${num(e.x)}" cy="${num(e.y)}" r="5.5" ${s.fill(rib)}/>`);
      svg.push(`<circle cx="${num(e.x)}" cy="${num(e.y)}" r="2.3" ${s.fill(shade)}/>`);
    }
  }

  // ---------- extent and placement ----------
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ch of bounds) for (const p of samples(ch, 32)) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const w = 2 * Math.max(maxX, -minX), h = maxY - minY;
  return {
    name: spec.name,
    category: 'wear',
    w,
    h,
    body: `<g transform="translate(0 ${num(-minY)})">${svg.join('')}</g>`,
    anchors: { chest: { x: spec.chest.x, y: spec.chest.y - minY } },
  };
};
