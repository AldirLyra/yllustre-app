from pathlib import Path
import wave
import numpy as np

root=Path(__file__).resolve().parent.parent
with wave.open(str(root/'public-v2/audio/yllustre-original.wav'),'rb') as w:
    sr=w.getframerate(); assert w.getnchannels()==2 and w.getsampwidth()==2
    track=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64).reshape(-1,2)/32768
t=np.arange(len(track))/sr
# Make space before the full-screen photographic reveal and while reading contact.
envelope=1-.65*np.exp(-((t-26.72)/.22)**2)
envelope*=1-.24*(1/(1+np.exp(-np.clip((t-39)*6,-50,50))))
track*=envelope[:,None]
rng=np.random.default_rng(4317)
for at,volume,duration in [(14.78,.07,.50),(26.78,.085,.52)]:
    n=int(duration*sr);u=np.arange(n)/sr
    noise=rng.normal(0,1,n)
    spectrum=np.fft.rfft(noise);f=np.fft.rfftfreq(n,1/sr)
    spectrum*=np.exp(-((f-2200)/1700)**2)*(f>300)
    effect=np.fft.irfft(spectrum,n)*np.sin(np.pi*np.arange(n)/n)**2
    effect=effect/max(np.max(np.abs(effect)),1e-6)*volume
    start=int(at*sr);track[start:start+n]+=np.column_stack([effect,np.roll(effect,25)])
n=int(.45*sr);u=np.arange(n)/sr
hit=(np.sin(2*np.pi*146.83*u)+.25*np.sin(2*np.pi*293.66*u))*np.exp(-u*16)*np.minimum(1,u/.008)*.075
start=27*sr;track[start:start+n]+=hit[:,None]
peak=np.max(np.abs(track))
if peak>.73:track*=.73/peak
with wave.open(str(root/'public-v2/audio/yllustre-v4.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(track,-1,1)*32767).astype('<i2').tobytes())
print('45s V4 mix created: existing original score and three local effects.')
