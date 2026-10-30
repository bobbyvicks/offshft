// OFF SHFT: production artwork for the six phrase designs the owner added on 29 Oct 2026 ("add them all"): NOWHERE TO
// BE., SUN’S STILL UP., NO ALARM SET., BANKED TIME., NOT PICKING UP. and PARKED. (shortlist: designs/phrases/notes.md).
// Built the way Punched Out. v3 was (designs/09-punched-out/v3/build.cjs, "PO" below): the logo's type, Unbounded Bold
// caps at 0.12 em, each letter one merged outline from the logo's glyphMM, PO's straight E and its C/E trims, PO's
// kerning, Ink letters with a Rust full stop (Bone with a Sun stop on dark fabric). Nothing is drawn by hand: every
// letter is the font's own outline with the changes listed under "Letters" below, and every number in the notes is
// measured from the artwork this script writes.
//
// Writes, for each design, designs/<NN>-<id>/: design-light.svg and design-dark.svg (true size, mm), proof-light.png
// (on Bone) and proof-dark.png (on Slate) at true size, seam-proof.png for the 6-panel caps (and, where the word space
// isn't used, seam-proof-word-space.png: the same front with the seam in the word space instead), and notes.md; and
// designs/phrases/art.json. Checks every letter against the floors below and exits non-zero if any check fails.
//
// Run from /home/user/offshft/tools:  node ../designs/phrases/build.cjs
//
// Construction:
// - Lines are set with PO's setLine, generalised to take a kerning table (setText below). With PO's table it gives
//   PO's own outlines byte for byte, and the build checks that before it starts.
// - Kerning, in cap heights: Unbounded's own pair kerning, read from the font's GPOS table by gposKern below
//   (opentype.js 1.3.4 can't read the font's extension lookups, so kit.text drops all of it; PO put back the one pair
//   it needed, T-period), plus PO's optical kerns where a pair is in PO.KERN (P-U, C-H, E-D, U-T, D-space), plus
//   EXTRA_KERN (this set's own, judged on the true-size proofs and on the white between each pair; see the table), plus
//   a design's own `kern` (the pair a 6-panel seam runs through, opened a little). For Punched Out. that is exactly
//   PO's spacing (its other pairs have no font kerning and none of this set's pairs).
// - Letters: PO's letterEdits (straight E at every size; E slot and C mouth trims below cap 7.75 / 8.6), and:
//     B  straight stem, as PO's E: Unbounded bends the B's stem the same way it bends the E's (left edge 47 -> 105 ->
//        47 font units). Rebuilt with the F/H stem (x 70-277) and the counters' left edges straight at x 277. Its
//        lower bowl's neck (beside the notch between the bowls) is 1.21 mm at cap 7, so the notch is filled at its tip
//        until the neck is as thick as the B's middle bar (1.33 mm); none needed from cap 7.64.
//     S  this set's S, at every size: its terminals cut flat higher than the font's (upper face at 572 font units,
//        lower at 186; the font's 519 and 246, the logo's at cap 7 557.6 and 202.1), so its apertures are open at any
//        size (on the big front, cap 15.6, the font's own are about 1.4-1.5 mm: 0.09 cap, half the E's slots). The
//        cut is part of the drawing, like PO's straight E, so the hat's S and the big front's S are the same shape.
//        At small sizes its inside edges also move back, as a trim that fades to nothing by cap 14: 15 units at cap 7,
//        less nearer the convex hull's edge (none within 20 units of it, all from 180 in) so the silhouette and the
//        shoulders beside the apertures stay, and the spine's two edges only in turn: its top edge (the upper
//        counter's floor) from none at the spine's left end to the full move at its right end, where it faces the
//        upper aperture, and its bottom edge the other way. Each spine edge moves by a straight ramp, so it stays
//        straight, and the spine keeps one even thickness, one move under the font's (the counters' arcs and ends
//        take the full move). Moving the spine's edges by the full move all along would thin it twice, under the
//        arcs; moving only the arcs leaves the apertures under 1.27 mm; cutting the terminals higher instead thins
//        their tips under 1.27 mm. The logo's S is unchanged.
//     G  its mouth (between the upper terminal's underside, y 471, and the bar's top, y 388: 83 units) opened to the
//        C's (122 units as the font draws the C, more where PO trims the C): the terminal cut flat higher, at every
//        size. On the big front (cap 14.5) the font's mouth is a 1.6 mm parallel slit, against the C's 2.4 mm two
//        letters before it.
//     ’  (the curly apostrophe) the tail redrawn wider with straight sides, so it isn't a thin stroke: its flat end
//        30 font units wider each side (the font's: x 48-146 at y 402); the left side parallel to the font's, up into
//        the head; the right side the tangent from the end to the head, so it joins the head's curve. The font's tail
//        is 0.83 mm at cap 7; the widening fades to nothing by cap 11.3.
//   All edits are passed to the logo's glyphMM as its per-letter table (draw / add / cut shapes in font units), so the
//   logo itself is unchanged.
// - Stacks: PO's line gap (3.7 mm at cap 7, baseline to cap line, so the block is the logo's 18 mm), both lines
//   centred on one axis by their letters; the full stop hangs. Where the stop hangs past the widest line, the file
//   gets the same width of empty margin on the other side, so centring the file centres the letters.
// - Big centre fronts: the one line at the largest cap (in 0.1 mm steps) that fits the 230 mm box the store uses for
//   the tops' big front (Punched Out.'s one-line-large: 229.75 mm at cap 16.5). Its own drawing: the cap-7 trims
//   shrink with size, as in PO (the S's and the G's cuts are part of their drawing and stay).
// - 6-panel caps (centre seam): the design moves sideways so the seam runs down the middle of a gap clear of every
//   letter: the word space where it is within 6 mm of centre, otherwise the widest letter gap that is.

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const LOGO = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const PO = require('/home/user/offshft/designs/09-punched-out/v3/build.cjs');
const ClipperLib = require('/home/user/offshft/tools/node_modules/clipper-lib');

const REPO = path.resolve(__dirname, '../..');
const U = LOGO.FONTS.unbounded;                      // Unbounded Bold, track 0.12 em
const FONT_FILE = path.join(REPO, 'tools/fonts', kit.FONT_FILES[U.key]);
const UPC = kit.font(U.key).tables.os2.sCapHeight;   // font units per cap height (750)
const CAP = 7;                                       // the logo's cap height: hats and chest
const BIG = { w: 230, step: 0.1 };                   // big centre front: the store's box (PO's one-line-large)
const SEAM_MAX_SHIFT = 6;                            // mm, as PO: the logo moves 5.2 mm; much more looks off-centre
const COLOURS = {
  light: { letters: LOGO.LIGHT.letters, accent: LOGO.LIGHT.hands, bg: kit.F.bone, fabric: 'Bone' },   // Ink + Rust
  dark: { letters: LOGO.DARK.letters, accent: LOGO.DARK.hands, bg: kit.F.slate, fabric: 'Slate' },    // Bone + Sun
};
// Placement areas (mm), as PO: hat fronts 140 x 50, the 4 in left-chest square, the big front's box.
const AREAS = { hat: [140, 50], chest: [101.6, 101.6], big: [BIG.w, 90] };
// Floors, at any size (the task's, the logo's and PO's)
const MIN = {
  cap: 6.6,          // any embroidered Unbounded Bold text (the logo's notes.md)
  opening: 1.27,     // every opening inside a letter, as drawn: 0.05 in (Printful's minimum gap)
  stroke: 1.27,      // every stroke: 0.05 in (Printful's minimum line)
  dot: 1.5,          // full stop and apostrophe: at least 1.5 mm across (the logo's pivot-dot rule)
  dotFabric: 1.3,    // fabric round the full stop (the pivot-dot rule)
  letters: 1.47,     // tightest gap between two letters in the logo (F arm to T bar), as PO
  seam: 1.9,         // a 6-panel seam's gap: about 0.95 mm of fabric each side of the seam's line. PO's seam gap is
                     // 2.43 mm (H-E), and its review called 1.58 mm too narrow to aim a seam at
};
const n = (v) => (Math.round(v * 1000) / 1000).toString();
const f2 = (v) => Number(v).toFixed(2);
const f1 = (v) => Number(v).toFixed(1);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const snap = (u) => Math.round(u * 64) / 64;         // clipper works in 1/64 font units

// ---------------------------------------------------------------- the six designs
const DESIGNS = [
  {
    nn: 15, id: 'nowhere-to-be', text: 'NOWHERE TO BE.', lines: ['NOWHERE', 'TO BE.'], layout: 'stacked-centred', cap: CAP,
    listing: 'Nowhere To Be. Hoodie', price: 'C$89.99', area: 'chest',
    where: 'Hoodies, left chest: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567), S to 3XL',
    styles: ['Oversized (AS Colour 5161)', 'Garment-Dyed (Comfort Colors 1567)'], fleece: true,
  },
  {
    nn: 16, id: 'suns-still-up', text: 'SUN’S STILL UP.', lines: ['SUN’S', 'STILL UP.'], layout: 'stacked-centred', cap: CAP,
    listing: 'Sun’s Still Up. Hat', price: 'C$34.99', area: 'hat',
    where: 'Hat front, seamless: 5-Panel (Otto 31-069) and Rope Cap (Big Accessories BA671)',
    styles: ['5-Panel (Otto 31-069)', 'Rope Cap (Big Accessories BA671)'],
  },
  {
    nn: 17, id: 'no-alarm-set', text: 'NO ALARM SET.', lines: ['NO ALARM SET.'], layout: 'one-line-large', cap: 'big',
    listing: 'No Alarm Set. Crewneck', price: 'C$79.99', area: 'big',
    where: 'Crewneck, big centre front: Comfort Colors 1466, S to 3XL', styles: ['Comfort Colors 1466'], fleece: true,
  },
  {
    nn: 18, id: 'banked-time', text: 'BANKED TIME.', lines: ['BANKED TIME.'], layout: 'one-line', cap: CAP,
    listing: 'Banked Time. Hat', price: 'C$34.99', area: 'hat', sixPanel: 'word-space',
    // the seam runs between the E and the D (the word space is too far off centre): Punched Out.'s E-D kern left out
    kern: { ED: 0.02 },
    where: 'Hat front, 6-panel with a centre seam: Dad Hat (Yupoong 6245CM) and Retro Trucker (Yupoong 6606)',
    styles: ['Dad Hat (Yupoong 6245CM)', 'Retro Trucker (Yupoong 6606)'],
  },
  {
    nn: 19, id: 'not-picking-up', text: 'NOT PICKING UP.', lines: ['NOT PICKING UP.'], layout: 'one-line-large', cap: 'big',
    listing: 'Not Picking Up. Hoodie', price: 'C$89.99', area: 'big',
    where: 'Hoodies, big centre front: Oversized (AS Colour 5161) and Garment-Dyed (Comfort Colors 1567), S to 3XL',
    styles: ['Oversized (AS Colour 5161)', 'Garment-Dyed (Comfort Colors 1567)'], fleece: true,
  },
  {
    nn: 20, id: 'parked', text: 'PARKED.', lines: ['PARKED.'], layout: 'one-line', cap: CAP,
    listing: 'Parked. Trucker Hat', price: 'C$34.99', area: 'hat', sixPanel: 'letter-gap',
    kern: { RK: 0.02 },                                   // the seam runs between the R and the K
    where: 'Hat front, 6-panel with a centre seam: Retro Trucker (Yupoong 6606)', styles: ['Retro Trucker (Yupoong 6606)'],
  },
];

// The quick trademark screen for each phrase (designs/phrases/notes.md: search results only, not a legal search).
const TRADEMARK = {
  'nowhere-to-be': 'small risk: one 2012 US record for the phrase (serial 85784193) that looks like a dead clerical entry. A NOWHERE mark covers hats, so never shorten it to NOWHERE.',
  'suns-still-up': 'looks clear: the nearest filing is SUN’S OUT, BUNS OUT (US Reg. 4544740). Keep the apostrophe.',
  'no-alarm-set': 'looks clear: the nearest filing is NO ALARM (US serial 73382366), abandoned.',
  'banked-time': 'looks clear: the nearest filing is TIME BANK (US serial 87358423), for financial services.',
  'not-picking-up': 'looks clear: the nearest filing is an abandoned DONT PICK UP NO MATTER WHAT! (US serial 86227812).',
  'parked': 'small risk: no PARKED filing for clothing, but it is one letter off PARKE, a women’s clothing brand that sells hats.',
};

