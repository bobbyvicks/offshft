// Garment placement board. Exact canonical artwork is nested without modifying paths.
// Run from any directory: node designs/brand-system/garments/build.cjs
const fs = require('fs');
const path = require('path');
const kit = require('../../../tools/kit/kit.cjs');
// Resolve Sharp from the local Node environment (or a configured NODE_PATH).
const sharp = require('sharp');

const out = __dirname;
const source = path.resolve(__dirname, '../../mark/final/the-o');
const P = { bg:'#F4F1E9', ink:'#1F2733', muted:'#74766F', line:'#D6D4CB', bone:'#E4DDCB', boneSeam:'#B9B5A7', slate:'#27303D', slateSeam:'#536071', spruce:'#2E3D35', spruceSeam:'#536257', sun:'#D29B3C' };
const t = (s,x,y,cap=10,fill=P.ink,font='semi',track=0) => kit.text(s,{x,y,cap,fill,font,track}).svg;
const tc = (s,x,y,cap=10,fill=P.ink,font='semi',track=0) => kit.text(s,{x,y,cap,fill,font,track,anchor:'middle'}).svg;
function art(file,x,y,width) {
  const a = kit.readSvg(path.join(source,file));
  const height = width * a.h / a.w;
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${a.viewBox}" overflow="visible" data-source="designs/mark/final/the-o/${file}">${a.inner}</svg>`;
}

// The illustrations are visual proportion studies, not garment patterns.
// Hoodie: 0.36 display units per nominal mm at chest. 80 mm mark = 28.8 units.
const hoodieLogoWidth = 80 * .36;
// Sweat: 0.36 display units per nominal mm. 25 mm symbol = 9 units high.
const symbol = kit.readSvg(path.join(source,'symbol-dark.svg'));
const sweatLogoWidth = 25 * .36 * symbol.w / symbol.h;
// Cap is shown larger than apparel. 0.84 units/mm at its front.
const capLogoWidth = 62.64 * .84;

const hoodie = `
<g id="oversized-hoodie" stroke-linejoin="round" stroke-linecap="round">
  <path d="M194 180 Q153 181 128 198 L76 326 L68 349 Q66 355 72 358 L109 375 Q116 378 121 370 L135 299 L135 437 Q133 451 144 456 Q250 465 356 456 Q367 451 365 437 L365 299 L379 370 Q384 378 391 375 L428 358 Q434 355 432 349 L424 326 L372 198 Q347 181 306 180Z" fill="${P.bone}" stroke="${P.boneSeam}" stroke-width="1.4"/>
  <path d="M135 299 Q146 265 139 224 M365 299 Q354 265 361 224" fill="none" stroke="${P.boneSeam}" stroke-width="1.1"/>
  <path d="M128 198 Q134 208 139 224 L145 267 M372 198 Q366 208 361 224 L355 267" fill="none" stroke="${P.boneSeam}" stroke-width="1.1"/>
  <path d="M77 331 L119 352 M72 340 L115 362 M381 352 L423 331 M385 362 L428 340" fill="none" stroke="${P.boneSeam}" stroke-width=".8"/>
  <path d="M135 434 Q250 444 365 434 M135 442 Q250 451 365 442" fill="none" stroke="${P.boneSeam}" stroke-width=".8"/>
  <path d="M190 180 Q188 150 210 132 Q227 118 250 119 Q273 118 290 132 Q312 150 310 180 L286 209 Q273 220 250 221 Q227 220 214 209Z" fill="#D9D2C0" stroke="${P.boneSeam}" stroke-width="1.4"/>
  <path d="M204 180 Q204 151 225 141 Q250 128 275 141 Q296 151 296 180 Q284 197 250 214 Q216 197 204 180Z" fill="#CFC8B8" stroke="${P.boneSeam}" stroke-width="1"/>
  <path d="M225 141 Q239 159 250 214 Q261 159 275 141" fill="none" stroke="${P.boneSeam}" stroke-width=".9"/>
  <path d="M204 180 Q214 202 250 214 Q286 202 296 180" fill="none" stroke="#F0EADB" stroke-width="1.2"/>
  <path d="M234 216 C232 229 231 243 231 256 M266 216 C267 230 267 241 269 253" fill="none" stroke="#B9B1A1" stroke-width="1.9"/>
  <path d="M231 251 L231 257 M269 248 L269 254" stroke="#8E9087" stroke-width="2.2"/>
  <path d="M209 340 L291 340 L313 380 L305 409 Q250 416 195 409 L187 380Z" fill="#DED7C6" stroke="${P.boneSeam}" stroke-width="1.05"/>
  <path d="M209 340 L216 344 L197 379 M291 340 L284 344 L303 379 M197 405 Q250 412 303 405" fill="none" stroke="#F1EBDD" stroke-width="1"/>
  <path d="M148 305 Q153 321 151 338 M352 305 Q347 321 349 338" fill="none" stroke="${P.boneSeam}" stroke-width=".75" opacity=".55"/>
  ${art('logo-light.svg',312-hoodieLogoWidth/2,277,hoodieLogoWidth)}
</g>`;

