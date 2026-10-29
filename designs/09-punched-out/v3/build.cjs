// OFF SHFT: "Punched Out." v3, plain type in the brand style.
// Owner's pick for drop 1 (DESIGNS.md, 29 Oct 2026). Replaces the Archivo Expanded draft in ../ (4.8 mm cap: off-brand
// and under the embroidery floor). Nothing is drawn by hand: the letters are Unbounded Bold's own outlines, with the
// changes listed under "Letters" below.
//
// Masters, at cap 7 mm (the logo's cap height, so the strokes match the logo's letters):
//   one-line          PUNCHED OUT.                   hat fronts
//   stacked-centred   PUNCHED over OUT., centred     the logo's footprint: left chest, leg, and hats as a block
// and one-line-large: the one line drawn at cap 16.5 (229.8 mm wide) for the big centre front of the hoodies and the
// crewneck (store/picks.md, the owner's call of 29 Oct 2026). It's its own drawing, not a scaled copy.
// Dropped in review (files in git, commit f221242): "stacked", left-aligned (Mulligan Monday's rejected layout, and
// lopsided wherever it's centred), and designer B's "clock-o" (it repeats the logo's clock, reads "QUT.", 27 mm tall).
//
// Construction (the logo's rules, from designs/mark/final/the-o/build.cjs and notes.md, using its own helpers):
// - Unbounded Bold (tools/fonts/Unbounded-Bold.ttf), all caps, letter-spacing 0.12 em, each letter one merged outline
//   (the logo's glyphMM: opentype.js outlines unioned with clipper-lib). Advances from kit.text, as in the logo.
// - Kerning on top of the font's spacing, in cap heights (the logo's unit). Measured, then judged on proofs:
//     P-U -0.025   the P's bowl leaves open fabric under it
//     C-H -0.03    the C's mouth opens towards the H
//     E-D -0.02    the E's open right side
//     U-T -0.04    the T's bar overhangs empty fabric (U-T is then 1.58 mm, bar end to stem top, like the logo's F-T)
//     T-. -128/750 Unbounded's own T-period kern. It sits in the font's GPOS extension lookups, which opentype.js
//                  1.3.4 does not read, so kit.text drops it; this puts it back. The stop sits just past the end of
//                  the T's bar (0.4 mm), 3.1 mm from its stem.
//     D-space -0.03  word space matched to the logo's (its F-space is -0.05 cap; the D and O are rounder)
//   N-C, O-U and H-E are left on the font's own spacing.
// - Letters: a per-letter table passed to the logo's glyphMM (the logo itself passes none, so its output is unchanged).
//     E  redrawn with a straight stem. Unbounded draws its E with a bent, pointed stem (left edge 47 -> 104 -> 47 font
//        units). The logo has no E, so the brand had never shown it, and all four cold readers of the first v3 proofs
//        took it for a glitch ("sigma", "backwards 3", "broken E"). Built from the font's own numbers: the F's and H's
//        stem (x 70-277) with the E's own arms (out to x 739 and 744) and bar (x 162-711, y 300-450). The advance is
//        unchanged, so the left side bearing is 70, as on F and H. e-compare.png shows both.
//     E  slots: the top arm's underside raised and the bottom arm's top lowered, so each slot is 146 units (1.36 mm at
//        cap 7) instead of 132 (1.23 mm). The bar keeps its 150 units (1.40 mm); the arms become 154 (1.44 mm).
//     C  mouth: each terminal's slot face trimmed so the mouth is 150 units (1.40 mm at cap 7) instead of 122 (1.14 mm).
//        The cut runs from the C's axis outwards; inside the counter there's no ink at those heights, so the new face
//        meets the counter's curve with no step.
//   The two trims are what cap 7 needs: both openings at least 1.27 mm as drawn (0.05 in, the minimum gap in
//   Printful's embroidery guide), so they still finish at 0.9-1.0 mm or more after pull compensation. Like the logo's
//   S trim they depend on the cap height: they shrink above cap 7 and are 0 from cap 7.75 (E) and 8.6 (C).
// - Full stop: Unbounded's own round period, 2.15 mm across at cap 7 (the logo's dot rule: at least 1.5 mm), in the
//   accent thread: Rust on light fabric, Sun on dark. It's the only accent.
// - Stacked: line gap 3.7 mm at cap 7 (PUNCHED's baseline to OUT.'s cap line), so the block is the logo's height
//   (18.0 mm). OUT is centred on PUNCHED by its letters; the full stop hangs, as punctuation does.
//
// Run from /home/user/offshft/tools:  node ../designs/09-punched-out/v3/build.cjs
// Writes <id>-light.svg and <id>-dark.svg (true size, mm), <id>-proof.png (light, on Bone) and <id>-proof-dark.png
// (dark, on Slate) at true size (8 px per mm; 4 for the large one, rendered like the logo's proofs), e-compare.png,
// variants.json and notes.md. Checks every opening, stroke and gap against the floors below; exits non-zero on a failure.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const LOGO = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const REPO = path.resolve(__dirname, '../../..');
const U = LOGO.FONTS.unbounded;              // Unbounded Bold, track 0.12 em
const CAP = 7;
const LARGE_CAP = 16.5;                      // big centre front: about 230 mm wide (store/picks.md)
const UPC = kit.font(U.key).tables.os2.sCapHeight;   // font units per cap height (750)
const KERN = { PU: -0.025, CH: -0.03, ED: -0.02, UT: -0.04, 'T.': -128 / 750, 'D ': -0.03 };
const LINE_GAP = 3.7 / 7;                    // stacked: baseline to cap line, in cap heights (3.7 mm at cap 7)
const SEAM_MAX_SHIFT = 6;                    // mm, 6-panel caps: the logo moves 5.2 mm; much more looks off-centre
const COLOURS = {
  light: { letters: LOGO.LIGHT.letters, accent: LOGO.LIGHT.hands, bg: kit.F.bone },   // Ink + Rust, for Bone and other light fabric
  dark: { letters: LOGO.DARK.letters, accent: LOGO.DARK.hands, bg: kit.F.slate },     // Bone + Sun, for Slate and Spruce
};
// Placements (mm). Hat fronts and the 101.6 mm squares are from the brief; the big front is the store's box.
const AREAS = { hat: [140, 50], square: [101.6, 101.6], big: [230, 90] };
// Floors, at any size
const MIN = {
  cap: 6.6,          // any embroidered Unbounded Bold text (the logo's notes.md)
  opening: 1.27,     // every opening inside a letter, as drawn: 0.05 in (Printful's minimum gap)
  letters: 1.47,     // tightest gap between two letters in the logo (F arm to T bar)
  dot: 1.5,          // pivot-dot rule: at least 1.5 mm across
  dotFabric: 1.3,    // pivot-dot rule: at least 1.3 mm of fabric around it
  stroke: 1.27,      // 0.05 in (Printful's minimum line); the logo's thinnest stroke is its ring's 1.43 mm top and bottom
};
const n = (v) => (Math.round(v * 1000) / 1000).toString();
const f2 = (v) => Number(v).toFixed(2);
const f1 = (v) => Number(v).toFixed(1);

