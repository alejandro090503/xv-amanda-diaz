/* INSERTAR: dentro de un <script> antes de </body> (orden 4 de JS, después de D-brillo.js) · D-itinerario sobre #itinGrid (funciona con las tarjetas actuales y con "Por confirmar") */
(function initItinerarioRosaOro(){
  var grid = document.getElementById('itinGrid');
  if (!grid || grid.dataset.luz) return;
  grid.dataset.luz = '1';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Horas: número grande + am/pm en cursiva pequeña. Si no es una hora ("Por confirmar") se deja tal cual. */
  grid.querySelectorAll('.itin-time').forEach(function(h){
    var t = h.textContent.trim(), m = t.match(/^(\d{1,2}(?::\d{2})?)\s*([ap]\.?\s?m\.?|hrs?\.?)$/i);
    if (!m) return;
    h.setAttribute('aria-label', t);
    h.classList.add('dx-h');
    h.innerHTML = '<span class="dx-n"></span><span class="dx-m"></span>';
    h.firstChild.textContent = m[1];
    h.lastChild.textContent = m[2].toLowerCase();
  });

  var items = [].slice.call(grid.querySelectorAll('.itin-row-l,.itin-row-r'));
  var dots = [].slice.call(grid.querySelectorAll('.itin-dot'));
  function enciende(lit){
    dots.forEach(function(d, i){ var on = lit(i); d.classList.toggle('is-lit', on); if (items[i]) items[i].classList.toggle('is-lit', on); });
  }
  if (reduce){ enciende(function(){ return true; }); return; }

  function capa(cl, tag){ var e = document.createElement(tag || 'i'); e.className = cl; e.setAttribute('aria-hidden', 'true'); grid.appendChild(e); return e; }
  var line = capa('dx-iline');
  var tails = [capa('dx-tail t1'), capa('dx-tail t2'), capa('dx-tail t3')];
  var head = capa('dx-head'); head.appendChild(document.createElement('b'));

  var L = 1, hitos = [];
  function geo(){
    var r = grid.getBoundingClientRect();
    L = Math.max(1, r.height - 16);
    line.style.setProperty('--dx-len', L + 'px');
    hitos = dots.map(function(d){ var q = d.getBoundingClientRect(); return (q.top + q.height / 2 - r.top - 8) / L; });
  }
  function objetivo(){
    var r = grid.getBoundingClientRect(), vh = innerHeight || 700;
    return Math.max(0, Math.min(1, (vh * .62 - r.top - 8) / L));
  }

  var meta = 0, p = 0, raf = 0, last = 0, dir = 1, visible = false;
  function pinta(vel){
    var y = 8 + p * L;
    line.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    var s = .7 + Math.min(.9, Math.abs(vel) * 9);
    if (vel > .0004) dir = 1; else if (vel < -.0004) dir = -1;
    tails.forEach(function(t, i){
      var hgt = [118, 74, 34][i];
      t.style.transform = 'translate3d(0,' + (y - hgt).toFixed(1) + 'px,0) scaleY(' + (s * dir).toFixed(3) + ')';
      t.style.opacity = p > .004 && p < .998 ? 1 : 0;
    });
    head.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) rotate(' + (dir > 0 ? 0 : 180) + 'deg) scale(' + (.82 + Math.min(.4, Math.abs(vel) * 7)).toFixed(3) + ')';
    head.classList.toggle('is-on', p > .004);
    enciende(function(i){ return p > .002 && p >= (hitos[i] || 0) - .01; });
  }
  function loop(now){
    raf = 0;
    var dt = last ? Math.min((now - last) / 1000, .05) : .016;
    last = now;
    var dv = meta - p;
    p += dv * (1 - Math.exp(-dt / .17));   /* sigue al scroll con leve retraso */
    var quieto = Math.abs(meta - p) < .0005;
    if (quieto) p = meta;
    pinta(quieto ? 0 : dv);
    if (!quieto) raf = requestAnimationFrame(loop); else last = 0;
  }
  function cerca(){ var r = grid.getBoundingClientRect(), vh = innerHeight || 700; return r.bottom > -300 && r.top < vh + 300; }
  function kick(){ if (document.hidden || !(visible || cerca())) return; meta = objetivo(); if (!raf) raf = requestAnimationFrame(loop); }

  geo(); pinta(0);
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible){ geo(); kick(); } }, { rootMargin: '200px 0px' }).observe(grid);
  } else visible = true;
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', function(){ geo(); kick(); });
  addEventListener('load', function(){ geo(); kick(); });
})();
