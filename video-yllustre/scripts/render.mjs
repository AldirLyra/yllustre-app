import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';

const root=process.cwd();
const mode=process.argv[2]??'stills';
const v4=process.argv[3]==='v4';
const v3=process.argv[3]==='v3';
const v2=process.argv[3]==='v2';
const reviewDir=path.join(root,v4?'review-v4':v3?'review-v3':v2?'review-v2':'review');
const output=path.join(root,v4?'../entregas/Yllustre-Video-V4.mp4':v3?'../entregas/Yllustre-Video-V3.mp4':v2?'../entregas/Yllustre-Video-V2.mp4':'../entregas/yllustre-eventos-v1-final.mp4');
const executable='C:/Program Files/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(reviewDir,{recursive:true});
console.log('Bundling',mode);
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),outDir:path.join(root,v4?'build-v4':v3?'build-v3':v2?'build-v2':'build'),publicDir:path.join(root,'public-v2'),onProgress:p=>{if(p%20===0)console.log('Bundle',p);}});
console.log('Opening render browser');
const browser=await openBrowser('chrome',{browserExecutable:executable});
console.log('Selecting composition');
try {
 const composition=await selectComposition({serveUrl,id:v4?'YllustreEventosV4':v3?'YllustreEventosV3':v2?'YllustreEventosV2':'YllustreEventos',puppeteerInstance:browser});
 if(mode==='stills'){
   for(const frame of [0,100,150,225,380,540,730,810,900,990,1110,1170,1260,1335]){
     await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:path.join(reviewDir,`frame-${frame}.png`),scale:.5});
     console.log('Still',frame);
   }
 } else {
   let last=0;
   await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation:output,codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'256k',concurrency:2,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p>=last+10){last=p;console.log('Render',p+'%');}}});
 }
} finally {await browser.close({silent:true});}
