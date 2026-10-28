// OFF SHFT mark exploration, direction "Built into the name" (T1-T4).
// Run: node /home/user/offshft/designs/mark/explore/type/build.cjs
// Writes T1..T4/{mark.svg, mark-dark.svg, lockup.svg, lockup-dark.svg, *.png}, sheet.png,
// and embroidery checks in _work/check (red = stroke < 1.2 mm, blue = gap < 1.2 mm).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { kit } = L;

const DIR = __dirname;
const T = kit.T, F = kit.F;
const RAD = Math.PI / 180;
const C30 = Math.cos(30 * RAD);
const kids = (item) => (item.children || [item]).slice().sort((a, b) => Math.abs(b.area) - Math.abs(a.area)).map((c) => c.clone({ insert: false }));
const scaleParts = (parts, s) => parts.map((p) => ({ ...p, item: L.scaled(p.item, s, 0, 0) }));
const recolour = (parts, fill) => parts.map((p) => ({ ...p, fill }));
const unionAll = (parts) => L.unite(parts.map((p) => p.item));
const fitLongest = (parts, mm) => { const b = L.bounds(unionAll(parts)); return scaleParts(parts, mm / Math.max(b.w, b.h)); };

// ---------- the hands ----------
// Minute hand at 0 deg, hour hand at 150 deg (exactly 5:00), flat perpendicular tips, joined
// with a clean mitre. cutY: cut the hour tip flat (horizontal) at that y, like a letter stroke
// standing on a baseline. hubR/hole: ring pivot.
function handsOutline(cx, cy, Lm, Lh, wm, wh) {
  const d = [Math.sin(150 * RAD), -Math.cos(150 * RAD)]; // (0.5, 0.866): down-right
  const nOut = [-d[1], d[0]]; // convex side of the bend (left/down)
  const nIn = [d[1], -d[0]];
  const P = (t, n) => [cx + t * d[0] + (wh / 2) * n[0], cy + t * d[1] + (wh / 2) * n[1]];
  const tOut = (-wm / 2 - (wh / 2) * nOut[0]) / d[0]; // where outer edge meets x = cx - wm/2
  const tIn = (wm / 2 - (wh / 2) * nIn[0]) / d[0]; //  where inner edge meets x = cx + wm/2
  return L.poly([[cx - wm / 2, cy - Lm], [cx + wm / 2, cy - Lm], P(tIn, nIn), P(Lh, nIn), P(Lh, nOut), P(tOut, nOut)]);
}
function hands(cx, cy, { Lm, Lh, wm, wh, hubR = 0, hole = 0, cutY = null }) {
  let u = handsOutline(cx, cy, Lm, cutY !== null ? Lh + wh : Lh, wm, wh);
  if (cutY !== null) u = L.intersect(u, L.rect(cx - 100, cy - 100, 200, cutY - (cy - 100)));
  if (hubR) u = L.unite(u, L.circle(cx, cy, hubR));
  if (hole) u = L.subtract(u, L.circle(cx, cy, hole));
  return u;
}

// Archivo Expanded SemiBold: its S apertures stay >= 1.2 mm from ~7.6 mm cap (Bold needs ~8.8 mm).
const WORD = { font: 'xsemi', track: 0.14 };
const CAP = 7.8; // one-line lockups are authored at their minimum embroidery size

