/* INSERTAR: dentro de un <script> antes de </body> (orden 2: después de E-luz-config.js) · copia FIJA del kit luz-premium.js, sin cambios */
/* ═══ Luz Premium Elysium · aprobados (1, 2, 3, 8, 10, 12, 14) ═══
   Copiar TAL CUAL al final del <body> (después del HTML de las secciones).
   Configuración por invitación, ANTES de este script:
     window.LP_CONFIG = {
       flareMini: 'assets/flare-mini.webp',
       seda:    { sombra:'#3B2F4A', base:'#B9A6C9', luz:'#FFF4E6' },  // 3 tonos de la paleta (oscuro, medio, brillo)
       borde:   '#F6F2EC',      // color de borde que comparten TODAS las secciones claras (la seda se funde desde aquí)
       fundido: 220,            // alto en px del fundido de la seda
       cortina: { sombra:'#7A5A33', base:'#C9A86E', luz:'#FFF4DC' },  // metálico para data-lp-union="seda"
       niebla:  '236,240,246',  // r,g,b de la niebla
       causticas: '#FFF8E4'     // color de la luz de las cáusticas
     };
   Todo se pausa fuera de pantalla y con la pestaña oculta; con prefers-reduced-motion queda en un cuadro fijo. */
(function(){
  var C=window.LP_CONFIG||{}, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function vis(el,cb){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting)})},{rootMargin:'120px'}).observe(el)}
  function hidden(){return document.hidden}
  function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]}
  function fit(c,scale,max){var r=c.getBoundingClientRect(),d=Math.min(max||2,devicePixelRatio||1)*(scale||1);c.width=Math.max(1,Math.round(r.width*d));c.height=Math.max(1,Math.round(r.height*d));return d}
  function img(s){var i=new Image();i.src=s;return i}
  var FM=img(C.flareMini||'assets/flare-mini.webp');

  /* 1 · destello + fantasmas a lo largo del eje que cruza el centro del contenedor */
  document.querySelectorAll('.lp-flare').forEach(function(host,idx){
    var box=host.parentElement, wrap=document.createElement('div');wrap.className='lp-flare-wrap';box.appendChild(wrap);host.remove();
    var del=(-idx*2.9)+'s', s=parseFloat(host.dataset.s||1);
    function build(){wrap.innerHTML='';var W=box.clientWidth,H=box.clientHeight,fx=W*parseFloat(host.dataset.x||18)/100,fy=H*parseFloat(host.dataset.y||20)/100,cx=W/2,cy=H/2;
      var f=document.createElement('div');f.className='lp-fl';f.style.cssText='left:'+fx+'px;top:'+fy+'px;--s:'+s+';--del:'+del;f.innerHTML='<b></b>';wrap.appendChild(f);
      [[.55,14,'255,236,200',.4,0],[.85,34,'170,220,255',.28,1],[1.15,10,'255,255,255',.45,0],[1.4,56,'255,190,210',.22,1],[1.7,22,'200,255,230',.3,0]].forEach(function(q){
        var g=document.createElement('i');g.className='lp-ghost'+(q[4]?' hex':'');var k=q[0]*1.67,x=fx+(cx-fx)*k,y=fy+(cy-fy)*k,z=q[1]*s;
        g.style.cssText='left:'+(x-z/2)+'px;top:'+(y-z/2)+'px;width:'+z+'px;height:'+z+'px;--o:'+q[3]+';--del:'+del+';background:radial-gradient(circle,rgba('+q[2]+',.9) 0 40%,transparent 72%)';wrap.appendChild(g)})}
    build();addEventListener('resize',build)});

  /* 2 · chispas de diamante en el filo superior de las letras, una a la vez */
  document.querySelectorAll('.lp-glints').forEach(function(gb,idx){var on=false;vis(gb,function(v){on=v});
    function glint(){ if(on&&!reduce&&!hidden()){var w=gb.clientWidth,h=gb.clientHeight,d=document.createElement('i');d.className='lp-glint';
      d.style.left=(w*.12+Math.random()*w*.76)+'px';d.style.top=(h*.22+Math.random()*h*.3)+'px';gb.appendChild(d);
      d.animate([{opacity:0,transform:'scale(.2) rotate(-25deg)'},{opacity:1,transform:'scale(1) rotate(0)'},{opacity:0,transform:'scale(.2) rotate(25deg)'}],{duration:1100,easing:'ease-in-out'}).onfinish=function(){d.remove()}}
      setTimeout(glint,700+Math.random()*900)}
    setTimeout(glint,idx*400)});

  /* 3 · caída temática: giro 3D + destello cuando la cara mira a la luz */
  document.querySelectorAll('.lp-caida').forEach(function(c){
    var x=c.getContext('2d'),d=fit(c),on=false,S=(c.dataset.sprites||'').split(',').filter(Boolean).map(img),n=parseInt(c.dataset.n||(innerWidth<600?14:20)),P=[];
    for(var i=0;i<n;i++){var z=Math.random();P.push({x:Math.random(),y:Math.random()*1.1-.1,z:z,v:.025+z*.035,s:16+z*22,r:Math.random()*6.28,sp:(Math.random()-.5)*.8,a:Math.random()*6.28,w:1.2+Math.random()*1.8,k:i,ph:Math.random()*6.28})}
    vis(c,function(v){on=v});addEventListener('resize',function(){d=fit(c)});
    (function loop(t){ if(on&&!hidden()&&S.length){var W=c.width,H=c.height;x.clearRect(0,0,W,H);
      P.forEach(function(p){ if(!reduce){p.y+=p.v/60;if(p.y>1.1){p.y=-.1;p.x=Math.random()}p.a+=p.w/60;p.r+=p.sp/60}
        var im=S[p.k%S.length];if(!im.complete||!im.naturalWidth)return;
        var X=(p.x+Math.sin(t/1800+p.ph)*.03)*W,Y=p.y*H,sz=p.s*d,ar=im.naturalHeight/im.naturalWidth,fl=Math.cos(p.a),face=Math.pow(Math.max(0,fl),14);
        x.save();x.translate(X,Y);x.rotate(p.r);x.scale(Math.max(.14,Math.abs(fl))*(fl<0?-1:1),1);
        x.globalAlpha=.5+p.z*.4;x.drawImage(im,-sz/2,-sz*ar/2,sz,sz*ar);
        if(face>.05){x.globalCompositeOperation='lighter';x.globalAlpha=face*.7;x.drawImage(im,-sz/2,-sz*ar/2,sz,sz*ar);x.globalCompositeOperation='source-over'}
        x.restore();
        if(face>.7&&FM.complete){x.globalAlpha=(face-.7)/.3;var zz=sz*1.6;x.drawImage(FM,X-zz/2+sz*.15,Y-zz/2-sz*.15,zz,zz)}});
      x.globalAlpha=1} requestAnimationFrame(loop)})(0)});

  /* WebGL: utilidades */
  function prog(gl,fs){var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
    var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    var l=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);return pr}
  var HP='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';

  /* 8 · cáusticas en GPU (una sola canvas por escena) */
  document.querySelectorAll('.lp-causticas').forEach(function(c){
    var gl=c.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});if(!gl){c.remove();return}
    var pr=prog(gl,HP+'uniform vec2 res;uniform float t;uniform vec3 col;void main(){vec2 uv=gl_FragCoord.xy/res;float time=t*.35+23.;vec2 p=uv*6.28318*vec2(1.4*res.x/res.y/1.5,1.)-250.;vec2 i=p;float c=1.;float inten=.005;'+
      'for(int n=0;n<5;n++){float tt=time*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));}'+
      'c/=5.;c=1.17-pow(c,1.4);float v=clamp(pow(abs(c),8.),0.,1.);gl_FragColor=vec4(col*v,v*.92);}');
    var uR=gl.getUniformLocation(pr,'res'),uT=gl.getUniformLocation(pr,'t'),uC=gl.getUniformLocation(pr,'col'),on=false,col=hex(C.causticas||'#FFF8E4');
    function size(){fit(c,.75,1.5);gl.viewport(0,0,c.width,c.height)}size();addEventListener('resize',size);vis(c,function(v){on=v});
    (function loop(t){ if((on&&!hidden())||t===0){gl.uniform2f(uR,c.width,c.height);gl.uniform1f(uT,reduce?0:t/1000);gl.uniform3f(uC,col[0],col[1],col[2]);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
      requestAnimationFrame(loop)})(0)});

  /* 10 · cascada: separa el texto en letras */
  document.querySelectorAll('.lp-cascada').forEach(function(el){var t=el.textContent;el.textContent='';el.setAttribute('aria-label',t);
    t.split('').forEach(function(ch,i){var s=document.createElement('span');s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);if(ch===' '){s.className='sp';s.innerHTML='&nbsp;'}else s.textContent=ch;el.appendChild(s)})});

  /* 12 · niebla: textura generada UNA vez y compartida por todas las capas */
  var nieblas=document.querySelectorAll('.lp-niebla');
  if(nieblas.length){var w=512,h=160,cv=document.createElement('canvas');cv.width=w;cv.height=h;var g=cv.getContext('2d'),tono=C.niebla||'236,240,246';
    function blob(x,y,r,a){var gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+tono+','+a+')');gr.addColorStop(1,'rgba('+tono+',0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.29);g.fill()}
    /* blobs dentro del alto de la textura: ninguna orilla queda cortada en seco */
    for(var i=0;i<150;i++){var X=Math.random()*w,Y=h*.32+Math.random()*h*.36,R=16+Math.random()*(Math.min(Y,h-Y)-6),A=.05+Math.random()*.12;blob(X,Y,R,A);blob(X-w,Y,R,A);blob(X+w,Y,R,A)}
    var url='url('+cv.toDataURL()+')';nieblas.forEach(function(n){for(var k=0;k<3;k++){var l=document.createElement('i');l.style.backgroundImage=url;n.appendChild(l)}})}

  /* 15 · velo de luz y 17 · cortina de seda en la unión: data-lp-union="velo" | "seda" en la sección de ABAJO */
  var velos=[];
  document.querySelectorAll('[data-lp-union]').forEach(function(sec){
    var tipo=sec.getAttribute('data-lp-union'),u=document.createElement('div');u.className='lp-union lp-union--'+tipo;u.setAttribute('aria-hidden','true');
    if(getComputedStyle(sec).position==='static')sec.style.position='relative';
    if(tipo==='seda'){var cs=C.cortina||{},cv=document.createElement('canvas');cv.className='lp-seda';
      if(cs.sombra)cv.dataset.sombra=cs.sombra;if(cs.base)cv.dataset.base=cs.base;if(cs.luz)cv.dataset.luz=cs.luz;u.appendChild(cv)}
    else velos.push(u);
    sec.insertBefore(u,sec.firstChild)});
  if(velos.length){var vt=0;function velo(){vt=0;var mid=innerHeight/2;velos.forEach(function(v){var r=v.getBoundingClientRect(),c=r.top+r.height/2,d=Math.abs(c-mid)/(innerHeight*.5);v.style.opacity=reduce?.5:Math.max(0,1-d*1.4).toFixed(3)})}
    addEventListener('scroll',function(){if(!vt)vt=requestAnimationFrame(velo)},{passive:true});addEventListener('resize',velo);velo()}

  /* 14b · fundido de la seda: la transición va COMPLETA dentro de la sección con seda, desde el color EXACTO del borde
     de la sección vecina (LP_CONFIG.borde, p. ej. el marfil que comparten todas las secciones claras) → transparente.
     Así la línea de unión es del mismo color de los dos lados y no queda franja gris ni corte.
     Por sección: data-lp-borde-top / data-lp-borde-bot = otro color o "none" (sin fundido de ese lado). */
  /* el color viaja del borde hacia el tono medio de la seda mientras se vuelve transparente: no pasa por gris */
  function smooth(col,dir,tint){var c=col.split(',').map(Number),b=(tint||col).split(',').map(Number),st=[];
    for(var i=0;i<=8;i++){var t=i/8,a=1-t*t*(3-2*t),k=t*.7,m=c.map(function(v,j){return Math.round(v+(b[j]-v)*k)}).join(',');st.push('rgba('+m+','+a.toFixed(3)+') '+(t*100).toFixed(1)+'%')}
    return 'linear-gradient('+dir+','+st.join(',')+')'}
  function rgb(c){if(!c)return null;if(c.indexOf('rgb')===0)return c.replace(/rgba?\(|\)/g,'').split(',').slice(0,3).map(function(x){return x.trim()}).join(',');var h=hex(c);return h.map(function(v){return Math.round(v*255)}).join(',')}
  document.querySelectorAll('.lp-seda').forEach(function(cv){var sec=cv.parentElement;if(!sec||sec.classList.contains('lp-union'))return;
    /* en secciones cortas el fundido no pasa del 30% del alto, para que la seda se siga viendo */
    var fades=[];function alto(){var h=Math.round(Math.min(C.fundido||220,sec.offsetHeight*.3))+'px';fades.forEach(function(f){f.style.height=h})}
    addEventListener('resize',alto);setTimeout(alto,0);addEventListener('load',alto);
    var H=(C.fundido||220)+'px';[['top','to bottom'],['bot','to top']].forEach(function(s){
      var v=sec.getAttribute('data-lp-borde-'+s[0]);if(v==='none')return;var col=rgb(v||C.borde);if(!col)return;
      var tint=rgb(cv.dataset.base||(C.seda||{}).base);
      var f=document.createElement('div');f.className='lp-sfade lp-sfade--'+s[0];f.setAttribute('aria-hidden','true');f.style.height=H;f.style.backgroundImage=smooth(col,s[1],tint);sec.insertBefore(f,cv.nextSibling);fades.push(f)});alto()});

  /* 14 · seda iluminada: UN contexto WebGL compartido que dibuja cada sección visible y la copia a su canvas 2D */
  var sedas=[].slice.call(document.querySelectorAll('.lp-seda'));
  if(sedas.length){var G=document.createElement('canvas'),gl=G.getContext('webgl',{preserveDrawingBuffer:true,antialias:false});
    if(!gl){sedas.forEach(function(s){s.remove()})}else{
      var pr=prog(gl,HP+'uniform vec2 res;uniform float t;uniform float seed;uniform vec3 cS,cB,cL;'+
        'float h(vec2 p){return sin(p.x*3.1+p.y*1.3+t*.6)*.55+sin(p.x*1.7-p.y*2.2-t*.45)*.35+sin(p.x*5.3+p.y*.7+t*.8)*.12;}'+
        'void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=vec2(uv.x*2.,uv.y*1.4*(res.y/res.x)*1.4)+seed;float e=.01;'+
        'float hx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e),hy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);'+
        'vec3 n=normalize(vec3(-hx*.35,-hy*.35,1.));vec3 l=normalize(vec3(cos(t*.25)*.7,.5,.6));float dif=max(0.,dot(n,l));'+
        'vec3 hv=normalize(l+vec3(0.,0.,1.));float spec=pow(max(0.,dot(n,hv)),40.);'+
        'vec3 col=mix(cS,cB,.25+dif*.75)+cL*spec*.32+cL*pow(dif,8.)*.06;gl_FragColor=vec4(min(col,vec3(1.)),1.);}');
      var u={r:gl.getUniformLocation(pr,'res'),t:gl.getUniformLocation(pr,'t'),s:gl.getUniformLocation(pr,'seed'),S:gl.getUniformLocation(pr,'cS'),B:gl.getUniformLocation(pr,'cB'),L:gl.getUniformLocation(pr,'cL')};
      var items=sedas.map(function(cv,i){var pal=Object.assign({sombra:'#4A3B2E',base:'#C9A97E',luz:'#FFF4E0'},C.seda||{},{sombra:cv.dataset.sombra||(C.seda||{}).sombra,base:cv.dataset.base||(C.seda||{}).base,luz:cv.dataset.luz||(C.seda||{}).luz});
        Object.keys(pal).forEach(function(k){if(!pal[k])delete pal[k]});pal=Object.assign({sombra:'#4A3B2E',base:'#C9A97E',luz:'#FFF4E0'},pal);
        var it={cv:cv,x:cv.getContext('2d'),on:false,seed:i*3.7,S:hex(pal.sombra),B:hex(pal.base),L:hex(pal.luz),first:true};
        function sz(){var r=cv.getBoundingClientRect();cv.width=Math.max(2,Math.round(r.width*.5));cv.height=Math.max(2,Math.round(r.height*.5))}sz();addEventListener('resize',function(){sz();it.first=true});
        vis(cv,function(v){it.on=v});return it});
      var fr=0;
      (function loop(t){ if(!hidden()&&((fr++&1)===0)){items.forEach(function(it){ if(!(it.on||it.first))return; if(reduce&&!it.first)return; it.first=false;
          var w=it.cv.width,h=it.cv.height;if(G.width!==w||G.height!==h){G.width=w;G.height=h}gl.viewport(0,0,w,h);
          gl.uniform2f(u.r,w,h);gl.uniform1f(u.t,reduce?0:t/1000);gl.uniform1f(u.s,it.seed);gl.uniform3fv(u.S,it.S);gl.uniform3fv(u.B,it.B);gl.uniform3fv(u.L,it.L);
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);it.x.drawImage(G,0,0)})}
        requestAnimationFrame(loop)})(0)}}
})();
