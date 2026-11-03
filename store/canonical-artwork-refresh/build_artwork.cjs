'use strict';
// Canonical SVG bytes are embedded unchanged. Only the containing production
// canvas sets position; uniform scaling is permitted for printed placements.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),Module=require('module');
const H=__dirname,R=path.resolve(H,'../..'),M=path.join(H,'masters');
const sharp=require('C:/Users/vicke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'');
const load=p=>JSON.parse(read(p));const n=x=>+x.toFixed(6);
// Resolve the original builder's Linux paths without changing any drawing code.
const originalLoad=Module._load;
Module._load=function(request,parent,isMain){
 if(request.startsWith('/home/user/offshft/')){
  const rel=request.slice('/home/user/offshft/'.length);
  request=path.join(rel.startsWith('tools/')?R:M,rel);
 }
 return originalLoad.call(this,request,parent,isMain);
};
function makeReason(){
 const PH=require(path.join(M,'designs/phrases/build.cjs'));
 const d={...PH.DESIGNS.find(d=>d.id==='for-a-reason'),lines:['FOR A','REASON.'],layout:'stacked-centred'};
 const lines=PH.layout(d,7),all=lines.flat(),ink=all.filter(g=>g.ch!=='.'),dots=all.filter(g=>g.ch==='.');
 const box=gs=>({x0:Math.min(...gs.map(g=>g.box.x0)),x1:Math.max(...gs.map(g=>g.box.x1)),y0:Math.min(...gs.map(g=>g.box.y0)),y1:Math.max(...gs.map(g=>g.box.y1))});
 const b=box(all),l=box(ink),axis=(l.x0+l.x1)/2;
 b.x0=Math.min(b.x0,2*axis-b.x1);b.x1=Math.max(b.x1,2*axis-b.x0);
 const out=path.join(R,'designs/21-for-a-reason');fs.mkdirSync(out,{recursive:true});
 for(const [tone,letters,accent] of [['light','#1F2733','#B4552D'],['dark','#ECE5D3','#D29B3C']]){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${n(b.x1-b.x0)}mm" height="${n(b.y1-b.y0)}mm" viewBox="0 0 ${n(b.x1-b.x0)} ${n(b.y1-b.y0)}">\n<g transform="translate(${n(-b.x0)} ${n(-b.y0)})"><path id="letters" fill="${letters}" fill-rule="evenodd" d="${ink.map(g=>g.d).join(' ')}"/><path id="full-stop" fill="${accent}" d="${dots.map(g=>g.d).join(' ')}"/></g>\n</svg>\n`;
  fs.writeFileSync(path.join(out,`design-${tone}.svg`),svg);
 }
 fs.writeFileSync(path.join(out,'notes.md'),'# FOR A / REASON.\n\nOwner-approved two-line Unbounded Bold master, 7 mm cap height, tracking 0.12 em. Uses the pinned canonical phrase builder and its shared glyph/kerning rules; no width compression, stroke expansion or hand-redrawing. Lines centred on the letters; punctuation hangs. Flat embroidery preserves the master.\n\nBuilt by `store/canonical-artwork-refresh/build_artwork.cjs` from canonical commit '+read(path.join(H,'source-ref.txt')).trim()+'.\n');
 return out;
}
function source(row){
 const name=row.file.filename, tone=/bone|dark/.test(name)?'dark':'light';
 const mono=/\bbone\b/.test(name)&&!name.includes('bone-sun')&&!name.includes('dark');
 let rel,base=M;
 if(name.includes('clock')){
  rel=row.headwear?`designs/mark/final/the-o/symbol-${tone}-40mm.svg`:`brand/clock/offshft-clock-${mono?'bone':tone}.svg`;
  // Only the light 40 mm source is checked in; dark is the same canonical drawing.
  if(!fs.existsSync(path.join(base,rel))&&row.headwear)rel='designs/mark/final/the-o/symbol-light-40mm.svg';
 } else if(name.includes('logo')||name.includes('off-shft-back')||name.startsWith('front-'))rel=`brand/logo/offshft-logo-${mono?'bone':tone}.svg`;
 else if(name.includes('punched'))rel=`designs/09-punched-out/v3/stacked-centred-${tone}.svg`;
 else if(name.includes('banked'))rel=`designs/18-banked-time/design-${tone}.svg`;
 else if(name.includes('parked'))rel=`designs/20-parked/design-${tone}.svg`;
 else if(name.includes('suns-still'))rel=`designs/16-suns-still-up/design-${tone}.svg`;
 else if(name.includes('ours-to-spend'))rel=`designs/13-ours-to-spend/design-${tone}.svg`;
 else if(name.includes('for-a-reason')){base=R;rel=`designs/21-for-a-reason/design-${tone}.svg`;}
 else throw Error('Unclassified file '+name);
 let svg=read(path.join(base,rel)),colorVariant=null;
 // Explicit existing single-thread palette; geometry is unchanged.
 if(mono&&!/brand\/(logo|clock)/.test(rel)){svg=svg.replace(/#[0-9A-Fa-f]{6}/g,'#ECE5D3');colorVariant='existing one-thread Bone';}
 return {svg,source:path.relative(R,path.join(base,rel)).replaceAll('\\','/'),sourceSha256:sha(fs.readFileSync(path.join(base,rel))),colorVariant};
}
async function main(){
 makeReason();const rows=load(path.join(H,'inventory.json')),records=[];
 const out=path.join(R,'store/printful-setup/canonical-v1');fs.mkdirSync(out,{recursive:true});
 for(const row of rows){
  const a=source(row),f=row.file,b=row.oldAudit,svg=a.svg;
  const match=svg.match(/viewBox="([^"]+)"/),vb=match[1].split(/\s+/).map(Number),w=vb[2],h=vb[3];
  const W=f.width/f.dpi*25.4,HH=f.height/f.dpi*25.4;
  const printed=row.roles.some(x=>x.includes('dtf')||x==='pocket')||f.dpi===300;
  let scale=1;
  if(printed){scale=nameIsClock(f.filename)?b.visibleMm[1]/h:b.visibleMm[0]/w;}
  const oldCenterX=(b.alphaBounds[0]+b.alphaBounds[2])/2/f.dpi*25.4;
  const oldCenterY=(b.alphaBounds[1]+b.alphaBounds[3])/2/f.dpi*25.4;
  let x=oldCenterX-w*scale/2,y=oldCenterY-h*scale/2;
  let seam=0;
  if(row.headwear){
   const six=row.pids.some(p=>[206,252,1678].includes(p));
   if(six){if(f.filename.includes('logo'))seam=5.2;else if(f.filename.includes('banked'))seam=1.94;else if(f.filename.includes('parked'))seam=1.95;else if(f.filename.includes('ours-to-spend'))seam=-4.37;}
   x=(W-w)/2+seam;y=(HH-h)/2;
  }
  if(x<0||y<0||x+w*scale>W+.02||y+h*scale>HH+.02)throw Error('Out of field '+f.filename);
  if(!printed&&scale!==1)throw Error('Embroidery scaling forbidden');
  if(vb[0]!==0||vb[1]!==0)throw Error('Unexpected source origin');
  const body=svg.trim().replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>$/,'');
  const wrapper=`<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}" height="${f.height}" viewBox="0 0 ${n(W)} ${n(HH)}"><g transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})"><svg width="${w}" height="${h}" viewBox="${vb.join(' ')}" overflow="hidden">${body}</svg></g></svg>`;
  const name=`canonical-v1-${row.key}.png`,png=path.join(out,name),vector=png.replace(/\.png$/,'.svg');
  fs.writeFileSync(vector,wrapper);
  await sharp(Buffer.from(wrapper),{density:72,limitInputPixels:false}).toColourspace('srgb').ensureAlpha().withMetadata({density:f.dpi}).png().toFile(png);
  const metadata=await sharp(png).metadata();if(metadata.width!==f.width||metadata.height!==f.height||metadata.density!==f.dpi)throw Error('Raster field drift');
  const side=Math.ceil(Math.max(w,h)+2),sidePx=Math.ceil(side/25.4*f.dpi),nativePpmm=sidePx/side;
  const nativeSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="${sidePx}" height="${sidePx}" viewBox="0 0 ${side} ${side}"><g transform="translate(1 1)"><svg width="${w}" height="${h}" viewBox="${vb.join(' ')}" overflow="hidden">${body}</svg></g></svg>`;
  const native=await sharp(Buffer.from(nativeSvg),{density:72}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let ax0=native.info.width,ax1=0,ay0=native.info.height,ay1=0;
  for(let yy=0;yy<native.info.height;yy++)for(let xx=0;xx<native.info.width;xx++)if(native.data[(yy*native.info.width+xx)*4+3]){ax0=Math.min(ax0,xx);ax1=Math.max(ax1,xx+1);ay0=Math.min(ay0,yy);ay1=Math.max(ay1,yy+1);}
  records.push({key:row.key,oldFileId:f.id,filename:name,publishedPath:path.relative(R,png).replaceAll('\\','/'),vectorPath:path.relative(R,vector).replaceAll('\\','/'),source:a.source,sourceSha256:a.sourceSha256,colorVariant:a.colorVariant,pngSha256:sha(fs.readFileSync(png)),width:f.width,height:f.height,dpi:f.dpi,headwear:row.headwear,printed,physicalArtMm:[n(w*scale),n(h*scale)],expectedInkMm:[n((ax1-ax0)/nativePpmm*scale),n((ay1-ay0)/nativePpmm*scale)],placementMm:[n(x),n(y)],printScale:scale,seamShiftMm:seam,handles:row.handles,variants:row.variants});
 }
 fs.writeFileSync(path.join(H,'artwork-manifest.json'),JSON.stringify({canonicalCommit:read(path.join(H,'source-ref.txt')).trim(),records},null,2)+'\n');
 console.log(JSON.stringify({canonicalFiles:records.length,affectedVariants:new Set(records.flatMap(r=>r.variants)).size,affectedProducts:new Set(records.flatMap(r=>r.handles)).size}));
}
const nameIsClock=name=>name.includes('clock');
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1});
module.exports={source};

