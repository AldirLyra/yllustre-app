import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const v4=process.argv[2]==='v4';
const v3=process.argv[2]==='v3';
const v2=process.argv[2]==='v2';
const routes={
 '/': [path.join(root,v4?'preview-v4.html':v3?'preview-v3.html':v2?'preview-v2.html':'preview.html'),'text/html; charset=utf-8'],
 '/film.mp4':[path.resolve(root,v4?'../entregas/Yllustre-Video-V4.mp4':v3?'../entregas/Yllustre-Video-V3.mp4':v2?'../entregas/Yllustre-Video-V2.mp4':'../entregas/yllustre-eventos-v1-final.mp4'),'video/mp4'],
 '/poster.jpg':[path.resolve(root,v4?'../entregas/Yllustre-Video-V4-capa.jpg':v3?'../entregas/Yllustre-Video-V3-capa.jpg':v2?'../entregas/Yllustre-Video-V2-capa.jpg':'../entregas/yllustre-eventos-capa.jpg'),'image/jpeg']
};
http.createServer((req,res)=>{
 const route=routes[req.url.split('?')[0]];
 if(!route||!fs.existsSync(route[0])){res.writeHead(404);res.end();return;}
 const [file,type]=route, size=fs.statSync(file).size;
 const range=req.headers.range;
 if(range){const m=/bytes=(\d+)-(\d*)/.exec(range);if(!m){res.writeHead(416);res.end();return;}const start=Number(m[1]),end=Math.min(m[2]?Number(m[2]):size-1,size-1);res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes'});fs.createReadStream(file,{start,end}).pipe(res);}
 else{res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes'});fs.createReadStream(file).pipe(res);}
}).listen(v4?4324:v3?4320:v2?4319:4318,'127.0.0.1',()=>console.log(`Yllustre preview: http://127.0.0.1:${v4?4324:v3?4320:v2?4319:4318}`));
