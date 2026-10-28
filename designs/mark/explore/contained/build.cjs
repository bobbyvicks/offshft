// OFF SHFT - direction "Contained mark". Builds C1..C4: marks, lockups, renders, checks and the sheet.
//   node build.cjs              build everything
//   node build.cjs C2 C3        build only some variants (sheet is rebuilt from what exists)
//   node build.cjs --work       also write close-up critique renders to _work/
//
// SYSTEM (all variants). Marks are drawn at real front-of-hat size: 25 mm on the longest side.
//   U  = 2.4 mm  module = minute-hand width = thread bridge between the minute tip and the edge
//   HW = 1.3 U   hour-hand width: the short hand is visibly heavier (clock hierarchy; at equal width the
//                diagonal reads thinner and the pair reads as one bent stick)
//   Lh = Lm / phi  hour-hand length
//   Lm = 12.5 - 1.5U = 8.9 mm: on a 25 mm dial the minute tip stops one module from the rim.
//   The hands are ONE fixed drawing in all four variants; only the container changes.
//   Every knockout and every thread bridge is >= U, so at 13 mm (x0.52) all features stay >= 1.25 mm:
//   one artwork serves 13 mm to 50 mm, no simplified small version needed.
//   Lockups: the mark is scaled so its knocked-out minute hand equals the wordmark's stem width.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const G = require('/home/user/offshft/designs/mark/explore/contained/lib.cjs');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT = '/home/user/offshft/designs/mark/explore/contained';
const WORK = `${ROOT}/_work/build`;
const { T, F } = kit;
const U = 2.4;
const HW = 1.3 * U;            // 3.12: the hour hand is the short, heavy hand
const PHI = (1 + Math.sqrt(5)) / 2;
const WM = { font: 'xbold', cap: 6, track: 0.18 };   // wordmark: Archivo Expanded Bold, 0.18 em tracking
const LM = 12.5 - 1.5 * U;      // 8.9: on a 25 mm dial the minute tip stops one module from the rim
const FIG = LM + U / 2 + (LM / PHI) * Math.cos(30 * Math.PI / 180) + HW / 2; // height of the hands figure
const args = process.argv.slice(2);
const WANT_WORK = args.includes('--work');
const ONLY = args.filter((a) => /^C\d$/.test(a));

// Hands: minute up, hour at 150 degrees (5:00 exactly). Tangent elbow, round tips.
function handsAt(H, Lm, o = {}) {
  const boost = o.boost || 0; // widen knockouts (dark-fabric version)
  return G.hands({ H, Lm, wm: U + boost, Lh: o.Lh || Lm / PHI, wh: HW + boost, elbow: 'tangent' });
}
// Grow the minute hand until the thinnest thread bridge equals `bridge`.
function fitHands(container, H, o = {}) {
  const bridge = o.bridge || U;
  let lo = 2, hi = 30;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const d = G.minDist(container.pts, handsAt(H, mid, o).pts).d;
    if (d > bridge) lo = mid; else hi = mid;
  }
  return lo;
}
const pathOf = (...ps) => ({ d: ps.map((p) => p.d).join(''), pts: ps.flatMap((p) => p.pts) });

// ---------------------------------------------------------------------------------------------
const V = {};

// C1 SUNDOWN - the dial is a low sun: a disc cut flat by the horizon, one module below the hour tip.
V.C1 = {
  name: 'Sundown',
  concept: 'A low sun sitting on the horizon, with the hands knocked out at 5:00. Quitting time and the evening on the water in one shape; the flat base also sits squarely on the wordmark baseline.',
  light: T.rust, dark: T.sun, text: T.ink,
  geom(o = {}) {
    const R = 12.5, H = [R, R];
    const Lm = LM, Lh = Lm / PHI;
    const tipLow = Lh * Math.cos(30 * G.DEG) + (HW + (o.boost || 0)) / 2;
    // The horizon is cut one cap-height below the hub (in lockup scale, where minute hand = wordmark stem):
    // in the lockup the flat base sits on the baseline and the hub sits exactly on the cap line.
    const cut = o.cutBridge ? tipLow + o.cutBridge : (U * WM.cap) / kit.stem(WM.font, WM.cap);
    const c = G.flatDisc(H, R, cut, U / 2);
    return { w: 2 * R, h: R + cut, c, k: handsAt(H, Lm, o), H, Lm, Lh, cy: R, note: `cut ${cut.toFixed(2)} below centre, ${(cut - tipLow).toFixed(2)} below hour tip` };
  },
  lockAlign: 'baseline',
};

