// OFF SHFT: "Punched Out." v3, plain type in the brand style (designer A).
// Owner's pick for drop 1 (DESIGNS.md, 29 Oct 2026). Replaces the Archivo Expanded draft in ../ (4.8 mm cap: off-brand
// and under the embroidery floor). Nothing here is drawn by hand: the letters are Unbounded Bold's own outlines.
//
// Variants (all cap 7 mm, the logo's cap height, so the strokes match the logo's letters):
//   one-line          PUNCHED OUT.
//   stacked           PUNCHED over OUT., left-aligned
//   stacked-centred   PUNCHED over OUT., centred
//
// Construction (the logo's rules, from designs/mark/final/the-o/build.cjs and notes.md, using its own helpers):
// - Unbounded Bold (tools/fonts/Unbounded-Bold.ttf), all caps, letter-spacing 0.12 em, each letter one merged outline
//   (the logo's glyphMM: opentype.js outlines unioned with clipper-lib). Advances from kit.text, as in the logo.
// - Kerning on top of the font's spacing, in cap heights (the logo's unit). Measured, then judged on proofs:
//     P-U -0.025   the P's bowl leaves open fabric under it
//     C-H -0.03    the C's mouth opens towards the H
//     E-D -0.02    the E's open right side
//     U-T -0.04    the T's bar overhangs empty fabric
//     T-. -128/750 Unbounded's own T-period kern. It sits in the font's GPOS extension lookups, which opentype.js
//                  1.3.4 does not read, so kit.text drops it; this puts it back (the stop tucks in under the T's bar).
//     D-space -0.03  word space matched to the logo's (its F-space is -0.05 cap; the D and O are rounder)
//   N-C, O-U and H-E are left on the font's own spacing. Unbounded draws B, E and K with a pointed spine; the E here is
//   the font's own (checked against the official Google Fonts release), not redrawn.
// - Full stop: Unbounded's own round period, 2.15 mm across at cap 7 (the logo's dot rule: at least 1.5 mm), in the
//   accent thread: Rust on light fabric, Sun on dark. It's the only accent.
// - Stacked: line gap 3.7 mm (cap line of OUT. to baseline of PUNCHED), so the block is the logo's height (18.0 mm).
//   Left-aligned: the O hangs 0.15 mm past the P's stem, the same overshoot the font gives the O at top and bottom,
//   so the round edge looks flush. Centred: each line on its letters; the full stop hangs, as punctuation does.
//
// Run from /home/user/offshft/tools:  node ../designs/09-punched-out/v3/build.cjs
// Writes <id>-light.svg, <id>-dark.svg (true size, mm) and <id>-proof.png (light version at true size on a
// 110 x 80 mm Bone swatch, 8 px per mm, rendered like the logo's proofs), then prints and checks the measurements.

'use strict';
const path = require('path');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const LOGO = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const U = LOGO.FONTS.unbounded;              // Unbounded Bold, track 0.12 em
const CAP = 7;
const KERN = { PU: -0.025, CH: -0.03, ED: -0.02, UT: -0.04, 'T.': -128 / 750, 'D ': -0.03 };
const LINE_GAP = 3.7;                        // mm, stacked variants
const O_HANG = 0.15;                         // mm, stacked: the O's overshoot past the P's stem
const SEAM_MAX_SHIFT = 6;                    // mm, 6-panel caps: the logo moves 5.2 mm; much more looks off-centre
const COLOURS = {
  light: { letters: LOGO.LIGHT.letters, accent: LOGO.LIGHT.hands },   // Ink + Rust, for Bone and other light fabric
  dark: { letters: LOGO.DARK.letters, accent: LOGO.DARK.hands },      // Bone + Sun, for Slate and Spruce
};
// Placements the owner uses (mm)
const AREAS = { 'hat front': [140, 50], chest: [101.6, 101.6], leg: [101.6, 101.6] };
// Minimums from designs/mark/final/the-o/notes.md, at cap 7
const MIN = {
  cap: 6.6,          // any embroidered Unbounded Bold text
  opening: 1.0,      // S apertures (and the two-colour channel): the smallest opening the logo stitches
  slot: 1.2,         // the logo's F slot is drawn 1.23 mm and finishes at 1.1 mm or more with 0.05 mm comp
  letters: 1.47,     // tightest gap between two letters in the logo (F arm to T bar)
  dot: 1.5,          // pivot-dot rule: at least 1.5 mm across
  dotFabric: 1.3,    // pivot-dot rule: at least 1.3 mm of fabric around it
  stroke: 1.0,       // satin floor; the logo's thinnest stroke is the ring's top and bottom wall, 1.43 mm
};
const n = (v) => (Math.round(v * 1000) / 1000).toString();
const f2 = (v) => Number(v).toFixed(2);

