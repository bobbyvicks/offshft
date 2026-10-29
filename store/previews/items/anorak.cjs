// Unisex Champion Packable Anorak, Champion CO200 (Printful sells it as "Embroidered Champion Packable Jacket").
// Size M: about 600 mm wide, 740 mm from the HPS to the hem. 2.8 oz polyester micro poplin, roomy fit, set-in sleeves.
// A lightweight pullover, not a full-zip jacket: a 1/2 zip at the centre front, an adjustable hood with a bungee cord
// and cord stoppers, a kangaroo pouch pocket (the pouch the jacket packs into is hidden inside it), elastic cuffs and
// a bungee drawcord in the hem. Champion's small "C" on the left sleeve is drawn as a plain oval patch, not their logo.
//
// Drawn the way _top.cjs draws the fleece tops: the same hood, armhole and sleeve construction, line weights and
// stitching, built for the wearer's left (+x) and mirrored. It doesn't call top(), which hard-wires knit rib cuffs, a
// rib hem band and flat drawcords; the geometry helpers are copied from _top.cjs, which keeps its own private.
// Shapes are in mm with y = 0 at the high point of the shoulder (HPS); the result is shifted so the crown of the hood
// sits at y = 0, as kit.compose expects.
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
// y where a chain last crosses x = x0.
function yAtX(ch, x0) {
  const p = samples(ch, 128);
  for (let i = p.length - 1; i > 0; i--) {
    const a = p[i - 1], b = p[i];
    if ((a.x - x0) * (b.x - x0) <= 0 && a.x !== b.x) return a.y + ((b.y - a.y) * (x0 - a.x)) / (b.x - a.x);
  }
  throw new Error(`chain never reaches x = ${x0}`);
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
// Open path through points, its inner corners rounded with radius r: stitching that turns a corner.
function bends(points, r) {
  const ch = [];
  let from = points[0];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i], u = unit(sub(p, points[i - 1])), v = unit(sub(points[i + 1], p));
    const a = sub(p, mul(u, r)), b = add(p, mul(v, r));
    ch.push(L(from, a), C(a, add(a, mul(u, r * KAPPA)), sub(b, mul(v, r * KAPPA)), b));
    from = b;
  }
  ch.push(L(from, points[points.length - 1]));
  return ch;
}
// An ellipse round c, with half-axes a along the unit vector u and b along the unit vector v.
function ellipse(c, u, v, a, b) {
  const at = (i, j) => add(c, add(mul(u, i), mul(v, j)));
  const k = KAPPA;
  return [
    C(at(a, 0), at(a, b * k), at(a * k, b), at(0, b)),
    C(at(0, b), at(-a * k, b), at(-a, b * k), at(-a, 0)),
    C(at(-a, 0), at(-a, -b * k), at(-a * k, -b), at(0, -b)),
    C(at(0, -b), at(a * k, -b), at(a, -b * k), at(a, 0)),
  ];
}

// ---------- SVG ----------
const num = (v) => String(Math.round(v * 100) / 100);
const xy = (p) => `${num(p.x)} ${num(p.y)}`;
function pathD(ch, close = false) {
  let out = `M${xy(ch[0].a)}`;
  for (const s of ch) out += `C${xy(s.b)} ${xy(s.c)} ${xy(s.d)}`;
  return out + (close ? 'Z' : '');
}

// Fine texture (the elastic's gathers, the zip's teeth) is drawn like the rib lines on the fleece tops: the kit's
// outline, lightened so it reads as texture and not as edges.
const FINE_OPACITY = 0.4;

