// OFF SHFT logo: "The O". The O in OFF is a clock face; two hands at 5:00 (quitting time) stand out of it.
// Chosen by the owner. Refined through blind reading tests and two rounds of brand + embroidery review;
// every number below comes from those reviews. notes.md is written by this script, so it cannot go stale.
//
// Construction (everything derives from the cap height and Unbounded Bold's own strokes):
// - Wordmark: Unbounded Bold, letter-spacing 0.12 em. Kerning added on top of the font's own:
//   F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is merged into one outline (Unbounded's
//   F, H and T are overlapping pieces), and the S's terminals are trimmed so both apertures sew open.
// - The O is a ring 1.15 x the height of the font's own O, centred on it. Side walls 1.0 x the stem
//   (0.98 in one colour), top and bottom walls 0.9 x the stem, matching Unbounded's own O.
// - Hands: minute 1.0 stem wide, hour 1.02 stems, 90 degree points finished with a flat 0.3 x the hand width
//   (what actually stitches). Minute hand visible 0.936 cap, hour hand 0.667 cap, both measured from the
//   channel edge. Exactly 12 and 150 degrees.
// - Default ("outside"): hands stand outside the ring across an even channel (two colours max(1.0, 0.143 cap) mm;
//   one colour 1.2 mm, 1.5 mm from cap 7) with concave bases. HANDS=centre: hands run from the pivot over the ring.
// - Pivot dot in the hand colour: up to 0.286 cap, never closer than 1.3 mm to the counter (1.5 mm one colour);
//   dropped if under 1.5 mm. Floors: two-colour lockup cap 6.6, one-colour cap 7, symbol 19 mm (20.5 one colour).
// - Side-of-hat master: its own drawing (7.4 mm ring, 1.6 mm wall, 1.5 mm dot), plus a one-colour version.
//
// Run: node /home/user/offshft/designs/mark/final/the-o/build.cjs          (main set, writes notes.md)
//      HANDS=centre node .../build.cjs                                      (hands-from-centre preview set)
//      LOGO_FONT=archivo node .../build.cjs                                 (the earlier Archivo version)

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const ClipperLib = require('/home/user/offshft/tools/node_modules/clipper-lib');

const HANDS = process.env.HANDS === 'centre' ? 'centre' : 'outside';
const OUT = HANDS === 'centre' ? path.join(__dirname, 'hands-centre') : __dirname;
const T = kit.T, F = kit.F;
const O_SCALE = 1.15;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

