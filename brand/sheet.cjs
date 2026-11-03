// The one-page brand sheet: sheet.html (also published for the owner) and offshft-brand-sheet.pdf.
//   cd /home/user/offshft/tools && node ../brand/sheet.cjs        (after build.cjs)
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const uri = (rel) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(DIR, rel)).toString('base64');
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ');

const THREAD = [['Ink', '#1F2733', 'Letters and ring. Printful standard: Black 1800, a fair match'], ['Bone', '#ECE5D3', 'Letters on dark; screen background. Printful standard: White 1801, no close match'], ['Rust', '#B4552D', 'Hands and dot on light. Printful standard: Orange 1987, no close match'], ['Sun', '#D29B3C', 'Hands and dot on dark. Printful standard: Old Gold 1672, no close match'], ['Sage', '#9AA383', 'Spare accent. Printful standard: Kiwi Green 1848, no close match']];
const FABRIC = [['Bone', '#E4DDCB', 'Ink + Rust'], ['Oat', '#C7B48E', 'Ink + Rust after a sew-out, or Ink'], ['Moss', '#5A5F40', 'Bone, one colour'], ['Spruce', '#2E3D35', 'Bone + Sun'], ['Slate', '#27303D', 'Bone + Sun'], ['Rust', '#8E4426', 'Bone, one colour']];
const LOGOS = [
  { name: 'One-line logo', file: 'logo/offshft-logo-light.svg', dark: 'logo/offshft-logo-dark.svg', col: true, use: 'Hat fronts, the website header, packaging, anything wide.', min: 'Embroidered: 62.6 mm wide (letters 7 mm, the smallest size with the pivot dot), from the drawing made for that size. Screens: 80 px wide.' },
  { name: 'Stacked logo', file: 'stacked/offshft-stacked-light.svg', dark: 'stacked/offshft-stacked-dark.svg', use: 'Every square or circle: profile pictures, app icon, Shopify square logo, round patches and stickers.', min: 'Drawn for 40 px and up. Smaller, the app shows the name beside it.' },
  { name: 'Clock', file: 'clock/offshft-clock-light.svg', dark: 'clock/offshft-clock-dark.svg', use: 'Hat backs and sides (the side master there), patches and stickers cut to its outline. Not the main profile picture.', min: 'Embroidered: 25 mm tall (this file); smallest 19 mm, two colours or one (one colour has no dot). Screens: 48 px tall.' },
  { name: 'Tab icon', file: 'icons/favicon-48.svg', dark: null, use: 'The browser tab only. Redrawn on the pixel grid at 16, 32 and 48 px (shown at 48).', min: 'Use the size it was drawn for; never scale it.', pixel: true },
];
const DONT = [
  'Put the hands inside the ring, crop them or shorten them. Only the tiny side and tab drawings shorten them.',
  'Make the clock alone your profile picture or app icon. Squares get the stacked logo.',
  'Stretch, redraw, outline, add shadows or set the name in another font.',
  'Use colour pairs other than the ones in the fabric table.',
  'Scale an embroidery file or the tab icon: each size has its own drawing.',
];

