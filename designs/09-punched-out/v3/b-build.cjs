// OFF SHFT design 09, "Punched Out.", v3: designer B's versions, tied to the logo without adding anything new.
//
// clock-o     PUNCHED over OUT., flush left. The O of OUT is the logo's clock O at the logo's cap height (7 mm),
//             made by the logo's own code in designs/mark/final/the-o/build.cjs: lockup() gives the geometry and
//             clockO() draws it. Ring, walls, channel, hands at 5:00 and pivot dot are the O of OFF SHFT, path for
//             path (checked against lockup()'s own output on every run). The full stop is the font's plain full stop.
// clock-stop  PUNCHED OUT. with a tiny clock as the full stop. Not made: no clock that small stitches. This script
//             prints the numbers (the smallest clock that stitches against the full stop) and writes no files for it.
//
// Type: Unbounded Bold, all caps, cap 7 mm, letter-spacing 0.12 em, each letter one merged outline (glyphMM from
// build.cjs). Kerning: the font's own pairs only. opentype.js 1.3.4 can't read Unbounded's kerning (it sits in GPOS
// extension lookups), so the one kerned pair in this text, T-period, is listed in FONT_KERN with the font's value.
// The E is Unbounded's own E, pinched stem included (same outline as the official 700 instance).
// Layout:
// - The clock O starts the second line, as it starts OFF in the logo. Its ring overshoots the P's stem on the left
//   by the font's own round overshoot (O against P side bearings), so the left edge reads straight.
// - The U follows the ring at the font's O-to-U gap (the logo spaces its O from the F the same way).
// - The minute hand's tip sits that same letter gap below PUNCHED's baseline.
//
// Run from /home/user/offshft/tools:  node ../designs/09-punched-out/v3/b-build.cjs
// Writes clock-o-light.svg (Ink + Rust), clock-o-dark.svg (Bone + Sun) and clock-o-proof.png: true size on a
// 110 x 80 mm Bone swatch, kit.render at 8 px per mm like the logo's true-size proofs (kit shoots at 2x, so the
// file is 1760 x 1280). Prints the measurements.

'use strict';
const fs = require('fs');
const path = require('path');
const Module = require('module');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const OUT = __dirname;
const LOGO_BUILD = '/home/user/offshft/designs/mark/final/the-o/build.cjs';

// build.cjs exports lockup(), glyphMM() and the colourways but keeps clockO() and hand() private. Rather than copy
// them, load build.cjs's own source with those two exposed. build.cjs is not changed, and its outputs block does
// not run (it only runs when build.cjs is the main script).
function loadLogoBuild() {
  const m = new Module(LOGO_BUILD, module);
  m.filename = LOGO_BUILD;
  m.paths = Module._nodeModulePaths(path.dirname(LOGO_BUILD));
  m._compile(`${fs.readFileSync(LOGO_BUILD, 'utf8')}\nmodule.exports.clockO = clockO;\nmodule.exports.hand = hand;\n`, LOGO_BUILD);
  return m.exports;
}
const logo = loadLogoBuild();
const A = logo.FONTS.unbounded;
const CAP = 7;
const UNIT = CAP / kit.font(A.key).tables.os2.sCapHeight;   // mm per font unit at cap 7
const FONT_KERN = { 'T.': -128 };                            // font units, from Unbounded's GPOS kern feature

const n = (v) => (Math.round(v * 1000) / 1000).toString();
const f2 = (v) => v.toFixed(2);
const box = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
const move = (b, dx, dy) => ({ x0: b.x0 + dx, y0: b.y0 + dy, x1: b.x1 + dx, y1: b.y1 + dy });
const letters = (str) => kit.text(str, { font: A.key, cap: CAP, track: A.track, x: 0, y: 0 }).letters;

// ---------------------------------------------------------------- measuring (for the report)
// glyphMM's path data is straight segments only (M x y L x y ... Z); turn it back into polygons.
const polysOf = (d) => d.split('M').filter((s) => s.trim()).map((s) => s.replace('Z', '').split(' L').map((p) => p.trim().split(' ').map(Number)));
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
  const t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
// Smallest distance between two sets of outlines (vertex to edge, both ways).
function gap(P, Q) {
  let best = Infinity;
  for (const [S, T] of [[P, Q], [Q, P]]) for (const s of S) for (const p of s) for (const t of T) for (let i = 0; i < t.length; i++) best = Math.min(best, segDist(p, t[i], t[(i + 1) % t.length]));
  return best;
}
// Where a vertical line x crosses a set of outlines (sorted y values).
function crossX(polys, x) {
  const out = [];
  for (const p of polys) for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; if ((a[0] - x) * (b[0] - x) < 0) out.push(a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])); }
  return out.sort((a, b) => a - b);
}

