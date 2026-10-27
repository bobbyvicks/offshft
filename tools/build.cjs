// Generates every OFF SHFT design as an embroidery-ready SVG (text converted
// to outlines, flat colours, real size in mm) plus a flat preview of each
// design on its fabric colour. No hat drawings.
//
//   cd tools && npm install && node build.cjs
//
// Output goes to ../designs/<slug>/ and ../designs/index.json.

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'designs');
const font = (f) => opentype.loadSync(path.join(__dirname, 'fonts', f));
const FONT = {
  bold: font('Archivo-ExpandedBold.ttf'),
  semi: font('Archivo-ExpandedSemiBold.ttf'),
  medium: font('Archivo-ExpandedMedium.ttf'),
};

// ---------- palette ----------
// Thread colours (what gets stitched).
const T = {
  bone: '#ECE5D3',
  ink: '#1F2733',
  rust: '#B4552D',
  sun: '#D29B3C',
  sage: '#9AA383',
};
// Fabric colours (the hat).
const F = {
  bone: '#E4DDCB',
  oat: '#C7B48E',
  moss: '#5A5F40',
  spruce: '#2E3D35',
  slate: '#27303D',
  rust: '#8E4426',
};

// ---------- text (outlined glyphs) ----------
function layout(f, str, size, tracking) {
  const upm = f.unitsPerEm;
  const glyphs = f.stringToGlyphs(str);
  const pos = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    pos.push(x);
    x += (g.advanceWidth * size) / upm;
    if (glyphs[i + 1]) x += (f.getKerningValue(g, glyphs[i + 1]) * size) / upm;
    x += tracking;
  });
  return { glyphs, pos, width: x - tracking };
}
const sizeForCap = (f, cap) => (cap * f.unitsPerEm) / f.tables.os2.sCapHeight;

// tracking is in em (0.1 = 10% of the font size between letters)
function text(str, { f = FONT.bold, x, y, cap, fill, anchor = 'start', track = 0 }) {
  const size = sizeForCap(f, cap);
  const L = layout(f, str, size, track * size);
  const x0 = anchor === 'middle' ? x - L.width / 2 : anchor === 'end' ? x - L.width : x;
  const d = L.glyphs.map((g, i) => g.getPath(x0 + L.pos[i], y, size).toPathData(3)).join('');
  return { svg: `<path fill="${fill}" d="${d}"/>`, width: L.width };
}
const measure = (str, { f = FONT.bold, cap, track = 0 }) => {
  const size = sizeForCap(f, cap);
  return layout(f, str, size, track * size).width;
};

