import React, {CSSProperties} from 'react';
import {AbsoluteFill, Img, Html5Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import './style.css';

export const C = {yellow:'#ffe100', black:'#090909', white:'#fffdf4', gray:'#a9a99d'};
const clamp = (x:number) => Math.max(0, Math.min(1, x));
const ease = (x:number) => 1-Math.pow(1-clamp(x), 4);
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const ramp=(f:number,a:number,b:number)=>ease((f-a)/(b-a));
const media=(name:string)=>staticFile('media/'+name+'.jpg');
const fade=(f:number,d:number)=>clamp(f/10)*clamp((d-f)/10);
const anim=(f:number,delay=0):CSSProperties=>({opacity:ramp(f,delay,delay+18), transform:`translateY(${mix(56,0,ramp(f,delay,delay+24))}px)`});

function Brand({light=false, large=false}:{light?:boolean,large?:boolean}) {
  return <div style={{display:'flex',alignItems:'center',gap:large?26:18,color:light?C.black:C.white}}>
    <Img src={media('logo')} style={{width:large?112:62,height:large?112:62,borderRadius:'50%'}}/>
    <div style={{fontWeight:700,letterSpacing:large?9:6,fontSize:large?44:28}}>YLLUSTRE</div>
  </div>;
}
function Label({children, light=false}:{children:React.ReactNode,light?:boolean}) {
  return <div style={{fontSize:26,fontWeight:700,letterSpacing:4,display:'flex',alignItems:'center',gap:18,color:light?C.black:C.white}}><span style={{width:44,height:4,background:C.yellow}}/>{children}</div>;
}
function Head({children,style={}}:{children:React.ReactNode,style?:CSSProperties}) {
  return <div style={{fontWeight:700,fontSize:110,letterSpacing:-6,lineHeight:1.02,...style}}>{children}</div>;
}
function Em({children, light=false}:{children:React.ReactNode,light?:boolean}) {
  return <span style={{fontFamily:'YGeorgia, Georgia, serif',fontWeight:400,fontStyle:'italic',color:light?C.black:C.yellow}}>{children}</span>;
}
function Photo({name, f=0, style={}, pos='50% 50%', zoom=1, dark=false}:{name:string,f?:number,style?:CSSProperties,pos?:string,zoom?:number,dark?:boolean}) {
  return <div style={{position:'absolute',overflow:'hidden',background:'#24241c',...style}}>
    <Img src={media(name)} style={{height:'100%',width:'100%',objectFit:'cover',objectPosition:pos,transform:`scale(${zoom+Math.min(0.07,Math.max(0,f)*.0002)}) translateY(${Math.sin(f/140)*-7}px)`}}/>
    {dark&&<AbsoluteFill style={{background:'linear-gradient(180deg, rgba(0,0,0,.08) 25%,rgba(0,0,0,.82) 100%)'}}/>}
  </div>;
}
function FrameLabel({left,right,style={}}:{left:string,right:string,style?:CSSProperties}) {
  return <div style={{position:'absolute',display:'flex',justifyContent:'space-between',fontSize:23,letterSpacing:3,fontWeight:600,...style}}><span>{left}</span><span>{right}</span></div>;
}

function Opening({f}:{f:number}) {
  const change=ramp(f,72,94);
  return <AbsoluteFill>
    <Photo name="celebracao" f={f} dark style={{left:48,top:188,width:984,height:1500,borderRadius:'480px 480px 54px 54px',transform:`scale(${mix(.97,1,ramp(f,0,36))})`}} pos="50% 50%"/>
    <div style={{position:'absolute',left:96,top:76}}><Brand/></div>
    <div style={{position:'absolute',left:100,top:1140,right:80}}>
      <div style={{...anim(f,5),marginBottom:30}}><Label>COBERTURA DE EVENTOS</Label></div>
      <div style={{position:'relative',height:310}}>
        <Head style={{position:'absolute',opacity:1-change,transform:`translateY(${-change*55}px)`,fontSize:132}}>Seu evento.<br/>Uma vez.</Head>
        <Head style={{position:'absolute',opacity:change,transform:`translateY(${(1-change)*55}px)`,fontSize:128}}>A história<br/><Em>continua.</Em></Head>
      </div>
    </div>
    <FrameLabel left="CONTEÚDO VIVO." right="MEMÓRIAS REAIS." style={{left:96,right:96,top:1740,color:C.gray}}/>
    <svg width="1080" height="1920" style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}><path d="M 50 1660 L 50 800 C 50 80 1030 80 1030 800 L 1030 1660" fill="none" stroke={C.yellow} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,12,95)} opacity=".65"/></svg>
  </AbsoluteFill>;
}

