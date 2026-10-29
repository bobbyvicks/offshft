// Bucket hat, one size, unstructured cotton twill (Printful sells the Big Accessories BX003; resellers list its band as
// 58 cm). A crown 85 mm tall at the centre front: straight sides tapering in a little to a flat top, with two sewn
// eyelets on each side. A soft brim, 57 mm (2 1/4 in) deep all round, slopes down from the crown and droops more towards
// its edge, with 9 rows of stitching. The crown is drawn the common way, a top panel on a side band of four panels,
// every seam topstitched; the BX003's panel layout and brim stitching aren't confirmed (one reseller calls it 6-panel).
// No centre seam, so the logo goes in the middle of the crown front.
//
// Seen the way the caps are (_cap.cjs): straight on, from just below the hat band. A circle round the hat shows as an
// arc: the brim seam rises to the centre front by SD, as a cap's crown base does, and the top seam a little less; the
// brim's edge hangs below the eye line, so it dips, and the rows of stitching between them go from one to the other.
// Built for the wearer's left (+x) and mirrored; mm, y down, y = 0 at the top of the crown.
//
// At true size the brim sets the width: drawn sloping 55 degrees below level at the seam and 72 at the edge, the hat is
// 235 mm across, near the widest a hat can be on the picker's canvas (kit.compose allows 760 px, 237.5 mm at HAT_PX):
// to fit, the brim has to slope 62.4 degrees on average. A brim at a steady 45 degrees, the natural look, would make it
// 265 mm (849 px): with a canvas of 900 px, or HAT_PX 2.86, set brim.from and brim.to to 45.
'use strict';
const G = require('./_bezier.cjs');
const { V, add, sub, mul, C, L } = G;

const KAPPA = 0.5523;   // cubic handle for a quarter ellipse
const rad = (deg) => (deg * Math.PI) / 180;

const SPEC = {
  band: 92,       // crown half-width at the brim seam (a 58 cm band)
  crown: 85,      // crown height at the centre front, brim seam to the top
  sd: 6,          // how far the brim seam rises to the centre front
  // The top of the crown: the top seam's half-width, at the middle of the corner where the side band turns into the
  // top panel; the corner's radius; how much the top arches up from the corners to the centre; and how much of the top
  // panel shows above the top seam at the centre front, seen from just below. The sides run straight from the brim seam
  // up to the corner.
  top: { halfW: 74, corner: 9, arch: 1.5, sliver: 1.2 },
  seamAz: 45,     // the side band's seams, either side of the front panel (0 = centre front, 90 = the outline)
  eyelets: { az: [57, 71], below: 22 },   // two each side, on the side panels, this far below the top seam
  logo: 38,       // the front anchor: this far above the brim seam at the centre front
  // Brim: depth along it; slope below level at the seam and at the edge (degrees); how far the edge dips at the centre
  // front; rows of stitching: the first this far in from the edge, then one every gap.
  brim: { depth: 57, from: 55, to: 72, dip: 9, rows: 9, first: 3, gap: 6.3 },
};

