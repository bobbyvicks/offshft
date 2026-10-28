// Geometry helpers for the W (watchmaker hands) direction.
// Units: mm. Screen coordinates (y down). Clock angles in degrees clockwise from 12.
//
// A hand is described in its own frame: t = distance from the hub centre along the hand,
// s = sideways offset (+s is the clockwise side). A profile is the +s edge from the base
// (inside the hub) to the tip: { start:[t,s], segs:[['L',[t,s]] | ['C',[t,s],[t,s],[t,s]]] }.
// The other edge is the mirror image unless a separate `left` profile is given.

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const D2R = Math.PI / 180;
const f3 = (v) => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? 0 : r; };
const P = (p) => `${f3(p[0])} ${f3(p[1])}`;

// hand frame -> page coordinates, built on kit.polar so the angles are the kit's own
function frame(c, deg) {
  const [ux, uy] = kit.polar(0, 0, deg, 1);          // unit vector along the hand
  const [nx, ny] = kit.polar(0, 0, deg + 90, 1);     // unit vector to the clockwise side
  return ([t, s]) => [c[0] + t * ux + s * nx, c[1] + t * uy + s * ny];
}

const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
function bez(Q, u) {
  const a = lerp(Q[0], Q[1], u), b = lerp(Q[1], Q[2], u), c = lerp(Q[2], Q[3], u);
  const d = lerp(a, b, u), e = lerp(b, c, u);
  return lerp(d, e, u);
}
function splitBez(Q, u) {
  const a = lerp(Q[0], Q[1], u), b = lerp(Q[1], Q[2], u), c = lerp(Q[2], Q[3], u);
  const d = lerp(a, b, u), e = lerp(b, c, u), m = lerp(d, e, u);
  return [[Q[0], a, d, m], [m, e, c, Q[3]]];
}
const rad = (p) => Math.hypot(p[0], p[1]);

// polyline profile helper
const poly = (start, ...pts) => ({ start, segs: pts.map((p) => (p[0] === 'C' ? p : ['L', p])) });

// Cut a profile where it leaves the circle of radius R round the hub centre (frame origin).
function cutProfile(prof, R) {
  if (!R || rad(prof.start) >= R) return prof;
  let p0 = prof.start;
  for (let i = 0; i < prof.segs.length; i++) {
    const seg = prof.segs[i];
    if (seg[0] === 'A') {
      const [, c, r, end, inc] = seg;
      if (rad(end) >= R) {
        // circle (c, r) meets the hub circle (origin, R): take the first crossing along the arc's direction
        const d = Math.hypot(c[0], c[1]);
        const ex = [-c[0] / d, -c[1] / d], ey = [-ex[1], ex[0]];
        const a = (r * r - R * R + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r * r - a * a));
        const cands = [[c[0] + a * ex[0] + h * ey[0], c[1] + a * ex[1] + h * ey[1]], [c[0] + a * ex[0] - h * ey[0], c[1] + a * ex[1] - h * ey[1]]];
        const ang = (p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
        const trav = (p) => { let x = inc ? ang(p) - ang(p0) : ang(p0) - ang(p); while (x < 0) x += 2 * Math.PI; return x; };
        const lim = trav(end);
        const q = cands.filter((p) => trav(p) <= lim + 1e-9).sort((u, v) => trav(u) - trav(v))[0];
        if (!q) throw new Error('arc does not cross the hub circle');
        return { start: q, segs: [['A', c, r, end, inc], ...prof.segs.slice(i + 1)] };
      }
      p0 = end;
      continue;
    }
    const end = seg[seg.length - 1];
    if (seg[0] === 'L') {
      if (rad(end) >= R) {
        const dx = end[0] - p0[0], dy = end[1] - p0[1];
        const a = dx * dx + dy * dy, b = 2 * (p0[0] * dx + p0[1] * dy), c = p0[0] ** 2 + p0[1] ** 2 - R * R;
        const u = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        return { start: [p0[0] + u * dx, p0[1] + u * dy], segs: [['L', end], ...prof.segs.slice(i + 1)] };
      }
    } else {
      const Q = [p0, seg[1], seg[2], seg[3]];
      let lo = -1, hi = -1, prev = 0;
      for (let k = 1; k <= 400; k++) { const u = k / 400; if (rad(bez(Q, u)) >= R) { lo = prev; hi = u; break; } prev = u; }
      if (hi >= 0) {
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (rad(bez(Q, m)) >= R) hi = m; else lo = m; }
        const [, r] = splitBez(Q, hi);
        return { start: r[0], segs: [['C', r[1], r[2], r[3]], ...prof.segs.slice(i + 1)] };
      }
    }
    p0 = end;
  }
  throw new Error('profile never leaves the hub circle');
}