// C2 NUT - a hex nut seen from above: a pointy-top hexagon whose corners are turned off by a circle
// (the chamfer of a real nut). Minute hand aims at a corner, hour hand square to a flat.
V.C2 = {
  name: 'Nut',
  concept: 'A hex nut seen from above, corners turned off like a real chamfered nut, with the hands knocked out. A trades nod: the hour hand meets a flat square on, the minute hand points into a corner.',
  light: T.ink, dark: T.bone, text: T.ink,
  geom(o = {}) {
    const k = o.chamfer || 0.96;                // chamfer circle radius / corner radius
    const Rcut = 12.5;                          // height = 25 (top and bottom are chamfer arcs)
    const Rc = Rcut / k, ap = Rc * Math.cos(30 * G.DEG);
    const H = [ap, Rcut];
    const c = hexChamfer(H, Rc, Rcut);
    const Lm = LM;
    return { w: 2 * ap, h: 2 * Rcut, c, k: handsAt(H, Lm, o), H, Lm, Lh: Lm / PHI, cy: Rcut, note: `Rc ${Rc.toFixed(2)} chamfer R ${Rcut}` };
  },
  lockAlign: 'center',
};
function hexChamfer(H, Rc, Rcut) {
  // pointy-top hexagon (vertices at 0, 60, ... deg) intersected with a concentric circle of radius Rcut
  const ap = Rc * Math.cos(30 * G.DEG);
  const half = Math.sqrt(Rcut * Rcut - ap * ap);     // half-length of the straight part of each flat
  const p = new G.PathB();
  // flats have outward normals at 30, 90, 150, 210, 270, 330 deg; walk clockwise on screen
  const flats = [30, 90, 150, 210, 270, 330];
  flats.forEach((nd, i) => {
    const mid = G.polar(H, nd, ap);
    const t = G.dir(nd + 90);                         // along the flat, clockwise
    const a = G.add(mid, G.mul(t, -half)), b = G.add(mid, G.mul(t, half));
    if (i === 0) p.M(a); else p.A(a, H, true);
    p.L(b);
  });
  p.A(G.add(G.polar(H, 30, ap), G.mul(G.dir(120), -half)), H, true);
  return p.Z();
}

// C3 TICKET - an admission ticket (concave corners). The hands sit on the centre line, one module from top and bottom.
V.C3 = {
  name: 'Ticket',
  concept: 'An old admission ticket with punched-out corners, the hands knocked out at 5:00: your ticket out. Red raffle ticket on light fabric, golden ticket on dark; the landscape shape suits the side of a hat and a woven label.',
  light: T.rust, dark: T.sun, text: T.ink,
  geom(o = {}) {
    const b0 = o.bridge || U;
    const Wd = 25, Ht = o.ht || FIG + 2 * b0, rk = o.rk || 1.5 * U;
    const c = new G.PathB();
    c.M([rk, 0]).L([Wd - rk, 0]).A([Wd, rk], [Wd, 0], false).L([Wd, Ht - rk]).A([Wd - rk, Ht], [Wd, Ht], false)
      .L([rk, Ht]).A([0, Ht - rk], [0, Ht], false).L([0, rk]).A([rk, 0], [0, 0], false).Z();
    // the hands figure is centred: one module of thread above the minute tip and below the hour tip
    const Lm = LM;
    const H = [Wd / 2, (Ht - FIG) / 2 + U / 2 + Lm];
    return { w: Wd, h: Ht, c, k: handsAt(H, Lm, o), H, Lm, Lh: Lm / PHI, cy: Ht / 2, note: `hub at ${(H[1] / Ht * 100).toFixed(0)}% height` };
  },
  lockAlign: 'center',
};

