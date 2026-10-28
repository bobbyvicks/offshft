// Geometry helpers for the "Bold geometric" mark exploration.
// Units: mm, y axis points down (SVG). Clock angles: degrees clockwise from 12.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => mul(a, 1 / len(a));
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rad = (deg) => (deg * Math.PI) / 180;
// unit vector pointing at clock angle deg
const dir = (deg) => [Math.sin(rad(deg)), -Math.cos(rad(deg))];
// left normal of a direction (rotated 90 deg counter-clockwise on screen)
const lnorm = (d) => [d[1], -d[0]];

// intersection of line p + t d with line q + s e
function inter(p, d, q, e) {
  const den = cross(d, e);
  if (Math.abs(den) < 1e-12) throw new Error('parallel lines');
  const t = cross(sub(q, p), e) / den;
  return add(p, mul(d, t));
}

// A straight bar starting at P, pointing at clock angle deg.
// len: length beyond P; tail: length behind P; w: width.
// endCut/startCut: clock angle of the cut line (default: square, perpendicular to the bar).
function bar(P, deg, { len: L, tail = 0, w, endCut = null, startCut = null }) {
  const d = dir(deg);
  const n = lnorm(d);
  const e = add(P, mul(d, L));
  const s = add(P, mul(d, -tail));
  const ce = endCut === null ? n : dir(endCut);
  const cs = startCut === null ? n : dir(startCut);
  const Lp = add(P, mul(n, w / 2));
  const Rp = add(P, mul(n, -w / 2));
  return [inter(Lp, d, s, cs), inter(Lp, d, e, ce), inter(Rp, d, e, ce), inter(Rp, d, s, cs)];
}

// Outline polygon of a polyline stroke with mitred joins and cut ends.
// pts: [[x,y],...]; w: width; startCut/endCut: clock angle of the end cut line (default square).
function stroke(pts, w, { startCut = null, endCut = null, wList = null } = {}) {
  const n = pts.length;
  const segs = [];
  for (let i = 0; i < n - 1; i++) {
    const d = norm(sub(pts[i + 1], pts[i]));
    segs.push({ d, nrm: lnorm(d), w: wList ? wList[i] : w });
  }
  const side = (sgn) => {
    const out = [];
    const line = (i) => ({ p: add(pts[i], mul(segs[i].nrm, (sgn * segs[i].w) / 2)), d: segs[i].d });
    const s0 = line(0);
    const cs = startCut === null ? segs[0].nrm : dir(startCut);
    out.push(inter(s0.p, s0.d, pts[0], cs));
    for (let i = 1; i < n - 1; i++) {
      const a = line(i - 1), b = line(i);
      out.push(inter(a.p, a.d, b.p, b.d));
    }
    const sl = line(n - 2);
    const ce = endCut === null ? segs[n - 2].nrm : dir(endCut);
    out.push(inter(sl.p, sl.d, pts[n - 1], ce));
    return out;
  };
  const L = side(1), R = side(-1);
  return L.concat(R.reverse());
}

function area(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) a += cross(poly[i], poly[(i + 1) % poly.length]);
  return a / 2;
}
const orient = (poly, sgn = 1) => (area(poly) * sgn >= 0 ? poly.slice() : poly.slice().reverse());

