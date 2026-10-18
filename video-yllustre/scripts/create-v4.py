from pathlib import Path
import re, json

root=Path(__file__).resolve().parent.parent
dest=root/'src/YllustreFilmV4.tsx'
if dest.exists():
    raise SystemExit('V4 already exists; edit the composition directly.')
s=(root/'src/YllustreFilmV3.tsx').read_text(encoding='utf-8').replace('YllustreFilmV3','YllustreFilmV4').replace('scenesV3','scenesV4')
s=s.replace('perspective:1900,overlap:18,far:10,mid:24,near:42','perspective:1500,overlap:18,far:16,mid:42,near:70')
s=s.replace('f/115-1','clamp(f/210)*2-1')
s=s.replace('rx-c*.55*depth','rx-c*1.2*depth').replace('ry+c*1.3*depth','ry+c*3.5*depth').replace('rz+c*.5*depth','rz+c*depth')
s=s.replace('panX:-c*16,panY:c*20,zoom:1.1','panX:-c*22,panY:c*28,zoom:1.14')
s=s.replace("r0:480,r1:480,dark:1", "r0:mix(480,68,land(f,18,72)),r1:mix(480,68,land(f,18,72)),dark:1")
s=s.replace('96,680,888,1010,36,.6,1.2,-1','128,610,824,1080,36,.65,3,-7,2.2').replace('r1:240','r1:100')
s=s.replace('96,685,888,950,40,.5,.6,1','138,680,804,960,28,.65,4,7,-3')
s=s.replace('184,540,712,1180,46,.75,1,-1','154,560,772,1170,38,.75,2,-5,1.8')
s=s.replace('90,670,720,980,28,.75,.5,-2,-4','70,740,850,800,28,.75,5,-8,-3')
s=s.replace("film:(f:number)=>({...pose(f,0,0,1080,1920,0,0),rx:0,ry:0,rz:0,dark:1})", "film:(f:number)=>({...pose(f,0,0,1080,1920,0,0),rx:0,ry:0,rz:0,dark:1}),\n print:(f:number)=>({...pose(f,94,450,892,800,8,.5,3,-4,-3),dark:0}),\n departed:(f:number)=>({...pose(f,-1250,560,892,800,8,.4,3,-18,-8),dark:0})")
s=s.replace("fromImage:'celebracao',toImage:'oracao'}", "fromImage:'celebracao',toImage:'oracao'},\n {cut:990,source:'film',target:'print',sourceScene:5,targetScene:6,fromImage:'oracao',toImage:'celebracao'},\n {cut:1170,source:'print',target:'departed',sourceScene:6,targetScene:7,fromImage:'celebracao',toImage:'celebracao'}")
# V4 replaces null placeholder labels and footers with clean editable geometry.
s='\n'.join(line for line in s.split('\n') if not any(x in line for x in ['const Label=', 'function Footer(', '<Footer ', '<Label>','<Label light>']))
def replace_function(name,next_name,text):
    global s
    start=s.index('function '+name+'(');end=s.index('function '+next_name+'(',start)
    s=s[:start]+text+'\n'+s[end:]
