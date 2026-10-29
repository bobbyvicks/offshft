'use strict';
// Production-art preparation from the approved visual concept. Writes only this folder.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../../../..');
const C=require(path.join(ROOT,'tools/node_modules/clipper-lib'));
const opentype=require(path.join(ROOT,'tools/node_modules/opentype.js'));
const sharp=require('C:/Users/vicke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const REFERENCE='C:/Users/vicke/.codex/generated_images/01a185b0-8e64-7bb3-b5c4-7d31c117d1a7/exec-bd9ba42a-1f22-48e3-8d5a-88a93ebb82f3.png';
const FONT=path.join(ROOT,'tools/fonts/Archivo-Bold.ttf');
const SCALE=10000,cap=18.5,horizontal=.82,inflate=1.40,radius=2.65;
const letterGap=1.8,wordGap=4.5,rowGap=3.8,dotDiameter=6.0,field=[149.86,50.8];
const palettes={'bone-sun':{letters:'#ECE5D3',period:'#D29B3C'},'ink-rust':{letters:'#1F2733',period:'#B4552D'}};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),n=v=>+v.toFixed(4);
const point=(x,y)=>({X:Math.round(x*SCALE),Y:Math.round(y*SCALE)});
function boolean(type,a,b=[]){const c=new C.Clipper();c.AddPaths(a,C.PolyType.ptSubject,true);if(b.length)c.AddPaths(b,C.PolyType.ptClip,true);const out=[];c.Execute(type,out,C.PolyFillType.pftNonZero,C.PolyFillType.pftNonZero);return out;}
function offset(a,mm){const c=new C.ClipperOffset(2,.0005*SCALE);c.AddPaths(a,C.JoinType.jtRound,C.EndType.etClosedPolygon);const out=[];c.Execute(out,mm*SCALE);return out;}
function bbox(a){const q=a.flat();return {x0:Math.min(...q.map(p=>p.X))/SCALE,y0:Math.min(...q.map(p=>p.Y))/SCALE,x1:Math.max(...q.map(p=>p.X))/SCALE,y1:Math.max(...q.map(p=>p.Y))/SCALE};}
function translate(a,x,y){return a.map(p=>p.map(q=>({X:q.X+Math.round(x*SCALE),Y:q.Y+Math.round(y*SCALE)})));}
function rect(x0,y0,x1,y1){return [point(x0,y0),point(x1,y0),point(x1,y1),point(x0,y1)];}
function circle(d){const out=[];for(let i=0;i<512;i++){const t=i*2*Math.PI/512;out.push(point(d/2+d/2*Math.cos(t),d/2+d/2*Math.sin(t)));}return [out];}
function stats(a){return {outerContours:a.filter(p=>C.Clipper.Area(p)>0).length,counters:a.filter(p=>C.Clipper.Area(p)<0).length};}
function pathData(a){return a.map(p=>'M'+p.map(q=>`${n(q.X/SCALE)} ${n(q.Y/SCALE)}`).join(' L')+' Z').join(' ');}
function contours(commands){const out=[];let p=[],x=0,y=0;for(const c of commands){if(c.type==='M'){p=[];out.push(p);x=c.x;y=c.y;p.push([x,y]);}else if(c.type==='L'){x=c.x;y=c.y;p.push([x,y]);}else if(c.type==='Q'){const ax=x,ay=y;for(let i=1;i<=64;i++){const t=i/64,u=1-t;p.push([u*u*ax+2*u*t*c.x1+t*t*c.x,u*u*ay+2*u*t*c.y1+t*t*c.y]);}x=c.x;y=c.y;}else if(c.type==='C'){const ax=x,ay=y;for(let i=1;i<=64;i++){const t=i/64,u=1-t;p.push([u*u*u*ax+3*u*u*t*c.x1+3*u*t*t*c.x2+t*t*t*c.x,u*u*u*ay+3*u*u*t*c.y1+3*u*t*t*c.y2+t*t*t*c.y]);}x=c.x;y=c.y;}}return out.filter(p=>p.length>2);}
function makeGlyph(f,char,index){
 if(char==='.'){const final=circle(dotDiameter),core=translate(circle(dotDiameter-2*radius),radius,radius);return {id:'glyph-'+index,char,source:final,core,final,expectedCounters:0,originalBaselineY:0,nominalRollingDiscDiameterMm:dotDiameter};}
 const raw=contours(f.charToGlyph(char).getPath(0,0,cap*f.unitsPerEm/f.tables.os2.sCapHeight).commands);
 const x0=Math.min(...raw.flat().map(p=>p[0]));
 const glyphHorizontal=char==='A'?.90:horizontal;const source=boolean(C.ClipType.ctUnion,raw.map(p=>p.map(([x,y])=>point((x-x0)*glyphHorizontal,y))));
 const glyphInflate=inflate;let prepared=offset(source,glyphInflate),cuts=[];
 if(char==='A'){prepared=boolean(C.ClipType.ctDifference,prepared,translate(circle(2.2),(9.66-x0)*glyphHorizontal-1.1,-9.1-1.1));}
 if(char==='R'){const holes=prepared.filter(p=>C.Clipper.Area(p)<0).map(p=>p.slice().reverse());prepared=boolean(C.ClipType.ctDifference,prepared,offset(holes,.25));}
 if(char==='E'){
  const middle=(-15.2099125364-11.0838192420)/2;
  cuts=[rect((6.0947521866-x0)*horizontal+inflate,middle-.82,40,middle+.82)];
 }
 if(char==='S'){
  // Open both mouths after thickening; derived from this font's terminal positions.
  cuts=[rect((10.2-x0)*horizontal,-12.8-.90,40,-12.8+.90),rect(-10,-5.9-.90,(8.4-x0)*horizontal,-5.9+.90)];
 }
 if(cuts.length)prepared=boolean(C.ClipType.ctDifference,prepared,cuts);
 const core=offset(prepared,-radius),final=offset(core,radius),expectedCounters='ORA'.includes(char)?1:0;
 const cs=stats(core),ss=stats(final);
 if(cs.outerContours!==1||ss.outerContours!==1||cs.counters!==expectedCounters||ss.counters!==expectedCounters)throw new Error(`${char}/${index}: topology ${JSON.stringify(cs)} / ${JSON.stringify(ss)}; core areas ${core.map(p=>C.Clipper.Area(p)/SCALE/SCALE)}`);
 return {id:'glyph-'+index,char,source,prepared,core,final,expectedCounters,originalBaselineY:0,nominalRollingDiscDiameterMm:2*radius};
}
function compose(){const f=opentype.loadSync(FONT),glyphs='FORAREASON.'.split('').map((c,i)=>makeGlyph(f,c,i+1));
 const letters=glyphs.filter(g=>g.char!=='.'),box=bbox(letters.flatMap(g=>g.final)),rowHeight=box.y1-box.y0,widths=[];
 for(const [row,gs] of [glyphs.slice(0,4),glyphs.slice(4)].entries()){
  let x=0;for(const [i,g] of gs.entries()){const b=bbox(g.final),y=row*(rowHeight+rowGap)+(g.char==='.'?rowHeight-(b.y1-b.y0):-box.y0);g.source=translate(g.source,x-b.x0,y);g.final=translate(g.final,x-b.x0,y);g.core=translate(g.core,x-b.x0,y);g.row=row;x+=b.x1-b.x0+(row===0&&i===2?wordGap:letterGap);}widths.push(x-letterGap);
 }
 return {glyphs,width:Math.max(...widths),height:2*rowHeight+rowGap,rowHeight,widths};
}
function makeSvg(art,palette,unrounded=false){return `<svg xmlns="http://www.w3.org/2000/svg" width="${n(art.width)}mm" height="${n(art.height)}mm" viewBox="0 0 ${n(art.width)} ${n(art.height)}"><title>FOR A / REASON. - OFF SHFT</title><desc>Outlined Archivo Bold adaptation to approved visual reference. Physical placement and supplier digitization must be verified separately.</desc>${art.glyphs.map(g=>`<path id="${g.id}" data-character="${g.char}" fill="${g.char==='.'?palette.period:palette.letters}" fill-rule="evenodd" d="${pathData(unrounded?g.source:g.final)}"/>`).join('\n')}</svg>\n`;}
function inner(s){return s.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');}
function proof(art,variants,referenceBytes){const W=210,H=266,x=15,fw=180;const label=(s,y,size=3.0,bold=false)=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${bold?700:400}" fill="#1F2733">${s}</text>`;let pieces=[`<rect width="210" height="266" fill="#F4F0E7"/>`,label('OFF SHFT / APPROVED CONCEPT TO VECTOR ARTWORK',11,3.1,true),label('FOR A / REASON.',23,7.0,true),label('Approved visual reference',33,3.2,true),`<image x="15" y="38" width="180" height="120" href="data:image/png;base64,${referenceBytes.toString('base64')}"/>`,label(`Exact vector proof / ${art.width.toFixed(2)} x ${art.height.toFixed(2)} mm`,169,3.4,true)];
 const xx=(W-field[0])/2,yy=175;pieces.push(`<rect x="${xx}" y="${yy}" width="${field[0]}" height="${field[1]}" fill="#283E33"/><g transform="translate(${(W-art.width)/2} ${yy+(field[1]-art.height)/2})">${inner(variants['bone-sun'])}</g><rect x="${xx}" y="${yy}" width="${field[0]}" height="${field[1]}" fill="none" stroke="#8F9B87" stroke-width=".2" stroke-dasharray="1.2 1.2"/>`);
 pieces.push(label('6606 field shown at actual SVG scale:149.86 x50.8 mm. Photo scale is illustrative.',232,2.65),label('Controlled Archivo Bold outlines; compact proportions and rounded terminals.',239,2.65),label('Bone/Sun for Charcoal and Evergreen; Ink/Rust for Ivory. Same geometry.',246,2.65),label('Compare lettering to the approved photo before upload; no stitch simulation.',253,2.65),label('Supplier threads, blank-specific placement and digitization remain separate checks.',260,2.55));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="266mm" viewBox="0 0 210 266"><title>FOR A REASON reference comparison</title>${pieces.join('\n')}</svg>\n`;
}
function paletteProof(art,variants){const W=210,H=242;const cards=[['Charcoal / Bone + Sun','bone-sun','#333533'],['Ivory / Ink + Rust','ink-rust','#E4DDCB'],['Evergreen / Bone + Sun','bone-sun','#283E33']];let a=[`<rect width="210" height="242" fill="#F4F0E7"/><text x="15" y="13" font-family="Arial,sans-serif" font-size="5" font-weight="700" fill="#1F2733">FOR A / REASON. - three colourways</text>`];for(const [i,[label,key,bg]]of cards.entries()){let y=23+i*67,scale=Math.min(140/art.width,49/art.height);a.push(`<text x="15" y="${y}" font-family="Arial,sans-serif" font-size="3" fill="#1F2733">${label}</text><rect x="15" y="${y+4}" width="180" height="55" rx="1" fill="${bg}"/><g transform="translate(${105-art.width*scale/2} ${y+4+(55-art.height*scale)/2}) scale(${scale})">${inner(variants[key])}</g>`);}a.push(`<text x="15" y="238" font-family="Arial,sans-serif" font-size="2.7" fill="#1F2733">Flat colour references, not fabric or thread simulations. Both artwork files share identical geometry.</text>`);return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="242mm" viewBox="0 0 210 242">${a.join('\n')}</svg>`;}
async function render(xml,file,width,dpi){const vb=xml.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number),height=Math.round(width*vb[3]/vb[2]);xml=xml.replace(/width="[^"]+" height="[^"]+"/,`width="${width}px" height="${height}px"`);await sharp(Buffer.from(xml),{density:72}).ensureAlpha().withMetadata({density:dpi}).png().toFile(file);return [width,height];}
async function main(){const originalFont=fs.readFileSync(FONT),ref=fs.readFileSync(REFERENCE),art=compose();if(art.width>field[0]||art.height>field[1])throw new Error(`Artwork exceeds6606 field:${art.width}x${art.height}`);
 const measurements={status:'Prepared artwork - reference-match and independent geometry review pending',text:['FOR A','REASON.'],fontSource:'tools/fonts/Archivo-Bold.ttf',fontSha256:hash(originalFont),referenceSource:REFERENCE,referenceSha256:hash(ref),widthMm:n(art.width),heightMm:n(art.height),fieldMm:field,lineWidthsMm:art.widths.map(n),parameters:{sourceCapMm:cap,horizontalFactor:horizontal,outwardOffsetMm:inflate,rollingDiscRadiusMm:radius,rollingDiscDiameterMm:2*radius,letterGapMm:letterGap,wordGapMm:wordGap,rowGapMm:rowGap,periodDiameterMm:dotDiameter,polygonGridMm:1/SCALE,offsetArcToleranceMm:.0005,curveSamplesPerSegment:64},glyphs:art.glyphs.map(g=>({id:g.id,char:g.char,row:g.row,expectedCounters:g.expectedCounters,nominalRollingDiscDiameterMm:g.nominalRollingDiscDiameterMm,coreStats:stats(g.core),finalStats:stats(g.final),coreContoursMm:g.core.map(p=>p.map(q=>[q.X/SCALE,q.Y/SCALE])),finalContoursMm:g.final.map(p=>p.map(q=>[q.X/SCALE,q.Y/SCALE]))}))};
 fs.writeFileSync(path.join(__dirname,'measurements.json'),JSON.stringify(measurements,null,2)+'\n');const variants={},files=[];
 for(const [key,p]of Object.entries(palettes)){const xml=makeSvg(art,p),name='for-a-reason-'+key;variants[key]=xml;fs.writeFileSync(path.join(__dirname,name+'.svg'),xml);const pixels=await render(xml,path.join(__dirname,name+'.png'),Math.round(art.width/25.4*600),600);files.push({palette:key,svg:name+'.svg',png:name+'.png',pixels,dpi:600,transparent:true,colourSpace:'sRGB',colours:[p.letters,p.period],svgSha256:hash(Buffer.from(xml)),pngSha256:hash(fs.readFileSync(path.join(__dirname,name+'.png')))});}
 fs.writeFileSync(path.join(__dirname,'approved-mockup.png'),ref);fs.writeFileSync(path.join(__dirname,'outlined-source-before-rounding.svg'),makeSvg(art,palettes['bone-sun'],true));const comparison=proof(art,variants,ref);fs.writeFileSync(path.join(__dirname,'comparison-proof.svg'),comparison);await render(comparison,path.join(__dirname,'comparison-proof.png'),2100,150);const pproof=paletteProof(art,variants);fs.writeFileSync(path.join(__dirname,'colourways-proof.svg'),pproof);await render(pproof,path.join(__dirname,'colourways-proof.png'),2100,150);
 const manifest={status:measurements.status,purpose:'Production artwork matching owner-approved visual reference; no live upload or mutation performed',text:measurements.text,dimensionsMm:[n(art.width),n(art.height)],font:{path:measurements.fontSource,sha256:measurements.fontSha256,licence:'tools/fonts/OFL-Archivo.txt',adaptation:'Archivo Bold outlined; horizontal factor0.82 except A0.90; outward1.4mm; connected-core radius2.65mm; A counter opened2.2mm; R counter expanded0.25mm; E/S mouths opened; period6mm'},reference:{path:'approved-mockup.png',source:REFERENCE,sha256:hash(ref)},fieldBasis:{blanks:['Yupoong 6606','Comfort Colors CCST0'],dimensionsMm:field,source:'store/printful-setup/for-a-reason-supplier-check.json',sourceSha256:hash(fs.readFileSync(path.join(ROOT,'store/printful-setup/for-a-reason-supplier-check.json')))},colourways:JSON.parse(fs.readFileSync(path.join(ROOT,'store/printful-setup/for-a-reason-supplier-check.json'),'utf8')).chosenMapping.map(q=>({colour:q.supplierColour,blank:q.blank,catalogueProductId:q.catalogueProductId,catalogueVariantId:q.catalogueVariantId,artwork:q.supplierColour==='Ivory/Ivory'?'ink-rust':'bone-sun',placement:q.placement,threadColourOptionId:q.threadColourOptionId,embroideryTypeOption:q.embroideryTypeOption,fieldMm:[q.fieldWidthMm,q.fieldHeightMm]})),files,measurements:'measurements.json',comparisonProof:'comparison-proof.png',colourwaysProof:'colourways-proof.png',builder:'build.cjs'};
 fs.writeFileSync(path.join(__dirname,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');if(hash(fs.readFileSync(FONT))!==hash(originalFont)||hash(fs.readFileSync(REFERENCE))!==hash(ref))throw new Error('Source changed');console.log(JSON.stringify({width:art.width,height:art.height,lineWidths:art.widths,letters:art.glyphs.map(g=>[g.char,stats(g.core),stats(g.final)])},null,2));}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});