// ---------------------------------------------------------------- letters
// Unbounded Bold's own numbers, in font units with y up (read from tools/fonts/Unbounded-Bold.ttf).
const FONT = {
  E: { stem: [70, 277], topArm: { y: 582, x1: 739 }, bottomArm: { y: 168, x1: 744 }, bar: [162, 300, 711, 450] },  // stem: F's and H's
  C: { axis: 473, lowerFace: 314, upperFace: 436 },   // the mouth: lower terminal's top, upper terminal's underside
};
const OPEN7 = { cMouth: 150, eSlot: 146 };            // the openings at cap 7 after the trims, in font units
const snap = (u) => Math.round(u * 64) / 64;          // clipper works in 1/64 font units
// The per-letter table for glyphMM at this cap height, and the trims it makes (font units per face).
function letterEdits(cap) {
  const E = FONT.E, C = FONT.C;
  const c = snap(Math.max(0, ((OPEN7.cMouth * CAP) / cap - (C.upperFace - C.lowerFace)) / 2));
  const e = snap(Math.max(0, (OPEN7.eSlot * CAP) / cap - (E.bar[1] - E.bottomArm.y)));
  const edits = {
    E: { draw: [[E.stem[0], 0, E.stem[1], UPC], [E.stem[0], E.topArm.y + e, E.topArm.x1, UPC], [E.stem[0], 0, E.bottomArm.x1, E.bottomArm.y - e], E.bar] },
    C: { cut: c ? [[C.axis, C.upperFace, 2000, C.upperFace + c], [C.axis, C.lowerFace - c, 2000, C.lowerFace]] : [] },
  };
  return { edits, trims: { c, e, cMM: (c * cap) / UPC, eMM: (e * cap) / UPC } };
}

// ---------------------------------------------------------------- setting
// One line of text, letter by letter, as merged outlines (the logo's restOfWord, with this design's kerning and letters).
function setLine(str, x, baseY, cap, edits) {
  const t = kit.text(str, { font: U.key, cap, track: U.track, x: 0, y: 0 });
  const glyphs = [];
  let shift = 0;
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && KERN[str[i - 1] + str[i]]) shift += KERN[str[i - 1] + str[i]] * cap;
    if (str[i] === ' ') continue;
    const g = LOGO.glyphMM(U, str[i], x + t.letters[i].x + shift, baseY, cap, edits);
    const polys = g.d.split('M').filter(Boolean).map((s) => s.replace(/Z\s*$/, '').trim().split(' L').map((p) => p.trim().split(/\s+/).map(Number)));
    glyphs.push({ ch: str[i], d: g.d, polys, box: boxOf(g.pts), base: baseY });
  }
  return glyphs;
}
const boxOf = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const boxOfAll = (gs) => ({ x0: Math.min(...gs.map((g) => g.box.x0)), y0: Math.min(...gs.map((g) => g.box.y0)), x1: Math.max(...gs.map((g) => g.box.x1)), y1: Math.max(...gs.map((g) => g.box.y1)) });
const lettersOnly = (gs) => gs.filter((g) => g.ch !== '.');