const pants = `
<g id="wide-leg-sweatpants" stroke-linejoin="round" stroke-linecap="round">
  <path d="M563 124 Q650 116 737 124 L749 165 Q765 223 759 285 L773 486 Q720 498 668 489 L656 305 Q650 290 644 305 L632 489 Q580 498 527 486 L541 285 Q535 223 551 165Z" fill="${P.slate}" stroke="#19232F" stroke-width="1.5"/>
  <path d="M563 124 Q650 116 737 124 L744 150 Q650 141 556 150Z" fill="#303A48" stroke="#4B5665" stroke-width="1"/>
  <path d="M562 132 Q650 124 738 132 M559 141 Q650 133 741 141" fill="none" stroke="${P.slateSeam}" stroke-width=".7" opacity=".8"/>
  <path d="M559 166 Q567 199 584 211 M741 166 Q733 199 716 211" fill="none" stroke="${P.slateSeam}" stroke-width="1.2"/>
  <path d="M565 166 Q573 196 586 205 M735 166 Q727 196 714 205" fill="none" stroke="#19232F" stroke-width="1"/>
  <path d="M638 141 C640 158 634 174 637 187 M661 141 C659 159 666 173 663 192" fill="none" stroke="#647080" stroke-width="1.7"/>
  <path d="M637 183 L637 189 M663 188 L663 194" fill="none" stroke="#94A09D" stroke-width="1.7"/>
  <path d="M650 156 L650 250 Q648 267 638 273" fill="none" stroke="#414D5F" stroke-width=".85"/>
  <path d="M551 218 Q548 266 544 310 L536 474 M749 218 Q752 266 756 310 L764 474" fill="none" stroke="${P.slateSeam}" stroke-width=".8"/>
  <path d="M530 476 Q582 486 633 479 M667 479 Q720 486 770 476" fill="none" stroke="${P.slateSeam}" stroke-width="1"/>
  <path d="M588 274 Q582 322 582 369 M711 274 Q718 322 718 369" fill="none" stroke="#465262" stroke-width=".8" opacity=".55"/>
  <path d="M611 404 Q616 437 614 464 M687 404 Q682 437 684 464" fill="none" stroke="#19232F" stroke-width=".9" opacity=".55"/>
  ${art('symbol-dark.svg',716,229,sweatLogoWidth)}
</g>`;

