// Logo exploration for OFF SHFT. Writes one SVG per concept plus flat
// previews (ink on bone, bone on slate) to ../designs/logo/.
//
//   cd tools && node logo.cjs

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const OUT = path.resolve(__dirname, '..', 'designs', 'logo');
const load = (f) => opentype.loadSync(path.join(__dirname, 'fonts', f));
const FONT = {
  xbold: load('Archivo-ExpandedBold.ttf'),
  xblack: load('Archivo-ExpandedBlack.ttf'),
  xmed: load('Archivo-ExpandedMedium.ttf'),
  sxbold: load('Archivo-SemiExpandedBold.ttf'),
  bold: load('Archivo-Bold.ttf'),
};

// ---------- text ----------
const capOf = (f) => f.tables.os2.sCapHeight;
const xOf = (f) => f.tables.os2.sxHeight;
const sizeForCap = (f, cap) => (cap * f.unitsPerEm) / capOf(f);

function layout(f, str, size, tracking) {
  const glyphs = f.stringToGlyphs(str);
  const pos = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    pos.push(x);
    x += (g.advanceWidth * size) / f.unitsPerEm;
    if (glyphs[i + 1]) x += (f.getKerningValue(g, glyphs[i + 1]) * size) / f.unitsPerEm;
    x += tracking;
  });
  return { glyphs, pos, width: x - tracking };
}

// cap = cap height in mm; track in em
function text(str, { f, x = 0, y, cap, fill, anchor = 'start', track = 0 }) {
  const size = sizeForCap(f, cap);
  const L = layout(f, str, size, track * size);
  const x0 = anchor === 'middle' ? x - L.width / 2 : anchor === 'end' ? x - L.width : x;
  const d = L.glyphs.map((g, i) => g.getPath(x0 + L.pos[i], y, size).toPathData(3)).join('');
  return { svg: `<path fill="${fill}" d="${d}"/>`, width: L.width, x0, size, L };
}

function arcText(str, { f, cx, cy, r, cap, fill, side = 'top', track = 0 }) {
  const size = sizeForCap(f, cap);
  const L = layout(f, str, size, track * size);
  return L.glyphs.map((g, i) => {
    const w = (g.advanceWidth * size) / f.unitsPerEm;
    const s = L.pos[i] + w / 2 - L.width / 2;
    const d = g.getPath(0, 0, size).toPathData(3);
    if (side === 'top') {
      const a = (s / r) * 180 / Math.PI;
      return `<path fill="${fill}" d="${d}" transform="translate(${cx} ${cy}) rotate(${a.toFixed(3)}) translate(${(-w / 2).toFixed(3)} ${-r})"/>`;
    }
    const a = (-s / r) * 180 / Math.PI;
    return `<path fill="${fill}" d="${d}" transform="translate(${cx} ${cy}) rotate(${a.toFixed(3)}) translate(${(-w / 2).toFixed(3)} ${r + cap})"/>`;
  }).join('');
}

// Stem thickness of a font at a cap height, measured from the "I".
function stem(f, cap) {
  const bb = f.charToGlyph('I').getBoundingBox();
  return ((bb.x2 - bb.x1) * sizeForCap(f, cap)) / f.unitsPerEm;
}

