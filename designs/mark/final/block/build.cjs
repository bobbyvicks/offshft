// OFF SHFT logo, hard-edged ("block"): the owner's pick of 2 Nov 2026 over the Unbounded version in ../the-o/.
// It reproduces the lettering Codex drew for the hat mockups (the live theme's artwork "puff adaptation: OFF SHFT"),
// which the owner liked better: F, H and T are plain blocks (stem 0.271 cap, arms 0.30-0.33 cap), the S is Unbounded
// Bold's S thickened with its terminals cut flat (its outline is kept in s-outline.json, measured from that artwork),
// the O is a heavy ring (wall 0.257 cap) with a pivot dot, and the hands are plain bars with square ends: minute 0.59 cap
// long at 12, hour 0.37 cap at 150 degrees (5:00), standing off the ring across an even channel. Letters sit 0.07 cap
// apart, the word space is 0.14 cap, the ring 0.166 cap before the first F. Every number is a fraction of the cap
// height, so the drawing is the same at every size; the only departures are the embroidery floors below.
//
// Embroidery floors (the same rules the Unbounded logo had, designs/mark/final/the-o/notes.md):
//   channel >= 1.0 mm two colours, 1.2 mm one colour (1.5 mm from 7 mm caps and on the 40 mm clock);
//   pivot dot >= 1.5 mm with >= 1.3 mm of fabric to the ring (1.5 one colour), else left out (one colour: always out);
//   the F's slot and the S's mouths >= 1.0 mm (the slot moves the crossbar down, the mouths trim the terminals).
//
// Exports mirror ../the-o/build.cjs so the brand kit, the store assets and the Printful export need only the require.
// Run: cd /home/user/offshft/tools && node ../designs/mark/final/block/build.cjs      (writes the files and notes.md)
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const ClipperLib = require('/home/user/offshft/tools/node_modules/clipper-lib');

const OUT = __dirname;
const T = kit.T, F = kit.F;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

// ---------------------------------------------------------------- the drawing, in cap heights (measured from Codex's
// artwork at cap 21.40 mm; two decimals of a millimetre there)
const REF = {
  stem: 5.80 / 21.40,                 // F, H stems (T: 5.83)
  arm: 6.40 / 21.40,                  // F top arm
  F: { w: 13.33 / 21.40, barW: 13.02 / 21.40, barTop: 8.20 / 21.40, barBottom: 14.61 / 21.40 },
  H: { w: 15.54 / 21.40, barTop: 7.02 / 21.40, barBottom: 14.08 / 21.40 },
  T: { w: 15.24 / 21.40, barH: 7.06 / 21.40, stem: 5.83 / 21.40 },
  ring: { R: 10.10 / 21.40, r: 4.60 / 21.40, cy: 10.03 / 21.40 },   // cy: centre below the cap line
  hand: { w: 5.30 / 21.40, minute: 12.70 / 21.40, hour: 8.00 / 21.40, channel: 1.60 / 21.40 },
  dot: 5.80 / 21.40,
  gap: { ringToF: 3.55 / 21.40, letter: 1.50 / 21.40, word: 3.00 / 21.40 },
};
const S_SRC = JSON.parse(fs.readFileSync(path.join(__dirname, 's-outline.json'), 'utf8'));
const FLOOR = { channel: 1.0, channelOne: 1.2, channelOneBig: 1.5, dot: 1.5, fabric: 1.3, fabricOne: 1.5, slot: 1.0, mouth: 1.0 };

// ---------------------------------------------------------------- clipper helpers (integers: mm x SC)
const SC = 1000;
const P = (x, y) => ({ X: Math.round(x * SC), Y: Math.round(y * SC) });
const rect = (x0, y0, x1, y1) => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)];
function clip(op, subj, clips = []) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  if (clips.length) c.AddPaths(clips, ClipperLib.PolyType.ptClip, true);
  const sol = new ClipperLib.Paths();
  c.Execute(op, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return sol;
}
const pathD = (paths) => paths.map((p) => 'M' + p.map(({ X, Y }) => `${n(X / SC)} ${n(Y / SC)}`).join(' L') + ' Z').join(' ');
const ptsOf = (paths) => paths.flatMap((p) => p.map(({ X, Y }) => [X / SC, Y / SC]));
const box = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
// y values where the vertical line x crosses the polygon's edges, sorted
function crossingsY(poly, x) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    if ((ax - x) * (bx - x) < 0) out.push(ay + ((x - ax) / (bx - ax)) * (by - ay));
  }
  return out.sort((a, b) => a - b);
}

