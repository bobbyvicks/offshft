'use strict';
// Read only artwork geometry; writes version-hashed review data in this folder.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const C=require(path.resolve(__dirname,'../../../../tools/node_modules/clipper-lib'));
const raw=fs.readFileSync(path.join(__dirname,'measurements.json'));
const data=JSON.parse(raw),SCALE=10000;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const point=(x,y)=>({X:Math.round(x*SCALE),Y:Math.round(y*SCALE)});
function boolean(type,a,b=[]){const c=new C.Clipper();c.AddPaths(a,C.PolyType.ptSubject,true);if(b.length)c.AddPaths(b,C.PolyType.ptClip,true);let r=[];c.Execute(type,r,C.PolyFillType.pftNonZero,C.PolyFillType.pftNonZero);return r;}
function offset(p,r){const c=new C.ClipperOffset(2,.0005*SCALE),q=[];c.AddPaths(p,C.JoinType.jtRound,C.EndType.etClosedPolygon);c.Execute(q,r*SCALE);return q;}
function connected(p,probe){return p.some(r=>C.Clipper.Area(r)>0&&C.Clipper.PointInPolygon(probe,r)!==0&&C.Clipper.PointInPolygon(point(-5,-5),r)!==0)&&!p.some(r=>C.Clipper.Area(r)<0&&C.Clipper.PointInPolygon(probe,r)!==0);}
const openings=[],construction=[];
for(const g of data.glyphs){
 const actual=g.finalContoursMm.map(r=>r.map(([x,y])=>point(x,y)));
 const core=g.coreContoursMm.map(r=>r.map(([x,y])=>point(x,y)));
 const rebuilt=offset(core,2.65),xor=boolean(C.ClipType.ctXor,actual,rebuilt);
 construction.push({id:g.id,char:g.char,coreOuterComponents:core.filter(r=>C.Clipper.Area(r)>0).length,coreCounters:core.filter(r=>C.Clipper.Area(r)<0).length,finalOuterComponents:actual.filter(r=>C.Clipper.Area(r)>0).length,finalCounters:actual.filter(r=>C.Clipper.Area(r)<0).length,reconstructionXorAreaMm2:Math.abs(xor.reduce((s,r)=>s+C.Clipper.Area(r),0))/SCALE**2,periodCircleApproximation:g.char==='.'});
 if(!'FES'.includes(g.char))continue;
 const pts=g.finalContoursMm.flat(),x0=Math.min(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1]));
 const rings=g.finalContoursMm.map(r=>r.map(([x,y])=>point(x-x0,y-y0)));
 const exterior=[[point(-10,-10),point(45,-10),point(45,45),point(-10,45)]];
 const negative=boolean(C.ClipType.ctDifference,exterior,rings);
 const probes=g.char==='S'?[[8,6.8],[7.5,15]]:g.char==='E'?[[9,6.6],[9,14.5]]:[[9,7]];
 openings.push({id:g.id,char:g.char,openings:probes.map(([x,y])=>{let lo=0,hi=3;for(let k=0;k<18;k++){const mid=(lo+hi)/2;if(connected(offset(negative,-mid),point(x,y)))lo=mid;else hi=mid;}return{probeLocalMm:[x,y],clearanceDiameterLowerBoundMm:2*lo,clearanceDiameterUpperBoundMm:2*hi,passes1_27mmProbe:connected(offset(negative,-.635),point(x,y))};})});
}
const out={status:'Independent geometric review; not supplier acceptance',measurementsSha256:sha(raw),artworkMm:[data.widthMm,data.heightMm],construction,openings,method:'Exact supplied core offset by2.65mm and XOR against SVG-associated final contours; negative-space erosion proves a selected interior-mouth probe connects to exterior through a disc-clearance corridor. Period is a separately sampled6mm circle; small reconstruction area error is expected there.',allSelectedOpeningsPass:openings.every(g=>g.openings.every(o=>o.passes1_27mmProbe)),minimumTestedOpeningMm:Math.min(...openings.flatMap(g=>g.openings.map(o=>o.clearanceDiameterLowerBoundMm)))};
const version=sha(raw).slice(0,12);fs.writeFileSync(path.join(__dirname,`independent-opening-review-${version}.json`),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
