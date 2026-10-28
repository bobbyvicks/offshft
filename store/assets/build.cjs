// Logo files for the Shopify store, generated from the final logo build so they never drift from it.
// Run: node /home/user/offshft/store/assets/build.cjs
//
// logo-ink.png    header logo for light backgrounds: Ink letters, Rust hands, transparent, 1200 px wide
// logo-bone.png   header logo for dark backgrounds: Bone letters, Sun hands, transparent, 1200 px wide
// logo.svg        the light logo as a vector (same file as designs/mark/final/the-o/logo-light.svg)
// favicon.png     512 x 512: the clock symbol on a Bone square, so it shows on light and dark browser tabs
// social-share.png 1200 x 628: the logo on Bone, the image shown when a store link is shared
'use strict';
const fs = require('fs');
const path = require('path');
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/final/the-o/build.cjs');

const OUT = __dirname;
const A = B.FONTS.unbounded;
const n = (v) => (Math.round(v * 1000) / 1000).toString();

let browserP = null;
const browser = () => (browserP ||= require('playwright').chromium.launch());

// Render a design ({ w, h, body } in mm) into a W x H pixel PNG. The design is scaled to `fill` of the frame
// (by width or height, whichever binds) and centred. bg = null keeps the background transparent.
async function png(file, design, W, H, { fill = 1, bg = null } = {}) {
  const s = Math.min((W * fill) / design.w, (H * fill) / design.h);
  const w = design.w * s, h = design.h * s;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    (bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : '') +
    `<svg x="${n((W - w) / 2)}" y="${n((H - h) / 2)}" width="${n(w)}" height="${n(h)}" viewBox="0 0 ${n(design.w)} ${n(design.h)}">${design.body}</svg></svg>`;
  const page = await (await browser()).newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: path.join(OUT, file), omitBackground: !bg, clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
}

(async () => {
  const light = B.lockup(A, 7, B.LIGHT);
  const dark = B.lockup(A, 7, B.DARK);
  const W = 1200, H = Math.round((W * light.h) / light.w);
  await png('logo-ink.png', light, W, H);
  await png('logo-bone.png', dark, W, H);
  kit.writeSvg(path.join(OUT, 'logo.svg'), light);
  // the stand-alone symbol (bigger O, longer hands, pivot dot), as on the logo page
  await png('favicon.png', B.symbol(A, 25, B.LIGHT, { channel: 1.2 }), 512, 512, { fill: 0.84, bg: kit.F.bone });
  await png('social-share.png', light, 1200, 628, { fill: 0.6, bg: kit.F.bone });
  await (await browser()).close();
  for (const f of fs.readdirSync(OUT).filter((f) => /\.(png|svg)$/.test(f))) console.log(f, fs.statSync(path.join(OUT, f)).size, 'bytes');
})().catch((e) => { console.error(e); process.exit(1); });