// ---------------------------------------------------------------- letters: left edge at x, cap line at y, cap height cap
function letterF(x, y, cap) {
  const s = REF.stem * cap, a = REF.arm * cap;
  const slot = Math.max(REF.F.barTop * cap - a, FLOOR.slot);               // the slot opens to 1.0 mm at small sizes
  const barTop = y + a + slot, barBottom = y + REF.F.barBottom * cap;
  const paths = clip(ClipperLib.ClipType.ctUnion, [rect(x, y, x + s, y + cap), rect(x, y, x + REF.F.w * cap, y + a), rect(x, barTop, x + REF.F.barW * cap, barBottom)]);
  return { paths, slot, bar: barBottom - barTop };
}
function letterH(x, y, cap) {
  const s = REF.stem * cap, w = REF.H.w * cap;
  const paths = clip(ClipperLib.ClipType.ctUnion, [rect(x, y, x + s, y + cap), rect(x + w - s, y, x + w, y + cap), rect(x, y + REF.H.barTop * cap, x + w, y + REF.H.barBottom * cap)]);
  return { paths, counter: w - 2 * s };
}
function letterT(x, y, cap) {
  const w = REF.T.w * cap, s = REF.T.stem * cap;
  return { paths: clip(ClipperLib.ClipType.ctUnion, [rect(x, y, x + w, y + REF.T.barH * cap), rect(x + (w - s) / 2, y, x + (w + s) / 2, y + cap)]) };
}
// The S: the measured outline, scaled; its mouths opened to the floor by trimming the terminal faces (the way the
// Unbounded logo trims its S). Mouths are measured 1.0 mm in from each terminal's tip.
function letterS(x, y, cap) {
  const k = cap / S_SRC.cap;
  const poly = S_SRC.points.map(([px, py]) => [x + px * k, y + py * k]);
  const w = Math.max(...poly.map((p) => p[0])) - x;
  let paths = clip(ClipperLib.ClipType.ctUnion, [poly.map(([px, py]) => P(px, py))]);
  const trims = { upper: 0, lower: 0 };
  // upper terminal: top right. Its underside and the spine below it, 1.0 mm in from the tip.
  const tipR = x + w, xu = tipR - 1.0;
  const cu = crossingsY(poly, xu).filter((v) => v > y - 0.1 * cap && v < y + 0.6 * cap);
  const mouthU = cu.length >= 3 ? cu[2] - cu[1] : Infinity;
  if (mouthU < FLOOR.mouth) {
    trims.upper = FLOOR.mouth - mouthU;
    const zone = tipR - 3.0;                                               // the terminal's last 3 mm
    let low = -Infinity;
    for (let xx = zone; xx <= tipR - 0.05; xx += 0.05) { const c = crossingsY(poly, xx).filter((v) => v < y + 0.45 * cap); if (c.length >= 2) low = Math.max(low, c[1]); }
    paths = clip(ClipperLib.ClipType.ctDifference, paths, [rect(zone, low - trims.upper, tipR + 1, low + 0.01)]);
  }
  // lower terminal: bottom left. Its top face and the spine above it.
  const tipL = x + Math.min(...poly.filter((p) => p[1] > y + 0.6 * cap).map((p) => p[0])) - x, xl = tipL + 1.0;
  const cl = crossingsY(poly, xl).filter((v) => v > y + 0.4 * cap && v < y + 1.1 * cap);
  const mouthL = cl.length >= 2 ? cl[cl.length - 2] - cl[cl.length - 3] : Infinity;
  if (mouthL < FLOOR.mouth) {
    trims.lower = FLOOR.mouth - mouthL;
    const zone = tipL + 3.0;
    let high = Infinity;
    for (let xx = tipL + 0.05; xx <= zone; xx += 0.05) { const c = crossingsY(poly, xx).filter((v) => v > y + 0.55 * cap); if (c.length >= 2) high = Math.min(high, c[c.length - 2]); }
    paths = clip(ClipperLib.ClipType.ctDifference, paths, [rect(x - 1, high - 0.01, zone, high + trims.lower)]);
  }
  return { paths, w, trims, mouths: { upper: mouthU, lower: mouthL } };
}

