// Only builds the four next-round drafts. Run: node designs/build-next-round.cjs
// Requires the repo's opentype/clipper dependencies and already-installed Sharp
// (resolve Sharp through the current Node environment or NODE_PATH).
'use strict';
const fs = require('fs');
const path = require('path');
const kit = require('../tools/kit/kit.cjs');
const ClipperLib = require('../tools/node_modules/clipper-lib');
const sharp = require('C:/Users/vicke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const FONT = kit.font('unbounded');
const TRACK = 0.12;
const PHOTO_NOTE = 'Selected review photo: `mockup-v2.png`, generated with artwork-only references. The initial `mockup.png` is preserved as a historical iteration and is not the selected review image. SVG geometry and millimetre dimensions govern the exact artwork; mockup scale, placement and fabric appearance are approximate. Decimal measurements describe vector geometry, not manufacturing tolerances.';
const n = v => String(Math.round(v * 1000) / 1000);
const SC = 64;

// Canonical contour union and S-terminal treatment, reused from
// designs/mark/final/the-o/build.cjs. Kept local because that older module has
// machine-specific imports; the master and its geometry are never modified.
function contoursOf(glyph, upm) {
  const out = []; let cur = null, x0 = 0, y0 = 0;
  const STEPS = 24;
  for (const c of glyph.getPath(0, 0, upm).commands) {
    if (c.type === 'M') { cur = [[c.x, c.y]]; out.push(cur); x0 = c.x; y0 = c.y; }
    else if (c.type === 'L') { cur.push([c.x, c.y]); x0 = c.x; y0 = c.y; }
    else if (c.type === 'Q') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * x0 + 2 * u * t * c.x1 + t * t * c.x, u * u * y0 + 2 * u * t * c.y1 + t * t * c.y]); } x0 = c.x; y0 = c.y; }
    else if (c.type === 'C') { for (let i = 1; i <= STEPS; i++) { const t = i / STEPS, u = 1 - t; cur.push([u * u * u * x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x, u * u * u * y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y]); } x0 = c.x; y0 = c.y; }
  }
  return out.filter(c => c.length > 2);
}
const toClip = cs => cs.map(c => c.map(([x, y]) => ({ X: Math.round(x * SC), Y: Math.round(y * SC) })));
function clip(op, subj, clips = []) {
  const c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  if (clips.length) c.AddPaths(clips, ClipperLib.PolyType.ptClip, true);
  const sol = new ClipperLib.Paths();
  c.Execute(op, sol, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  return sol;
}
const rect = (x0, y0, x1, y1) => [{ X: x0 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y0 * SC }, { X: x1 * SC, Y: y1 * SC }, { X: x0 * SC, Y: y1 * SC }];
const sTrimMM = cap => ({ upper: Math.max(0, 0.36 - 0.1 * (cap - 7)), lower: Math.max(0, 0.41 - 0.1 * (cap - 7)) });
function glyphMM(ch, x, baseY, cap) {
  const k = cap / FONT.tables.os2.sCapHeight;
  let paths = clip(ClipperLib.ClipType.ctUnion, toClip(contoursOf(FONT.charToGlyph(ch), FONT.unitsPerEm)));
  if (ch === 'S') {
    const t = sTrimMM(cap), up = t.upper / k, lo = t.lower / k;
    paths = clip(ClipperLib.ClipType.ctDifference, paths, [rect(560, -(519 + up), 4000, -519), rect(-4000, -246, 260, -(246 - lo))]);
  }
  const pts = [];
  const d = paths.map(p => 'M' + p.map(({ X, Y }) => {
    const xx = x + X / SC * k, yy = baseY + Y / SC * k;
    pts.push([xx, yy]); return `${n(xx)} ${n(yy)}`;
  }).join(' L') + ' Z').join(' ');
  return { ch, d, pts };
}
const bounds = pts => ({ x0: Math.min(...pts.map(p => p[0])), y0: Math.min(...pts.map(p => p[1])), x1: Math.max(...pts.map(p => p[0])), y1: Math.max(...pts.map(p => p[1])) });

// Same two-line chest treatment as Punched Out., with the owner's straight E refinement.
const SPECS = [
 {folder:'15-off-shft-golf-club',key:'golf-club',title:'OFF SHFT GOLF CLUB',lines:['OFF SHFT','GOLF CLUB.'],width:75},
 {folder:'07-out-of-office/golf-shirt',key:'out-of-office',title:'OUT OF OFFICE.',lines:['OUT OF','OFFICE.'],width:63.6},
 {folder:'16-time-well-spent',key:'time-well-spent',title:'TIME WELL SPENT.',lines:['TIME WELL','SPENT.'],width:75}
];
const ROOT=path.resolve(__dirname,'..');
const PROD=path.join(ROOT,'store/printful-setup/golf-series/canvases');
const PROOF=path.join(ROOT,'store/golf-club-expansion');
fs.mkdirSync(PROD,{recursive:true});
function straightE(g,cap){
 if(g.ch!=='E')return g;
 const old=g.pts,b=bounds(old);
 if(old.length!==13)throw Error('E contour changed');
 const stemGlyph=glyphMM('I',0,0,cap),ib=bounds(stemGlyph.pts),x=b.x0+ib.x1-ib.x0;
 const [topInner,,midStem,midRight,,lowerStem,lowerInner,bottomRight]=old;
 const pts=[[b.x0,b.y0],[topInner[0],b.y0],[topInner[0],topInner[1]],[x,topInner[1]],[x,midStem[1]],[midRight[0],midStem[1]],[midRight[0],lowerStem[1]],[x,lowerStem[1]],[x,lowerInner[1]],[bottomRight[0],lowerInner[1]],[bottomRight[0],b.y1],[b.x0,b.y1]];
 return {...g,pts,d:'M'+pts.map(p=>p.map(n).join(' ')).join(' L')+' Z'};
}
function compose(spec,cap){
 const glyphs=[];
 spec.lines.forEach((str,line)=>{
  const t=kit.text(str,{font:'unbounded',cap,track:TRACK,x:0,y:0});
  const gs=[...str].flatMap((ch,i)=>ch===' '?[]:[straightE(glyphMM(ch,t.letters[i].x,0,cap),cap)]);
  const b=bounds(gs.flatMap(g=>g.pts));
  gs.forEach(g=>{g.transform=`translate(${n(-b.x0)} ${n(line*cap*1.53)})`;g.pts=g.pts.map(([x,y])=>[x-b.x0,y+line*cap*1.53]);});
  glyphs.push(...gs);
 });
 const b=bounds(glyphs.flatMap(g=>g.pts));return {glyphs,box:b,w:b.x1-b.x0,h:b.y1-b.y0};
}
function body(art,palette){return `<g transform="translate(${n(-art.box.x0)} ${n(-art.box.y0)})">`+art.glyphs.map(g=>`<path data-character="${g.ch}" transform="${g.transform}" fill="${g.ch==='.'?palette.accent:palette.letters}" fill-rule="evenodd" d="${g.d}"/>`).join('')+'</g>';}
async function raster(svg,pixels,dpi,out){
 const px=svg.replace(/width="[^"]+" height="[^"]+"/,`width="${pixels}" height="${pixels}"`);
 await sharp(Buffer.from(px),{density:72}).toColourspace('srgb').ensureAlpha().withMetadata({density:dpi}).png().toFile(out);
 const m=await sharp(out).metadata();if(m.width!==pixels||m.height!==pixels||m.density!==dpi||!m.hasAlpha)throw Error('Raster invalid');
}
(async()=>{
 const records=[],panels=[];
 for(const [index,spec] of SPECS.entries()){
  let cap=7;for(let i=0;i<4;i++)cap*=spec.width/compose(spec,cap).w;
  const art=compose(spec,cap);if(cap<6.6||art.w>75.01||art.h>76.2)throw Error('Placement or lettering floor exceeded');
  const dir=path.join(__dirname,spec.folder);fs.mkdirSync(dir,{recursive:true});
  for(const [palette,colours] of Object.entries({light:{letters:'#1F2733',accent:'#B4552D'},dark:{letters:'#ECE5D3',accent:'#D29B3C'}})){
   const inner=body(art,colours);
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${n(art.w)}mm" height="${n(art.h)}mm" viewBox="0 0 ${n(art.w)} ${n(art.h)}"><title>${spec.title}</title>${inner}</svg>`;
   fs.writeFileSync(path.join(dir,`design-${palette}.svg`),svg);
   if(palette==='dark')fs.writeFileSync(path.join(dir,'design.svg'),svg);
   for(const [tech,field,pixels,dpi] of [['embroidered',101.6,2400,600],['printed',76.2,900,300]]){
    const canvas=`<svg xmlns="http://www.w3.org/2000/svg" width="${field}mm" height="${field}mm" viewBox="0 0 ${field} ${field}"><g transform="translate(${n((field-art.w)/2)} ${n((field-art.h)/2)})">${inner}</g></svg>`;
    const basename=`${spec.key}-${palette}-${tech}-chest`;
    fs.writeFileSync(path.join(PROD,basename+'.svg'),canvas);
    await raster(canvas,pixels,dpi,path.join(PROD,basename+'.png'));
    records.push({key:spec.key,title:spec.title,palette,technique:tech,artworkMm:[+n(art.w),+n(art.h)],capHeightMm:+n(cap),fieldInches:field/25.4,dpi,pixels,file:`store/printful-setup/golf-series/canvases/${basename}.png`});
   }
   panels.push(`<g transform="translate(${index*600} ${palette==='light'?0:310})"><rect width="600" height="310" fill="${palette==='light'?'#e8dfcd':'#243b34'}"/><g transform="translate(60 90) scale(6)">${inner}</g></g>`);
  }
  fs.writeFileSync(path.join(dir,'notes.md'),`# ${spec.title}\n\nOwner requested this golf design using the existing Punched Out. shirt layout on 2 November 2026. Outlined Unbounded Bold, 0.12em tracking, two left-aligned lines and accent full stop. Straight E spine follows the previous owner-requested E correction. Artwork ${n(art.w)} × ${n(art.h)} mm; cap height ${n(cap)} mm. Two existing palettes, centered in the same 4-inch embroidery or 3-inch DTF chest field. Sleeve clock and printed back-collar logo are separate unchanged production files. This is artwork, not a digitized stitch file.\n`);
 }
 const proof=`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="620" viewBox="0 0 1800 620">${panels.join('')}</svg>`;
 await sharp(Buffer.from(proof)).png().toFile(path.join(PROOF,'three-designs-proof.png'));
 fs.writeFileSync(path.join(PROD,'manifest.json'),JSON.stringify(records,null,2));
 console.log(JSON.stringify({files:records.length,designs:SPECS.map(s=>s.title),metrics:records.filter(r=>r.palette==='light'&&r.technique==='embroidered').map(r=>({key:r.key,artworkMm:r.artworkMm,cap:r.capHeightMm}))}));
})().catch(e=>{console.error(e);process.exitCode=1});