// Path builder that also keeps sample points for bounding boxes.
class PathB {
  constructor() { this.d = []; this.pts = []; this.cur = null; }
  M(p) { this.d.push(`M${P(p)}`); this.pts.push(p); this.cur = p; return this; }
  L(p) { this.d.push(`L${P(p)}`); this.pts.push(p); this.cur = p; return this; }
  C(c1, c2, p) {
    const Q = [this.cur, c1, c2, p];
    for (let k = 1; k <= 24; k++) this.pts.push(bez(Q, k / 24));
    this.d.push(`C${P(c1)} ${P(c2)} ${P(p)}`); this.cur = p; return this;
  }
  // circular arc about centre c, from current point to p, clockwise on screen if cw
  A(c, r, p, cw = true) {
    const a0 = Math.atan2(this.cur[1] - c[1], this.cur[0] - c[0]);
    const a1 = Math.atan2(p[1] - c[1], p[0] - c[0]);
    let span = cw ? a1 - a0 : a0 - a1;
    while (span < 0) span += 2 * Math.PI;
    while (span >= 2 * Math.PI) span -= 2 * Math.PI;
    const n = Math.max(4, Math.ceil(span / 0.05));
    for (let k = 1; k <= n; k++) { const a = a0 + (cw ? 1 : -1) * span * (k / n); this.pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
    this.d.push(`A${f3(r)} ${f3(r)} 0 ${span > Math.PI ? 1 : 0} ${cw ? 1 : 0} ${P(p)}`); this.cur = p; return this;
  }
  Z() { this.d.push('Z'); return this; }
  str() { return this.d.join(''); }
}

function emitProfile(pb, F, prof, { mirror = false, reverse = false, skipStart = false } = {}) {
  const m = (q) => F(mirror ? [q[0], -q[1]] : q);
  // flatten into a list of nodes so reversing is easy
  const nodes = [{ to: prof.start }];
  let prev = prof.start;
  for (const s of prof.segs) {
    if (s[0] === 'L') nodes.push({ type: 'L', from: prev, to: s[1] });
    else if (s[0] === 'A') nodes.push({ type: 'A', from: prev, c: s[1], r: s[2], to: s[3], inc: s[4] });  // ['A', centre, r, to, increasingAngle]
    else nodes.push({ type: 'C', from: prev, c1: s[1], c2: s[2], to: s[3] });
    prev = s[s.length - 1];
    if (s[0] === 'A') prev = s[3];
  }
  // The local frame maps to the page without reflection, so an arc's direction only flips when mirrored or reversed.
  const arc = (n, to, rev) => pb.A(m(n.c), n.r, m(to), n.inc !== mirror !== rev);
  if (!reverse) {
    if (!skipStart) pb.L(m(prof.start));
    for (const n of nodes.slice(1)) n.type === 'L' ? pb.L(m(n.to)) : n.type === 'A' ? arc(n, n.to, false) : pb.C(m(n.c1), m(n.c2), m(n.to));
  } else {
    const segs = nodes.slice(1).reverse();
    if (!skipStart) pb.L(m(segs[0].to));
    for (const n of segs) n.type === 'L' ? pb.L(m(n.from)) : n.type === 'A' ? arc(n, n.from, true) : pb.C(m(n.c2), m(n.c1), m(n.from));
  }
}

// Union outline of a hub circle (radius R, may be 0) and hands that leave it.
// hands: [{deg, profile, left?}] -> PathB (one closed subpath, clockwise)
function handsOutline(pb, c, R, hands) {
  const H = hands.slice().sort((a, b) => a.deg - b.deg).map((h) => {
    const F = frame(c, h.deg);
    const right = cutProfile(h.profile, R);
    const left = cutProfile(h.left || h.profile, R);
    return { F, right, left, inL: F([left.start[0], -left.start[1]]), inR: F(right.start) };
  });
  H.forEach((h, i) => {
    if (i === 0) pb.M(h.inL);
    else if (R > 0) pb.A(c, R, h.inL, true);
    else pb.L(h.inL);
    emitProfile(pb, h.F, h.left, { mirror: true, skipStart: true });
    // pointed hands end on the axis: the right edge starts where the left edge ended, so no duplicate node
    const tipL = h.left.segs[h.left.segs.length - 1], tipR = h.right.segs[h.right.segs.length - 1];
    const endL = tipL[0] === 'A' ? tipL[3] : tipL[tipL.length - 1], endR = tipR[0] === 'A' ? tipR[3] : tipR[tipR.length - 1];
    const pointed = Math.abs(endL[1]) < 1e-9 && Math.abs(endR[1]) < 1e-9 && Math.abs(endL[0] - endR[0]) < 1e-9;
    emitProfile(pb, h.F, h.right, { reverse: true, skipStart: pointed });
  });
  if (R > 0) pb.A(c, R, H[0].inL, true);
  pb.Z();
  return pb;
}

// closed symmetric shape from a profile (flat base if start has s>0)
function closedShape(pb, F, prof, left) {
  const L = left || prof;
  pb.M(F([L.start[0], -L.start[1]]));
  emitProfile(pb, F, L, { mirror: true, skipStart: true });
  emitProfile(pb, F, prof, { reverse: true });
  pb.Z();
  return pb;
}

function circle(pb, c, r) {
  const a = [c[0] + r, c[1]], b = [c[0] - r, c[1]];
  pb.M(a); pb.A(c, r, b, true); pb.A(c, r, a, true); pb.Z();
  return pb;
}

function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// Offset a convex polyline edge (list of [t,s] from base to tip, tip on the axis) inwards by w.
// Returns the inner edge as a list of points, ending on the axis.
function insetEdge(pts, w) {
  const lines = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    const nx = dy / L, ny = -dx / L;   // left normal of travel direction: points toward the axis for the +s edge
    lines.push({ p: [a[0] + nx * w, a[1] + ny * w], d: [dx / L, dy / L] });
  }
  const meet = (l1, l2) => {
    const det = l1.d[0] * -l2.d[1] - l1.d[1] * -l2.d[0];
    const rx = l2.p[0] - l1.p[0], ry = l2.p[1] - l1.p[1];
    const u = (rx * -l2.d[1] - ry * -l2.d[0]) / det;
    return [l1.p[0] + l1.d[0] * u, l1.p[1] + l1.d[1] * u];
  };
  const out = [lines[0].p];
  for (let i = 0; i < lines.length - 1; i++) out.push(meet(lines[i], lines[i + 1]));
  // tip: where the last inset line crosses the axis s=0
  const l = lines[lines.length - 1];
  const u = -l.p[1] / l.d[1];
  out.push([l.p[0] + l.d[0] * u, 0]);
  return out;
}
// clip a polyline (t ascending) to t >= t0
function clipFrom(pts, t0) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (b[0] >= t0) {
      const u = (t0 - a[0]) / (b[0] - a[0]);
      return [[t0, a[1] + (b[1] - a[1]) * Math.max(0, u)], ...pts.slice(i + 1)];
    }
  }
  return pts;
}