// ---------------------------------------------------------------- the clock (ring, bar hands, dot)
// G: every size in mm. cap is the letter height the clock belongs to (the symbol alone passes an equivalent cap).
function geometry(cap, { oneColour = false, channel, dot: wantDot = true } = {}) {
  const R = REF.ring.R * cap, r = REF.ring.r * cap, handW = REF.hand.w * cap;
  const gMin = oneColour ? (cap >= 7 ? FLOOR.channelOneBig : FLOOR.channelOne) : FLOOR.channel;
  const g = channel !== undefined ? channel : Math.max(REF.hand.channel * cap, gMin);
  const fabricMin = oneColour ? FLOOR.fabricOne : FLOOR.fabric;
  let dot = Math.min(REF.dot * cap, 2 * (r - fabricMin));
  if (dot < FLOOR.dot || !wantDot || oneColour) dot = 0;
  return { cap, R, r, wall: R - r, g, dot, handW, Lm: REF.hand.minute * cap, Lh: REF.hand.hour * cap, oneColour, fabric: dot ? r - dot / 2 : null };
}
const ellipse = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)} a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0 a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0 Z`;
// A bar hand: width w, from distance t0 to t1 along the clock angle deg, square ends.
function bar(cx, cy, deg, t0, t1, w) {
  const a = (deg * Math.PI) / 180, ux = Math.sin(a), uy = -Math.cos(a), nx = -uy, ny = ux, s = w / 2;
  const Q = (t, k) => [cx + ux * t + nx * k, cy + uy * t + ny * k];
  const pts = [Q(t0, -s), Q(t1, -s), Q(t1, s), Q(t0, s)];
  return { d: `M${pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L')} Z`, pts };
}
function clock(G, cx, cy, { ring, hands }) {
  const hm = bar(cx, cy, 0, G.R + G.g, G.R + G.g + G.Lm, G.handW);
  const hh = bar(cx, cy, 150, G.R + G.g, G.R + G.g + G.Lh, G.handW);
  let svg = `<path fill="${ring}" fill-rule="evenodd" d="${ellipse(cx, cy, G.R, G.R)} ${ellipse(cx, cy, G.r, G.r)}"/>`;
  svg += `<path fill="${hands}" d="${hm.d} ${hh.d}"/>`;
  if (G.dot) svg += `<path fill="${hands}" d="${ellipse(cx, cy, G.dot / 2, G.dot / 2)}"/>`;
  return { svg, box: box([...hm.pts, ...hh.pts, [cx - G.R, cy - G.R], [cx + G.R, cy + G.R]]) };
}