// Size M, right half (the wearer's left), mm from the HPS.
const SPEC = {
  width: 600,                          // flat chest, side to side
  length: 740,                         // HPS to hem
  neck: { halfW: 100, drop: 96 },      // where the hood is sewn on: half-width at the HPS, depth at the centre front
  // Hood, built like the hoodie's: crown, widest point, base (behind the shoulder line), the rim (front edge, with the
  // bungee channel) and how its two sides run into the centre front, and the back neck seam seen through the opening.
  hood: { top: -292, wide: { x: 170, y: -118 }, base: { x: 130, y: 46 }, rim: { x: 112, y: -148 }, rimW: 20, meet: 40, backNeck: 18 },
  // Bungee cord ends (mm): each hangs from an eyelet, its stopper `lock` mm down it. The hood's eyelets sit on the rim,
  // y below the HPS; the hem's sit on the channel near the side seams, y below the channel seam.
  hoodCord: { y: 30, length: 125, drift: 3, lock: 70 },
  zip: { length: 250, halfW: 11, teeth: 3, pitch: 5 },     // 1/2 zip from the bottom of the face opening; placket
  shoulder: { x: 256, y: 50 },
  armhole: { underarm: { x: 302, y: 272 }, pit: { x: 262, y: 246 } },
  // Elastic cuff: a narrow binding the sleeve is gathered into, so the sleeve blouses over it more than over a knit rib.
  sleeve: { angle: 18, topW: 122, round: 0.9, length: 620, cuffW: 84, cuffH: 18, blouse: 12, blouseH: 34 },
  hem: { h: 26, halfW: 292, blouse: 30, cord: { x: 264, y: 8.5, length: 31, lock: 12.5 } }, // the bungee channel
  pocket: { top: 450, topHalf: 136, sideX: 214, sideY: 620 },
  badge: { up: 78, w: 24, h: 16 },     // Champion's "C": up the sleeve from the cuff seam, across and along the arm
  chest: { x: 95, y: 190 },            // the OFF SHFT logo, on the wearer's left chest
};
const CORD = { w: 5.5, lock: { w: 13, h: 18 }, tip: { w: 7, h: 9 } }; // round bungee cord, its stoppers and end caps