// ---------------------------------------------------------------- type
// A run of letters, each one merged outline, left pen position x, baseline baseY.
function word(str, x, baseY) {
  const t = letters(str);
  let shift = 0, d = '';
  const glyphs = [];
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && FONT_KERN[str[i - 1] + str[i]]) shift += FONT_KERN[str[i - 1] + str[i]] * UNIT;
    const g = logo.glyphMM(A, str[i], x + t[i].x + shift, baseY, CAP);
    d += `${g.d} `;
    glyphs.push({ ch: str[i], polys: polysOf(g.d), box: box(g.pts) });
  }
  return { d: d.trim(), glyphs, box: glyphs.map((g) => g.box).reduce(union) };
}

// ---------------------------------------------------------------- clock-o
function clockOVersion(colours) {
  // The logo at cap 7, exactly as build.cjs makes it; its O's geometry is G.
  const L = logo.lockup(A, CAP, colours, { oneColour: false });
  const G = L.G;
  if (Math.abs(G.R - (G.O.bottom - G.O.top) / 2) > 1e-9 || !G.dot) throw new Error('the lockup O is not the letter-size two-colour O (is O_SCALE set?)');
  const clock = logo.clockO(G, 0, 0, { ring: colours.letters, hands: colours.hands }, 'outside');
  if (!L.body.includes(clock.svg)) throw new Error('this clock O is not path for path the O in the logo');

  const tOUT = letters('OUT.'), tP = letters('P')[0];
  const gapO = tOUT[1].x1 - tOUT[0].x2;                              // the font's own O-to-U gap
  const overshoot = (tP.x1 - tP.x) - (tOUT[0].x1 - tOUT[0].x);       // how far the font's O sits left of a straight stem

  const top = word('PUNCHED', 0, 0);                                 // baseline at y = 0, y runs down
  const cx = top.box.x0 - overshoot + G.R;
  const cy = gapO + G.Lm;                                            // minute-hand tip one letter gap below the baseline
  const baseY = cy - (G.O.top + G.O.bottom) / 2;                     // ring centred on the font's O, as in the logo
  const rest = word('UT.', cx + G.R + gapO - (tOUT[1].x1 - tOUT[1].x), baseY);

  const b = [top.box, rest.box, move(clock.box, cx, cy)].reduce(union);
  const body = `<g transform="translate(${n(-b.x0)} ${n(-b.y0)})">`
    + `<path fill="${colours.letters}" fill-rule="evenodd" d="${top.d} ${rest.d}"/>`
    + `<g transform="translate(${n(cx)} ${n(cy)})">${clock.svg}</g></g>`;

  // ---- measurements
  const handPolys = (deg, len, s) => [logo.hand(cx, cy, deg, G.R + G.g, len, s).pts];
  const minute = handPolys(0, G.Lm, G.sM), hour = handPolys(150, G.Lh, G.sH);
  const U = rest.glyphs[0], T = rest.glyphs[1], stop = rest.glyphs[2];
  // 6-panel caps, design centred: what the centre seam runs through, and the narrowest fabric it crosses there.
  const centre = (b.x0 + b.x1) / 2;
  const hit = top.glyphs.find((g) => centre > g.box.x0 && centre < g.box.x1);
  const ys = hit ? crossX(hit.polys, centre) : [];
  const fabric = [];
  for (let i = 1; i + 1 < ys.length; i += 2) fabric.push(ys[i + 1] - ys[i]);
  const seam = {
    letter: hit ? hit.ch : 'gap', offCentre: hit ? centre - (hit.box.x0 + hit.box.x1) / 2 : 0, narrowest: fabric.length ? Math.min(...fabric) : 0,
    toLetterRight: hit ? hit.box.x1 - centre : 0, clearOfLine2: centre - Math.max(move(clock.box, cx, cy).x1, rest.box.x1),
  };
  const E = top.glyphs[5], C = top.glyphs[3];
  const eY = crossX(E.polys, E.box.x0 + (E.box.x1 - E.box.x0) * 0.75), cY = crossX(C.polys, C.box.x0 + (C.box.x1 - C.box.x0) * 0.9);
  const m = {
    w: b.x1 - b.x0, h: b.y1 - b.y0, G, dot: clock.dot, gapO, overshoot, seam,
    minuteToPunched: gap(minute, top.glyphs.flatMap((g) => g.polys)), hourToU: gap(hour, U.polys),
    lineGap: baseY - CAP,                                              // PUNCHED's baseline to the cap line of OUT.
    tStop: stop.box.x0 - T.box.x1, stop: [stop.box.x1 - stop.box.x0, stop.box.y1 - stop.box.y0],
    eSlots: [eY[2] - eY[1], eY[4] - eY[3]],                            // between the E's arms, at 3/4 of its width
    cAperture: cY[2] - cY[1],                                          // between the C's terminals
  };
  return { w: m.w, h: m.h, body, m };
}

