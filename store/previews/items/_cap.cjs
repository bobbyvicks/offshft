// Shared geometry for the four caps (trucker, five-panel, dad-hat, rope-cap), so they read as one set.
// Not an item: build.cjs loads items by product name and no product uses "_cap".
//
// Every cap is the same body, seen straight on from the wearer's eye line, which sits a little below the visor:
//   - Crown: a dome 190 mm wide at the base (a 58 cm head). Its outline is one cubic per side. A panel seam at
//     azimuth az (0 = centre front, 90 = the outline) is that same profile with x scaled by sin(az), so every seam
//     runs from the base up to the button.
//   - Base: the front half of the crown's base circle. Seen from slightly below it arcs up to the centre front by SD.
//   - Visor: 200 mm wide, 72 mm deep, pre-curved. Straight on it is a band under the crown: its top edge is the
//     crown/visor seam, its lower edge (the front edge) curves down at the sides, and we see its underside (shade).
// All numbers are millimetres, y down, x = 0 at the centre front; +x is the wearer's left.
'use strict';

const W = 95;                 // crown half-width at the base
const VISOR_DEPTH = 72;       // visor depth (front to back), shown foreshortened as the band
const SD = 7;                 // how far the base arcs up at the centre front, seen from just below the visor
const TOP = 4.2;              // crown peak (under the button), from the top of the button
const BUTTON = { w: 17, h: 4.6 };
const KAPPA = 0.5523;         // cubic handle for a quarter ellipse

// --- small cubic toolkit: a segment is [p0, p1, p2, p3] ---
const pt = (x, y) => ({ x, y });
const mix = (a, b, t) => pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const at = (c, t) => {
  const s = 1 - t;
  return pt(s * s * s * c[0].x + 3 * s * s * t * c[1].x + 3 * s * t * t * c[2].x + t * t * t * c[3].x,
    s * s * s * c[0].y + 3 * s * s * t * c[1].y + 3 * s * t * t * c[2].y + t * t * t * c[3].y);
};
const slope = (c, t) => {
  const s = 1 - t;
  return pt(3 * s * s * (c[1].x - c[0].x) + 6 * s * t * (c[2].x - c[1].x) + 3 * t * t * (c[3].x - c[2].x),
    3 * s * s * (c[1].y - c[0].y) + 6 * s * t * (c[2].y - c[1].y) + 3 * t * t * (c[3].y - c[2].y));
};
function split(c, t) {
  const a = mix(c[0], c[1], t), b = mix(c[1], c[2], t), d = mix(c[2], c[3], t);
  const e = mix(a, b, t), f = mix(b, d, t), g = mix(e, f, t);
  return [[c[0], a, e, g], [g, f, d, c[3]]];
}
const part = (c, t0, t1) => split(split(c, t1)[0], t0 / t1)[1];   // the piece of c between t0 and t1 (t1 > 0)
const rev = (c) => [c[3], c[2], c[1], c[0]];
const flip = (c) => c.map((p) => pt(-p.x, p.y));                  // mirror to the other side of the centre front
const lerpSeg = (a, b, f) => a.map((p, i) => mix(p, b[i], f));
const line = (a, b) => [a, mix(a, b, 1 / 3), mix(a, b, 2 / 3), b];