const swatch = ([name, hex, note], light) => `<div class="sw"><span class="chip" style="background:${hex}"></span><div><b>${name}</b><span class="code">${hex}</span><span class="code">RGB ${hex2rgb(hex)}</span><span class="note">${note}</span></div></div>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OFF SHFT Brand Sheet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Unbounded:wght@700&display=swap" rel="stylesheet">
<style>
/* The brand's own palette and type. Layout: logos, then colours, then type and rules; one printed Letter page. */
:root {
  --bg: #ECE5D3; --paper: #F6F2E8; --ink: #1F2733; --muted: #59606B; --line: #D6CDB8; --rust: #B4552D; --slate: #27303D;
  --display: "Unbounded", "Arial Black", system-ui, sans-serif; --body: "Archivo", "Helvetica Neue", Arial, sans-serif;
  color-scheme: light;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 400 14px/1.45 var(--body); }
main { max-width: 1000px; margin: 0 auto; padding: 32px max(16px, env(safe-area-inset-right, 0px)) 40px max(16px, env(safe-area-inset-left, 0px)); display: grid; gap: 26px; }
header { display: flex; align-items: end; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-bottom: 2px solid var(--ink); padding-bottom: 14px; }
header img { height: 44px; width: auto; display: block; }
header p { margin: 0; color: var(--muted); max-width: 40ch; }
h2 { font: 700 12px/1.3 var(--display); letter-spacing: .12em; text-transform: uppercase; margin: 0 0 10px; }
section { display: grid; gap: 0; }
.logos { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.card { background: var(--paper); border: 1px solid var(--line); display: grid; grid-template-rows: auto 1fr; }
.art { display: grid; grid-template-columns: 1fr 1fr; height: 120px; }
.art > div { display: grid; place-items: center; padding: 14px; background: var(--bg); }
.art > div.dk { background: var(--slate); }
.art.solo { grid-template-columns: 1fr; }
.art.col { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
.art.col img { max-height: 30px; }
.art img { max-width: 100%; max-height: 82px; display: block; }
.art img.pixel { image-rendering: pixelated; width: 48px; height: 48px; }
.card .txt { padding: 12px; display: grid; gap: 6px; align-content: start; }
.card b { font-weight: 700; font-size: 15px; }
.card p { margin: 0; }
.card .min { color: var(--muted); font-size: 13px; }
.colours { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.sws { display: grid; gap: 8px; }
.sw { display: grid; grid-template-columns: 40px 1fr; gap: 10px; align-items: center; }
.chip { width: 40px; height: 40px; display: block; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.sw div { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: baseline; }
.sw b { min-width: 52px; }
.code { font-variant-numeric: tabular-nums; color: var(--ink); font-size: 13px; }
.note { color: var(--muted); font-size: 13px; width: 100%; }
.sub { margin: 0 0 8px; color: var(--muted); }
.lower { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 18px; }
.type .u { font: 700 26px/1.1 var(--display); letter-spacing: .12em; margin: 2px 0 6px; }
.type .a { font: 400 15px/1.45 var(--body); margin: 0 0 4px; }
.type p { margin: 0 0 6px; }
.small { color: var(--muted); font-size: 13px; }
ul { margin: 0; padding-left: 18px; display: grid; gap: 5px; }
.space { display: grid; place-items: center; background: var(--paper); border: 1px solid var(--line); padding: 10px; margin-bottom: 8px; }
.space div { outline: 1.5px dashed var(--rust); outline-offset: 0; padding: 14px; }
.space img { height: 30px; display: block; }
footer { color: var(--muted); font-size: 12px; border-top: 1px solid var(--line); padding-top: 10px; }
@media (max-width: 820px) { .logos { grid-template-columns: repeat(2, minmax(0, 1fr)); } .colours, .lower { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 460px) { .logos { grid-template-columns: minmax(0, 1fr); } }
@page { size: letter; margin: 0.45in; }
@media print {
  body { background: #fff; font-size: 11px; } main { padding: 0; gap: 11px; max-width: none; } footer { font-size: 10px; padding-top: 6px; }
  .logos { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; } .colours { grid-template-columns: 1fr 1fr; gap: 14px; }
  .lower { grid-template-columns: 1fr 1fr 1.2fr; gap: 14px; }
  .art { height: 84px; } .art > div { padding: 10px; } .art img { max-height: 56px; } .art.col img { max-height: 24px; }
  .card .txt { padding: 9px; gap: 4px; } .card b { font-size: 13px; } .card .min, .note, .small, .code { font-size: 11px; }
  .chip { width: 28px; height: 28px; } .sw { grid-template-columns: 28px 1fr; gap: 8px; } .sws { gap: 4px; }
  .type .u { font-size: 20px; } header img { height: 36px; } h2 { margin-bottom: 7px; } ul { gap: 3px; }
}
</style>
</head>
<body>
<main>
  <header>
    <img src="${uri('logo/offshft-logo-light.svg')}" alt="OFF SHFT">
    <p>You put in the hours. This time is yours. One clock at 5:00, quitting time, with the hands standing outside the O.</p>
  </header>

  <section aria-labelledby="l">
    <h2 id="l">The logos and where they go</h2>
    <div class="logos">
${LOGOS.map((L) => `      <div class="card"><div class="art${L.dark ? (L.col ? ' col' : '') : ' solo'}"><div><img${L.pixel ? ' class="pixel"' : ''} src="${uri(L.file)}" alt="${L.name}"></div>${L.dark ? `<div class="dk"><img src="${uri(L.dark)}" alt="${L.name} on dark"></div>` : ''}</div><div class="txt"><b>${L.name}</b><p>${L.use}</p><p class="min">${L.min}</p></div></div>`).join('\n')}
    </div>
  </section>

  <section aria-labelledby="c">
    <h2 id="c">Colours</h2>
    <div class="colours">
      <div><p class="sub">Thread and screen colours. On screens, Bone is the light background and Slate the dark one.</p><div class="sws">${THREAD.map((t) => swatch(t)).join('')}</div></div>
      <div><p class="sub">Fabrics, and the logo colours that go on each.</p><div class="sws">${FABRIC.map((f) => swatch(f)).join('')}</div></div>
    </div>
  </section>

  <section class="lower">
    <div class="type"><h2>Type</h2><p class="u">PUNCHED OUT.</p><p><b>Unbounded Bold</b>, capitals, letter-spacing 0.12 em: the logo's letters are typed in it (three small kerns), as are headings and the phrases on hats. Embroidered letters at least 6.6 mm tall, with the S trims: set by the builds, never by hand.</p><p class="a">Archivo for website text and labels.</p><p class="small">Both are free Google Fonts.</p></div>
    <div><h2>Space around it</h2><div class="space"><div><img src="${uri('logo/offshft-logo-light.svg')}" alt=""></div></div><p class="small">Around the one-line logo, and the stacked logo on a square: at least the height of the letters, measured from the tips of the hands. In circles the stacked logo fills 90% of the radius on purpose.</p></div>
    <div><h2>Don't</h2><ul>${DONT.map((d) => `<li>${d}</li>`).join('')}</ul></div>
  </section>

  <footer>Thread colours are targets. On Printful's standard threads they come out as the nearest thread above; Printful's unlimited-colour embroidery (about US$3.95 more a hat) matches the hex. Approve every colourway from a sew-out. Which file to use: brand/README.md. Embroidery drawings for every size, with stitch notes: designs/mark/final/the-o.</footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(DIR, 'sheet.html'), html);
(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(DIR, 'sheet.html'));
  await p.waitForTimeout(1200);
  await p.pdf({ path: path.join(DIR, 'offshft-brand-sheet.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true });
  // As brand/build.cjs: Chromium stamps the build time into /CreationDate and /ModDate; replace both with a constant of
  // the same length so the same sheet always gives the same bytes.
  {
    const pdfFile = path.join(DIR, 'offshft-brand-sheet.pdf'), pdfBytes = fs.readFileSync(pdfFile);
    const stamped = pdfBytes.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}[^)]*\)/g, (m, key) => `/${key} (D:20000101000000+00'00')`.padEnd(m.length));
    if (stamped.length !== pdfBytes.length) throw new Error('pdf date stamp: length changed');
    fs.writeFileSync(pdfFile, Buffer.from(stamped, 'latin1'));
  }
  for (const [w, name] of [[1100, 'desk'], [400, 'phone']]) {
    const q = await b.newPage({ viewport: { width: w, height: 900 } });
    await q.goto('file://' + path.join(DIR, 'sheet.html'));
    await q.waitForTimeout(800);
    await q.screenshot({ path: `/tmp/kitqa/sheet-${name}.png`, fullPage: true });
    console.log(name, 'scrollWidth', await q.evaluate(() => document.documentElement.scrollWidth));
    await q.close();
  }
  await b.close();
  const pdfBytes = fs.readFileSync(path.join(DIR, 'offshft-brand-sheet.pdf'));
  console.log('pdf pages:', (pdfBytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length);
})();
