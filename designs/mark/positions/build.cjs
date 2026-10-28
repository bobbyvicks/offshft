// Where should the W3 "Lume" hands sit so they fit the OFF SHFT wordmark?
// Renders the same hands at different times and placements, each as a full lockup.
// Run: node /home/user/offshft/designs/mark/positions/build.cjs
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, frame, f3, sh } = G;

const OUT = '/home/user/offshft/designs/mark/positions';
const C = [0, 0];
const INK = kit.T.ink, SUN = kit.T.sun;
const CAP = 7, FONT = 'xbold', TRACK = 0.14;
const STEM = kit.stem(FONT, CAP);

const tipLen = (s, angle) => s / Math.tan((angle / 2) * G.D2R);
const roof = (s, T, ang = 90) => poly([0, s], [T - tipLen(s, ang), s], [T, 0]);
function stadium(pb, F, t0, t1, r) {
  const a = F([t0 + r, -r]), b = F([t1 - r, -r]), c = F([t1 - r, r]), d = F([t0 + r, r]);
  pb.M(a).L(b).A(F([t1 - r, 0]), r, c, true).L(d).A(F([t0 + r, 0]), r, a, true).Z();
  return pb;
}

// W3 hands, drawn around (0,0) in mm. wall = outline thickness, slots = lume channels.
// minDeg/hrDeg are clock angles (degrees clockwise from 12).
function hands({ minDeg = 0, hrDeg = 150, Lm = 16.2, Lh = 10.2, wall = 1.3, slotM = 1.4, slotH = 2.0, R, Rhole = 1.5, lume = true }) {
  const mS = wall + slotM / 2, hS = wall + slotH / 2;
  const Rh = R === undefined ? Rhole + wall : R;
  const pb = handsOutline(new PathB(), C, Rh, [{ deg: minDeg, profile: roof(mS, Lm) }, { deg: hrDeg, profile: roof(hS, Lh) }]);
  circle(pb, C, Rhole);
  const glow = new PathB();
  for (const [deg, s, L, slot] of [[minDeg, mS, Lm, slotM], [hrDeg, hS, Lh, slotH]]) {
    const t0 = Rh + wall * 0.15, t1 = L - tipLen(s, 90) - wall * 0.15;
    if (t1 - t0 > slot) {
      stadium(pb, frame(C, deg), t0, t1, slot / 2);
      stadium(glow, frame(C, deg), t0, t1, slot / 2);
    }
  }
  const parts = [{ d: pb.str(), pts: pb.pts, fill: INK }];
  if (lume) parts.push({ d: glow.str(), pts: glow.pts, fill: SUN });
  return { parts, bb: G.bbox(pb.pts), R: Rh };
}

const place = (m, x, y, k = 1) => m.parts.map((p) => `<path fill="${p.fill}" fill-rule="evenodd" transform="translate(${f3(x)} ${f3(y)}) scale(${f3(k)})" d="${p.d}"/>`).join('');