// ---------------------------------------------------------------- clock-stop: the smallest clock that stitches
function clockStopCheck() {
  const stop = box(logo.glyphMM(A, '.', 0, 0, CAP).pts);
  const side = logo.smallMaster(logo.LIGHT);                         // notes.md: under 19 mm, the side master only
  const L66 = logo.lockup(A, 6.6, logo.LIGHT);                       // the smallest O the lockup allows (no dot)
  return { stop: [stop.x1 - stop.x0, stop.y1 - stop.y0], side: [side.w, side.h, 2 * side.G.R], o66: [2 * L66.G.R, L66.h] };
}

// ---------------------------------------------------------------- outputs
(async () => {
  const write = (name, d) => kit.writeSvg(path.join(OUT, name), d);
  const light = clockOVersion(logo.LIGHT), dark = clockOVersion(logo.DARK);
  const fLight = write('clock-o-light.svg', light);
  write('clock-o-dark.svg', dark);
  const TILE = [110, 80];
  if (light.w > TILE[0] * 0.8 || light.h > TILE[1] * 0.7) throw new Error('kit.render would shrink the proof; it must be true size');
  await kit.render(fLight, path.join(OUT, 'clock-o-proof.png'), { bg: kit.F.bone, tile: TILE.join('x'), px: 8 });
  await kit.close();

  const m = light.m, G = m.G, s = clockStopCheck(), sm = m.seam;
  console.log(`clock-o: ${f2(m.w)} x ${f2(m.h)} mm at cap ${CAP} (the logo: 62.64 x 18.04 mm)
  O = the logo's O at cap 7: ring ${f2(2 * G.R)} mm, walls ${f2(G.R - G.rx)} / ${f2(G.R - G.ry)} mm, channel ${f2(G.g)} mm, minute hand ${f2(2 * G.sM)} x ${f2(G.Lm - G.R - G.g)} mm, hour hand ${f2(2 * G.sH)} x ${f2(G.Lh - G.R - G.g)} mm, dot ${f2(m.dot)} mm with ${f2(G.rx - m.dot / 2)} mm of fabric
  ring overshoots the P's stem by ${f2(m.overshoot)} mm; ring to U ${f2(m.gapO)} mm; minute-hand tip ${f2(m.gapO)} mm below PUNCHED (nearest letter ${f2(m.minuteToPunched)} mm); hour hand to U ${f2(m.hourToU)} mm; PUNCHED baseline to OUT. cap line ${f2(m.lineGap)} mm
  T to full stop ${f2(m.tStop)} mm (font kern ${FONT_KERN['T.']} units = ${f2(FONT_KERN['T.'] * UNIT)} mm); full stop ${f2(m.stop[0])} x ${f2(m.stop[1])} mm
  E slots ${m.eSlots.map(f2).join(' / ')} mm; C aperture ${f2(m.cAperture)} mm
  6-panel caps, centred: the seam runs ${f2(Math.abs(sm.offCentre))} mm off the middle of the ${sm.letter}, crossing nothing narrower than ${f2(sm.narrowest)} mm (the ${sm.letter}'s right side, where its aperture is, is ${f2(sm.toLetterRight)} mm away), and passes ${f2(sm.clearOfLine2)} mm right of the second line
clock-stop: not made. The full stop at cap ${CAP} is ${f2(s.stop[0])} x ${f2(s.stop[1])} mm. The smallest clock that stitches is the side master, ${f2(s.side[0])} x ${f2(s.side[1])} mm with a ${f2(s.side[2])} mm ring (notes.md: under 19 mm, the side master only; never scale down); the smallest letter-size clock O is ${f2(s.o66[0])} mm across and ${f2(s.o66[1])} mm tall with its hands (cap 6.6, no dot). Both are more than ${Math.floor((Math.min(s.side[1], s.o66[1]) / CAP) * 10) / 10} times the cap height, so neither can be a full stop. The pivot dot alone has a 1.5 mm minimum.`);
})().catch((e) => { console.error(e); process.exit(1); });