function Presence({f}:{f:number}) {
  return <AbsoluteFill>
    <div style={{position:'absolute',left:96,top:76}}><Brand/></div>
    <div style={{position:'absolute',left:96,top:265,...anim(f,4)}}><Label>O NOSSO OLHAR</Label></div>
    <Head style={{position:'absolute',left:96,top:340,...anim(f,10)}}>Você vive.<br/><Em>A gente conta.</Em></Head>
    <Photo name="equipe" f={f} style={{left:96,top:680,width:888,height:1010,borderRadius:'36px 260px 36px 36px',transform:`translateY(${mix(85,0,ramp(f,5,36))}px)`}} pos="50% 40%"/>
    <div style={{position:'absolute',left:54,top:1480,padding:'24px 34px',background:C.yellow,color:C.black,transform:`translateX(${mix(-120,0,ramp(f,28,50))}px) rotate(-3deg)`,opacity:ramp(f,28,43),boxShadow:'0 20px 70px #0005'}}>
      <div style={{fontSize:23,letterSpacing:4,fontWeight:700}}>STORY · VIDEO · FILM</div>
      <div style={{fontSize:32,marginTop:12}}>Presença do começo ao fim.</div>
    </div>
    <FrameLabel left="YLLUSTRE" right="01 / PRESENÇA" style={{left:96,right:96,top:1750,color:C.gray}}/>
  </AbsoluteFill>;
}

function Details({f}:{f:number}) {
  const idx=Math.min(2,Math.floor(Math.max(0,f-8)/45));
  const names=['preparativos','oracao','encontro'];
  const local=Math.max(0,f-8)%45;
  return <AbsoluteFill style={{background:C.white,color:C.black}}>
    <div style={{position:'absolute',left:96,top:76}}><Brand light/></div>
    <div style={{position:'absolute',left:96,top:260,...anim(f,0)}}><Label light>ANTES. DURANTE. DEPOIS.</Label></div>
    <Head style={{position:'absolute',left:96,top:340,...anim(f,6),fontSize:120}}>Cada detalhe<br/><Em light>conta.</Em></Head>
    <div style={{position:'absolute',left:96,top:685,width:888,height:950}}>
      <Photo name={names[idx]} f={f} style={{inset:0,borderRadius:40}} pos={idx===0?'50% 36%':'50% 50%'}/>
      <div style={{position:'absolute',left:26,top:26,display:'flex',gap:10}}>{names.map((n,i)=><div key={n} style={{width:50,height:5,background:i===idx?C.yellow:'#ffffff65'}}/>)}</div>
      <div style={{position:'absolute',right:28,bottom:28,padding:'15px 20px',fontSize:24,background:C.yellow,color:C.black,borderRadius:30,fontWeight:600}}>{['Os preparativos','A expectativa','O encontro'][idx]}</div>
    </div>
    <div style={{position:'absolute',left:96,top:1705,fontSize:35,color:'#55554b',...anim(f,25)}}>Bastidores. Olhares. Emoção.</div>
  </AbsoluteFill>;
}