// ---------------------------------------------------------------- kerning
// Pair kerning from a font's GPOS 'kern' lookups (x advance of the first glyph, font units), extension lookups
// included. PairPos formats 1 and 2; per lookup, the first subtable that covers the pair applies.
function gposKern(file) {
  const buf = fs.readFileSync(file), dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const u16 = (o) => dv.getUint16(o), i16 = (o) => dv.getInt16(o), u32 = (o) => dv.getUint32(o), tag = (o) => String.fromCharCode(...buf.subarray(o, o + 4));
  let gpos = 0;
  for (let i = 0, nt = u16(4); i < nt; i++) if (tag(12 + 16 * i) === 'GPOS') gpos = u32(12 + 16 * i + 8);
  if (!gpos) return () => 0;
  const featList = gpos + u16(gpos + 6), lookupList = gpos + u16(gpos + 8), lookups = new Set();
  for (let i = 0, nf = u16(featList); i < nf; i++) {
    const r = featList + 2 + 6 * i;
    if (tag(r) !== 'kern') continue;
    const f = featList + u16(r + 4);
    for (let j = 0, m = u16(f + 2); j < m; j++) lookups.add(u16(f + 4 + 2 * j));
  }
  const coverage = (o) => { const m = new Map(); if (u16(o) === 1) { for (let i = 0, c = u16(o + 2); i < c; i++) m.set(u16(o + 4 + 2 * i), i); } else { for (let i = 0, c = u16(o + 2); i < c; i++) { const r = o + 4 + 6 * i; for (let g = u16(r); g <= u16(r + 2); g++) m.set(g, u16(r + 4) + g - u16(r)); } } return m; };
  const classDef = (o) => { const m = new Map(); if (u16(o) === 1) { const s = u16(o + 2); for (let i = 0, c = u16(o + 4); i < c; i++) m.set(s + i, u16(o + 6 + 2 * i)); } else { for (let i = 0, c = u16(o + 2); i < c; i++) { const r = o + 4 + 6 * i; for (let g = u16(r); g <= u16(r + 2); g++) m.set(g, u16(r + 4)); } } return m; };
  const size = (vf) => { let c = 0; for (let b = vf; b; b >>= 1) c += b & 1; return 2 * c; };
  const xAdv = (o, vf) => (vf & 4 ? i16(o + (vf & 1 ? 2 : 0) + (vf & 2 ? 2 : 0)) : 0);
  const subs = [...lookups].sort((a, b) => a - b).map((li) => {
    const L = lookupList + u16(lookupList + 2 + 2 * li), out = [];
    for (let s = 0, ns = u16(L + 4); s < ns; s++) {
      let st = L + u16(L + 6 + 2 * s), t = u16(L);
      if (t === 9) { t = u16(st + 2); st += u32(st + 4); }
      if (t !== 2) continue;
      const fmt = u16(st), vf1 = u16(st + 4), vf2 = u16(st + 6);
      const sub = { fmt, st, vf1, s1: size(vf1), s2: size(vf2), cov: coverage(st + u16(st + 2)) };
      if (fmt === 2) Object.assign(sub, { cd1: classDef(st + u16(st + 8)), cd2: classDef(st + u16(st + 10)), n2: u16(st + 14) });
      out.push(sub);
    }
    return out;
  });
  return (g1, g2) => {
    let total = 0;
    for (const lookup of subs) for (const s of lookup) {
      if (!s.cov.has(g1)) continue;
      if (s.fmt === 1) {
        const ps = s.st + u16(s.st + 10 + 2 * s.cov.get(g1)), rec = 2 + s.s1 + s.s2;
        let hit = null;
        for (let i = 0, c = u16(ps); i < c; i++) if (u16(ps + 2 + i * rec) === g2) { hit = xAdv(ps + 4 + i * rec, s.vf1); break; }
        if (hit === null) continue;
        total += hit; break;
      }
      total += xAdv(s.st + 16 + ((s.cd1.get(g1) || 0) * s.n2 + (s.cd2.get(g2) || 0)) * (s.s1 + s.s2), s.vf1); break;
    }
    return total;
  };
}
const FONT = kit.font(U.key);
const fontKernUnits = gposKern(FONT_FILE);
const fontKern = (a, b) => fontKernUnits(FONT.charToGlyph(a).index, FONT.charToGlyph(b).index);
// This set's own optical kerns, in cap heights, on top of the font's and PO's. Judged on the true-size proofs and on
// the white between each pair: per row of the cap band, from one letter's edge to the next (each edge no further in
// than 0.2 cap from the letter's extreme), averaged. Punched Out.'s pairs, after its kerning, run 0.35-0.41 cap (two
// straight stems 0.35, U-T 0.41) and its word space 0.89; these are the pairs of this set that were well over that.
const EXTRA_KERN = {
  'N’': -0.06, '’S': -0.055,  // SUN’S: 6.08 mm of fabric from the N to the S under the apostrophe, 7.0 mm wide on average
                              // below it, wider than the word space in STILL UP. (6.3): it read SUN’ S. The two gaps
                              // become 1.52 and 1.50 mm, over the 1.47 mm floor
  LA: -0.05,                  // ALARM: 0.49 cap of white (the font has no L-A kern); closer, the feet crowd at the baseline
  ET: -0.04,                  // SET.: 0.47 cap (the font's own E-T kern is only -9 units)
  SU: -0.02,                  // SUN’S: 0.42 cap
  LL: -0.02, TI: -0.02,       // STILL, TIME: 0.43 cap
  OT: -0.02, TO: -0.02,       // NOT, TO BE.: 0.43 cap, on top of the font's own -31 units (the two kept alike)
};
const poKern = (a, b) => PO.KERN[a + b] || 0;                                      // PO's setLine, exactly
const kernOf = (a, b) => (PO.KERN[a + b] !== undefined ? PO.KERN[a + b] : fontKern(a, b) / UPC) + (EXTRA_KERN[a + b] || 0);
// a design's kerning: the set's, plus its own (the 6-panel seam's pair, opened)
const kernFor = (d) => (a, b) => kernOf(a, b) + ((d.kern && d.kern[a + b]) || 0);

// ---------------------------------------------------------------- letters
// Clipper helpers, in font units (y up), as the logo's glyphMM works: integer coordinates at 1/64 unit.
const SC = 64;
const toC = (P) => P.map(([x, y]) => ({ X: Math.round(x * SC), Y: Math.round(y * SC) }));
const fromC = (P) => P.map(({ X, Y }) => [X / SC, Y / SC]);
function clip(type, a, b) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(a.filter((p) => p.length > 2), ClipperLib.PolyType.ptSubject, true);
  if (b) c.AddPaths(b.filter((p) => p.length > 2), ClipperLib.PolyType.ptClip, true);
  const s = new ClipperLib.Paths();
  c.Execute(type, s, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return s;
}
const UNION = ClipperLib.ClipType.ctUnion;
// Shapes for glyphMM's table. A moved outline (the S's) has a vertex every few font units, some a fraction of a unit
// apart, which the mm outline glyphMM writes (rounded to 0.001 mm) could turn into zigzags; so each polygon is
// simplified first (Douglas-Peucker, within 0.25 font units of the original, then no two vertices closer than 0.75).
function simplify(P, tol = 0.25, gap = 0.75) {
  if (P.length < 4) return P;
  const far = P.reduce((best, p, i) => (Math.hypot(p[0] - P[0][0], p[1] - P[0][1]) > Math.hypot(P[best][0] - P[0][0], P[best][1] - P[0][1]) ? i : best), 0);
  const dp = (pts) => {
    const [a, b] = [pts[0], pts[pts.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let worst = 0, at = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i], d = L ? Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / L : Math.hypot(p[0] - a[0], p[1] - a[1]);
      if (d > worst) { worst = d; at = i; }
    }
    return worst > tol ? [...dp(pts.slice(0, at + 1)).slice(0, -1), ...dp(pts.slice(at))] : [a, b];
  };
  const kept = [...dp(P.slice(0, far + 1)).slice(0, -1), ...dp([...P.slice(far), P[0]]).slice(0, -1)];
  return kept.filter((p, i) => i === 0 || Math.hypot(p[0] - kept[i - 1][0], p[1] - kept[i - 1][1]) >= gap);
}
const shapes = (paths) => paths.map(fromC).map((P) => simplify(P)).filter((P) => P.length > 2).map((P) => P.map(([x, y]) => [snap(x), snap(y)]));
// A letter's outline as the logo's glyphMM reads it (quadratics in 24 steps), font units, y up, merged.
function outline(ch) {
  const out = []; let cur = null, x0 = 0, y0 = 0;
  for (const c of FONT.charToGlyph(ch).getPath(0, 0, FONT.unitsPerEm).commands) {
    if (c.type === 'M') { cur = [[c.x, -c.y]]; out.push(cur); x0 = c.x; y0 = c.y; }
    else if (c.type === 'L') { cur.push([c.x, -c.y]); x0 = c.x; y0 = c.y; }
    else if (c.type === 'Q') { for (let i = 1; i <= 24; i++) { const t = i / 24, u = 1 - t; cur.push([u * u * x0 + 2 * u * t * c.x1 + t * t * c.x, -(u * u * y0 + 2 * u * t * c.y1 + t * t * c.y)]); } x0 = c.x; y0 = c.y; }
  }
  return clip(UNION, out.filter((c) => c.length > 2).map(toC));
}
function hull(pts) {
  pts = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
// Unbounded Bold's own numbers for the letters edited here, font units, y up (read from tools/fonts/Unbounded-Bold.ttf).
const FONT_B = { stem: [70, 277], lowerCounter: [145, 314], upperCounter: [456, 605], notch: { x: 690, y: [370, 420] } };
// S: its terminal faces and axis; its spine runs through (420, 379) at -5.5 degrees, its edges 84 units either side
const FONT_S = { upperFace: 519, lowerFace: 246, axis: 420, spine: { centre: [420, 379], angle: -5.5, edge: 84 } };
// G: the upper terminal's underside and the bar's top (its mouth: 83 units); the C's mouth as the font draws it
const FONT_G = { face: 471, bar: 388, cMouth: 436 - 314 };
// ’: its tail's flat end (x 48-146 at y 402) and left side (through (48, 402) and (148, 612)); its head above y 537
const FONT_APOS = { end: 402, endX: [48, 146], left: [100, 210], head: 537 };
// The edits at cap 7, and the caps from which each is no longer needed (they shrink linearly in between, as PO's trims
// shrink with size).
const B_NECK = { x: 718, capNone: 7.64 };   // notch filled to x 718: the neck 142 units (the B's middle bar: 1.33 mm at cap 7)
// S: the terminal faces (every size); the inside move (eps at cap 7, fading in from w to w + ramp in from the hull's
// edge); each spine edge's ramp runs from -L to +L along the spine, and the spine's edges are told from the rest by
// their distance from its centreline (all within `across[0]`, none beyond `across[1]`; `side` blends top and bottom)
const S_OPEN = { upperFace: 572, lowerFace: 186, eps: 15, w: 20, ramp: 160, capNone: 14, L: 130, across: [100, 200], side: 60, step: 4 };
const APOS = { d: 30, capNone: 11.3 };
const fade = (cap, capNone) => clamp((capNone - cap) / (capNone - CAP), 0, 1);
const smooth = (t) => t * t * (3 - 2 * t);
// a polygon with no edge longer than step (so a move that varies along an edge can bend it)
function densify(P, step) {
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let j = 0; j < m; j++) out.push([a[0] + ((b[0] - a[0]) * j) / m, a[1] + ((b[1] - a[1]) * j) / m]);
  }
  return out;
}
// The S's outline with its inside edges moved back into the ink by up to eps font units (see S_OPEN), one polygon.
function sMoved(eps) {
  const S0 = outline('S');
  if (S0.length !== 1) throw new Error('S: expected one outline');
  const P = densify(fromC(S0[0]), S_OPEN.step), H = hull(P);
  const segd = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], t = clamp(((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy), 0, 1); return Math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy); };
  const depth = (p) => Math.min(...H.map((a, i) => segd(p, a, H[(i + 1) % H.length])));
  const sp = FONT_S.spine, ux = Math.cos((sp.angle * Math.PI) / 180), uy = Math.sin((sp.angle * Math.PI) / 180);
  const fall = (v, [a, b]) => 1 - smooth(clamp((v - a) / (b - a), 0, 1));
  const ramp = (v) => clamp((v + S_OPEN.L) / (2 * S_OPEN.L), 0, 1);
  // how much of the move an edge point takes: all, except on the spine's edges, which take it by the ramp
  const share = (p) => {
    const dx = p[0] - sp.centre[0], dy = p[1] - sp.centre[1], a = dx * ux + dy * uy, b = -dx * uy + dy * ux;
    const top = smooth(clamp(0.5 + b / S_OPEN.side, 0, 1));                     // 1 on the top edge, 0 on the bottom
    return 1 - fall(Math.abs(b), S_OPEN.across) * (top * (1 - ramp(a)) + (1 - top) * (1 - ramp(-a)));
  };
  const turn = Math.sign(area(P));                                               // + : anticlockwise, ink on the left
  const Q = P.map((p, i) => {
    const a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length];
    const l1 = Math.hypot(p[0] - a[0], p[1] - a[1]) || 1, l2 = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
    let nx = turn * (-(p[1] - a[1]) / l1 - (b[1] - p[1]) / l2), ny = turn * ((p[0] - a[0]) / l1 + (b[0] - p[0]) / l2);
    const nl = Math.hypot(nx, ny) || 1;
    const e = eps * smooth(clamp((depth(p) - S_OPEN.w) / S_OPEN.ramp, 0, 1)) * share(p);
    return [p[0] + (nx / nl) * e, p[1] + (ny / nl) * e];
  });
  return shapes(clip(UNION, [toC(Q)]));
}
// The apostrophe's tail, w units wider each side at its flat end, with straight sides (see the header).
function aposTail(w) {
  const P = fromC(outline('’')[0]), head = P.filter((p) => p[1] >= FONT_APOS.head);
  const C = [head.reduce((s, p) => s + p[0], 0) / head.length, head.reduce((s, p) => s + p[1], 0) / head.length];
  const EL = [FONT_APOS.endX[0] - w, FONT_APOS.end], ER = [FONT_APOS.endX[1] + w, FONT_APOS.end];
  // the right side: the tangent from the end's right corner to the head (the head point at the smallest angle)
  const TR = head.reduce((best, h) => (Math.atan2(h[1] - ER[1], h[0] - ER[0]) < Math.atan2(best[1] - ER[1], best[0] - ER[0]) ? h : best), head[0]);
  // the left side: parallel to the font's, from the end's left corner to beside the head's centre
  const dl = Math.hypot(...FONT_APOS.left), d = [FONT_APOS.left[0] / dl, FONT_APOS.left[1] / dl];
  const t = (C[0] - EL[0]) * d[0] + (C[1] - EL[1]) * d[1];
  return [[EL, ER, TR, C, [EL[0] + d[0] * t, EL[1] + d[1] * t]].map(([x, y]) => [snap(x), snap(y)])];
}
const editCache = new Map();
function letterEdits(cap) {
  if (editCache.has(cap)) return editCache.get(cap);
  const po = PO.letterEdits(cap), k = cap / UPC;
  const edits = { ...po.edits }, applied = { po: po.trims };
  // B: straight stem; the notch between the bowls filled at its tip
  const fb = fade(cap, B_NECK.capNone), nx = FONT_B.notch.x + (B_NECK.x - FONT_B.notch.x) * fb;
  edits.B = {
    add: [[FONT_B.stem[0], 0, FONT_B.stem[1], UPC], ...(fb ? [[600, FONT_B.notch.y[0], snap(nx), FONT_B.notch.y[1]]] : [])],
    cut: [[-200, -100, FONT_B.stem[0], UPC + 100], [FONT_B.stem[1], FONT_B.lowerCounter[0], 330, FONT_B.lowerCounter[1]], [FONT_B.stem[1], FONT_B.upperCounter[0], 330, FONT_B.upperCounter[1]]],
  };
  applied.B = { neckFill: fb ? (nx - FONT_B.notch.x) * k : 0 };
  // S: the terminals cut higher (every size); the inside edges moved back (small sizes)
  const eps = S_OPEN.eps * fade(cap, S_OPEN.capNone);
  edits.S = {
    ...(eps ? { draw: sMoved(eps) } : {}),
    cut: [[FONT_S.axis, FONT_S.upperFace, 4000, S_OPEN.upperFace], [-4000, S_OPEN.lowerFace, FONT_S.axis, FONT_S.lowerFace]],
  };
  applied.S = { upperMM: (S_OPEN.upperFace - FONT_S.upperFace) * k, lowerMM: (FONT_S.lowerFace - S_OPEN.lowerFace) * k, eps, epsMM: eps * k };
  // G: the mouth opened to the C's (PO's C trim included), by cutting the terminal's underside higher
  const gFace = snap(FONT_G.bar + Math.max(FONT_G.cMouth, (150 * CAP) / cap));       // 150: PO's C mouth at cap 7
  edits.G = { cut: [[600, FONT_G.face, 1000, gFace]] };
  applied.G = { face: gFace, mm: (gFace - FONT_G.face) * k, mouthUnits: gFace - FONT_G.bar };
  // ’: the tail widened with straight sides (small sizes)
  const wa = APOS.d * fade(cap, APOS.capNone);
  if (wa) { edits['’'] = { add: aposTail(wa) }; applied.apos = { w: wa, mm: wa * k }; } else applied.apos = null;
  const out = { edits, applied };
  editCache.set(cap, out);
  return out;
}

