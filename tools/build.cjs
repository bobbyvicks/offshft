// Generates every OFF SHFT design as an embroidery-ready SVG (text converted
// to outlines, flat colours, sizes in mm) and renders hat mockups to PNG.
//
//   cd tools && npm install && node build.cjs
//
// Output goes to ../designs/<slug>/.

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'designs');
const anton = opentype.loadSync(path.join(__dirname, 'fonts/Anton.ttf'));

// ---------- palette ----------
const THREAD = {
  cream: '#F1E9D6',
  orange: '#E8641B',
  navy: '#1F2A44',
  gold: '#D4A53C',
  black: '#1E1E1E',
};
const HAT = {
  navy: '#222C45',
  black: '#1C1C1E',
  stone: '#CFC3A6',
  khaki: '#B9A27A',
  forest: '#2F4A3A',
  charcoal: '#3B3C40',
  white: '#F3F1EC',
};

// ---------- text helpers (outlined glyphs) ----------
const UPM = anton.unitsPerEm;
const CAP = anton.tables.os2.sCapHeight;
const sizeForCap = (capMM) => (capMM * UPM) / CAP;

function layout(str, size, tracking = 0) {
  const glyphs = anton.stringToGlyphs(str);
  const pos = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    pos.push(x);
    x += (g.advanceWidth * size) / UPM;
    if (glyphs[i + 1]) x += (anton.getKerningValue(g, glyphs[i + 1]) * size) / UPM;
    x += tracking;
  });
  return { glyphs, pos, width: x - tracking };
}

// Straight text. anchor: 'start' | 'middle' | 'end'. y is the baseline.
function text(str, { x, y, cap, fill, anchor = 'middle', tracking = 0 }) {
  const size = sizeForCap(cap);
  const L = layout(str, size, tracking);
  const x0 = anchor === 'middle' ? x - L.width / 2 : anchor === 'end' ? x - L.width : x;
  const d = L.glyphs.map((g, i) => g.getPath(x0 + L.pos[i], y, size).toPathData(3)).join('');
  return `<path fill="${fill}" d="${d}"/>`;
}
const textWidth = (str, cap, tracking = 0) => layout(str, sizeForCap(cap), tracking).width;

// Text on a circle. side 'top': baseline on radius r, letters point outward.
// side 'bottom': baseline on radius r, letters point toward the centre.
function arcText(str, { cx, cy, r, cap, fill, side = 'top', tracking = 0 }) {
  const size = sizeForCap(cap);
  const L = layout(str, size, tracking);
  return L.glyphs
    .map((g, i) => {
      const w = (g.advanceWidth * size) / UPM;
      const s = L.pos[i] + w / 2 - L.width / 2; // arc-length offset of glyph centre
      const d = g.getPath(0, 0, size).toPathData(3);
      if (side === 'top') {
        const a = ((s / r) * 180) / Math.PI;
        return `<path fill="${fill}" d="${d}" transform="translate(${cx} ${cy}) rotate(${a.toFixed(3)}) translate(${(-w / 2).toFixed(3)} ${-r})"/>`;
      }
      const a = ((-s / r) * 180) / Math.PI;
      return `<path fill="${fill}" d="${d}" transform="translate(${cx} ${cy}) rotate(${a.toFixed(3)}) translate(${(-w / 2).toFixed(3)} ${r + sizeForCap(cap) * CAP / UPM})"/>`;
    })
    .join('');
}

// Fit a single line into a width by choosing the cap height.
const capToFit = (str, maxW, maxCap, tracking = 0) =>
  Math.min(maxCap, (maxCap * maxW) / textWidth(str, maxCap, tracking));

function svgDoc(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}">\n${body}\n</svg>\n`;
}