function Stories({f}:{f:number}) {
  const idx=Math.min(2,Math.floor(Math.max(0,f-26)/48));
  const names=['bastidores','preparativos','celebracao'];
  return <AbsoluteFill>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,#39341a 0%,#090909 65%)'}}/>
    <div style={{position:'absolute',left:96,top:76}}><Brand/></div>
    <div style={{position:'absolute',left:96,top:260,...anim(f,0)}}><Label>STORYMAKER</Label></div>
    <Head style={{position:'absolute',left:96,top:340,fontSize:108,...anim(f,7)}}>Enquanto<br/><Em>acontece.</Em></Head>
    <Photo name="oracao" f={f*.4} style={{left:-90,top:805,width:360,height:660,borderRadius:35,opacity:.45,transform:`rotate(-9deg) translateY(${mix(100,0,ramp(f,12,45))}px)`}}/>
    <Photo name="encontro" f={f*.4} style={{right:-90,top:750,width:360,height:660,borderRadius:35,opacity:.45,transform:`rotate(9deg) translateY(${mix(100,0,ramp(f,18,50))}px)`}}/>
    <div style={{position:'absolute',left:254,top:650,width:572,height:1020,border:'3px solid #ffffff38',borderRadius:60,overflow:'hidden',boxShadow:'0 45px 90px #0009',visibility:f>=192?'hidden':'visible',transform:`translateY(${mix(110,0,ramp(f,10,40))}px) rotate(${mix(-3,0,ramp(f,10,48))}deg)`}}>
      <Photo name={names[idx]} f={f} dark style={{inset:0}}/>
      <div style={{position:'absolute',top:28,left:24,right:24,display:'flex',gap:7}}>{names.map((name,i)=><div key={name} style={{height:5,flex:1,background:'#ffffff4d',borderRadius:4,overflow:'hidden'}}><div style={{width:`${i<idx?100:i>idx?0:clamp((f-26-idx*48)/48)*100}%`,height:'100%',background:C.yellow}}/></div>)}</div>
      <div style={{position:'absolute',top:58,left:28,display:'flex',alignItems:'center',gap:12}}><Img src={media('logo')} style={{height:42,width:42,borderRadius:21}}/><span style={{fontSize:22,fontWeight:700}}>yllustre_agencia</span></div>
      <div style={{position:'absolute',bottom:70,left:36,right:36,fontSize:47,lineHeight:1.1,letterSpacing:-1,fontWeight:700}}>{['Nos bastidores.','No frio na barriga.','No grande momento.'][idx]}</div>
    </div>
    <div style={{position:'absolute',left:0,right:0,top:1745,textAlign:'center',fontSize:33,color:C.white,...anim(f,40)}}><span style={{display:'inline-block',width:11,height:11,marginRight:18,borderRadius:8,background:C.yellow}}/>Stories em tempo real.</div>
  </AbsoluteFill>;
}

function VideoMaker({f}:{f:number}) {
  const cards=[{name:'celebracao',x:96,y:760,w:575,h:880,r:-4},{name:'bastidores',x:620,y:910,w:365,h:650,r:5}];
  return <AbsoluteFill style={{background:C.white,color:C.black}}>
    <div style={{position:'absolute',left:96,top:76}}><Brand light/></div>
    <div style={{position:'absolute',left:96,top:265,...anim(f,0)}}><Label light>VIDEOMAKER</Label></div>
    <Head style={{position:'absolute',left:96,top:350,fontSize:112,...anim(f,7)}}>A energia vira<br/><Em light>conteúdo.</Em></Head>
    <div style={{position:'absolute',left:96,top:625,fontSize:33,color:'#56564b',...anim(f,19)}}>Do evento para as redes.</div>
    {cards.map((card,i)=><div key={card.name} style={{position:'absolute',left:card.x,top:card.y,width:card.w,height:card.h,visibility:i===0&&f<48?'hidden':'visible',transform:`translateY(${mix(180,0,ramp(f,10+i*9,44+i*9))}px) rotate(${card.r+Math.sin(f/110)*1}deg)`,boxShadow:'0 35px 75px #15151524',borderRadius:32,overflow:'hidden'}}><Photo name={card.name} f={f} dark style={{inset:0}}/><div style={{position:'absolute',bottom:24,left:24,fontSize:22,letterSpacing:2,color:C.white,fontWeight:700}}>{i===0?'A CELEBRAÇÃO':'O BASTIDOR'}</div></div>)}
    <div style={{position:'absolute',left:96,right:96,top:1720,height:4,background:'#09090920'}}><div style={{height:4,width:`${ramp(f,40,150)*100}%`,background:C.black}}/></div>
    <FrameLabel left="VÍDEOS PARA REDES SOCIAIS" right="↗" style={{left:96,right:96,top:1760,color:'#55554b'}}/>
  </AbsoluteFill>;
}