module.exports = (kit) => {
  const s = kit.strokes(kit.WEAR_PX);
  const { fabric, shade, rib } = kit.STYLE;
  const svg = [];
  const bounds = [];
  const fill = (ch, colour = fabric) => {
    bounds.push(ch);
    svg.push(`<path d="${pathD(ch, true)}" ${s.fill(colour)}/>`);
  };
  const edge = (ch) => svg.push(`<path d="${pathD(ch)}" ${s.outline}/>`);
  const stitch = (ch) => svg.push(`<path d="${pathD(ch)}" ${s.stitch}/>`);
  const fine = (chains) => svg.push(`<path d="${chains.map((ch) => pathD(ch)).join('')}" ${s.outline} stroke-opacity="${FINE_OPACITY}"/>`);
  const ring = (c, r, colour) => {
    bounds.push([L(sub(c, V(r, r)), add(c, V(r, r)))]);
    svg.push(`<circle cx="${num(c.x)}" cy="${num(c.y)}" r="${num(r)}" ${s.fill(colour)}/>`);
  };
  const both = (fn, ch) => { fn(ch); fn(mirror(ch)); };
  const same = (ch) => ch;

  // ---------- hood (as on the hoodie) ----------
  const { halfW: R, drop: nD } = SPEC.neck;
  const hd = SPEC.hood;
  const H = V(R, 0), N = V(0, nD);
  const neckSeam = [C(N, V(R * 0.6, nD), V(R, nD * 0.42), H)];
  const top = hd.top;
  const Wp = V(hd.wide.x, hd.wide.y), Bp = V(hd.base.x, hd.base.y);
  const silhouette = [
    C(V(0, top), V(Wp.x * 0.6, top), V(Wp.x, Wp.y - (Wp.y - top) * 0.55), Wp),
    C(Wp, V(Wp.x, Wp.y + (Bp.y - Wp.y) * 0.45), V(Bp.x + 8, Bp.y - 40), Bp),
  ];
  const Rp = V(hd.rim.x, hd.rim.y);
  const rimOuter = [
    C(V(0, top), V(Rp.x * 0.56, top), V(Rp.x, Rp.y - (Rp.y - top) * 0.56), Rp),
    C(Rp, V(Rp.x, Rp.y + (nD - Rp.y) * 0.5), V(hd.meet * 0.9, nD - hd.meet * 1.15), N),
  ];
  const rimInner = cutAtX(offset(rimOuter, hd.rimW), 0); // the face opening

  // ---------- 1/2 zip: the placket's top edge closes the bottom of the face opening ----------
  const z = SPEC.zip;
  const zipTop = yAtX(rimInner, z.halfW);
  const zipEnd = zipTop + z.length;

  // ---------- body ----------
  const W = SPEC.width / 2;
  const hemBottom = SPEC.length;
  const hm = SPEC.hem;
  const hemSeam = hemBottom - hm.h;
  const S = V(SPEC.shoulder.x, SPEC.shoulder.y);
  const ush = unit(sub(S, H));
  const U = V(SPEC.armhole.underarm.x, SPEC.armhole.underarm.y);
  const P = V(SPEC.armhole.pit.x, SPEC.armhole.pit.y);
  const bandW = hm.halfW;
  const armholeBody = C(S, add(S, mul(turn(ush), 0.45 * len(sub(U, S)))), sub(U, V(18, 40)), U);
  const sideTop = V(W, U.y + 30);
  const blouseStart = V(W, hemSeam - hm.blouse);
  const side = [
    C(U, lerp(U, sideTop, 0.5), V(W, sideTop.y - 10), sideTop),
    L(sideTop, blouseStart),
    C(blouseStart, V(W, blouseStart.y + hm.blouse * 0.55), V(bandW + (W - bandW) * 0.45, hemSeam), V(bandW, hemSeam)),
  ];
  const bodyHalf = neckSeam.concat([L(H, S), armholeBody], side, [L(V(bandW, hemSeam), V(0, hemSeam))]);

  // ---------- sleeve (right; the left is its mirror) ----------
  // As on the hoodie: the sleeve hangs at sl.angle from vertical, sl.topW across at the armpit, tapering in straight
  // lines to the cuff, the outer edge running into the shoulder line in one smooth round. The elastic cuff is short,
  // and the sleeve blouses over it more than over a knit rib.
  const sl = SPEC.sleeve;
  const ax = down(sl.angle);           // down the arm
  const nx = V(ax.y, -ax.x);           // across the arm, outwards
  const T = add(P, mul(nx, sl.topW));  // outer edge, across the arm from the armpit
  const meet = (p, u, q, v) => add(p, mul(u, ((q.x - p.x) * v.y - (q.y - p.y) * v.x) / (u.x * v.y - u.y * v.x)));
  const ct = 2; // the cuff narrows a little towards its edge
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
    ...reverse([seamSP]),
  ];
  const cuff = rounded([Ki, Ko, Bo, Bi], [0, 0, 3, 3]);
  // The elastic gathers the sleeve into the cuff: short folds, long and short in turn, fanning up from the cuff seam.
  const gathers = [1, 2, 3, 4, 5].map((i) => {
    const f = i / 6, a = sub(lerp(Ki, Ko, f), mul(ax, 2));
    const reach = i % 2 ? 11 : 17, lean = (f - 0.5) * 0.35;
    return [L(a, add(a, add(mul(ax, -reach), mul(nx, lean * reach))))];
  });

  // ---------- draw, back to front ----------
  // Hood, behind the body: its outside, then the inside seen through the opening, with its centre and back neck seams.
  fill(sym(silhouette.concat([L(Bp, V(0, nD + 40))])));
  fill(sym(rimInner), shade);
  {
    const yb = hd.backNeck, xb = xAtY(rimInner, yb);
    edge([C(V(-xb, yb), V(-xb * 0.45, yb + 14), V(xb * 0.45, yb + 14), V(xb, yb))]);
    edge([L(V(0, top + hd.rimW), V(0, yb + 10.5))]);
  }

  fill(sym(bodyHalf));

  // The rim (the hood's front edge, with the bungee in its channel), one shape for both sides.
  bounds.push(rimOuter);
  svg.push(`<path d="${pathD(sym(rimOuter), true)}${pathD(sym(rimInner), true)}" fill-rule="evenodd" ${s.fill(fabric)}/>`);
  edge([L(V(0, top), V(0, top + hd.rimW))]); // the hood's centre seam, across the rim at the crown
  both(stitch, cutAtX(offset(rimOuter, 5), 0));
  both(stitch, offset(neckSeam, 6));

  // Hem: the bungee channel. Its cord ends are drawn with the hood's, last.
  fill(rounded([V(-bandW, hemSeam), V(bandW, hemSeam), V(bandW - 1, hemBottom), V(-(bandW - 1), hemBottom)], [0, 0, 4, 4]), rib);

  // Kangaroo pouch pocket, open at the sides.
  {
    const p = SPEC.pocket;
    const Tc = V(p.topHalf, p.top), Sc = V(p.sideX, p.sideY), Bc = V(p.sideX + 2, hemSeam);
    const dx = Sc.x - Tc.x, dy = Sc.y - Tc.y;
    const opening = C(Tc, add(Tc, V(dx * 0.4, dy * 0.26)), sub(Sc, V(dx * 0.08, dy * 0.42)), Sc);
    fill(sym([L(V(0, p.top), Tc), opening, L(Sc, Bc), L(Bc, V(0, hemSeam))]));
    stitch([L(V(-(p.topHalf - 5), p.top + 6), V(p.topHalf - 5, p.top + 6))]);
    both(stitch, trim(offset([opening, L(Sc, Bc)], 6), 0.03, 0.97));
  }
  // Hem stitch, just above the channel, across the body (and through the pocket's foot).
  {
    const y = hemSeam - 6, x = xAtY(side, y) - 4;
    stitch([L(V(-x, y), V(x, y))]);
  }

  // The 1/2 zip: a narrow placket, stitched down both sides and boxed across the foot, the chain down its middle and
  // the slider at the top with its pull hanging down.
  {
    const hw = z.halfW, sx = hw - 3.5, sy = zipEnd - 3.5;
    fill(rounded([V(-hw, zipTop), V(hw, zipTop), V(hw, zipEnd), V(-hw, zipEnd)], [0, 0, 3, 3]));
    stitch(bends([V(-sx, zipTop + 3), V(-sx, sy), V(sx, sy), V(sx, zipTop + 3)], 2.5));
    const chainEnd = zipEnd - 11;
    const teeth = [];
    for (let y = zipTop + 16; y < chainEnd - 2; y += z.pitch) teeth.push([L(V(-z.teeth, y), V(z.teeth, y))]);
    fine(teeth);
    edge([L(V(0, zipTop), V(0, chainEnd))]);
    edge([L(V(-z.teeth, chainEnd), V(z.teeth, chainEnd))]); // bottom stop
    fill(rounded([V(-3.5, zipTop + 8), V(3.5, zipTop + 8), V(5, zipTop + 36), V(-5, zipTop + 36)], [1, 1, 4.5, 4.5]), shade);
    fill(rounded([V(-6, zipTop - 2), V(6, zipTop - 2), V(5, zipTop + 12), V(-5, zipTop + 12)], [2, 2, 3, 3]), shade);
  }

  // Sleeves and their elastic cuffs; Champion's "C" patch on the wearer's left (+x) sleeve.
  const drawSleeve = (m) => {
    const f = m ? mirror : same;
    fill(f(sleeve));
    fill(f(cuff), rib);
    fine(gathers.map(f));
    stitch(f([L(add(lerp(Ki, Bi, 0.5), mul(nx, 4)), sub(lerp(Ko, Bo, 0.5), mul(nx, 4)))])); // the elastic's casing
    stitch(f(trim(offset([seamSP], 6), 0.02, 0.9)));
  };
  drawSleeve(false);
  drawSleeve(true);
  {
    const b = SPEC.badge;
    fill(ellipse(sub(Ct, mul(ax, b.up)), nx, ax, b.w / 2, b.h / 2));
  }

  // Bungee cords, last: they hang over everything. Each comes out of an eyelet, runs through a cord stopper and ends
  // in a cap.
  const cord = (E, { length, drift = 0, lock: at }) => {
    const centre = [C(E, add(E, V(0, length * 0.35)), add(E, V(drift, length * 0.6)), add(E, V(drift, length)))];
    const a = offset(centre, CORD.w / 2), b = offset(centre, -CORD.w / 2);
    const tube = a.concat([L(a[a.length - 1].d, b[b.length - 1].d)], reverse(b), [L(b[0].a, a[0].a)]);
    const end = add(E, V(drift, length)), tw = CORD.tip.w / 2;
    const tip = rounded([V(end.x - tw, end.y - 3), V(end.x + tw, end.y - 3), V(end.x + tw, end.y + CORD.tip.h - 3), V(end.x - tw, end.y + CORD.tip.h - 3)], [0, 0, 3, 3]);
    const c = along(centre, [at / arc(centre)])[0], lw = CORD.lock.w / 2, lh = CORD.lock.h / 2;
    const lock = rounded([V(c.x - lw, c.y - lh), V(c.x + lw, c.y - lh), V(c.x + lw, c.y + lh), V(c.x - lw, c.y + lh)], [5, 5, 5, 5]);
    return { tube, tip, lock };
  };
  const hc = SPEC.hoodCord;
  const hoodE = V(xAtY(offset(rimOuter, hd.rimW / 2), hc.y), hc.y);
  const hemE = V(hm.cord.x, hemSeam + hm.cord.y);
  for (const [E, c] of [[hoodE, cord(hoodE, hc)], [hemE, cord(hemE, hm.cord)]]) {
    for (const m of [false, true]) {
      const f = m ? mirror : same;
      fill(f(c.tube));
      fill(f(c.tip), shade);
      fill(f(c.lock), shade);
      const e = m ? V(-E.x, E.y) : E;
      ring(e, 5.5, rib);
      ring(e, 2.3, shade);
    }
  }

  // ---------- extent and placement ----------
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ch of bounds) for (const p of samples(ch, 32)) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  return {
    name: 'anorak',
    category: 'wear',
    w: 2 * Math.max(maxX, -minX),
    h: maxY - minY,
    body: `<g transform="translate(0 ${num(-minY)})">${svg.join('')}</g>`,
    anchors: { chest: { x: SPEC.chest.x, y: SPEC.chest.y - minY } },
  };
};