// ---------- icons ----------
function walleye({ x = 0, y = 0, s = 1, body = THREAD.gold, light = THREAD.cream, dark = THREAD.black }) {
  // Drawn facing right in a 100 x 44 box.
  const bodyPath =
    'M96 25 C93 19 86 14.5 76 13.2 C62 11.5 44 12.5 30 16.5 C24 18.2 19.5 20 16.5 21.2 L16.5 27.2 C22 30.5 34 34.5 50 35.2 C64 35.8 78 34 86 31 C91 29.2 94.5 27 96 25 Z';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <defs><clipPath id="wb"><path d="${bodyPath}"/></clipPath></defs>
  <!-- fins (behind body) -->
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M65 13.6 L63.2 4.6 Q61.4 8.4 59.6 4.2 Q57.8 8.2 55.8 4.6 Q53.9 8.6 51.8 5.6 Q49.8 9.4 47.6 7.4 L44 14.4 Z"/>
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M41 14.6 C38.5 7.5 30 7.6 25.5 16.6 Z"/>
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M37 34.4 C34 40 28 40 24.5 30.6 Z"/>
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M69 34.4 L61.5 40.5 L63.5 34.8 Z"/>
  <!-- tail -->
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M18 21 C13 17 8 12.5 2.5 9 C5 15.5 7.2 20 9.6 24.2 C7.2 28.4 5 33 2.5 39.5 C8 36 13 31.5 18 27.4 Z"/>
  <path fill="${light}" d="M2.5 39.5 C4.6 37.4 6.6 35.6 8.6 34 L9.6 36.2 C7.2 37.6 4.8 38.7 2.5 39.5 Z"/>
  <!-- body -->
  <path fill="${body}" d="${bodyPath}"/>
  <g clip-path="url(#wb)">
    <path fill="${light}" d="M100 27 C88 33.5 66 36.5 44 34 C32 32.6 22 29.6 14 26.6 L14 40 L100 40 Z"/>
    <path fill="${dark}" d="M73 10 L79 10 L74.5 21 L70 21 Z M58 10 L65 10 L60 22.5 L55 22.5 Z M43 10 L50 10 L46 22.5 L41 22.5 Z M28 12 L34 12 L31 21.5 L27 21.5 Z"/>
  </g>
  <path fill="none" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="${bodyPath}"/>
  <!-- gill, mouth, eye -->
  <path fill="none" stroke="${dark}" stroke-width="1.5" stroke-linecap="round" d="M79.5 15.5 C76.5 20 76.5 26.5 80 31"/>
  <path fill="none" stroke="${dark}" stroke-width="1.5" stroke-linecap="round" d="M95.5 25.2 L88.5 26.6"/>
  <circle cx="86.2" cy="19.6" r="3.4" fill="${light}" stroke="${dark}" stroke-width="1.5"/>
  <circle cx="86.8" cy="19.4" r="1.4" fill="${dark}"/>
  <!-- pectoral fin over body -->
  <path fill="${body}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round" d="M75 25 C71 27.5 67.5 30 65 32.5 C70 32 73.5 30 75.8 27.2 Z"/>
</g>`;
}

function smallFish({ x, y, s = 1, fill, hole }) {
  // 30 x 14 box, facing right, with eye cut out.
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path fill="${fill}" d="M29 7 C26 2.5 20 0.8 14 1.2 C10.5 1.5 8 3 6.6 4.4 L1 0.6 L2.8 7 L1 13.4 L6.6 9.6 C8 11 10.5 12.5 14 12.8 C20 13.2 26 11.5 29 7 Z"/>
  <circle cx="23.5" cy="5.6" r="1.4" fill="${hole}"/>
</g>`;
}

function golfFlag({ x, y, s = 1, pole, flag, ground }) {
  // 22 x 26 box
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="9" y="1" width="2" height="21" fill="${pole}"/>
  <path fill="${flag}" d="M11 1 L21 5.5 L11 10 Z"/>
  <path fill="${ground}" d="M1 23.5 C5 21.2 17 21.2 21 23.5 C17 25.8 5 25.8 1 23.5 Z"/>
</g>`;
}

function ballOnTee({ x, y, s = 1, ball, tee }) {
  // 8 x 16 box
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="4" cy="4" r="3.6" fill="${ball}"/>
  <path fill="${tee}" d="M0.6 8 L7.4 8 L5 10 L4.6 15.6 L3.4 15.6 L3 10 Z"/>
</g>`;
}

