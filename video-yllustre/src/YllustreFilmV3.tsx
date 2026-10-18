import React, {CSSProperties} from 'react';
import {AbsoluteFill, Easing, Html5Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import './style.css';

const C={yellow:'#ffe100',black:'#090909',white:'#fffdf4',gray:'#aaa99e'};
const M={perspective:1900,overlap:18,far:10,mid:24,near:42};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const ease=Easing.bezier(.4,0,.2,1);
const progress=(f:number,a:number,b:number)=>ease(clamp((f-a)/(b-a)));
const land=(f:number,a:number,b:number)=>1-Math.pow(1-clamp((f-a)/(b-a)),3.4);
const reveal=(f:number,d=0):CSSProperties=>({clipPath:`inset(0 0 ${100*(1-land(f,d,d+12))}% 0)`,transform:`translateY(${mix(56,0,land(f,d,d+12))}px)`});
const media=(name:string)=>staticFile(`media/${name}.jpg`);
const camera=(f:number)=>f/115-1;
type Pose={x:number,y:number,w:number,h:number,rx:number,ry:number,rz:number,r0:number,r1:number,r2:number,r3:number,panX:number,panY:number,zoom:number,dark:number,focusY:number};
const pose=(f:number,x:number,y:number,w:number,h:number,r:number,depth=1,rx=0,ry=0,rz=0):Pose=>{
  const c=camera(f);
  return {x:x+c*M.near*depth,y:y-c*M.mid*depth,w,h,rx:rx-c*.55*depth,ry:ry+c*1.3*depth,rz:rz+c*.5*depth,r0:r,r1:r,r2:r,r3:r,panX:-c*16,panY:c*20,zoom:1.1+clamp(f/210)*.025,dark:0,focusY:50};
};
const poses={
 opening:(f:number)=>({...pose(f,48,188,984,1500,54,.45,.6,-.7),r0:480,r1:480,dark:1}),
 presence:(f:number)=>({...pose(f,96,680,888,1010,36,.6,1.2,-1),r1:240,focusY:40}),
 details:(f:number)=>pose(f,96,685,888,950,40,.5,.6,1),
 story:(f:number)=>({...pose(f,184,540,712,1180,46,.75,1,-1),dark:1}),
 video:(f:number)=>({...pose(f,90,670,720,980,28,.75,.5,-2,-4),dark:1}),
 film:(f:number)=>({...pose(f,0,0,1080,1920,0,0),rx:0,ry:0,rz:0,dark:1})
};
type Slot=keyof typeof poses;
const cuts=[150,300,450,630,810,990,1170];
const bridges:Array<{cut:number,source:Slot,target:Slot,sourceScene:number,targetScene:number,fromImage:string,toImage:string}>=[
 {cut:150,source:'opening',target:'presence',sourceScene:0,targetScene:1,fromImage:'celebracao',toImage:'equipe'},
 {cut:300,source:'presence',target:'details',sourceScene:1,targetScene:2,fromImage:'equipe',toImage:'preparativos'},
 {cut:450,source:'details',target:'story',sourceScene:2,targetScene:3,fromImage:'encontro',toImage:'encontro'},
 {cut:630,source:'story',target:'video',sourceScene:3,targetScene:4,fromImage:'celebracao',toImage:'celebracao'},
 {cut:810,source:'video',target:'film',sourceScene:4,targetScene:5,fromImage:'celebracao',toImage:'oracao'}
];
const starts=[0,150,300,450,630,810,990,1170];
const local=(frame:number,index:number)=>frame-starts[index]+(index===0?0:24);
const bridgeActive=(frame:number,id:Slot)=>bridges.some(b=>(b.source===id||b.target===id)&&frame>=b.cut-M.overlap&&frame<b.cut+M.overlap);
const panelStyle=(s:Pose):CSSProperties=>({position:'absolute',left:s.x,top:s.y,width:s.w,height:s.h,borderRadius:`${s.r0}px ${s.r1}px ${s.r2}px ${s.r3}px`,transform:`perspective(${M.perspective}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg) rotateZ(${s.rz}deg)`,transformOrigin:'50% 50%'});

function Brand({light=false,large=false}:{light?:boolean,large?:boolean}){
 return <div style={{display:'flex',alignItems:'center',gap:large?26:18,color:light?C.black:C.white}}><Img src={media('logo')} style={{width:large?112:62,height:large?112:62,borderRadius:'50%'}}/><div style={{fontSize:large?44:28,fontWeight:700,letterSpacing:large?2:0}}>YLLUSTRE</div></div>;
}
const Label=(_:any)=>null;
const Head=({children,style={}}:{children:React.ReactNode,style?:CSSProperties})=><div style={{left:96,right:96,textAlign:'center',fontSize:110,fontWeight:700,letterSpacing:-5,lineHeight:1.06,...style}}>{children}</div>;
const Em=({children,light=false}:{children:React.ReactNode,light?:boolean})=><span style={{fontFamily:'YGeorgia,Georgia,serif',fontStyle:'italic',fontWeight:400,color:light?C.black:C.yellow}}>{children}</span>;

function Backdrop({f,light=false}:{f:number,light?:boolean}){
 const c=camera(f);
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  <Img src={media('celebracao')} style={{position:'absolute',inset:-90,width:1260,height:2100,objectFit:'cover',transform:`translate(${-c*12}px,${c*8}px) scale(1.12)`,filter:'blur(38px) saturate(.25)',opacity:light?.095:.18}}/>
  <AbsoluteFill style={{background:light?'linear-gradient(125deg,#fffdf455,#ded8c822)':'linear-gradient(125deg,#09090900,#09090999)'}}/>
 </AbsoluteFill>;
}
function Plate({s,light=false,offset=1}:{s:Pose,light?:boolean,offset?:number}){
 return <div style={{...panelStyle({...s,x:s.x+24*offset,y:s.y+26*offset,ry:s.ry*.45,rx:s.rx*.45,rz:s.rz*.6}),background:light?'#d5d3c61c':'#2a291c',border:`1px solid ${light?'#09090913':'#fffdf416'}`,boxShadow:light?'0 24px 65px #0909090c':'0 32px 80px #0005'}}/>;
}
function Picture({name,s}:{name:string,s:Pose}){
 return <>
  <Img src={media(name)} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',objectPosition:`50% ${s.focusY}%`,transform:`translate(${s.panX}px,${s.panY}px) scale(${s.zoom})`}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.06) 20%,rgba(0,0,0,.82) 100%)',opacity:s.dark}}/>
 </>;
}
function Surface({s,children,shadow=true}:{s:Pose,children:React.ReactNode,shadow?:boolean}){
 return <div style={{...panelStyle(s),overflow:'hidden',background:'#24241c',boxShadow:shadow?'0 14px 23px #00000020,0 42px 95px #00000038':undefined}}>{children}<AbsoluteFill style={{pointerEvents:'none',border:'1.5px solid #ffffff2a',borderRadius:'inherit',background:'linear-gradient(125deg,#ffffff09,transparent 30%,transparent 76%,#00000008)'}}/></div>;
}
function Panel({id,name,s,children}:{id:Slot,name:string,s:Pose,children?:React.ReactNode}){
 const g=useCurrentFrame();
 if(bridgeActive(g,id)||id==='film')return null;
 return <Surface s={s} shadow={id!=='film'}><Picture name={name} s={s}/>{children}</Surface>;
}
function Footer(_:any){return null;}
function StoryUI({f}:{f:number}){
 const idx=f<74?0:f<130?1:2;
 return <div style={{position:'absolute',left:40,right:40,bottom:70,fontSize:65,lineHeight:1.1,textAlign:'center',fontWeight:700,...reveal(f,[0,74,130][idx])}}>{['No encontro.','Nos bastidores.','No grande momento.'][idx]}</div>;
}
const VideoUI=()=> <div style={{position:'absolute',left:35,right:35,bottom:85,textAlign:'center',fontSize:78,fontWeight:500,color:C.white}}>Videomaker.</div>;