// ---------------------------------------------------------------- fonts
const FONTS = {
  unbounded: {
    key: 'unbounded', name: 'Unbounded Bold', track: 0.12,
    kern: { FF: -0.043, 'F ': -0.05, FT: -0.025 },
    // S terminal trims (font units, y up): raise the upper terminal's underside, lower the lower terminal's top
    sTrim: { upperY: 519, upperX: 560, lowerY: 246, lowerX: 260 },
  },
  archivo: { key: 'xbold', name: 'Archivo Expanded Bold', track: 0.14, kern: { FF: -0.0286, FT: -0.0571 } },
  anybody: { key: 'anybody', name: 'Anybody Extra Wide ExtraBold', track: 0.06 },
  lexendexa: { key: 'lexendexa', name: 'Lexend Exa Bold', track: 0.02 },
  syne: { key: 'syne', name: 'Syne ExtraBold', track: 0.04 },
  saira: { key: 'saira', name: 'Saira Expanded Bold', track: 0.12 },
  krona: { key: 'krona', name: 'Krona One', track: 0.1 },
  michroma: { key: 'michroma', name: 'Michroma', track: 0.12 },
  rubikmono: { key: 'rubikmono', name: 'Rubik Mono One', track: 0.0 },
  encodex: { key: 'encodex', name: 'Encode Sans Expanded Bold', track: 0.14 },
  dela: { key: 'dela', name: 'Dela Gothic One', track: 0.06 },
};

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
function glyphMM(font, ch, x, baseY, cap) {
  const f = kit.font(font.key), upm = f.unitsPerEm;
  const k = cap / f.tables.os2.sCapHeight;                      // mm per font unit
  let paths = clip(ClipperLib.ClipType.ctUnion, toClip(contoursOf(f.charToGlyph(ch), upm)));
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

// ---------------------------------------------------------------- geometry
// Options: wallFactor = ring side wall as a multiple of the stem (default 1.0, 0.98 one colour);
//          ticks = 'four' (12, 3, 6, 9) or 'three' (3, 6, 9) inside the ring, in the ring colour.
function geometry(font, cap, { oneColour = false, channel, wallFactor, ticks } = {}) {
  const ref = kit.text('OFF SHFT', { font: font.key, cap, track: font.track, x: 0, y: 0 });
  const O = ref.letters[0];
  const { stem, arm } = strokes(font.key, cap);
  const R = ((O.bottom - O.top) / 2) * O_SCALE;
  const wallSide = stem * (wallFactor !== undefined ? wallFactor : oneColour ? 0.98 : 1.0);
  const wallTop = wallSide * 0.9;
  const g = channel !== undefined ? channel : oneColour ? (cap >= 7 ? 1.5 : 1.2) : Math.max(1.0, 0.143 * cap);
  const rx = R - wallSide, ry = R - wallTop;
  const fabricMin = oneColour ? 1.5 : 1.3;
  // inside ticks: 1.0 mm minimum length and width, and the fabric rule now applies between the tick ends and the dot
  const tickLen = ticks ? Math.max(1.0, 0.15 * cap) : 0, tickW = ticks ? Math.max(1.0, 0.5 * stem) : 0;
  let dot = Math.min(0.286 * cap, 2 * (Math.min(rx, ry) - tickLen - (ticks ? Math.max(1.0, fabricMin - 0.3) : fabricMin)));
  if (dot < 1.5) dot = 0;
  return {
    font, cap, ref, O, stem, arm, R, rx, ry, g, dot, oneColour, fabricMin, ticks, tickLen, tickW,
    sM: stem * 0.5, sH: stem * 0.51,
    Lm: R + g + 0.936 * cap, Lh: R + g + 0.667 * cap,
    points: true,
  };
}

// A hand at clock angle deg. Base: concave on radius rho (outside mode) or flat at the pivot (fromCentre).
// Tip: 90 degree point finished with a flat of half-width f, so the visible tip sits at L; square = flat end.
function hand(cx, cy, deg, rho, L, s, { square = false, fromCentre = false } = {}) {
  const a = (deg * Math.PI) / 180;
  const ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const f = 0.3 * s;                       // flat half-width = 0.15 x the hand width
  const t0 = fromCentre ? 0 : Math.sqrt(rho * rho - s * s);
  const tip = square ? [P(L, -s), P(L, s)] : [P(L + f - s, -s), P(L, -f), P(L, f), P(L + f - s, s)];
  const pts = [P(t0, -s), ...tip, P(t0, s)];
  const body = `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')}`;
  const d = fromCentre ? `${body} Z` : `${body} A${n(rho)} ${n(rho)} 0 0 0 ${n(pts[0][0])} ${n(pts[0][1])} Z`;
  return { d, pts };
}
const ellipse = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)} a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;
const box = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });

// A tick fixed to the ring's inner edge, pointing at the centre (overlaps the ring by 0.3 mm so it joins cleanly).
function insideTick(cx, cy, G, deg) {
  const a = (deg * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux;
  const r = 1 / Math.sqrt((ux / G.rx) ** 2 + (uy / G.ry) ** 2);
  const P = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const w = G.tickW / 2;
  const pts = [P(r + 0.3, -w), P(r - G.tickLen, -w), P(r - G.tickLen, w), P(r + 0.3, w)];
  return `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`;
}

function clockO(G, cx, cy, { ring, hands }, mode = HANDS) {
  const fromCentre = mode === 'centre' && !G.oneColour;
  const o = { square: !G.points, fromCentre };
  const hm = hand(cx, cy, 0, G.R + G.g, G.Lm, G.sM, o);
  const hh = hand(cx, cy, 150, G.R + G.g, G.Lh, G.sH, o);
  let svg = `<path fill="${ring}" fill-rule="evenodd" d="${ellipse(cx, cy, G.R, G.R)} ${ellipse(cx, cy, G.rx, G.ry)}"/>`;
  if (G.ticks) svg += `<path fill="${ring}" d="${(G.ticks === 'four' ? [0, 90, 180, 270] : [90, 180, 270]).map((d) => insideTick(cx, cy, G, d)).join(' ')}"/>`;
  svg += `<path fill="${hands}" d="${hm.d} ${hh.d}"/>`;
  const dot = fromCentre ? Math.max(G.dot, G.sH * 2 * 1.1) : G.dot;    // just covers the hands' roots when they meet at the centre
  if (dot) svg += `<path fill="${hands}" d="${ellipse(cx, cy, dot / 2, dot / 2)}"/>`;
  return { svg, box: box([...hm.pts, ...hh.pts, [cx - G.R, cy - G.R], [cx + G.R, cy + G.R]]), dot };
}

// Wordmark after the O, letter by letter (merged outlines, extra kerning, S trims).
function restOfWord(G, x, baseY, fill) {
  const { font, cap } = G;
  const t = kit.text('FF SHFT', { font: font.key, cap, track: font.track, x: 0, y: 0 });
  const kern = font.kern || {};
  const str = 'FF SHFT';
  let shift = 0, d = '', pts = [], sTrims = null;
  const ink = [];
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && kern[str[i - 1] + str[i]]) shift += kern[str[i - 1] + str[i]] * cap;
    if (str[i] === ' ') continue;
    const g = glyphMM(font, str[i], x + t.letters[i].x + shift, baseY, cap);
    d += g.d + ' ';
    pts = pts.concat(g.pts);
    if (g.trims) sTrims = g.trims;
    const b = box(g.pts);
    ink.push({ ch: str[i], x0: b.x0, x1: b.x1 });
  }
  return { svg: `<path fill="${fill}" fill-rule="evenodd" d="${d.trim()}"/>`, box: box(pts), ink, sTrims };
}

function lockup(font, cap, colours, opts = {}) {
  const G = geometry(font, cap, opts);
  const cx = 0, cy = 0;
  const baseY = cy - (G.O.top + G.O.bottom) / 2;                // ring centred on the font's O
  const L = G.ref.letters;
  const gapAfterO = L[1].x1 - G.O.x2;                            // the font's own O-to-F spacing
  const restX = cx + G.R + gapAfterO - (L[1].x1 - L[1].x);
  const c = clockO(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  const w = restOfWord(G, restX, baseY, colours.letters);
  const b = union(c.box, w.box);
  // centre of the word space, relative to the lockup's centre (for the 6-panel seam rule)
  const f2 = w.ink[1], s = w.ink[2];
  const seamShift = (f2.x1 + s.x0) / 2 - (b.x0 + b.x1) / 2;
  return { w: b.x1 - b.x0, h: b.y1 - b.y0, body: `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})">${c.svg}${w.svg}</g>`, G, dot: c.dot, seamShift, sTrims: w.sTrims, ink: w.ink.map((q) => ({ ...q, x0: q.x0 - b.x0, x1: q.x1 - b.x0 })) };
}

// Symbol: the clock O alone, scaled so its total height is `height` mm.
function symbol(font, height, colours, opts = {}) {
  let lo = 2, hi = 40;
  const hOf = (cap) => { const G = geometry(font, cap, opts); const c = clockO(G, 0, 0, colours); return c.box.y1 - c.box.y0; };
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (hOf(mid) < height) lo = mid; else hi = mid; }
  const G = geometry(font, lo, opts);
  const c = clockO(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G, dot: c.dot };
}