// word set at baseline y, starting at x; optionally drop a letter (index) and close the gap
function word(x, y, { skip = -1, gapAfter = {} } = {}) {
  const str = 'OFF SHFT';
  let out = '', cx = x;
  const t0 = kit.text(str, { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const L = t0.letters;
  for (let i = 0; i < str.length; i++) {
    const adv = i < str.length - 1 ? L[i + 1].x - L[i].x : L[i].advance;
    if (i !== skip && str[i] !== ' ') out += kit.text(str[i], { font: FONT, cap: CAP, track: 0, fill: INK, x: cx, y }).svg;
    cx += adv + (gapAfter[i] || 0);
  }
  return { svg: out, letters: L, width: t0.width };
}

const PAD = 3;
const designs = [];
function add(slug, label, note, build) { designs.push({ slug, label, note, build }); }

// 1. As explored: big hands to the left, hub on the baseline.
add('1-now', 'Now (5:00)', 'W3 as drawn: the hands stand to the left of the name, about twice the letter height.', () => {
  const m = hands({});
  const k = (CAP * 2.15) / (m.bb.y1 - m.bb.y0);
  const base = PAD + -m.bb.y0 * k;
  const hubX = PAD - m.bb.x0 * k;
  const w = word(hubX + m.R * k + 5, base + (m.bb.y1 * k) - (m.bb.y1 - m.bb.y0) * k / 2 + CAP / 2);
  return { w: hubX + m.R * k + 5 + w.width + PAD, h: PAD * 2 + (m.bb.y1 - m.bb.y0) * k, body: place(m, hubX, base, k) + w.svg };
});

// 2. The hub ring IS the O in OFF. Hands at 5:00 come out of the O.
add('2-the-o', 'The O (5:00)', 'The ring at the centre of the hands becomes the O in OFF. The name and the clock are one thing.', () => {
  const t = kit.text('OFF SHFT', { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const O = t.letters[0];
  const R = (O.bottom - O.top) / 2;               // ring as tall as the O
  const wall = STEM * 1.05;                         // ring stroke matches the letters
  // solid hands (no lume at letter size), pointed, a touch heavier than the letter strokes
  const m = hands({ R, Rhole: R - wall, wall: STEM * 0.62, slotM: 0, slotH: 0, Lm: R + CAP * 0.9, Lh: R + CAP * 0.55, lume: false });
  const cy = PAD + -m.bb.y0;                        // ring centre
  const baseY = cy - (O.top + O.bottom) / 2;        // baseline that centres the ring on the O's height
  const cx = PAD + R;
  const shift = (O.x2 - O.x1) - 2 * R;              // the ring is narrower than the wide O
  const restX = cx - R + (t.letters[1].x - O.x1) - shift;
  const rest = kit.text('FF SHFT', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: restX, y: baseY });
  return { w: restX + rest.width + PAD, h: cy + m.bb.y1 + PAD, body: place(m, cx, cy) + rest.svg };
});

// 3. Between the words at 5:00: the hands are the space between OFF and SHFT.
add('3-between', 'Between the words (5:00)', 'The hands stand in the gap between OFF and SHFT, the minute hand the same height as the letters.', () => {
  const m = hands({ Lm: CAP * 1.0 + 1.6, Lh: CAP * 0.66 + 1.6, R: 1.6 + 0.0, Rhole: 0.75, wall: 0.85, slotM: 0, slotH: 0, lume: false });
  const t = kit.text('OFF', { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const gap = 3.2;
  const hubX = PAD + t.width + gap + m.R;
  const baseY = PAD + CAP;                         // hub on the baseline? no: put hub at baseline - R so it sits on the line
  const hubY = baseY - m.R;
  const off = kit.text('OFF', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: PAD, y: baseY });
  const shftX = hubX + m.bb.x1 + gap;
  const shft = kit.text('SHFT', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: shftX, y: baseY });
  return { w: shftX + shft.width + PAD, h: hubY + m.bb.y1 + PAD, body: off.svg + place(m, hubX, hubY) + shft.svg };
});

// 4. Letter height: pivot on the baseline, minute hand exactly the cap height, hour hand drops below like a descender.
add('4-letter-height', 'Letter height (5:00)', 'The hands are sized like a letter: minute hand as tall as OFF, hour hand dipping below the line.', () => {
  const m = hands({ Lm: CAP + 1.4, Lh: CAP * 0.62 + 1.4, R: 1.4, Rhole: 0.6, wall: 0.8, slotM: 0, slotH: 0, lume: false });
  const baseY = PAD + CAP;
  const hubX = PAD + m.R;
  const hubY = baseY - m.R;
  const w = word(hubX + m.bb.x1 + 3.0, baseY);
  return { w: hubX + m.bb.x1 + 3.0 + w.width + PAD, h: hubY + m.bb.y1 + PAD, body: place(m, hubX, hubY) + w.svg };
});

// 5. 6:00: hands make one straight line, a divider between the words.
add('5-six', 'Divider (6:00)', 'At 6:00 the hands make one straight line, so they work as a divider between OFF and SHFT.', () => {
  const m = hands({ minDeg: 0, hrDeg: 180, Lm: CAP * 1.0, Lh: CAP * 0.72, R: 1.9, Rhole: 0.85, wall: 0.95, slotM: 0, slotH: 0, lume: false });
  const t = kit.text('OFF', { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const baseY = PAD + -m.bb.y0 - CAP / 2 + CAP;    // hub on the middle of the cap height
  const hubY = baseY - CAP / 2;
  const gap = 3.4;
  const hubX = PAD + t.width + gap + m.R;
  const off = kit.text('OFF', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: PAD, y: baseY });
  const shftX = hubX + m.R + gap;
  const shft = kit.text('SHFT', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: shftX, y: baseY });
  return { w: shftX + shft.width + PAD, h: hubY + m.bb.y1 + PAD, body: off.svg + place(m, hubX, hubY) + shft.svg };
});

// 7. 10:10: the classic watch-advert position, a V that crowns the name.
add('7-ten-ten', 'Crown (10:10)', 'Watch ads always show 10:10 because the hands make a V that frames the brand. Here it sits above the name.', () => {
  const m = hands({ minDeg: 60, hrDeg: 305, Lm: 12.5, Lh: 8.6 });
  const k = 0.72;
  const t = kit.text('OFF SHFT', { font: FONT, cap: CAP, track: TRACK, x: 0, y: 0 });
  const W = t.width + PAD * 2;
  const hubX = PAD + t.width / 2, hubY = PAD + -m.bb.y0 * k;
  const baseY = hubY + m.bb.y1 * k + 3.2 + CAP;
  const w = kit.text('OFF SHFT', { font: FONT, cap: CAP, track: TRACK, fill: INK, x: PAD, y: baseY });
  return { w: W, h: baseY + PAD, body: place(m, hubX, hubY, k) + w.svg };
});

(async () => {
  const files = [];
  for (const d of designs) {
    const out = d.build();
    const svg = `${OUT}/${d.slug}.svg`;
    kit.writeSvg(svg, { w: out.w, h: out.h, body: out.body });
    const png = `${OUT}/${d.label.replace(/[^A-Za-z0-9:() ]/g, '')}.png`;
    await kit.render(svg, `${OUT}/${d.slug}.png`, { bg: kit.F.bone, tile: '120x56', px: 5 });
    files.push(`${OUT}/${d.slug}.png`);
    console.log(d.slug, f3(out.w), 'x', f3(out.h), 'mm');
  }
  await kit.close();
  // labelled sheet
  const labelled = designs.map((d) => [`${OUT}/${d.slug}.png`, d.label]);
  const args = [];
  for (const [f, l] of labelled) args.push('-label', l, f);
  sh('montage', [...args, '-tile', '2x', '-geometry', '600x280+10+10', '-pointsize', '22', '-background', '#d9d4c8', `${OUT}/sheet.png`]);
  console.log('sheet', `${OUT}/sheet.png`);
})().catch((e) => { console.error(e); process.exit(1); });