// ---------------------------------------------------------------- setting
// One line of text, letter by letter, as merged outlines (the logo's restOfWord, with this design's kerning).
function setLine(str, x, baseY) {
  const t = kit.text(str, { font: U.key, cap: CAP, track: U.track, x: 0, y: 0 });
  const glyphs = [];
  let shift = 0;
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && KERN[str[i - 1] + str[i]]) shift += KERN[str[i - 1] + str[i]] * CAP;
    if (str[i] === ' ') continue;
    const g = LOGO.glyphMM(U, str[i], x + t.letters[i].x + shift, baseY, CAP);
    const polys = g.d.split('M').filter(Boolean).map((s) => s.replace(/Z\s*$/, '').trim().split(' L').map((p) => p.trim().split(/\s+/).map(Number)));
    glyphs.push({ ch: str[i], d: g.d, polys, box: boxOf(g.pts) });
  }
  return glyphs;
}
const boxOf = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const boxOfAll = (gs) => ({ x0: Math.min(...gs.map((g) => g.box.x0)), y0: Math.min(...gs.map((g) => g.box.y0)), x1: Math.max(...gs.map((g) => g.box.x1)), y1: Math.max(...gs.map((g) => g.box.y1)) });
const lettersOnly = (gs) => gs.filter((g) => g.ch !== '.');

function oneLine() {
  return [setLine('PUNCHED OUT.', 0, 0)];
}
function stacked(align) {
  const top = setLine('PUNCHED', 0, 0);
  const probe = setLine('OUT.', 0, 0);
  let dx;
  if (align === 'left') dx = top[0].box.x0 - O_HANG - probe[0].box.x0;
  else { const a = boxOfAll(top), b = boxOfAll(lettersOnly(probe)); dx = (a.x0 + a.x1) / 2 - (b.x0 + b.x1) / 2; }
  return [top, setLine('OUT.', dx, LINE_GAP + CAP)];
}

const VARIANTS = [
  { id: 'one-line', name: 'One line', lines: oneLine() },
  { id: 'stacked', name: 'Stacked, left-aligned', lines: stacked('left') },
  { id: 'stacked-centred', name: 'Stacked, centred', lines: stacked('centre') },
];

function svgBody(lines, c) {
  const all = lines.flat(), b = boxOfAll(all);
  const ink = all.filter((g) => g.ch !== '.').map((g) => g.d).join(' ');
  const stop = all.filter((g) => g.ch === '.').map((g) => g.d).join(' ');
  return {
    w: b.x1 - b.x0, h: b.y1 - b.y0,
    body: `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})"><path id="letters" fill="${c.letters}" fill-rule="evenodd" d="${ink}"/><path id="full-stop" fill="${c.accent}" d="${stop}"/></g>`,
  };
}