function oneLine(cap, edits) {
  return [setLine('PUNCHED OUT.', 0, 0, cap, edits)];
}
function stackedCentred(cap, edits) {
  const top = setLine('PUNCHED', 0, 0, cap, edits);
  const probe = setLine('OUT.', 0, 0, cap, edits);
  const a = boxOfAll(top), b = boxOfAll(lettersOnly(probe));
  return [top, setLine('OUT.', (a.x0 + a.x1) / 2 - (b.x0 + b.x1) / 2, LINE_GAP * cap + cap, cap, edits)];
}
function variant(id, cap, layout, more = {}) {
  const { edits, trims } = letterEdits(cap);
  return { id, cap, trims, lines: layout(cap, edits), ...more };
}

const MASTERS = [
  variant('one-line', CAP, oneLine, {
    name: 'One line',
    description: 'PUNCHED OUT. on one line in the logo\'s type at the logo\'s letter height: Ink letters with a Rust full stop, or Bone with a Sun stop on dark fabric. For hat fronts, and drawn big for the centre front of the hoodies and crewneck.',
  }),
  variant('stacked-centred', CAP, stackedCentred, {
    name: 'Stacked, centred',
    description: 'PUNCHED over OUT., centred, with the full stop hanging past OUT. The logo\'s height and almost its width, for the left chest and the sweatpants leg, or a hat front as a block.',
  }),
];
const LARGE = variant('one-line-large', LARGE_CAP, oneLine);

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
// cuts across a corner (the E's and C's outer corners, the C's terminal tips, the N's crotches). Sharp inside corners
// are listed separately.
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
    // half-open test, so a vertex lying exactly on the line (the font has them at mid-height) counts once
    if (x !== undefined && (a[0] > x) !== (b[0] > x)) out.push(a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]));
    if (y !== undefined && (a[1] > y) !== (b[1] > y)) out.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
  }
  return out.sort((p, q) => p - q);
}
const runs = (c) => { const r = []; for (let i = 0; i + 1 < c.length; i++) r.push(c[i + 1] - c[i]); return r; };   // ink, gap, ink, ...
const inkRuns = (c) => runs(c).filter((_, i) => i % 2 === 0);
// Ink area and its centre (outlines and counters wind opposite ways, as clipper writes them).
function inkCentre(glyphs) {
  let A = 0, X = 0, Y = 0;
  for (const g of glyphs) for (const p of g.polys) for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length], c = x0 * y1 - x1 * y0;
    A += c; X += (x0 + x1) * c; Y += (y0 + y1) * c;
  }
  return { area: Math.abs(A / 2), x: X / (3 * A), y: Y / (3 * A) };
}
// Vertical channels clear of every line's letters (letter boxes), inside the design: where a 6-panel cap's centre
// seam can run without crossing a letter. Each is [x0, x1, 'A|B' per line].
function channels(v, b) {
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
  return free.filter(([a, z]) => a > b.x0 && z < b.x1);
}
// What a seam at x crosses, line by line: the letter, the strokes it cuts and the nearest edge at the letter's mid-height.
function seamAt(v, x) {
  return v.lines.map((line) => {
    const g = line.find((q) => x > q.box.x0 && x < q.box.x1);
    if (!g) return null;
    const mid = (g.box.y0 + g.box.y1) / 2;
    return { ch: g.ch, strokes: inkRuns(cross(g, { x })), near: Math.min(...cross(g, { y: mid }).map((q) => Math.abs(q - x))), fromMiddle: x - (g.box.x0 + g.box.x1) / 2 };
  });
}
// Stitch order: centre out (the letter at the centre, on to the right-hand end, then back from the centre to the left
// end), bottom line first on a stack, as caps are sewn centre out and bottom up; the full stop after the colour change.
function stitchOrder(v, cx) {
  return [...v.lines].reverse().map((line) => {
    const ls = lettersOnly(line).map((g) => ({ ch: g.ch, c: (g.box.x0 + g.box.x1) / 2 }));
    const start = ls.reduce((best, g, i) => (Math.abs(g.c - cx) < Math.abs(ls[best].c - cx) ? i : best), 0);
    return { word: ls.map((g) => g.ch).join(''), right: ls.slice(start).map((g) => g.ch), left: ls.slice(0, start).reverse().map((g) => g.ch) };
  });
}
const orderText = (o) => o.map((l) => `${o.length > 1 ? `${l.word}: ` : ''}${l.right.join(', ')}${l.left.length ? `, then ${l.left.join(', ')}` : ''}`).join('; ');

