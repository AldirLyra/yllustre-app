import path from 'node:path';
import fs from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const root=process.cwd();
const v4=process.argv[2]==='v4';
const v3=process.argv[2]==='v3';
const v2=process.argv[2]==='v2';
const reviewDir=path.join(root,v4?'review-v4':v3?'review-v3':v2?'review-v2':'review');
const native=path.join(root,'node_modules/@remotion/compositor-win32-x64-msvc');
const fullff=path.dirname(ffmpeg.path);
const env={...process.env,Path:fullff+path.delimiter+native+path.delimiter+process.env.Path,PATH:fullff+path.delimiter+native+path.delimiter+(process.env.PATH??process.env.Path)};
const file=path.resolve(root,v4?'../entregas/Yllustre-Video-V4.mp4':v3?'../entregas/Yllustre-Video-V3.mp4':v2?'../entregas/Yllustre-Video-V2.mp4':'../entregas/yllustre-eventos-v1-final.mp4');
const ff=ffmpeg.path;
const script=path.join(root,'skill/criador-de-videos/scripts/verificar-video.mjs');
const result=execFileSync(process.execPath,[script,file,'--duration','45','--width','1080','--height','1920','--fps','30','--frames','1350','--audio','required'],{env,encoding:'utf8',timeout:300000});
fs.writeFileSync(path.join(reviewDir,'technical-report.json'),result);
console.log(result);
const frames=[100,225,380,540,730,900,1110,1300];
execFileSync(ff,['-v','error','-y','-i',file,'-vf',`select='${frames.map(n=>`eq(n,${n})`).join('+')}',scale=270:480,tile=4x2:padding=8:margin=8`,'-frames:v','1',path.join(reviewDir,'mp4-storyboard.jpg')],{timeout:120000});
for(const cut of [150,300,450,630,810,990,1170]){
 const at=(v2||v3||v4)?(cut===150?[-24,-18,-12,-6,0,6,12,18,24]:[-18,-12,-6,0,6,12,18]).map(n=>cut+n):[cut-12,cut-8,cut-4,cut,cut+4,cut+8];
 execFileSync(ff,['-v','error','-y','-i',file,'-vf',`select='${at.map(n=>`eq(n,${n})`).join('+')}',scale=180:320,tile=${at.length}x1:padding=5:margin=5`,'-frames:v','1',path.join(reviewDir,`transition-${cut}.jpg`)],{timeout:120000});
}
execFileSync(ff,['-v','error','-y','-i',file,'-vf',`select='eq(n,${v4?30:100})'`,'-frames:v','1',path.resolve(root,v4?'../entregas/Yllustre-Video-V4-capa.jpg':v3?'../entregas/Yllustre-Video-V3-capa.jpg':v2?'../entregas/Yllustre-Video-V2-capa.jpg':'../entregas/yllustre-eventos-capa.jpg')],{timeout:120000});
console.log('Extracted all scenes and 7 transition contact sheets from the exported MP4.');
if(v2||v3||v4){
 const dark=spawnSync(ff,['-hide_banner','-i',file,'-vf','blackdetect=d=0.03:pix_th=0.08:pic_th=0.99','-an','-f','null','-'],{encoding:'utf8',timeout:120000});
 if(dark.status!==0)throw new Error(dark.stderr);
 const segments=[...dark.stderr.matchAll(/black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)/g)].map(m=>({start:Number(m[1]),end:Number(m[2]),duration:Number(m[3])}));
 fs.writeFileSync(path.join(reviewDir,'black-frame-check.json'),JSON.stringify({ok:segments.length===0,threshold:{minimumDuration:.03,pixel:.08,picture:.99},segments,limit:'Checks nearly black frames; does not prove visual continuity or perceptual quality.'},null,2));
 console.log('Black-frame check:',segments.length===0?'passed':segments);
 if(segments.length)process.exitCode=1;
}