function Opening({f}:{f:number}){
 const s=poses.opening(f),p=land(f,72,84);
 return <AbsoluteFill><Backdrop f={f}/><Plate s={s}/><Panel id="opening" name="celebracao" s={s}/>
  <div style={{position:'absolute',left:96,right:96,top:360,textAlign:'center',fontSize:62,fontWeight:500,...reveal(f,5)}}>Cobertura de eventos.</div>
  <div style={{position:'absolute',left:96,right:96,top:1190,height:345,overflow:'hidden'}}>
   <Head style={{left:0,right:0,position:'absolute',fontSize:122,transform:`translateY(${-p*350}px)`}}>Seu evento.<br/>Uma vez.</Head>
   <Head style={{left:0,right:0,position:'absolute',fontSize:122,transform:`translateY(${(1-p)*350}px)`}}>A história<br/><Em>continua.</Em></Head>
  </div>
 </AbsoluteFill>;
}
function Presence({f}:{f:number}){
 const s=poses.presence(f);
 return <AbsoluteFill><Backdrop f={f}/><Plate s={s} offset={1.5}/><Panel id="presence" name="equipe" s={s}/>
  <div style={{position:'absolute',left:96,top:265,...reveal(f,0)}}><Label>O NOSSO OLHAR</Label></div>
  <Head style={{position:'absolute',left:96,top:340,...reveal(f,5)}}>Você vive.<br/><Em>A gente conta.</Em></Head>
  <Footer left="YLLUSTRE" right="01 / PRESENÇA"/>
 </AbsoluteFill>;
}
function Details({f}:{f:number}){
 const idx=f<50?0:f<96?1:2,names=['preparativos','oracao','encontro'],s=poses.details(f);
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/><Plate s={s} light offset={1.4}/><Panel id="details" name={names[idx]} s={s}>
  </Panel>
  <div style={{position:'absolute',left:96,top:260,...reveal(f,0)}}><Label light>ANTES. DURANTE. DEPOIS.</Label></div>
  <Head style={{position:'absolute',left:96,top:340,fontSize:120,...reveal(f,5)}}>Cada detalhe<br/><Em light>conta.</Em></Head>
 </AbsoluteFill>;
}
function Stories({f}:{f:number}){
 const idx=f<74?0:f<130?1:2,names=['encontro','bastidores','celebracao'],s=poses.story(f);
 const a={...pose(f,-90,805,360,660,35,.28,1,-4,-9),dark:.7},b={...pose(f,810,750,360,660,35,-.3,1,4,9),dark:.7};
 return <AbsoluteFill><Backdrop f={f}/>
  <div style={{opacity:.42,filter:'blur(1px)'}}><Surface s={a}><Picture name="oracao" s={a}/></Surface><Surface s={b}><Picture name="preparativos" s={b}/></Surface></div>
  <Plate s={s}/><Panel id="story" name={names[idx]} s={s}><StoryUI f={f}/></Panel>
  <div style={{position:'absolute',left:96,top:260,...reveal(f,0)}}><Label>STORYMAKER</Label></div>
  <Head style={{position:'absolute',top:290,fontSize:100,...reveal(f,5)}}>Storymaker.<br/><Em>Em tempo real.</Em></Head>
 </AbsoluteFill>;
}
function VideoMaker({f}:{f:number}){
 const s=poses.video(f),b={...pose(f,790,1000,230,460,24,-.4,1,3,5),dark:1};
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/>
  <Plate s={b} light/><Surface s={b}><Picture name="bastidores" s={b}/></Surface>
  <Plate s={s} light/><Panel id="video" name="celebracao" s={s}><VideoUI/></Panel>
  <div style={{position:'absolute',left:96,top:265,...reveal(f,0)}}><Label light>VIDEOMAKER</Label></div>
  <Head style={{position:'absolute',left:96,top:350,fontSize:112,...reveal(f,5)}}>A energia vira<br/><Em light>conteúdo.</Em></Head>
  <Footer left="VÍDEOS PARA REDES SOCIAIS" right="↗" light/>
 </AbsoluteFill>;
}
function FilmMaker({f}:{f:number}){
 const s=poses.film(f),t=Math.max(0,f-42);
 return <AbsoluteFill><Panel id="film" name="oracao" s={s}/><AbsoluteFill style={{background:'linear-gradient(180deg,#090909a0,transparent 30%,transparent 48%,#090909e8 90%)'}}/>
  <div style={{position:'absolute',left:96,top:1210,...reveal(t,0)}}><Label>FILMMAKER</Label></div>
  <Head style={{position:'absolute',left:96,top:1290,fontSize:128,...reveal(t,5)}}>A emoção<br/><Em>fica.</Em></Head>
  <div style={{position:'absolute',left:96,right:96,textAlign:'center',top:1620,fontSize:78,lineHeight:1.35,...reveal(t,18)}}>Filmmaker.</div>
 </AbsoluteFill>;
}
function Categories({f}:{f:number}){
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
 const g=useCurrentFrame(),end=land(g,1311,1323);
 if(g>=1311)return <AbsoluteFill><Backdrop f={f}/><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${mix(1.7,1,end)})`,clipPath:`inset(${(1-end)*44}% 0)`}}><Brand large/></div></AbsoluteFill>;
 const step=g<1224?0:1;
 return <AbsoluteFill><Backdrop f={f}/>
  <Head style={{position:'absolute',top:660,fontSize:98,...reveal(f,2)}}>{step===0?<>Qual história<br/>vamos <Em>contar?</Em></>:<>Peça seu<br/><Em>orçamento.</Em></>}</Head>
  <div style={{position:'absolute',left:70,right:70,top:1110,textAlign:'center',fontSize:65,letterSpacing:-2,...reveal(g,1200)}}>(63) 99241-1073</div>
  <div style={{position:'absolute',left:96,right:96,top:1245,textAlign:'center',fontSize:44,color:C.gray,...reveal(g,1208)}}>Converse no WhatsApp.</div>
 </AbsoluteFill>;
}

export const scenesV3=[
 {from:0,duration:150,component:Opening,theme:'dark'},
 {from:150,duration:150,component:Presence,theme:'dark'},
 {from:300,duration:150,component:Details,theme:'light'},
 {from:450,duration:180,component:Stories,theme:'dark'},
 {from:630,duration:180,component:VideoMaker,theme:'light'},
 {from:810,duration:180,component:FilmMaker,theme:'dark'},
 {from:990,duration:180,component:Categories,theme:'light'},
 {from:1170,duration:180,component:Closing,theme:'dark'}
];
function Bridge({frame,b}:{frame:number,b:typeof bridges[number]}){
 const start=b.cut-M.overlap,end=b.cut+M.overlap;
 if(frame<start||frame>=end)return null;
 const p=progress(frame,start,end),sf=local(frame,b.sourceScene),tf=local(frame,b.targetScene);
 const a=poses[b.source](sf),z=poses[b.target](tf);
 const s=Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k as keyof Pose],z[k as keyof Pose],p)])) as Pose;
 // One shared projected surface, with a single global progress for all geometry.
 // The source and target image use the same interpolated camera/crop.
 return <Surface s={s} shadow={b.target!=='film'||p<.95}>
  <Picture name={b.fromImage} s={s}/>
  {b.fromImage!==b.toImage&&<AbsoluteFill style={{clipPath:`inset(0 0 ${100*(1-progress(p,.15,.85))}% 0)`}}><Picture name={b.toImage} s={s}/></AbsoluteFill>}
  {b.source==='story'&&<AbsoluteFill style={{opacity:1-progress(p,0,.4)}}><StoryUI f={sf}/></AbsoluteFill>}
  {b.target==='story'&&<AbsoluteFill style={{opacity:progress(p,.6,1)}}><StoryUI f={tf}/></AbsoluteFill>}
  {b.source==='video'&&<AbsoluteFill style={{opacity:1-progress(p,0,.4)}}><VideoUI/></AbsoluteFill>}
  {b.target==='video'&&<AbsoluteFill style={{opacity:progress(p,.6,1)}}><VideoUI/></AbsoluteFill>}
  {b.source==='opening'&&<div style={{position:'absolute',left:96-s.x,right:96,top:1190-s.y,opacity:1-progress(p,0,.4)}}><Label>COBERTURA DE EVENTOS</Label><Head style={{fontSize:128,marginTop:30}}>A história<br/><Em>continua.</Em></Head></div>}
 </Surface>;
}
export function YllustreFilmV3(){
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:C.black,color:C.white,fontFamily:'YArial,Arial,sans-serif',overflow:'hidden'}}>
  <Html5Audio src={staticFile('audio/yllustre-original.wav')}/>
  {scenesV3.map((scene,i)=>{
   const end=scene.from+scene.duration;
   if(frame<scene.from-M.overlap||frame>=end+M.overlap)return null;
   const p=i===0?1:progress(frame,scene.from-M.overlap,scene.from+M.overlap);
   const yellowReveal=false;
   const r=yellowReveal?{left:mix(990,0,p),top:mix(1215,0,p),right:mix(87,0,p),bottom:mix(90,0,p)}:null;
   
   return <AbsoluteFill key={scene.from} style={{background:scene.theme==='dark'?C.black:scene.theme==='yellow'?C.yellow:C.white,opacity:frame>=scene.from?1:0,clipPath:r?`inset(${r.top}px ${r.right}px ${r.bottom}px ${r.left}px)` : undefined}}>{i===5&&frame>=828&&<Picture name={local(frame,5)>=100&&local(frame,5)<160?'encontro':'oracao'} s={poses.film(local(frame,5))}/>}</AbsoluteFill>;
  })}

  {scenesV3.map((scene,i)=>{
   const end=scene.from+scene.duration;
   if(frame<scene.from-M.overlap||frame>=end+M.overlap)return null;
   const enter=i===0?1:i>=6?(frame>=scene.from?1:0):i===5?progress(frame,scene.from+18,scene.from+32):progress(frame,scene.from-2,scene.from+14);
   const exit=i===7?1:1-progress(frame,end-M.overlap,end-2);
   const Component=scene.component;
   return <AbsoluteFill key={scene.from} style={{visibility:enter<=0||exit<=0?'hidden':'visible',clipPath:`inset(0 0 ${(1-enter)*100}% 0)`,transform:`translateY(${-72*Math.pow(1-exit,2.6)}px)`}}><Component f={Math.max(0,local(frame,i))}/></AbsoluteFill>;
  })}
  {bridges.map(b=><Bridge key={b.cut} frame={frame} b={b}/>)}
 </AbsoluteFill>;
}