// ---------- line icons ----------
// All icons are drawn with one stroke weight so they read as a family.
const SW = 1.6; // mm, about the finest line that embroiders cleanly
const line = (d, c, w = SW) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const ICON = {
  // Clock stopped at 5:00. Box 24 x 24.
  clock: (c) => ({
    w: 24, h: 24,
    svg: `<circle cx="12" cy="12" r="10.6" fill="none" stroke="${c}" stroke-width="${SW}"/>` +
      line('M12 12 L12 5.2', c) + line('M12 12 L15.1 17.4', c),
  }),
  // Sun sitting on the horizon with water lines. Box 30 x 17.
  horizon: (c, sun) => ({
    w: 30, h: 17,
    svg: `<path d="M8.6 9.2 A6.4 6.4 0 0 1 21.4 9.2 Z" fill="${sun}"/>` +
      line('M1.5 9.2 L28.5 9.2', c) + line('M7 12.6 L23 12.6', c) + line('M11.5 16 L18.5 16', c),
  }),
  // Fish, single outline. Box 40 x 17.
  fish: (c) => ({
    w: 40, h: 17,
    svg: line('M38.4 8.5 C34.6 3.6 26 2.4 18.4 4.4 C15.2 5.2 13 6.3 11.2 7.3 L4 2.8 L6.4 8.5 L4 14.2 L11.2 9.7 C13 10.7 15.2 11.8 18.4 12.6 C26 14.6 34.6 13.4 38.4 8.5 Z', c) +
      line('M29.2 5 C27.8 7.4 27.8 9.6 29.2 12', c) + `<circle cx="33.2" cy="7.3" r="1" fill="${c}"/>`,
  }),
  // Pin flag on a green. Box 20 x 24.
  flag: (c, flag) => ({
    w: 20, h: 24,
    svg: line('M1.8 22.2 C6.4 19.6 13.6 19.6 18.2 22.2', c) + line('M9.4 20.4 L9.4 2.2', c) +
      `<path d="M9.4 2.2 L17.2 5.4 L9.4 8.6 Z" fill="${flag}" stroke="${flag}" stroke-width="0.8" stroke-linejoin="round"/>`,
  }),
  // Canoe with a paddle resting across it. Box 42 x 16.
  canoe: (c, fabric) => ({
    w: 42, h: 16,
    svg: line('M14.6 3.6 L29.4 13.6', c) +
      `<path d="M15.6 4.4 C13.6 4.6 10.8 3.4 9.6 1.6 C9 0.6 9.8 0 11 0.4 C12.8 1 14.8 2.4 15.6 4.4 Z" fill="${c}"/>` +
      `<path d="M2 6.2 C3.6 5 5 5.4 6.2 7 L35.8 7 C37 5.4 38.4 5 40 6.2 C37.4 12.2 28.6 13.6 21 13.6 C13.4 13.6 4.6 12.2 2 6.2 Z" fill="${fabric}" stroke="${c}" stroke-width="${SW}" stroke-linejoin="round"/>` +
      line('M6.6 9.2 L35.4 9.2', c, 1.2),
  }),
  // Muskoka chair, side view, sun going down behind it. Box 34 x 24.
  dock: (c, sun) => ({
    w: 34, h: 24,
    svg: `<path d="M21 22.2 A7 7 0 0 1 35 22.2 Z" fill="${sun}" transform="translate(-2 0)"/>` +
      line('M1 22.2 L33 22.2', c) +
      line('M3.2 1.6 L9.6 16.2', c) +            // slanted back
      line('M9.6 16.2 L20.4 14.4', c) +          // seat
      line('M5.8 9.4 L22.4 9.4', c) +            // arm
      line('M18.6 9.4 L18.6 22.2', c) +          // front leg
      line('M6.8 22.2 L11 15.9', c),             // back leg
  }),
};

// ---------- compositions ----------
// Each returns { w, h, body } in mm, origin top-left.
function place(icon, x, y) {
  return `<g transform="translate(${x} ${y})">${icon.svg}</g>`;
}

function wordmark(fill, cap = 5.6) {
  const t = text('OFF SHFT', { f: FONT.bold, x: 0, y: cap, cap, fill, track: 0.14 });
  return { w: t.width, h: cap, body: t.svg };
}

// Icon above, small label below, centred.
function badge(icon, label, labelFill, { cap = 4.6, gap = 4.2, sub, subFill } = {}) {
  const lw = measure(label, { cap, track: 0.2 });
  const sw = sub ? measure(sub, { f: FONT.medium, cap: cap * 0.78, track: 0.24 }) : 0;
  const w = Math.max(icon.w, lw, sw) + 2;
  const cx = w / 2;
  let body = place(icon, cx - icon.w / 2, 1);
  let y = 1 + icon.h + gap + cap;
  body += text(label, { x: cx, y, cap, fill: labelFill, anchor: 'middle', track: 0.2 }).svg;
  if (sub) {
    y += cap * 0.78 + 3.8;
    body += text(sub, { f: FONT.medium, x: cx, y, cap: cap * 0.78, fill: subFill || labelFill, anchor: 'middle', track: 0.24 }).svg;
  }
  return { w, h: y + 1, body };
}

function lockupHorizontal(c, accent) {
  const mark = ICON.clock(c);
  const s = 0.62; // clock at about 15 mm
  const cap = 5.2;
  const wm = text('OFF SHFT', { x: mark.w * s + 4.6, y: (mark.h * s) / 2 + cap / 2, cap, fill: c, track: 0.14 });
  return {
    w: mark.w * s + 4.6 + wm.width + 1,
    h: mark.h * s,
    body: `<g transform="scale(${s})">${mark.svg}</g>` + wm.svg,
  };
}

function stacked(c, accent) {
  const cap = 7.4;
  const a = text('OFF', { x: 0, y: cap, cap, fill: c, track: 0.06 });
  const b = text('SHFT', { x: 0, y: cap * 2 + 2.6, cap, fill: c, track: 0.06 });
  const w = Math.max(a.width, b.width);
  // small clock fills the space after OFF
  const k = ICON.clock(accent), ks = cap / k.h;
  const dot = `<g transform="translate(${w - cap} 0) scale(${ks})">${k.svg.split('stroke-width="1.6"').join('stroke-width="2.4"')}</g>`;
  return { w, h: cap * 2 + 2.6, body: a.svg + b.svg + dot };
}

