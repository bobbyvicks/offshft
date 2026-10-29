// Cuffed knit beanie, one size: fine rib knit all over, the body and a 75 mm cuff turned up over it. The crown is closed
// by decreases, so the ribs run straight up the body and gather in to the top centre. The logo goes in the middle of the
// cuff. Sized like Printful's cuffed beanie, the Yupoong 1501KC, which Printful lists as 12 in (30 cm) long; turned up,
// about 9 in (Printify's figure for the same blank, not confirmed by Printful). Neither page could be checked, so the
// height is the brief's 215 mm: if 9 in turned up is confirmed, make SIZE.height 229 (the body grows above the cuff, and
// the cuff and its anchor move down with the fold).
//
// A knit hat has no structure, so it isn't drawn on a head like the caps: it's drawn the way beanies are on flats, laid
// flat and seen straight on, 230 mm wide and 215 mm tall. Built for the wearer's left (+x) and mirrored; y = 0 is the
// top of the crown. Rib lines are the outline lightened, and the cuff, a band, is filled in the rib colour, as the
// fleece tops' cuffs and bands are (_top.cjs).
'use strict';
const G = require('./_bezier.cjs');
const { V, C, L } = G;

const SIZE = {
  height: 215,                                             // top of the crown to the fold at the bottom of the cuff
  cuff: { halfW: 114.7, depth: 75, fold: 7, edge: 2.5 },   // half its flat width, fold to edge, corner radii (fold, edge)
  body: { halfW: 111.5, crownW: 110, crown: 72 },          // half-width at the cuff and where the crown starts; crown depth
  dome: { top: 0.6, side: 0.58 },                          // crown shape: handles at the top (flatness) and side (fullness)
};
const PITCH = 3.5;        // mm between rib lines: a fine rib
const DROP = 0.6;         // pitches: where the gap to the next rib falls under this, a rib is taken out
const MERGE = 7;          // mm along the rib over which a rib taken out bends into its neighbour
const EDGE = 2;           // mm below the outline (straight down): from here the ribs left run straight on to it
const RIB_OPACITY = 0.4;  // as on the fleece tops

const scaleX = (ch, f) => ch.map((s) => C(V(s.a.x * f, s.a.y), V(s.b.x * f, s.b.y), V(s.c.x * f, s.c.y), V(s.d.x * f, s.d.y)));
// How many times 2 divides n (n > 0).
const twos = (n) => { let k = 0; while (n % 2 === 0) { n /= 2; k++; } return k; };

