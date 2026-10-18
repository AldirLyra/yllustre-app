from pathlib import Path
from PIL import Image, ImageOps
import numpy as np
import wave
import shutil

ROOT = Path(__file__).resolve().parent.parent
source = ROOT.parent / 'assets'
target = ROOT / 'public' / 'media'
target.mkdir(parents=True, exist_ok=True)
files = {'logo': 'logo.jpg', 'celebracao': 'nosso-trabalho/noiva1.png', 'equipe':'nosso-trabalho/atualizada2.jpeg', 'bastidores':'nosso-trabalho/atualizada1.jpeg', 'preparativos':'nosso-trabalho/noiva-atualizada.jpeg', 'oracao':'nosso-trabalho/noiva2.jpeg', 'encontro':'nosso-trabalho/noiva3.jpeg'}
for name, path in files.items():
    im = ImageOps.exif_transpose(Image.open(source/path)).convert('RGB')
    im.thumbnail((1800,2400), Image.Resampling.LANCZOS)
    im.save(target/f'{name}.jpg', quality=93, subsampling=0)
fonts = ROOT/'public/fonts'
fonts.mkdir(parents=True, exist_ok=True)
for font in ['arial.ttf','arialbd.ttf','georgiai.ttf']:
    shutil.copyfile(Path('C:/Windows/Fonts')/font,fonts/font)

# Original instrumental score, generated locally. No sampled music or voices.
sr=44100
duration=45
n=sr*duration
track=np.zeros((n,2), dtype=np.float64)
rng=np.random.default_rng(20261010)

def add(sound, start, gain=1., pan=0.):
    at=int(start*sr)
    if at>=n: return
    if at<0: sound=sound[-at:]; at=0
    sound=sound[:n-at]
    track[at:at+len(sound),0] += sound*gain*np.sqrt((1-pan)/2)
    track[at:at+len(sound),1] += sound*gain*np.sqrt((1+pan)/2)

def note(midi, dur, pluck=False):
    t=np.arange(int(sr*dur))/sr
    hz=440*2**((midi-69)/12)
    if pluck:
        env=(1-np.exp(-t*140))*np.exp(-t*3.7)
        return (np.sin(2*np.pi*hz*t)+.25*np.sin(2*np.pi*hz*2*t)+.08*np.sin(2*np.pi*hz*3*t))*env
    env=np.minimum(t/.65,1)*np.minimum((dur-t)/1.2,1)
    return (np.sin(2*np.pi*hz*t)+.22*np.sin(2*np.pi*hz*2.003*t)+.12*np.sin(2*np.pi*hz*.997*t))*env

# Dmaj7 → Aadd9 → Bm7 → Gmaj7; warm suspended voicings.
chords=[[50,57,61,66],[45,52,59,64],[47,54,57,62],[43,50,54,59]]
beat=.6
for bar,start in enumerate(np.arange(0,43.2,2.4)):
    chord=chords[bar%4]
    gentle = 27 <= start < 33
    for j,m in enumerate(chord): add(note(m,3.4),start,.065 if gentle else .055,(-.6+j*.4))
    for k in range(8):
        add(note(chord[[0,2,1,3,2,1,3,2][k]]+24,1.6,True),start+k*.3,.048 if gentle else .07,(-.35 if k%2 else .35))
    if start>=4.8 and not gentle and start<39:
        for k in [0,2]:
            t=np.arange(int(sr*.28))/sr
            kick=np.sin(2*np.pi*(49*t+4*(1-np.exp(-t*28))))*np.exp(-t*18)
            add(kick,start+k*beat,.17)
        for k in [1,3]:
            t=np.arange(int(sr*.1))/sr
            noise=rng.normal(0,1,len(t))
            tap=(noise-np.roll(noise,1))*np.exp(-t*65)
            add(tap,start+k*beat,.025,.15)
        for k in range(8):
            t=np.arange(int(sr*.045))/sr
            add(rng.normal(0,1,len(t))*np.exp(-t*120),start+k*.3,.008,(-.45 if k%2 else .45))

# Soft motion accents at transitions. No harsh impacts.
for seconds in [5,10,15,21,27,33,39]:
    t=np.arange(int(sr*.55))/sr
    noise=rng.normal(0,1,len(t))
    smoothed=np.convolve(noise,np.ones(30)/30,mode='same')
    env=np.sin(np.pi*t/.55)**2
    add(smoothed*env,seconds-.28,.08,-.3)
    add(note(86,.8,True),seconds,.045,.3)
for j,m in enumerate([50,57,61,66,74]): add(note(m,5.5),39,.055,(-.5+j*.25))
t=np.arange(n)/sr
fade=np.minimum(t/1.2,1)*np.minimum(np.maximum((45-t)/2.8,0),1)
track*=fade[:,None]
track=np.tanh(track*1.35)
peak=np.max(np.abs(track))
track*=.74/max(peak,1e-8)
audio=ROOT/'public/audio'
audio.mkdir(parents=True,exist_ok=True)
with wave.open(str(audio/'yllustre-original.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
    w.writeframes((track*32767).astype('<i2').tobytes())
print('Prepared 7 photographic assets, 3 fonts and a 45-second original stereo score.')
