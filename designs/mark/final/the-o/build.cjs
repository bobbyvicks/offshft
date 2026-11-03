// OFF SHFT logo: "The O". The O in OFF is a clock face; two bar hands at 5:00 (quitting time) stand out of it.
// The letters are the real font, Unbounded Bold, typed (the owner's call, 2 Nov 2026): letter-spacing 0.12 em and
// three kerns, so anyone with the font can set the name. The clock keeps the bar hands with square ends from the hat
// mockups. This replaces the hand-drawn block version of earlier that day, whose S was a traced outline.
// notes.md is written by this script, so it cannot go stale.
//
// Construction (everything derives from the cap height and Unbounded Bold's own strokes):
// - Wordmark: Unbounded Bold, letter-spacing 0.12 em. Kerning added on top of the font's own: F-F -0.043 cap,
//   F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline (Unbounded's F, H and T are overlapping
//   pieces), and the S's terminals are trimmed by sTrimMM(cap) so both apertures sew open at 1.0 mm (tiny straight
//   cuts: 0.36 / 0.41 mm at cap 7, nothing from cap 10.6 / 11.1).
// - The O: a ring the same height as the font's own O, centred on it; the F follows at the font's own O-to-F spacing.
//   Side walls 0.82 x the letter stem when the pivot dot is in (so a 1.5 mm dot keeps 1.3 mm of fabric at cap 7),
//   1.0 x without it, 0.98 x in one colour; top and bottom walls 0.9 x the sides.
// - Channel between ring and hands: two colours max(1.0, 0.143 cap) mm; one colour 1.2 mm, 1.5 mm from cap 7.
// - Hands: plain bars with square ends and flat bases, the letter stem wide, in the hat mockup's proportions to the
//   ring: minute hand visible 1.26 R past the channel, hour hand 0.79 R, where R is the ring's outer radius.
//   Exactly 12 and 150 degrees.
// - Pivot dot in the hand colour: at most 0.286 cap, at least 1.3 mm of fabric to the counter (1.5 one colour),
//   at least 1.5 mm across or it is left out. Two colours only. Below cap 7 the lockup has no dot and a full ring.
// - The symbol on its own is the same clock, scaled so its height (minute tip to hour tip) is the requested mm.
// - Side-of-hat master: its own small drawing (7.4 mm ring, 1.6 mm wall, 1.5 mm dot, bar hands 1.5 mm wide).
// - Stacked logo (squares): at cap 10, the ring and FF on one line, SHFT under it on the ring's left edge.
//
// Exports: the brand kit (brand/build.cjs), the store assets and the Printful export require this file.
// Run: cd /home/user/offshft/tools && node ../designs/mark/final/the-o/build.cjs     (writes the files and notes.md)

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const ClipperLib = require('/home/user/offshft/tools/node_modules/clipper-lib');

const OUT = __dirname;
const T = kit.T, F = kit.F;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

// ---------------------------------------------------------------- the font
// The phrase builds use FONTS.unbounded (key, track, kern, sTrim) with glyphMM; neither may change.
const FONTS = {
  unbounded: {
    key: 'unbounded', name: 'Unbounded Bold', track: 0.12,
    kern: { FF: -0.043, 'F ': -0.05, FT: -0.025 },
    // S terminal trims (font units, y up): raise the upper terminal's underside, lower the lower terminal's top
    sTrim: { upperY: 519, upperX: 560, lowerY: 246, lowerX: 260 },
  },
};
const U = FONTS.unbounded;
// The logo's own S trim limits (FONTS.unbounded.sTrim stays as the phrase builds use it). The lower cut reaches to
// x 300 font units so it runs past the terminal's top at the cut line: with 260 a 0.087 mm tooth stood at the cut's
// inner corner and the lower aperture measured 0.93 mm from it (any lowerX in 274..550 clears it). The upper cut
// starts at x 540 (anything above 260 is clear of the spine).
const LOGO_S_TRIM = { ...U.sTrim, lowerX: 300, upperX: 540 };
const LU = { ...U, sTrim: LOGO_S_TRIM };                        // the font as the lockup and the stacked logo set it

// Visible hand lengths past the channel, in ring outer radii (measured from the hat mockup's clock: 12.70 and 8.00
// against a 10.10 radius); the lockup's ring walls with the dot in; the embroidery floors.
const HAND = { minute: 1.26, hour: 0.79 };
const DOT_WALL = 0.82;
const FLOOR = { channel: 1.0, dot: 1.5, fabric: 1.3, aperture: 1.0, FT: 1.46, satin: 12 };

