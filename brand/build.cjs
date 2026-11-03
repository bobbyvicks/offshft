// OFF SHFT brand kit: every logo file, generated from the same drawings as the hats.
//   cd /home/user/offshft/tools && node ../brand/build.cjs
// Sources: designs/mark/final/the-o/build.cjs (the one-line logo, the clock symbol, the stacked logo and the clock tile:
// OFF SHFT typed in Unbounded Bold, the font the owner chose, with the O as the clock and bar hands with square ends;
// the owner's call of 2 Nov 2026) and designs/mark/square/build.cjs (the pixel-drawn tab icons). Nothing here is drawn
// by hand, so a change to either build flows through by running this again.
//
// Colourways: light = Ink with Rust hands, for light backgrounds; dark = Bone with Sun hands, for dark backgrounds;
// ink and bone = one colour (no pivot dot and a wider gap, as the embroidery rules have it).
// Formats: SVG (vector, true size in mm), PDF (vector, for printers), PNG (transparent, or on a tile where noted).

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const LOGO = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');
const SQ = require('/home/user/offshft/designs/mark/square/build.cjs');

const OUT = __dirname;
const T = kit.T, F = kit.F;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

// Colourways for each drawing family. The logo build names its parts letters/hands; the square build ring/hands/text.
const WAYS = {
  light: { logo: LOGO.LIGHT, sq: { ring: T.ink, hands: T.rust, text: T.ink }, one: false },
  dark: { logo: LOGO.DARK, sq: { ring: T.bone, hands: T.sun, text: T.bone }, one: false },
  ink: { logo: LOGO.ONE_INK, sq: { ring: T.ink, hands: T.ink, text: T.ink }, one: true },
  bone: { logo: LOGO.ONE_BONE, sq: { ring: T.bone, hands: T.bone, text: T.bone }, one: true },
};
// Screens use the thread Bone and Slate (Rust on #ECE5D3 is 3.91:1, on the fabric Bone 3.62:1).
const TILE = { light: { bg: T.bone, ...WAYS.light.sq }, dark: { bg: F.slate, ...WAYS.dark.sq } };

const svgDoc = ({ w, h, body }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${n(w)}mm" height="${n(h)}mm" viewBox="0 0 ${n(w)} ${n(h)}">\n${body}\n</svg>\n`;
const write = (rel, text) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); return f; };

// ---------------------------------------------------------------- rendering
let browser = null;
async function page(dpr = 1) {
  if (!browser) browser = await require('playwright').chromium.launch();
  return browser.newPage({ deviceScaleFactor: dpr });
}
// A vector drawing to a transparent PNG, `px` wide (or tall, if byHeight).
async function png(art, file, px, { byHeight = false, bg = null } = {}) {
  const w = byHeight ? Math.round((art.w / art.h) * px) : px, h = byHeight ? px : Math.round((art.h / art.w) * px);
  const p = await page(1);
  await p.setContent(`<html><body style="margin:0;background:transparent"><svg id="a" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${n(art.w)} ${n(art.h)}" style="display:block">${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}${art.body}</svg></body></html>`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await (await p.$('#a')).screenshot({ path: file, omitBackground: !bg });
  await p.close();
  return file;
}
// A whole SVG document (already sized) to a PNG of exactly px x px.
async function pngOfSvg(svgText, file, px) {
  const p = await page(1);
  const src = 'data:image/svg+xml;base64,' + Buffer.from(svgText).toString('base64');
  await p.setContent(`<html><body style="margin:0;background:transparent"><img id="a" src="${src}" width="${px}" height="${px}" style="display:block"></body></html>`);
  await p.waitForFunction(() => document.getElementById('a').complete);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await (await p.$('#a')).screenshot({ path: file, omitBackground: true });
  await p.close();
  return file;
}
// Vector PDF at true size with a 3 mm margin, no page background.
async function pdf(art, file) {
  const M = 3, W = art.w + 2 * M, H = art.h + 2 * M;
  const p = await page(1);
  await p.setContent(`<html><head><style>@page{size:${n(W)}mm ${n(H)}mm;margin:0}html,body{margin:0;padding:0}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="${n(art.w)}mm" height="${n(art.h)}mm" viewBox="0 0 ${n(art.w)} ${n(art.h)}" style="display:block;margin:${M}mm">${art.body}</svg></body></html>`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await p.pdf({ path: file, width: `${n(W)}mm`, height: `${n(H)}mm`, printBackground: false, pageRanges: '1' });
  await p.close();
  // Chromium stamps the time of the build into /CreationDate and /ModDate; replace both with a constant of the same
  // length (so the xref offsets stay valid) and the same drawing always gives the same bytes.
  const pdfBytes = fs.readFileSync(file);
  const stamped = pdfBytes.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:\d{14}[^)]*\)/g, (m, key) => `/${key} (D:20000101000000+00'00')`.padEnd(m.length));
  if (stamped.length !== pdfBytes.length) throw new Error(`pdf date stamp: length changed in ${file}`);
  fs.writeFileSync(file, Buffer.from(stamped, 'latin1'));
  return file;
}

