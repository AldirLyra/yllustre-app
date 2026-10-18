from pathlib import Path
import re

root=Path(__file__).resolve().parent.parent
if (root/'src/YllustreFilmV3.tsx').exists():
    raise SystemExit('V3 already exists. This one-time migration is not needed for rendering.')
s=(root/'src/YllustreFilmV2.tsx').read_text(encoding='utf-8')
s=s.replace('YllustreFilmV2','YllustreFilmV3').replace('scenesV2','scenesV3')
s=s.replace("const reveal=(f:number,d=0):CSSProperties=>({opacity:progress(f,d,d+18),transform:`translateY(${mix(38,0,progress(f,d,d+24))}px)`});", "const land=(f:number,a:number,b:number)=>1-Math.pow(1-clamp((f-a)/(b-a)),3.4);\nconst reveal=(f:number,d=0):CSSProperties=>({clipPath:`inset(0 0 ${100*(1-land(f,d,d+12))}% 0)`,transform:`translateY(${mix(56,0,land(f,d,d+12))}px)`});")
s=s.replace("const camera=(f:number)=>Math.sin(clamp(f/210)*Math.PI/2)*2-1;", "const camera=(f:number)=>f/115-1;")
s=s.replace('254,650,572,1020,60','184,540,712,1180,46')
s=s.replace('96,760,575,880,32','90,670,720,980,28')
s=s.replace("fontSize:110,fontWeight:700,letterSpacing:-6,lineHeight:1.02", "left:96,right:96,textAlign:'center',fontSize:110,fontWeight:700,letterSpacing:-5,lineHeight:1.06")
# No permanent logo, scene labels, progress lines or footer chrome.
s=re.sub(r'function Footer\([\s\S]*?\n}\nfunction StoryUI', 'function Footer(_:any){return null;}\nfunction StoryUI',s)
s=re.sub(r'const Label=[^\n]+', 'const Label=(_:any)=>null;',s)
s=re.sub(r'<div style=\{\{position:\'absolute\',left:96,top:76\}\}><Brand(?: light)?/></div>','',s)
s=re.sub(r'function StoryUI\([\s\S]*?\n}\nconst VideoUI=[^\n]+', '''function StoryUI({f}:{f:number}){
 const idx=f<74?0:f<130?1:2;
 return <div style={{position:'absolute',left:40,right:40,bottom:70,fontSize:65,lineHeight:1.1,textAlign:'center',fontWeight:700,...reveal(f,[0,74,130][idx])}}>{['No encontro.','Nos bastidores.','No grande momento.'][idx]}</div>;
}
const VideoUI=()=>null;''',s)
# Photo-derived grounds and a restrained directional reflection, no generic halo.
s=s.replace("const c=camera(f);\n return <AbsoluteFill", "const c=camera(f);\n return <AbsoluteFill",1)
start=s.index('function Backdrop(');end=s.index('function Plate(',start)
s=s[:start]+'''function Backdrop({f,light=false}:{f:number,light?:boolean}){
 const c=camera(f);
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  <Img src={media('celebracao')} style={{position:'absolute',inset:-90,width:1260,height:2100,objectFit:'cover',transform:`translate(${-c*12}px,${c*8}px) scale(1.12)`,filter:'blur(38px) saturate(.25)',opacity:light?.095:.18}}/>
  <AbsoluteFill style={{background:light?'linear-gradient(125deg,#fffdf455,#ded8c822)':'linear-gradient(125deg,#09090900,#09090999)'}}/>
 </AbsoluteFill>;
}
''' +s[end:]
start=s.index('function Opening(');end=s.index('function Presence(',start)
s=s[:start]+'''function Opening({f}:{f:number}){
 const s=poses.opening(f),p=land(f,72,84);
 return <AbsoluteFill><Backdrop f={f}/><Plate s={s}/><Panel id="opening" name="celebracao" s={s}/>
  <div style={{position:'absolute',left:96,right:96,top:360,textAlign:'center',fontSize:62,fontWeight:500,...reveal(f,5)}}>Cobertura de eventos.</div>
  <div style={{position:'absolute',left:96,right:96,top:1190,height:345,overflow:'hidden'}}>
   <Head style={{left:0,right:0,position:'absolute',fontSize:122,transform:`translateY(${-p*350}px)`}}>Seu evento.<br/>Uma vez.</Head>
   <Head style={{left:0,right:0,position:'absolute',fontSize:122,transform:`translateY(${(1-p)*350}px)`}}>A história<br/><Em>continua.</Em></Head>
  </div>
 </AbsoluteFill>;
}
''' +s[end:]
# Sticky-note component was an editorial label, replace with a picture-led statement only.
start=s.index("  <div style={{position:'absolute',left:54+camera(f)*16");end=s.index('  <Footer',start)
s=s[:start]+s[end:]
# Remove thumbnail counters/chips in the details picture.
start=s.index('   <div style={{position:\'absolute\',left:26,top:26');end=s.index('  </Panel>',start)
s=s[:start]+s[end:]
s=s.replace("left:96,top:1705,fontSize:35", "left:96,right:96,textAlign:'center',top:1705,fontSize:43")
# Real service names are spoken-size text, not tracked eyebrow labels.
s=s.replace('<Head style={{position:\'absolute\',left:96,top:340,fontSize:108,...reveal(f,5)}}>Enquanto<br/><Em>acontece.</Em></Head>', '<Head style={{position:\'absolute\',top:290,fontSize:93,...reveal(f,5)}}>Enquanto <Em>acontece.</Em></Head>')
s=s.replace("<span style={{display:'inline-block',width:11,height:11,marginRight:18,borderRadius:8,background:C.yellow}}/>Stories em tempo real.", 'Storymaker. Em tempo real.')
s=s.replace('top:1745,textAlign:\'center\',fontSize:33','top:1760,textAlign:\'center\',fontSize:49')
s=s.replace('620,910,365,650,32','790,1000,230,460,24')
s=s.replace("left:96,top:625,fontSize:33,color:'#56564b'", "left:96,right:96,textAlign:'center',top:1715,fontSize:48,color:'#56564b'")
s=s.replace('Do evento para as redes.','Videomaker. Para suas redes.')
s=re.sub(r'  <div style=\{\{position:\'absolute\',left:96,right:96,top:1720[\s\S]*?</div></div>\n','',s)
s=s.replace("left:96,top:1615,fontSize:35,lineHeight:1.35", "left:96,right:96,textAlign:'center',top:1615,fontSize:48,lineHeight:1.35")
s=s.replace('Filmes com narrativa,<br/>atmosfera e sentimento.','Filmmaker.<br/>Narrativa e sentimento.')
# Delete corner bracket; category material arrives as a printed photographic sheet.
s=re.sub(r'  <svg width="1080"[\s\S]*?</svg>\n','',s)
start=s.index('function Categories(');end=s.index('export const scenesV3=',start)
s=s[:start]+'''function Categories({f}:{f:number}){
 const idx=f<70?0:f<125?1:2,at=[0,70,125][idx];
 const words=['Casamentos.','Formaturas.','Eventos de marcas.'];
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/>
  <div style={{position:'absolute',left:64,top:420,width:952,height:1040,background:C.white,boxShadow:'0 35px 90px #09090933',transform:`perspective(1900px) rotateX(2deg) rotateY(${camera(f)*2}deg) rotateZ(${-3+camera(f)*1.3}deg)`}}>
   <Img src={media('celebracao')} style={{position:'absolute',inset:30,width:892,height:800,objectFit:'cover',objectPosition:'50% 45%',transform:`scale(${1+f*.00008})`}}/>
   <div style={{position:'absolute',left:40,right:40,bottom:65,fontSize:idx===2?72:90,letterSpacing:-4,textAlign:'center',fontWeight:600,...reveal(f,at)}}>{words[idx]}</div>
  </div>
  <Head style={{position:'absolute',top:1610,fontSize:67,fontWeight:400,...reveal(f,12)}}>Um olhar para<br/><Em light>cada história.</Em></Head>
 </AbsoluteFill>;
}
function Closing({f}:{f:number}){
 const g=useCurrentFrame(),end=land(g,1284,1308);
 if(g>=1284)return <AbsoluteFill><Backdrop f={f}/><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${mix(1.7,1,end)})`,clipPath:`inset(${(1-end)*44}% 0)`}}><Brand large/></div></AbsoluteFill>;
 const step=g<1224?0:1;
 return <AbsoluteFill><Backdrop f={f}/>
  <Head style={{position:'absolute',top:660,fontSize:98,...reveal(f,2)}}>{step===0?<>Qual história<br/>vamos <Em>contar?</Em></>:<>Peça seu<br/><Em>orçamento.</Em></>}</Head>
  <div style={{position:'absolute',left:70,right:70,top:1110,textAlign:'center',fontSize:65,letterSpacing:-2,...reveal(g,1200)}}>(63) 99241-1073</div>
  <div style={{position:'absolute',left:96,right:96,top:1245,textAlign:'center',fontSize:44,color:C.gray,...reveal(g,1208)}}>Converse no WhatsApp.</div>
 </AbsoluteFill>;
}

''' +s[end:]
# No yellow flood or transforming CTA pill. Keep a photographically grounded sheet.
s=s.replace("theme:'yellow'", "theme:'light'")
start=s.index('function YellowClosure(');end=s.index('export function YllustreFilmV3',start)
s=s[:start]+s[end:]
s=s.replace('  <YellowClosure frame={frame}/>','')
s=s.replace('const yellowReveal=i===6;', 'const yellowReveal=false;')
s=s.replace("if(i===6&&frame>=1152)return null;",'')
s=s.replace("opacity:i===7&&frame>=1152?1:yellowReveal?1:p", "opacity:frame>=scene.from?1:0")
# At seams, content leaves by acceleration and arrives by a quick masked move.
s=s.replace("style={{opacity:enter*exit}}", "style={{visibility:enter<=0||exit<=0?'hidden':'visible',clipPath:`inset(0 0 ${(1-enter)*100}% 0)`,transform:`translateY(${-72*Math.pow(1-exit,2.6)}px)`}}")
# Carry the outgoing opening words until the shared photo owns the seam.
s=s.replace("left:100-s.x,top:1140-s.y", "left:96-s.x,right:96,top:1190-s.y")
s=s.replace('letterSpacing:large?9:6', 'letterSpacing:large?2:0')
(root/'src/YllustreFilmV3.tsx').write_text(s,encoding='utf-8')
p=root/'src/index.tsx';s=p.read_text(encoding='utf-8')
s=s.replace("const Root", "import {YllustreFilmV3} from './YllustreFilmV3';\n\nconst Root")
s=s.replace('</>;','<Composition id="YllustreEventosV3" component={YllustreFilmV3} width={1080} height={1920} fps={30} durationInFrames={1350}/></>;')
p.write_text(s,encoding='utf-8')
for name in ['render.mjs','review.mjs','preview.mjs']:
 p=root/'scripts'/name;s=p.read_text(encoding='utf-8')
 arg='3' if name=='render.mjs' else '2'
 s=s.replace("const v2=process.argv["+arg+"]==='v2';", "const v3=process.argv["+arg+"]==='v3';\nconst v2=process.argv["+arg+"]==='v2';")
 for a,b in [('review-v2','review-v3'),('build-v2','build-v3'),('../entregas/Yllustre-Video-V2.mp4','../entregas/Yllustre-Video-V3.mp4'),('../entregas/Yllustre-Video-V2-capa.jpg','../entregas/Yllustre-Video-V3-capa.jpg'),('YllustreEventosV2','YllustreEventosV3'),('preview-v2.html','preview-v3.html')]:
  s=s.replace("v2?'"+a+"'", "v3?'"+b+"':v2?'"+a+"'")
 s=s.replace('if(v2){','if(v2||v3){').replace('const at=v2?', 'const at=(v2||v3)?')
 s=s.replace('v2?4319:4318','v3?4320:v2?4319:4318')
 s=s.replace("const root=process.cwd();", "const root=process.cwd();")
 if name=='render.mjs':s=s.replace("console.log('Bundling',mode);", "fs.mkdirSync(reviewDir,{recursive:true});\nconsole.log('Bundling',mode);")
 p.write_text(s,encoding='utf-8')
(root/'review-v3').mkdir(exist_ok=True)
p=root/'preview-v2.html'
s=p.read_text(encoding='utf-8').replace('Versão 2','Versão 3').replace('V2','V3').replace('Profundidade','Motionmaxxing')
(root/'preview-v3.html').write_text(s,encoding='utf-8')
print('V3 source and version-aware production scripts created.')
