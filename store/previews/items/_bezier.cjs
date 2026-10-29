// Geometry and drawing helpers for the tee and bottoms drawings (_tee.cjs, _bottoms.cjs). Not an item itself.
//
// Points are {x, y} in drawing mm, y down. A segment is a cubic Bézier {a, b, c, d}; a chain is an array of segments,
// each one starting where the one before it ends. Shapes are built for the wearer's left (+x) and mirrored.
'use strict';

// ---------- vectors ----------
const V = (x, y) => ({ x, y });
const add = (a, b) => V(a.x + b.x, a.y + b.y);
const sub = (a, b) => V(a.x - b.x, a.y - b.y);
const mul = (a, k) => V(a.x * k, a.y * k);
const len = (a) => Math.hypot(a.x, a.y);
const unit = (a) => mul(a, 1 / len(a));
const lerp = (a, b, t) => V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const cross = (a, b) => a.x * b.y - a.y * b.x;
const turn = (a) => V(-a.y, a.x); // a quarter turn to the right of the direction of travel, as seen on screen
const flip = (p) => V(-p.x, p.y); // mirror image in the centre line
const dir = (deg) => V(Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)); // deg below horizontal, to +x
const KAPPA = 0.5523; // handle length of a quarter circle

// Where the lines p + s·u and q + t·v cross.
function meet(p, u, q, v) {
  return add(p, mul(u, cross(sub(q, p), v) / cross(u, v)));
}

// ---------- segments and chains ----------
const C = (a, b, c, d) => ({ a, b, c, d });
const L = (a, d) => C(a, lerp(a, d, 1 / 3), lerp(a, d, 2 / 3), d);
function pt(s, t) {
  const u = 1 - t, k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t;
  return V(k0 * s.a.x + k1 * s.b.x + k2 * s.c.x + k3 * s.d.x, k0 * s.a.y + k1 * s.b.y + k2 * s.c.y + k3 * s.d.y);
}
function deriv(s, t) {
  const u = 1 - t;
  return add(add(mul(sub(s.b, s.a), 3 * u * u), mul(sub(s.c, s.b), 6 * u * t)), mul(sub(s.d, s.c), 3 * t * t));
}
function split(s, t) {
  const ab = lerp(s.a, s.b, t), bc = lerp(s.b, s.c, t), cd = lerp(s.c, s.d, t);
  const abc = lerp(ab, bc, t), bcd = lerp(bc, cd, t), m = lerp(abc, bcd, t);
  return [C(s.a, ab, abc, m), C(m, bcd, cd, s.d)];
}
// The piece of a segment between parameters t0 and t1.
function part(s, t0, t1) {
  let seg = t1 < 1 ? split(s, t1)[0] : s;
  if (t0 > 0) seg = split(seg, t0 / t1)[1];
  return seg;
}
const mirror = (ch) => ch.map((s) => C(flip(s.a), flip(s.b), flip(s.c), flip(s.d)));
const reverse = (ch) => ch.slice().reverse().map((s) => C(s.d, s.c, s.b, s.a));
// A right half that runs from the centre line back to the centre line, closed through its mirror image.
const sym = (half) => half.concat(reverse(mirror(half)));