// ============ T1  Dial O ============
// The O of OFF becomes a solid dial and the 5:00 hands are cut out of it (fabric shows through).
function dial(solid, { w, margin, ratio, drop }) {
  const b = L.bounds(solid);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2 + b.h * drop; // hub a touch low: optical centre
  const Lm = cy - b.y - margin, Lh = Lm * ratio;
  return L.subtract(solid, hands(cx, cy, { Lm, Lh, wm: w, wh: w * 1.08 }));
}
function T1() {
  const cap = CAP;
  const g = L.glyphs('OFF SHFT', { ...WORD, cap });
  const dialL = dial(kids(g[0].item)[0], { w: 1.3, margin: 1.3, ratio: 0.7, drop: 0.035 });
  const rest = L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item));
  // standalone mark drawn at 25 mm wide: hands = 10% of width
  const big = kids(L.text('O', { ...WORD, cap: 20 }).item)[0];
  const bb = L.bounds(big);
  const dialM = dial(L.scaled(big, 25 / bb.w, bb.x, bb.y), { w: 2.5, margin: 2.4, ratio: 0.66, drop: 0.035 });
  return {
    name: 'Dial O',
    concept: 'The O of OFF becomes a solid dial with the 5:00 hands cut out of it, so the clock sits right inside the name. On its own, the dial is the mark.',
    mark: [{ item: dialM, fill: T.rust }], markDark: [{ item: dialM, fill: T.sun }],
    lockup: [{ item: dialL, fill: T.rust }, { item: rest, fill: T.ink }],
    lockupDark: [{ item: dialL, fill: T.sun }, { item: rest, fill: T.bone }],
    threads: ['Rust #B4552D', 'Ink #1F2733'],
  };
}

// ============ T2  Clock Axis ============
// OFF sits at 9 o'clock, SHFT at 3; the hub sits on the text midline between the words.
function axisHands(cx, cy, cap, { w, R, hole, mK, ratio }) {
  const Lm = cap * mK;
  return hands(cx, cy, { Lm, Lh: Lm * ratio, wm: w, wh: w * 1.1, hubR: R, hole });
}
function T2() {
  const cap = CAP;
  const st = kit.stem(WORD.font, cap);
  const g = L.glyphs('OFF SHFT', { ...WORD, cap });
  const P = { w: 1.3, R: 1.85, hole: 0.625, mK: 1.3, ratio: 0.62 };
  const air = st * 1.7;
  const cx = g[2].x2 + air + P.R, cy = cap / 2;
  const hd = axisHands(cx, cy, cap, P);
  const hb = L.bounds(hd);
  // right gap is 1.25x the left: the hour hand eats into the space on the S side
  const sStart = cx + P.R + air * 1.25;
  const tipAtBase = cx + (cap / 2) * Math.tan(30 * RAD) + (P.w * 1.1 / 2) / C30;
  if (sStart - tipAtBase < 1.2) throw new Error('T2 hour hand too close to S');
  const off = L.unite(g.slice(0, 3).map((x) => x.item));
  const shft = L.moved(L.unite(g.slice(4).map((x) => x.item)), sStart - g[4].x1, 0);
  // mark: same clock, the words reduced to 9 and 3 ticks at letter-stem weight
  const M = { w: 2.3, R: 3.0, hole: 1.0, Lm: 14.5 };
  const hm = hands(0, 0, { Lm: M.Lm, Lh: M.Lm * P.ratio, wm: M.w, wh: M.w * 1.1, hubR: M.R, hole: M.hole });
  const tAir = 3.2, tickL = 4.4;
  const ticks = L.unite(L.bar(-M.R - tAir - tickL, 0, -M.R - tAir, 0, M.w * 1.1), L.bar(M.R + tAir, 0, M.R + tAir + tickL, 0, M.w * 1.1));
  const mark = fitLongest([{ item: L.unite(hm, ticks), fill: T.rust }], 25);
  return {
    name: 'Clock Axis',
    concept: 'OFF and SHFT sit where 9 and 3 would be, so the name itself is the clock face and the hands pivot on its midline between the words. The mark is the same clock with the words reduced to two ticks.',
    mark, markDark: recolour(mark, T.sun),
    lockup: [{ item: off, fill: T.ink }, { item: hd, fill: T.rust }, { item: shft, fill: T.ink }],
    lockupDark: [{ item: off, fill: T.bone }, { item: hd, fill: T.sun }, { item: shft, fill: T.bone }],
    threads: ['Ink #1F2733', 'Rust #B4552D'],
  };
}