function textLine(str, c, cap = 6.2, f = FONT.bold, track = 0.12) {
  const t = text(str, { f, x: 0, y: cap, cap, fill: c, track });
  return { w: t.width, h: cap, body: t.svg };
}

function twoLineLeft(a, b, c, accent, cap = 5.8) {
  const t1 = text(a, { x: 0, y: cap, cap, fill: c, track: 0.12 });
  const t2 = text(b, { x: 0, y: cap * 2 + 2.8, cap, fill: c, track: 0.12 });
  const w = Math.max(t1.width, t2.width);
  const rule = `<rect x="0" y="${cap * 2 + 2.8 + 3}" width="10" height="1.4" fill="${accent}"/>`;
  return { w, h: cap * 2 + 2.8 + 4.4, body: t1.svg + t2.svg + rule };
}

// ---------- catalogue ----------
// colorways: [{ fabric, ...args }] each rendered as a preview
const DESIGNS = [
  {
    slug: '01-clock-mark', name: 'The Clock', group: 'Brand',
    idea: 'The brand symbol: a clock stopped at 5:00. Quitting time. Works alone, like a Huk "H".',
    placement: 'Front centre at 1 in, or on the side of any hat.',
    make: (cw) => { const i = ICON.clock(cw.c); return { w: i.w, h: i.h, body: i.svg }; },
    colorways: [{ fabric: 'spruce', c: T.bone }, { fabric: 'oat', c: T.ink }, { fabric: 'slate', c: T.sun }],
  },
  {
    slug: '02-lockup', name: 'Clock + Name', group: 'Brand',
    idea: 'The main logo. Clock and name side by side, small and quiet.',
    placement: 'Front centre, about 2.75 in wide.',
    make: (cw) => lockupHorizontal(cw.c),
    colorways: [{ fabric: 'bone', c: T.ink }, { fabric: 'moss', c: T.bone }, { fabric: 'slate', c: T.bone }],
  },
  {
    slug: '03-stacked', name: 'Stacked', group: 'Brand',
    idea: 'OFF over SHFT, with the clock tucked in after OFF.',
    placement: 'Front left of centre, or as a small woven label.',
    make: (cw) => stacked(cw.c, cw.a),
    colorways: [{ fabric: 'oat', c: T.ink, a: T.rust }, { fabric: 'spruce', c: T.bone, a: T.sun }],
  },
  {
    slug: '04-after-hours', name: 'After Hours', group: 'Time off',
    idea: 'Sun going down over the water. The end of the shift, for any hobby.',
    placement: 'Front centre.',
    make: (cw) => badge(ICON.horizon(cw.c, cw.a), 'AFTER HOURS', cw.c, { sub: 'OFF SHFT', subFill: cw.s }),
    colorways: [{ fabric: 'slate', c: T.bone, a: T.rust, s: T.sage }, { fabric: 'bone', c: T.ink, a: T.rust, s: T.rust }],
  },
  {
    slug: '05-lines-in', name: 'Lines In', group: 'Fishing',
    idea: 'One clean fish outline. Fishing without the clip art.',
    placement: 'Front centre.',
    make: (cw) => badge(ICON.fish(cw.c), 'LINES IN', cw.c, { sub: 'OFF SHFT', subFill: cw.s }),
    colorways: [{ fabric: 'moss', c: T.bone, s: T.sun }, { fabric: 'oat', c: T.ink, s: T.rust }],
  },
  {
    slug: '06-back-nine', name: 'Back Nine', group: 'Golf',
    idea: 'Pin flag on the green. Back nine is where the day ends.',
    placement: 'Front centre.',
    make: (cw) => badge(ICON.flag(cw.c, cw.a), 'BACK NINE', cw.c, { sub: 'OFF SHFT', subFill: cw.s }),
    colorways: [{ fabric: 'bone', c: T.ink, a: T.rust, s: T.rust }, { fabric: 'spruce', c: T.bone, a: T.sun, s: T.sage }],
  },
  {
    slug: '07-out-of-office', name: 'Out of Office', group: 'Time off',
    idea: 'Canoe and paddle. The auto-reply is on.',
    placement: 'Front centre.',
    make: (cw) => badge(ICON.canoe(cw.c, F[cw.fabric]), 'OUT OF OFFICE', cw.c, { sub: 'OFF SHFT', subFill: cw.s }),
    colorways: [{ fabric: 'rust', c: T.bone, s: T.bone }, { fabric: 'spruce', c: T.bone, s: T.sun }],
  },
  {
    slug: '08-dock-hours', name: 'Dock Hours', group: 'Time off',
    idea: 'A Muskoka chair and the sun going down. Cottage time.',
    placement: 'Front centre.',
    make: (cw) => badge(ICON.dock(cw.c, cw.a), 'DOCK HOURS', cw.c, { sub: 'OPEN AFTER 5', subFill: cw.s }),
    colorways: [{ fabric: 'oat', c: T.ink, a: T.rust, s: T.rust }, { fabric: 'slate', c: T.bone, a: T.sun, s: T.sage }],
  },
  {
    slug: '09-punched-out', name: 'Punched Out.', group: 'Text',
    idea: 'Just the line, small, with a full stop. Says enough.',
    placement: 'Front centre, about 2.5 in wide.',
    make: (cw) => textLine('PUNCHED OUT.', cw.c, 4.8),
    colorways: [{ fabric: 'slate', c: T.bone }, { fabric: 'bone', c: T.rust }],
  },
  {
    slug: '10-mulligan-monday', name: 'Mulligan Monday', group: 'Text',
    idea: 'Two lines, left-aligned, small rust underline.',
    placement: 'Front left of centre. Trademark check needed before selling.',
    make: (cw) => twoLineLeft('MULLIGAN', 'MONDAY', cw.c, cw.a),
    colorways: [{ fabric: 'oat', c: T.ink, a: T.rust }, { fabric: 'moss', c: T.bone, a: T.sun }],
  },
];