// ---------------------------------------------------------------- setting
// PO's setLine with the kerning as an argument: one line, letter by letter, as merged outlines.
function setText(str, x, baseY, cap, edits, kern = kernOf) {
  const t = kit.text(str, { font: U.key, cap, track: U.track, x: 0, y: 0 });
  if (t.letters.length !== str.length) throw new Error(`"${str}": the font substituted glyphs; set it letter by letter`);
  const glyphs = [];
  let shift = 0;
  for (let i = 0; i < str.length; i++) {
    if (i > 0) shift += kern(str[i - 1], str[i]) * cap;
    if (str[i] === ' ') continue;
    const ox = x + t.letters[i].x + shift, g = LOGO.glyphMM(U, str[i], ox, baseY, cap, edits);
    const polys = g.d.split('M').filter(Boolean).map((s) => s.replace(/Z\s*$/, '').trim().split(' L').map((p) => p.trim().split(/\s+/).map(Number)));
    glyphs.push({ ch: str[i], d: g.d, polys, box: boxOf(g.pts), base: baseY, at: i, cap, ox });
  }
  return glyphs;
}
const boxOf = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const boxOfAll = (gs) => ({ x0: Math.min(...gs.map((g) => g.box.x0)), y0: Math.min(...gs.map((g) => g.box.y0)), x1: Math.max(...gs.map((g) => g.box.x1)), y1: Math.max(...gs.map((g) => g.box.y1)) });
const isStop = (g) => g.ch === '.';
const lettersOnly = (gs) => gs.filter((g) => !isStop(g));

function layout(d, cap) {
  const { edits } = letterEdits(cap), kern = kernFor(d);
  if (d.lines.length === 1) return [setText(d.lines[0], 0, 0, cap, edits, kern)];
  // stacked: both lines centred on one axis by their letters (the stop hangs), PO's line gap
  const probe = d.lines.map((s) => boxOfAll(lettersOnly(setText(s, 0, 0, cap, edits, kern))));
  const widest = Math.max(...probe.map((b) => b.x1 - b.x0));
  return d.lines.map((s, i) => setText(s, (widest - (probe[i].x1 - probe[i].x0)) / 2 - probe[i].x0, i * (PO.LINE_GAP * cap + cap), cap, edits, kern));
}
// The file's box: the ink's, widened on the left where a stack's full stop hangs past its widest line, so the file is
// centred on the letters' axis (centring the file on the garment centres the letters).
function fileBox(lines) {
  const b = boxOfAll(lines.flat());
  if (lines.length < 2) return b;
  const l = boxOfAll(lettersOnly(lines.flat())), axis = (l.x0 + l.x1) / 2;
  return { ...b, x0: Math.min(b.x0, 2 * axis - b.x1), x1: Math.max(b.x1, 2 * axis - b.x0) };
}
// The big front's cap: the largest, in 0.1 mm steps, at which the one line fits the box's width.
function bigCap(d) {
  const w10 = (() => { const b = boxOfAll(layout(d, 10).flat()); return b.x1 - b.x0; })();
  let cap = Math.floor(((BIG.w / w10) * 10) / BIG.step + 1e-9) * BIG.step;
  cap = +cap.toFixed(1);
  for (;;) { const b = boxOfAll(layout(d, cap).flat()); if (b.x1 - b.x0 <= BIG.w) return cap; cap = +(cap - BIG.step).toFixed(1); }
}

function svgBody(lines, c) {
  const all = lines.flat(), b = fileBox(lines);
  const ink = all.filter((g) => !isStop(g)).map((g) => g.d).join(' ');
  const stop = all.filter(isStop).map((g) => g.d).join(' ');
  return {
    w: b.x1 - b.x0, h: b.y1 - b.y0,
    body: `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})"><path id="letters" fill="${c.letters}" fill-rule="evenodd" d="${ink}"/><path id="full-stop" fill="${c.accent}" d="${stop}"/></g>`,
  };
}