// C4 LABEL - a woven-label tile; hands stitched in a contrast thread (one-colour fallback: knocked out).
V.C4 = {
  name: 'Label',
  concept: 'A square woven label with the hands stitched in a contrast thread, the way a workwear tag is made. The most practical of the four: a side-of-hat tab, a sewn-in label and a social avatar as-is.',
  light: T.ink, dark: T.bone, two: { light: [T.ink, T.sun], dark: [T.bone, T.rust] }, text: T.ink,
  geom(o = {}) {
    const S = o.S || 21.5, r = o.r || U / 2;    // tile just big enough for ~1 module above and below the fixed hands
    const c = G.roundedPoly([[0, 0], [S, 0], [S, S], [0, S]], r);
    // as C3: the hands figure is centred vertically in the tile
    const Lm = LM;
    const H = [S / 2, (S - FIG) / 2 + U / 2 + Lm];
    // k2: the contrast-thread hands, 0.1 mm fuller (light-on-dark knockouts read bolder than stitched mid-tones)
    return { w: S, h: S, c, k: handsAt(H, Lm, o), k2: handsAt(H, Lm, { boost: 0.1 }), H, Lm, Lh: Lm / PHI, cy: S / 2, note: `hub at ${(H[1] / S * 100).toFixed(0)}% height` };
  },
  lockAlign: 'center',
};

// ---------------------------------------------------------------------------------------------
// SVG bodies
function markBody(g, fill, two) {
  if (two) return `<path fill="${two[0]}" d="${g.c.d}"/><path fill="${two[1]}" d="${(g.k2 || g.k).d}"/>`;
  return `<path fill="${fill}" fill-rule="evenodd" d="${g.c.d}${g.k.d}"/>`;
}
const place = (body, x, y, s) => `<g transform="translate(${G.f3(x)} ${G.f3(y)}) scale(${+s.toFixed(5)})">${body}</g>`;

// Lockup: mark scaled so its minute hand = wordmark stem; gap = the wordmark's own word space x gapK.
function lockup(v, o = {}) {
  const font = o.font || WM.font, cap = o.cap || WM.cap, track = o.track ?? WM.track;
  const stem = kit.stem(font, cap);
  const g = v.geom();
  const s = stem / U;
  const probe = kit.text('OFF SHFT', { font, cap, track, x: 0, y: cap });
  const L = probe.letters;
  const word = L[4].x1 - L[2].x2;                  // F to S, ink to ink
  const gap = word * (o.gapK || 1);
  const mw = g.w * s, mh = g.h * s;
  let my, base;
  const align = o.align || v.lockAlign;
  if (align === 'baseline') {                       // flat base sits on the baseline
    base = mh; my = 0;
  } else {                                          // mark centre on the cap-height centre
    const top = Math.max(0, (cap - mh) / 2);
    my = top; base = my + g.cy * s + cap / 2;
  }
  // optical gap: measured at the cap-band midline, where the O is widest (matters for round marks)
  const yMid = (base - cap / 2 - my) / s;           // midline in mark design units
  const edge = Math.max(...g.c.pts.filter((p) => Math.abs(p[1] - yMid) < 0.08).map((p) => p[0])) * s;
  const tx = edge + gap - (L[0].x1 - probe.x0);
  const t = kit.text('OFF SHFT', { font, cap, track, x: tx, y: base, fill: o.textFill || v.text });
  const tw = t.letters.at(-1).x2;
  const h = Math.max(mh + my, base + 0.15);
  const body = place(markBody(g, o.markFill || v.light, o.two), 0, my, s) + t.svg;
  return { w: tw, h, body, info: { font, cap, track, align, stem: stem.toFixed(3), scale: s.toFixed(4), markH: mh.toFixed(2), gap: gap.toFixed(2), width: tw.toFixed(1) } };
}

// ---------------------------------------------------------------------------------------------
// Checks: thinnest thread bridge (container edge to knockout) and knockout widths, at 25 mm and 13 mm.
function check(id, g) {
  const sc = 25 / Math.max(g.w, g.h);
  const bridge = G.minDist(g.c.pts, g.k.pts).d * sc;
  const knock = Math.min(U, HW) * sc;
  const thin = Math.min(bridge, knock);
  return { id, size: `${(g.w * sc).toFixed(2)} x ${(g.h * sc).toFixed(2)} mm`, minuteLen25: (g.Lm * sc).toFixed(2), hourLen25: (g.Lh * sc).toFixed(2), bridge25: +bridge.toFixed(2), knockout25: +knock.toFixed(2), thinnest25: +thin.toFixed(2), thinnest13: +(thin * 13 / 25).toFixed(2), note: g.note };
}