// ---------------------------------------------------------------- measuring
// Every stroke and gap, measured along the outline's normals: from points every 0.05 mm on each outline, a ray inwards
// (stroke width) and a ray outwards (the gap to the next stitches, in this letter or another). A width is two edges that
// face each other, so a ray only counts when the edge it hits runs within 30 degrees of the edge it left; anything else
// cuts across a corner (the E's and C's 81-84 degree outer corners, the C's terminal cuts, the N's crotches). Sharp
// inside corners are listed separately.
function edgesOf(glyphs) {
  const edges = [];
  glyphs.forEach((g, gi) => g.polys.forEach((poly, ci) => {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len > 1e-9) edges.push({ gi, ci, va: i, vb: (i + 1) % poly.length, ax: a[0], ay: a[1], bx: b[0], by: b[1], len });
    }
  }));
  return edges;
}
const neighbours = (e, h) => e.gi === h.gi && e.ci === h.ci && (h.va === e.vb || h.vb === e.va);
const facing = (e, h) => Math.abs((e.bx - e.ax) * (h.bx - h.ax) + (e.by - e.ay) * (h.by - h.ay)) / (e.len * h.len) > Math.cos(Math.PI / 6);
const counts = (e, r) => r.hit && !neighbours(e, r.hit.e) && facing(e, r.hit.e);
function inside(g, x, y) {
  let c = false;
  for (const poly of g.polys) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function ray(px, py, dx, dy, edges, skip) {
  let best = Infinity, hit = null;
  for (const e of edges) {
    if (e === skip) continue;
    const ex = e.bx - e.ax, ey = e.by - e.ay, den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const qx = e.ax - px, qy = e.ay - py;
    const t = (qx * ey - qy * ex) / den, u = (qx * dy - qy * dx) / den;
    if (t > 1e-6 && u >= 0 && u <= 1 && t < best) { best = t; hit = { e, u }; }
  }
  return { t: best, hit };
}
function scan(glyphs) {
  const edges = edgesOf(glyphs);
  const byGlyph = glyphs.map((_, gi) => edges.filter((q) => q.gi === gi));
  const strokes = glyphs.map(() => ({ w: Infinity, at: null }));
  const gaps = [];
  for (const e of edges) {
    const g = glyphs[e.gi], m = Math.max(1, Math.ceil(e.len / 0.05));
    let nx = -(e.by - e.ay) / e.len, ny = (e.bx - e.ax) / e.len;
    const mx = (e.ax + e.bx) / 2, my = (e.ay + e.by) / 2;
    if (!inside(g, mx + nx * 1e-3, my + ny * 1e-3)) { nx = -nx; ny = -ny; }     // (nx, ny) points into the ink
    const own = byGlyph[e.gi];
    for (let i = 0; i < m; i++) {
      const u = (i + 0.5) / m, px = e.ax + (e.bx - e.ax) * u, py = e.ay + (e.by - e.ay) * u;
      const s = ray(px, py, nx, ny, own, e);
      if (counts(e, s) && s.t < strokes[e.gi].w) strokes[e.gi] = { w: s.t, at: [px, py] };
      const o = ray(px, py, -nx, -ny, edges, e);
      if (counts(e, o)) gaps.push({ w: o.t, a: e.gi, b: o.hit.e.gi, at: [px, py] });
    }
  }
  return { strokes, gaps };
}
// Sharp inside corners (fabric-side angle under 60 degrees), e.g. the N's crotches.
function acuteCorners(glyphs) {
  const out = [];
  for (const g of glyphs) for (const P of g.polys) for (let i = 0; i < P.length; i++) {
    const v = P[i], p = P[(i + P.length - 1) % P.length], q = P[(i + 1) % P.length];
    const ax = p[0] - v[0], ay = p[1] - v[1], bx = q[0] - v[0], by = q[1] - v[1], la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < 1e-6 || lb < 1e-6) continue;
    let ang = (Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)))) * 180) / Math.PI;
    const mx = ax / la + bx / lb, my = ay / la + by / lb, ml = Math.hypot(mx, my);
    if (ml < 1e-9) continue;
    if (inside(g, v[0] + (mx / ml) * 0.01, v[1] + (my / ml) * 0.01)) ang = 360 - ang;   // bisector in the ink: fabric side is the reflex angle
    if (ang < 60) out.push({ ch: g.ch, angle: ang });
  }
  return out;
}
// Exact closest distance between two outlines (segment to segment).
function segDist(a, b, c, d) {
  const pd = (p, q, r) => { const vx = r[0] - q[0], vy = r[1] - q[1], L2 = vx * vx + vy * vy; let t = L2 ? ((p[0] - q[0]) * vx + (p[1] - q[1]) * vy) / L2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - q[0] - t * vx, p[1] - q[1] - t * vy); };
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  if (o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0) return 0;
  return Math.min(pd(a, c, d), pd(b, c, d), pd(c, a, b), pd(d, a, b));
}
function closest(g, h) {
  let best = Infinity;
  for (const P of g.polys) for (let i = 0; i < P.length; i++) for (const Q of h.polys) for (let j = 0; j < Q.length; j++)
    best = Math.min(best, segDist(P[i], P[(i + 1) % P.length], Q[j], Q[(j + 1) % Q.length]));
  return best;
}
// Crossings of a glyph's outline with a vertical line x (sorted y) or horizontal line y (sorted x).
function cross(g, { x, y }) {
  const out = [];
  for (const P of g.polys) for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    if (x !== undefined && (a[0] - x) * (b[0] - x) < 0) out.push(a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]));
    if (y !== undefined && (a[1] - y) * (b[1] - y) < 0) out.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
  }
  return out.sort((p, q) => p - q);
}
const runs = (c) => { const r = []; for (let i = 0; i + 1 < c.length; i++) r.push(c[i + 1] - c[i]); return r; };   // ink, gap, ink, ...