function FilmMaker({f}:{f:number}) {
  return <AbsoluteFill>
    <Photo name="oracao" f={f} zoom={1.03} dark style={{inset:0}} pos="50% 50%"/>
    <AbsoluteFill style={{background:'linear-gradient(180deg,#090909b0 0%,transparent 30%,transparent 48%,#090909e8 90%)'}}/>
    <div style={{position:'absolute',left:96,top:76}}><Brand/></div>
    <div style={{position:'absolute',left:96,top:1210,...anim(f,2)}}><Label>FILMMAKER</Label></div>
    <Head style={{position:'absolute',left:96,top:1290,fontSize:128,...anim(f,10)}}>A emoção<br/><Em>fica.</Em></Head>
    <div style={{position:'absolute',left:96,top:1615,fontSize:35,lineHeight:1.35,color:C.white,...anim(f,30)}}>Filmes com narrativa,<br/>atmosfera e sentimento.</div>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M 990 1830 L 990 1215 L 940 1215" stroke={C.yellow} fill="none" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,15,110)}/></svg>
  </AbsoluteFill>;
}

function Categories({f}:{f:number}) {
  const cats=[{text:'Casamentos.',sub:'Histórias para guardar.',delay:5},{text:'Formaturas.',sub:'Conquistas para celebrar.',delay:35},{text:'Eventos de marcas.',sub:'Presença para conectar.',delay:65}];
  return <AbsoluteFill style={{background:C.yellow,color:C.black}}>
    <div style={{position:'absolute',left:96,top:76}}><Brand light/></div>
    <div style={{position:'absolute',left:96,top:280,fontSize:27,letterSpacing:4,fontWeight:700,...anim(f,0)}}>UM OLHAR PARA CADA HISTÓRIA.</div>
    <div style={{position:'absolute',left:96,right:96,top:475}}>{cats.map((cat,i)=><div key={cat.text} style={{padding:'42px 0',borderBottom:'2px solid #09090935',...anim(f,cat.delay)}}><div style={{fontSize:i===2?78:101,letterSpacing:-5,fontWeight:700,lineHeight:1.08}}>{cat.text}</div><div style={{marginTop:23,fontSize:31,color:'#39370a'}}>{cat.sub}</div></div>)}</div>
    <div style={{position:'absolute',left:96,top:1455,fontSize:54,lineHeight:1.15,letterSpacing:-2,...anim(f,97)}}>Você traz o momento.<br/><span style={{fontFamily:'YGeorgia',fontStyle:'italic'}}>A gente conta a história.</span></div>
    <FrameLabel left="STORYMAKER" right="VIDEOMAKER · FILMMAKER" style={{left:96,right:96,top:1760,color:'#46420a'}}/>
  </AbsoluteFill>;
}