function measure(v) {
  const cap = v.cap, all = v.lines.flat(), b = boxOfAll(all), k = cap / UPC;
  const by = (ch) => all.find((g) => g.ch === ch);
  const E = by('E'), C = by('C'), T = by('T'), dot = by('.'), D = by('D'), O = by('O');
  const midX = (g) => (g.box.x0 + g.box.x1) / 2;
  const capY = (g, f) => g.base - f * cap;                                      // f cap heights above the baseline
  const eRuns = runs(cross(E, { x: E.box.x0 + 0.62 * (E.box.x1 - E.box.x0) }));   // arm, slot, bar, slot, arm
  const cRuns = runs(cross(C, { x: C.box.x1 - (0.5 * cap) / CAP }));             // terminal, mouth, terminal
  // where the C's mouth begins: the third crossing of a cut just inside the upper terminal, above the mouth
  const cMouthStart = cross(C, { y: C.base - (FONT.C.upperFace + v.trims.c) * k - 0.05 })[2];
  // Stems from horizontal cuts, at a height where each stem stands clear of bars, bowls and the N's diagonal:
  // the first ink run (P, E, D, T), or the first and last (U, N, H)
  const stemAt = { P: [0.22, 1], U: [0.6, 2], N: [0.6, 2], H: [0.22, 2], E: [0.3, 1], D: [0.5, 1], T: [0.3, 1] };
  const stems = [];
  for (const g of lettersOnly(all)) {
    const s = stemAt[g.ch];
    if (!s) continue;
    const r = inkRuns(cross(g, { y: capY(g, s[0]) }));
    stems.push({ ch: g.ch, w: r[0] }); if (s[1] === 2) stems.push({ ch: g.ch, w: r[r.length - 1] });
  }
  const sc = scan(all);
  const thinnest = {};                                          // per letter, in reading order
  sc.strokes.forEach((s, i) => { const ch = all[i].ch; if (ch !== '.' && !(ch in thinnest && thinnest[ch] <= s.w)) thinnest[ch] = s.w; });
  const inner = sc.gaps.filter((g) => g.a === g.b).sort((p, q) => p.w - q.w).map((g) => ({ ...g, ch: all[g.a].ch }))[0];
  const pairs = [];
  for (const line of v.lines) for (let i = 0; i + 1 < line.length; i++) pairs.push({ p: line[i].ch + line[i + 1].ch, w: closest(line[i], line[i + 1]) });
  const letterPairs = pairs.filter((p) => !p.p.includes('.')).sort((p, q) => p.w - q.w);
  const lineGap = v.lines.length === 2 ? Math.min(...v.lines[0].flatMap((g) => v.lines[1].map((h) => closest(g, h)))) : null;
  const dotInk = Math.min(...all.filter((g) => g !== dot).map((g) => closest(dot, g)));
  const cx = (b.x0 + b.x1) / 2;
  const ch6 = channels(v, b).map(([a, z, ...where]) => ({ shift: (a + z) / 2 - cx, width: z - a, where }));
  const near = ch6.filter((c) => Math.abs(c.shift) <= SEAM_MAX_SHIFT).sort((p, q) => q.width - p.width);
  const ink = inkCentre(all);
  return {
    w: b.x1 - b.x0, h: b.y1 - b.y0, cap, k, cx,
    stems: { min: Math.min(...stems.map((s) => s.w)), max: Math.max(...stems.map((s) => s.w)), list: stems },
    thinnest, thinnestAll: Object.entries(thinnest).sort((p, q) => p[1] - q[1])[0],
    eArms: [eRuns[0], eRuns[2], eRuns[4]], eSlots: [eRuns[1], eRuns[3]], cMouth: cRuns[1],
    tBar: inkRuns(cross(T, { x: T.box.x0 + (0.5 * cap) / CAP }))[0],
    hBar: inkRuns(cross(by('H'), { x: midX(by('H')) }))[0],
    cStrokes: inkRuns(cross(C, { x: midX(C) })), uBowl: inkRuns(cross(by('U'), { x: midX(by('U')) })).slice(-1)[0],
    oWalls: [...inkRuns(cross(O, { x: midX(O) })), ...inkRuns(cross(O, { y: (O.box.y0 + O.box.y1) / 2 }))],
    pBowl: inkRuns(cross(by('P'), { x: by('P').box.x0 + 0.4 * (by('P').box.x1 - by('P').box.x0) })),   // the straight part
    dBowl: inkRuns(cross(D, { x: D.box.x0 + 0.4 * (D.box.x1 - D.box.x0) })),
    innerGap: inner, acute: acuteCorners(all), letterPairs, lineGap,
    wordSpace: v.lines.length === 1 ? closest(D, O) : null,
    dot: { w: dot.box.x1 - dot.box.x0, h: dot.box.y1 - dot.box.y0, ink: dotInk, pastBar: dot.box.x0 - T.box.x1 },
    ink: { area: ink.area, dx: ink.x - cx, dy: ink.y - (b.y0 + b.y1) / 2 },
    channels: ch6, seam: near[0] || null, centred: seamAt(v, cx),
    order: stitchOrder(v, cx), trims: v.trims, cMouthStart,
  };
}

function checks(m) {
  const fails = [];
  const need = (ok, what) => { if (!ok) fails.push(what); };
  need(m.cap >= MIN.cap, `cap ${m.cap} < ${MIN.cap}`);
  need(m.cMouth >= MIN.opening, `C mouth ${f2(m.cMouth)} < ${MIN.opening}`);
  need(Math.min(...m.eSlots) >= MIN.opening, `E slots ${m.eSlots.map(f2)} < ${MIN.opening}`);
  need(m.innerGap.w >= MIN.opening, `an opening in ${m.innerGap.ch} is ${f2(m.innerGap.w)} mm`);
  need(m.letterPairs[0].w >= MIN.letters, `${m.letterPairs[0].p} gap ${f2(m.letterPairs[0].w)} < ${MIN.letters}`);
  need(m.lineGap === null || m.lineGap >= MIN.letters, `line to line ${f2(m.lineGap)} < ${MIN.letters}`);
  need(m.dot.w >= MIN.dot && m.dot.h >= MIN.dot, `full stop ${f2(m.dot.w)} mm < ${MIN.dot}`);
  need(m.dot.ink >= MIN.dotFabric, `full stop has ${f2(m.dot.ink)} mm to the letters < ${MIN.dotFabric}`);
  need(m.thinnestAll[1] >= MIN.stroke, `stroke in ${m.thinnestAll[0]} ${f2(m.thinnestAll[1])} < ${MIN.stroke}`);
  return fails;
}