function canoe({ x, y, s = 1, hull, paddle, stripe }) {
  // 70 x 20 box: paddle leaning behind a canoe with raised bow and stern.
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path fill="${paddle}" d="M17.2 2.6 L18.6 1 L53 15.4 L52 17 Z"/>
  <path fill="${paddle}" d="M9.4 -1.6 C12.6 -3 17.6 -1 20 1.4 C21.2 2.8 20.6 4 19 4.2 C15.4 4.6 10.6 2.6 9 0.6 C8.4 -0.4 8.6 -1.2 9.4 -1.6 Z"/>
  <path fill="${hull}" d="M0.6 4.2 Q2.4 1.6 5.6 6.4 L64.4 6.4 Q67.6 1.6 69.4 4.2 C66.6 13.4 52 16.6 35 16.6 C18 16.6 3.4 13.4 0.6 4.2 Z"/>
  <path fill="${stripe}" d="M6.6 8.6 L63.4 8.6 C62.6 9.6 61.8 10.2 61 10.6 L9 10.6 C8.2 10.2 7.4 9.6 6.6 8.6 Z"/>
</g>`;
}

// ---------- designs ----------
// Each returns { w, h, svgBody } in mm.

function wordmark({ off, shft, width = 86 }) {
  const cap = capToFit('OFF SHFT', width, 30, 1.2);
  const h = cap + 2;
  const wOff = textWidth('OFF', cap, 1.2);
  const space = cap * 0.28;
  const total = wOff + space + textWidth('SHFT', cap, 1.2);
  const x0 = (width - total) / 2 + 1;
  return {
    w: width + 2,
    h,
    body:
      text('OFF', { x: x0, y: h - 1, cap, fill: off, anchor: 'start', tracking: 1.2 }) +
      text('SHFT', { x: x0 + wOff + space, y: h - 1, cap, fill: shft, anchor: 'start', tracking: 1.2 }),
  };
}

function clockBadge({ ring, ringText, face, ticks, hands }) {
  const R = 22, r = 14, c = 22.5;
  const tick = [];
  for (let i = 0; i < 12; i++) {
    const a = i * 30;
    if (i % 3 === 0)
      tick.push(`<rect x="${c - 0.8}" y="${c - r + 1.6}" width="1.6" height="3.4" fill="${ticks}" transform="rotate(${a} ${c} ${c})"/>`);
    else tick.push(`<circle cx="${c}" cy="${c - r + 2.6}" r="0.9" fill="${ticks}" transform="rotate(${a} ${c} ${c})"/>`);
  }
  return {
    w: 45,
    h: 45,
    body: `<circle cx="${c}" cy="${c}" r="${R}" fill="${ring}"/>
<circle cx="${c}" cy="${c}" r="${r}" fill="${face}"/>
${arcText('OFF SHFT', { cx: c, cy: c, r: r + 1.3, cap: 6, fill: ringText, side: 'top', tracking: 1.4 })}
${arcText('EARNED IT', { cx: c, cy: c, r: r + 1.3, cap: 5.4, fill: ringText, side: 'bottom', tracking: 1.1 })}
<circle cx="${c - R + 4}" cy="${c}" r="1.1" fill="${ringText}"/><circle cx="${c + R - 4}" cy="${c}" r="1.1" fill="${ringText}"/>
${tick.join('')}
<rect x="${c - 1}" y="${c - 7.2}" width="2" height="8" rx="1" fill="${hands}" transform="rotate(150 ${c} ${c})"/>
<rect x="${c - 0.8}" y="${c - 10.4}" width="1.6" height="11.2" rx="0.8" fill="${hands}"/>
<circle cx="${c}" cy="${c}" r="1.8" fill="${ticks}"/>`,
  };
}

function punchCard() {
  const W = 76, H = 44;
  const { navy, cream, orange } = THREAD;
  const stampCap = capToFit('OFF SHFT', 31, 8, 0.8);
  return {
    w: W,
    h: H,
    body: `<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="2.5" fill="${cream}" stroke="${navy}" stroke-width="1.5"/>
<path fill="${navy}" d="M0 3.25 A3.25 3.25 0 0 1 3.25 0 L${W - 3.25} 0 A3.25 3.25 0 0 1 ${W} 3.25 L${W} 11 L0 11 Z"/>
${text('TIME CARD', { x: 6, y: 8.5, cap: 6, fill: cream, anchor: 'start', tracking: 1 })}
<circle cx="${W - 7}" cy="5.5" r="2.4" fill="${cream}"/>
${text('IN', { x: 6, y: 22, cap: 6.2, fill: navy, anchor: 'start', tracking: 0.6 })}
${text('07:00', { x: W - 6, y: 22, cap: 6.2, fill: navy, anchor: 'end', tracking: 0.6 })}
<rect x="5" y="25.2" width="${W - 10}" height="1.5" fill="${navy}"/>
${text('OUT', { x: 6, y: 37.5, cap: 6.2, fill: navy, anchor: 'start', tracking: 0.6 })}
<g transform="rotate(-4 ${W - 25} 34)">
  <rect x="${W - 43}" y="28.2" width="36" height="11.6" rx="1" fill="${orange}"/>
  ${text('OFF SHFT', { x: W - 25, y: 34 + stampCap / 2, cap: stampCap, fill: cream, tracking: 0.8 })}
</g>`,
  };
}

function twoLine({ top, bottom, topCap, bottomCap, topFill, bottomFill, width = 96, gap = 3, after }) {
  const bCap = capToFit(bottom, width - (after ? after.w + 3 : 0), bottomCap, 0.8);
  const tCap = capToFit(top, width, topCap, 1.4);
  const h = tCap + gap + bCap + 2;
  const bW = textWidth(bottom, bCap, 0.8) + (after ? after.w + 3 : 0);
  const cx = width / 2 + 1;
  let body = text(top, { x: cx, y: tCap + 1, cap: tCap, fill: topFill, tracking: 1.4 });
  body += text(bottom, { x: cx - bW / 2, y: h - 1, cap: bCap, fill: bottomFill, anchor: 'start', tracking: 0.8 });
  if (after) body += after.draw(cx + bW / 2 - after.w, h - 1);
  return { w: width + 2, h, body };
}

function mulligan() {
  const navy = THREAD.navy, orange = THREAD.orange;
  const W = 98, cx = W / 2;
  const R = 120;
  const cap1 = 13;
  const cap2 = 8;
  const top = arcText('MULLIGAN', { cx, cy: R + cap1 + 1.5, r: R, cap: cap1, fill: navy, side: 'top', tracking: 1.2 });
  const y2 = cap1 + 6 + cap2 + 2;
  const w2 = textWidth('MONDAY', cap2, 2.4);
  const bar = (x) => `<rect x="${x}" y="${y2 - cap2 / 2 - 0.9}" width="12" height="1.8" fill="${orange}"/>`;
  return {
    w: W,
    h: y2 + 1.5,
    body: top + text('MONDAY', { x: cx, y: y2, cap: cap2, fill: navy, tracking: 2.4 }) + bar(cx - w2 / 2 - 16) + bar(cx + w2 / 2 + 4),
  };
}

function outOfOffice() {
  const { cream, orange } = THREAD;
  const W = 96;
  const cap = capToFit('OUT OF OFFICE', W, 12, 1.2);
  const canoeS = 0.82;
  const ch = 20 * canoeS;
  const h = ch + 6 + cap + 2;
  return {
    w: W + 2,
    h,
    body: canoe({ x: (W + 2 - 70 * canoeS) / 2, y: 3.5, s: canoeS, hull: orange, paddle: cream, stripe: cream }) +
      text('OUT OF OFFICE', { x: (W + 2) / 2, y: h - 1, cap, fill: cream, tracking: 1.2 }),
  };
}

function dockHours() {
  const { navy, cream, orange } = THREAD;
  const R = 22, r = 14, c = 22.5;
  const hz = c + 2; // horizon
  return {
    w: 45,
    h: 45,
    body: `<defs><clipPath id="dh"><circle cx="${c}" cy="${c}" r="${r}"/></clipPath></defs>
<circle cx="${c}" cy="${c}" r="${R}" fill="${navy}"/>
<circle cx="${c}" cy="${c}" r="${r}" fill="${cream}"/>
<g clip-path="url(#dh)">
  <path fill="${orange}" d="M${c - 8} ${hz} A8 8 0 0 1 ${c + 8} ${hz} Z"/>
  <rect x="${c - 9}" y="${hz - 3.2}" width="18" height="1.5" fill="${cream}"/>
  <rect x="${c - 9}" y="${hz - 6.2}" width="18" height="1.5" fill="${cream}"/>
  <rect x="${c - r}" y="${hz}" width="${2 * r}" height="${r}" fill="${navy}"/>
  <rect x="${c - 11}" y="${hz + 2.6}" width="6" height="1.5" fill="${cream}"/>
  <rect x="${c + 5}" y="${hz + 2.6}" width="6" height="1.5" fill="${cream}"/>
  <path fill="${cream}" d="M${c - 1.8} ${hz + 1} L${c + 1.8} ${hz + 1} L${c + 6.5} ${c + r} L${c - 6.5} ${c + r} Z"/>
  <rect x="${c - 4.6}" y="${hz + 5.8}" width="9.2" height="1.5" fill="${navy}"/>
  <rect x="${c - 6}" y="${hz + 9.6}" width="12" height="1.5" fill="${navy}"/>
</g>
${arcText('DOCK HOURS', { cx: c, cy: c, r: r + 1.3, cap: 6, fill: cream, side: 'top', tracking: 1.1 })}
${arcText('OPEN AFTER 5', { cx: c, cy: c, r: r + 1.3, cap: 5.2, fill: cream, side: 'bottom', tracking: 0.9 })}
<circle cx="${c - R + 4}" cy="${c}" r="1.1" fill="${orange}"/><circle cx="${c + R - 4}" cy="${c}" r="1.1" fill="${orange}"/>`,
  };
}

function backWordmark(fill, width = 46) {
  const cap = capToFit('OFF SHFT', width, 12, 0.8);
  return { w: width + 2, h: cap + 2, body: text('OFF SHFT', { x: width / 2 + 1, y: cap + 1, cap, fill, tracking: 0.8 }) };
}

// ---------- hat mockups ----------
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

const CROWN = 'M112 318 C100 168 188 86 300 84 C412 86 500 168 488 318 Z';
const FRONT_PANEL = 'M176 322 C178 182 232 102 300 94 C368 102 422 182 424 322 Z';

function hatFront({ color, style, mesh, design }) {
  const dark = shade(color, -0.12), darker = shade(color, -0.22), light = shade(color, 0.07);
  const isTrucker = style === 'trucker';
  const meshColor = mesh || color;
  const seams = style === 'trucker' ? '' : `<path d="M300 90 L300 318" stroke="${darker}" stroke-width="2.2" fill="none" opacity=".55"/>`;
  const sideSeams = `<path d="M300 88 C232 104 182 196 172 320 M300 88 C368 104 418 196 428 320" stroke="${darker}" stroke-width="2.2" fill="none" opacity=".5"/>`;
  const eyelets = `<circle cx="222" cy="150" r="4" fill="${darker}"/><circle cx="378" cy="150" r="4" fill="${darker}"/>`;
  // design placement: centre of front panel
  const scale = 2.25; // px per mm
  let designG = '';
  if (design) {
    const dw = design.w * scale, dh = design.h * scale;
    const cx = 300, cy = isTrucker ? 222 : 214;
    designG = `<g filter="url(#emb)"><svg x="${cx - dw / 2}" y="${cy - dh / 2}" width="${dw}" height="${dh}" viewBox="0 0 ${design.w} ${design.h}">${design.body}</svg></g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 470" width="600" height="470">
<defs>
  <radialGradient id="lt" cx="38%" cy="28%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
  <linearGradient id="br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
  <pattern id="mesh" width="9" height="8" patternUnits="userSpaceOnUse"><rect width="9" height="8" fill="${shade(meshColor, -0.05)}"/><circle cx="4.5" cy="4" r="2.4" fill="${shade(meshColor, -0.3)}"/></pattern>
  <filter id="emb" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.4" stdDeviation="1" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
  <clipPath id="crown"><path d="${CROWN}"/></clipPath>
</defs>
<ellipse cx="300" cy="426" rx="215" ry="18" fill="#000" opacity=".18" filter="url(#soft)"/>
<path d="${CROWN}" fill="${isTrucker ? 'url(#mesh)' : color}"/>
${isTrucker ? `<path d="${FRONT_PANEL}" fill="${color}"/>` : ''}
${sideSeams}${seams}${isTrucker ? '' : eyelets}
<path d="${CROWN}" fill="url(#lt)"/>
${designG}
<ellipse cx="300" cy="86" rx="13" ry="7" fill="${isTrucker ? color : dark}"/>
<path d="M114 314 C200 298 400 298 486 314 C506 334 464 404 300 410 C136 404 94 334 114 314 Z" fill="url(#br)"/>
<path d="M126 330 C200 316 400 316 474 330 M140 348 C210 336 390 336 460 348 M160 366 C220 356 380 356 440 366" stroke="${darker}" stroke-width="1.6" stroke-dasharray="5 4" fill="none" opacity=".55"/>
<path d="M114 314 C200 298 400 298 486 314" stroke="${shade(color, 0.12)}" stroke-width="2" fill="none" opacity=".5"/>
</svg>`;
}

function hatBack({ color, style, mesh, design }) {
  const dark = shade(color, -0.12), darker = shade(color, -0.22);
  const isTrucker = style === 'trucker';
  const meshColor = mesh || color;
  const scale = 2.25;
  let designG = '';
  if (design) {
    const dw = design.w * scale, dh = design.h * scale;
    designG = `<g filter="url(#emb)"><svg x="${300 - dw / 2}" y="${236 - dh / 2}" width="${dw}" height="${dh}" viewBox="0 0 ${design.w} ${design.h}">${design.body}</svg></g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 470" width="600" height="470">
<defs>
  <radialGradient id="lt" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
  <pattern id="mesh" width="9" height="8" patternUnits="userSpaceOnUse"><rect width="9" height="8" fill="${shade(meshColor, -0.05)}"/><circle cx="4.5" cy="4" r="2.4" fill="${shade(meshColor, -0.3)}"/></pattern>
  <filter id="emb" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.4" stdDeviation="1" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<ellipse cx="300" cy="402" rx="200" ry="16" fill="#000" opacity=".16" filter="url(#soft)"/>
<path d="M98 340 C96 176 188 96 300 94 C412 96 504 176 502 340 C470 380 130 380 98 340 Z" fill="${isTrucker ? 'url(#mesh)' : color}"/>
<path d="M300 98 L300 290 M300 98 C232 114 182 206 168 352 M300 98 C368 114 418 206 432 352" stroke="${darker}" stroke-width="2.2" fill="none" opacity=".5"/>
<path d="M98 340 C96 176 188 96 300 94 C412 96 504 176 502 340 C470 380 130 380 98 340 Z" fill="url(#lt)"/>
<path d="M236 372 C236 300 364 300 364 372 Z" fill="${shade(color, -0.45)}"/>
<path d="M226 330 C260 318 340 318 374 330 L374 346 C340 334 260 334 226 346 Z" fill="${isTrucker ? '#2A2A2A' : dark}"/>
<circle cx="262" cy="331" r="3" fill="${darker}"/><circle cx="282" cy="328" r="3" fill="${darker}"/><circle cx="318" cy="328" r="3" fill="${darker}"/><circle cx="338" cy="331" r="3" fill="${darker}"/>
${designG}
<ellipse cx="300" cy="96" rx="13" ry="7" fill="${isTrucker ? color : dark}"/>
</svg>`;
}

function swatch({ color, design, size = 220 }) {
  const pad = 26;
  const s = (size - 2 * pad) / Math.max(design.w, design.h);
  const dw = design.w * s, dh = design.h * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" rx="18" fill="${color}"/>
<svg x="${(size - dw) / 2}" y="${(size - dh) / 2}" width="${dw}" height="${dh}" viewBox="0 0 ${design.w} ${design.h}">${design.body}</svg>
</svg>`;
}