function measure(v) {
  const all = v.lines.flat(), b = boxOfAll(all);
  const by = (ch) => all.find((g) => g.ch === ch);
  const E = by('E'), C = by('C'), T = all.filter((g) => g.ch === 'T')[0], dot = by('.');
  const eRuns = runs(cross(E, { x: E.box.x0 + 0.62 * (E.box.x1 - E.box.x0) }));             // arm, slot, arm, slot, arm
  const cRuns = runs(cross(C, { x: C.box.x1 - 0.5 }));                                        // stroke, aperture, stroke
  const tBar = runs(cross(T, { x: T.box.x0 + 0.5 }))[0];
  const sc = scan(all);
  const stroke = sc.strokes.map((s, i) => ({ ...s, ch: all[i].ch })).filter((s) => s.ch !== '.').sort((p, q) => p.w - q.w)[0];
  const inner = sc.gaps.filter((g) => g.a === g.b).sort((p, q) => p.w - q.w).map((g) => ({ ...g, ch: all[g.a].ch }))[0];
  // neighbours on each line, plus line to line
  const pairs = [];
  for (const line of v.lines) for (let i = 0; i + 1 < line.length; i++) pairs.push({ p: line[i].ch + line[i + 1].ch, w: closest(line[i], line[i + 1]) });
  const letterPairs = pairs.filter((p) => !p.p.includes('.')).sort((p, q) => p.w - q.w);
  const lineGap = v.lines.length === 2 ? Math.min(...v.lines[0].flatMap((g) => v.lines[1].map((h) => closest(g, h)))) : null;
  const dotInk = Math.min(...all.filter((g) => g !== dot).map((g) => closest(dot, g)));
  // word space (one line): D to O, at the closest points
  const D = by('D'), O = by('O');
  const wordSpace = v.lines.length === 1 ? closest(D, O) : null;
  // 6-panel caps: the logo moves 5.2 mm so the centre seam runs through its word space, not a letter. Here: the
  // vertical channel clear of every line's letters (at least 1.6 mm wide) nearest the centre, seam in its middle,
  // within SEAM_MAX_SHIFT of the centre.
  let free = [[-Infinity, Infinity]];
  for (const line of v.lines) {
    const lf = [];
    let x = -Infinity, prev = '';
    for (const g of [...line].sort((p, q) => p.box.x0 - q.box.x0)) {
      if (g.box.x0 > x) lf.push([x, g.box.x0, prev + '|' + g.ch]);
      if (g.box.x1 > x) { x = g.box.x1; prev = g.ch; }
    }
    lf.push([x, Infinity, prev + '|']);
    free = free.flatMap(([a, z, ...ws]) => lf.map(([c, d, w]) => [Math.max(a, c), Math.min(z, d), ...ws, w]).filter(([p, q]) => q > p));
  }
  const cx = (b.x0 + b.x1) / 2;
  const channel = free.filter(([a, z]) => a > b.x0 && z < b.x1 && z - a >= 1.6 && Math.abs((a + z) / 2 - cx) <= SEAM_MAX_SHIFT).sort((p, q) => Math.abs((p[0] + p[1]) / 2 - cx) - Math.abs((q[0] + q[1]) / 2 - cx))[0];
  const seam = channel ? { shift: (channel[0] + channel[1]) / 2 - cx, width: channel[1] - channel[0], where: channel.slice(2) } : null;
  return {
    w: b.x1 - b.x0, h: b.y1 - b.y0, cap: CAP,
    stem: LOGO.strokes(U.key, CAP).stem, arm: LOGO.strokes(U.key, CAP).arm,
    eArms: [eRuns[0], eRuns[2], eRuns[4]], eSlots: [eRuns[1], eRuns[3]], cAperture: cRuns[1], tBar,
    thinnest: stroke, innerGap: inner, acute: acuteCorners(all), letterPairs, lineGap, wordSpace,
    dot: { w: dot.box.x1 - dot.box.x0, h: dot.box.y1 - dot.box.y0, ink: dotInk },
    seam,
  };
}

function checks(m) {
  const fails = [];
  const need = (ok, what) => { if (!ok) fails.push(what); };
  need(m.cap >= MIN.cap, `cap ${m.cap} < ${MIN.cap}`);
  need(m.cAperture >= MIN.opening, `C aperture ${f2(m.cAperture)} < ${MIN.opening}`);
  need(Math.min(...m.eSlots) >= MIN.slot, `E slots ${m.eSlots.map(f2)} < ${MIN.slot}`);
  need(m.innerGap.w >= MIN.opening, `an opening in ${m.innerGap.ch} is ${f2(m.innerGap.w)} mm`);
  need(m.letterPairs[0].w >= MIN.letters, `${m.letterPairs[0].p} gap ${f2(m.letterPairs[0].w)} < ${MIN.letters}`);
  need(m.lineGap === null || m.lineGap >= MIN.letters, `line to line ${f2(m.lineGap)} < ${MIN.letters}`);
  need(m.dot.w >= MIN.dot && m.dot.h >= MIN.dot, `full stop ${f2(m.dot.w)} mm < ${MIN.dot}`);
  need(m.dot.ink >= MIN.dotFabric, `full stop has ${f2(m.dot.ink)} mm to the letters < ${MIN.dotFabric}`);
  need(m.thinnest.w >= MIN.stroke, `stroke in ${m.thinnest.ch} ${f2(m.thinnest.w)} < ${MIN.stroke}`);
  return fails;
}