// ---------- clock ----------
// Clock stopped at 5:00 inside a circle of diameter D with line weight w.
function clock(cx, cy, D, w, c) {
  const r = D / 2 - w / 2;
  const m = r * 0.62, h = r * 0.46;
  const a = (150 * Math.PI) / 180;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/>` +
    `<path d="M${cx} ${cy} L${cx} ${cy - m} M${cx} ${cy} L${cx + h * Math.sin(a)} ${cy - h * Math.cos(a)}" fill="none" stroke="${c}" stroke-width="${w * 0.9}" stroke-linecap="round"/>`;
}

// ---------- concepts ----------
// Each takes colours { c: main, a: accent, bg: fabric } and returns { w, h, body }.
const CONCEPTS = [
  {
    slug: 'L01-wordmark', name: 'Wordmark',
    idea: 'Just the name. Wide, spaced out, nothing else.',
    make: ({ c }) => { const cap = 8; const t = text('OFF SHFT', { f: FONT.xbold, y: cap, cap, fill: c, track: 0.16 }); return { w: t.width, h: cap, body: t.svg }; },
  },
  {
    slug: 'L02-clock-o', name: 'Clock O',
    idea: 'The O in OFF becomes the clock, stopped at 5:00.',
    make: ({ c }) => {
      const f = FONT.xbold, cap = 10, track = 0.1;
      const size = sizeForCap(f, cap);
      const L = layout(f, 'OFF SHFT', size, track * size);
      const o = L.glyphs[0].getBoundingBox();
      const k = size / f.unitsPerEm;
      const D = (o.y2 - o.y1) * k, ox = o.x1 * k, ow = (o.x2 - o.x1) * k;
      const w = stem(f, cap) * 0.6;
      const rest = L.glyphs.slice(1).map((g, i) => g.getPath(L.pos[i + 1] + (D - ow), cap, size).toPathData(3)).join('');
      const cy = cap - (o.y2 * k) + D / 2;
      return { w: L.width + (D - ow), h: cap - o.y1 * k + 0.0001, body: clock(ox + D / 2, cy, D, w, c) + `<path fill="${c}" d="${rest}"/>` };
    },
  },
  {
    slug: 'L03-clock-name', name: 'Clock + Name',
    idea: 'Clock symbol beside the name. The one from round 2, tightened.',
    make: ({ c }) => {
      const cap = 7, D = 13.2, gap = 4.4;
      const t = text('OFF SHFT', { f: FONT.xbold, x: D + gap, y: D / 2 + cap / 2, cap, fill: c, track: 0.14 });
      return { w: D + gap + t.width, h: D, body: clock(D / 2, D / 2, D, 1.5, c) + t.svg };
    },
  },
  {
    slug: 'L04-stacked', name: 'Stacked',
    idea: 'OFF over SHFT, clock tucked in after OFF. Square, good for a patch.',
    make: ({ c, a }) => {
      const cap = 10, lead = 3.6, f = FONT.xbold;
      const t1 = text('OFF', { f, y: cap, cap, fill: c, track: 0.04 });
      const t2 = text('SHFT', { f, y: cap * 2 + lead, cap, fill: c, track: 0.04 });
      const w = t2.width;
      return { w, h: cap * 2 + lead, body: t1.svg + t2.svg + clock(w - cap / 2, cap / 2, cap, 1.7, a) };
    },
  },
  {
    slug: 'L05-dash', name: 'Off — Shft',
    idea: 'A long dash between the words, like a time range on a schedule.',
    make: ({ c, a }) => {
      const cap = 7.4, f = FONT.xbold;
      const t1 = text('OFF', { f, y: cap, cap, fill: c, track: 0.14 });
      const dash = 9, gap = 3.2;
      const t2 = text('SHFT', { f, x: t1.width + gap * 2 + dash, y: cap, cap, fill: c, track: 0.14 });
      return { w: t1.width + gap * 2 + dash + t2.width, h: cap, body: t1.svg + `<rect x="${t1.width + gap}" y="${cap / 2 - 0.8}" width="${dash}" height="1.6" fill="${a}"/>` + t2.svg };
    },
  },
  {
    slug: 'L06-lowercase', name: 'Lowercase',
    idea: 'off shft in lowercase. Friendlier, more laid back.',
    make: ({ c }) => {
      const f = FONT.sxbold, cap = 12;
      const t = text('off shft', { f, y: cap, cap, fill: c, track: -0.01 });
      return { w: t.width, h: cap, body: t.svg };
    },
  },
  {
    slug: 'L07-full-stop', name: 'Full Stop',
    idea: 'Heavy name with a rust full stop. Done for the day. Pairs with the Punched Out. hat.',
    make: ({ c, a }) => {
      const f = FONT.xblack, cap = 9;
      const t = text('OFF SHFT', { f, y: cap, cap, fill: c, track: 0.02 });
      const d = stem(f, cap) * 1.05;
      return { w: t.width + 1.6 + d, h: cap, body: t.svg + `<rect x="${t.width + 1.6}" y="${cap - d}" width="${d}" height="${d}" fill="${a}"/>` };
    },
  },
  {
    slug: 'L08-round-badge', name: 'Round Badge',
    idea: 'Clock in the middle, name around the top. A classic round patch.',
    make: ({ c, a }) => {
      const R = 21, cx = 22, cy = 22;
      const ring = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${c}" stroke-width="1.4"/>`;
      return {
        w: 44, h: 44,
        body: ring + arcText('OFF SHFT', { f: FONT.xbold, cx, cy, r: 15.6, cap: 4.2, fill: c, track: 0.1 }) +
          arcText('EARNED IT', { f: FONT.xmed, cx, cy, r: 16.2, cap: 3.4, fill: c, side: 'bottom', track: 0.16 }) +
          clock(cx, cy, 17, 1.5, a) +
          `<circle cx="${cx - 17.8}" cy="${cy}" r="0.9" fill="${c}"/><circle cx="${cx + 17.8}" cy="${cy}" r="0.9" fill="${c}"/>`,
      };
    },
  },
  {
    slug: 'L09-switch', name: 'Switch',
    idea: 'A toggle switched to off, beside the name. Modern and simple.',
    make: ({ c, a }) => {
      const H = 9, W = 17, sw = 1.5;
      const pill = `<rect x="${sw / 2}" y="${sw / 2}" width="${W - sw}" height="${H - sw}" rx="${(H - sw) / 2}" fill="none" stroke="${c}" stroke-width="${sw}"/>` +
        `<circle cx="${H / 2}" cy="${H / 2}" r="${H / 2 - sw - 1}" fill="${a}"/>`;
      const cap = 6.8;
      const t = text('OFF SHFT', { f: FONT.xbold, x: W + 4.4, y: H / 2 + cap / 2, cap, fill: c, track: 0.14 });
      return { w: W + 4.4 + t.width, h: H, body: pill + t.svg };
    },
  },
  {
    slug: 'L10-time-card', name: 'Time Card',
    idea: 'OFF punched out in a solid block, SHFT in the open. A two-part stamp.',
    make: ({ c, bg }) => {
      const cap = 6.4, f = FONT.xbold, pad = 3.4, sw = 1.4;
      const off = text('OFF', { f, x: 0, y: 0, cap, fill: bg, track: 0.14 });
      const shft = text('SHFT', { f, x: 0, y: 0, cap, fill: c, track: 0.14 });
      const H = cap + pad * 2, w1 = off.width + pad * 2, w2 = shft.width + pad * 2;
      const W = w1 + w2;
      return {
        w: W, h: H,
        body: `<rect x="${sw / 2}" y="${sw / 2}" width="${W - sw}" height="${H - sw}" rx="1.4" fill="none" stroke="${c}" stroke-width="${sw}"/>` +
          `<path d="M1.4 0 L${w1} 0 L${w1} ${H} L1.4 ${H} A1.4 1.4 0 0 1 0 ${H - 1.4} L0 1.4 A1.4 1.4 0 0 1 1.4 0 Z" fill="${c}"/>` +
          text('OFF', { f, x: pad, y: pad + cap, cap, fill: bg, track: 0.14 }).svg +
          text('SHFT', { f, x: w1 + pad, y: pad + cap, cap, fill: c, track: 0.14 }).svg,
      };
    },
  },
  {
    slug: 'L11-horizon', name: 'Horizon',
    idea: 'Sun going down on a line, name underneath. End of the day.',
    make: ({ c, a }) => {
      const cap = 6.4, f = FONT.xbold;
      const t = text('OFF SHFT', { f, x: 0, y: 0, cap, fill: c, track: 0.18 });
      const W = t.width, mid = W / 2, r = 5.2, hz = r + 0.6;
      return {
        w: W, h: hz + 6.2 + cap,
        body: `<path d="M${mid - r} ${hz} A${r} ${r} 0 0 1 ${mid + r} ${hz} Z" fill="${a}"/>` +
          `<rect x="0" y="${hz - 0.7}" width="${W}" height="1.4" fill="${c}"/>` +
          text('OFF SHFT', { f, x: mid, y: hz + 6.2 + cap, cap, fill: c, anchor: 'middle', track: 0.18 }).svg,
      };
    },
  },
  {
    slug: 'L12-hands', name: 'Hands Only',
    idea: 'No circle, just the two clock hands at 5:00 as an L-shaped mark. The most minimal option.',
    make: ({ c, a }) => {
      const cap = 7, f = FONT.xbold, w = 1.9, L1 = 9.6, L2 = 6.6;
      const ang = (150 * Math.PI) / 180;
      const cx = 3, cy = L1 + 0.6;
      const mark = `<path d="M${cx} ${cy} L${cx} ${cy - L1 + w / 2} M${cx} ${cy} L${cx + L2 * Math.sin(ang)} ${cy - L2 * Math.cos(ang)}" fill="none" stroke="${a}" stroke-width="${w}" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${w * 0.9}" fill="${a}"/>`;
      const H = cy + L2 * 0.87 + 1;
      const t = text('OFF SHFT', { f, x: 12, y: H / 2 + cap / 2, cap, fill: c, track: 0.14 });
      return { w: 12 + t.width, h: H, body: mark + t.svg };
    },
  },
];