// ---------- catalogue ----------
const wmDark = wordmark({ off: THREAD.orange, shft: THREAD.cream });
const wmLight = wordmark({ off: THREAD.orange, shft: THREAD.navy });
const badgeLight = clockBadge({ ring: THREAD.navy, ringText: THREAD.cream, face: THREAD.cream, ticks: THREAD.navy, hands: THREAD.orange });
const badgeDark = clockBadge({ ring: THREAD.cream, ringText: THREAD.navy, face: THREAD.navy, ticks: THREAD.cream, hands: THREAD.orange });
const card = punchCard();

const ENTRIES = [
  {
    slug: 'logo-a-wordmark',
    front: wmLight,
    mockups: [
      { name: 'navy', color: HAT.navy, style: 'snapback', design: wmDark },
      { name: 'khaki', color: HAT.khaki, style: 'snapback', design: wmLight },
      { name: 'black', color: HAT.black, style: 'snapback', design: wmDark },
    ],
    extraSvgs: { 'design-dark-hats.svg': wmDark },
  },
  {
    slug: 'logo-b-clock',
    front: badgeLight,
    mockups: [
      { name: 'navy', color: HAT.navy, style: 'dad', design: badgeDark },
      { name: 'khaki', color: HAT.khaki, style: 'dad', design: badgeLight },
      { name: 'black', color: HAT.black, style: 'dad', design: badgeDark },
    ],
    extraSvgs: { 'design-dark-hats.svg': badgeDark },
  },
  {
    slug: 'logo-c-punchcard',
    front: card,
    mockups: [
      { name: 'navy', color: HAT.navy, style: 'snapback', design: card },
      { name: 'khaki', color: HAT.khaki, style: 'snapback', design: card },
      { name: 'black', color: HAT.black, style: 'snapback', design: card },
    ],
  },
  {
    slug: '01-wordmark',
    front: wmDark,
    mockups: [
      { name: 'navy', color: HAT.navy, style: 'snapback', design: wmDark },
      { name: 'black', color: HAT.black, style: 'snapback', design: wmDark },
    ],
  },
  {
    slug: '02-time-clock-badge',
    front: badgeLight,
    back: backWordmark(THREAD.navy),
    mockups: [
      { name: 'stone', color: HAT.stone, style: 'dad', design: badgeLight },
      { name: 'forest', color: HAT.forest, style: 'dad', design: badgeDark },
    ],
    backMockup: { color: HAT.stone, style: 'dad' },
    extraSvgs: { 'design-dark-hats.svg': badgeDark },
  },
  {
    slug: '03-lines-in',
    front: twoLine({ top: 'PUNCHED OUT.', bottom: 'LINES IN.', topCap: 7.5, bottomCap: 17, topFill: THREAD.cream, bottomFill: THREAD.orange, width: 86 }),
    side: smallFishDesign(),
    mockups: [{ name: 'charcoal', color: HAT.charcoal, style: 'trucker', mesh: '#E9E6DF' }],
  },
  {
    slug: '04-walleye-shift',
    front: { w: 100, h: 44, body: walleye({}) },
    back: backWordmark(THREAD.cream),
    mockups: [{ name: 'forest', color: HAT.forest, style: 'dad' }],
    backMockup: { color: HAT.forest, style: 'dad' },
  },
  {
    slug: '05-tees-up',
    front: twoLine({
      top: "SHIFT'S OVER.", bottom: "TEE'S UP", topCap: 7.5, bottomCap: 15, topFill: THREAD.navy, bottomFill: THREAD.navy, width: 80,
      after: { w: 8, draw: (x, base) => ballOnTee({ x, y: base - 15.6, ball: THREAD.orange, tee: THREAD.navy }) },
    }),
    side: { w: 22, h: 26, body: golfFlag({ x: 0, y: 0, pole: THREAD.navy, flag: THREAD.orange, ground: THREAD.navy }) },
    mockups: [
      { name: 'white', color: HAT.white, style: 'performance' },
      { name: 'navy', color: HAT.navy, style: 'performance', recolor: { [THREAD.navy]: THREAD.cream } },
    ],
  },
  {
    slug: '06-mulligan-monday',
    front: mulligan(),
    back: backWordmark(THREAD.navy),
    mockups: [{ name: 'khaki', color: HAT.khaki, style: 'snapback' }],
    backMockup: { color: HAT.khaki, style: 'snapback' },
  },
  {
    slug: '07-out-of-office',
    front: outOfOffice(),
    mockups: [{ name: 'forest', color: HAT.forest, style: 'dad' }],
  },
  {
    slug: '08-dock-hours',
    front: dockHours(),
    back: backWordmark(THREAD.navy),
    mockups: [{ name: 'stone', color: HAT.stone, style: 'trucker', mesh: '#E9E6DF' }],
    backMockup: { color: HAT.stone, style: 'trucker', mesh: '#E9E6DF' },
  },
];