function seamText(m) {
  if (!m.seam) return `no gap runs clear through both lines within ${SEAM_MAX_SHIFT} mm of the centre, so the seam would cross a letter: use a 5-panel or seamless front`;
  const nm = (c) => (c === '.' ? 'the full stop' : c);
  const where = m.seam.where.map((w) => { const [a, z] = w.split('|'); return z ? `between ${nm(a)} and ${nm(z)}` : `past ${nm(a)}`; });
  return `move it ${f2(Math.abs(m.seam.shift))} mm ${m.seam.shift > 0 ? 'left' : 'right'} so the centre seam runs ${where.join(', and ')} (a ${f2(m.seam.width)} mm channel)`;
}

function fits(m) {
  return Object.entries(AREAS).map(([k, [W, H]]) => `${k} ${m.w <= W && m.h <= H ? `fits (${f2((W - m.w) / 2)} mm spare each side)` : 'does not fit'}`).join('; ');
}

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  let failed = false;
  for (const v of VARIANTS) {
    const files = {};
    for (const [tone, c] of Object.entries(COLOURS)) {
      files[tone] = path.join(OUT, `${v.id}-${tone}.svg`);
      kit.writeSvg(files[tone], svgBody(v.lines, c));
    }
    const d = svgBody(v.lines, COLOURS.light);
    await kit.render(files.light, path.join(OUT, `${v.id}-proof.png`), { bg: kit.F.bone, tile: '110x80', px: 8, width: +d.w.toFixed(3) });
    const m = measure(v);
    v.m = m;
    const fails = checks(m);
    if (fails.length) failed = true;
    const thin = m.thinnest, gap = m.innerGap;
    console.log(`\n${v.id}: ${f2(m.w)} x ${f2(m.h)} mm at cap ${m.cap}`);
    console.log(`  fits: ${fits(m)}`);
    console.log(`  strokes: stem ${f2(m.stem)}, arm ${f2(m.arm)}, T bar ${f2(m.tBar)}, E arms ${m.eArms.map(f2).join(' / ')}; thinnest anywhere ${f2(thin.w)} (${thin.ch})`);
    console.log(`  openings: C aperture ${f2(m.cAperture)}, E slots ${m.eSlots.map(f2).join(' / ')}; smallest inside any letter ${f2(gap.w)} (${gap.ch}); sharp inside corners: ${m.acute.map((a) => `${a.ch} ${a.angle.toFixed(0)} deg`).join(', ') || 'none'}`);
    console.log(`  letter gaps: tightest ${m.letterPairs.slice(0, 3).map((p) => `${p.p} ${f2(p.w)}`).join(', ')}${m.wordSpace ? `; word space D-O ${f2(m.wordSpace)}` : ''}${m.lineGap ? `; line to line ${f2(m.lineGap)}` : ''}`);
    console.log(`  full stop: ${f2(m.dot.w)} x ${f2(m.dot.h)} mm, ${f2(m.dot.ink)} mm from the nearest letter`);
    console.log(`  6-panel caps: ${seamText(m)}`);
    console.log(`  checks: ${fails.length ? 'FAILED: ' + fails.join('; ') : 'all pass'}`);
  }
  await kit.close();
  const L7 = LOGO.lockup(U, CAP, LOGO.LIGHT);
  console.log(`\nlogo at cap ${CAP}: ${f2(L7.w)} x ${f2(L7.h)} mm`);
  // Everything here scales with the cap height, so the one line at the 6.6 mm floor is simply this much narrower.
  const one = VARIANTS[0].m;
  console.log(`one-line at the cap 6.6 floor would be ${f2((one.w * 6.6) / CAP)} x ${f2((one.h * 6.6) / CAP)} mm (not drawn: at cap 7 it is well under the 140 mm hat front)`);
  if (failed) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { setLine, VARIANTS, KERN, LINE_GAP, O_HANG, measure };
