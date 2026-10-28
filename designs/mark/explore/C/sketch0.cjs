// Round 0: broad container exploration. Not a deliverable.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const g = require('./geom.cjs');
const { execSync } = require('child_process');
const path = require('path');
const OUT = path.join(__dirname, '_work', 'r0');

const u = 2.4; // knockout width at 25 mm

function hands(O, Lm, Lh, opt = {}) {
  const am = (opt.wm ?? u) / 2, ah = (opt.wh ?? u * 1.05) / 2;
  return [
    { deg: 0, a: am, L: Lm - (opt.cap === 'round' || !opt.cap ? am : 0), cap: opt.cap || 'round' },
    { deg: 150, a: ah, L: Lh - (opt.cap === 'round' || !opt.cap ? ah : 0), cap: opt.cap || 'round' },
  ];
}

function discNotch(O, R, rh, am, h) {
  const [cx, cy] = O;
  const yR = cy - Math.sqrt(R * R - am * am), yH = cy - Math.sqrt(rh * rh - am * am);
  const dm = (Math.asin(am / rh) * 180) / Math.PI, dh = (Math.asin(h.a / rh) * 180) / Math.PI;
  const u_ = g.U(h.deg), n_ = g.N(h.deg);
  const s = Math.sqrt(rh * rh - h.a * h.a);
  const cwBase = g.add(g.add(O, g.mul(u_, s)), g.mul(n_, h.a));
  const ccwBase = g.add(g.add(O, g.mul(u_, s)), g.mul(n_, -h.a));
  const cwEnd = g.add(g.add(O, g.mul(u_, h.L)), g.mul(n_, h.a));
  let d = `M${g.fmt(cx + am)} ${g.fmt(yR)}`;
  d += `A${g.fmt(R)} ${g.fmt(R)} 0 1 1 ${g.fmt(cx - am)} ${g.fmt(yR)}`;
  d += `L${g.fmt(cx - am)} ${g.fmt(yH)}`;
  d += g.arcTo(O, rh, 360 - dm, h.deg + dh, false);
  d += `L${g.P(cwEnd)}`;
  d += g.capTo(h, O, false);
  d += `L${g.P(ccwBase)}`;
  d += g.arcTo(O, rh, h.deg - dh, dm, false);
  return d + 'Z';
}

const C = [];
const add = (id, w, h, body) => C.push({ id, w, h, body });
const ink = kit.T.ink, rust = kit.T.rust;
const P = (d, fill = ink) => `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>`;