// ---------------------------------------------------------------- the drawings
const ART = {
  // the one-line logo at the hat-front and chest size (LOCKUP_CAP: letters 7 mm, the smallest size with the pivot dot)
  logo: (way) => LOGO.lockup(LOGO.LOCKUP_CAP, WAYS[way].logo, { oneColour: WAYS[way].one }),
  // the stacked logo (OFF over SHFT), the same lettering
  stacked: (way) => LOGO.stackedArt(WAYS[way].logo, { oneColour: WAYS[way].one }),
  // the clock symbol at 25 mm tall, as on the hats (1.2 mm gap; 1.5 mm in one colour)
  clock: (way) => LOGO.symbol(25, WAYS[way].logo, { oneColour: WAYS[way].one, channel: WAYS[way].one ? 1.5 : 1.2 }),
};
const SIZES = { logo: [600, 1200, 2400], stacked: [600, 1200], clock: [600, 1200] };   // PNG widths (clock: heights)

(async () => {
  const made = [];
  for (const kind of ['logo', 'stacked', 'clock']) {
    for (const way of ['light', 'dark', 'ink', 'bone']) {
      const art = ART[kind](way), base = `${kind}/offshft-${kind}-${way}`;
      made.push(write(`${base}.svg`, svgDoc(art)));
      made.push(await pdf(art, path.join(OUT, `${base}.pdf`)));
      for (const px of SIZES[kind]) made.push(await png(art, path.join(OUT, `${base}-${px}.png`), px, { byHeight: kind === 'clock' }));
    }
  }

  // Squares: the stacked logo on its tile (profile pictures, app icons, the Shopify square logo).
  for (const way of ['light', 'dark']) {
    const tileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1080" height="1080"><rect width="100" height="100" fill="${TILE[way].bg}"/>${LOGO.stacked({ letters: TILE[way].text, hands: TILE[way].hands })}</svg>\n`;
    made.push(write(`social/offshft-profile-${way}.svg`, tileSvg));
    made.push(await pngOfSvg(tileSvg, path.join(OUT, `social/offshft-profile-${way}.png`), 1080));
    if (way === 'light') {
      made.push(await pngOfSvg(tileSvg, path.join(OUT, 'icons/apple-touch-icon.png'), 180));   // opaque, full-bleed
      made.push(await pngOfSvg(tileSvg, path.join(OUT, 'icons/icon-192.png'), 192));
      made.push(await pngOfSvg(tileSvg, path.join(OUT, 'icons/icon-512.png'), 512));
    }
  }

  // The clock alone in a circle: a secondary square, for spots where the name is already beside it (a story highlight,
  // a sticker sheet). Always small in a square, so never the main profile picture or app icon.
  for (const way of ['light', 'dark']) {
    const clockTile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1080" height="1080"><rect width="100" height="100" fill="${TILE[way].bg}"/>${LOGO.clockTile({ letters: TILE[way].text, hands: TILE[way].hands })}</svg>\n`;
    made.push(write(`social/offshft-clock-tile-${way}.svg`, clockTile));
    made.push(await pngOfSvg(clockTile, path.join(OUT, `social/offshft-clock-tile-${way}.png`), 1080));
  }

  // Link previews (Shopify's social sharing image): 1200 x 628, the one-line logo on Bone.
  {
    const lg = ART.logo('light'), W = 120, H = 62.8, k = (W * 0.5) / lg.w;
    const share = { w: W, h: H, body: `<rect width="${W}" height="${H}" fill="${T.bone}"/><g transform="translate(${n((W - lg.w * k) / 2)} ${n((H - lg.h * k) / 2)}) scale(${n(k)})">${lg.body}</g>` };
    made.push(write('social/offshft-share.svg', svgDoc(share)));
    made.push(await png(share, path.join(OUT, 'social/offshft-share.png'), 1200));
  }

  // Browser tab: the hat clock drawn on the pixel grid at each size, never scaled.
  const fav = [];
  for (const px of [16, 32, 48]) {
    const svg = SQ.tabOutside(px, TILE.light);
    made.push(write(`icons/favicon-${px}.svg`, svg));
    fav.push(await pngOfSvg(svg, path.join(OUT, `icons/favicon-${px}.png`), px));
  }
  made.push(...fav);
  execFileSync('convert', [...fav, path.join(OUT, 'icons/favicon.ico')]);
  made.push(path.join(OUT, 'icons/favicon.ico'));
  // The store's file. Shopify serves the Favicon at 32 x 32, and the same file is also the home page's 64 px clock on a
  // fabric-Bone band, so it's the 32 px drawing rendered at 512 on a square of that band's colour: it shrinks back to
  // the drawn pixels for the tab and its square disappears on the band.
  made.push(await pngOfSvg(SQ.tabOutside(32, TILE.light, { bg: F.bone, rx: 0 }), path.join(OUT, 'shopify/offshft-favicon-512.png'), 512));

  await browser.close();
  // a list of every file, for the README and the checks
  const list = made.map((f) => path.relative(OUT, f)).sort();
  fs.writeFileSync(path.join(OUT, 'files.txt'), list.join('\n') + '\n');
  console.log(`wrote ${list.length} files`);
})();
