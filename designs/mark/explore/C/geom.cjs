// Geometry helpers for the C (contained) marks. Units: mm. Screen coords (y down).
// Clock angles: degrees clockwise from 12 o'clock.
const PI = Math.PI;
const rad = (d) => (d * PI) / 180;
const fmt = (n) => {
  const s = (+n).toFixed(3);
  return s.replace(/\.?0+$/, '') === '-0' ? '0' : s.replace(/\.?0+$/, '');
};
const P = (p) => `${fmt(p[0])} ${fmt(p[1])}`;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => mul(a, 1 / len(a));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
// direction of a clock angle, and its clockwise normal
const U = (deg) => [Math.sin(rad(deg)), -Math.cos(rad(deg))];
const N = (deg) => [Math.cos(rad(deg)), Math.sin(rad(deg))];
const at = (O, deg, r) => add(O, mul(U(deg), r));
const angOf = (O, p) => { // clock angle of point p seen from O, 0..360
  const v = sub(p, O);
  let d = (Math.atan2(v[0], -v[1]) * 180) / PI;
  return (d + 360) % 360;
};

function circle(O, r) {
  const [x, y] = O;
  return `M${fmt(x - r)} ${fmt(y)}A${fmt(r)} ${fmt(r)} 0 1 1 ${fmt(x + r)} ${fmt(y)}A${fmt(r)} ${fmt(r)} 0 1 1 ${fmt(x - r)} ${fmt(y)}Z`;
}

// Arc along a circle (centre O, radius r) from clock angle a0 to a1, cw=true for clockwise.
function arcTo(O, r, a0, a1, cw = true) {
  let span = cw ? a1 - a0 : a0 - a1;
  span = ((span % 360) + 360) % 360;
  const p = at(O, a1, r);
  return `A${fmt(r)} ${fmt(r)} 0 ${span > 180 ? 1 : 0} ${cw ? 1 : 0} ${P(p)}`;
}

// Hand terminal from ccw edge end to cw edge end.
function capTo(h, O, cwSide) {
  // h: {deg, a (half width), L (distance of end line from O), cap}
  const u = U(h.deg), n = N(h.deg);
  const endC = add(O, mul(u, h.L));
  const ccwEnd = add(endC, mul(n, -h.a));
  const cwEnd = add(endC, mul(n, h.a));
  const [from, to] = cwSide ? [ccwEnd, cwEnd] : [cwEnd, ccwEnd];
  if (h.cap === 'flat') return `L${P(to)}`;
  if (h.cap === 'point') {
    const tip = add(endC, mul(u, h.a * (h.tipK ?? 1)));
    return `L${P(tip)}L${P(to)}`;
  }
  if (h.cap === 'chamfer') { // flat end with small 45deg-ish corner cuts
    const c = h.ch ?? h.a * 0.35;
    const p1 = add(add(endC, mul(n, cwSide ? -h.a + c : h.a - c)), mul(u, c));
    const p2 = add(add(endC, mul(n, cwSide ? h.a - c : -h.a + c)), mul(u, c));
    return `L${P(p1)}L${P(p2)}L${P(to)}`;
  }
  // round
  return `A${fmt(h.a)} ${fmt(h.a)} 0 0 ${cwSide ? 1 : 0} ${P(to)}`;
}

// Union outline of a hub circle (radius rh at O) and hands radiating from O.
// hands: [{deg, a, L, cap}] ; L = distance from O to the centre of the round cap (or the flat end line).
// Returns a single closed path traced clockwise.
function handsUnion(O, rh, hands) {
  const hs = [...hands].sort((p, q) => p.deg - q.deg);
  const n = hs.length;
  let d = '';
  hs.forEach((h, i) => {
    const s = Math.sqrt(rh * rh - h.a * h.a);
    const u = U(h.deg), nn = N(h.deg);
    const ccwBase = add(add(O, mul(u, s)), mul(nn, -h.a));
    const cwBase = add(add(O, mul(u, s)), mul(nn, h.a));
    const ccwEnd = add(add(O, mul(u, h.L)), mul(nn, -h.a));
    if (i === 0) d += `M${P(ccwBase)}`;
    d += `L${P(ccwEnd)}`;
    d += capTo(h, O, true);
    d += `L${P(cwBase)}`;
    const nx = hs[(i + 1) % n];
    const dCw = (Math.asin(h.a / rh) * 180) / PI;
    const dNx = (Math.asin(nx.a / rh) * 180) / PI;
    d += arcTo(O, rh, h.deg + dCw, nx.deg - dNx, true);
  });
  return d + 'Z';
}

// Polygon with rounded corners. pts clockwise (screen). r: number or array per vertex.
function roundedPoly(pts, r) {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const Pp = pts[(i - 1 + n) % n], V = pts[i], Nn = pts[(i + 1) % n];
    const ri = Array.isArray(r) ? r[i] : r;
    const v1 = norm(sub(Pp, V)), v2 = norm(sub(Nn, V));
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(v1, v2))));
    if (!ri) { d += (i ? 'L' : 'M') + P(V); continue; }
    const t = ri / Math.tan(ang / 2);
    const p1 = add(V, mul(v1, t)), p2 = add(V, mul(v2, t));
    d += (i ? 'L' : 'M') + P(p1) + `A${fmt(ri)} ${fmt(ri)} 0 0 1 ${P(p2)}`;
  }
  return d + 'Z';
}

// Regular polygon, clockwise, first vertex at clock angle a0.
function regPoly(O, R, k, a0 = 0) {
  return Array.from({ length: k }, (_, i) => at(O, a0 + (360 / k) * i, R));
}

// Distance from point p to the infinite line through a,b
function distToLine(p, a, b) {
  const v = norm(sub(b, a));
  const w = sub(p, a);
  return Math.abs(w[0] * v[1] - w[1] * v[0]);
}

// Bounding box of a path string (samples arcs coarsely through endpoints and the circle extremes is overkill;
// we keep explicit bboxes in the builders instead).

module.exports = { PI, rad, fmt, P, add, sub, mul, len, norm, dot, U, N, at, angOf, circle, arcTo, capTo, handsUnion, roundedPoly, regPoly, distToLine };