// Side-of-hat master, drawn for its size (~16.6 mm tall): 7.4 mm ring (7.7 mm one colour), 1.6 mm wall,
// 1.5 mm pivot dot with 1.35 mm fabric (1.5 mm one colour), 1.2 mm channel, pointed hands 1.5 and 1.6 mm wide.
function smallMaster(colours, { oneColour = false } = {}) {
  const R = oneColour ? 3.85 : 3.7, wall = 1.6;
  const G = { R, rx: R - wall, ry: R - wall, g: 1.2, dot: 1.5, sM: 0.75, sH: 0.8, points: true, oneColour };
  G.Lm = G.R + G.g + 4.2;
  G.Lh = G.R + G.g + 3.6;
  const c = clockO(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G };
}

// Channel for a two-colour symbol of a given height: the 1.0 mm minimum below 25 mm, 1.2 mm from 25 mm, 1.5 mm from 35 mm.
const symbolChannel = (h) => (h >= 35 ? 1.5 : h >= 25 ? 1.2 : undefined);

const LIGHT = { letters: T.ink, hands: T.rust, bg: F.bone, name: 'light' };
const DARK = { letters: T.bone, hands: T.sun, bg: F.slate, name: 'dark' };
const ONE_INK = { letters: T.ink, hands: T.ink, bg: F.oat, name: 'one-colour-ink', one: true };
const ONE_BONE = { letters: T.bone, hands: T.bone, bg: F.spruce, name: 'one-colour-bone', one: true };

