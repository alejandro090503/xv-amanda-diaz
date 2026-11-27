import numpy as np
from PIL import Image, ImageFilter
S='C:/Users/aleja/save-the-date-lekshmy-jaylin/'
def h(x): return np.array([int(x[i:i+2],16) for i in (1,3,5)],float)
stops=[h(c) for c in ('#F9F4FD','#EFCAFF','#F4A4C0','#B18CFE','#9A74D6','#825CB8')]
metal=h('#B76E79')
for n in ['hero','top','oval','corner','footer']:
    im=Image.open(S+f'ink-{n}.jpg').convert('RGB')
    a=np.asarray(im,float)/255
    L=a@np.array([.299,.587,.114])
    lo,hi=np.percentile(L,[1,99.5]); t=np.clip((L-lo)/(hi-lo),0,1)
    t=1-t   # claro = fondo
    t=t**1.15
    pos=t*(len(stops)-1); i=np.clip(pos.astype(int),0,len(stops)-2); f=(pos-i)[...,None]
    S_=np.array(stops)
    out=S_[i]*(1-f)+S_[i+1]*f
    g=np.asarray(Image.fromarray((L*255).astype('uint8')).filter(ImageFilter.GaussianBlur(5)),float)/255
    vet=np.clip((g-L)*6,0,1)[...,None]
    out=out*(1-.85*vet)+ (out*.15+metal*.85)*.85*vet + out*0  # veta metálica
    out=np.clip(out,0,255)
    img=Image.fromarray(out.astype('uint8'))
    for q in (82,72,62,52,42):
        img.save(f'ink/ink-{n}.webp',quality=q,method=6)
        import os; sz=os.path.getsize(f'ink/ink-{n}.webp')/1024
        if sz<=120: break
    print(n,round(sz))