const spare = (m, [W, H]) => (m.w <= W && m.h <= H ? (W - m.w) / 2 : null);
const where = (w) => { const nm = (c) => (c === '.' ? 'the full stop' : `the ${c}`); const [a, z] = w.split('|'); return z ? `between ${nm(a)} and ${nm(z)}` : `past ${nm(a)}`; };

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  let failed = false;
  const report = (v, m) => {
    const fails = checks(m);
    if (fails.length) failed = true;
    const fit = Object.entries(AREAS).map(([a, A]) => `${a} ${A.join('x')}: ${spare(m, A) === null ? 'no' : `${f2(spare(m, A))} mm spare each side`}`).join('; ');
    console.log(`\n${v.id}: ${f2(m.w)} x ${f2(m.h)} mm at cap ${m.cap}; ink ${f1(m.ink.area)} mm2, its centre ${f2(m.ink.dx)} mm right / ${f2(-m.ink.dy)} mm up of the box centre`);
    console.log(`  fits: ${fit}`);
    console.log(`  trims: C ${f2(m.trims.cMM)} mm per face, E ${f2(m.trims.eMM)} mm per slot`);
    console.log(`  strokes: stems ${f2(m.stems.min)}-${f2(m.stems.max)}, H bar ${f2(m.hBar)}, T bar ${f2(m.tBar)}, E arms ${m.eArms.map(f2).join(' / ')}, C ${m.cStrokes.map(f2).join(' / ')}, U bowl ${f2(m.uBowl)}, O ${m.oWalls.map(f2).join(' / ')}, P bowl ${m.pBowl.map(f2).join(' / ')}, D bowl ${m.dBowl.map(f2).join(' / ')}`);
    console.log(`  thinnest per letter: ${Object.entries(m.thinnest).map(([c, w]) => `${c} ${f2(w)}`).join(', ')}`);
    console.log(`  openings: C mouth ${f2(m.cMouth)}, E slots ${m.eSlots.map(f2).join(' / ')}; smallest inside any letter ${f2(m.innerGap.w)} (${m.innerGap.ch}); sharp inside corners: ${m.acute.map((a) => `${a.ch} ${a.angle.toFixed(1)} deg`).join(', ') || 'none'}`);
    console.log(`  letter gaps: ${m.letterPairs.map((p) => `${p.p} ${f2(p.w)}`).join(', ')}${m.wordSpace ? `; word space D-O ${f2(m.wordSpace)}` : ''}${m.lineGap ? `; line to line ${f2(m.lineGap)}` : ''}`);
    console.log(`  full stop: ${f2(m.dot.w)} x ${f2(m.dot.h)} mm, ${f2(m.dot.ink)} mm from the nearest letter, ${f2(m.dot.pastBar)} mm past the T's bar`);
    console.log(`  6-panel: channels ${m.channels.map((c) => `${f2(c.width)} at ${f2(c.shift)} (${c.where.map(where).join(' / ')})`).join('; ') || 'none'}`);
    console.log(`  6-panel, centred: ${m.centred.map((s) => (s ? `${s.ch} (${f2(s.fromMiddle)} from its middle; strokes ${s.strokes.map(f2).join(' / ')}; nearest edge at mid-height ${f2(s.near)})` : 'no letter')).join(' | ')}`);
    console.log(`  stitch order: ${orderText(m.order)}, then the full stop`);
    console.log(`  checks: ${fails.length ? 'FAILED: ' + fails.join('; ') : 'all pass'}`);
  };
  const outputs = [];
  for (const v of [...MASTERS, LARGE]) {
    const files = {};
    for (const [tone, c] of Object.entries(COLOURS)) {
      files[tone] = path.join(OUT, `${v.id}-${tone}.svg`);
      kit.writeSvg(files[tone], svgBody(v.lines, c));
    }
    const large = v === LARGE;
    for (const [tone, c] of Object.entries(COLOURS)) {
      const tile = large ? '290x60' : '110x80';
      const [TW, TH] = tile.split('x').map(Number);
      const d = svgBody(v.lines, c);
      if (d.w > TW - 8 || d.h > TH - 8) throw new Error(`${v.id}: too big for a true-size proof on a ${tile} mm swatch`);
      // width = the design's own width, so kit.render draws it at true size
      await kit.render(files[tone], path.join(OUT, `${v.id}-proof${tone === 'dark' ? '-dark' : ''}.png`), { bg: c.bg, tile, px: large ? 4 : 8, width: +d.w.toFixed(3) });
    }
    v.m = measure(v);
    v.files = files;
    report(v, v.m);
    outputs.push(v);
  }

  // e-compare.png: PUNCHED as the font draws it (top) and as used here (bottom), true size on Bone
  {
    const label = (s, y) => `<text x="0" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="2.4" fill="#6E6A60">${s}</text>`;
    const before = setLine('PUNCHED', 0, 13, CAP, {}), after = setLine('PUNCHED', 0, 33, CAP, letterEdits(CAP).edits);
    const all = [...before, ...after], b = boxOfAll(all);
    const ink = (gs) => `<path fill="${COLOURS.light.letters}" fill-rule="evenodd" d="${gs.map((g) => g.d).join(' ')}"/>`;
    const body = `<g transform="translate(${n(-b.x0)} 0)">${label('As Unbounded draws it', 3)}${ink(before)}${label(`As used: straight E; C mouth ${f2(MASTERS[0].m.cMouth)} mm, E slots ${f2(MASTERS[0].m.eSlots[0])} mm`, 23)}${ink(after)}</g>`;
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'po-')), f = path.join(tmp, 'e-compare.svg');
    kit.writeSvg(f, { w: b.x1 - b.x0, h: 34, body });
    await kit.render(f, path.join(OUT, 'e-compare.png'), { bg: kit.F.bone, tile: '100x60', px: 8 });
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  await kit.close();

  const L7 = LOGO.lockup(U, CAP, LOGO.LIGHT);
  console.log(`\nlogo at cap ${CAP}: ${f2(L7.w)} x ${f2(L7.h)} mm`);

  // variants.json: the cap-7 masters, in the order to show them
  const relp = (f) => path.relative(REPO, f).split(path.sep).join('/');
  const list = MASTERS.map((v) => ({ id: v.id, name: v.name, description: v.description, light: relp(v.files.light), dark: relp(v.files.dark), w: +f2(v.m.w), h: +f2(v.m.h) }));
  fs.writeFileSync(path.join(OUT, 'variants.json'), JSON.stringify(list, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, 'notes.md'), notes(outputs, L7));
  if (failed) process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { setLine, letterEdits, MASTERS, LARGE, KERN, LINE_GAP, measure };

