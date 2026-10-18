import React, {CSSProperties} from 'react';
import {AbsoluteFill, Easing, Html5Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import './style.css';

const C={yellow:'#ffe100',black:'#090909',white:'#fffdf4',gray:'#aaa99e'};
const M={perspective:1900,overlap:18,far:10,mid:24,near:42};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const ease=Easing.bezier(.4,0,.2,1);
const progress=(f:number,a:number,b:number)=>ease(clamp((f-a)/(b-a)));
const reveal=(f:number,d=0):CSSProperties=>({opacity:progress(f,d,d+18),transform:`translateY(${mix(38,0,progress(f,d,d+24))}px)`});
const media=(name:string)=>staticFile(`media/${name}.jpg`);
const camera=(f:number)=>Math.sin(clamp(f/210)*Math.PI/2)*2-1;
type Pose={x:number,y:number,w:number,h:number,rx:number,ry:number,rz:number,r0:number,r1:number,r2:number,r3:number,panX:number,panY:number,zoom:number,dark:number,focusY:number};
const pose=(f:number,x:number,y:number,w:number,h:number,r:number,depth=1,rx=0,ry=0,rz=0):Pose=>{
  const c=camera(f);
  return {x:x+c*M.near*depth,y:y-c*M.mid*depth,w,h,rx:rx-c*.55*depth,ry:ry+c*1.3*depth,rz:rz+c*.5*depth,r0:r,r1:r,r2:r,r3:r,panX:-c*16,panY:c*20,zoom:1.1+clamp(f/210)*.025,dark:0,focusY:50};
};
const poses={
 opening:(f:number)=>({...pose(f,48,188,984,1500,54,.45,.6,-.7),r0:480,r1:480,dark:1}),
 presence:(f:number)=>({...pose(f,96,680,888,1010,36,.6,1.2,-1),r1:240,focusY:40}),
 details:(f:number)=>pose(f,96,685,888,950,40,.5,.6,1),
 story:(f:number)=>({...pose(f,254,650,572,1020,60,.75,1,-1),dark:1}),
 video:(f:number)=>({...pose(f,96,760,575,880,32,.75,.5,-2,-4),dark:1}),
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
 return <div style={{display:'flex',alignItems:'center',gap:large?26:18,color:light?C.black:C.white}}><Img src={media('logo')} style={{width:large?112:62,height:large?112:62,borderRadius:'50%'}}/><div style={{fontSize:large?44:28,fontWeight:700,letterSpacing:large?9:6}}>YLLUSTRE</div></div>;
}
const Label=({children,light=false}:{children:React.ReactNode,light?:boolean})=><div style={{display:'flex',gap:18,alignItems:'center',fontSize:26,fontWeight:700,letterSpacing:4,color:light?C.black:C.white}}><span style={{width:44,height:4,background:C.yellow}}/>{children}</div>;
const Head=({children,style={}}:{children:React.ReactNode,style?:CSSProperties})=><div style={{fontSize:110,fontWeight:700,letterSpacing:-6,lineHeight:1.02,...style}}>{children}</div>;
const Em=({children,light=false}:{children:React.ReactNode,light?:boolean})=><span style={{fontFamily:'YGeorgia,Georgia,serif',fontStyle:'italic',fontWeight:400,color:light?C.black:C.yellow}}>{children}</span>;

function Backdrop({f,light=false}:{f:number,light?:boolean}){
 const c=camera(f);
 return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
  <div style={{position:'absolute',left:350+c*M.far,top:470-c*M.far,width:950,height:1200,borderRadius:'50%',background:`radial-gradient(ellipse,${light?'#e9d74528':'#93823020'} 0%,transparent 68%)`}}/>
  <div style={{position:'absolute',left:78+c*M.far,top:620-c*M.far,width:930,height:1100,border:`1px solid ${light?'#0909090e':'#ffe1000b'}`,borderRadius:'440px 440px 70px 70px',transform:'rotate(-4deg)'}}/>
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
function Footer({left,right,light=false}:{left:string,right:string,light?:boolean}){
 return <div style={{position:'absolute',left:96,right:96,top:1750,display:'flex',justifyContent:'space-between',fontSize:23,fontWeight:600,letterSpacing:3,color:light?'#55554b':C.gray}}><span>{left}</span><span>{right}</span></div>;
}
function StoryUI({f}:{f:number}){
 const idx=f<74?0:f<130?1:2;
 const bounds=[0,74,130,220];
 return <>
  <div style={{position:'absolute',top:28,left:24,right:24,display:'flex',gap:7}}>{[0,1,2].map(i=><div key={i} style={{height:5,flex:1,background:'#ffffff4d',borderRadius:4,overflow:'hidden'}}><div style={{width:`${i<idx?100:i>idx?0:clamp((f-bounds[i])/(bounds[i+1]-bounds[i]))*100}%`,height:'100%',background:C.yellow}}/></div>)}</div>
  <div style={{position:'absolute',top:58,left:28,display:'flex',alignItems:'center',gap:12}}><Img src={media('logo')} style={{height:42,width:42,borderRadius:21}}/><span style={{fontSize:22,fontWeight:700}}>yllustre_agencia</span></div>
  <div style={{position:'absolute',left:36,right:36,bottom:70,fontSize:47,lineHeight:1.1,letterSpacing:-1,fontWeight:700}}>{['No encontro.','Nos bastidores.','No grande momento.'][idx]}</div>
 </>;
}
const VideoUI=()=> <div style={{position:'absolute',left:24,bottom:24,fontSize:22,fontWeight:700,letterSpacing:2,color:C.white}}>A CELEBRAÇÃO</div>;

function Opening({f}:{f:number}){
 const s=poses.opening(f),change=progress(f,72,94);
 return <AbsoluteFill><Backdrop f={f}/><Plate s={s}/><Panel id="opening" name="celebracao" s={s}/>
  <div style={{position:'absolute',left:96,top:76}}><Brand/></div>
  <div style={{position:'absolute',left:100,top:1140,right:80}}><div style={{marginBottom:30,...reveal(f,5)}}><Label>COBERTURA DE EVENTOS</Label></div><div style={{height:310,position:'relative'}}>
    <Head style={{position:'absolute',fontSize:132,opacity:1-change,transform:`translateY(${-change*45}px)`}}>Seu evento.<br/>Uma vez.</Head>
    <Head style={{position:'absolute',fontSize:128,opacity:change,transform:`translateY(${(1-change)*45}px)`}}>A história<br/><Em>continua.</Em></Head>
  </div></div>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0,transform:`translate(${camera(f)*14}px,${camera(f)*-9}px)`}}><path d="M 50 1660 L 50 800 C 50 80 1030 80 1030 800 L 1030 1660" fill="none" stroke={C.yellow} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,12,95)} opacity=".55"/></svg>
  <Footer left="CONTEÚDO VIVO." right="MEMÓRIAS REAIS."/>
 </AbsoluteFill>;
}
function Presence({f}:{f:number}){
 const s=poses.presence(f);
 return <AbsoluteFill><Backdrop f={f}/><Plate s={s} offset={1.5}/><Panel id="presence" name="equipe" s={s}/>
  <div style={{position:'absolute',left:96,top:76}}><Brand/></div><div style={{position:'absolute',left:96,top:265,...reveal(f,0)}}><Label>O NOSSO OLHAR</Label></div>
  <Head style={{position:'absolute',left:96,top:340,...reveal(f,5)}}>Você vive.<br/><Em>A gente conta.</Em></Head>
  <div style={{position:'absolute',left:54+camera(f)*16,top:1480-camera(f)*12,padding:'24px 34px',background:C.yellow,color:C.black,transform:`perspective(1600px) rotateY(-3deg) rotate(-3deg) translateY(${mix(35,0,progress(f,24,48))}px)`,opacity:progress(f,24,42),boxShadow:'0 5px 9px #0003,0 28px 65px #0007'}}><div style={{fontSize:23,letterSpacing:4,fontWeight:700}}>STORY · VIDEO · FILM</div><div style={{fontSize:32,marginTop:12}}>Presença do começo ao fim.</div></div>
  <Footer left="YLLUSTRE" right="01 / PRESENÇA"/>
 </AbsoluteFill>;
}
function Details({f}:{f:number}){
 const idx=f<50?0:f<96?1:2,names=['preparativos','oracao','encontro'],s=poses.details(f);
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/><Plate s={s} light offset={1.4}/><Panel id="details" name={names[idx]} s={s}>
   <div style={{position:'absolute',left:26,top:26,display:'flex',gap:10}}>{names.map((n,i)=><div key={n} style={{width:50,height:5,background:i===idx?C.yellow:'#ffffff65'}}/>)}</div>
   <div style={{position:'absolute',right:28,bottom:28,padding:'15px 20px',fontSize:24,background:C.yellow,color:C.black,borderRadius:30,fontWeight:600}}>{['Os preparativos','A expectativa','O encontro'][idx]}</div>
  </Panel>
  <div style={{position:'absolute',left:96,top:76}}><Brand light/></div><div style={{position:'absolute',left:96,top:260,...reveal(f,0)}}><Label light>ANTES. DURANTE. DEPOIS.</Label></div>
  <Head style={{position:'absolute',left:96,top:340,fontSize:120,...reveal(f,5)}}>Cada detalhe<br/><Em light>conta.</Em></Head>
  <div style={{position:'absolute',left:96,top:1705,fontSize:35,color:'#55554b',...reveal(f,22)}}>Bastidores. Olhares. Emoção.</div>
 </AbsoluteFill>;
}
function Stories({f}:{f:number}){
 const idx=f<74?0:f<130?1:2,names=['encontro','bastidores','celebracao'],s=poses.story(f);
 const a={...pose(f,-90,805,360,660,35,.28,1,-4,-9),dark:.7},b={...pose(f,810,750,360,660,35,-.3,1,4,9),dark:.7};
 return <AbsoluteFill><Backdrop f={f}/>
  <div style={{opacity:.42,filter:'blur(1px)'}}><Surface s={a}><Picture name="oracao" s={a}/></Surface><Surface s={b}><Picture name="preparativos" s={b}/></Surface></div>
  <Plate s={s}/><Panel id="story" name={names[idx]} s={s}><StoryUI f={f}/></Panel>
  <div style={{position:'absolute',left:96,top:76}}><Brand/></div><div style={{position:'absolute',left:96,top:260,...reveal(f,0)}}><Label>STORYMAKER</Label></div>
  <Head style={{position:'absolute',left:96,top:340,fontSize:108,...reveal(f,5)}}>Enquanto<br/><Em>acontece.</Em></Head>
  <div style={{position:'absolute',left:0,right:0,top:1745,textAlign:'center',fontSize:33,...reveal(f,24)}}><span style={{display:'inline-block',width:11,height:11,marginRight:18,borderRadius:8,background:C.yellow}}/>Stories em tempo real.</div>
 </AbsoluteFill>;
}
function VideoMaker({f}:{f:number}){
 const s=poses.video(f),b={...pose(f,620,910,365,650,32,-.4,1,3,5),dark:1};
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/>
  <Plate s={b} light/><Surface s={b}><Picture name="bastidores" s={b}/></Surface>
  <Plate s={s} light/><Panel id="video" name="celebracao" s={s}><VideoUI/></Panel>
  <div style={{position:'absolute',left:96,top:76}}><Brand light/></div><div style={{position:'absolute',left:96,top:265,...reveal(f,0)}}><Label light>VIDEOMAKER</Label></div>
  <Head style={{position:'absolute',left:96,top:350,fontSize:112,...reveal(f,5)}}>A energia vira<br/><Em light>conteúdo.</Em></Head>
  <div style={{position:'absolute',left:96,top:625,fontSize:33,color:'#56564b',...reveal(f,14)}}>Do evento para as redes.</div>
  <div style={{position:'absolute',left:96,right:96,top:1720,height:4,background:'#09090920'}}><div style={{height:4,width:`${progress(f,40,150)*100}%`,background:C.black}}/></div>
  <Footer left="VÍDEOS PARA REDES SOCIAIS" right="↗" light/>
 </AbsoluteFill>;
}
function FilmMaker({f}:{f:number}){
 const s=poses.film(f),t=Math.max(0,f-42);
 return <AbsoluteFill><Panel id="film" name="oracao" s={s}/><AbsoluteFill style={{background:'linear-gradient(180deg,#090909a0,transparent 30%,transparent 48%,#090909e8 90%)'}}/>
  <div style={{position:'absolute',left:96,top:76}}><Brand/></div><div style={{position:'absolute',left:96,top:1210,...reveal(t,0)}}><Label>FILMMAKER</Label></div>
  <Head style={{position:'absolute',left:96,top:1290,fontSize:128,...reveal(t,5)}}>A emoção<br/><Em>fica.</Em></Head>
  <div style={{position:'absolute',left:96,top:1615,fontSize:35,lineHeight:1.35,...reveal(t,18)}}>Filmes com narrativa,<br/>atmosfera e sentimento.</div>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M 990 1830 L 990 1215 L 940 1215" stroke={C.yellow} fill="none" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,15,100)}/></svg>
 </AbsoluteFill>;
}
function Categories({f}:{f:number}){
 const cats=[{text:'Casamentos.',sub:'Histórias para guardar.',delay:5},{text:'Formaturas.',sub:'Conquistas para celebrar.',delay:35},{text:'Eventos de marcas.',sub:'Presença para conectar.',delay:65}];
 return <AbsoluteFill style={{color:C.black}}><Backdrop f={f} light/><div style={{position:'absolute',left:96,top:76}}><Brand light/></div>
  <div style={{position:'absolute',left:96,top:280,fontSize:27,letterSpacing:4,fontWeight:700,...reveal(f,0)}}>UM OLHAR PARA CADA HISTÓRIA.</div>
  <div style={{position:'absolute',left:96,right:96,top:475}}>{cats.map((cat,i)=><div key={cat.text} style={{padding:'42px 0',position:'relative',...reveal(f,cat.delay)}}><div style={{fontSize:i===2?78:101,letterSpacing:-5,fontWeight:700,lineHeight:1.08}}>{cat.text}</div><div style={{marginTop:23,fontSize:31,color:'#39370a'}}>{cat.sub}</div><div style={{position:'absolute',bottom:0,left:0,height:2,background:'#09090935',width:`${progress(f,cat.delay+6,cat.delay+32)*100}%`}}/></div>)}</div>
  <div style={{position:'absolute',left:96,top:1455,fontSize:54,lineHeight:1.15,letterSpacing:-2,...reveal(f,97)}}>Você traz o momento.<br/><span style={{fontFamily:'YGeorgia',fontStyle:'italic'}}>A gente conta a história.</span></div>
  <Footer left="STORYMAKER" right="VIDEOMAKER · FILMMAKER" light/>
 </AbsoluteFill>;
}
function Closing({f}:{f:number}){
 const g=useCurrentFrame();
 return <AbsoluteFill><Backdrop f={f}/>
  <div style={{position:'absolute',left:96,top:125,...reveal(f,0)}}><Brand large/></div><div style={{position:'absolute',left:96,top:440,...reveal(f,0)}}><Label>SEU PRÓXIMO EVENTO</Label></div>
  <Head style={{position:'absolute',left:96,top:530,fontSize:119,...reveal(f,3)}}>Qual história<br/>vamos<br/><Em>contar?</Em></Head>
  <div style={{position:'absolute',left:96,top:1040,right:96,...reveal(f,12)}}>
   <div style={{height:128,borderRadius:70,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 44px',color:C.black,background:C.yellow,fontSize:43,fontWeight:700,letterSpacing:-1,boxShadow:'0 5px 10px #0004,0 22px 55px #ffe1000c',visibility:g<1188?'hidden':'visible'}}>Peça seu orçamento <span style={{fontSize:58,fontWeight:400}}>↗</span></div>
   <div style={{marginTop:48,fontSize:25,letterSpacing:4,color:C.gray,fontWeight:700}}>CONVERSE NO WHATSAPP</div><div style={{marginTop:18,fontSize:56,letterSpacing:-2}}>(63) 99241-1073</div><div style={{marginTop:55,fontSize:31,color:C.gray}}>@yllustre_agencia</div>
  </div>
  <div style={{position:'absolute',left:96,right:96,top:1655,height:1,background:'#ffffff25'}}/><div style={{position:'absolute',left:96,top:1700,fontSize:31,lineHeight:1.4,color:C.gray}}>Conteúdo vivo.<br/>Memórias reais.</div>
 </AbsoluteFill>;
}

export const scenesV2=[
 {from:0,duration:150,component:Opening,theme:'dark'},
 {from:150,duration:150,component:Presence,theme:'dark'},
 {from:300,duration:150,component:Details,theme:'light'},
 {from:450,duration:180,component:Stories,theme:'dark'},
 {from:630,duration:180,component:VideoMaker,theme:'light'},
 {from:810,duration:180,component:FilmMaker,theme:'dark'},
 {from:990,duration:180,component:Categories,theme:'yellow'},
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
  {b.source==='opening'&&<div style={{position:'absolute',left:100-s.x,top:1140-s.y,opacity:1-progress(p,0,.4)}}><Label>COBERTURA DE EVENTOS</Label><Head style={{fontSize:128,marginTop:30}}>A história<br/><Em>continua.</Em></Head></div>}
 </Surface>;
}
function YellowClosure({frame}:{frame:number}){
 if(frame<1152||frame>=1188)return null;
 const p=progress(frame,1152,1188);
 return <div style={{position:'absolute',left:mix(0,96,p),top:mix(0,1040,p),width:mix(1080,888,p),height:mix(1920,128,p),borderRadius:mix(0,70,p),background:C.yellow,boxShadow:'0 18px 60px #0003',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 44px',color:C.black,fontSize:43,fontWeight:700,letterSpacing:-1}}><span style={{opacity:progress(p,.7,1)}}>Peça seu orçamento</span><span style={{fontSize:58,fontWeight:400,opacity:progress(p,.7,1)}}>↗</span></div>;
}

export function YllustreFilmV2(){
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:C.black,color:C.white,fontFamily:'YArial,Arial,sans-serif',overflow:'hidden'}}>
  <Html5Audio src={staticFile('audio/yllustre-original.wav')}/>
  {scenesV2.map((scene,i)=>{
   const end=scene.from+scene.duration;
   if(frame<scene.from-M.overlap||frame>=end+M.overlap)return null;
   const p=i===0?1:progress(frame,scene.from-M.overlap,scene.from+M.overlap);
   const yellowReveal=i===6;
   const r=yellowReveal?{left:mix(990,0,p),top:mix(1215,0,p),right:mix(87,0,p),bottom:mix(90,0,p)}:null;
   if(i===6&&frame>=1152)return null;
   return <AbsoluteFill key={scene.from} style={{background:scene.theme==='dark'?C.black:scene.theme==='yellow'?C.yellow:C.white,opacity:i===7&&frame>=1152?1:yellowReveal?1:p,clipPath:r?`inset(${r.top}px ${r.right}px ${r.bottom}px ${r.left}px)` : undefined}}>{i===5&&frame>=828&&<Picture name="oracao" s={poses.film(local(frame,5))}/>}</AbsoluteFill>;
  })}
  <YellowClosure frame={frame}/>
  {scenesV2.map((scene,i)=>{
   const end=scene.from+scene.duration;
   if(frame<scene.from-M.overlap||frame>=end+M.overlap)return null;
   const enter=i===0?1:i===5?progress(frame,scene.from+18,scene.from+32):progress(frame,scene.from-2,scene.from+14);
   const exit=i===7?1:1-progress(frame,end-M.overlap,end-2);
   const Component=scene.component;
   return <AbsoluteFill key={scene.from} style={{opacity:enter*exit}}><Component f={Math.max(0,local(frame,i))}/></AbsoluteFill>;
  })}
  {bridges.map(b=><Bridge key={b.cut} frame={frame} b={b}/>)}
 </AbsoluteFill>;
}