// ---------- files ----------
// Wrap path data into an mm SVG with a margin, translating so the art starts at the margin.
function place(parts, { margin = 0 } = {}) {
  const allPts = parts.flatMap((p) => p.pts);
  const bb = bbox(allPts);
  const dx = margin - bb.x0, dy = margin - bb.y0;
  return { w: bb.w + 2 * margin, h: bb.h + 2 * margin, dx, dy, bb };
}

function svgPaths(parts, dx, dy) {
  return parts.map((p) => `<path fill="${p.fill}" fill-rule="evenodd"${dx || dy ? ` transform="translate(${f3(dx)} ${f3(dy)})"` : ''} d="${p.d}"/>`).join('\n');
}

function sh(cmd, args) { return execFileSync(cmd, args, { encoding: 'utf8' }).trim(); }

// Embroidery check: render the art with its longest side at `size` mm, 40 px/mm, black on white,
// then morphological open/close with a 1.2 mm disk. Writes a diagnostic PNG and returns areas in mm2.
async function check(svgFile, outPng, { size = 25, minmm = 1.2 } = {}) {
  const d = kit.readSvg(svgFile);
  const k = size / Math.max(d.w, d.h);
  const W = d.w * k, H = d.h * k;
  const tmp = outPng.replace(/\.png$/, '');
  const raw = `${tmp}-raw.png`;
  await kit.render(svgFile, raw, { bg: '#FFFFFF', width: W, px: 20, tile: `${(W + 4).toFixed(2)}x${(H + 4).toFixed(2)}`, twill: false });
  const pxmm = 40, r = Math.round((minmm / 2) * pxmm);
  const bin = `${tmp}-bin.png`, open = `${tmp}-open.png`, close = `${tmp}-close.png`;
  sh('convert', [raw, '-colorspace', 'Gray', '-threshold', '60%', '-negate', bin]);
  sh('convert', [bin, '-morphology', 'Open', `Disk:${r}`, open]);
  sh('convert', [bin, '-morphology', 'Close', `Disk:${r}`, close]);
  const thin = `${tmp}-thin.png`, gap = `${tmp}-gap.png`;
  sh('convert', [bin, open, '-compose', 'Difference', '-composite', '-threshold', '50%', thin]);
  sh('convert', [close, bin, '-compose', 'Difference', '-composite', '-threshold', '50%', gap]);
  const count = (f) => +sh('convert', [f, '-format', '%[fx:mean*w*h]', 'info:']);
  const thinA = count(thin) / (pxmm * pxmm), gapA = count(gap) / (pxmm * pxmm);
  // diagnostic: thread grey, too-thin thread red, too-narrow fabric blue
  sh('convert', [bin, '-negate', '-fill', '#9a9a9a', '-opaque', 'black',
    '(', thin, '-transparent', 'black', '-fill', '#e0201b', '-opaque', 'white', ')', '-composite',
    '(', gap, '-transparent', 'black', '-fill', '#1b5be0', '-opaque', 'white', ')', '-composite', outPng]);
  for (const f of [raw, bin, open, close, thin, gap]) fs.unlinkSync(f);
  return { thin_mm2: +thinA.toFixed(3), gap_mm2: +gapA.toFixed(3) };
}

module.exports = { kit, D2R, f3, P, frame, poly, cutProfile, PathB, emitProfile, handsOutline, closedShape, circle, bbox, insetEdge, clipFrom, place, svgPaths, check, sh, bez, splitBez };