// A disc + notch
{
  const R = 12.5, O = [R, R], rh = 2.2;
  const h = { deg: 150, a: u * 1.05 / 2, L: 7.6 - u * 1.05 / 2, cap: 'round' };
  add('A-disc-notch', 25, 25, P(discNotch(O, R, rh, u / 2, h), rust));
}
// B disc plain
{
  const R = 12.5, O = [R, R];
  add('B-disc-plain', 25, 25, P(g.circle(O, R) + g.handsUnion(O, 2.2, hands(O, 9.8, 6.6)), rust));
}
// B2 disc plain, rivet hub
{
  const R = 12.5, O = [R, R];
  add('B2-disc-rivet', 25, 25, P(g.circle(O, R) + g.handsUnion(O, 3.0, hands(O, 9.8, 6.6)) + g.circle(O, 1.0), rust));
}
// C card chamfer top-left
{
  const W = 19.5, H = 25, c = 5.2, r = 2.0;
  const O = [W / 2, H / 2];
  const poly = g.roundedPoly([[c, 0], [W, 0], [W, H], [0, H], [0, c]], [1.0, r, r, r, 1.0]);
  add('C-card', W, H, P(poly + g.handsUnion(O, 2.3, hands(O, 9.2, 6.2)), ink));
}
// D tag with eyelet
{
  const W = 18, H = 25, r = 3.0;
  const O = [W / 2, 14.2];
  const poly = g.roundedPoly([[0, 0], [W, 0], [W, H], [0, H]], r);
  add('D-tag', W, H, P(poly + g.circle([W / 2, 3.6], 1.5) + g.handsUnion(O, 2.2, hands(O, 7.6, 6.0)), ink));
}
// E hex pointy-top, rivet hub, flat ends
{
  const R = 12.5, O = [R * Math.sin(Math.PI / 3), R];
  const hex = g.roundedPoly(g.regPoly(O, R, 6, 0), 1.6);
  add('E-hex-rivet', 2 * R * Math.sin(Math.PI / 3), 25, P(hex + g.handsUnion(O, 3.0, hands(O, 9.0, 6.4, { cap: 'flat' })) + g.circle(O, 1.0), ink));
}
// F hex pointy-top, round ends plain hub
{
  const R = 12.5, O = [R * Math.sin(Math.PI / 3), R];
  const hex = g.roundedPoly(g.regPoly(O, R, 6, 0), 1.6);
  add('F-hex-round', 2 * R * Math.sin(Math.PI / 3), 25, P(hex + g.handsUnion(O, 2.2, hands(O, 9.2, 6.4)), ink));
}
// G vertical pill
{
  const W = 15, H = 25, O = [W / 2, H / 2];
  const pill = g.roundedPoly([[0, 0], [W, 0], [W, H], [0, H]], W / 2 - 0.001);
  add('G-pill', W, H, P(pill + g.handsUnion(O, 2.2, hands(O, 9.0, 6.4)), rust));
}
// H horizontal oval (name patch)
{
  const W = 25, H = 17.5, O = [W / 2, H / 2];
  const ov = `M0 ${H / 2}A${W / 2} ${H / 2} 0 1 1 ${W} ${H / 2}A${W / 2} ${H / 2} 0 1 1 0 ${H / 2}Z`;
  add('H-oval', W, H, P(ov + g.handsUnion(O, 1.9, hands(O, 6.3, 4.4, { wm: 2.0, wh: 2.1 })), ink));
}
// I squircle
{
  const W = 23, O = [W / 2, W / 2];
  const sq = g.roundedPoly([[0, 0], [W, 0], [W, W], [0, W]], 5.5);
  add('I-squircle', W, W, P(sq + g.handsUnion(O, 2.2, hands(O, 8.8, 6.2)), ink));
}
// J octagon
{
  const R = 12.5 / Math.cos(Math.PI / 8) * Math.cos(Math.PI / 8), O = [12.5, 12.5];
  const oc = g.roundedPoly(g.regPoly(O, 12.5 / Math.cos(Math.PI / 8), 8, 22.5), 1.4);
  add('J-octagon', 25, 25, P(oc + g.handsUnion(O, 2.2, hands(O, 9.4, 6.4)), rust));
}
// K dome (flat bottom)
{
  const R = 12.5, cx = R, cy = R, b = 8.2, rf = 2.0;
  const O = [cx, cy];
  const fx = Math.sqrt((R - rf) ** 2 - (b - rf) ** 2);
  const fcR = [cx + fx, cy + b - rf], fcL = [cx - fx, cy + b - rf];
  const tR = g.add(O, g.mul(g.norm(g.sub(fcR, O)), R)), tL = g.add(O, g.mul(g.norm(g.sub(fcL, O)), R));
  const d = `M${g.P(tL)}A${R} ${R} 0 1 1 ${g.P(tR)}A${rf} ${rf} 0 0 1 ${g.fmt(cx + fx)} ${g.fmt(cy + b)}L${g.fmt(cx - fx)} ${g.fmt(cy + b)}A${rf} ${rf} 0 0 1 ${g.P(tL)}Z`;
  add('K-dome', 25, R + b, P(d + g.handsUnion(O, 2.2, hands(O, 9.6, 6.4)), rust));
}

(async () => {
  const files = [];
  for (const c of C) {
    const svg = path.join(OUT, c.id + '.svg');
    kit.writeSvg(svg, { w: c.w, h: c.h, body: c.body });
    const png = path.join(OUT, c.id + '.png');
    await kit.render(svg, png, { bg: kit.F.bone });
    files.push(png);
  }
  await kit.close();
  execSync(`montage -label '%t' ${files.join(' ')} -tile 4x -geometry 440x256+8+8 -pointsize 18 -background '#888888' ${path.join(OUT, 'sheet0.png')}`);
  console.log('done', files.length);
})();