module.exports = (kit) => {
  const S = kit.strokes(kit.HAT_PX);
  const { fabric, rib } = kit.STYLE;
  const half = kit.mm(kit.STYLE.lineW, kit.HAT_PX) / 2;   // half an outline, so w and h include the drawn line
  const id = (s) => `beanie-${s}`;
  const out = [];
  const ribs = (paths, clip) => out.push(`<g clip-path="url(#${id(clip)})"><path d="${paths.join('')}" ${S.outline} stroke-opacity="${RIB_OPACITY}"/></g>`);

  const top = half;
  const bottom = SIZE.height - half;              // the fold
  const cuffTop = bottom - SIZE.cuff.depth;       // the cuff's edge, where the body goes under it
  const b = SIZE.body;

  // ---------- body ----------
  // Right half: the crown from the top centre round to the side, the side down to the cuff, then on under the cuff (hidden)
  // and back to the centre line.
  const T = V(0, top), D = V(b.crownW, top + b.crown), K = V(b.halfW, cuffTop), U = V(b.halfW, cuffTop + 8);
  const crown = C(T, V(SIZE.dome.top * D.x, top), V(D.x, D.y - SIZE.dome.side * b.crown), D);
  const side = C(D, V(D.x, D.y + (K.y - D.y) / 3), V(K.x, K.y - (K.y - D.y) / 3), K);
  const bodyShape = G.pathD(G.sym([crown, side, L(K, U), L(U, V(0, U.y))]), true);
  out.push(`<clipPath id="${id('body')}"><path d="${bodyShape}"/></clipPath>`);
  out.push(`<path d="${bodyShape}" fill="${fabric}"/>`);

  // Ribs: rib i sits i pitches from the centre line where the body meets the cuff, and follows the body's outline scaled in
  // x, so the ribs run up the body and gather in towards the top centre the way the crown's decreases draw them in. Going
  // up the crown they crowd together, so they are taken out the way a decrease takes them out, by joining a neighbour:
  // where the gap across to the next rib falls under DROP pitches, every other rib bends into one of its two neighbours,
  // then every other one of those, and so on (rib i lasts as long as the number of times 2 divides it allows; the outline
  // counts as the rib after the last). The ribs left run on to the outline: straight on from EDGE mm below it, into the
  // crown point at the top and over the fold at the shoulders. So no rib ends in open fabric.
  const n = Math.floor((b.halfW - PITCH * 0.8) / PITCH);
  const STEP = 0.001;
  const F = (i) => (i > n ? 1 : (i * PITCH) / b.halfW);   // rib i's scale; past the last rib, the outline itself
  const level = (i) => (i === 0 || i > n ? Infinity : twos(i));
  const gap = (t, f) => {   // across-the-rib distance to the next rib, at crown parameter t, for the rib scaled by f
    const p = G.pt(crown, t), d = G.deriv(crown, t);
    return ((PITCH / b.halfW) * p.x * Math.abs(d.y)) / Math.hypot(f * d.x, d.y);
  };
  const ribAt = (f, t) => { const p = G.pt(crown, t); return V(f * p.x, p.y); };
  const upAt = (f, t) => { const d = G.deriv(crown, t); return G.unit(V(-f * d.x, -d.y)); };   // up the rib
  const outlineY = (x) => {   // the outline's height at x (the crown runs one way in x)
    let lo = 0, hi = 1;
    for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2; if (G.pt(crown, mid).x < x) lo = mid; else hi = mid; }
    return G.pt(crown, (lo + hi) / 2).y;
  };
  // Walking up rib i (crown parameter t falls to 0 at the top): where it comes within EDGE of the outline, and where the
  // gap falls under DROP pitches for its level (0: never).
  const ends = [];
  for (let i = 0; i <= n; i++) {
    const f = F(i), k = 2 ** level(i);
    let edge = 1, drop = 1;
    while (edge > STEP) { const q = ribAt(f, edge); if (q.y - outlineY(q.x) < EDGE) break; edge -= STEP; }
    while (drop > STEP && k * gap(drop, f) >= DROP * PITCH) drop -= STEP;
    ends.push({ edge, drop });
  }
  ends.push({ edge: 0, drop: 0 });   // the outline goes all the way
  // The neighbour a rib taken out joins: of the two either side of it, the one that lasts longer (the inside one if both
  // go all the way), so the joins pair up into the V of a decrease.
  const target = (i) => {
    const step = 2 ** level(i), inner = i - step, outer = Math.min(i + step, n + 1);
    return level(outer) > level(inner) ? outer : inner;
  };
  const halfRibs = [];   // right half, each from its top end down to under the cuff
  for (let i = 0; i <= n; i++) {
    const f = F(i), e = ends[i];
    let tEnd = e.edge, cap = null;
    if (e.drop > e.edge) {
      // Taken out: bend into the neighbour over MERGE mm, if that one is still there that far up.
      const j = target(i), fj = F(j);
      let tb = e.drop, run = 0, prev = ribAt(fj, tb);
      while (run < MERGE && tb > STEP) { tb -= STEP; const q = ribAt(fj, tb); run += G.len(G.sub(q, prev)); prev = q; }
      if (tb > ends[j].edge && tb > ends[j].drop) {
        const a = ribAt(f, e.drop), d = ribAt(fj, tb), h = G.len(G.sub(d, a)) / 3;
        cap = C(d, G.sub(d, G.mul(upAt(fj, tb), h)), G.add(a, G.mul(upAt(f, e.drop), h)), a);
        tEnd = e.drop;
      }
    }
    if (!cap) {   // straight on to the outline (and a little past it: the clip trims it there)
      const a = ribAt(f, tEnd), u = upAt(f, tEnd);
      cap = L(G.add(G.hit([crown], a, u), G.mul(u, 1.5)), a);
    }
    halfRibs.push([cap].concat(scaleX([G.split(crown, tEnd)[1], side, L(K, U)], f)));
  }
  const bodyRibs = [];
  halfRibs.forEach((ch, i) => { bodyRibs.push(G.pathD(ch)); if (i) bodyRibs.push(G.pathD(G.mirror(ch))); });
  ribs(bodyRibs, 'body');
  const visible = [crown, side];                  // the outline, cuff to cuff over the crown
  out.push(`<path d="${G.pathD(G.reverse(G.mirror(visible)).concat(visible))}" ${S.outline}/>`);

  // ---------- cuff ----------
  const W = SIZE.cuff.halfW;
  const cuff = G.corners([V(-W, cuffTop), V(W, cuffTop), V(W, bottom), V(-W, bottom)],
    [SIZE.cuff.edge, SIZE.cuff.edge, SIZE.cuff.fold, SIZE.cuff.fold], true);
  const cuffShape = G.pathD(cuff, true);
  out.push(`<clipPath id="${id('cuff')}"><path d="${cuffShape}"/></clipPath>`);
  out.push(`<path d="${cuffShape}" fill="${rib}"/>`);
  const m = Math.round(W / PITCH), pc = W / m;     // whole pitches across, so the ribs run evenly to both sides
  const cuffRibs = [];
  for (let j = -(m - 1); j <= m - 1; j++) cuffRibs.push(`M${G.num(j * pc)} ${G.num(cuffTop)}V${G.num(bottom)}`);
  ribs(cuffRibs, 'cuff');
  out.push(`<path d="${cuffShape}" ${S.outline}/>`);

  return {
    name: 'beanie',
    category: 'hat',
    w: 2 * (W + half),
    h: bottom + half,
    body: out.join(''),
    anchors: { front: { x: 0, y: cuffTop + SIZE.cuff.depth / 2 } },   // the middle of the cuff
  };
};
