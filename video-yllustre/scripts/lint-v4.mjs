import {bundle} from '@remotion/bundler';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd(),out=path.join(root,'build-lint-v4');
await bundle({entryPoint:path.join(root,'src/lint-v4.tsx'),outDir:out,publicDir:path.join(root,'public-v2'),ignoreRegisterRootWarning:true});
const server=http.createServer((req,res)=>{
 const file=path.resolve(out,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!file.startsWith(out+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.ttf':'font/ttf','.wav':'audio/wav'};
 res.setHeader('Content-Type',mime[path.extname(file)]??'application/octet-stream');fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(4325,'127.0.0.1',r));
const child=spawn(process.execPath,['references/motionmaxxing/scripts/lint.mjs','http://127.0.0.1:4325','--width','1080','--height','1920','--duration','45','--samples','36','--json'],{env:{...process.env,CHROME_PATH:'C:/Program Files/Google/Chrome/Application/chrome.exe'},stdio:['ignore','pipe','pipe']});
let result='';child.stdout.on('data',d=>result+=d);child.stderr.on('data',d=>process.stderr.write(d));
const code=await new Promise(r=>child.on('exit',r));server.close();
fs.writeFileSync('review-v4/lint.json',result);
try{const data=JSON.parse(result);console.log('G5:',data.gate);for(const rule of data.rules.filter(r=>r.status!=='PASS'))console.log(JSON.stringify(rule));}catch{console.log(result);}
process.exitCode=code;