// ---------------------------------------------------------------- the lockup: the clock O, then FF SHFT
function lockup(cap, colours, opts = {}) {
  const G = geometry(cap, opts);
  const cx = G.R, cy = REF.ring.cy * cap, capLine = 0;                     // ring centre; the cap line is y = 0
  const c = clock(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  let x = cx + G.R + REF.gap.ringToF * cap;
  const parts = [], ink = [];
  const put = (ch, g) => { const b = box(ptsOf(g.paths)); ink.push({ ch, x0: b.x0, x1: b.x1 }); parts.push(pathD(g.paths)); x = b.x1; };
  const f1 = letterF(x, capLine, cap); put('F', f1); x += REF.gap.letter * cap;
  put('F', letterF(x, capLine, cap)); x += REF.gap.word * cap;
  const s = letterS(x, capLine, cap); put('S', s); x += REF.gap.letter * cap;
  const h = letterH(x, capLine, cap); put('H', h); x += REF.gap.letter * cap;
  put('F', letterF(x, capLine, cap)); x += REF.gap.letter * cap;
  put('T', letterT(x, capLine, cap));
  const word = `<path fill="${colours.letters}" fill-rule="nonzero" d="${parts.join(' ')}"/>`;
  const b = union(c.box, { x0: ink[0].x0, y0: capLine - 0.04 * cap, x1: ink[ink.length - 1].x1, y1: capLine + cap + 0.01 * cap });
  const bb = { x0: b.x0, y0: Math.min(b.y0, capLine), x1: b.x1, y1: Math.max(b.y1, capLine + cap) };
  const seamShift = (ink[1].x1 + ink[2].x0) / 2 - (bb.x0 + bb.x1) / 2;   // word space centre, from the lockup's centre
  return { w: bb.x1 - bb.x0, h: bb.y1 - bb.y0, body: `<g transform="translate(${n(-bb.x0)} ${n(-bb.y0)})">${c.svg}${word}</g>`, G, dot: G.dot, cap, ink: ink.map((q) => ({ ...q, x0: q.x0 - bb.x0, x1: q.x1 - bb.x0 })), seamShift, slot: f1.slot, hCounter: h.counter, sTrims: s.trims, sMouths: s.mouths };
}
// The cap height that gives the lockup a width (the Printful and store files are sized by width)
function capForWidth(width, colours = LIGHT, opts = {}) {
  let lo = 2, hi = 60;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (lockup(mid, colours, opts).w < width) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
// The clock alone, scaled so its total height (minute tip to hour tip) is `height` mm. Same clock as the lockup's O.
function symbol(height, colours, opts0 = {}) {
  const opts = { ...opts0 };
  let lo = 1, hi = 80;
  const hOf = (cap) => { const G = geometry(cap, opts); const c = clock(G, 0, 0, colours); return c.box.y1 - c.box.y0; };
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (hOf(mid) < height) lo = mid; else hi = mid; }
  const G = geometry(lo, opts);
  const c = clock(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G, dot: G.dot };
}
// Side-of-hat master: its own small drawing, as before (7.4 mm ring), but the wall thinned to 1.6 mm so the 1.5 mm
// pivot dot keeps 1.3 mm of fabric; bar hands 1.5 mm wide, 1.2 mm channel (1.5 one colour, no dot).
function smallMaster(colours, { oneColour = false } = {}) {
  const R = 3.7, r = R - 1.6, g = oneColour ? 1.5 : 1.2;
  const G = { R, r, wall: 1.6, g, dot: oneColour ? 0 : 1.5, handW: 1.5, Lm: 4.2, Lh: 2.8, oneColour, fabric: oneColour ? null : r - 0.75 };
  const c = clock(G, 0, 0, { ring: colours.letters, hands: colours.hands });
  return { w: c.box.x1 - c.box.x0, h: c.box.y1 - c.box.y0, body: `<g transform="translate(${n(-c.box.x0)} ${n(-c.box.y0)})">${c.svg}</g>`, G };
}
// OFF over SHFT for squares and circles: the ring and FF on one line, SHFT under it, left-aligned on the ring's left
// edge, SHFT's cap line a hand's width below the hour hand's lowest corner.
function stackedParts(colours, opts = {}) {
  const cap = 10, G = geometry(cap, { ...opts, channel: Math.max(FLOOR.channelOneBig, REF.hand.channel * cap) });
  const cx = G.R, cy = REF.ring.cy * cap;
  const c = clock(G, cx, cy, { ring: colours.letters, hands: colours.hands });
  let x = cx + G.R + REF.gap.ringToF * cap;
  const parts = [], boxes = [];
  const put = (g) => { const b = box(ptsOf(g.paths)); boxes.push(b); parts.push(pathD(g.paths)); x = b.x1; };
  put(letterF(x, 0, cap)); x += REF.gap.letter * cap; put(letterF(x, 0, cap));
  const line2 = c.box.y1 + G.handW;                                        // SHFT's cap line
  x = cx - G.R;
  const s = letterS(x, line2, cap); put(s); x += REF.gap.letter * cap;
  put(letterH(x, line2, cap)); x += REF.gap.letter * cap;
  put(letterF(x, line2, cap)); x += REF.gap.letter * cap;
  put(letterT(x, line2, cap));
  const word = `<path fill="${colours.letters}" fill-rule="nonzero" d="${parts.join(' ')}"/>`;
  const bb = boxes.reduce(union, c.box);
  return { body: c.svg + word, bbox: bb, G, cx: (bb.x0 + bb.x1) / 2, cy: (bb.y0 + bb.y1) / 2 };
}
function stackedArt(colours, opts = {}) {
  const { body, bbox } = stackedParts(colours, opts);
  return { w: bbox.x1 - bbox.x0, h: bbox.y1 - bbox.y0, body: `<g transform="translate(${n(-bbox.x0)} ${n(-bbox.y0)})">${body}</g>` };
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
  const G = geometry(20, { ...opts, channel: 1.5 });
  const k = 47 / (G.R + G.g + G.Lm);
  return `<g transform="translate(50 50) scale(${n(k)})">${clock(G, 0, 0, { ring: colours.letters, hands: colours.hands }).svg}</g>`;
}

const LIGHT = { letters: T.ink, hands: T.rust, bg: F.bone, name: 'light' };
const DARK = { letters: T.bone, hands: T.sun, bg: F.slate, name: 'dark' };
const ONE_INK = { letters: T.ink, hands: T.ink, bg: F.oat, name: 'one-colour-ink', one: true };
const ONE_BONE = { letters: T.bone, hands: T.bone, bg: F.spruce, name: 'one-colour-bone', one: true };
const LOCKUP_WIDTH = 62.6;                                                  // the hat-front and chest file, as before
const symbolChannel = (h) => (h >= 35 ? 1.5 : h >= 25 ? 1.2 : undefined);

module.exports = { REF, FLOOR, geometry, lockup, capForWidth, symbol, smallMaster, stackedArt, stacked, clockTile, clock, letterF, letterH, letterT, letterS, LIGHT, DARK, ONE_INK, ONE_BONE, LOCKUP_WIDTH, symbolChannel };

// ---------------------------------------------------------------- outputs
if (require.main === module) (async () => {
  const write = (name, d) => { const f = path.join(OUT, name); kit.writeSvg(f, d); return f; };
  const CAP = capForWidth(LOCKUP_WIDTH);
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
  const caps = [7, 8.5, CAP];
  for (const cap of caps) {
    const f = write(`logo-light-cap${n(Math.round(cap * 10) / 10)}.svg`, lockup(cap, LIGHT));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: '110x32', px: 8 });
  }
  const proofs = [];
  for (const h of [19, 25, 40]) {
    const f = write(`symbol-light-${h}mm.svg`, symbol(h, LIGHT, { channel: symbolChannel(h) }));
    await kit.render(f, f.replace('.svg', '.png'), { bg: F.bone, tile: `${Math.ceil(h * 0.75) + 12}x${h + 12}`, px: 8 });
    proofs.push(f.replace('.svg', '.png'));
  }
  const d40 = write('symbol-dark-40mm.svg', symbol(40, DARK, { channel: symbolChannel(40) }));
  await kit.render(d40, d40.replace('.svg', '.png'), { bg: DARK.bg, tile: '42x52', px: 8 });
  const i40 = write('symbol-one-colour-ink-40mm.svg', symbol(40, ONE_INK, { oneColour: true, channel: symbolChannel(40) }));
  await kit.render(i40, i40.replace('.svg', '.png'), { bg: ONE_INK.bg, tile: '42x52', px: 8 });
  const st = write('stacked-light.svg', stackedArt(LIGHT));
  await kit.render(st, st.replace('.svg', '.png'), { bg: F.bone, tile: '60x60', px: 8 });
  await kit.close();
  const lbl = (f) => path.basename(f, '.png');
  const montage = (items, out, geom, tile) => execFileSync('montage', [...items.flatMap((f) => ['-label', lbl(f), f]), '-tile', tile, '-geometry', geom, '-pointsize', '20', '-background', '#d9d4c8', path.join(OUT, out)]);
  montage(sheet, 'sheet.png', '480x200+8+8', '3x');
  montage(caps.map((c) => path.join(OUT, `logo-light-cap${n(Math.round(c * 10) / 10)}.png`)), 'sizes-lockup.png', '+6+6', '1x');
  montage([...proofs, st.replace('.svg', '.png')], 'sizes-symbol.png', '+12+12', `${proofs.length + 1}x1`);

  const L = lockup(CAP, LIGHT), L1 = lockup(CAP, ONE_INK, { oneColour: true }), L7 = lockup(7, LIGHT), G = L.G;
  const S25 = symbol(25, LIGHT, { channel: 1.2 }), S40 = symbol(40, LIGHT, { channel: 1.5 }), S19 = symbol(19, LIGHT), SM = smallMaster(LIGHT);
  const num = { cap: CAP, lockupW: L.w, lockupH: L.h, oneH: L1.h, ring: 2 * G.R, wall: G.wall, counter: 2 * G.r, channel: G.g, channelOne: L1.G.g, dot: G.dot, fabric: G.fabric, handW: G.handW, minute: G.Lm, hour: G.Lh,
    stem: REF.stem * CAP, arm: REF.arm * CAP, slot: L.slot, hCounter: L.hCounter, sMouths: L.sMouths, sTrims: L.sTrims, seam: L.seamShift,
    cap7: { w: L7.w, h: L7.h, dot: L7.dot, slot: L7.slot, hCounter: L7.hCounter, sTrims: L7.sTrims, sMouths: L7.sMouths },
    s25: { w: S25.w, h: S25.h, ring: 2 * S25.G.R, dot: S25.dot, fabric: S25.G.fabric, channel: S25.G.g }, s40: { ring: 2 * S40.G.R, dot: S40.dot, fabric: S40.G.fabric, wall: S40.G.wall, hand: S40.G.handW }, s19: { ring: 2 * S19.G.R, dot: S19.dot, channel: S19.G.g },
    side: [SM.w, SM.h] };
  console.log(JSON.stringify(num, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)));
  fs.writeFileSync(path.join(OUT, 'notes.md'), notes(num));
})().catch((e) => { console.error(e); process.exit(1); });