replace_function('Plate','Picture', '''function Plate({s,light=false,offset=1}:{s:Pose,light?:boolean,offset?:number}){
 const c=-s.panX/22;
 return <div style={{...panelStyle({...s,x:s.x+36*offset-c*22,y:s.y+40*offset+c*12,ry:s.ry*.48,rx:s.rx*.45,rz:s.rz*.55}),background:light?'#c8c4b7':'#29291f',border:`1px solid ${light?'#0909091c':'#fffdf41b'}`,boxShadow:light?'0 18px 32px #09090910,0 44px 100px #09090916':'0 18px 28px #0004,0 55px 120px #0008'}}/>;
}''')
# A focus pull accompanies source changes; photo overscan protects all edges.
s=s.replace("function Picture({name,s}:{name:string,s:Pose}){\n return <>", "function Picture({name,s}:{name:string,s:Pose}){\n const frame=useCurrentFrame();\n const changes=[326,372,500,556,886,946];\n const focus=Math.max(0,...changes.map(at=>Math.max(0,1-Math.abs(frame-at)/7)))*2.6;\n return <>")
s=s.replace("objectPosition:`50% ${s.focusY}%`,transform:","objectPosition:`50% ${s.focusY}%`,filter:`blur(${focus}px)`,transform:")
s=s.replace("function Surface({s,children,shadow=true}:{s:Pose,children:React.ReactNode,shadow?:boolean}){\n return", "function Surface({s,children,shadow=true}:{s:Pose,children:React.ReactNode,shadow?:boolean}){\n const frame=useCurrentFrame(),sweep=progress(frame,22,64);\n return")
s=s.replace("{children}<AbsoluteFill", "{children}{frame>=22&&frame<64&&<div style={{position:'absolute',top:'-20%',bottom:'-20%',width:'18%',left:`${mix(-35,135,sweep)}%`,transform:'rotate(20deg)',background:'linear-gradient(90deg,transparent,#fffdf423,transparent)',mixBlendMode:'screen'}}/>}<AbsoluteFill")
s=s.replace("border:'1.5px solid #ffffff2a'", "border:'1.5px solid #ffffff45'")
s=s.replace("left:350+c*M.far", "left:350+c*M.far")
s=s.replace('translate(${-c*12}px,${c*8}px)', 'translate(${-c*16}px,${c*10}px)')
# Remove empty copied heads; introduce the brand as the initial focal point.
s=s.replace("  <div style={{position:'absolute',left:96,right:96,top:360,textAlign:'center',fontSize:62,fontWeight:500,...reveal(f,5)}}>Cobertura de eventos.</div>", "  {f<58&&<div style={{position:'absolute',left:0,right:0,top:730,display:'flex',justifyContent:'center',clipPath:`inset(0 0 ${100*land(f,44,58)}% 0)`,transform:`scale(${mix(1.3,1,land(f,0,12))}) translateY(${-45*land(f,44,58)}px)`}}><Brand large/></div>}\n  {f>=58&&<div style={{position:'absolute',left:96,right:96,top:360,textAlign:'center',fontSize:62,fontWeight:500,...reveal(f,58)}}>Cobertura de eventos.</div>}")
s=s.replace('left:96,top:340,...reveal(f,5)', 'left:96,top:290,...reveal(f,5)')
# Details: rear planes are smaller than half the focal photograph, and follow a different axis.
s=s.replace("return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/><Plate s={s} light offset={1.4}/>", "const backA=pose(f,-70,850,355,650,25,-.2,3,-12,-10),backB=pose(f,825,810,355,650,25,.2,3,12,10);\n return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/><div style={{opacity:.42,filter:'blur(2px)'}}><Surface s={backA}><Picture name=\"oracao\" s={backA}/></Surface><Surface s={backB}><Picture name=\"preparativos\" s={backB}/></Surface></div><Plate s={s} light offset={1.4}/>")
s=s.replace('790,1000,230,460,24,-.4,1,3,5','790,1120,230,460,24,-.4,3,9,6')
s=s.replace('left:35,right:35,bottom:85','left:35,right:35,bottom:68')
replace_function('Categories','Closing', '''function Categories({f}:{f:number}){
 const idx=f<70?0:f<125?1:2,at=[0,70,125][idx],s=poses.print(f);
 const paper={...s,x:s.x-30,y:s.y-30,w:s.w+60,h:s.h+210,r0:10,r1:10,r2:10,r3:10};
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/>
  <Surface s={paper}><AbsoluteFill style={{background:C.white}}/><div style={{position:'absolute',left:35,right:35,bottom:55,textAlign:'center',fontSize:54,fontFamily:'YGeorgia',fontStyle:'italic'}}>Memórias reais.</div></Surface>
  <Panel id="print" name="celebracao" s={s}/>
  <Head style={{position:'absolute',top:1595,fontSize:idx===2?91:105,...reveal(f,at)}}>{['Casamentos.','Formaturas.',<>Eventos<br/>de marcas.</>][idx]}</Head>
 </AbsoluteFill>;
}''')
s=s.replace('top:1110,textAlign:\'center\',fontSize:65','top:1110,textAlign:\'center\',fontSize:80')
# One global curved trajectory for the projected image and all seam geometry.
s=s.replace("const s=Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k as keyof Pose],z[k as keyof Pose],p)])) as Pose;", "const s=Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k as keyof Pose],z[k as keyof Pose],p)])) as Pose;\n const arc=Math.sin(p*Math.PI);\n s.x+=arc*(b.cut%300===0?-58:58);s.y-=arc*38;s.ry+=arc*5;s.rz+=arc*(b.cut===810?-2:2);")
s=s.replace("clipPath:`inset(0 0 ${100*(1-progress(p,.15,.85))}% 0)`", "clipPath:`polygon(0 0,100% 0,100% ${Math.min(100,progress(p,.12,.86)*125)}%,0 ${Math.max(0,progress(p,.12,.86)*125-25)}%)`")
s=s.replace('audio/yllustre-original.wav','audio/yllustre-v4.wav')
dest.write_text(s,encoding='utf-8')
p=root/'src/index.tsx';s=p.read_text(encoding='utf-8').replace('const Root',"import {YllustreFilmV4} from './YllustreFilmV4';\n\nconst Root").replace('</>;', '<Composition id="YllustreEventosV4" component={YllustreFilmV4} width={1080} height={1920} fps={30} durationInFrames={1350}/></>;');p.write_text(s,encoding='utf-8')
# Extend production scripts without replacing the older composition selectors.
for name in ['render.mjs','review.mjs','preview.mjs']:
 p=root/'scripts'/name;s=p.read_text(encoding='utf-8');arg=3 if name=='render.mjs' else 2
 s=s.replace('const v3=',f"const v4=process.argv[{arg}]==='v4';\nconst v3=",1)
 for a,b in [('review-v3','review-v4'),('build-v3','build-v4'),('../entregas/Yllustre-Video-V3.mp4','../entregas/Yllustre-Video-V4.mp4'),('../entregas/Yllustre-Video-V3-capa.jpg','../entregas/Yllustre-Video-V4-capa.jpg'),('YllustreEventosV3','YllustreEventosV4'),('preview-v3.html','preview-v4.html')]:s=s.replace("v3?'"+a+"'","v4?'"+b+"':v3?'"+a+"'")
 s=s.replace('v2||v3','v2||v3||v4').replace('v3?4320','v4?4324:v3?4320')
 if name=='render.mjs':s=s.replace('[0,100,225,380,540,730,900,1110,1300]','[0,100,150,225,380,540,730,810,900,990,1110,1170,1260,1335]')
 p.write_text(s,encoding='utf-8')
for a,b in [('src/lint-v3.tsx','src/lint-v4.tsx'),('scripts/lint-v3.mjs','scripts/lint-v4.mjs'),('scripts/audit-v3.mjs','scripts/audit-v4.mjs'),('scripts/close-review-v3.mjs','scripts/close-review-v4.mjs'),('preview-v3.html','preview-v4.html')]:
 s=(root/a).read_text(encoding='utf-8').replace('V3','V4').replace('v3','v4').replace('4321','4325').replace('VERSÃO 3','VERSÃO 4');(root/b).write_text(s,encoding='utf-8')
p=root/'package.json';data=json.loads(p.read_text());data['scripts'].update({k+':v4':v for k,v in [('render','node scripts/render.mjs video v4'),('review','node scripts/review.mjs v4'),('lint','node scripts/lint-v4.mjs'),('preview','node scripts/preview.mjs v4')]});p.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
p=root/'.gitignore';p.write_text(p.read_text()+'build-v4/\nbuild-lint-v4/\n')
print('V4 composition and production tools created.')