// ---------------------------------------------------------------- glyph outlines (merged, trimmed)
const SC = 64; // clipper works in integers: font units x SC
function contoursOf(glyph, upm) {
  const out = []; let cur = null, x0 = 0, y0 = 0;
  const STEPS = 24;
  for (const c of glyph.getPath(0, 0, upm).commands) {
    if (c.type === 'M') { cur = [[c.x, c.y]]; out.push(cur); x0 = c.x; y0 = c.y; }
    else if (c.type === 'L') { cur.push([c.x, c.y]); x0 = c.x; y0 = c.y; }
    else if (c.type === 'Q') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * x0 + 2 * u * t * c.x1 + t * t * c.x, u * u * y0 + 2 * u * t * c.y1 + t * t * c.y]); } x0 = c.x; y0 = c.y; }
    else if (c.type === 'C') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * u * x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x, u * u * u * y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y]); } x0 = c.x; y0 = c.y; }
  }
  return out.filter((c) => c.length > 2);
}
const toClip = (cs) => cs.map((c) => c.map(([x, y]) => ({ X: Math.round(x * SC), Y: Math.round(y * SC) })));
function clip(op, subj, clips = []) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  if (clips.length) c.AddPaths(clips, ClipperLib.PolyType.ptClip, true);
  const sol = new ClipperLib.Paths();
  c.Execute(op, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return sol;
}
const rect = (x0, y0, x1, y1) => [{ X: x0 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y1 * SC }, { X: x0 * SC, Y: y1 * SC }];

// S trim (mm) needed for 1.0 mm apertures at this cap height, from the embroidery review.
const sTrimMM = (cap) => ({ upper: Math.max(0, 0.36 - 0.1 * (cap - 7)), lower: Math.max(0, 0.41 - 0.1 * (cap - 7)) });

// One glyph as a single merged outline in mm, left side bearing at x, baseline at baseY.
// edits: an optional per-letter table for other designs set in this type (the logo passes none, so its output is
// unchanged), in font units with y up: { E: { draw: [...] }, C: { cut: [...] }, B: { add: [...], cut: [...] } }, each
// shape a rectangle [x0, y0, x1, y1] or a polygon [[x, y], ...]. draw replaces the font's outline with the union of
// those shapes (a redrawn letter); add joins shapes onto the outline; cut removes shapes from it, the way the S trim
// below does. add runs before cut.
function glyphMM(font, ch, x, baseY, cap, edits) {
  const f = kit.font(font.key), upm = f.unitsPerEm;
  const k = cap / f.tables.os2.sCapHeight;                      // mm per font unit
  const ed = edits && edits[ch];
  const flip = (s) => (typeof s[0] === 'number'
    ? rect(s[0], -s[3], s[2], -s[1])                            // rectangle, font units, y up -> getPath's y down
    : s.map(([px, py]) => ({ X: Math.round(px * SC), Y: Math.round(-py * SC) })));   // polygon
  let paths = clip(ClipperLib.ClipType.ctUnion, ed && ed.draw ? ed.draw.map(flip) : toClip(contoursOf(f.charToGlyph(ch), upm)));
  if (ed && ed.add && ed.add.length) paths = clip(ClipperLib.ClipType.ctUnion, paths, ed.add.map(flip));
  if (ed && ed.cut && ed.cut.length) paths = clip(ClipperLib.ClipType.ctDifference, paths, ed.cut.map(flip));
  let trims = null;
  if (ch === 'S' && font.sTrim) {
    const t = sTrimMM(cap), s = font.sTrim;
    const up = t.upper / k, lo = t.lower / k;                   // in font units
    // y is down here (getPath flips), so font y = 519 is -519
    const cut = [rect(s.upperX, -(s.upperY + up), 4000, -s.upperY), rect(-4000, -s.lowerY, s.lowerX, -(s.lowerY - lo))];
    paths = clip(ClipperLib.ClipType.ctDifference, paths, cut);
    trims = { upper: t.upper, lower: t.lower };
  }
  const pts = [];
  const d = paths.map((p) => 'M' + p.map(({ X, Y }) => { const xx = x + (X / SC) * k, yy = baseY + (Y / SC) * k; pts.push([xx, yy]); return `${n(xx)} ${n(yy)}`; }).join(' L') + ' Z').join(' ');
  return { d, pts, trims };
}

// ---------------------------------------------------------------- font measurement
function segmentsOf(glyph, size) {
  const segs = [];
  for (const c of contoursOf(glyph, size)) for (let i = 0; i < c.length; i++) { const a = c[i], b = c[(i + 1) % c.length]; segs.push([a[0], a[1], b[0], b[1]]); }
  return segs;
}
function crossings(segs, { x, y }) {
  const out = [];
  for (const [ax, ay, bx, by] of segs) {
    if (y !== undefined && (ay - y) * (by - y) < 0) out.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
    if (x !== undefined && (ax - x) * (bx - x) < 0) out.push(ay + ((x - ax) / (bx - ax)) * (by - ay));
  }
  return out.sort((a, b) => a - b);
}
// Vertical stem (from H, below the crossbar) and horizontal arm (top arm of F), in mm at this cap height.
function strokes(fontKey, cap) {
  const f = kit.font(fontKey);
  const size = (cap * f.unitsPerEm) / f.tables.os2.sCapHeight;
  const H = crossings(segmentsOf(f.charToGlyph('H'), size), { y: -cap * 0.22 });
  const Fg = f.charToGlyph('F'), bb = Fg.getBoundingBox(), k = size / f.unitsPerEm;
  const Fy = crossings(segmentsOf(Fg, size), { x: (bb.x1 + (bb.x2 - bb.x1) * 0.72) * k });
  const stem = H.length >= 2 ? H[1] - H[0] : kit.stem(fontKey, cap);
  const arm = Fy.length >= 2 ? Fy[1] - Fy[0] : stem * 0.85;
  return { stem, arm };
}