module.exports = { FONTS, geometry, lockup, symbol, smallMaster, strokes, glyphMM, LIGHT, DARK, ONE_INK, ONE_BONE };

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const write = (name, d) => { const f = path.join(OUT, name); kit.writeSvg(f, d); return f; };
  const A = FONTS[process.env.LOGO_FONT || 'unbounded'];
  const sheet = [];
  const CAP = 7;
  for (const c of [LIGHT, DARK, ONE_INK, ONE_BONE]) {
    const lk = write(`logo-${c.name}.svg`, lockup(A, CAP, c, { oneColour: !!c.one }));
    await kit.render(lk, lk.replace('.svg', '.png'), { bg: c.bg, tile: '100x40', px: 6 });
    const sy = write(`symbol-${c.name}.svg`, symbol(A, 25, c, { oneColour: !!c.one, channel: c.one ? 1.5 : 1.2 }));
    await kit.render(sy, sy.replace('.svg', '.png'), { bg: c.bg, tile: '60x40', px: 6 });
    const sm = write(`side-${c.name}.svg`, smallMaster(c, { oneColour: !!c.one }));
    await kit.render(sm, sm.replace('.svg', '.png'), { bg: c.bg, tile: '40x30', px: 10 });
    sheet.push(lk.replace('.svg', '.png'), sy.replace('.svg', '.png'), sm.replace('.svg', '.png'));
  }
  const caps = [6.6, 7, 7.5];
  for (const cap of caps) {
    const f = write(`logo-light-cap${cap}.svg`, lockup(A, cap, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '110x32', px: 8 });
  }
  const proofs = [];
  for (const h of [19, 25, 40]) {
    const f = write(`symbol-light-${h}mm.svg`, symbol(A, h, LIGHT, { channel: symbolChannel(h) }));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: `${Math.ceil(h * 0.75) + 12}x${h + 12}`, px: 8 });
    proofs.push(f.replace('.svg', '.png'));
  }
  await kit.render(path.join(OUT, 'side-light.svg'), path.join(OUT, 'side-light-proof.png'), { bg: F.bone, tile: '22x28', px: 8 });
  proofs.unshift(path.join(OUT, 'side-light-proof.png'));
  // remove proofs from earlier size floors
  for (const old of ['logo-light-cap6', 'symbol-light-18mm']) for (const ext of ['.svg', '.png']) fs.rmSync(path.join(OUT, old + ext), { force: true });

  const fontPngs = [];
  if (HANDS === 'outside' && !process.env.SKIP_FONTS) {
    fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });
    for (const [id, font] of Object.entries(FONTS)) {
      const f = write(`fonts/${id}.svg`, lockup(font, 7, LIGHT));
      await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '120x36', px: 6 });
      fontPngs.push([f.replace('.svg', '.png'), font.name]);
    }
  }
  await kit.close();

  const lbl = (f) => path.basename(f, '.png');
  const montage = (items, out, geom, tile) => execFileSync('montage', [...items.flatMap((f) => ['-label', Array.isArray(f) ? f[1] : lbl(f), Array.isArray(f) ? f[0] : f]), '-tile', tile, '-geometry', geom, '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, out)]);
  montage(sheet, 'sheet.png', '480x200+8+8', '3x');
  montage(caps.map((c) => path.join(OUT, `logo-light-cap${c}.png`)), 'sizes-lockup.png', '+6+6', '1x');
  montage(proofs, 'sizes-symbol.png', '+12+12', `${proofs.length}x1`);
  if (fontPngs.length) montage(fontPngs, 'fonts/sheet.png', '720x216+10+10', '2x');

  // ---- numbers, and notes.md (main set only)
  const L7 = lockup(A, 7, LIGHT), L7one = lockup(A, 7, ONE_INK, { oneColour: true }), G = L7.G, G1 = L7one.G;
  const S25 = symbol(A, 25, LIGHT, { channel: 1.2 }), SM = smallMaster(LIGHT), SM1 = smallMaster(ONE_INK, { oneColour: true });
  const L66 = lockup(A, 6.6, LIGHT);
  const S19 = symbol(A, 19, LIGHT, { channel: symbolChannel(19) });
  const S205 = symbol(A, 20.5, ONE_INK, { oneColour: true });
  const F_T = L7.ink[5].x0 - L7.ink[4].x1;                      // gap between the F and the T, at the bars (ink boxes)
  const num = {
    lockupW: L7.w, lockupH: L7.h, lockupOneH: L7one.h, ring: 2 * G.R, wallSide: G.R - G.rx, wallTop: G.R - G.ry,
    counter: [2 * G.rx, 2 * G.ry], minute: [2 * G.sM, G.Lm - G.R - G.g], hour: [2 * G.sH, G.Lh - G.R - G.g],
    dot: L7.dot, fabric: G.rx - L7.dot / 2, dotOne: L7one.dot, fabricOne: G1.rx - L7one.dot / 2, channel: G.g, channelOne: G1.g,
    stem: G.stem, arm: G.arm, seam: L7.seamShift, sTrims: L7.sTrims, sTrims66: L66.sTrims, FT: F_T,
    l66: [L66.w, L66.h, L66.dot], s25: [S25.w, S25.h, S25.dot], s19: [S19.w, S19.h, S19.dot], s205: S205.dot,
    side: [SM.w, SM.h], sideOne: [SM1.w, SM1.h],
  };
  console.log(JSON.stringify(num, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)));
  if (HANDS === 'outside' && A === FONTS.unbounded) fs.writeFileSync(path.join(OUT, 'notes.md'), notes(num));
})().catch((e) => { console.error(e); process.exit(1); });

