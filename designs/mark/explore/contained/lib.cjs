// Geometry for the contained marks. Units: mm. Screen coordinates (y down).
// Every shape is built with PathB, which writes SVG path data AND keeps dense
// boundary samples, so feature sizes (thread bridges, knockout widths) can be measured.

const DEG = Math.PI / 180;
const f3 = (v) => (Math.abs(v) < 5e-4 ? '0' : (+v.toFixed(3)).toString());
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const mul = (p, k) => [p[0] * k, p[1] * k];
const len = (p) => Math.hypot(p[0], p[1]);
const norm = (p) => mul(p, 1 / len(p));
const dist = (p, q) => len(sub(p, q));
// clock direction: degrees clockwise from 12 o'clock
const dir = (deg) => [Math.sin(deg * DEG), -Math.cos(deg * DEG)];
const polar = (c, deg, r) => add(c, mul(dir(deg), r));

class PathB {
  constructor() { this.d = ''; this.subs = []; this.cur = null; this.start = null; }
  M(p) { this.d += `M${f3(p[0])} ${f3(p[1])}`; this.cur = p; this.start = p; this.subs.push([p]); return this; }
  L(p) {
    const a = this.cur, n = Math.max(2, Math.ceil(dist(a, p) / 0.02));
    for (let i = 1; i <= n; i++) this.subs.at(-1).push(add(a, mul(sub(p, a), i / n)));
    this.d += `L${f3(p[0])} ${f3(p[1])}`; this.cur = p; return this;
  }
  // arc to p around centre c; cw = clockwise on screen (SVG sweep-flag 1)
  A(p, c, cw) {
    const a = this.cur, r = dist(a, c);
    let t0 = Math.atan2(a[1] - c[1], a[0] - c[0]), t1 = Math.atan2(p[1] - c[1], p[0] - c[0]);
    let span = t1 - t0;
    if (cw) { while (span <= 1e-9) span += 2 * Math.PI; } else { while (span >= -1e-9) span -= 2 * Math.PI; }
    const n = Math.max(4, Math.ceil((Math.abs(span) * r) / 0.02));
    for (let i = 1; i <= n; i++) { const t = t0 + (span * i) / n; this.subs.at(-1).push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
    const large = Math.abs(span) > Math.PI ? 1 : 0;
    this.d += `A${f3(r)} ${f3(r)} 0 ${large} ${cw ? 1 : 0} ${f3(p[0])} ${f3(p[1])}`; this.cur = p; return this;
  }
  Z() { if (dist(this.cur, this.start) > 1e-6) this.L(this.start); this.d += 'Z'; this.cur = this.start; return this; }
  append(o) { this.d += o.d; this.subs.push(...o.subs); return this; }
  get pts() { return this.subs.flat(); }
}

function circle(c, r, cw = true) {
  const p = new PathB();
  const a = [c[0] - r, c[1]], b = [c[0] + r, c[1]];
  return p.M(a).A(b, c, cw).A(a, c, cw).Z();
}

// Convex polygon with filleted corners. verts listed clockwise on screen; radii per vertex (or one number).
function roundedPoly(verts, radii) {
  const n = verts.length, R = Array.isArray(radii) ? radii : verts.map(() => radii);
  const corners = verts.map((V, i) => {
    const P = verts[(i - 1 + n) % n], N = verts[(i + 1) % n];
    const u1 = norm(sub(P, V)), u2 = norm(sub(N, V));
    const th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const r = R[i];
    if (r <= 0) return { A: V, B: V, r: 0 };
    const t = r / Math.tan(th / 2);
    const bis = norm(add(u1, u2));
    const C = add(V, mul(bis, r / Math.sin(th / 2)));
    return { A: add(V, mul(u1, t)), B: add(V, mul(u2, t)), C, r };
  });
  const p = new PathB();
  p.M(corners[0].A);
  corners.forEach((k, i) => {
    if (i > 0) p.L(k.A);
    if (k.r > 0) p.A(k.B, k.C, true);
  });
  return p.Z();
}

// Disc of radius R centred at c, cut flat at y = c.y + cut (cut > 0, below centre), corners filleted with f.
function flatDisc(c, R, cut, f) {
  const yb = c[1] + cut;
  const yc = yb - f; // fillet centre y
  const dx = Math.sqrt((R - f) ** 2 - (yc - c[1]) ** 2);
  const CL = [c[0] - dx, yc], CR = [c[0] + dx, yc];
  const tL = add(c, mul(norm(sub(CL, c)), R)), tR = add(c, mul(norm(sub(CR, c)), R));
  const p = new PathB();
  p.M([CR[0], yb]).L([CL[0], yb]).A(tL, CL, true).A(tR, c, true).A([CR[0], yb], CR, true).Z();
  return p;
}

// Union outline of two round-ended hands that share the hub H, plus an optional hub disc of radius hr.
// Minute hand: angle mDeg, length Lm (hub to tip centre), width wm. Hour hand: hDeg, Lh, wh.
// Assumes the hour hand is clockwise of the minute hand by less than 180 degrees (true for 5:00: 0 and 150).
function hands({ H, mDeg = 0, hDeg = 150, Lm, wm, Lh, wh, hr = 0, elbow = 'hub' }) {
  if (elbow === 'tangent' && !hr && mDeg === 0) return handsTangent({ H, hDeg, Lm, wm, Lh, wh });
  const a = wm / 2, b = wh / 2;
  const dm = dir(mDeg), dh = dir(hDeg);
  const rcw = (d) => [-d[1], d[0]];   // right-hand side when facing d (screen)
  const rccw = (d) => [d[1], -d[0]];  // left-hand side
  // minute hand: the side facing the hour hand is its right side; hour hand: its left side faces the minute hand.
  const mIn = rcw(dm), mOut = rccw(dm), hIn = rccw(dh), hOut = rcw(dh);
  const M = polar(H, mDeg, Lm), T = polar(H, hDeg, Lh);
  const rO = Math.max(a, b, hr);
  // inner corner: intersection of minute inner edge and hour inner edge
  const p0 = add(H, mul(mIn, a)), q0 = add(H, mul(hIn, b));
  // p0 + s*dm = q0 + t*dh
  const det = dm[0] * -dh[1] - dm[1] * -dh[0];
  const rx = q0[0] - p0[0], ry = q0[1] - p0[1];
  const s = (rx * -dh[1] - ry * -dh[0]) / det;
  const corner = add(p0, mul(dm, s));
  const useHubInner = hr > 0 && dist(corner, H) < hr;
  const onEdge = (side, d, off, r) => add(add(H, mul(side, off)), mul(d, Math.sqrt(Math.max(0, r * r - off * off))));
  const p = new PathB();
  const startPt = useHubInner ? onEdge(mIn, dm, a, hr) : corner;
  p.M(startPt);
  p.L(add(M, mul(mIn, a)));
  p.A(add(M, mul(mOut, a)), M, false);
  p.L(onEdge(mOut, dm, a, rO));
  p.A(onEdge(hOut, dh, b, rO), H, false);
  p.L(add(T, mul(hOut, b)));
  p.A(add(T, mul(hIn, b)), T, false);
  if (useHubInner) { p.L(onEdge(hIn, dh, b, hr)); p.A(startPt, H, false); } else p.L(corner);
  return p.Z();
}

// Same union, minute hand vertical, but the outer elbow is one arc tangent to both outer edges
// (radius = mean half-width), so a heavier hour hand joins the minute hand without a step or bump.
function handsTangent({ H, hDeg = 150, Lm, wm, Lh, wh, elbowR }) {
  const a = wm / 2, b = wh / 2, r = elbowR || (a + b) / 2;
  const dh = dir(hDeg);
  const nOut = [-dh[1], dh[0]], nIn = [dh[1], -dh[0]];
  const M = [H[0], H[1] - Lm], T = polar(H, hDeg, Lh);
  const C = [H[0] - a + r, H[1] + (b - r - (r - a) * nOut[0]) / nOut[1]];
  const t1 = [H[0] - a, C[1]], t2 = add(C, mul(nOut, r));
  const corner = [H[0] + a, H[1] + (b - a * nIn[0]) / nIn[1]];
  const p = new PathB();
  p.M(corner).L([H[0] + a, M[1]]).A([H[0] - a, M[1]], M, false).L(t1).A(t2, C, false)
    .L(add(T, mul(nOut, b))).A(add(T, mul(nIn, b)), T, false).L(corner);
  return p.Z();
}

// A single round-ended bar (capsule) from P to Q, width w.
function bar(P, Q, w) {
  const d = norm(sub(Q, P)), n = [-d[1], d[0]], a = w / 2;
  const p = new PathB();
  return p.M(add(P, mul(n, a))).L(add(Q, mul(n, a))).A(sub(Q, mul(n, a)), Q, false).L(sub(P, mul(n, a))).A(add(P, mul(n, a)), P, false).Z();
}

function bboxOf(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// minimum distance between two point sets (brute force with a grid for speed)
function minDist(A, B) {
  const cell = 1.0, grid = new Map();
  for (const p of B) { const k = `${Math.floor(p[0] / cell)},${Math.floor(p[1] / cell)}`; (grid.get(k) || grid.set(k, []).get(k)).push(p); }
  let best = Infinity, at = null;
  for (const p of A) {
    const gx = Math.floor(p[0] / cell), gy = Math.floor(p[1] / cell);
    for (let R = 0; R < 40; R++) {
      if (R * cell - cell > best) break;
      for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
        if (Math.max(Math.abs(i), Math.abs(j)) !== R) continue;
        const L = grid.get(`${gx + i},${gy + j}`); if (!L) continue;
        for (const q of L) { const d = dist(p, q); if (d < best) { best = d; at = [p, q]; } }
      }
    }
  }
  return { d: best, at };
}

module.exports = { DEG, f3, add, sub, mul, len, norm, dist, dir, polar, PathB, circle, roundedPoly, flatDisc, hands, handsTangent, bar, bboxOf, minDist };