// ---------------------------------------------------------------- notes.md
function notes(vs, logo) {
  const [one, stack, big] = vs.map((v) => v.m);
  const A = one, sz = (m) => `${f2(m.w)} x ${f2(m.h)} mm`;
  const seamOne = one.seam;
  const [sTop, sBottom] = stack.centred;
  const stackCh = stack.seam;                                   // the widest gap through both lines near the centre
  const shrink = (1 - MIN.cap / CAP) * 100;
  const same = (a) => (a.every((q) => f2(q) === f2(a[0])) ? f2(a[0]) : a.map(f2).join(' and '));
  const nAngle = Math.min(...A.acute.filter((a) => a.ch === 'N').map((a) => a.angle));
  const row = (label, fn) => `| ${label} | ${vs.map((v) => fn(v.m)).join(' | ')} |`;
  const thinList = (m) => Object.entries(m.thinnest).map(([c, w]) => `${c} ${f2(w)}`).join(', ');
  return `# Punched Out. (v3)

PUNCHED OUT. in the logo's type: Unbounded Bold, all caps, letter-spacing 0.12 em, at the logo's cap height of 7 mm, so its strokes are the logo's strokes. The only accent is the full stop, in the logo's accent thread: Rust on light fabric, Sun on dark. It replaces the Archivo draft in \`../\` (4.8 mm cap: off-brand and under the 6.6 mm floor).

**This file is written by \`build.cjs\`.** Every number below is measured from the generated artwork. Change \`build.cjs\` and rebuild (\`cd tools && node ../designs/09-punched-out/v3/build.cjs\`); don't edit this file by hand.

## Files

| File | What it is |
|---|---|
| \`one-line-light.svg\`, \`one-line-dark.svg\` | PUNCHED OUT. on one line, ${sz(one)} |
| \`stacked-centred-light.svg\`, \`stacked-centred-dark.svg\` | PUNCHED over OUT., centred, ${sz(stack)} (the logo: ${f2(logo.w)} x ${f2(logo.h)} mm) |
| \`one-line-large-light.svg\`, \`one-line-large-dark.svg\` | The one line drawn for the big centre front of the tops, ${sz(big)} (cap ${f1(big.cap)}) |
| \`*-proof.png\`, \`*-proof-dark.png\` | True-size proofs: the light files on Bone, the dark files on Slate |
| \`e-compare.png\` | PUNCHED as the font draws it, over PUNCHED as drawn here (straight E), at true size |
| \`variants.json\` | The two cap-7 masters, in the order to show them |

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, \`letters\` and \`full-stop\`.

## Where each one goes

| Placement | File | Position |
|---|---|---|
| Hat front, seamless: 5-panel (Otto 31-069), rope cap (BA671) | one-line, or stacked-centred if the owner wants the block | Centred. One line: ${f1(spare(one, AREAS.hat))} mm spare each side of the 140 mm area; stack: ${f1(spare(stack, AREAS.hat))} mm |
| Hat front, 6-panel with a centre seam: trucker (Yupoong 6606), dad hat (6245CM) | one-line | **${f1(Math.abs(seamOne.shift))} mm ${seamOne.shift > 0 ? 'left' : 'right'}** of centre, so the seam runs down the middle of the ${f2(seamOne.width)} mm gap ${seamOne.where.map(where).join('')} (two straight stems), and the ink's centre lands ${f1(Math.abs(one.ink.dx - seamOne.shift))} mm from the seam. ${f1(spare(one, AREAS.hat) - Math.abs(seamOne.shift))} mm still spare on that side |
| Anorak (CO200) left chest | stacked-centred | Centred in the 101.6 mm square: ${f1(spare(stack, AREAS.square))} mm spare each side |
| Sweatpants (1469) front left leg | stacked-centred | As the chest |
| Hoodies (5161, 1567, 1467), crewneck (1466): big centre front | one-line-large | Centred. The owner's call of 29 Oct 2026 (store/picks.md, and the Shopify drafts say "big on the centre front"); the design brief lists the left chest instead, so confirm before digitizing. On the left chest they take stacked-centred, like the anorak |

- **Not the one line on a chest or leg.** It leaves ${f2(spare(one, AREAS.square))} mm each side of 101.6 mm, and shrinking it by more than ${f1(shrink)}% takes the cap under the 6.6 mm floor (at the floor it is still ${f1((one.w * MIN.cap) / CAP)} mm wide).
- **The stack on a 6-panel cap**, if the owner wants the block on every hat: keep it centred, no shift. The seam then crosses the ${sTop.ch} at its middle, through its ${same(sTop.strokes)} mm top and bottom strokes, ${f1(stack.cMouthStart - stack.cx)} mm short of where its mouth begins, and runs down the ${sBottom.ch}'s counter ${f2(sBottom.near)} mm from its left stem, across its ${f2(sBottom.strokes.slice(-1)[0])} mm bowl. No opening sits on the seam, and the ink stays centred (${f2(Math.abs(stack.ink.dx))} mm off). Shifting it to clear the letters doesn't work: the widest gap through both lines near the centre is ${f2(stackCh.width)} mm, ${f2(Math.abs(stackCh.shift))} mm ${stackCh.shift < 0 ? 'left' : 'right'} of centre (${stackCh.where.map(where).join(', and ')}), too narrow to aim a seam at, and it would put the C's terminals and the T's bar end beside the seam. Approve on a sew-out on the 6-panel blank; if the U's stem wavers, use the one line on that hat.
- **Don't scale the stack up to the big front.** At 230 mm wide it would be ${f1((stack.h * 230) / stack.w)} mm tall with ${f1((230 / stack.w) * CAP)} mm caps. If the owner wants a block there, build it at cap ${f1(LARGE_CAP)} like the one line (about ${f1((stack.w * LARGE_CAP) / CAP)} x ${f1((stack.h * LARGE_CAP) / CAP)} mm).

## Construction (measured)

| | one-line | stacked-centred | one-line-large |
|---|---|---|---|
${row('Size (mm)', (m) => `${f2(m.w)} x ${f2(m.h)}`)}
${row('Cap height (mm)', (m) => f2(m.cap))}
${row('Stems (P U N H E D T)', (m) => `${f2(m.stems.min)}-${f2(m.stems.max)}`)}
${row('H bar, T bar', (m) => `${f2(m.hBar)}, ${f2(m.tBar)}`)}
${row('E arms / bar / arm', (m) => m.eArms.map(f2).join(' / '))}
${row('C top / bottom, U bowl', (m) => `${m.cStrokes.map(f2).join(' / ')}, ${f2(m.uBowl)}`)}
${row('P bowl, D bowl (top / bottom)', (m) => `${m.pBowl.map(f2).join(' / ')}, ${m.dBowl.map(f2).join(' / ')}`)}
${row('Thinnest stroke', (m) => `${f2(m.thinnestAll[1])} (${m.thinnestAll[0]} bar)`)}
${row('C mouth', (m) => f2(m.cMouth))}
${row('E slots', (m) => m.eSlots.map(f2).join(' / '))}
${row('N crotches', () => `${f1(nAngle)} degrees`)}
${row('Tightest letter gaps', (m) => m.letterPairs.slice(0, 2).map((p) => `${p.p[0]}-${p.p[1]} ${f2(p.w)}`).join(', '))}
${row('Word space or line gap', (m) => (m.wordSpace ? `word space ${f2(m.wordSpace)}` : `line gap ${f2(m.lineGap)}`))}
${row('Full stop', (m) => `${f2(m.dot.w)} round, ${f2(m.dot.ink)} from the T`)}
${row('C / E trims per face', (m) => (m.trims.c || m.trims.e ? `${f2(m.trims.cMM)} / ${f2(m.trims.eMM)}` : 'none'))}

All in mm. Thinnest stroke in each letter (cap 7): ${thinList(one)}. The logo's own: stem ${f2(logo.G.stem)}, arm ${f2(logo.G.arm)}, thinnest 1.43 (the ring's top and bottom).

Changes from the font (built in \`build.cjs\` as a per-letter table passed to the logo's \`glyphMM\`, so the logo itself is unchanged):

- **E, straight stem.** Unbounded draws its E with a bent, pointed stem (its left edge goes in 0.53 mm at mid-height). The logo has no E, so the brand had never shown it, and all four cold readers of the first proofs flagged it (a glitch, a misprint, a sigma or a backwards 3). It's rebuilt from the font's own numbers: the F's and H's stem with the E's own arms and bar, same advance, so its stem now matches the P, H and D. \`e-compare.png\` shows both.
- **E slots, cap 7 only:** the top arm's underside raised and the bottom arm's top lowered ${f2(A.trims.eMM)} mm, so each slot is ${f2(A.eSlots[0])} mm (was 1.23) and the arms ${f2(A.eArms[0])} mm. The bar keeps ${f2(A.eArms[1])} mm.
- **C mouth, cap 7 only:** each terminal's slot face trimmed ${f2(A.trims.cMM)} mm, so the mouth is ${f2(A.cMouth)} mm (was 1.14) and doesn't close up into an O.
- The C's mouth and the E's slots, the only narrow openings, are now at least 1.27 mm as drawn (0.05 in, the minimum gap in Printful's embroidery guide). The large file needs no trims: its C mouth is ${f2(big.cMouth)} mm and its E slots ${f2(big.eSlots[0])} mm as the font draws them.
- Kerning on top of the font's: P-U -0.025, C-H -0.03, E-D -0.02, U-T -0.04 and D-space -0.03 cap, plus the font's own T-period kern. The full stop sits ${f2(A.dot.pastBar)} mm past the end of the T's bar.

## Colourways

| Fabric | Threads |
|---|---|
| Bone and other light colours | Ink letters, Rust stop (\`*-light.svg\`) |
| Slate, Spruce | Bone letters, Sun stop (\`*-dark.svg\`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink in one colour |
| Moss, Rust | Bone in one colour |

One colour is the same artwork with the full stop in the letter thread; nothing else changes. As for the logo, the hex values are targets: match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank.

## Notes for the digitizer

- Digitize each size on its own and never scale a stitch file. The large file is its own drawing (no trims), not the cap-7 file scaled up.
- Satin throughout, ${f2(A.stems.min)}-${f2(A.stems.max)} mm stems at cap 7. One colour change.
- Stitch order, centre out (bottom line first on the stack, as caps sew centre out and bottom up), then the colour change and the full stop:
  - one line: ${orderText(one.order)}
  - stack: ${orderText(stack.order)}
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Only 0.05 mm per edge on the C's mouth faces and the E's slot faces, so the mouth finishes at about ${f2(A.cMouth - 0.1)} mm and the slots at about ${f2(A.eSlots[0] - 0.1)} mm (with full compensation on those faces they'd close to about ${f2(A.cMouth - 0.36)} and ${f2(A.eSlots[0] - 0.36)} mm).
- C: the artwork already includes the trims. Square each pointed terminal tip off 0.3 mm in, with no end compensation.
- N: the two crotches are ${f1(nAngle)}-degree wedges, and thread fills about 1.6-1.8 mm of each. Stop the diagonal 0.3 mm short of each stem at the crotches, with no compensation on the crotch faces.
- T: its bar's left end faces the U (${f2(A.letterPairs.find((p) => p.p === 'UT').w)} mm, as the logo's F-T faces 1.47 mm). Pull that end back 0.15 mm with no end compensation.
- Full stop: satin dot with 0.10 mm compensation, straight after the colour change. It has ${f2(A.dot.ink)} mm of fabric to the T.
- Fleece (hoodies, crewneck, sweatpants): water-soluble topping, so the loft doesn't swallow the mouth, the slots and the crotches.
- 6-panel caps: see the placement table (one line ${f1(Math.abs(seamOne.shift))} mm ${seamOne.shift > 0 ? 'left' : 'right'}; the stack centred). 5-panel and seamless fronts stay centred.
- Big centre front (\`one-line-large\`, cap ${f1(big.cap)}): stems ${f2(big.stems.min)}-${f2(big.stems.max)} mm, just over the 4.4 mm columns the logo sews in plain satin (its 45 mm symbol). Plain satin should hold; split the stems if the sew-out shows long, loose stitches. Full stop ${f2(big.dot.w)} mm: satin, or a fill if it looks loose. Standard compensation everywhere (C mouth ${f2(big.cMouth)}, E slots ${f2(big.eSlots[0])}, tightest letter gap ${f2(big.letterPairs[0].w)} mm).
- Approve only after a sew-out on the actual blank shows the C's mouth at least 0.9 mm open, both E slots at least 1.0 mm open and both N crotches open.

## Review

- Cold reads of the first proofs (each reader saw one image, nothing else): PUNCHED OUT. read correctly by all four, at 9/10. Every one of them flagged Unbounded's bent E, which is why the E is now straight. The straight E has not been cold-read yet.
- Two critics (brand and embroidery) measured every proof. Their fixes are in: the straight E, the C and E trims, the 6-panel positions and these digitizer notes. Where they disagreed (the stack on a 6-panel cap: centred, or 5.1 mm left), this follows the seam measurements above: centred. Not applied, the owner's call: kerning the full stop 0.6 mm left so it sits 2.5 mm from the T.
- Dropped, with their files left in git (commit f221242): the left-aligned stack (it repeats Mulligan Monday's layout, two lines left-aligned with one small Rust mark, a design the owner turned down; and its ink sits 5.1 mm left of its centre, so it looks lopsided wherever it's centred) and the clock O version (the logo's own clock inside the phrase: it repeats the logo, its 5 o'clock hand reads as a Q's tail, "QUT.", and it's 27.2 mm tall).
`;
}