function Closing({f}:{f:number}) {
  return <AbsoluteFill>
    <div style={{position:'absolute',left:96,top:125,...anim(f,3)}}><Brand large/></div>
    <div style={{position:'absolute',left:96,top:440,...anim(f,8)}}><Label>SEU PRÓXIMO EVENTO</Label></div>
    <Head style={{position:'absolute',left:96,top:530,fontSize:119,...anim(f,14)}}>Qual história<br/>vamos<br/><Em>contar?</Em></Head>
    <div style={{position:'absolute',left:96,top:1040,right:96,...anim(f,27)}}>
      <div style={{height:128,borderRadius:70,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 44px',color:C.black,background:C.yellow,fontSize:43,fontWeight:700,letterSpacing:-1}}>Peça seu orçamento <span style={{fontSize:58,fontWeight:400}}>↗</span></div>
      <div style={{marginTop:48,fontSize:25,letterSpacing:4,color:C.gray,fontWeight:700}}>CONVERSE NO WHATSAPP</div>
      <div style={{marginTop:18,fontSize:56,letterSpacing:-2,fontWeight:500}}>(63) 99241-1073</div>
      <div style={{marginTop:55,fontSize:31,color:C.gray}}>@yllustre_agencia</div>
    </div>
    <div style={{position:'absolute',left:96,right:96,top:1655,height:1,background:'#ffffff25'}}/>
    <div style={{position:'absolute',left:96,top:1700,fontSize:31,lineHeight:1.4,color:C.gray}}>Conteúdo vivo.<br/>Memórias reais.</div>
  </AbsoluteFill>;
}

export const scenes=[
  {from:0,duration:150,component:Opening,name:'A história continua',theme:'dark'},
  {from:150,duration:150,component:Presence,name:'Você vive, a gente conta',theme:'dark'},
  {from:300,duration:150,component:Details,name:'Cada detalhe conta',theme:'light'},
  {from:450,duration:180,component:Stories,name:'Storymaker em tempo real',theme:'dark'},
  {from:630,duration:180,component:VideoMaker,name:'Videomaker',theme:'light'},
  {from:810,duration:180,component:FilmMaker,name:'Filmmaker',theme:'dark'},
  {from:990,duration:180,component:Categories,name:'Eventos',theme:'yellow'},
  {from:1170,duration:180,component:Closing,name:'Orçamento',theme:'dark'}
];

function StoryVideoBridge({frame}:{frame:number}) {
  if(frame<618||frame>=654)return null;
  const p=Easing.bezier(.65,0,.25,1)(clamp((frame-618)/36));
  const f=mix(frame-450+24,frame-630+24,p);
  return <div style={{position:'absolute',left:mix(254,96,p),top:mix(650,760,p),width:mix(572,575,p),height:mix(1020,880,p),borderRadius:mix(60,32,p),overflow:'hidden',transform:`rotate(${mix(0,-4+Math.sin((frame-630+24)/110),p)}deg)`,boxShadow:`0 35px 75px rgba(0,0,0,${mix(.55,.14,p)})`}}>
    <Photo name="celebracao" f={f} dark style={{inset:0}}/>
    <div style={{opacity:1-ramp(frame,618,630)}}>
      <div style={{position:'absolute',top:28,left:24,right:24,height:5,background:'#ffffff4d',borderRadius:3}}><div style={{width:'93%',height:'100%',background:C.yellow}}/></div>
      <div style={{position:'absolute',top:58,left:28,fontSize:22,fontWeight:700}}>yllustre_agencia</div>
      <div style={{position:'absolute',bottom:70,left:36,fontSize:47,fontWeight:700,lineHeight:1.1,letterSpacing:-1}}>No grande momento.</div>
    </div>
    <div style={{position:'absolute',bottom:24,left:24,fontSize:22,letterSpacing:2,fontWeight:700,opacity:ramp(frame,642,654)}}>A CELEBRAÇÃO</div>
  </div>;
}

export function YllustreFilm() {
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:C.black,color:C.white,fontFamily:'YArial, Arial, sans-serif',overflow:'hidden'}}>
    <Html5Audio src={staticFile('audio/yllustre-original.wav')}/>
    {scenes.map((scene,i)=>{
      const f=frame-scene.from;
      // Outgoing scene stays opaque under an incoming continuous mask.
      // Short overlaps are included inside the master timeline.
      if(f < -12 || f>=scene.duration) return null;
      const enter=Easing.bezier(.2,.75,.2,1)(clamp((f+12)/12));
      const Component=scene.component;
      const masked=[2,6].includes(i);
      return <AbsoluteFill key={scene.name} style={{background:scene.theme==='dark'?C.black:scene.theme==='yellow'?C.yellow:C.white,opacity:masked?1:i===0?1:enter,clipPath:masked?`inset(0 ${100*(1-enter)}% 0 0 round 0px)`:undefined,transform:!masked&&i!==0&&i!==4?`translateY(${(1-enter)*28}px)`:undefined}}><Component f={Math.max(0,f+(i===0?0:24))}/></AbsoluteFill>;
    })}
    <StoryVideoBridge frame={frame}/>
  </AbsoluteFill>;
}