function smallFishDesign() {
  return { w: 32, h: 16, body: smallFish({ x: 1, y: 1, fill: THREAD.cream, hole: HAT.charcoal }) };
}

function recolor(design, map) {
  if (!map) return design;
  let body = design.body;
  for (const [a, b] of Object.entries(map)) body = body.split(a).join(b);
  return { ...design, body };
}

// ---------- write files + render ----------
async function main() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  async function png(svg, file, bg = '#ECE8E1') {
    await page.setContent(`<html><body style="margin:0;background:${bg};display:inline-block">${svg}</body></html>`);
    const el = await page.$('svg');
    await el.screenshot({ path: file, omitBackground: false });
  }

  const index = [];
  for (const e of ENTRIES) {
    const dir = path.join(OUT, e.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'design.svg'), svgDoc(e.front.w, e.front.h, e.front.body));
    if (e.back) fs.writeFileSync(path.join(dir, 'back.svg'), svgDoc(e.back.w, e.back.h, e.back.body));
    if (e.side) fs.writeFileSync(path.join(dir, 'side.svg'), svgDoc(e.side.w, e.side.h, e.side.body));
    for (const [name, d] of Object.entries(e.extraSvgs || {})) fs.writeFileSync(path.join(dir, name), svgDoc(d.w, d.h, d.body));

    const files = [];
    for (const m of e.mockups) {
      const d = recolor(m.design || e.front, m.recolor);
      const f = `mockup-${m.name}.png`;
      await png(hatFront({ color: m.color, style: m.style, mesh: m.mesh, design: d }), path.join(dir, f));
      files.push(f);
    }
    if (e.back && e.backMockup) {
      await png(hatBack({ ...e.backMockup, design: e.back }), path.join(dir, 'mockup-back.png'));
      files.push('mockup-back.png');
    }
    if (e.side) {
      const sideColor = e.mockups[0].color;
      await png(swatch({ color: sideColor, design: e.side }), path.join(dir, 'side.png'), 'transparent');
      files.push('side.png');
    }
    index.push({ slug: e.slug, size: { w: +e.front.w.toFixed(1), h: +e.front.h.toFixed(1) }, files });
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  await browser.close();
  console.log(index.map((i) => `${i.slug}  ${i.size.w}x${i.size.h}mm  ${i.files.join(', ')}`).join('\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