function samples(ch, per = 48) {
  const out = [ch[0].a];
  for (const s of ch) for (let i = 1; i <= per; i++) out.push(pt(s, i / per));
  return out;
}
// Cumulative length along a segment, at n even steps of its parameter.
function lengths(s, n = 96) {
  const cum = [0];
  let prev = s.a;
  for (let i = 1; i <= n; i++) {
    const p = pt(s, i / n);
    cum.push(cum[i - 1] + len(sub(p, prev)));
    prev = p;
  }
  return cum;
}
const arc = (ch) => ch.reduce((acc, s) => acc + lengths(s).at(-1), 0);
// Segment index and parameter at a distance along a chain.
function locate(ch, dist) {
  let acc = 0;
  for (let i = 0; i < ch.length; i++) {
    const cum = lengths(ch[i]), l = cum.at(-1);
    if (dist <= acc + l || i === ch.length - 1) {
      const target = Math.min(Math.max(dist - acc, 0), l);
      let k = 1;
      while (k < cum.length - 1 && cum[k] < target) k++;
      const t = (k - 1 + (target - cum[k - 1]) / (cum[k] - cum[k - 1] || 1)) / (cum.length - 1);
      return { i, t };
    }
    acc += l;
  }
  return { i: ch.length - 1, t: 1 };
}
// Points at the given fractions of a chain's length.
function along(ch, fracs) {
  const total = arc(ch);
  return fracs.map((f) => {
    const { i, t } = locate(ch, f * total);
    return pt(ch[i], t);
  });
}
// The part of a chain between two fractions of its length.
function trim(ch, from, to) {
  const total = arc(ch);
  const A = locate(ch, from * total), B = locate(ch, to * total);
  const out = [];
  for (let i = A.i; i <= B.i; i++) {
    const t0 = i === A.i ? A.t : 0, t1 = i === B.i ? B.t : 1;
    if (t1 - t0 > 1e-6) out.push(part(ch[i], t0, t1));
  }
  return out;
}
// The same, with the ends cut back by distances in mm.
const trimMM = (ch, start, end) => {
  const total = arc(ch);
  return trim(ch, start / total, 1 - end / total);
};
// x where a chain first crosses height y.
function xAtY(ch, y) {
  const p = samples(ch, 160);
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i];
    if ((a.y - y) * (b.y - y) <= 0 && a.y !== b.y) return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
  }
  throw new Error(`chain never reaches y = ${y}`);
}
// Where a chain first crosses the line through p along u.
function hit(ch, p, u) {
  const q = samples(ch, 160), f = (r) => cross(u, sub(r, p));
  for (let i = 1; i < q.length; i++) {
    const fa = f(q[i - 1]), fb = f(q[i]);
    if (fa * fb <= 0 && fa !== fb) return lerp(q[i - 1], q[i], fa / (fa - fb));
  }
  throw new Error('chain never crosses the line');
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
    const h = 1e-4, a = at(s, 0), d = at(s, 1);
    const da = mul(sub(at(s, h), a), 1 / h), dd = mul(sub(d, at(s, 1 - h)), 1 / h);
    return C(a, add(a, mul(da, 1 / 3)), sub(d, mul(dd, 1 / 3)), d);
  };
  const out = [];
  for (const s of ch) for (let i = 0; i < parts; i++) out.push(off(part(s, i / parts, (i + 1) / parts)));
  return out;
}
// A smooth chain through the points. Each point's tangent runs from the point before it to the point after it (or
// along the given start or end direction), and each handle is a third of its chord, so the curve never overshoots.
function through(points, startDir, endDir) {
  const n = points.length;
  const tan = points.map((p, i) => {
    if (i === 0) return unit(startDir || sub(points[1], p));
    if (i === n - 1) return unit(endDir || sub(p, points[n - 2]));
    return unit(sub(points[i + 1], points[i - 1]));
  });
  const ch = [];
  for (let i = 0; i < n - 1; i++) {
    const a = points[i], d = points[i + 1], k = len(sub(d, a)) / 3;
    ch.push(C(a, add(a, mul(tan[i], k)), sub(d, mul(tan[i + 1], k)), d));
  }
  return ch;
}
// Straight lines through the points, each inner corner rounded with its own radius (0 = sharp). closed joins the last
// point back to the first and rounds those corners too.
function corners(points, radii, closed = false) {
  const n = points.length, ch = [];
  const round = (i) => closed || (i > 0 && i < n - 1) ? radii[i] || 0 : 0;
  const ends = points.map((p, i) => {
    const r = round(i);
    if (!r) return { p, in: p, out: p };
    const u = unit(sub(p, points[(i + n - 1) % n])), v = unit(sub(points[(i + 1) % n], p));
    return { p, u, v, r, in: sub(p, mul(u, r)), out: add(p, mul(v, r)) };
  });
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const e = ends[i], f = ends[(i + 1) % n];
    if (e.r) ch.push(C(e.in, add(e.in, mul(e.u, e.r * KAPPA)), sub(e.out, mul(e.v, e.r * KAPPA)), e.out));
    ch.push(L(e.out, f.in));
  }
  return ch.filter((s) => len(sub(s.d, s.a)) > 1e-6);
}
// Pairs of points evenly spaced along two rails, for rib lines between them. half: the band starts on the centre line
// and is mirrored, so the lines start half a pitch from it and run on evenly across the centre.
function between(railA, railB, pitch, half = false) {
  const n = Math.max(2, Math.round(Math.max(arc(railA), arc(railB)) / pitch));
  const fr = [];
  if (half) for (let i = 0; i < n; i++) fr.push((i + 0.5) / n);
  else for (let i = 1; i < n; i++) fr.push(i / n);
  const A = along(railA, fr), B = along(railB, fr);
  return A.map((p, i) => [p, B[i]]);
}
const mirrorPairs = (pairs) => pairs.concat(pairs.map(([a, b]) => [flip(a), flip(b)]));

