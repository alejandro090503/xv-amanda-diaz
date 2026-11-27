/* INSERTAR: dentro de un <script> antes de </body> (orden 5 de JS, el último) · capa 21st.dev: 26 Text Reveal (#quote .quote-txt) y 32 Shimmer (#rsvp-confirm-btn) */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function seg(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }

  /* ── 26 · Text Reveal: palabras que se encienden al bajar ── */
  (function(){
    var p = document.querySelector('#quote .quote-txt');
    if (!p || p.dataset.reveal) return;
    p.dataset.reveal = '1';
    var texto = p.textContent.replace(/\s+/g, ' ').trim();
    if (!texto) return;
    p.setAttribute('aria-label', texto);
    var words = texto.split(' ');
    p.textContent = '';
    p.classList.add('d21-reveal');
    /* palabras clave en rosa oro: el nombre y los XV (y las marcadas *así* si el texto las trae) */
    var clave = /amanda|xv|quince|años|\*/i;
    var spans = words.map(function(w, i){
      var s = document.createElement('span');
      s.className = 'd21-w' + (clave.test(w) ? ' k' : '');
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w.replace(/\*/g, '');
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
      return s;
    });
    if (reduce){ spans.forEach(function(s){ s.classList.add('on'); }); return; }
    var raf = 0, prev = -1;
    function u(){
      raf = 0;
      var r = p.getBoundingClientRect(), vh = innerHeight || 700;
      /* empieza cuando el párrafo entra al 88 % de la pantalla y termina cuando su final pasa el 45 % */
      var pr = seg((vh * .88 - r.top) / (r.height + vh * .43), 0, 1);
      var lit = Math.round(seg(pr, .04, .9) * spans.length * 10) / 10;
      if (lit === prev) return;
      prev = lit;
      spans.forEach(function(s, i){
        var on = lit > i + .3;
        s.classList.toggle('on', on);
        s.classList.toggle('hot', on && lit - i < 3.3 && lit < spans.length);   /* punta de lectura en rosa oro */
      });
    }
    /* u() solo lee un rect y sale si nada cambió: barato aunque el párrafo esté lejos */
    function kick(){ if (!raf) raf = requestAnimationFrame(u); }
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    u();
  })();

  /* ── 32 · Shimmer RSVP: solo clases + capa interna + listener extra (el handler original no se toca) ── */
  (function(){
    var btn = document.getElementById('rsvp-confirm-btn'), sec = document.getElementById('rsvp');
    if (!btn || !sec || btn.classList.contains('d21-shimmer')) return;
    btn.classList.add('d21-shimmer');
    var core = document.createElement('i');
    core.className = 'd21-core';
    core.setAttribute('aria-hidden', 'true');
    core.appendChild(document.createElement('i'));
    btn.insertBefore(core, btn.firstChild);

    var cv = null, g = null, P = [], raf = 0, W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), ultimoClick = 0;
    function lienzo(){
      if (!cv){
        cv = document.createElement('canvas');
        cv.className = 'd21-lluvia';
        cv.setAttribute('aria-hidden', 'true');
        if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
        sec.appendChild(cv);
        g = cv.getContext('2d');
      }
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function step(){
      g.clearRect(0, 0, W, H);
      P = P.filter(function(p){
        p.vy += .06; p.x += p.vx; p.y += p.vy; p.l -= .012;
        if (p.l <= 0) return false;
        g.globalAlpha = Math.max(0, p.l); g.fillStyle = p.c;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a += p.va); g.fillRect(-p.s / 2, -p.s / 5, p.s, p.s / 2.5); g.restore();
        return true;
      });
      if (P.length && !document.hidden) raf = requestAnimationFrame(step);
      else { raf = 0; P = []; g.clearRect(0, 0, W, H); }
    }
    function lluvia(origen){
      if (reduce) return;
      lienzo();
      var o = origen.getBoundingClientRect(), r = cv.getBoundingClientRect();
      if (!o.width) o = btn.getBoundingClientRect();
      var cx = o.left - r.left + o.width / 2, cy = o.top - r.top + Math.min(o.height / 2, 60);
      var C = ['#F7E7CE', '#D4AF37', '#B76E79', '#f4a4c0', '#FFF6E4'];
      for (var i = 0; i < 70; i++){
        var a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 5;
        P.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, l: 1, s: 4 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: C[i % C.length] });
      }
      if (!raf) raf = requestAnimationFrame(step);
    }
    /* listener EXTRA: solo anota el toque; la lluvia sale cuando la confirmación sí se guardó (aparece el panel de gracias) */
    btn.addEventListener('click', function(){ ultimoClick = Date.now(); });
    var gracias = document.getElementById('rsvp-gracias');
    if (gracias && 'MutationObserver' in window){
      var antes = gracias.style.display;
      new MutationObserver(function(){
        var ahora = getComputedStyle(gracias).display;
        if (antes === 'none' && ahora !== 'none' && Date.now() - ultimoClick < 15000) lluvia(gracias);
        antes = ahora === 'none' ? 'none' : 'block';
      }).observe(gracias, { attributes: true, attributeFilter: ['style', 'class'] });
    } else {
      btn.addEventListener('click', function(){ if (!btn.disabled) lluvia(btn); });
    }
  })();
})();