// ---------- render ----------
const THEMES = [
  { name: 'light', bg: '#E4DDCB', c: '#1F2733', a: '#B4552D' },
  { name: 'dark', bg: '#27303D', c: '#ECE5D3', a: '#D29B3C' },
];
const PX = 4;
function preview(d, th) {
  const W = 110, H = 64;
  const s = Math.min(1, 84 / d.w, 40 / d.h);
  const w = d.w * s, h = d.h * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * PX}" height="${H * PX}">
<rect width="${W}" height="${H}" fill="${th.bg}"/>
<svg x="${(W - w) / 2}" y="${(H - h) / 2}" width="${w}" height="${h}" viewBox="0 0 ${d.w} ${d.h}" overflow="visible">${d.body}</svg>
</svg>`;
}
const svgDoc = (d) => `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w.toFixed(2)}mm" height="${d.h.toFixed(2)}mm" viewBox="0 0 ${d.w.toFixed(3)} ${d.h.toFixed(3)}">\n${d.body}\n</svg>\n`;

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const index = [];
  for (const k of CONCEPTS) {
    for (const th of THEMES) {
      const d = k.make({ c: th.c, a: th.a, bg: th.bg });
      fs.writeFileSync(path.join(OUT, `${k.slug}-${th.name}.svg`), svgDoc(d));
      await page.setContent(`<html><body style="margin:0">${preview(d, th)}</body></html>`);
      await (await page.$('svg')).screenshot({ path: path.join(OUT, `${k.slug}-${th.name}.png`) });
      if (th.name === 'light') index.push({ slug: k.slug, name: k.name, idea: k.idea, size: { w: +d.w.toFixed(1), h: +d.h.toFixed(1) } });
    }
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  await browser.close();
  console.log(index.map((i) => `${i.slug}  ${i.size.w} x ${i.size.h} mm`).join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