function notes(m) {
  const f = (v, d = 2) => Number(v).toFixed(d);
  return `# OFF SHFT logo: the block version

The O in OFF is a clock at 5:00 (quitting time): a heavy ring with a pivot dot, and two bar hands standing off it. The letters are blocks: F, H and T drawn from rectangles, the S Unbounded Bold's S thickened with its terminals cut flat. It is the lettering from the hat mockups (Codex's "puff adaptation", 29 Oct 2026), which the owner picked over the rounded Unbounded version on 2 Nov 2026 ("the hard edged one"). The rounded version stays in \`../the-o/\` for the record.

**This file is written by \`build.cjs\`.** Every number is measured from the generated artwork. Change \`build.cjs\` and rebuild; never edit the files by hand.

## Files

| File | What it is |
|---|---|
| \`logo-light.svg\` | Main lockup for light fabric: Ink letters and ring, Rust hands and dot. ${f(m.lockupW, 1)} mm wide (the hat-front and chest size, as before), letters ${f(m.cap, 1)} mm |
| \`logo-dark.svg\` | Main lockup for dark fabric: Bone letters and ring, Sun hands and dot |
| \`logo-one-colour-ink.svg\`, \`logo-one-colour-bone.svg\` | One thread only: no dot, ${f(m.channelOne, 1)} mm channel |
| \`symbol-*.svg\` | The clock alone, 25 mm tall (patches, hat back, avatar); \`symbol-light-19/25/40mm.svg\`, \`symbol-dark-40mm.svg\`, \`symbol-one-colour-ink-40mm.svg\` as before |
| \`side-*.svg\` | Side-of-hat master, its own small drawing (7.4 mm ring) |
| \`stacked-light.svg\` | OFF over SHFT, for squares (the brand kit draws the colourways) |
| \`logo-light-cap7/8.5/${f(m.cap, 1)}.svg\` | Size proofs |

## Construction (fractions of the letter height; at the ${f(m.lockupW, 1)} mm lockup, letters ${f(m.cap, 2)} mm)

| Part | Rule | Here |
|---|---|---|
| F, H, T | Blocks. Stem 0.271 cap; F top arm 0.299 cap, crossbar 0.300 cap starting 0.383 cap down; H bar 0.330 cap starting 0.328 down; T bar 0.330 cap. Widths F 0.623, H 0.726, T 0.712 cap | stem ${f(m.stem)} mm, arm ${f(m.arm)} mm, F slot ${f(m.slot)} mm, H counter ${f(m.hCounter)} mm |
| S | Measured outline (\`s-outline.json\`), 1.016 cap wide; mouths opened to 1.0 mm by trimming the terminal faces where needed | mouths ${f(m.sMouths.upper)} / ${f(m.sMouths.lower)} mm, trims ${f(m.sTrims.upper)} / ${f(m.sTrims.lower)} mm |
| Ring | Outer 0.944 cap across, wall 0.257 cap, centred 0.469 cap below the cap line (top of the ring on the cap line) | ${f(m.ring)} mm across, wall ${f(m.wall)} mm, counter ${f(m.counter)} mm |
| Hands | Bars 0.248 cap wide with square ends. Minute: 0.594 cap long at 12. Hour: 0.374 cap at 150 degrees. Both start 0.075 cap off the ring (floor: 1.0 mm two colours, 1.2 one colour, 1.5 from 7 mm caps) | ${f(m.handW)} wide; minute ${f(m.minute)}, hour ${f(m.hour)} mm; channel ${f(m.channel)} mm |
| Pivot dot | Hand colour, 0.271 cap, no more than leaves 1.3 mm of fabric to the ring; left out under 1.5 mm and in one colour | ${m.dot ? `${f(m.dot)} mm, ${f(m.fabric)} mm of fabric` : 'left out'} |
| Spacing | Ring to F 0.166 cap; between letters 0.070 cap; word space 0.140 cap | seam (word-space centre) ${f(m.seam)} mm from the centre |
| Overall | | ${f(m.lockupW, 1)} x ${f(m.lockupH, 1)} mm (one colour ${f(m.oneH, 1)} mm tall) |

## Sizes

| Drawing | Numbers |
|---|---|
| Lockup at cap 7 (the old floor) | ${f(m.cap7.w, 1)} x ${f(m.cap7.h, 1)} mm, ${m.cap7.dot ? `dot ${f(m.cap7.dot)} mm` : 'no dot'}, F slot ${f(m.cap7.slot)} mm, H counter ${f(m.cap7.hCounter)} mm, S trims ${f(m.cap7.sTrims.upper)} / ${f(m.cap7.sTrims.lower)} mm |
| 25 mm clock | ring ${f(m.s25.ring, 1)} mm, channel ${f(m.s25.channel)} mm, ${m.s25.dot ? `dot ${f(m.s25.dot)} mm with ${f(m.s25.fabric)} mm of fabric` : 'no dot'} |
| 40 mm clock | ring ${f(m.s40.ring, 1)} mm, wall ${f(m.s40.wall)} mm, hands ${f(m.s40.hand)} mm wide, ${m.s40.dot ? `dot ${f(m.s40.dot)} mm with ${f(m.s40.fabric)} mm of fabric` : 'no dot'} |
| 19 mm clock | ring ${f(m.s19.ring, 1)} mm, channel ${f(m.s19.channel)} mm, ${m.s19.dot ? `dot ${f(m.s19.dot)} mm` : 'no dot'} |
| Side-of-hat master | ${f(m.side[0], 1)} x ${f(m.side[1], 1)} mm |

Floors: the pivot dot needs letters of about 9.5 mm (1.5 mm dot with 1.3 mm of fabric inside a 0.215 cap counter), so the ${f(m.lockupW, 1)} mm lockup has it and a cap-7 lockup doesn't. Satin: nothing here is wider than 12 mm below a 45 mm clock (the ring wall is 0.257 cap, the hands 0.248 cap).

## Colourways

Bone fabric: Ink + Rust (\`logo-light\`). Slate, Spruce: Bone + Sun (\`logo-dark\`). Oat: Ink one colour unless a sew-out of Ink + Rust passes. Moss, Rust: Bone one colour. Hex values are targets: match them on a thread card and approve from a sew-out.
`;
}
