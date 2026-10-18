import {execFileSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
execFileSync(ffmpeg,['-v','error','-y','-i','../entregas/Yllustre-Video-V3.mp4','-vf',"select='eq(n,1220)+eq(n,1260)+eq(n,1335)',scale=360:640,tile=3x1:padding=6:margin=6",'-frames:v','1','review-v3/closing.jpg']);
console.log('CTA, contact and final signature extracted from final MP4.');