async function buildVariant(id) {
  const v = V[id];
  const dir = `${ROOT}/${id}`;
  fs.mkdirSync(dir, { recursive: true });
  const g = v.geom();
  const gd = v.geom(v.two ? {} : { boost: 0.1 });  // dark fabric: knockouts 0.1 mm wider (thread spreads, dark gaps read thinner)
  const w = g.w, h = g.h;
  kit.writeSvg(`${dir}/mark.svg`, { w, h, body: markBody(g, v.light) });
  kit.writeSvg(`${dir}/mark-dark.svg`, { w: gd.w, h: gd.h, body: markBody(gd, v.dark, v.two && v.two.dark) });
  const lk = lockup(v, { two: v.two && v.two.light });
  kit.writeSvg(`${dir}/lockup.svg`, { w: lk.w, h: lk.h, body: lk.body });
  if (v.two) kit.writeSvg(`${dir}/mark-2thread.svg`, { w, h, body: markBody(g, null, v.two.light) });
  await kit.render(`${dir}/mark.svg`, `${dir}/mark.png`, { bg: F.bone });
  await kit.render(`${dir}/mark-dark.svg`, `${dir}/mark-dark.png`, { bg: F.slate });
  await kit.render(`${dir}/lockup.svg`, `${dir}/lockup.png`, { bg: F.bone });
  await kit.sizes(`${dir}/mark.svg`, `${dir}/sizes.png`, { bg: F.bone });
  const c = check(id, g);
  console.log(JSON.stringify(c), '\n   lockup', JSON.stringify(lk.info));
  if (WANT_WORK) await workRenders(id, v);
  return c;
}

// Close-up renders for critique (not deliverables).
async function workRenders(id, v) {
  fs.mkdirSync(WORK, { recursive: true });
  const dir = `${ROOT}/${id}`;
  await kit.render(`${dir}/mark.svg`, `${WORK}/${id}-big.png`, { bg: F.bone, width: 25, px: 14, tile: '34x30' });
  await kit.render(`${dir}/mark-dark.svg`, `${WORK}/${id}-bigdark.png`, { bg: F.slate, width: 25, px: 14, tile: '34x30' });
  await kit.render(`${dir}/mark.svg`, `${WORK}/${id}-13.png`, { bg: F.bone, width: 13, px: 14, tile: '20x18' });
  await kit.render(`${dir}/lockup.svg`, `${WORK}/${id}-lock.png`, { bg: F.bone, px: 8, tile: '96x30' });
  for (const [fab, name] of [[F.oat, 'oat'], [F.moss, 'moss'], [F.spruce, 'spruce'], [F.rust, 'rust']]) {
    const light = fab === F.oat;
    const file = `${WORK}/${id}-${name}.svg`;
    const g = v.geom(light ? {} : { boost: 0.1 });
    const body = v.two ? markBody(g, null, light ? v.two.light : v.two.dark) : markBody(g, light ? v.light : v.dark);
    kit.writeSvg(file, { w: g.w, h: g.h, body });
    await kit.render(file, `${WORK}/${id}-${name}.png`, { bg: fab, tile: '34x30', px: 6 });
  }
}

async function sheet() {
  const ids = Object.keys(V).filter((id) => fs.existsSync(`${ROOT}/${id}/mark.png`));
  const tmp = `${ROOT}/_work/sheet`;
  fs.mkdirSync(tmp, { recursive: true });
  const files = [];
  for (const id of ids) for (const n of ['mark', 'mark-dark', 'lockup', 'sizes']) {
    fs.copyFileSync(`${ROOT}/${id}/${n}.png`, `${tmp}/${id}-${n}.png`);
    files.push(`${id}-${n}.png`);
  }
  execSync(`cd ${tmp} && montage -label '%t' ${files.join(' ')} -tile 4x -geometry 440x256+8+8 -pointsize 18 -background '#888888' ${ROOT}/sheet.png`);
}

if (require.main === module) (async () => {
  const ids = ONLY.length ? ONLY : Object.keys(V);
  const report = [];
  for (const id of ids) report.push(await buildVariant(id));
  await kit.close();
  await sheet();
  fs.writeFileSync(`${ROOT}/_work/checks.json`, JSON.stringify(report, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { V, U, HW, PHI, lockup, markBody, handsAt, fitHands };