// ---------------------------------------------------------------- geometry (every size in mm, for a cap height)
// Older scripts (designs/09-punched-out/v3, designs/mark/square, designs/mark/ticks) pass the font first; it is
// always Unbounded here, so a leading font object is dropped.
const dropFont = (a) => (a.length && a[0] && typeof a[0] === 'object' && a[0].key && a[0].track !== undefined ? a.slice(1) : a);
// Options: oneColour; channel (mm, else the rule); wallFactor = ring side wall as a multiple of the stem (else the
// rule); dot = false to leave the pivot dot out; handW = hand width in mm (default: the letter stem).
function geometry(...a) {
  const [cap, { oneColour = false, channel, wallFactor, dot: wantDot = true, handW } = {}] = dropFont(a);
  const ref = kit.text('OFF SHFT', { font: U.key, cap, track: U.track, x: 0, y: 0 });
  const O = ref.letters[0];
  const { stem, arm } = strokes(U.key, cap);
  const R = (O.bottom - O.top) / 2;                             // the font's own O, outer radius
  const wallSide = stem * (wallFactor !== undefined ? wallFactor : oneColour ? 0.98 : 1.0);
  const wallTop = wallSide * 0.9;
  const g = channel !== undefined ? channel : oneColour ? (cap >= 7 ? 1.5 : 1.2) : Math.max(FLOOR.channel, 0.143 * cap);
  const rx = R - wallSide, ry = R - wallTop;
  const fabricMin = oneColour ? 1.5 : FLOOR.fabric;
  let dot = Math.min(0.286 * cap, 2 * (Math.min(rx, ry) - fabricMin));
  if (dot < FLOOR.dot || !wantDot || oneColour) dot = 0;
  const w = handW !== undefined ? handW : stem;
  return {
    cap, ref, O, stem, arm, R, rx, ry, g, dot, oneColour, fabricMin, handW: w, sM: w / 2, sH: w / 2,
    Lm: R + g + HAND.minute * R, Lh: R + g + HAND.hour * R,     // hand tips, from the centre
    fabric: dot ? Math.min(rx, ry) - dot / 2 : null,
  };
}
// The clock as the lockup and the symbol draw it: with the dot and thinner side walls where the dot can be
// stitched, otherwise without the dot and with full walls. One colour: no dot.
function clockGeometry(cap, opts = {}) {
  let G = geometry(cap, { ...(opts.oneColour ? { dot: false } : { dot: true, wallFactor: DOT_WALL }), ...opts });
  if (!G.dot && opts.wallFactor === undefined && !opts.oneColour) G = geometry(cap, { ...opts, dot: false });
  return G;
}

// radii rounded first and the chord taken from the rounded radius, so the two arcs are exact
const ellipse = (cx, cy, rx, ry) => { const r1 = +n(rx), r2 = +n(ry); return `M${n(cx - r1)} ${n(cy)} a${r1} ${r2} 0 1 0 ${n(2 * r1)} 0 a${r1} ${r2} 0 1 0 ${n(-2 * r1)} 0 Z`; };
const box = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });

// A bar hand: width w, from distance t0 to t1 along the clock angle deg, square ends.
function bar(cx, cy, deg, t0, t1, w) {
  const a = (deg * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux, s = w / 2;
  const Q = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const pts = [Q(t0, -s), Q(t1, -s), Q(t1, s), Q(t0, s)];
  return { d: `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`, pts };
}
// The clock: ring, the two bar hands across the channel, the pivot dot. Returns the drawing and its box.
function clock(G, cx, cy, { ring, hands }) {
  const hm = bar(cx, cy, 0, G.R + G.g, G.Lm, G.handW);
  const hh = bar(cx, cy, 150, G.R + G.g, G.Lh, G.handW);
  let svg = `<path fill="${ring}" fill-rule="evenodd" d="${ellipse(cx, cy, G.R, G.R)} ${ellipse(cx, cy, G.rx, G.ry)}"/>`;
  svg += `<path fill="${hands}" d="${hm.d} ${hh.d}"/>`;
  if (G.dot) svg += `<path fill="${hands}" d="${ellipse(cx, cy, G.dot / 2, G.dot / 2)}"/>`;
  return { svg, box: box([...hm.pts, ...hh.pts, [cx - G.R, cy - G.R], [cx + G.R, cy + G.R]]), dot: G.dot };
}

// A word typed in the font, letter by letter: merged outlines, the extra kerning, the S trims. The letters sit where
// kit.text puts them at letter-spacing 0.12 em; str's first glyph origin is at x.
function word(G, str, x, baseY, fill) {
  const { cap } = G;
  const t = kit.text(str, { font: U.key, cap, track: U.track, x: 0, y: 0 });
  const kern = U.kern || {};
  let shift = 0, d = '', pts = [], sTrims = null;
  const ink = [];
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && kern[str[i - 1] + str[i]]) shift += kern[str[i - 1] + str[i]] * cap;
    if (str[i] === ' ') continue;
    const g = glyphMM(LU, str[i], x + t.letters[i].x + shift, baseY, cap);
    d += g.d + ' ';
    pts = pts.concat(g.pts);
    if (g.trims) sTrims = g.trims;
    const b = box(g.pts);
    ink.push({ ch: str[i], x0: +n(b.x0), x1: +n(b.x1) });          // as the file has them (its coordinates are rounded to 3 decimals)
  }
  return { svg: `<path fill="${fill}" fill-rule="evenodd" d="${d.trim()}"/>`, d: d.trim(), box: box(pts), ink, sTrims };
}
// Where FF starts after the ring: the font's own O-to-F spacing, from the ring's right edge.
function afterRing(G, cx) {
  const L = G.ref.letters;
  return cx + G.R + (L[1].x1 - G.O.x2) - (L[1].x1 - L[1].x);
}