// ---------------------------------------------------------------- measuring
// PO's measuring, made general (PO's measure() names PUNCHED OUT.'s letters). Every stroke and gap is measured along
// the outline's normals: from points every 0.05 mm on each outline, a ray inwards (stroke width) and a ray outwards (the
// gap to the next stitches, in this letter or another). A width is two edges that face each other, so a ray only counts
// when the edge it hits runs within 30 degrees of the edge it left; anything else cuts across a corner. Sharp inside
// corners (crotches) are listed separately, and gaps that are only the narrow tip of a crotch don't count as openings.
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
      if (counts(e, o)) gaps.push({ w: o.t, a: e.gi, b: o.hit.e.gi, ea: e, eb: o.hit.e, at: [px, py], to: [px - nx * o.t, py - ny * o.t] });
    }
  }
  return { strokes, gaps };
}
// Sharp inside corners (fabric-side angle under 60 degrees): crotches.
function acuteCorners(glyphs) {
  const out = [];
  glyphs.forEach((g, gi) => { g.polys.forEach((P, ci) => { for (let i = 0; i < P.length; i++) {
    const v = P[i], p = P[(i + P.length - 1) % P.length], q = P[(i + 1) % P.length];
    const ax = p[0] - v[0], ay = p[1] - v[1], bx = q[0] - v[0], by = q[1] - v[1], la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < 1e-6 || lb < 1e-6) continue;
    let ang = (Math.acos(clamp((ax * bx + ay * by) / (la * lb), -1, 1)) * 180) / Math.PI;
    const mx = ax / la + bx / lb, my = ay / la + by / lb, ml = Math.hypot(mx, my);
    if (ml < 1e-9) continue;
    if (inside(g, v[0] + (mx / ml) * 0.01, v[1] + (my / ml) * 0.01)) ang = 360 - ang;
    if (ang < 60) out.push({ gi, ci, vi: i, ch: g.ch, angle: ang, at: v, P });
  } }); });
  return out;
}
// A gap is a crotch's tip, not an opening, when it runs between the crotch's two sides: one end on the outline running
// into the crotch's point from one side, the other on the outline from the other side, each within a few chord-widths
// of the point along the outline (4x the distance at which a straight wedge of that angle is as wide as the gap). So
// the narrow tip of the G's pocket under its bar counts as its crotch, and the G's mouth, just above the bar, doesn't.
function inCrotch(gap, crotches) {
  return crotches.some((c) => {
    if (c.gi !== gap.a || gap.b !== gap.a || gap.ea.ci !== c.ci || gap.eb.ci !== c.ci) return false;
    const reach = (4 * gap.w) / (2 * Math.sin((c.angle * Math.PI) / 360)), N = c.P.length;
    const along = (e, dir) => {        // outline length from the crotch's point to edge e, walking one way
      let L = 0;
      for (let s = 0; s < N && L <= reach; s++) {
        const i = (c.vi + dir * s + N) % N, j = (i + dir + N) % N;
        if ((dir > 0 && e.va === i) || (dir < 0 && e.va === j)) return L;
        L += Math.hypot(c.P[j][0] - c.P[i][0], c.P[j][1] - c.P[i][1]);
      }
      return Infinity;
    };
    return (along(gap.ea, 1) <= reach && along(gap.eb, -1) <= reach) || (along(gap.ea, -1) <= reach && along(gap.eb, 1) <= reach);
  });
}
function segDist(a, b, c, d) {
  const pd = (p, q, r) => { const vx = r[0] - q[0], vy = r[1] - q[1], L2 = vx * vx + vy * vy; let t = L2 ? ((p[0] - q[0]) * vx + (p[1] - q[1]) * vy) / L2 : 0; t = clamp(t, 0, 1); return Math.hypot(p[0] - q[0] - t * vx, p[1] - q[1] - t * vy); };
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
    if (x !== undefined && (a[0] > x) !== (b[0] > x)) out.push(a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]));
    if (y !== undefined && (a[1] > y) !== (b[1] > y)) out.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
  }
  return out.sort((p, q) => p - q);
}
const runs = (c) => { const r = []; for (let i = 0; i + 1 < c.length; i++) r.push(c[i + 1] - c[i]); return r; };   // ink, gap, ink, ...
const inkRuns = (c) => runs(c).filter((_, i) => i % 2 === 0);
function inkCentre(glyphs) {
  let A = 0, X = 0, Y = 0;
  for (const g of glyphs) for (const p of g.polys) for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length], c = x0 * y1 - x1 * y0;
    A += c; X += (x0 + x1) * c; Y += (y0 + y1) * c;
  }
  return { area: Math.abs(A / 2), x: X / (3 * A), y: Y / (3 * A) };
}
// The largest circle inside a closed polygon (a counter), by a fine grid.
function inscribed(P) {
  const b = boxOf(P), step = Math.max(b.x1 - b.x0, b.y1 - b.y0) / 300;
  const g = { polys: [P] };
  let best = 0;
  for (let x = b.x0; x <= b.x1; x += step) for (let y = b.y0; y <= b.y1; y += step) {
    if (!inside(g, x, y)) continue;
    let d = Infinity;
    for (let i = 0; i < P.length; i++) d = Math.min(d, segDist([x, y], [x, y], P[i], P[(i + 1) % P.length]));
    if (d > best) best = d;
  }
  return 2 * best;
}
// Vertical channels clear of every line's letters (letter boxes): where a 6-panel cap's centre seam can run without
// crossing a letter. Each is [x0, x1, 'A|B' per line].
function channels(lines, b) {
  let free = [[-Infinity, Infinity]];
  for (const line of lines) {
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
// Stitch order: centre out from the letter nearest cx (on to the right-hand end, then back from the centre to the left
// end), bottom line first on a stack, as caps are sewn centre out and bottom up; the full stop after the colour change.
function stitchOrder(lines, cx, texts) {
  return lines.map((line, i) => {
    const ls = lettersOnly(line).map((g) => ({ ch: g.ch, c: (g.box.x0 + g.box.x1) / 2 }));
    const start = ls.reduce((best, g, j) => (Math.abs(g.c - cx) < Math.abs(ls[best].c - cx) ? j : best), 0);
    return { word: texts ? texts[i] : ls.map((g) => g.ch).join(''), right: ls.slice(start).map((g) => g.ch), left: ls.slice(0, start).reverse().map((g) => g.ch) };
  }).reverse();
}
const orderText = (o) => o.map((l) => `${o.length > 1 ? `${l.word}: ` : ''}${l.right.join(', ')}${l.left.length ? `, then ${l.left.join(', ')}` : ''}`).join('; ');

// Vertical stems, from horizontal cuts at a height where each stem stands clear (PO's table, extended): the first ink
// run, or the first and last.
const STEM_AT = { P: [0.22, 1], U: [0.6, 2], N: [0.6, 2], H: [0.22, 2], E: [0.3, 1], D: [0.5, 1], T: [0.3, 1], B: [0.22, 1], I: [0.5, 1], K: [0.75, 1], L: [0.6, 1], M: [0.6, 2], R: [0.22, 1] };
// Named openings for the letters whose openings are narrow, measured with cuts like PO's.
function namedOpenings(g, gi, sc, crotches) {
  const cap = g.cap, k = cap / UPC, w = g.box.x1 - g.box.x0, cx = (g.box.x0 + g.box.x1) / 2, cy = (g.box.y0 + g.box.y1) / 2;
  const own = sc.gaps.filter((q) => q.a === gi && q.b === gi && !inCrotch(q, crotches));
  const minOf = (f) => { const s = own.filter(f); return s.length ? Math.min(...s.map((q) => q.w)) : null; };
  const mid = (q) => [(q.at[0] + q.to[0]) / 2, (q.at[1] + q.to[1]) / 2];
  switch (g.ch) {
    case 'E': { const r = runs(cross(g, { x: g.box.x0 + 0.62 * w })); return [{ name: 'slots', values: [r[1], r[3]] }]; }
    case 'C': case 'G': { const r = runs(cross(g, { x: g.box.x1 - (0.5 * cap) / CAP })); return [{ name: 'mouth', values: [r[1]] }]; }
    case 'B': { const r = runs(cross(g, { x: g.box.x0 + 0.4 * w })); return [{ name: 'counters (upper / lower)', values: [r[1], r[3]] }]; }   // the cut runs top down
    case 'S': return [
      { name: 'apertures (upper / lower)', values: [minOf((q) => mid(q)[1] < cy && mid(q)[0] > cx), minOf((q) => mid(q)[1] > cy && mid(q)[0] < cx)] },
      { name: 'counters, at their narrow ends (upper / lower)', values: [minOf((q) => mid(q)[1] < cy && mid(q)[0] <= cx), minOf((q) => mid(q)[1] > cy && mid(q)[0] >= cx)] },
    ];
    case 'A': { const hole = [...g.polys].sort((p, q) => Math.abs(area(p)) - Math.abs(area(q)))[0]; return [{ name: 'counter (widest circle inside it)', values: [inscribed(hole)] }]; }
    default: return [];
  }
}
const area = (P) => { let a = 0; for (let i = 0; i < P.length; i++) { const [x0, y0] = P[i], [x1, y1] = P[(i + 1) % P.length]; a += x0 * y1 - x1 * y0; } return a / 2; };
// The S's strokes, from vertical cuts (top arc, upper counter, spine, lower counter, bottom arc): at its axis, and 100
// font units either side for the spine (it runs at 5.5 degrees, so a vertical cut is within 0.5% of its width).
function sStrokes(g) {
  const k = g.cap / UPC, at = (u) => runs(cross(g, { x: g.ox + u * k }));
  const r = at(FONT_S.axis), spine = [-100, 0, 100].map((u) => at(FONT_S.axis + u)[2]);
  return { arcs: [r[0], r[4]], spine: r[2], spineMin: Math.min(...spine), spineMax: Math.max(...spine) };
}
// The R's notch: the gap between its stem and its leg, just under the bowl (font y 270), where it is narrowest.
function rNotch(g) {
  const k = g.cap / UPC, c = cross(g, { y: g.base - 269 * k });
  return runs(c)[1];
}

function measure(v) {
  const cap = v.cap, all = v.lines.flat(), b = boxOfAll(all), letters = lettersOnly(all);
  const sc = scan(all), crotches = acuteCorners(all);
  // strokes: thinnest per letter (in reading order), and every vertical stem
  const thinnest = {};
  sc.strokes.forEach((s, i) => { const ch = all[i].ch; if (!isStop(all[i]) && !(ch in thinnest && thinnest[ch].w <= s.w)) thinnest[ch] = { w: s.w, at: s.at }; });
  const thinnestAll = Object.entries(thinnest).sort((p, q) => p[1].w - q[1].w)[0];
  const stems = [];
  for (const g of letters) {
    const s = STEM_AT[g.ch];
    if (!s) continue;
    const r = inkRuns(cross(g, { y: g.base - s[0] * cap }));
    stems.push({ ch: g.ch, w: r[0] }); if (s[1] === 2) stems.push({ ch: g.ch, w: r[r.length - 1] });
  }
  // openings: gaps inside one letter that aren't a crotch's tip; per letter, and the named ones
  const openings = {}, openingAt = {};
  sc.gaps.forEach((q) => {
    if (q.a !== q.b || isStop(all[q.a]) || inCrotch(q, crotches)) return;
    const ch = all[q.a].ch;
    if (!(ch in openings) || q.w < openings[ch]) { openings[ch] = q.w; openingAt[ch] = { at: q.at, to: q.to, g: all[q.a] }; }
  });
  const named = {};
  all.forEach((g, gi) => { if (!named[g.ch]) { const nm = namedOpenings(g, gi, sc, crotches); if (nm.length) named[g.ch] = nm; } });
  if (named.A) openings.A = Math.min(openings.A || Infinity, named.A[0].values[0]);
  const smallest = Object.entries(openings).sort((p, q) => p[1] - q[1])[0] || null;
  const R = all.find((g) => g.ch === 'R'), S = all.find((g) => g.ch === 'S');
  // crotches, per letter: angle and how far thread fills it (to where it is 1.0-1.15 mm across, as PO's N: 1.6-1.8 mm)
  const crotchList = [];
  for (const c of [...crotches].sort((p, q) => p.ch.localeCompare(q.ch) || p.angle - q.angle)) {
    const same = crotchList.find((q) => q.ch === c.ch && Math.abs(q.angle - c.angle) < 1);
    if (same) { if (!same.at.some((p) => Math.hypot(p[0] - c.at[0], p[1] - c.at[1]) < 0.05)) { same.count++; same.at.push(c.at); } continue; }
    const t = Math.tan((c.angle * Math.PI) / 360);
    crotchList.push({ ch: c.ch, angle: c.angle, fill: [0.5 / t, 0.575 / t], count: 1, at: [c.at] });
  }
  // gaps between letters, word spaces, lines; the full stop; the apostrophe
  const pairs = [], spaces = [];
  for (const line of v.lines) for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i], z = line[i + 1], w = closest(a, z);
    if (z.at - a.at > 1) spaces.push({ p: a.ch + z.ch, w, channel: z.box.x0 - a.box.x1 });   // channel: clear vertically
    else if (!isStop(a) && !isStop(z)) pairs.push({ p: a.ch + z.ch, w });
  }
  pairs.sort((p, q) => p.w - q.w);
  const lineGap = v.lines.length === 2 ? Math.min(...v.lines[0].flatMap((g) => v.lines[1].map((h) => closest(g, h)))) : null;
  const dot = all.find(isStop), before = all[all.indexOf(dot) - 1];
  const dotInk = Math.min(...all.filter((g) => g !== dot).map((g) => closest(dot, g)));
  const ap = all.find((g) => g.ch === '’');
  const apos = ap ? { w: ap.box.x1 - ap.box.x0, h: ap.box.y1 - ap.box.y0, stroke: thinnest['’'].w, gaps: v.lines.flatMap((line) => line.filter((g, i) => line[i + 1] === ap || line[i - 1] === ap).map((g) => ({ ch: g.ch, w: closest(g, ap) }))) } : null;
  // 6-panel: the gaps a centre seam can run down, measured from the file's centre (where the design is centred)
  const file = fileBox(v.lines), cx = (file.x0 + file.x1) / 2, ink = inkCentre(all);
  const ch6 = channels(v.lines, b).map(([a, z, ...where]) => ({ x0: a, x1: z, mid: (a + z) / 2, shift: (a + z) / 2 - cx, width: z - a, where }));
  return {
    w: b.x1 - b.x0, h: b.y1 - b.y0, cap, cx, box: b, file, fileW: file.x1 - file.x0, fileH: file.y1 - file.y0,
    thinnest, thinnestAll, stems: { min: Math.min(...stems.map((s) => s.w)), max: Math.max(...stems.map((s) => s.w)), letters: [...new Set(stems.map((s) => s.ch))] },
    openings, openingAt, smallest, named, rNotch: R ? rNotch(R) : null, sStrokes: S ? sStrokes(S) : null, crotches: crotchList, crotchPoints: crotches,
    pairs, spaces, lineGap,
    dot: { w: dot.box.x1 - dot.box.x0, h: dot.box.y1 - dot.box.y0, ink: dotInk, after: before.ch, pastPrev: dot.box.x0 - before.box.x1 },
    apos, ink: { area: ink.area, x: ink.x, dx: ink.x - cx, dy: ink.y - (b.y0 + b.y1) / 2 },
    channels: ch6,
  };
}

// The seam's gap on a 6-panel cap: the word space when it is within SEAM_MAX_SHIFT of the centre, otherwise the widest
// gap that is. shiftDesign: how far the design moves, + = to the wearer's left (the viewer's right). The word space is
// also returned (as wordSpace) when it wasn't used, with what using it would take.
function seamFor(d, m) {
  if (!d.sixPanel) return null;
  const describe = (c) => { const [a, z] = c.where[0].split('|'); return { ...c, between: [a, z], shiftDesign: -c.shift, inkFromSeam: m.ink.x - c.mid }; };
  const words = m.channels.filter((c) => m.spaces.some((s) => c.where[0] === `${s.p[0]}|${s.p[1]}`)).map(describe);
  const near = m.channels.filter((c) => Math.abs(c.shift) <= SEAM_MAX_SHIFT).map(describe);
  const best = (list) => list.slice().sort((p, q) => q.width - p.width || Math.abs(p.shift) - Math.abs(q.shift))[0];
  const word = best(words), nearBest = best(near);
  const pick = d.sixPanel === 'word-space' && word && Math.abs(word.shift) <= SEAM_MAX_SHIFT ? word : nearBest;
  if (!pick) return { none: true, wordSpace: word || null };
  return { ...pick, usesWordSpace: pick === word, wordSpace: word && pick !== word ? word : null };
}

// ---------------------------------------------------------------- checks
function checks(d, m, seam) {
  const out = [];
  const add = (check, value, limit, pass, unit = 'mm', note) => out.push({ check, value: +(+value).toFixed(2), limit, unit, pass: !!pass, ...(note ? { note } : {}) });
  add('cap height', m.cap, `>= ${MIN.cap}`, m.cap >= MIN.cap);
  const st = m.thinnestAll;
  add('thinnest stroke', st[1].w, `>= ${MIN.stroke}`, st[1].w >= MIN.stroke, 'mm', `in the ${st[0]}`);
  const op = m.smallest;
  add('smallest opening inside a letter', op[1], `>= ${MIN.opening}`, op[1] >= MIN.opening, 'mm', `in the ${op[0]}`);
  for (const [ch, list] of Object.entries(m.named)) for (const o of list) {
    const v = Math.min(...o.values.filter((x) => x !== null));
    add(`${ch} ${o.name}`, v, `>= ${MIN.opening}`, v >= MIN.opening);
  }
  add('full stop across', Math.min(m.dot.w, m.dot.h), `>= ${MIN.dot}`, Math.min(m.dot.w, m.dot.h) >= MIN.dot);
  add('fabric round the full stop', m.dot.ink, `>= ${MIN.dotFabric}`, m.dot.ink >= MIN.dotFabric);
  if (m.apos) add('apostrophe across', m.apos.w, `>= ${MIN.dot}`, m.apos.w >= MIN.dot, 'mm', `${f2(m.apos.w)} x ${f2(m.apos.h)} mm; its tail ${f2(m.apos.stroke)} mm at its narrowest`);
  add('tightest gap between letters', m.pairs[0].w, `>= ${MIN.letters}`, m.pairs[0].w >= MIN.letters, 'mm', `${m.pairs[0].p[0]}-${m.pairs[0].p[1]}`);
  if (m.lineGap !== null) add('gap between the lines', m.lineGap, `>= ${MIN.letters}`, m.lineGap >= MIN.letters);
  const [W, H] = AREAS[d.area], ext = m.fileW / 2 + (seam && !seam.none ? Math.abs(seam.shiftDesign) : 0);
  add(`fits the ${W} x ${H} mm ${d.area === 'hat' ? 'hat front' : d.area === 'chest' ? 'left-chest square' : 'big-front box'}`, W / 2 - ext, '>= 0 spare each side', ext <= W / 2 && m.h <= H, 'mm', 'spare on the tighter side');
  if (seam) add('6-panel seam gap', seam.none ? 0 : seam.width, `>= ${MIN.seam}`, !seam.none && seam.width >= MIN.seam, 'mm', seam.none ? 'no gap near the centre' : `between the ${seam.between[0]} and the ${seam.between[1]}`);
  return { pass: out.every((c) => c.pass), items: out };
}