// ---------- output ----------
const svgDoc = (d) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w.toFixed(2)}mm" height="${d.h.toFixed(2)}mm" viewBox="0 0 ${d.w.toFixed(3)} ${d.h.toFixed(3)}">\n${d.body}\n</svg>\n`;

// Flat preview: the design at true scale on a 110 x 80 mm piece of fabric.
const PX = 4; // px per mm
function preview(d, fabric) {
  const W = 110, H = 80;
  const x = (W - d.w) / 2, y = (H - d.h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * PX}" height="${H * PX}">
<defs>
  <pattern id="twill" width="1.2" height="1.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="1.2" height="0.6" fill="#000" opacity=".045"/>
  </pattern>
  <filter id="raise" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="0.18" stdDeviation="0.12" flood-color="#000" flood-opacity=".35"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="${fabric}"/>
<rect width="${W}" height="${H}" fill="url(#twill)"/>
<g filter="url(#raise)"><svg x="${x}" y="${y}" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}" overflow="visible">${d.body}</svg></g>
</svg>`;
}

async function main() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const index = [];
  for (const des of DESIGNS) {
    const dir = path.join(OUT, des.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const colorways = [];
    for (const [i, cw] of des.colorways.entries()) {
      const d = des.make(cw);
      const name = cw.fabric;
      fs.writeFileSync(path.join(dir, i === 0 ? 'design.svg' : `design-${name}.svg`), svgDoc(d));
      await page.setContent(`<html><body style="margin:0">${preview(d, F[cw.fabric])}</body></html>`);
      await (await page.$('svg')).screenshot({ path: path.join(dir, `preview-${name}.png`) });
      colorways.push({ fabric: name, fabricHex: F[cw.fabric], file: `preview-${name}.png`, svg: i === 0 ? 'design.svg' : `design-${name}.svg` });
      if (i === 0) index.push({ slug: des.slug, name: des.name, group: des.group, idea: des.idea, placement: des.placement, size: { w: +d.w.toFixed(1), h: +d.h.toFixed(1) }, colorways });
    }
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ threads: T, fabrics: F, designs: index }, null, 2) + '\n');
  await browser.close();
  console.log(index.map((i) => `${i.slug}  ${i.size.w} x ${i.size.h} mm  (${i.colorways.map((c) => c.fabric).join(', ')})`).join('\n'));
}

main().catch((e) => { console.error(e); process.exit(1); });