function notes(m) {
  const f = (v, d = 2) => Number(v).toFixed(d);
  return `# OFF SHFT logo: The O

The O in OFF is a clock face. Two hands stand out of it showing 5:00, quitting time, so the name and the idea are one mark: the shift is over and the time is yours. The hands and pivot dot are stitched in the accent thread so they read as clock hands laid on a dial.

Owner's picks: hands-only clock, W3 watch hands, "The O" placement, O 15% taller than the letters, Unbounded Bold.

**This file is written by \`build.cjs\`.** Every number below is measured from the generated artwork. Do not edit it by hand; change \`build.cjs\` and rebuild.

## Files

| File | What it is |
|---|---|
| \`logo-light.svg\` | Main lockup for light fabric: Ink letters and O, Rust hands and dot |
| \`logo-dark.svg\` | Main lockup for dark fabric: Bone letters and O, Sun hands and dot |
| \`logo-one-colour-ink.svg\`, \`logo-one-colour-bone.svg\` | One thread only (wider channel, smaller dot) |
| \`symbol-*.svg\` | The clock O alone, 25 mm tall (patches, hat back, avatar) |
| \`side-*.svg\` | Side-of-hat master, its own drawing (two colour and one colour) |
| \`logo-light-cap6.6/7/7.5.svg\`, \`symbol-light-19/25/40mm.svg\` | True-size proofs |
| \`fonts/\` | The same logo in other wide faces (comparison only) |
| \`hands-centre/\` | Tested and not adopted: hands running from the pivot over the O (cold reads: logo 8/10 with "QFF" mentions, against 9/10 with none for the main version) |

## Construction (at cap height 7 mm)

| Part | Rule | At cap 7 |
|---|---|---|
| Wordmark | Unbounded Bold, letter-spacing 0.12 em. Extra kerning: F-F -0.043 cap, F-space -0.05 cap, F-T -0.025 cap. Each letter is one merged outline. | ${f(m.lockupW, 1)} x ${f(m.lockupH, 1)} mm overall (one colour ${f(m.lockupOneH, 1)} mm tall) |
| Letter strokes | Measured from Unbounded | stem ${f(m.stem)} mm, arm ${f(m.arm)} mm |
| Clock O | Ring 1.15 x the font's own O height, centred on it | ${f(m.ring)} mm across |
| Ring walls | Sides 1.0 x stem (0.98 one colour), top and bottom 0.9 x stem | ${f(m.wallSide)} mm sides, ${f(m.wallTop)} mm top/bottom; counter ${f(m.counter[0])} x ${f(m.counter[1])} mm |
| Channel | Even gap between ring and hands, hand bases concave. Two colours max(1.0, 0.143 cap); one colour 1.2, 1.5 from cap 7 | ${f(m.channel)} mm (one colour ${f(m.channelOne)} mm) |
| Minute hand | 1.0 stem wide, visible 0.936 cap from the channel, exactly 12 o'clock | ${f(m.minute[0])} x ${f(m.minute[1])} mm |
| Hour hand | 1.02 stems wide, visible 0.667 cap from the channel, exactly 150 degrees | ${f(m.hour[0])} x ${f(m.hour[1])} mm |
| Points | 90 degree taper ending in a flat 0.3 x the hand width (this is what stitches) | |
| Pivot dot | Hand colour, at most 0.286 cap, at least 1.3 mm fabric to the counter (1.5 one colour) | ${f(m.dot)} mm with ${f(m.fabric)} mm fabric; one colour ${f(m.dotOne)} mm with ${f(m.fabricOne)} mm |
| S | Terminals trimmed so both apertures are 1.0 mm (upper / lower trim) | ${f(m.sTrims.upper)} / ${f(m.sTrims.lower)} mm (cap 6.6: ${f(m.sTrims66.upper)} / ${f(m.sTrims66.lower)} mm) |
| F-T | Gap between the F arm and the T bar | ${f(m.FT)} mm |

## Colourways

| Fabric | Version |
|---|---|
| Bone | Ink + Rust (\`logo-light\`) |
| Slate, Spruce | Bone + Sun (\`logo-dark\`) |
| Oat | Ink + Rust only if a sew-out passes; otherwise Ink one colour |
| Moss, Rust | Bone one colour |

The hex values are targets. Match each to the nearest colour on a physical thread card (for example Isacord 40 or Madeira Polyneon 40) and approve from a sew-out on the real blank. One-colour versions are for tonal or single-thread jobs, never the default front logo.

## Size floors

- Lockup, two colours: cap 6.6 mm minimum (${f(m.l66[0], 1)} x ${f(m.l66[1], 1)} mm, dot ${f(m.l66[2])} mm). Hat fronts: cap 7 (${f(m.lockupW, 1)} mm wide).
- Lockup, one colour: cap 7 minimum.
- Symbol: 19 mm tall minimum in two colours (dot ${f(m.s19[2])} mm), 20.5 mm in one colour (dot ${f(m.s205)} mm). Plain satin up to 45 mm; above that, split satin or tatami. From 35 mm, use a 1.5 mm channel.
- Under 19 mm: use the side master only (${f(m.side[0], 1)} x ${f(m.side[1], 1)} mm; one colour ${f(m.sideOne[0], 1)} x ${f(m.sideOne[1], 1)} mm). Never scale the main files down.
- Any embroidered Unbounded Bold text: cap 6.6 mm minimum, letter-spacing 0.12 em, with the S trims. Smaller text needs a separately approved lighter face (owner's decision).

## Notes for the digitizer

- Digitize each size on its own. Never scale a stitch file.
- Stitch order: Ink letters from the centre out (S, H, F, T, then F, F), the ring last, then the accent from the bottom up: pivot dot, hour hand, minute hand. One colour change.
- Pull compensation: 0.15-0.18 mm per edge (0.30-0.35 mm total), plus 0.05 mm per edge where stitches run horizontally (stems, and the ring at 3 and 9 o'clock). Only 0.05-0.10 mm per edge on edges facing the channel, the S necks, the pivot dot, the F slot and the ring's inner edge at 3 and 9 o'clock.
- Ring: satin with edge-run underlay, short stitches on the inner edge. Digitize it 0.3 mm wider than tall (about ${f(m.ring + 0.3)} x ${f(m.ring)} mm at cap 7), adding the extra on the outer edge only.
- Hand roots: pull back 0.2 mm, no end compensation, so the channel stays open. Tips: keep the drawn flat; pull back 0.2 mm.
- S: the artwork already includes the terminal trims. Pull both terminal ends back 0.2 mm with no end compensation and hold spine-edge comp to 0.10 mm at the two necks, so the apertures finish at about 0.9-1.0 mm.
- F slot (between the arms): 0.05 mm comp on the two slot-facing edges, the rest on the outer edges, so the slot finishes at 1.1 mm or more. If a sew-out still shows less than 1.0 mm, lower the F's middle arm by 0.20 mm in build.cjs.
- F-T: pull both facing bar ends back 0.15 mm with no end compensation.
- Pivot dot: satin with 0.10 mm comp, straight after the colour change.
- 6-panel caps (dad hats, structured snapbacks): the centre seam would cross the S. Always shift the lockup **${f(Math.abs(m.seam), 1)} mm ${m.seam < 0 ? 'right' : 'left'}** so the seam falls in the middle of the word space. 5-panel and seamless fronts stay centred.
- Approve only after a sew-out on the actual blank shows the pivot centred within 0.2 mm, both channels at least 0.8 mm open and both S apertures open.

## How it was tested

- Blind reading rounds with fresh readers who were given no context. Final round (after the Unbounded review fixes): the lockup read "OFF SHFT" 3 out of 3 at 9/10 confidence with no "Q" readings; the symbol read as a clock 3 out of 3 at 6/10. Earlier rounds showed that one-colour versions and short hands drift towards "Q" or "magnifying glass", and that tick marks around the O add "compass" readings.
- The symbol is abstract on its own; it gains recognition when used alongside the full logo (for example front logo plus side symbol).
- Two brand reviews and two embroidery reviews (Archivo, then Unbounded) set every rule above.
`;
}