const cap = `
<g id="unstructured-cap" stroke-linejoin="round" stroke-linecap="round">
  <path d="M889 348 C936 330 1046 330 1094 348 C1117 359 1130 381 1111 399 C1063 441 917 441 869 399 C850 381 866 359 889 348Z" fill="#26352D" stroke="#1C2A23" stroke-width="1.5"/>
  <path d="M887 359 C937 344 1046 344 1096 359 M878 371 C929 354 1051 354 1104 371 M877 384 C931 367 1051 367 1104 384 M886 397 C939 380 1042 380 1095 397 M903 408 C949 393 1032 393 1079 408" fill="none" stroke="#526257" stroke-width=".7" opacity=".72"/>
  <path d="M889 348 C888 304 918 266 959 251 Q990 239 1021 251 C1062 266 1092 304 1091 348 Q1045 368 990 368 Q935 368 889 348Z" fill="${P.spruce}" stroke="#1C2A23" stroke-width="1.5"/>
  <path d="M960 251 Q937 283 935 357 M1020 251 Q1043 283 1045 357" fill="none" stroke="${P.spruceSeam}" stroke-width="1"/>
  <path d="M953 255 Q929 284 927 354 M1027 255 Q1051 284 1053 354" fill="none" stroke="#26352D" stroke-width=".7"/>
  <path d="M891 342 Q938 362 990 361 Q1042 362 1089 342" fill="none" stroke="${P.spruceSeam}" stroke-width=".9"/>
  <path d="M919 291 l-2 1 M1061 291 l2 1" stroke="#192820" stroke-width="2.2"/>
  <path d="M984 245 Q990 242 996 245" fill="none" stroke="#26352D" stroke-width="4"/>
  ${art('logo-dark.svg',990-capLogoWidth/2,305,capLogoWidth)}
</g>`;

const body = `
<title>OFF SHFT — proposed garment placements</title>
<desc>Technical flat studies of a bone oversized hoodie, slate wide-leg sweatpants and spruce unstructured cap. Exact canonical logo paths. Proposed sizes: hoodie wordmark 80 mm wide, sweatpants symbol 25 mm high, cap wordmark 62.64 mm wide. Illustrations are not to a common scale or production patterns.</desc>
<rect width="1200" height="700" fill="${P.bg}"/>
${t('OFF SHFT',48,47,12,P.ink,'xbold',.08)}
${t('GARMENT PLACEMENTS',48,81,22,P.ink,'xsemi',.02)}
${t('PROPOSED / 01',1009,47,9,P.muted,'semi',.08)}
<path d="M48 100H1152" stroke="${P.line}" stroke-width="1"/>
${hoodie}
${pants}
${cap}
<path d="M48 527H452 M492 527H808 M848 527H1152" stroke="${P.line}" stroke-width="1"/>
${tc('01  OVERSIZED HOODIE',250,554,12,P.ink,'xbold',.02)}
${tc('BONE / INK + RUST',250,579,9,P.muted,'semi',.04)}
${tc('80 mm wide · left chest',250,606,10,P.ink,'semi')}
${tc('02  WIDE-LEG SWEATS',650,554,12,P.ink,'xbold',.02)}
${tc('SLATE / BONE + SUN',650,579,9,P.muted,'semi',.04)}
${tc('25 mm high · upper thigh',650,606,10,P.ink,'semi')}
${tc('03  UNSTRUCTURED CAP',990,554,12,P.ink,'xbold',.02)}
${tc('SPRUCE / BONE + SUN',990,579,9,P.muted,'semi',.04)}
${tc('62.64 mm wide · front',990,606,10,P.ink,'semi')}
<path d="M48 637H1152" stroke="${P.line}" stroke-width="1"/>
${t('PLACEMENT STUDIES',48,667,8,P.muted,'bold',.08)}
${t('Not to a common scale. Confirm on selected blanks and approve sew-outs.',263,667,8,P.muted,'semi')}
`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">${body}</svg>\n`;
fs.writeFileSync(path.join(out,'placements.svg'),svg);
// Transparent artwork-only export, tightly framed with 34–38 units of breathing room.
const artSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1136" height="450" viewBox="32 82 1136 450"><title>OFF SHFT garment placement illustrations</title><desc>Bone oversized hoodie with an 80 mm wordmark on the wearer's left chest, slate wide-leg sweatpants with a 25 mm upper-thigh symbol, and spruce cap with a 62.64 mm front wordmark. Proposed placements; garment illustrations are not to a common scale.</desc>${hoodie}${pants}${cap}</svg>\n`;
fs.writeFileSync(path.join(out,'garments-art.svg'),artSvg);
(async()=>{
  await sharp(Buffer.from(svg)).resize(2400,1400).png().toFile(path.join(out,'placements.png'));
  await sharp(Buffer.from(artSvg)).resize(2272,900).png().toFile(path.join(out,'garments-art.png'));
  console.log('Wrote placements.svg/png and garments-art.svg/png');
})().catch(e=>{console.error(e);process.exitCode=1;});
