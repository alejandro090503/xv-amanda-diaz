/* INSERTAR: dentro de un <script> antes de </body> (orden 3 de JS, después de E-luz.js) · D-brillo: capas de luz en tarjetas y destellos en títulos */
(function initBrilloRosaOro(){
  var n = 0;
  function flare(padre, x, y, s, mini){
    var f = document.createElement('i'), b = document.createElement('b');
    f.className = 'dx-flare' + (mini ? ' is-mini' : '');
    f.setAttribute('aria-hidden', 'true');
    f.style.setProperty('--x', x);
    f.style.setProperty('--y', y);
    f.style.setProperty('--s', s || 1);
    /* desfase áureo: nunca florecen dos juntos */
    var dur = mini ? 5.5 + (n % 3) * .9 : 8 + (n % 3);
    f.style.setProperty('--dur', dur + 's');
    f.style.setProperty('--del', (-((n * .618034) % 1) * dur).toFixed(2) + 's');
    f.appendChild(b);
    padre.appendChild(f);
    n++;
  }
  function capa(padre, cl, conHijo, k){
    var e = document.createElement('i');
    e.className = cl;
    e.setAttribute('aria-hidden', 'true');
    if (conHijo){
      var h = document.createElement('i');
      h.style.setProperty('--del', (-(k * 3.1)).toFixed(1) + 's');
      e.appendChild(h);
    }
    padre.appendChild(e);
  }

  /* Tarjetas: familia, ubicación, regalos (#regalos la agrega otro bloque) y RSVP */
  var cards = [].slice.call(document.querySelectorAll('.fam-col,.fam-hijos,.corte-item,.loc-card,.gift-card,#rsvp .rsvp-card'));
  var reg = document.getElementById('regalos');
  if (reg) [].slice.call(reg.querySelectorAll('[class]')).forEach(function(e){
    /* cualquier clase que TERMINE en "card" (gift-card, reg-card…), no sus partes internas (card-title…) */
    if ([].some.call(e.classList, function(c){ return /card$/i.test(c); }) && cards.indexOf(e) < 0) cards.push(e);
  });
  cards.forEach(function(c, k){
    if (c.classList.contains('dx-card')) return;
    c.classList.add('dx-card');
    var cs = getComputedStyle(c);
    if (cs.position === 'static') c.style.position = 'relative';
    c.style.setProperty('--dx-r', cs.borderTopLeftRadius || '16px');
    capa(c, 'dx-halo');
    capa(c, 'dx-sheen', true, k);
    if (!c.classList.contains('rsvp-card')) capa(c, 'dx-line');
    capa(c, 'dx-rim', true, k);
    /* destello grande en una esquina y mediano en la opuesta (150–220 px); las chicas solo uno */
    var chica = c.offsetWidth < 200 || c.classList.contains('corte-item');
    flare(c, chica ? '14%' : '7%', '0', chica ? .82 : 1.05);
    if (!chica) flare(c, '92%', '100%', .8);
  });

  /* Títulos: destello de 60–90 px sobre la primera letra y uno mini al final */
  document.querySelectorAll('.script-title.metal,.footer-names.metal,.quote-sig.metal').forEach(function(t){
    t.classList.add('dx-tit');
    flare(t, '14%', '34%', .42);
    flare(t, '88%', '40%', .9, true);
  });

  /* iPhone: fuera de pantalla las capas animadas se quitan (animation:none), así no se acumulan capas compuestas */
  var vivos = [].slice.call(document.querySelectorAll('.dx-card,.dx-tit'));
  vivos.forEach(function(e){ e.classList.add('dx-off'); });
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('dx-off', !e.isIntersecting); });
    }, { rootMargin: '160px 0px' });
    vivos.forEach(function(e){ io.observe(e); });
  } else vivos.forEach(function(e){ e.classList.remove('dx-off'); });
})();