// ============ T3  Big O ============
// An O-with-hands monogram that is also the first letter of OFF, set larger than the caps.
function clockO(H, { side, top, w, gapIn, drop = 0.06, ratio = 0.66 }) {
  const [outer] = kids(L.text('O', { font: WORD.font, cap: 10 }).item);
  const ob = L.bounds(outer);
  const O = L.scaled(outer, H / ob.h, ob.x, ob.y);
  const bb = L.bounds(O);
  const cx = bb.x + bb.w / 2, cy0 = bb.y + bb.h / 2;
  const inn = O.clone({ insert: false });
  inn.scale((bb.w - 2 * side) / bb.w, (bb.h - 2 * top) / bb.h, L.P(cx, cy0));
  const ib = L.bounds(inn);
  const cy = cy0 + ib.h * drop;
  const Lm = cy - ib.y - gapIn;
  // hour hand: as long as ratio allows, but keep gapIn clear of the counter edge
  let Lh = Lm * ratio;
  const clear = (len) => { const [x, y] = kit.polar(cx, cy, 150, len + gapIn); const [x2, y2] = kit.polar(x, y, 60, w * 0.55); return inn.contains(L.P(x, y)) && inn.contains(L.P(x2, y2)); };
  while (!clear(Lh) && Lh > 0.5) Lh -= 0.05;
  const hd = hands(cx, cy, { Lm, Lh, wm: w, wh: w * 1.08 });
  return { ring: L.subtract(O, inn), hands: hd, bb, cy0 };
}
function T3() {
  const cap = 7.4;
  const st = kit.stem(WORD.font, cap);
  const g = L.glyphs('OFF SHFT', { ...WORD, cap });
  const c = clockO(cap * 1.55 * 1.036, { side: st * 1.06, top: st * 0.9, w: 1.3, gapIn: 1.3 });
  const gap = st * 1.4;
  const dx = g[1].x1 - gap - (c.bb.x + c.bb.w), dy = cap / 2 - c.cy0;
  const rest = L.unite(g.slice(1).filter((x) => x.item).map((x) => x.item));
  const ring = L.moved(c.ring, dx, dy), hd = L.moved(c.hands, dx, dy);
  // standalone mark drawn at 25 mm wide: lighter ring, longer hands (optical size for 13-50 mm)
  const m = clockO(25 / 1.256, { side: 2.9, top: 2.5, w: 2.3, gapIn: 2.1 });
  const markOne = fitLongest([{ item: L.unite(m.ring, m.hands), fill: T.ink }], 25);
  return {
    name: 'Big O',
    concept: 'An O-with-hands monogram that is also the first letter of OFF, set larger than the caps like a drop initial. The monogram works alone on the side of a hat.',
    mark: markOne, markDark: recolour(markOne, T.bone),
    lockup: [{ item: ring, fill: T.ink }, { item: hd, fill: T.rust }, { item: rest, fill: T.ink }],
    lockupDark: [{ item: ring, fill: T.bone }, { item: hd, fill: T.sun }, { item: rest, fill: T.bone }],
    threads: ['Ink #1F2733', 'Rust #B4552D'],
  };
}

// ============ T4  Grid Lock ============
// The hands set the type: the minute hand is one line pitch (OFF cap line to SHFT cap line),
// the hub sits on SHFT's cap line, the hour hand ends on SHFT's baseline, and SHFT steps right
// to clear it.
function gridHands(cx, cy, cap, lead, { w, R, hole }) {
  return hands(cx, cy, { Lm: cap + lead, Lh: cap / C30, wm: w, wh: w * 1.1, hubR: R, hole, cutY: cy + cap });
}
function T4() {
  const cap = CAP;
  const st = kit.stem(WORD.font, cap);
  const lead = cap * 0.62;
  const P = { w: 1.4, R: 2.0, hole: 0.625 };
  const cy = cap + lead; // hub on SHFT cap line; OFF cap line at y = 0
  const hd = gridHands(0, cy, cap, lead, P);
  const gap = st * 1.45;
  const a = L.text('OFF', { ...WORD, cap, x: 0, y: cap });
  const offItem = L.moved(a.item, P.w / 2 + gap - a.letters[0].x1, 0);
  const b = L.text('SHFT', { ...WORD, cap, x: 0, y: cap * 2 + lead });
  // measure the gap to the hour hand at 1/3 of SHFT's height above its baseline
  const yRef = cy + cap * (2 / 3);
  const xHand = (yRef - cy) * Math.tan(30 * RAD) + (P.w * 1.1 / 2) / C30;
  const shItem = L.moved(b.item, xHand + gap * 1.05 - b.letters[0].x1, 0);
  // mark: the hands alone at 25 mm tall, hole opened up so it survives at 13 mm
  const markRaw = gridHands(0, 0, cap, lead, { w: P.w, R: P.R, hole: 0 });
  const k = 25 / L.bounds(markRaw).h;
  const markHands = gridHands(0, 0, cap * k, lead * k, { w: P.w * k * 1.1, R: P.R * k * 1.05, hole: 1.25 });
  const mark = [{ item: markHands, fill: T.rust }];
  return {
    name: 'Grid Lock',
    concept: 'The hands set the type. The minute hand is exactly one line pitch tall, the hub sits on the cap line of SHFT, and the hour hand ends on its baseline, so OFF and SHFT stack against the hands as one block.',
    mark, markDark: recolour(mark, T.sun),
    lockup: [{ item: hd, fill: T.rust }, { item: offItem, fill: T.ink }, { item: shItem, fill: T.ink }],
    lockupDark: [{ item: hd, fill: T.sun }, { item: offItem, fill: T.bone }, { item: shItem, fill: T.bone }],
    threads: ['Rust #B4552D', 'Ink #1F2733'],
  };
}