const num = (v) => +v.toFixed(3);
const xy = (p) => `${num(p.x)} ${num(p.y)}`;
function path(segs, close = false) {
  let s = `M${xy(segs[0][0])}`;
  for (const c of segs) s += ` C${xy(c[1])} ${xy(c[2])} ${xy(c[3])}`;
  return s + (close ? ' Z' : '');
}
// A smooth curve through sampled points (Catmull-Rom as cubics), for curves that come from a calculation.
function through(points) {
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(i + 2, points.length - 1)];
    segs.push([p1, pt(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6), pt(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6), p2]);
  }
  return segs;
}
// Parameter t at which f(t) crosses target, for f monotonic on [lo, hi].
function solve(f, target, lo = 0, hi = 1) {
  const up = f(hi) > f(lo);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((f(mid) < target) === up) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
const rad = (deg) => (deg * Math.PI) / 180;

function cap(kit, o) {
  const S = kit.strokes(kit.HAT_PX);
  const C = kit.STYLE;
  const half = kit.mm(C.lineW, kit.HAT_PX) / 2;   // half an outline, so w and h include the drawn line
  const solid = S.stitch.replace(/ stroke-dasharray="[^"]*"/, '');   // the stitch weight, undashed (mesh)
  const id = (s) => `${o.name}-${s}`;

  // --- crown ---
  const top = half + TOP;
  const seamY = top + o.crownH;              // crown/visor seam at the centre front
  const baseY = seamY + SD;                  // crown base at the sides
  const sh = o.shape;                        // profile handles: top (flatness), side (fullness), lean (taper)
  const prof = [pt(0, top), pt(sh.top * W, top), pt(W - sh.lean, baseY - sh.side * (baseY - top)), pt(W, baseY)];
  // The same profile at azimuth az: x scaled by sin(az); seen from below, points nearer the front ride up.
  const atAz = (p, az) => pt(p.x * Math.sin(az), p.y - SD * (p.x / W) * Math.cos(az));
  const seam = (az) => prof.map((p) => atAz(p, az));
  const baseArc = [pt(0, seamY), pt(KAPPA * W, seamY), pt(W, baseY - KAPPA * SD), pt(W, baseY)];   // centre -> right
  const crownOutline = [flip(rev(prof)), prof];
  const crownShape = path([...crownOutline, rev(baseArc), flip(baseArc)], true);

  // Stitching beside a seam stops short of the button, where the seams crowd together.
  const tStitch = solve((t) => at(prof, t).x, BUTTON.w / 2 + 5);
  const stitchBeside = (az, off) => {   // off: mm beside the seam, measured at the base
    const d = off / (W * Math.cos(az));
    return [az - d, az + d].map((a) => `<path d="${path([part(seam(a), tStitch, 1)])}" ${S.stitch}/>`).join('');
  };
  const seamAt = (az) => `<path d="${path([seam(az)])}" ${S.outline}/>`;
  const both = (svgFor) => svgFor(1) + svgFor(-1);   // +1 = the wearer's left (+x), -1 = right

  const parts = [];
  parts.push(`<path d="${crownShape}" fill="${C.fabric}"/>`);

  const azF = rad(o.frontAz);
  // Side panel: between the front seam and the outline (they meet at the button).
  const sidePanel = (sgn) => {
    const s = seam(azF), segs = [s, line(s[3], prof[3]), rev(prof)];   // button -> seam foot -> base corner -> button
    return path(sgn > 0 ? segs : segs.map(flip), true);
  };

  if (o.mesh) {
    // Mesh side panels: rib ground and a fine, regular diamond net (two sets of diagonals), clipped to the panel.
    const { cw, ch } = o.mesh;   // diamond width and height, mm
    const net = [];
    const x0 = W * Math.sin(azF) - 6, x1 = W + 2, y0 = top - 2, y1 = baseY + 2;
    for (let x = x0 - (y1 - y0) * (cw / ch); x <= x1; x += cw) {
      const dx = (y1 - y0) * (cw / ch) / 2;   // run of a diagonal over the panel's height (slope ch/cw, halved)
      net.push(`M${num(x)} ${num(y0)} L${num(x + 2 * dx)} ${num(y1)}`, `M${num(x + 2 * dx)} ${num(y0)} L${num(x)} ${num(y1)}`);
    }
    for (const sgn of [1, -1]) {
      parts.push(`<clipPath id="${id(`mesh${sgn}`)}"><path d="${sidePanel(sgn)}"/></clipPath>`);
      parts.push(`<path d="${sidePanel(sgn)}" fill="${C.rib}"/>`);
      parts.push(`<g clip-path="url(#${id(`mesh${sgn}`)})"><path d="${net.join(' ')}" ${solid}${sgn < 0 ? ' transform="scale(-1 1)"' : ''}/></g>`);
    }
  }

  // Seams: front/side seams on every cap, the centre seam on 6-panel fronts.
  for (const sgn of [1, -1]) {
    const a = sgn * azF;
    parts.push(seamAt(a), stitchBeside(a, 1.6));
  }
  if (o.panels === 6) parts.push(`<path d="M0 ${num(top)} V${num(seamY)}" ${S.outline}/>`, stitchBeside(0, 1.5));

  // Soft creases on an unstructured front (shade under a fold line), built once and mirrored.
  if (o.creases) {
    for (const c of o.creases) {
      const ridge = c.map((p) => pt(p[0], seamY - p[1]));
      const under = [ridge[3], mix(ridge[2], ridge[3], -0.15), mix(ridge[1], ridge[0], -0.15), ridge[0]]
        .map((p, i) => (i === 1 || i === 2 ? pt(p.x, p.y + c.depth) : p));
      const lens = path([ridge, under], true);
      parts.push(both((sgn) => `<g${sgn < 0 ? ' transform="scale(-1 1)"' : ''}><path d="${lens}" fill="${C.shade}"/><path d="${path([ridge])}" ${S.outline}/></g>`));
    }
  }

  // Sewn eyelets: a circle on the crown's surface, projected (so it foreshortens with the dome).
  for (const e of o.eyelets || []) {
    const t = solve((tt) => at(prof, tt).y, baseY - e.h * (baseY - top));
    const p = at(prof, t), dp = slope(prof, t), dl = Math.hypot(dp.x, dp.y);
    for (const sgn of [1, -1]) {
      const az = sgn * rad(e.az);
      const c = atAz(p, az);
      const U = pt(Math.cos(az), (SD / W) * Math.sin(az));                                     // round the hoop
      const V = pt((dp.x * Math.sin(az)) / dl, (dp.y - SD * (dp.x / W) * Math.cos(az)) / dl);   // down the profile
      const a = U.x * U.x + V.x * V.x, b = U.x * U.y + V.x * V.y, d = U.y * U.y + V.y * V.y;
      const m = (a + d) / 2, q = Math.sqrt(((a - d) / 2) ** 2 + b * b);
      const ang = (Math.atan2(2 * b, a - d) / 2) * (180 / Math.PI);
      const ell = (r, fill) => `<ellipse cx="${num(c.x)}" cy="${num(c.y)}" rx="${num(r * Math.sqrt(m + q))}" ry="${num(r * Math.sqrt(Math.max(m - q, 0)))}" transform="rotate(${num(ang)} ${num(c.x)} ${num(c.y)})" ${S.fill(fill)}/>`;
      parts.push(ell(3.3, C.fabric), ell(1.25, C.shade));
    }
  }

  parts.push(`<path d="${path(crownOutline)}" ${S.outline}/>`);

  // Button at the peak.
  const bw = BUTTON.w / 2, bb = top + 1.3;
  parts.push(`<path d="M${-bw} ${num(bb)} C${-bw} ${num(half + 1.3)} ${num(-bw * 0.55)} ${num(half)} 0 ${num(half)} C${num(bw * 0.55)} ${num(half)} ${bw} ${num(half + 1.3)} ${bw} ${num(bb)} C${num(bw * 0.5)} ${num(bb + 1.2)} ${num(-bw * 0.5)} ${num(bb + 1.2)} ${-bw} ${num(bb)} Z" ${S.fill()}/>`);

  // --- visor ---
  // Lower (front) edge: from the centre front out to K, where it turns the visor's corner and runs back up to the
  // crown at the side. v.centre: band height at the centre front; v.drop: how far the front edge falls at the sides.
  const v = o.visor;
  const K = pt(96, seamY + v.centre + v.drop);
  const E = baseArc[3];
  const kIn = pt(8, v.drop * 0.5), kLen = Math.hypot(kIn.x, kIn.y);
  const lower = [pt(0, seamY + v.centre), pt(40, seamY + v.centre), pt(K.x - kIn.x, K.y - kIn.y), K];
  const corner = [K, pt(K.x + (kIn.x / kLen) * 5, K.y + (kIn.y / kLen) * 5), pt(W + 5.5, E.y + (K.y - E.y) * 0.42), E];
  const band = path([flip(rev(baseArc)), baseArc, rev(corner), rev(lower), flip(lower), flip(corner)], true);
  parts.push(`<clipPath id="${id('visor')}"><path d="${band}"/></clipPath>`);
  parts.push(`<path d="${band}" fill="${C.shade}"/>`);
  // Rows of stitching follow the front edge; f = 0 is the front edge, 1 the seam.
  const rows = [];
  for (let i = 0; i < v.rows; i++) {
    const f = v.first + i * v.gap;
    const r = lerpSeg(lower, baseArc, f);
    rows.push(path([flip(rev(r)), r]));
  }
  parts.push(`<g clip-path="url(#${id('visor')})"><path d="${rows.join(' ')}" ${S.stitch}/></g>`);
  parts.push(`<path d="${band}" ${S.outline}/>`);

  // Contrast rope on golf caps: lies on the visor along the seam, ends tucked in towards the visor's sides.
  if (o.rope) parts.push(rope(o.rope));

  function rope(r) {
    const arcY = (x) => seamY + SD * (1 - Math.sqrt(1 - (x / W) ** 2));
    const R = r.radius, reach = r.reach, tuck = r.tuck;
    // Centre line: just above the seam, dipping into it over the last `tuck` mm at each end.
    const pts = [];
    for (let x = -reach; x <= reach + 1e-9; x += 1) {
      const endness = Math.max(0, (Math.abs(x) - (reach - tuck)) / tuck);   // 0 .. 1 over the tucked ends
      pts.push({ x, y: arcY(x) - r.lift + endness * endness * (r.lift + R * 0.6), w: R * (1 - 0.55 * endness * endness) });
    }
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const normal = (i) => {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, pts.length - 1)];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      return pt(dy / d, -dx / d);   // points up (towards the crown)
    };
    const upper = pts.map((p, i) => { const n = normal(i); return pt(p.x + n.x * p.w, p.y + n.y * p.w); });
    const lowerE = pts.map((p, i) => { const n = normal(i); return pt(p.x - n.x * p.w, p.y - n.y * p.w); });
    const endCap = (i, dir) => {   // round end, as a quarter-ellipse pair
      const p = pts[i], n = normal(i), w = p.w, tx = -n.y * dir, ty = n.x * dir;   // tangent pointing outwards
      const a = pt(p.x + n.x * w, p.y + n.y * w), b = pt(p.x - n.x * w, p.y - n.y * w), tip = pt(p.x + tx * w, p.y + ty * w);
      return [[a, pt(a.x + tx * w * KAPPA, a.y + ty * w * KAPPA), pt(tip.x + n.x * w * KAPPA, tip.y + n.y * w * KAPPA), tip],
        [tip, pt(tip.x - n.x * w * KAPPA, tip.y - n.y * w * KAPPA), pt(b.x + tx * w * KAPPA, b.y + ty * w * KAPPA), b]];
    };
    const outline = path([...through(upper), ...endCap(pts.length - 1, 1), ...through(lowerE.slice().reverse()), ...endCap(0, -1)], true);
    // Strands: short slanted bars along the cord, a hair apart, so it reads as a twisted rope.
    const strands = [];
    const total = L[L.length - 1];
    const posAt = (u) => {
      let i = 1;
      while (i < L.length - 1 && L[i] < u) i++;
      const f = (u - L[i - 1]) / (L[i] - L[i - 1]);
      const a = pts[i - 1], b = pts[i], n = normal(i);
      return { p: pt(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f), n, w: a.w + (b.w - a.w) * f, t: pt(-n.y, n.x) };
    };
    for (let u = -r.pitch; u < total + r.pitch; u += r.pitch) {
      const q = posAt(Math.min(Math.max(u, 0), total));
      const off = u - Math.min(Math.max(u, 0), total);
      const c0 = pt(q.p.x + q.t.x * off, q.p.y + q.t.y * off);
      const W2 = q.w * 1.3, s = r.slant, len = r.pitch - r.gap;
      const corner = (du, dv) => pt(c0.x + q.t.x * (du + s * dv) + q.n.x * dv, c0.y + q.t.y * (du + s * dv) + q.n.y * dv);
      const a = corner(0, -W2), b = corner(len, -W2), c = corner(len, W2), d = corner(0, W2);
      strands.push(`M${xy(a)} L${xy(b)} L${xy(c)} L${xy(d)} Z`);
    }
    return `<clipPath id="${id('rope')}"><path d="${outline}"/></clipPath>`
      + `<path d="${outline}" fill="${C.fabric}"/>`
      + `<g clip-path="url(#${id('rope')})"><path d="${strands.join(' ')}" fill="${C.line}"/></g>`
      + `<path d="${outline}" ${S.outline}/>`;
  }

  // Extent: the visor corners are the widest and lowest points.
  let maxX = 0, maxY = 0;
  for (let i = 0; i <= 200; i++) { const p = at(corner, i / 200); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
  for (let i = 0; i <= 200; i++) { const p = at(lower, i / 200); maxY = Math.max(maxY, p.y); }

  return {
    name: o.name,
    category: 'hat',
    w: 2 * (maxX + half),
    h: maxY + half,
    body: parts.join(''),
    anchors: { front: { x: 0, y: seamY - 32 } },
  };
}

module.exports = cap;
module.exports.W = W;
module.exports.VISOR_DEPTH = VISOR_DEPTH;