function onSeg(p, a, b, eps = 1e-7) {
  const d = sub(b, a), L = len(d);
  if (L < eps) return false;
  const dist = Math.abs(cross(sub(p, a), d)) / L;
  if (dist > eps) return false;
  const t = dot(sub(p, a), d) / (L * L);
  return t > -eps && t < 1 + eps;
}
function inside(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function segT(a0, a1, b0, b1) {
  const d = sub(a1, a0), e = sub(b1, b0);
  const den = cross(d, e);
  const out = [];
  if (Math.abs(den) < 1e-12) {
    if (Math.abs(cross(sub(b0, a0), d)) / len(d) < 1e-7) {
      for (const b of [b0, b1]) {
        const t = dot(sub(b, a0), d) / dot(d, d);
        if (t > 0 && t < 1) out.push(t);
      }
    }
    return out;
  }
  const t = cross(sub(b0, a0), e) / den;
  const u = cross(sub(b0, a0), d) / den;
  const eps = 1e-9;
  if (t >= -eps && t <= 1 + eps && u >= -eps && u <= 1 + eps) out.push(Math.min(1, Math.max(0, t)));
  return out;
}

// Union of simple polygons -> list of loops (outer boundaries and any holes).
function union(polysIn) {
  const polys = polysIn.map((p) => orient(p, 1));
  const segs = [];
  polys.forEach((A, ia) => {
    for (let i = 0; i < A.length; i++) {
      const a0 = A[i], a1 = A[(i + 1) % A.length];
      const ts = [0, 1];
      polys.forEach((B, ib) => {
        if (ib === ia) return;
        for (let j = 0; j < B.length; j++) ts.push(...segT(a0, a1, B[j], B[(j + 1) % B.length]));
      });
      ts.sort((x, y) => x - y);
      for (let k = 0; k < ts.length - 1; k++) {
        const t0 = ts[k], t1 = ts[k + 1];
        if (t1 - t0 < 1e-9) continue;
        const m = lerp(a0, a1, (t0 + t1) / 2);
        let keep = true;
        for (let ib = 0; ib < polys.length && keep; ib++) {
          if (ib === ia) continue;
          const B = polys[ib];
          let on = null;
          for (let j = 0; j < B.length; j++) {
            const b0 = B[j], b1 = B[(j + 1) % B.length];
            if (onSeg(m, b0, b1)) { on = dot(sub(a1, a0), sub(b1, b0)) > 0; break; }
          }
          if (on === true) { if (ib < ia) keep = false; }
          else if (on === false) keep = false;
          else if (inside(m, B)) keep = false;
        }
        if (keep) segs.push([lerp(a0, a1, t0), lerp(a0, a1, t1)]);
      }
    }
  });
  const key = (p) => `${Math.round(p[0] * 1e5)},${Math.round(p[1] * 1e5)}`;
  const byStart = new Map();
  segs.forEach((s, i) => { const k = key(s[0]); if (!byStart.has(k)) byStart.set(k, []); byStart.get(k).push(i); });
  const used = new Array(segs.length).fill(false);
  const loops = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    const loop = [];
    let cur = i;
    const startKey = key(segs[i][0]);
    let guard = 0;
    while (cur !== undefined && !used[cur] && guard++ < 10000) {
      used[cur] = true;
      loop.push(segs[cur][0]);
      const k = key(segs[cur][1]);
      if (k === startKey) break;
      const nxt = (byStart.get(k) || []).find((j) => !used[j]);
      cur = nxt;
    }
    loops.push(simplify(loop));
  }
  return loops.filter((l) => l.length >= 3);
}
// chain directed segments into closed loops
function chain(segs) {
  const key = (p) => `${Math.round(p[0] * 1e5)},${Math.round(p[1] * 1e5)}`;
  const byStart = new Map();
  segs.forEach((s, i) => { const k = key(s[0]); if (!byStart.has(k)) byStart.set(k, []); byStart.get(k).push(i); });
  const used = new Array(segs.length).fill(false);
  const loops = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    const loop = [];
    let cur = i;
    const startKey = key(segs[i][0]);
    let guard = 0;
    while (cur !== undefined && !used[cur] && guard++ < 100000) {
      used[cur] = true;
      loop.push(segs[cur][0]);
      const k = key(segs[cur][1]);
      if (k === startKey) break;
      cur = (byStart.get(k) || []).find((j) => !used[j]);
    }
    loops.push(simplify(loop));
  }
  return loops.filter((l) => l.length >= 3);
}
// split every edge of every polygon in `own` at intersections with all polygons in `all`
function splitEdges(poly, others) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a0 = poly[i], a1 = poly[(i + 1) % poly.length];
    const ts = [0, 1];
    others.forEach((B) => { for (let j = 0; j < B.length; j++) ts.push(...segT(a0, a1, B[j], B[(j + 1) % B.length])); });
    ts.sort((x, y) => x - y);
    for (let k = 0; k < ts.length - 1; k++) {
      if (ts[k + 1] - ts[k] < 1e-9) continue;
      out.push([lerp(a0, a1, ts[k]), lerp(a0, a1, ts[k + 1])]);
    }
  }
  return out;
}
// where is point m relative to polygon B: 'in' | 'out' | 'same' | 'opp' (on boundary, edge same/opposite direction as v)
function where(m, v, B) {
  for (let j = 0; j < B.length; j++) {
    const b0 = B[j], b1 = B[(j + 1) % B.length];
    if (onSeg(m, b0, b1)) return dot(v, sub(b1, b0)) > 0 ? 'same' : 'opp';
  }
  return inside(m, B) ? 'in' : 'out';
}
// A minus B. A: polygons (union-ed first), B: polygons (union-ed first). Returns loops (outer and hole loops).
function difference(Ain, Bin) {
  const A = union(Ain).map((p) => p); // loops; holes in A are not supported
  const B = union(Bin);
  const Ao = A.map((p) => orient(p, 1)), Bo = B.map((p) => orient(p, 1));
  const segs = [];
  Ao.forEach((poly) => {
    splitEdges(poly, Bo).forEach(([p, q]) => {
      const m = lerp(p, q, 0.5), v = sub(q, p);
      let keep = true;
      for (const b of Bo) { const w = where(m, v, b); if (w === 'in' || w === 'same') { keep = false; break; } }
      if (keep) segs.push([p, q]);
    });
  });
  Bo.forEach((poly) => {
    splitEdges(poly, Ao).forEach(([p, q]) => {
      const m = lerp(p, q, 0.5), v = sub(q, p);
      let inA = false;
      for (const a of Ao) { const w = where(m, v, a); if (w === 'in') { inA = true; break; } }
      if (inA) segs.push([q, p]);
    });
  });
  return chain(segs);
}
function simplify(loop) {
  let pts = loop.slice();
  let changed = true;
  while (changed && pts.length > 3) {
    changed = false;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[(i - 1 + pts.length) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length];
      if (len(sub(b, a)) < 1e-6 || Math.abs(cross(sub(b, a), sub(c, b))) < 1e-9 * Math.max(1, len(sub(b, a)) * len(sub(c, b)))) {
        pts.splice(i, 1); changed = true; break;
      }
    }
  }
  return pts;
}