// ---------- SVG ----------
const num = (v) => String(Math.round(v * 100) / 100);
const xy = (p) => `${num(p.x)} ${num(p.y)}`;
function pathD(ch, close = false) {
  let out = `M${xy(ch[0].a)}`;
  for (const s of ch) out += `C${xy(s.b)} ${xy(s.c)} ${xy(s.d)}`;
  return out + (close ? 'Z' : '');
}

// Rib lines are the outline, lightened so they read as fine texture and not as edges (as on the fleece tops).
const RIB_OPACITY = 0.4;
const RIB_PITCH = 9; // mm between rib lines

// Collects the drawing, back to front, in the kit's strokes at the clothing scale, and tracks the drawn extent.
function pen(kit) {
  const s = kit.strokes(kit.WEAR_PX);
  const out = [], filled = [];
  return {
    fill(ch, colour = kit.STYLE.fabric) {
      filled.push(ch);
      out.push(`<path d="${pathD(ch, true)}" ${s.fill(colour)}/>`);
    },
    edge(ch) { out.push(`<path d="${pathD(ch)}" ${s.outline}/>`); },
    stitch(ch) { out.push(`<path d="${pathD(ch)}" ${s.stitch}/>`); },
    ribs(pairs) {
      if (pairs.length) out.push(`<path d="${pairs.map(([a, b]) => `M${xy(a)}L${xy(b)}`).join('')}" ${s.outline} stroke-opacity="${RIB_OPACITY}"/>`);
    },
    // Soft fold lines (gathers), drawn like rib lines.
    folds(chains) {
      if (chains.length) out.push(`<path d="${chains.map((ch) => pathD(ch)).join('')}" ${s.outline} stroke-opacity="${RIB_OPACITY}"/>`);
    },
    circle(c, r, colour) {
      filled.push([L(V(c.x - r, c.y - r), V(c.x + r, c.y + r))]);
      out.push(`<circle cx="${num(c.x)}" cy="${num(c.y)}" r="${num(r)}" ${s.fill(colour)}/>`);
    },
    // The drawing, moved so its top is at y = 0, with its full width (centred on x = 0) and height.
    finish() {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const ch of filled) for (const p of samples(ch, 32)) {
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      }
      return { top: minY, w: 2 * Math.max(maxX, -minX), h: maxY - minY, body: `<g transform="translate(0 ${num(-minY)})">${out.join('')}</g>` };
    },
  };
}

module.exports = {
  V, add, sub, mul, len, unit, lerp, cross, turn, flip, dir, meet, KAPPA,
  C, L, pt, deriv, split, part, mirror, reverse, sym, samples, arc, along, trim, trimMM, xAtY, hit, offset, through,
  corners, between, mirrorPairs, pathD, num, xy, RIB_PITCH, pen,
};