// Bisection: parameter t on segment s where y reaches v (s must run one way in y).
function tAtY(s, v) {
  let lo = 0, hi = 1;
  const up = s.d.y > s.a.y;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((G.pt(s, mid).y < v) === up) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

module.exports = (kit) => {
  const S = kit.strokes(kit.HAT_PX);
  const { fabric, shade } = kit.STYLE;
  const half = kit.mm(kit.STYLE.lineW, kit.HAT_PX) / 2;   // half an outline, so w and h include the drawn line
  const id = (s) => `bucket-hat-${s}`;
  const sp = SPEC;
  const out = [];
  const draw = (ch, attrs) => out.push(`<path d="${ch.map((c) => G.pathD(c)).join('')}" ${attrs}/>`);
  const clipped = (clip, ch, attrs) => out.push(`<g clip-path="url(#${id(clip)})"><path d="${ch.map((c) => G.pathD(c)).join('')}" ${attrs}/></g>`);

  // ---------- crown ----------
  const top = half;
  const bandC = top + sp.crown;        // brim seam at the centre front
  const bandY = bandC + sp.sd;         // ... and at the sides
  const B = V(sp.band, bandY);
  // The outline (the crown seen at azimuth 90), right half, from the top centre to the brim seam: the top's gentle arch,
  // the corner (a circle of radius r round O; psi = 0 at its top, 90 at its outer side), and the straight side, which
  // leaves the corner along its tangent and runs down to the brim seam. The top seam is halfway round the corner.
  const tp = sp.top, r = tp.corner;
  const onCorner = (O, psi) => add(O, mul(V(Math.sin(psi), -Math.cos(psi)), r));
  const along = (psi) => V(Math.cos(psi), Math.sin(psi));                       // the corner's direction at psi
  const arc = (O, p0, p1) => {                                                  // the corner from psi p0 to p1
    const a = onCorner(O, p0), d = onCorner(O, p1), k = (4 / 3) * Math.tan((p1 - p0) / 4) * r;
    return C(a, add(a, mul(along(p0), k)), sub(d, mul(along(p1), k)), d);
  };
  const beta = Math.atan((2 * tp.arch) / (tp.halfW - r * Math.SQRT1_2));        // the arch's slope where it meets the corner
  const O = V(tp.halfW - r * Math.SQRT1_2, top + tp.arch + r * Math.cos(beta));
  let lo = Math.PI / 4, hi = Math.PI / 2;                                       // where the side leaves the corner
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (G.cross(along(mid), sub(B, onCorner(O, mid))) > 0) lo = mid;
    else hi = mid;
  }
  const psiA = (lo + hi) / 2, Rt = onCorner(O, beta), A = onCorner(O, psiA);
  const topArch = C(V(0, top), V(Rt.x / 3, top), sub(Rt, mul(along(beta), Rt.x / 3)), Rt);
  const side = [arc(O, Math.PI / 4, psiA), L(A, B)];                             // top seam to brim seam
  const prof = [topArch, arc(O, beta, Math.PI / 4)].concat(side);
  const Sh = side[0].a;                                                          // the top seam on the outline
  const riseTop = Sh.y - top - tp.sliver;                                        // the top seam's rise to the centre front
  const outline = G.reverse(G.mirror(prof)).concat(prof);                        // brim seam to brim seam, over the top

  // A point of the side band carried round to azimuth az: x scaled by sin(az), and raised by the rise of its circle,
  // which runs from the top seam's to the brim seam's. The map is affine, so a seam is the side's cubics with their
  // points moved: it stays at sin(az) of the crown's width at every height.
  const rise = (y) => riseTop + ((sp.sd - riseTop) * (y - Sh.y)) / (B.y - Sh.y);
  const onCrown = (p, az) => V(p.x * Math.sin(az), p.y - rise(p.y) * Math.cos(az));
  const round = (ch, az) => ch.map((s) => C(onCrown(s.a, az), onCrown(s.b, az), onCrown(s.c, az), onCrown(s.d, az)));
  // A circle round the hat through the outline point p, seen from the front: left to right, rising r at the centre.
  const hoop = (p, rr) => {
    const right = C(V(0, p.y - rr), V(KAPPA * p.x, p.y - rr), V(p.x, p.y - KAPPA * rr), p);
    return G.reverse(G.mirror([right])).concat([right]);
  };
  const seamBand = hoop(B, sp.sd);   // the brim seam
  const crownShape = G.pathD(outline.concat(G.reverse(seamBand)), true);
  out.push(`<clipPath id="${id('crown')}"><path d="${crownShape}"/></clipPath>`);
  out.push(`<path d="${crownShape}" fill="${fabric}"/>`);

  // Top seam, with its topstitching on the side band just below it.
  const ROW = 2.2;
  const rowP = G.along(side, [ROW / G.arc(side)])[0];
  clipped('crown', [hoop(Sh, riseTop)], S.outline);
  clipped('crown', [hoop(rowP, rise(rowP.y))], S.stitch);

  // Side band seams, from the top seam down to the brim seam, topstitched both sides (as on the caps). The stitching
  // runs from the top seam's row of stitching down.
  const below = G.trimMM(side, ROW, 0);
  for (const sgn of [1, -1]) {
    const az = sgn * rad(sp.seamAz);
    draw([round(side, az)], S.outline);
    const d = 1.6 / (sp.band * Math.cos(az));
    draw([round(below, az - d), round(below, az + d)], S.stitch);
  }

  // Sewn eyelets: a circle on the side band, projected (so it foreshortens towards the outline), as on the caps.
  const ey = Sh.y + sp.eyelets.below;
  const seg = side.find((s) => (s.a.y - ey) * (s.d.y - ey) <= 0);
  const t = tAtY(seg, ey);
  const p = G.pt(seg, t), dp = G.deriv(seg, t), dl = Math.hypot(dp.x, dp.y);
  const slopeRise = (sp.sd - riseTop) / (B.y - Sh.y);
  for (const deg of sp.eyelets.az) for (const sgn of [1, -1]) {
    const az = sgn * rad(deg);
    const c = onCrown(p, az);
    const U = V(Math.cos(az), (rise(p.y) * Math.sin(az)) / p.x);                                   // round the hoop
    const W = V((dp.x * Math.sin(az)) / dl, (dp.y * (1 - slopeRise * Math.cos(az))) / dl);         // down the side band
    const a = U.x * U.x + W.x * W.x, b = U.x * U.y + W.x * W.y, e = U.y * U.y + W.y * W.y;
    const m = (a + e) / 2, q = Math.sqrt(((a - e) / 2) ** 2 + b * b);
    const ang = (Math.atan2(2 * b, a - e) / 2) * (180 / Math.PI);
    const ell = (rr, fill) => `<ellipse cx="${G.num(c.x)}" cy="${G.num(c.y)}" rx="${G.num(rr * Math.sqrt(m + q))}" ry="${G.num(rr * Math.sqrt(Math.max(m - q, 0)))}" transform="rotate(${G.num(ang)} ${G.num(c.x)} ${G.num(c.y)})" ${S.fill(fill)}/>`;
    out.push(ell(3.3, fabric), ell(1.25, shade));
  }
  draw([outline], S.outline);

  // ---------- brim ----------
  // Its profile at the side: leaves the seam at `from` degrees below level and turns down to `to` at the edge, as a soft
  // brim droops; E is the edge. The slope turns evenly along the brim, which puts E here.
  const br = sp.brim, a0 = rad(br.from), a1 = rad(br.to);
  const E = a1 > a0
    ? add(B, V((br.depth * (Math.sin(a1) - Math.sin(a0))) / (a1 - a0), (br.depth * (Math.cos(a0) - Math.cos(a1))) / (a1 - a0)))
    : add(B, mul(V(Math.cos(a0), Math.sin(a0)), br.depth));
  const h = Math.hypot(E.x - B.x, E.y - B.y) * 0.36;
  const profile = C(B, add(B, mul(V(Math.cos(a0), Math.sin(a0)), h)), sub(E, mul(V(Math.cos(a1), Math.sin(a1)), h)), E);
  const edge = hoop(E, -br.dip);
  const brim = seamBand.concat([profile], G.reverse(edge), G.reverse(G.mirror([profile])));
  const brimShape = G.pathD(brim, true);
  out.push(`<clipPath id="${id('brim')}"><path d="${brimShape}"/></clipPath>`);
  out.push(`<path d="${brimShape}" fill="${fabric}"/>`);
  // Rows of stitching: circles round the brim, br.first in from the edge and then every br.gap, each rising or dipping
  // at the centre front by its share of the way from the seam to the edge.
  const plen = G.arc([profile]);
  const rows = [];
  for (let i = 0; i < br.rows; i++) {
    const q = G.along([profile], [1 - (br.first + i * br.gap) / plen])[0];
    rows.push(hoop(q, sp.sd - ((sp.sd + br.dip) * (q.y - B.y)) / (E.y - B.y)));
  }
  clipped('brim', rows, S.stitch);
  out.push(`<path d="${brimShape}" ${S.outline}/>`);

  return {
    name: 'bucket-hat',
    category: 'hat',
    w: 2 * (E.x + half),
    h: E.y + br.dip + half,
    body: out.join(''),
    // The middle of the crown front, a little low (as on the caps): sp.logo above the brim seam at the centre front.
    anchors: { front: { x: 0, y: bandC - sp.logo } },
  };
};
