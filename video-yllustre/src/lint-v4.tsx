import React, {createRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {YllustreFilmV4} from './YllustreFilmV4';
const ref=createRef<PlayerRef>();
document.body.style.margin='0';
const root=document.createElement('div');
root.dataset.compositionId='main';root.dataset.duration='45';
root.style.cssText='width:1080px;height:1920px;position:relative';
document.body.appendChild(root);
(window as any).__duration=45;
(window as any).__seek=async(t:number)=>{
 if(!ref.current)throw new Error('Player not mounted');
 ref.current.seekTo(Math.min(1349,Math.round(t*30)));
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 await document.fonts.ready;
 await Promise.all(Array.from(document.images).map(img=>img.complete?Promise.resolve():img.decode().catch(()=>{})));
};
createRoot(root).render(<Player ref={ref} component={YllustreFilmV4} durationInFrames={1350} compositionWidth={1080} compositionHeight={1920} fps={30} controls={false} clickToPlay={false} style={{width:1080,height:1920}}/>);