// ---------------------------------------------------------------- the lockup: the clock O, then FF SHFT
function lockup(...a) {
  const [cap, colours, opts = {}] = dropFont(a);
  const G = clockGeometry(cap, opts);
  const cx = 0, cy = 0;
  const baseY = cy - (G.O.top + G.O.bottom) / 2;                // ring centred on the font's O
  const c = clock(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  const w = word(G, 'FF SHFT', afterRing(G, cx), baseY, colours.letters);
  const b = union(c.box, w.box);
  // centre of the word space, relative to the lockup's centre (for the 6-panel seam rule)
  const f2 = w.ink[1], s = w.ink[2];
  const seamShift = (f2.x1 + s.x0) / 2 - (b.x0 + b.x1) / 2;
  return { w: b.x1 - b.x0, h: b.y1 - b.y0, body: `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})">${c.svg}${w.svg}</g>`, G, dot: c.dot, cap, seamShift, sTrims: w.sTrims, ink: w.ink.map((q) => ({ ...q, x0: q.x0 - b.x0, x1: q.x1 - b.x0 })) };
}
// The cap height that gives the lockup a width (the Printful and store files are sized by width)
function capForWidth(width, colours = LIGHT, opts = {}) {
  let lo = 2, hi = 60;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (lockup(mid, colours, opts).w < width) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
// The clock alone, scaled so its total height (minute tip to hour tip) is `height` mm. The same clock as the lockup's O.
function symbol(...a) {
  const [height, colours, opts = {}] = dropFont(a);
  let lo = 2, hi = 80;
  const hOf = (cap) => { const c = clock(clockGeometry(cap, opts), 0, 0, colours); return c.box.y1 - c.box.y0; };
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (hOf(mid) < height) lo = mid; else hi = mid; }
  const G = clockGeometry(lo, opts);
  const c = clock(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G, dot: c.dot };
}
// Side-of-hat master: its own small drawing. 7.4 mm ring, 1.6 mm wall, 1.5 mm pivot dot with 1.3 mm of fabric,
// bar hands 1.5 mm wide (4.2 and 2.8 mm long), 1.2 mm channel; one colour 1.5 mm channel and no dot.
function smallMaster(colours, { oneColour = false } = {}) {
  const R = 3.7, r = R - 1.6, g = oneColour ? 1.5 : 1.2, dot = oneColour ? 0 : 1.5;
  const G = { cap: null, R, rx: r, ry: r, g, dot, handW: 1.5, sM: 0.75, sH: 0.75, Lm: R + g + 4.2, Lh: R + g + 2.8, oneColour, fabric: dot ? r - dot / 2 : null };
  const c = clock(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G, dot };
}
// OFF over SHFT for squares and circles: at cap 10, the ring and FF on one line (as in the lockup), SHFT under it,
// left-aligned on the ring's left edge by its ink, SHFT's cap line a hand's width below the hour hand's lowest corner.
// The 1.5 mm channel of the one-colour lockup keeps the hands apart from the ring at avatar sizes.
function stackedParts(colours, opts = {}) {
  const cap = 10, G = clockGeometry(cap, { ...opts, channel: 1.5 });
  const cx = 0, cy = 0;
  const baseY = cy - (G.O.top + G.O.bottom) / 2;
  const c = clock(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  const ff = word(G, 'FF', afterRing(G, cx), baseY, colours.letters);
  const line2 = c.box.y1 + G.handW;                             // SHFT's cap line
  const sInk = box(glyphMM(LU, 'S', 0, 0, cap).pts).x0;         // the S's side bearing
  const shft = word(G, 'SHFT', cx - G.R - sInk, line2 + cap, colours.letters);
  const text = `<path fill="${colours.letters}" fill-rule="evenodd" d="${ff.d} ${shft.d}"/>`;
  const bb = union(union(c.box, ff.box), shft.box);
  return { body: c.svg + text, bbox: bb, G, cx: (bb.x0 + bb.x1) / 2, cy: (bb.y0 + bb.y1) / 2, line2 };
}
function stackedArt(colours, opts = {}) {
  const { body, bbox, G } = stackedParts(colours, opts);
  return { w: bbox.x1 - bbox.x0, h: bbox.y1 - bbox.y0, body: `<g transform="translate(${n(-bbox.x0)} ${n(-bbox.y0)})">${body}</g>`, G, dot: G.dot, cap: G.cap };
}
// In a 100-unit tile: centred, scaled so the farthest point sits 45 units from the centre (inside every circle crop).
function stacked(colours, opts = {}) {
  const { body, bbox, cx, cy } = stackedParts(colours, opts);
  const far = Math.hypot(bbox.x1 - bbox.x0, bbox.y1 - bbox.y0) / 2;
  const k = 45 / far;
  return `<g transform="translate(${n(50 - cx * k)} ${n(50 - cy * k)}) scale(${n(k)})">${body}</g>`;
}
// The clock alone in a 100-unit tile (secondary square): ring centred, minute tip 0.47 of the tile from the centre.
function clockTile(colours, opts = {}) {
  const G = clockGeometry(20, { ...opts, channel: 1.5 });
  const k = 47 / G.Lm;
  return `<g transform="translate(50 50) scale(${n(k)})">${clock(G, 0, 0, { ring: colours.letters, hands: colours.hands }).svg}</g>`;
}

// Channel for a two-colour symbol of a given height: the 1.0 mm minimum below 25 mm, 1.2 mm from 25 mm, 1.5 mm from 35 mm.
const symbolChannel = (h) => (h >= 35 ? 1.5 : h >= 25 ? 1.2 : undefined);

const LIGHT = { letters: T.ink, hands: T.rust, bg: F.bone, name: 'light' };
const DARK = { letters: T.bone, hands: T.sun, bg: F.slate, name: 'dark' };
const ONE_INK = { letters: T.ink, hands: T.ink, bg: F.oat, name: 'one-colour-ink', one: true };
const ONE_BONE = { letters: T.bone, hands: T.bone, bg: F.spruce, name: 'one-colour-bone', one: true };
// The main file (hat front and chest): letters 7 mm, the smallest size with the pivot dot and the cap the phrase
// designs are drawn at. Its width follows from the drawing.
const LOCKUP_CAP = 7;
const LOCKUP_WIDTH = +lockup(LOCKUP_CAP, LIGHT).w.toFixed(1);

module.exports = { FONTS, LOGO_S_TRIM, geometry, lockup, capForWidth, symbol, smallMaster, stackedArt, stacked, clockTile, clock, strokes, glyphMM, LIGHT, DARK, ONE_INK, ONE_BONE, LOCKUP_CAP, LOCKUP_WIDTH, symbolChannel };

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  const write = (name, d) => { const f = path.join(OUT, name); kit.writeSvg(f, d); return f; };
  const tileFor = (d, pad = 12) => `${Math.ceil(d.w + pad)}x${Math.ceil(d.h + pad)}`;
  const CAP = LOCKUP_CAP;
  const sheet = [];
  for (const c of [LIGHT, DARK, ONE_INK, ONE_BONE]) {
    const lk = write(`logo-${c.name}.svg`, lockup(CAP, c, { oneColour: !!c.one }));
    await kit.render(lk, lk.replace('.svg', '.png'), { bg: c.bg, tile: '100x40', px: 6 });
    const sy = write(`symbol-${c.name}.svg`, symbol(25, c, { oneColour: !!c.one, channel: c.one ? 1.5 : 1.2 }));
    await kit.render(sy, sy.replace('.svg', '.png'), { bg: c.bg, tile: '60x40', px: 6 });
    const sm = write(`side-${c.name}.svg`, smallMaster(c, { oneColour: !!c.one }));
    await kit.render(sm, sm.replace('.svg', '.png'), { bg: c.bg, tile: '40x30', px: 10 });
    sheet.push(lk.replace('.svg', '.png'), sy.replace('.svg', '.png'), sm.replace('.svg', '.png'));
  }
  // outputs of earlier sets
  for (const old of ['logo-light-cap7.5', 'side-light-proof', 'compare-hands', 'logo-light-cap6', 'symbol-light-18mm']) for (const ext of ['.svg', '.png']) fs.rmSync(path.join(OUT, old + ext), { force: true });
  const caps = [6.6, 7, 10];                                                // the S floor (no dot), the main file, a hat-size proof
  for (const cap of caps) {
    const f = write(`logo-light-cap${cap}.svg`, lockup(cap, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '120x36', px: 8 });
  }
  const proofs = [];
  for (const h of [19, 25, 40]) {
    const s = symbol(h, LIGHT, { channel: symbolChannel(h) });
    const f = write(`symbol-light-${h}mm.svg`, s);
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: tileFor(s), px: 8 });
    proofs.push(f.replace('.svg', '.png'));
  }
  // the 40 mm clock for dark hats (same 1.5 mm channel), and in one colour Ink (no dot) for Oat-like caps
  const s40d = symbol(40, DARK, { channel: symbolChannel(40) });
  const d40 = write('symbol-dark-40mm.svg', s40d);
  await kit.render(d40, d40.replace('.svg', '.png'), { bg: DARK.bg, tile: tileFor(s40d), px: 8 });
  const s40i = symbol(40, ONE_INK, { oneColour: true, channel: symbolChannel(40) });
  const i40 = write('symbol-one-colour-ink-40mm.svg', s40i);
  await kit.render(i40, i40.replace('.svg', '.png'), { bg: ONE_INK.bg, tile: tileFor(s40i), px: 8 });
  const st = write('stacked-light.svg', stackedArt(LIGHT));
  await kit.render(st, st.replace('.svg', '.png'), { bg: F.bone, tile: '60x60', px: 8 });
  await kit.close();

  const lbl = (f) => path.basename(f, '.png');
  const montage = (items, out, geom, tile) => execFileSync('montage', [...items.flatMap((f) => ['-label', lbl(f), f]), '-tile', tile, '-geometry', geom, '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, out)]);
  montage(sheet, 'sheet.png', '480x200+8+8', '3x');
  montage(caps.map((c) => path.join(OUT, `logo-light-cap${c}.png`)), 'sizes-lockup.png', '+6+6', '1x');
  montage([...proofs, st.replace('.svg', '.png')], 'sizes-symbol.png', '+12+12', `${proofs.length + 1}x1`);

  // ---- numbers, self-check, notes.md
  const L7 = lockup(CAP, LIGHT), L7one = lockup(CAP, ONE_INK, { oneColour: true }), G = L7.G, G1 = L7one.G;
  const L66 = lockup(6.6, LIGHT), L10 = lockup(10, LIGHT);
  const S19 = symbol(19, LIGHT, { channel: symbolChannel(19) }), S25 = symbol(25, LIGHT, { channel: 1.2 }), S40 = symbol(40, LIGHT, { channel: 1.5 });
  const S19one = symbol(19, ONE_INK, { oneColour: true });      // the one-colour clock at the two-colour floor
  const SM = smallMaster(LIGHT), SM1 = smallMaster(ONE_INK, { oneColour: true }), ST = stackedArt(LIGHT);
  const F_T = L7.ink[5].x0 - L7.ink[4].x1;                      // gap between the F arm and the T bar (ink boxes, as the file has them)
  const clockOf = (s) => ({ w: s.w, h: s.h, cap: s.G.cap, ring: 2 * s.G.R, wall: s.G.R - s.G.rx, wallTop: s.G.R - s.G.ry, channel: s.G.g, handW: s.G.handW, minute: s.G.Lm - s.G.R - s.G.g, hour: s.G.Lh - s.G.R - s.G.g, dot: s.dot, fabric: s.G.fabric });
  const num = {
    cap: CAP, lockupW: L7.w, lockupH: L7.h, lockupOneH: L7one.h, ring: 2 * G.R, wallSide: G.R - G.rx, wallTop: G.R - G.ry,
    counter: [2 * G.rx, 2 * G.ry], handW: G.handW, minute: G.Lm - G.R - G.g, hour: G.Lh - G.R - G.g,
    dot: L7.dot, fabric: G.fabric, channel: G.g, channelOne: G1.g, wallOne: G1.R - G1.rx,
    stem: G.stem, arm: G.arm, seam: L7.seamShift, sTrims: L7.sTrims, FT: F_T,
    l66: { w: L66.w, h: L66.h, dot: L66.dot, wall: L66.G.R - L66.G.rx, channel: L66.G.g, sTrims: L66.sTrims },
    l10: { w: L10.w, h: L10.h, dot: L10.dot, fabric: L10.G.fabric, channel: L10.G.g, sTrims: L10.sTrims },
    s19: clockOf(S19), s19one: clockOf(S19one), s25: clockOf(S25), s40: clockOf(S40),
    side: [SM.w, SM.h], sideOne: [SM1.w, SM1.h], stacked: [ST.w, ST.h],
  };
  num.satin40 = Math.max(num.s40.wall, num.s40.wallTop, num.s40.handW, num.s40.dot);   // the widest satin on the 40 mm clock, the dot included
  num.sTrimLimits = LOGO_S_TRIM;
  console.log(JSON.stringify(num, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)));
  // floors at the main file (two colours), and on the 40 mm clock
  const fail = [];
  if (num.channel < FLOOR.channel - 1e-9) fail.push(`channel ${num.channel} < ${FLOOR.channel}`);
  if (num.dot < FLOOR.dot) fail.push(`dot ${num.dot} < ${FLOOR.dot}`);
  if (num.fabric < FLOOR.fabric - 1e-9) fail.push(`fabric ${num.fabric} < ${FLOOR.fabric}`);
  if (num.FT < FLOOR.FT) fail.push(`F-T gap ${num.FT} < ${FLOOR.FT}`);         // unrounded against the floor
  if (Math.abs(num.sTrims.upper - 0.36) > 1e-9 || Math.abs(num.sTrims.lower - 0.41) > 1e-9) fail.push(`S trims ${num.sTrims.upper} / ${num.sTrims.lower}, expected 0.36 / 0.41`);
  if (num.s25.channel < 1.2 || num.s25.dot < FLOOR.dot) fail.push(`25 mm clock: channel ${num.s25.channel}, dot ${num.s25.dot}`);
  if (num.satin40 > FLOOR.satin) fail.push(`40 mm clock: satin ${num.satin40} > ${FLOOR.satin}`);
  // the one-colour clock at 19 mm: 1.5 mm channel, ring walls and hands at least 1.0 mm, no dot
  const o = num.s19one;
  if (o.channel < 1.5 - 1e-9 || Math.min(o.wall, o.wallTop, o.handW) < 1.0 || o.dot) fail.push(`19 mm one-colour clock: channel ${o.channel}, walls ${o.wall} / ${o.wallTop}, hands ${o.handW}, dot ${o.dot}`);
  if (fail.length) throw new Error('floor check failed: ' + fail.join('; '));
  fs.writeFileSync(path.join(OUT, 'notes.md'), notes(num));
})().catch((e) => { console.error(e); process.exit(1); });