// ---------------------------------------------------------------- self-test: PO's setting and measuring, reproduced
function selfTest() {
  const ed = PO.letterEdits(CAP).edits;
  for (const s of ['PUNCHED OUT.', 'PUNCHED', 'OUT.']) {
    const a = PO.setLine(s, 0, 0, CAP, ed).map((g) => g.d).join(' '), b = setText(s, 0, 0, CAP, ed, poKern).map((g) => g.d).join(' '), c = setText(s, 0, 0, CAP, ed).map((g) => g.d).join(' ');
    if (a !== b) throw new Error(`self-test: setText with PO's kerning differs from PO.setLine for "${s}"`);
    if (a !== c) throw new Error(`self-test: the font's or this set's kerning changes "${s}" (PO's spacing should be the font's plus PO's kerns)`);
  }
  for (const v of PO.MASTERS) {
    const p = PO.measure(v), m = measure({ cap: v.cap, lines: v.lines });
    const same = (x, y, what) => { if (Math.abs(x - y) > 1e-9) throw new Error(`self-test: ${v.id} ${what}: PO ${x}, here ${y}`); };
    for (const [ch, w] of Object.entries(p.thinnest)) same(w, m.thinnest[ch].w, `thinnest ${ch}`);
    same(p.innerGap.w, m.smallest[1], 'smallest opening');
    same(p.letterPairs[0].w, m.pairs[0].w, 'tightest letter gap');
    same(p.dot.ink, m.dot.ink, 'full stop to the T');
    same(p.cMouth, m.named.C[0].values[0], 'C mouth');
    same(Math.min(...p.eSlots), Math.min(...m.named.E[0].values), 'E slots');
  }
}

// ---------------------------------------------------------------- outputs
const relp = (f) => path.relative(REPO, f).split(path.sep).join('/');
const spare = (m, area, shift = 0) => AREAS[area][0] / 2 - m.fileW / 2 - Math.abs(shift);
const pairName = (p) => `${p[0]}-${p[1]}`;
const nm = (c) => (c === '.' ? 'the full stop' : c === '’' ? 'the apostrophe' : `the ${c}`);