// ---------------- output ----------------
async function main() {
  const only = process.argv[2];
  const all = { T1, T2, T3, T4 };
  const ids = only ? only.split(',') : Object.keys(all);
  const sheetDir = path.join(DIR, '_sheet');
  fs.mkdirSync(sheetDir, { recursive: true });
  const report = {};
  for (const id of ids) {
    const v = all[id]();
    const d = path.join(DIR, id);
    fs.mkdirSync(d, { recursive: true });
    const mk = L.writeArt(path.join(d, 'mark.svg'), v.mark);
    L.writeArt(path.join(d, 'mark-dark.svg'), v.markDark);
    const lk = L.writeArt(path.join(d, 'lockup.svg'), v.lockup);
    L.writeArt(path.join(d, 'lockup-dark.svg'), v.lockupDark);
    await kit.render(path.join(d, 'mark.svg'), path.join(d, 'mark.png'), { bg: F.bone });
    await kit.render(path.join(d, 'mark-dark.svg'), path.join(d, 'mark-dark.png'), { bg: F.slate });
    await kit.render(path.join(d, 'lockup.svg'), path.join(d, 'lockup.png'), { bg: F.bone });
    await kit.render(path.join(d, 'lockup-dark.svg'), path.join(d, 'lockup-dark.png'), { bg: F.slate });
    await kit.sizes(path.join(d, 'mark.svg'), path.join(d, 'sizes.png'), { bg: F.bone });
    const wk = path.join(DIR, '_work', 'check');
    fs.mkdirSync(wk, { recursive: true });
    const cm = await L.check(path.join(d, 'mark.svg'), path.join(wk, `${id}-mark25.png`), { targetMm: 25 });
    const cl = await L.check(path.join(d, 'lockup.svg'), path.join(wk, `${id}-lockup.png`), { targetMm: Math.max(lk.w, lk.h) });
    report[id] = { name: v.name, mark: mk, lockup: lk, checkMark: cm, checkLockup: cl };
    for (const k of ['mark', 'mark-dark', 'lockup', 'sizes']) fs.copyFileSync(path.join(d, `${k}.png`), path.join(sheetDir, `${id}-${k}.png`));
  }
  const sheetFiles = [];
  for (const id of Object.keys(all)) for (const k of ['mark', 'mark-dark', 'lockup', 'sizes']) {
    const f = path.join(sheetDir, `${id}-${k}.png`);
    if (fs.existsSync(f)) sheetFiles.push(f);
  }
  execFileSync('montage', ['-label', '%t', ...sheetFiles, '-tile', '4x', '-geometry', '440x256+8+8', '-pointsize', '18', '-background', '#888888', path.join(DIR, 'sheet.png')]);
  console.log(JSON.stringify(report));
  await L.closeAll();
}
main().catch((e) => { console.error(e); process.exit(1); });