const f3 = (v) => (Math.abs(v) < 5e-4 ? '0' : v.toFixed(3).replace(/\.?0+$/, ''));
const polyD = (poly) => 'M' + poly.map((p) => `${f3(p[0])} ${f3(p[1])}`).join('L') + 'Z';
const circleD = (c, r) => `M${f3(c[0] - r)} ${f3(c[1])}a${f3(r)} ${f3(r)} 0 1 0 ${f3(2 * r)} 0a${f3(r)} ${f3(r)} 0 1 0 ${f3(-2 * r)} 0Z`;
const rectPoly = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const path = (d, fill, evenodd = true) => `<path fill="${fill}"${evenodd ? ' fill-rule="evenodd"' : ''} d="${d}"/>`;

// regular polygon approximation of a circle (for unions)
function circlePoly(c, r, n = 96) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
  return out;
}

// Keep the part of poly where dot(x - p, n) >= 0 (one Sutherland-Hodgman pass).
function clipHalf(poly, p, n) {
  const out = [];
  const f = (x) => dot(sub(x, p), n);
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) out.push(lerp(a, b, fa / (fa - fb)));
  }
  return out;
}
// A minus convex B -> list of convex-ish pieces (feed to union for a clean outline).
function diffConvex(A, B) {
  const b = orient(B, 1);
  const pieces = [];
  let rest = A;
  for (let i = 0; i < b.length && rest.length >= 3; i++) {
    const p = b[i], q = b[(i + 1) % b.length];
    const e = sub(q, p);
    // with positive signed area (screen coords, y down) the interior is on the side of [ -e.y, e.x ]
    const inward = [-e[1], e[0]];
    const outward = mul(inward, -1);
    const outPart = clipHalf(rest, p, outward);
    if (outPart.length >= 3 && Math.abs(area(outPart)) > 1e-9) pieces.push(outPart);
    rest = clipHalf(rest, p, inward);
  }
  return pieces;
}
// convex polygon grown by g (approximate: offset edges, intersect neighbours) - fine for rectangles
function grow(B, g) {
  const b = orient(B, 1);
  const n = b.length;
  const lines = [];
  for (let i = 0; i < n; i++) {
    const p = b[i], q = b[(i + 1) % n];
    const e = norm(sub(q, p));
    const outward = [e[1], -e[0]];
    lines.push({ p: add(p, mul(outward, g)), d: e });
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = lines[(i - 1 + n) % n], c = lines[i];
    out.push(inter(a.p, a.d, c.p, c.d));
  }
  return out;
}

function bbox(polys) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  polys.forEach((p) => p.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
const movePoly = (poly, dx, dy) => poly.map(([x, y]) => [x + dx, y + dy]);
const scalePoly = (poly, k, o = [0, 0]) => poly.map(([x, y]) => [o[0] + (x - o[0]) * k, o[1] + (y - o[1]) * k]);

module.exports = { kit, add, sub, mul, dot, cross, len, norm, lerp, rad, dir, lnorm, inter, bar, stroke, area, orient, union, difference, chain, simplify, polyD, circleD, rectPoly, path, circlePoly, bbox, movePoly, scalePoly, f3, inside, clipHalf, diffConvex, grow };