// A 6-panel proof: the light file on the 140 x 50 mm hat front, moved by shift (+ = viewer's right), with the seam.
async function seamProof(out, lines, m, shift, text) {
  const [W, H] = AREAS.hat, body = svgBody(lines, COLOURS.light);
  const x = W / 2 + shift - m.fileW / 2, y = H / 2 - m.fileH / 2;
  const label = (s, ly) => `<text x="3" y="${ly}" font-family="Arial, Helvetica, sans-serif" font-size="2.4" fill="#6E6A60">${s}</text>`;
  const svg = `<rect x="${n(W / 2 - 0.5)}" y="0" width="1" height="${H}" fill="#CFC6B0"/>`
    + [-1.1, 1.1].map((o) => `<line x1="${n(W / 2 + o)}" y1="0" x2="${n(W / 2 + o)}" y2="${H}" stroke="#B8AE96" stroke-width="0.2" stroke-dasharray="0.8 0.6"/>`).join('')
    + `<rect x="0.15" y="0.15" width="${W - 0.3}" height="${H - 0.3}" fill="none" stroke="#B8AE96" stroke-width="0.3" stroke-dasharray="2 1.5"/>`
    + `<g transform="translate(${n(x)} ${n(y)})">${body.body}</g>`
    + text.map((t, i) => label(t, H - 3 - 3 * (text.length - 1 - i))).join('');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'phrases-')), f = path.join(tmp, 'seam.svg');
  kit.writeSvg(f, { w: W, h: H, body: svg });
  await kit.render(f, out, { bg: kit.F.bone, tile: `${W}x${H}`, px: 8, width: W });
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (require.main === module) (async () => {
  selfTest();
  const art = [];
  let failed = false;
  for (const d of DESIGNS) {
    const cap = d.cap === 'big' ? bigCap(d) : d.cap;
    const lines = layout(d, cap);
    const v = { cap, lines };
    const m = measure(v);
    const seam = seamFor(d, m);
    const c = checks(d, m, seam);
    if (!c.pass) failed = true;
    const folder = path.join(REPO, 'designs', `${d.nn}-${d.id}`);
    fs.mkdirSync(folder, { recursive: true });
    const files = {}, proofs = {};
    for (const [tone, col] of Object.entries(COLOURS)) {
      files[tone] = path.join(folder, `design-${tone}.svg`);
      kit.writeSvg(files[tone], svgBody(lines, col));
    }
    const big = d.area === 'big', tile = big ? '290x60' : '110x80';
    const [TW, TH] = tile.split('x').map(Number);
    if (m.fileW > TW - 8 || m.fileH > TH - 8) throw new Error(`${d.id}: too big for a true-size proof on a ${tile} mm swatch`);
    for (const [tone, col] of Object.entries(COLOURS)) {
      proofs[tone] = path.join(folder, `proof-${tone}.png`);
      // width = the file's own width, so kit.render draws it at true size
      await kit.render(files[tone], proofs[tone], { bg: col.bg, tile, px: big ? 4 : 8, width: +m.fileW.toFixed(3) });
    }
    // 6-panel: the light file on the 140 x 50 mm hat front, moved by the shift, with the centre seam; and, where the
    // seam isn't in the word space, the same front with it there, for the owner to compare
    if (seam && !seam.none) {
      proofs.seam = path.join(folder, 'seam-proof.png');
      await seamProof(proofs.seam, lines, m, seam.shiftDesign, [`Centre seam ${seam.usesWordSpace ? 'in the word space' : `between the ${seam.between[0]} and the ${seam.between[1]}`}.`, `Design moved ${f1(Math.abs(seam.shiftDesign))} mm to the ${seam.shiftDesign > 0 ? 'wearer’s left' : 'wearer’s right'}`, `(${seam.shiftDesign > 0 ? 'viewer’s right' : 'viewer’s left'}). ${AREAS.hat.join(' x ')} mm front, true size.`]);
      if (seam.wordSpace) {
        proofs.seamWordSpace = path.join(folder, 'seam-proof-word-space.png');
        const ws = seam.wordSpace;
        await seamProof(proofs.seamWordSpace, lines, m, ws.shiftDesign, ['Not used: the seam in the word space.', `Design moved ${f1(Math.abs(ws.shiftDesign))} mm to the ${ws.shiftDesign > 0 ? 'wearer’s left' : 'wearer’s right'}`, `(${ws.shiftDesign > 0 ? 'viewer’s right' : 'viewer’s left'}); ink centre ${f1(Math.abs(ws.inkFromSeam))} mm off the seam.`]);
      }
    }
    const ctx = { d, cap, m, seam, checks: c, edits: letterEdits(cap).applied, files, proofs, folder, lines };
    fs.writeFileSync(path.join(folder, 'notes.md'), notes(ctx));
    report(ctx);
    art.push({
      id: d.id, folder: relp(folder), listing: d.listing, text: d.text,
      layout: d.layout, files: { [d.layout]: { light: relp(files.light), dark: relp(files.dark) } },
      proofs: Object.fromEntries(Object.entries(proofs).map(([k2, f]) => [k2, relp(f)])), notes: relp(path.join(folder, 'notes.md')),
      w: +f2(m.fileW), h: +f2(m.fileH), ink: { w: +f2(m.w), h: +f2(m.h) }, cap: +f2(cap), placement: d.where,
      ...(m.fileW - m.w > 0.005 ? { centring: `The file is ${f2(m.fileW)} mm wide, ${f2(m.fileW - m.w)} mm wider than the ink on the left, so its centre is the letters' centre (the full stop hangs past ${d.lines[d.lines.length - 1].replace(/\.$/, '')}): centre the file.` } : {}),
      sixPanelShift: seam && !seam.none ? +f2(seam.shiftDesign) : null,
      sixPanelSeam: seam && !seam.none ? { between: seam.between, gap: +f2(seam.width), inkCentreFromSeam: +f2(seam.inkFromSeam) } : null,
      ...(seam && seam.wordSpace ? { sixPanelWordSpace: { shift: +f2(seam.wordSpace.shiftDesign), between: seam.wordSpace.between, gap: +f2(seam.wordSpace.width), inkCentreFromSeam: +f2(seam.wordSpace.inkFromSeam), proof: relp(proofs.seamWordSpace), note: `not used: past the ${SEAM_MAX_SHIFT} mm limit, and the line would sit visibly off-centre; the owner's alternative` } } : {}),
      checks: c,
    });
  }
  await kit.close();
  fs.writeFileSync(path.join(__dirname, 'art.json'), JSON.stringify(art, null, 2) + '\n');
  if (failed) { console.error('\nSome checks failed (see above and art.json).'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { DESIGNS, letterEdits, setText, layout, measure, kernOf, gposKern };

// ---------------------------------------------------------------- console report
function report({ d, cap, m, seam, checks: c, edits }) {
  console.log(`\n${d.nn}-${d.id}: ${d.text} ${f2(m.w)} x ${f2(m.h)} mm at cap ${f2(cap)} (${d.layout})${m.fileW - m.w > 0.005 ? `; file ${f2(m.fileW)} x ${f2(m.fileH)} mm, centred on the letters` : ''}; ink ${f1(m.ink.area)} mm2`);
  console.log(`  strokes: stems ${f2(m.stems.min)}-${f2(m.stems.max)}; thinnest ${Object.entries(m.thinnest).map(([ch, s]) => `${ch} ${f2(s.w)}`).join(', ')}`);
  console.log(`  openings: ${Object.entries(m.openings).map(([ch, w]) => `${ch} ${f2(w)}`).join(', ')}${m.rNotch ? `; R notch at the bowl ${f2(m.rNotch)}` : ''}`);
  for (const [ch, list] of Object.entries(m.named)) console.log(`    ${ch}: ${list.map((o) => `${o.name} ${o.values.map((x) => (x === null ? '-' : f2(x))).join(' / ')}`).join('; ')}`);
  console.log(`  crotches: ${m.crotches.map((q) => `${q.ch} ${f1(q.angle)} deg x${q.count}`).join(', ') || 'none'}`);
  console.log(`  letter gaps: ${m.pairs.slice(0, 4).map((p) => `${pairName(p.p)} ${f2(p.w)}`).join(', ')}${m.spaces.length ? `; word spaces ${m.spaces.map((s) => `${pairName(s.p)} ${f2(s.w)} (channel ${f2(s.channel)})`).join(', ')}` : ''}${m.lineGap !== null ? `; line gap ${f2(m.lineGap)}` : ''}`);
  console.log(`  full stop ${f2(m.dot.w)} mm, ${f2(m.dot.ink)} mm from ${nm(m.dot.after)}${m.apos ? `; apostrophe ${f2(m.apos.w)} x ${f2(m.apos.h)}, tail ${f2(m.apos.stroke)}, gaps ${m.apos.gaps.map((q) => `${q.ch} ${f2(q.w)}`).join(' / ')}` : ''}`);
  console.log(`  edits: B neck fill ${f2(edits.B.neckFill)} mm; S faces +${f2(edits.S.upperMM)} / -${f2(edits.S.lowerMM)} mm, inside ${f2(edits.S.epsMM)} mm; G face +${f2(edits.G.mm)} mm${edits.apos ? `; apostrophe end +${f2(edits.apos.mm)} mm a side` : ''}; PO trims C ${f2(edits.po.cMM)} E ${f2(edits.po.eMM)}`);
  console.log(`  6-panel channels: ${m.channels.map((q) => `${f2(q.width)} at ${f2(q.shift)} (${q.where.join(' / ')})`).join('; ')}`);
  if (seam) console.log(`  seam: ${seam.none ? 'none' : `move ${f2(seam.shiftDesign)} mm (+ = viewer's right); gap ${f2(seam.width)} between ${seam.between.join(' and ')}; ink centre ${f2(seam.inkFromSeam)} mm from the seam`}`);
  console.log(`  checks: ${c.pass ? 'all pass' : 'FAILED: ' + c.items.filter((q) => !q.pass).map((q) => `${q.check} ${q.value}`).join('; ')}`);
}

// ---------------------------------------------------------------- notes.md
// Font numbers used only for words in the notes (font units, y up).
const FONT_NOTES = { mCrotchY: 566, aCounter: [244, 282], rLeg: [[587, 0], [325, 351]], aposHead: 227 };
// What faces a gap, for where a seam lands.
const SIDE = {
  right: { E: 'the ends of the E’s arms', R: 'the foot of the R’s leg', D: 'the D’s bowl', K: 'the ends of the K’s arm and leg', A: 'the foot of the A’s leg', N: 'the N’s right stem', B: 'the B’s bowls', T: 'the end of the T’s bar', I: 'the I', M: 'the M’s right stem', P: 'the P’s bowl', W: 'the W', H: 'the H’s right stem', O: 'the O', '.': 'the full stop' },
  left: { D: 'the D’s stem', K: 'the K’s stem', E: 'the E’s stem', T: 'the end of the T’s bar', A: 'the foot of the A’s leg', N: 'the N’s left stem', I: 'the I', M: 'the M’s left stem', R: 'the R’s stem', B: 'the B’s stem', P: 'the P’s stem', H: 'the H’s left stem', O: 'the O', W: 'the W', '.': 'the full stop' },
};
const list = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
const deg = (v) => `${f1(v)}-degree`;
const word = (v) => ['no', 'one', 'two', 'three', 'four', 'five', 'six'][v] || String(v);
const cm2 = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');   // 4500 -> 4,500
// A letter as the font draws it at this cap (with only the logo's own S trims, none from cap 10.6), measured, for the
// notes' before-and-after numbers.
function plain(ch, cap) {
  const e = { ...letterEdits(cap).edits, [ch]: {} };
  return measure({ cap, lines: [setText(`${ch}.`, 0, 0, cap, e)] });
}
// Every kerned pair in a design, with where its kerning comes from.
function kernNote(d) {
  const out = [], kern = kernFor(d);
  for (const s of d.lines) for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i], pair = a + b, label = `${a === ' ' ? 'space' : a}-${b === ' ' ? 'space' : b}`;
    const po = PO.KERN[pair], font = fontKern(a, b), set = EXTRA_KERN[pair] || 0, own = (d.kern && d.kern[pair]) || 0;
    if ((po === undefined && !font && !set && !own) || out.some((p) => p.label === label)) continue;
    const sgn = (v) => `${v > 0 ? '+' : ''}${v.toFixed(3)}`, parts = [];
    if (po !== undefined && own && Math.abs(po + own) < 1e-9) parts.push(`Punched Out.’s ${po} left out, to widen the 6-panel seam’s gap`);
    else {
      if (po !== undefined) parts.push(font ? 'the font’s own, as Punched Out.' : 'Punched Out.’s');
      else if (font) parts.push(set || own ? `the font’s own ${font} units` : `the font’s own: ${font} units`);
      if (set) parts.push(parts.length ? `this set’s ${sgn(set)}` : 'this set’s');
      if (own) parts.push(parts.length ? `${sgn(own)} to widen the 6-panel seam’s gap` : 'opened to widen the 6-panel seam’s gap');
    }
    out.push({ label, text: `${label} ${sgn(kern(a, b))} (${parts.join(' and ')})` });
  }
  return out;
}
const CROTCH_WHERE = { N: 'where the diagonal meets each stem', K: 'between the stem and the arm', A: 'at the top of its counter' };
const crotchWhere = (q) => (q.ch === 'W' ? (q.count > 1 ? 'at the foot of the two notches that open from the top' : 'under the middle peak') : CROTCH_WHERE[q.ch] || '');

function notes(ctx) {
  const { d, cap, m, seam, checks: c, edits, lines } = ctx;
  const big = d.area === 'big', k = cap / UPC, has = (ch) => d.text.includes(ch), sz = `${f2(m.w)} x ${f2(m.h)} mm`;
  const [W, H] = AREAS[d.area];
  const stack = lines.length === 2;
  const cx = m.cx, centreX = seam && !seam.none ? seam.mid : cx;      // the file's centre: where it is centred
  const order = orderText(stitchOrder(lines, centreX, d.lines));
  const crotchOf = (ch) => m.crotches.filter((q) => q.ch === ch);
  const fill = (q) => `${f1(q.fill[0])}-${f1(q.fill[1])} mm`;
  const each = (q) => q.count / [...d.text].filter((ch) => ch === q.ch).length;      // per letter
  const crotchName = (q) => `${q.ch} ${f1(q.angle)} deg${each(q) > 1 ? ` (${word(each(q))} in ${[...d.text].filter((ch) => ch === q.ch).length > 1 ? 'each' : 'the'} ${q.ch})` : ''}`;
  const padded = m.fileW - m.w > 0.005;
  const narrow = [];                          // narrow openings, for the compensation note: [name, mm]
  if (m.named.E) narrow.push(['the E’s slots', Math.min(...m.named.E[0].values)]);
  if (m.named.C) narrow.push(['the C’s mouth', m.named.C[0].values[0]]);
  if (m.named.G) narrow.push(['the G’s mouth', m.named.G[0].values[0]]);
  if (m.named.B) narrow.push(['the B’s upper counter', Math.min(...m.named.B[0].values)]);
  if (m.named.S) narrow.push(['the S’s apertures', Math.min(...m.named.S[0].values)], ['the S’s counters', Math.min(...m.named.S[1].values)]);
  const tight = narrow.filter(([, w]) => w < 1.7);
  const plural = tight.length > 1 || (tight.length === 1 && /s$/.test(tight[0][0]));
  const kernPairs = kernNote(d), kernText = kernPairs.length ? list(kernPairs.map((p) => p.text)) : 'none';
  const widestNear = m.channels.filter((q) => Math.abs(q.shift) <= SEAM_MAX_SHIFT).sort((p, q) => q.width - p.width)[0];
  const crossAtCentre = lines.map((line) => {                       // per line: the letter at the centre, or the gap
    const g = line.find((q) => cx > q.box.x0 && cx < q.box.x1);
    if (g) return `down the ${g.ch === '’' ? 'apostrophe' : g.ch}`;
    const a = [...line].reverse().find((q) => q.box.x1 <= cx), z = line.find((q) => q.box.x0 >= cx);
    return a && z ? (a.ch === z.ch ? `between the two ${a.ch}’s` : `between the ${a.ch} and the ${z.ch}`) : 'past the letters';
  });
  const sideR = (ch) => SIDE.right[ch] || `the ${ch}`, sideL = (ch) => SIDE.left[ch] || `the ${ch}`;
  const capAt = (w) => (cap * w) / m.w;

  // ---- placement
  let placeRow, placeNotes = [];
  if (d.area === 'chest') {
    placeRow = `| ${d.where.replace(/, S to 3XL$/, '')} | Centred in Printful’s 4 x 4 in (101.6 mm) left-chest square: ${f1(spare(m, 'chest'))} mm spare each side, ${f1((H - m.h) / 2)} mm above and below |`;
    placeNotes.push(`- The block is the logo’s height (18.0 mm) and close to its width (62.6 mm), as Punched Out.’s chest stack (63.59 x 18.00 mm).`);
  } else if (d.area === 'big') {
    placeRow = `| ${d.where.replace(/, S to 3XL$/, '')} | Centred on Printful’s large front: ${f1(spare(m, 'big'))} mm spare each side of the store’s 230 mm box (Printful’s large-front limit is 10 x 6 in, 254 x 152 mm) |`;
    placeNotes.push(`- The owner’s call for the tops (store/picks.md): big on the centre front, as Punched Out. goes there.`);
    if (m.w * 15 / cap > BIG.w + 0.01) placeNotes.push(`- At 230 mm this line gets cap ${f1(cap)}, not 15-16.5: it is ${d.text.length} characters long. At cap 15 it would be ${f1((m.w * 15) / cap)} mm wide, past the box (it would still fit Printful’s 254 mm, at cap ${f1(Math.min(capAt(254), 16.5))} at most).`);
  } else if (!seam) {
    placeRow = `| ${d.where} | Centred: ${f1(spare(m, 'hat'))} mm spare each side of the ${W} mm front area, ${f1((H - m.h) / 2)} mm above and below its ${H} mm |`;
    if (padded) placeNotes.push(`- Centre the file. It is ${f2(m.fileW)} mm wide: ${f2(m.fileW - m.w)} mm of it is empty margin on the left, the width the full stop hangs past ${d.lines[d.lines.length - 1].replace(/\.$/, '')}, so the file’s centre is the letters’ centre. Centring the ink instead would put the letters ${f2((m.fileW - m.w) / 2)} mm to the wearer’s right of centre.`);
    placeNotes.push(`- Both are seamless fronts, so no shift. Not for a 6-panel cap as drawn: ${widestNear ? `the widest gap clear of ${stack ? 'both lines' : 'the letters'} within ${SEAM_MAX_SHIFT} mm of centre is ${f2(widestNear.width)} mm, too narrow to aim a seam at` : `no gap runs clear through ${stack ? 'both lines' : 'the letters'} within ${SEAM_MAX_SHIFT} mm of centre`}, and centred, the seam would run ${list(crossAtCentre)}.`);
  } else {
    const dir = seam.shiftDesign > 0 ? 'wearer’s left (the viewer’s right)' : 'wearer’s right (the viewer’s left)';
    // the seam's gap, height by height (it is narrowest where the letters' boxes are)
    const [ga, gz] = (() => { const line = lines.find((l) => l.some((g) => g.ch === seam.between[0])); for (let i = 0; i + 1 < line.length; i++) if (line[i].ch === seam.between[0] && line[i + 1].ch === seam.between[1] && line[i].box.x1 <= seam.mid && line[i + 1].box.x0 >= seam.mid) return [line[i], line[i + 1]]; return [null, null]; })();
    const gapAt = (f) => { const y = ga.base - f * cap, ra = cross(ga, { y }), rz = cross(gz, { y }); return ra.length && rz.length ? rz[0] - ra[ra.length - 1] : null; };
    let profile = [];
    if (ga) {
      // the baseline, 1 mm up, the narrowest point higher up, and the cap line (heights as fractions of the cap)
      const hs = []; for (let f = 1.5 / cap; f <= 1 - 0.5 / cap; f += 0.05 / cap) hs.push(f);
      const low = hs.reduce((b, f) => (gapAt(f) !== null && (b === null || gapAt(f) < gapAt(b)) ? f : b), null);
      profile = [[0.05 / cap, 'at the baseline'], [1 / cap, '1 mm up'], ...(low !== null ? [[low, `${f1(low * cap)} mm up`]] : []), [1 - 0.05 / cap, 'at the cap line']]
        .map(([f, w]) => [gapAt(f), w]).filter(([v]) => v !== null);
      // the narrowest point higher up, only where it says something the others don't
      if (low !== null) { const i = profile.findIndex(([, w]) => w.endsWith('mm up') && w !== '1 mm up'); if (i > 0 && profile.some(([v], j) => j !== i && Math.abs(v - profile[i][0]) < 0.02)) profile.splice(i, 1); }
    }
    placeRow = `| ${d.where} | **${f2(Math.abs(seam.shiftDesign))} mm to the ${dir}** of centre, so the seam runs down the middle of the ${f2(seam.width)} mm gap between the ${seam.between[0]} and the ${seam.between[1]}, ${f2(seam.width / 2)} mm from ${sideR(seam.between[0])} and from ${sideL(seam.between[1])}${profile.length ? ` (the gap is ${list(profile.map(([v, w]) => `${f2(v)} mm ${w}`))})` : ''}. The ink’s centre then lands ${f2(Math.abs(seam.inkFromSeam))} mm from the seam, and ${f1(spare(m, 'hat', seam.shiftDesign))} mm is still spare on that side of the ${W} mm front |`;
    const others = m.channels.filter((q) => Math.abs(q.shift) <= SEAM_MAX_SHIFT && Math.abs(q.mid - seam.mid) > 1e-6).map((q) => `${f2(q.width)} mm between the ${q.where[0].split('|')[0]} and the ${q.where[0].split('|')[1]} (${f2(-q.shift)} mm)`);
    placeNotes.push(`- ${seam.usesWordSpace ? 'The seam sits in the word space.' : `Gaps clear of the letters within ${SEAM_MAX_SHIFT} mm of centre (the limit Punched Out. uses: the logo moves 5.2 mm, and much more looks off-centre): this one${others.length ? `, and ${list(others)}` : ' only'}.`}`);
    const opened = Object.entries(d.kern || {}).find(([pr]) => pr === seam.between.join(''));
    if (opened) placeNotes.push(`- The ${seam.between.join('-')} pair is spaced ${f2(opened[1] * cap)} mm (${opened[1]} cap) wider than the rest of the set would space it${PO.KERN[opened[0]] !== undefined ? ' (Punched Out.’s kern for it left out)' : ''}, so the seam’s gap is ${f2(seam.width)} mm.`);
    if (seam.wordSpace) placeNotes.push(`- Not the word space, though it is the widest gap (a ${f2(seam.wordSpace.width)} mm clear channel between the ${seam.wordSpace.between[0]} and the ${seam.wordSpace.between[1]}): putting the seam there means moving the line ${f1(Math.abs(seam.wordSpace.shiftDesign))} mm the other way, to the ${seam.wordSpace.shiftDesign > 0 ? 'wearer’s left' : 'wearer’s right'}, and the ink’s centre would sit ${f1(Math.abs(seam.wordSpace.inkFromSeam))} mm off the seam: visibly off-centre, with ${f1(spare(m, 'hat', seam.wordSpace.shiftDesign))} mm spare on one side of the ${W} mm front and ${f1(W - m.fileW - spare(m, 'hat', seam.wordSpace.shiftDesign))} mm on the other. If the owner prefers the word break on the seam anyway, shift ${f2(seam.wordSpace.shiftDesign)} mm instead: \`seam-proof-word-space.png\` shows it.`);
    placeNotes.push(`- Centred instead, the seam would run ${list(crossAtCentre)}. \`seam-proof.png\` shows the shift on a ${W} x ${H} mm front at true size.`);
    placeNotes.push(`- Set the shift when placing the design: Printful’s guide describes designs on 6-panel caps as centred across the two front panels, so whether it keeps an offset is unconfirmed (store/research/caps-and-hoodie.md); check the first sample. The logo (5.2 mm right) and Punched Out. (2.4 mm right) shift the same way.`);
  }

  // ---- construction rows
  const rows = [
    ['Size', `${sz}${padded ? ` of ink; the file is ${f2(m.fileW)} x ${f2(m.fileH)} mm, with ${f2(m.fileW - m.w)} mm of empty margin on the left so its centre is the letters’ centre (see “Where it goes”)` : ''}`],
    ['Cap height', `${f2(cap)} mm`],
    [`Stems (${m.stems.letters.join(' ')})`, `${f2(m.stems.min)}-${f2(m.stems.max)} mm`],
    ['Thinnest stroke', `${f2(m.thinnestAll[1].w)} mm, in the ${m.thinnestAll[0]}`],
    ['Thinnest stroke in each letter', Object.entries(m.thinnest).map(([ch, s]) => `${ch} ${f2(s.w)}`).join(', ')],
    ['Narrowest opening in each letter that has one', `${Object.entries(m.openings).map(([ch, w]) => `${ch} ${f2(w)}`).join(', ')} (crotch tips aside)`],
  ];
  if (m.named.E) rows.push(['E slots', `${m.named.E[0].values.map(f2).join(' / ')} mm`]);
  if (m.named.C) rows.push(['C mouth', `${f2(m.named.C[0].values[0])} mm`]);
  if (m.named.G) rows.push(['G mouth', `${f2(m.named.G[0].values[0])} mm`]);
  if (m.named.B) rows.push(['B counters (upper / lower)', `${m.named.B[0].values.map(f2).join(' / ')} mm`]);
  if (m.named.S) rows.push(['S apertures (upper / lower)', `${m.named.S[0].values.map(f2).join(' / ')} mm`], ['S counters, where they narrow (upper / lower)', `${m.named.S[1].values.map(f2).join(' / ')} mm`], ['S strokes', `top and bottom arcs ${m.sStrokes.arcs.map(f2).join(' / ')} mm, spine ${f2(m.sStrokes.spine)} mm (${f2(m.sStrokes.spineMin)}-${f2(m.sStrokes.spineMax)} along it)`]);
  if (m.named.A) rows.push(['A counter', `a triangle ${f2(FONT_NOTES.aCounter[0] * k)} mm wide and ${f2(FONT_NOTES.aCounter[1] * k)} mm tall; a ${f2(m.named.A[0].values[0])} mm circle fits inside it`]);
  if (m.rNotch) rows.push(['R, under the bowl', `the notch between the stem and the leg is ${f2(m.rNotch)} mm wide where it meets the bowl, opening out below (a ${deg(rAngle())} crotch with its point cut off)`]);
  rows.push(['Crotches (sharp inside corners)', m.crotches.length ? m.crotches.map(crotchName).join(', ') : 'none']);
  rows.push(['Tightest letter gaps', m.pairs.slice(0, 3).map((p) => `${pairName(p.p)} ${f2(p.w)}`).join(', ') + ' mm']);
  if (m.spaces.length) rows.push([m.spaces.length > 1 ? 'Word spaces' : 'Word space', m.spaces.map((s) => `${pairName(s.p)} ${f2(s.w)} mm at the closest, a ${f2(s.channel)} mm clear channel from top to bottom`).join('; ')]);
  if (m.lineGap !== null) rows.push(['Line gap', `${f2(m.lineGap)} mm`]);
  rows.push(['Full stop', `${f2(m.dot.w)} mm round, ${f2(m.dot.ink)} mm from ${nm(m.dot.after)}`]);
  if (m.apos) rows.push(['Apostrophe', `${f2(m.apos.w)} x ${f2(m.apos.h)} mm, its tail ${f2(m.apos.stroke)} mm at its narrowest; ${m.apos.gaps.map((q) => `${f2(q.w)} mm to the ${q.ch}`).join(', ')}`]);
  rows.push(['Ink', `${f1(m.ink.area)} mm²`]);

  // ---- changes from the font, for the letters in this design
  const changes = [];
  if (has('E')) changes.push(`- **E, straight stem** (Punched Out.’s): the F’s and H’s stem with the E’s own arms and bar, so its stem matches the other letters’. Unbounded bends it; Punched Out.’s cold readers all flagged the bent one. ${edits.po.e ? `Slots: the top arm’s underside raised and the bottom arm’s top lowered ${f2(edits.po.eMM)} mm, so each slot is ${f2(m.named.E[0].values[0])} mm (Punched Out.’s cap-7 trim).` : `No slot trim at this size: the slots are ${f2(m.named.E[0].values[0])} mm as the font draws them.`}`);
  if (has('B')) changes.push(`- **B, straight stem**, for the same reason: Unbounded bends the B’s stem as it does the E’s (left edge 47 -> 105 -> 47 font units). Rebuilt with the F/H stem (x 70-277) and the counters’ left edges straight. ${edits.B.neckFill ? `The notch between the bowls is filled ${f2(edits.B.neckFill)} mm at its tip, so the lower bowl’s neck beside it is as thick as the B’s middle bar (1.21 mm as the font draws it, under the 1.27 mm floor).` : ''}`);
  if (has('C')) changes.push(`- C: ${edits.po.c ? `mouth trimmed ${f2(edits.po.cMM)} mm per face (Punched Out.’s), so it is ${f2(m.named.C[0].values[0])} mm.` : `no trim at this size: the mouth is ${f2(m.named.C[0].values[0])} mm as the font draws it.`}`);
  if (has('S')) {
    const ps = plain('S', cap), ap = m.named.S[0].values, ct = m.named.S[1].values, st = m.sStrokes, pst = ps.sStrokes, pap = ps.named.S[0].values;
    // where its thinnest stroke is: a terminal's end (where the flat cut meets the outer curve), or elsewhere
    const Sg = lines.flat().find((g) => g.ch === 'S'), ta = m.thinnest.S.at, up = ta[1] < Sg.base - 0.5 * cap, right = ta[0] > Sg.ox + FONT_S.axis * k;
    const thinAt = up && right ? 'at the upper terminal’s end, where the flat cut meets the outer curve' : !up && !right ? 'at the lower terminal’s end, where the flat cut meets the outer curve' : 'in its curves';
    changes.push(edits.S.eps
      ? `- **S, this set’s S.** Its terminals are cut flat ${f2(edits.S.upperMM)} mm (upper) and ${f2(edits.S.lowerMM)} mm (lower) higher than the font’s, the same cut at every size (faces at ${S_OPEN.upperFace} and ${S_OPEN.lowerFace} font units; the logo’s at cap 7 is 0.36 / 0.41 mm). At this size its inside edges also move back ${f2(edits.S.epsMM)} mm, less near the outline so the silhouette and the shoulders beside the apertures stay where they were: the counters’ arcs and rounded ends take the full move, and the spine’s two edges take it by a straight ramp, each from none at one end of the spine to the full move at the end that faces an aperture, so the spine stays straight and even. Apertures ${ap.map(f2).join(' / ')} mm and counters at least ${f2(Math.min(...ct))} mm where they narrow (the logo’s S: ${pap.map(f2).join(' / ')} and ${f2(Math.min(...ps.named.S[1].values))} mm). Arcs ${st.arcs.map(f2).join(' / ')} mm and spine ${f2(st.spine)} mm, against the font’s ${pst.arcs.map(f2).join(' / ')} and ${f2(pst.spine)}: the spine stays thicker than the arcs, as in the font. Its thinnest stroke, ${f2(m.thinnest.S.w)} mm, is ${thinAt}. (Moving every inside edge by the full move thins the spine from both sides, under the arcs; moving only the arcs leaves the apertures under 1.27 mm; cutting the terminals higher instead thins their tips under 1.27 mm.) The logo’s S is unchanged.`
      : `- **S, this set’s S**: its terminals cut flat ${f2(edits.S.upperMM)} mm (upper) and ${f2(edits.S.lowerMM)} mm (lower) higher than the font’s, the same cut as on the hats (faces at ${S_OPEN.upperFace} and ${S_OPEN.lowerFace} font units), so its apertures are ${ap.map(f2).join(' / ')} mm. As the font draws it they’d be ${pap.map(f2).join(' / ')} mm here (${f2(Math.min(...pap) / cap)} cap${m.named.E ? `, against the E’s ${f2(Math.min(...m.named.E[0].values) / cap)} cap slots` : ''}), about ${f2(Math.min(...pap) - 0.36)} mm after standard compensation, and the S would look closed beside the other letters. No other change at this size (the inside move of the hats’ S is none from cap ${S_OPEN.capNone}): counters at least ${f2(Math.min(...ct))} mm where they narrow, arcs ${st.arcs.map(f2).join(' / ')} mm, spine ${f2(st.spine)} mm; its thinnest stroke, ${f2(m.thinnest.S.w)} mm, is ${thinAt}.`);
  }
  if (has('’')) {
    const pa = plain('’', cap);
    changes.push(`- **’, the tail widened with straight sides.** The font’s curly apostrophe tapers to ${f2(pa.thinnest['’'].w)} mm at this size, a thin stroke. Its flat end is ${f2(edits.apos.mm)} mm wider each side, its left side parallel to the font’s and its right side the tangent from the end to the head, so the head (the font’s, ${f2(FONT_NOTES.aposHead * k)} mm across) is unchanged and the tail is at least ${f2(m.apos.stroke)} mm wide. The apostrophe is ${f2(m.apos.w)} x ${f2(m.apos.h)} mm.`);
  }
  if (has('G')) {
    const pg = plain('G', cap);
    changes.push(`- **G, its mouth opened to the C’s.** Its upper terminal’s underside is cut flat ${f2(edits.G.mm)} mm higher (font units ${FONT_G.face} to ${f1(edits.G.face)}), so the mouth between it and the bar is ${f2(m.named.G[0].values[0])} mm${m.named.C ? `, as the C’s (${f2(m.named.C[0].values[0])} mm)` : ''}. As the font draws it, the mouth is a ${f2(pg.named.G[0].values[0])} mm parallel slit, which standard compensation would take to about ${f2(pg.named.G[0].values[0] - 0.36)} mm and fleece could close, while the C stayed open.`);
  }
  changes.push(`- Kerning on top of the font’s spacing (in cap heights): ${kernText}. kit.text drops the font’s own kerning (opentype.js 1.3.4 can’t read its extension lookups), so the build reads it from the font’s GPOS table; Punched Out.’s pairs are its own; this set’s own pairs are judged on the true-size proofs and on the white between each pair, and \`build.cjs\` gives the reason for each (\`EXTRA_KERN\`). Nothing else is kerned.`);

  // ---- digitizer notes
  const dz = [];
  const keep = [has('S') && 'the S’s shorter terminals', has('G') && 'the G’s opened mouth'].filter(Boolean), many = keep.length > 1 || has('S');
  dz.push(`- Digitize each size on its own and never scale a stitch file.${big ? ` This is its own drawing at cap ${f1(cap)}, not a cap-7 file scaled up (the cap-7 trims shrink with size and are none here${keep.length ? `; ${list(keep)} ${many ? 'are' : 'is'} part of the letters’ drawing and ${many ? 'stay' : 'stays'}` : ''}).` : ''}`);
  dz.push(`- Satin throughout, ${f2(m.stems.min)}-${f2(m.stems.max)} mm stems. One colour change: the letters${m.apos ? ' (the apostrophe with them)' : ''}, then the full stop.`);
  dz.push(`- Stitch order, centre out${seam && !seam.none ? ' from the seam' : ''}${stack ? ' (bottom line first, as caps sew centre out and bottom up)' : ''}, then the colour change and the full stop: ${order}.`);
  dz.push(tight.length
    ? `- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Only 0.05 mm per edge on the faces of ${list(tight.map(([nm2]) => nm2))}, so ${plural ? 'they finish' : 'it finishes'} at about ${list(tight.map(([nm2, w]) => `${f2(w - 0.1)}`))} mm (with full compensation ${plural ? 'they’d' : 'it’d'} close to about ${list(tight.map(([, w]) => f2(w - 0.36)))} mm).`
    : `- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (the stems), as for the logo. Standard compensation everywhere: the narrowest opening is ${f2(m.smallest[1])} mm (the ${m.smallest[0]}).`);
  if (has('E') && edits.po.e) dz.push(`- E: the artwork already includes the slot trims.`);
  if (has('B')) dz.push(`- B: the stem is straight (as the E’s); sew it as one column. ${edits.B.neckFill ? `The notch between the bowls is blunted in the artwork; keep it that way rather than re-pointing it, so the lower bowl’s neck keeps its ${f2(m.thinnest.B.w)} mm.` : ''}`);
  if (has('S')) dz.push(`- S: the artwork already includes the shorter terminals${edits.S.eps ? ' and the moved-back inside edges' : ''}. Pull both terminal ends back 0.2 mm with no end compensation, as for the logo’s S.`);
  if (has('’')) dz.push(`- ’: one satin shape in the letter thread, sewn with the letters; 0.10 mm compensation, as for the full stop. It sits ${list(m.apos.gaps.map((q) => `${f2(q.w)} mm from the ${q.ch}`))}.`);
  const wedges = ['N', 'W', 'K', 'M'].filter((ch) => crotchOf(ch).length);
  const wedgeText = (ch) => {
    if (ch === 'M') return crotchOf('M').map((q) => (q.angle < 30 ? `the M’s ${each(q) > 1 ? `${word(each(q))} ` : ''}${f1(q.angle)}-degree crotches between its stems and diagonals (${f2(FONT_NOTES.mCrotchY * k)} mm tall; thread fills about ${fill(q)} of each)` : `its ${f1(q.angle)}-degree crotch at the top of its V (about ${fill(q)})`)).join(' and ');
    return crotchOf(ch).map((q) => `the ${ch}’s ${each(q) > 1 ? `${word(each(q))} ` : ''}${f1(q.angle)}-degree crotch${each(q) > 1 ? 'es' : ''}${crotchWhere(q) ? `, ${crotchWhere(q)}` : ''} (thread fills about ${fill(q)} of ${each(q) > 1 ? 'each' : 'it'})`).join(' and ');
  };
  if (wedges.length) dz.push(`- Crotches: ${list(wedges.map(wedgeText))}. Stop the diagonals 0.3 mm short of the crotch points, with no compensation on the crotch faces.`);
  if (crotchOf('M').some((q) => q.angle < 30)) dz.push(`- M: its inner crotches are the sharpest in this set. Approve only if the sew-out shows both lower counters open over at least half their height (${f2((FONT_NOTES.mCrotchY * k) / 2)} mm). If they close further, open the crotches in the artwork (in \`build.cjs\`) rather than counting on the note above: Printful digitizes the file itself, so a digitizing note may not reach its digitizer.`);
  if (has('A')) { const q = crotchOf('A')[0]; dz.push(`- A: its counter is a triangle (${f2(FONT_NOTES.aCounter[0] * k)} x ${f2(FONT_NOTES.aCounter[1] * k)} mm; a ${f2(m.named.A[0].values[0])} mm circle fits) whose top is a ${q ? f1(q.angle) : '46.8'}-degree point; thread fills about ${q ? fill(q) : ''} of it. Keep compensation off the counter’s faces.`); }
  if (m.rNotch) dz.push(`- R: the notch between its stem and leg is ${f2(m.rNotch)} mm wide where it meets the bowl and opens out below; 0.05 mm compensation on its faces, so only its top fills.`);
  if (has('G')) { const g = crotchOf('G').sort((p, q) => q.angle - p.angle); dz.push(`- G: its mouth is ${f2(m.named.G[0].values[0])} mm, opened in the artwork, so standard compensation suits it. The pocket under its bar narrows to a ${g[0] ? f1(g[0].angle) : ''}-degree point and the slit between the bowl and the spur at the bottom right to a ${g[1] ? f1(g[1].angle) : ''}-degree one: stop the bar’s underside 0.3 mm short of the bowl at the pocket’s point, no compensation on either point’s faces.`); }
  const tBars = m.pairs.filter((p) => p.p.includes('T') && p.w < 1.8);
  if (tBars.length) dz.push(`- T: its bar’s end faces ${list(tBars.map((p) => `the ${p.p[0] === 'T' ? p.p[1] : p.p[0]} (${f2(p.w)} mm)`))}, as the logo’s F-T faces 1.47 mm. Pull that end back 0.15 mm with no end compensation.`);
  dz.push(`- Full stop: ${big ? `${f2(m.dot.w)} mm across: satin, or a fill if it looks loose; ` : 'satin dot with 0.10 mm compensation, '}straight after the colour change. It has ${f2(m.dot.ink)} mm of fabric to ${nm(m.dot.after)}.`);
  if (d.fleece) dz.push(`- Fleece: water-soluble topping, so the loft doesn’t swallow the openings and the crotches.`);
  if (seam && !seam.none) dz.push(`- 6-panel caps: ${f2(seam.shiftDesign)} mm (to the ${seam.shiftDesign > 0 ? 'wearer’s left' : 'wearer’s right'}); see “Where it goes”.`);
  else if (d.area === 'hat') dz.push(`- Seamless fronts: centred.`);
  if (big) {
    const in2 = m.ink.area / 645.16, lo = Math.round((in2 * 1200) / 500) * 500, hi = Math.round((in2 * 2400) / 500) * 500;
    dz.push(`- Big front: stems ${f2(m.stems.min)}-${f2(m.stems.max)} mm, under the 4.4 mm columns the logo sews in plain satin (its 45 mm symbol), so plain satin should hold; split the stems if the sew-out shows long, loose stitches. A rough stitch count from the ink area (${f1(m.ink.area)} mm², ${f2(in2)} sq in at 1,200-2,400 stitches per square inch of satin): about ${cm2(lo)}-${cm2(hi)}, under the 15,000 at which Printful’s large-embroidery stitch charge starts (store/research/caps-and-hoodie.md).`);
  }
  const approve = [];
  if (has('E')) approve.push('both E slots at least 1.0 mm open');
  if (has('B')) approve.push('both B counters open');
  if (has('S')) approve.push('both S apertures at least 1.0 mm open and its counters open');
  if (wedges.length) approve.push(wedges.length === 1 && crotchOf(wedges[0]).reduce((a, q) => a + q.count, 0) === 1 ? `the ${wedges[0]}’s crotch open` : `the crotches of the ${list(wedges)} open`);
  if (has('A')) approve.push('the A’s counter open as a triangle');
  if (has('C')) approve.push('the C’s mouth open');
  if (has('G')) approve.push('the G’s mouth open');
  if (has('’')) approve.push('the apostrophe’s tail clear, so it reads as an apostrophe, not a dot');
  dz.push(`- Approve only after a sew-out on the actual blank shows ${list(approve)}.`);

  const checkRows = c.items.map((q) => `| ${q.check}${q.note ? ` (${q.note})` : ''} | ${f2(q.value)} ${q.unit} | ${q.limit} | ${q.pass ? 'pass' : '**fail**'} |`);
  const files = [
    `| \`design-light.svg\`, \`design-dark.svg\` | ${d.text} ${stack ? `as ${d.lines[0]} over ${d.lines[1]}, centred` : big ? 'on one line, drawn for the big centre front' : 'on one line'}, ${sz}${padded ? ` (the file ${f2(m.fileW)} mm wide, centred on the letters)` : ''} |`,
    `| \`proof-light.png\`, \`proof-dark.png\` | True-size proofs: the light file on Bone, the dark file on Slate |`,
    ...(seam && !seam.none ? [`| \`seam-proof.png\` | The light file on a ${W} x ${H} mm 6-panel front, moved for the centre seam, at true size |`] : []),
    ...(seam && seam.wordSpace ? [`| \`seam-proof-word-space.png\` | The same front with the seam in the word space instead (not used; for the owner to compare) |`] : []),
  ];

  return `# ${d.text} (${d.listing})

${d.text} in the logo’s type: Unbounded Bold, all caps, letter-spacing 0.12 em, ${big ? `drawn for the big centre front at cap ${f1(cap)} mm, so the line is ${f2(m.w)} mm wide: the largest cap (in 0.1 mm steps) that fits the 230 mm box the store uses for the tops’ big front, as Punched Out.’s one-line-large (229.75 mm at cap 16.5)` : 'at the logo’s cap height of 7 mm, so its strokes are the logo’s strokes'}. ${stack ? `Stacked ${d.lines[0]} over ${d.lines[1]}, both lines centred on their letters, with the full stop hanging past the line, at Punched Out.’s line gap, so the block is the logo’s 18 mm tall.` : 'On one line.'} The only accent is the full stop, in the logo’s accent thread: Rust on light fabric, Sun on dark, as on Punched Out. For the ${d.listing} (${d.price}): ${d.where}.

**This file is written by \`designs/phrases/build.cjs\`** (one build for all six phrase designs). Every number below is measured from the generated artwork. Change the build and rebuild (\`cd tools && node ../designs/phrases/build.cjs\`); don’t edit this file by hand.

## Files

| File | What it is |
|---|---|
${files.join('\n')}

Light files: Ink #1F2733 letters, Rust #B4552D full stop. Dark files: Bone #ECE5D3 letters, Sun #D29B3C full stop. Each file has two paths, \`letters\` and \`full-stop\`.

## Where it goes

| Placement | Position |
|---|---|
${placeRow}

${placeNotes.join('\n')}

## Construction (measured)

| | |
|---|---|
${rows.map(([a, b]) => `| ${a} | ${b} |`).join('\n')}

All in mm at true size. The logo’s own strokes, for comparison: stem 1.93, arm 1.63, thinnest 1.43 (the ring’s top and bottom).${m.crotches.length ? ` Thread fills each crotch to about where it is 1.0-1.15 mm across (as for Punched Out.’s N: 1.6-1.8 mm): ${m.crotches.map((q) => `${q.ch} ${f1(q.angle)} deg ${fill(q)}`).join(', ')}.` : ''}

Changes from the font (each passed to the logo’s \`glyphMM\` as a per-letter table, so the logo itself is unchanged):

${changes.join('\n')}

## Checks

| Check | Measured | Floor | |
|---|---|---|---|
${checkRows.join('\n')}

Floors: cap 6.6 mm (any embroidered Unbounded Bold, the logo’s rule); every opening inside a letter and every stroke at least 1.27 mm as drawn (0.05 in: Printful’s minimum gap and line); the full stop${m.apos ? ' and the apostrophe' : ''} at least 1.5 mm across with 1.3 mm of fabric round the stop (the logo’s pivot-dot rule); letters at least 1.47 mm apart (the logo’s F-T)${seam ? `; a 6-panel seam’s gap at least ${MIN.seam} mm (about 0.95 mm of fabric each side of the seam’s line; Punched Out.’s is 2.43 mm, and its review called 1.58 mm too narrow)` : ''}. Crotches (where two strokes meet in a point, as the N’s) are listed above, not counted as openings, as for Punched Out.

## Colourways

| Fabric | Threads |
|---|---|
| Bone and other light colours | Ink letters, Rust stop (\`design-light.svg\`) |
| Slate, Spruce | Bone letters, Sun stop (\`design-dark.svg\`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink in one colour |
| Moss, Rust | Bone in one colour |

One colour is the same artwork with the full stop in the letter thread; nothing else changes. The hex values are targets: match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank. The fabric colours come later (the owner adds them).

## Notes for the digitizer

${dz.join('\n')}

## Review

- Not cold-read and not sewn out yet. ${(() => { const changed = [has('E') && 'Punched Out.’s straight E (not cold-read yet either)', has('B') && 'the straight-stem B', has('S') && 'this set’s S', has('G') && 'the G with its mouth opened', has('’') && 'the wider apostrophe'].filter(Boolean); return changed.length ? `Cold-read the proofs before ordering samples, for the letters changed from the font: ${list(changed)}.` : 'Its letters are the font’s own at this size.'; })()}${has('K') ? ` And for the K: it is Unbounded’s own drawing, which the brand has never shown. Its arm starts at the foot of its stem, so its lower left is a solid wedge: the same kind of quirk as the bent E that all four of Punched Out.’s cold readers flagged. If readers flag it, redraw it as the E was.` : ''}
- Trademark (a quick web screen, designs/phrases/notes.md, not a legal search): ${TRADEMARK[d.id]} Check USPTO and CIPO before ordering samples.
`;
}
function rAngle() { const [[x0, y0], [x1, y1]] = FONT_NOTES.rLeg; return (Math.atan2(x0 - x1, y1 - y0) * 180) / Math.PI; }