function notes(m) {
  const f = (v, d = 2) => Number(v).toFixed(d);
  const dotOf = (c) => (c.dot ? `dot ${f(c.dot)} mm with ${f(c.fabric)} mm of fabric` : 'no dot');
  return `# OFF SHFT logo: The O

The O in OFF is a clock at 5:00, quitting time. Two bar hands stand out of the ring across an even gap, and a pivot dot sits in the middle. The hands and the dot are stitched in the accent thread, so they read as hands laid on a dial.

The letters are the real font, Unbounded Bold, typed: letter-spacing 0.12 em and three kerns (F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap). Anyone with the font can set the name. This is the owner's call of 2 Nov 2026. It replaces the hand-drawn block version of earlier that day, whose S was a traced outline. The clock keeps the bar hands with square ends from the hat mockups.

Pick the Bold weight (700). The repo's tools/fonts/Unbounded-Bold.ttf has the Bold outlines, though its internal name reads Regular.

**This file is written by \`build.cjs\`.** Every number below is measured from the generated artwork. Change \`build.cjs\` and rebuild; never edit the files by hand.

## Files

| File | What it is |
|---|---|
| \`logo-light.svg\` | Main lockup for light fabric: Ink letters and ring, Rust hands and dot. ${f(m.lockupW, 1)} x ${f(m.lockupH, 1)} mm, letters ${f(m.cap, 0)} mm (the hat-front and chest file) |
| \`logo-dark.svg\` | Main lockup for dark fabric: Bone letters and ring, Sun hands and dot |
| \`logo-one-colour-ink.svg\`, \`logo-one-colour-bone.svg\` | One thread only: no dot, full ring, ${f(m.channelOne, 1)} mm channel |
| \`symbol-light/dark/one-colour-ink/one-colour-bone.svg\` | The clock alone, 25 mm tall (patches, hat back, avatar) |
| \`symbol-light-19mm/25mm/40mm.svg\` | The clock at its sizes (40 mm: the clock hat's front on light caps) |
| \`symbol-dark-40mm.svg\`, \`symbol-one-colour-ink-40mm.svg\` | The 40 mm clock for dark caps, and in one colour Ink (no dot) for Oat-like caps |
| \`side-light/dark/one-colour-ink/one-colour-bone.svg\` | Side-of-hat master, its own small drawing |
| \`stacked-light.svg\` | OFF over SHFT, for squares (the brand kit draws the colourways and the tiles) |
| \`logo-light-cap6.6/7/10.svg\` | Size proofs: the S floor (no dot), the main file, a hat-size proof |
| \`sheet.png\`, \`sizes-lockup.png\`, \`sizes-symbol.png\` | Renders of the above on fabric |

## Construction (at cap height ${f(m.cap, 0)} mm)

| Part | Rule | At cap ${f(m.cap, 0)} |
|---|---|---|
| Wordmark | Unbounded Bold, letter-spacing 0.12 em, kerns F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline | ${f(m.lockupW, 1)} x ${f(m.lockupH, 1)} mm overall (one colour ${f(m.lockupOneH, 1)} mm tall) |
| Letter strokes | Measured from the font | stem ${f(m.stem)} mm, arm ${f(m.arm)} mm |
| Ring | The same height as the font's O, centred on it; the F follows at the font's own O-to-F spacing | ${f(m.ring)} mm across |
| Ring walls | Sides 0.82 x the stem with the dot in (1.0 x without it, 0.98 x one colour); top and bottom 0.9 x the sides | ${f(m.wallSide)} mm sides, ${f(m.wallTop)} mm top and bottom; counter ${f(m.counter[0])} x ${f(m.counter[1])} mm; one colour ${f(m.wallOne)} mm sides |
| Channel | Even gap between the ring and the hands. Two colours max(1.0, 0.143 cap); one colour 1.2, 1.5 from cap 7 | ${f(m.channel)} mm (one colour ${f(m.channelOne)} mm) |
| Hands | Plain bars, square ends, flat bases, the stem wide. Minute hand 1.26 R long past the channel at 12; hour hand 0.79 R at 150 degrees (R: the ring's outer radius) | ${f(m.handW)} mm wide; minute ${f(m.minute)} mm, hour ${f(m.hour)} mm |
| Pivot dot | Hand colour, at most 0.286 cap, at least 1.3 mm of fabric to the counter, at least 1.5 mm across or left out. Two colours only, from cap 7 | ${f(m.dot)} mm with ${f(m.fabric)} mm of fabric |
| S | Terminals trimmed by straight cuts so both apertures are 1.0 mm (upper / lower trim; none from cap 10.6 / 11.1). The logo's cut limits, in font units: the upper cut from x ${m.sTrimLimits.upperX} at y ${m.sTrimLimits.upperY}, the lower cut to x ${m.sTrimLimits.lowerX} at y ${m.sTrimLimits.lowerY} (the phrase builds keep the font table's 560 / 260) | ${f(m.sTrims.upper)} / ${f(m.sTrims.lower)} mm |
| F-T | Gap between the F arm and the T bar (the main file's guard is 1.46 mm; the gap scales with the letters, 1.38 mm at cap 6.6) | ${f(m.FT, 3)} mm |
| Seam | Centre of the word space, from the lockup's centre | ${f(m.seam)} mm |

## Sizes

| Drawing | Numbers |
|---|---|
| Lockup at cap 6.6 (the S floor) | ${f(m.l66.w, 1)} x ${f(m.l66.h, 1)} mm, no dot, ring sides ${f(m.l66.wall)} mm, channel ${f(m.l66.channel)} mm, S trims ${f(m.l66.sTrims.upper)} / ${f(m.l66.sTrims.lower)} mm |
| Lockup at cap 10 (hat-size proof) | ${f(m.l10.w, 1)} x ${f(m.l10.h, 1)} mm, dot ${f(m.l10.dot)} mm with ${f(m.l10.fabric)} mm of fabric, channel ${f(m.l10.channel)} mm, S trims ${f(m.l10.sTrims.upper)} / ${f(m.l10.sTrims.lower)} mm |
| 19 mm clock | ring ${f(m.s19.ring, 1)} mm, wall ${f(m.s19.wall)} mm, channel ${f(m.s19.channel)} mm, hands ${f(m.s19.handW)} mm wide, ${dotOf(m.s19)} |
| 19 mm clock, one colour | ring ${f(m.s19one.ring, 1)} mm, walls ${f(m.s19one.wall)} / ${f(m.s19one.wallTop)} mm, channel ${f(m.s19one.channel)} mm, hands ${f(m.s19one.handW)} mm wide, no dot |
| 25 mm clock | ${f(m.s25.w, 1)} x ${f(m.s25.h, 1)} mm: ring ${f(m.s25.ring, 1)} mm, wall ${f(m.s25.wall)} mm, channel ${f(m.s25.channel)} mm, hands ${f(m.s25.handW)} mm wide, minute ${f(m.s25.minute)} mm, hour ${f(m.s25.hour)} mm, ${dotOf(m.s25)} |
| 40 mm clock | ${f(m.s40.w, 1)} x ${f(m.s40.h, 1)} mm: ring ${f(m.s40.ring, 1)} mm, wall ${f(m.s40.wall)} mm, channel ${f(m.s40.channel)} mm, hands ${f(m.s40.handW)} mm wide, minute ${f(m.s40.minute)} mm, hour ${f(m.s40.hour)} mm, ${dotOf(m.s40)} |
| Side-of-hat master | ${f(m.side[0], 1)} x ${f(m.side[1], 1)} mm (one colour ${f(m.sideOne[0], 1)} x ${f(m.sideOne[1], 1)} mm): 7.4 mm ring, 1.6 mm wall, 1.5 mm dot, hands 1.5 mm wide and 4.2 / 2.8 mm long, 1.2 mm channel (one colour 1.5 mm, no dot) |
| Stacked logo | ${f(m.stacked[0], 1)} x ${f(m.stacked[1], 1)} mm at cap 10: the ring and FF on one line, SHFT under it on the ring's left edge, its cap line a hand's width below the hour hand |

Floors. Cap 7 is the main file and the smallest size with the pivot dot. Cap 6.6 is the absolute minimum, set by the S apertures; from there to cap 7 the lockup has no dot and a full ring. One colour: cap 7 minimum, no dot. The clock alone: 19 mm minimum, in two colours or one (one colour has no dot; at 19 mm its channel is ${f(m.s19one.channel, 1)} mm and nothing in it is thinner than ${f(Math.min(m.s19one.wall, m.s19one.wallTop, m.s19one.handW))} mm). From 35 mm the channel is 1.5 mm. Under 19 mm, use the side master only. Never scale a file down; rebuild at the size. On the 40 mm clock no stroke or dot is wider than ${f(m.satin40, 1)} mm; the floor is 12, so plain satin stitches it.

## Colourways

| Fabric | Version |
|---|---|
| Bone | Ink + Rust (\`logo-light\`) |
| Slate, Spruce | Bone + Sun (\`logo-dark\`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink one colour |
| Moss, Rust | Bone one colour |

The hex values are targets. Match each to the nearest colour on a thread card and approve from a sew-out on the real blank. One-colour versions are for tonal or single-thread jobs, never the default front logo.

## For the digitizer

- Digitize each size on its own. Never scale a stitch file.
- Stitch order: letters from the centre out (S, H, F, T, then F, F), the ring last, then the accent: pivot dot first, then the hour hand, then the minute hand. One colour change.
- Pull compensation: 0.15-0.18 mm per edge, plus 0.05 mm where stitches run horizontally. Only 0.05-0.10 mm per edge on edges facing the channel, the S necks, the pivot dot and the ring's inner edge at 3 and 9 o'clock.
- Hands: square ends as drawn. Pull both ends back 0.2 mm with no end compensation, so the channel stays open.
- S: the trims are in the artwork. Pull both terminal ends back 0.2 mm and hold spine-edge compensation to 0.10 mm at the necks, so the apertures finish at 0.9-1.0 mm.
- F-T: pull both facing bar ends back 0.15 mm with no end compensation.
- 6-panel caps: the centre seam would cross the S. Shift the lockup **${f(Math.abs(m.seam), 1)} mm ${m.seam < 0 ? 'right' : 'left'}** so the seam falls in the word space. 5-panel and seamless fronts stay centred.
- Approve only after a sew-out on the actual blank shows the channel at least 0.8 mm open, the O's counter open, both S apertures open and the dot with at least 1.0 mm of fabric all round.
`;
}
