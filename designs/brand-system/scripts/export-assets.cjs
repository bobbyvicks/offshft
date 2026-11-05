// Run with Sharp available in node_modules or NODE_PATH.
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
  for(const dir of ['assets','applications']) {
    for(const file of fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.svg')&&!f.includes('guide')&&!f.includes('board'))) {
      const width=dir==='applications'?1600:file.startsWith('logo')?2400:1200;
      try {
        await sharp(path.join(root,dir,file),{density:300}).resize({width}).png().toFile(path.join(root,dir,file.replace('.svg','.png')));
      } catch(e) { throw new Error(`${dir}/${file}: ${e.message}`); }
    }
  }
  console.log('Exported canonical marks and application previews. SVG source geometry unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1;});
