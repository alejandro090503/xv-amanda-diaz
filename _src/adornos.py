import numpy as np
from PIL import Image, ImageFilter
P='C:/Users/aleja/boda-andrea-giovana-gomez-sanchez-luis-uriel-licona-rojas/flores/'
K='C:/Users/aleja/xv-kiara-nieto/assets/'
def h(x): return np.array([int(x[i:i+2],16) for i in (1,3,5)],float)
def ramp(img,cols,gamma=1.0):
    a=np.asarray(img.convert('RGBA'),float); rgb=a[...,:3]; al=a[...,3]
    L=(rgb@np.array([.299,.587,.114]))/255
    m=al>128
    lo,hi=np.percentile(L[m],[3,97]); t=np.clip((L-lo)/(hi-lo+1e-6),0,1)**gamma
    cs=np.array([h(c) for c in cols]); pos=t*(len(cs)-1); i=np.clip(pos.astype(int),0,len(cs)-2); f=(pos-i)[...,None]
    out=cs[i]*(1-f)+cs[i+1]*f
    return Image.fromarray(np.dstack([out,al]).astype('uint8'),'RGBA')
def hueshift(img,tint,k):
    # mezcla cromática hacia tinte conservando luminosidad
    a=np.asarray(img.convert('RGBA'),float); rgb=a[...,:3]; al=a[...,3]
    L=(rgb@np.array([.299,.587,.114]))[...,None]
    t=h(tint)[None,None,:]; tl=(t@np.array([.299,.587,.114]))[...,None]
    col=np.clip(t*(L/np.maximum(tl,1)),0,255)
    out=rgb*(1-k)+col*k
    return Image.fromarray(np.dstack([out,al]).astype('uint8'),'RGBA')
# --- caída: pétalos
LILA=['#825cb8','#b18cfe','#efcaff']
ROSA=['#B76E79','#f4a4c0','#fde6ee']
for n,(src,cols,g) in {1:('petalo-1',LILA,1.0),2:('petalo-4',['#a85a72','#e58aa8','#f7b5cb'],1.0),3:('petalo-8',['#b76e9b','#e3a0d8','#f7dcf3'],1.0)}.items():
    im=Image.open(P+src+'.webp').convert('RGBA')
    im=ramp(im,cols,g)
    im=im.resize((120,int(120*im.height/im.width)),Image.LANCZOS)
    im.save(f'assets/caida-{n}.webp',quality=90,method=6)
# --- adornos: peonías reales, recolor suave + desenfoque horneado
def adorno(src,w,rad,nombre,tint=None,k=.0,flip=False,cols=None,cropb=None):
    im=Image.open(K+src+'.webp').convert('RGBA')
    bb=im.getchannel('A').getbbox(); im=im.crop(bb)
    if cropb: im=im.crop((0,0,im.width,int(im.height*cropb)))
    if cols: im=ramp(im,cols,.8)
    elif tint: im=hueshift(im,tint,k)
    if flip: im=im.transpose(Image.FLIP_LEFT_RIGHT)
    im=im.resize((w,int(w*im.height/im.width)),Image.LANCZOS)
    pad=rad*3
    can=Image.new('RGBA',(im.width+2*pad,im.height+2*pad),(0,0,0,0)); can.paste(im,(pad,pad))
    # premultiplicado para no ensuciar el borde
    a=np.asarray(can,float); al=a[...,3:4]/255; pm=np.dstack([a[...,:3]*al,al*255])
    pmi=Image.fromarray(pm.astype('uint8'),'RGBA')
    ch=[Image.fromarray(pm[...,i].astype('uint8')).filter(ImageFilter.GaussianBlur(rad)) for i in range(4)]
    b=np.dstack([np.asarray(c,float) for c in ch])
    A=np.clip(b[...,3:4],1,255); rgb=np.clip(b[...,:3]/(A/255),0,255)
    out=Image.fromarray(np.dstack([rgb,b[...,3:4]]).astype('uint8'),'RGBA')
    out.save(f'assets/{nombre}.webp',quality=82,method=6,alpha_quality=90)
    print(nombre,out.size)
adorno('flor-a',620,10,'adorno-peonia-rosa','#f4a4c0',.35,cropb=.64)
adorno('flor-d',640,11,'adorno-peonia-lila',flip=True,cols=['#9a74d6','#c3a4fb','#efcaff','#fbf1ff'])
