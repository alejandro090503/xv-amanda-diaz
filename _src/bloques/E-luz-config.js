/* INSERTAR: dentro de un <script> antes de </body>, DESPUÉS del último <script> existente (orden de JS: E-luz-config.js → E-luz.js → D-brillo.js → D-itinerario.js → D-21st.js) */
/* Firma "Satén vivo rosa oro": configura la Luz Premium y coloca su marcado (sin tocar el HTML de las secciones).
   Debe correr ANTES de E-luz.js, que busca .lp-seda, .lp-flare, .lp-caida, .lp-niebla, .lp-cascada, .lp-glints y [data-lp-union]. */
window.LP_CONFIG = {
  flareMini: 'assets/flare-mini.webp',
  /* seda lila/rosa con luz rosa oro (nada de plata) */
  seda:    { sombra:'#E4CCF4', base:'#F9EDF7', luz:'#E9B3A2' },
  borde:   '#F9F4FD',          /* el --bg que comparten todas las secciones claras */
  fundido: 220,
  /* cortina de las uniones (#itinerario y #rsvp): rosa oro metálico */
  cortina: { sombra:'#8E4F5B', base:'#B76E79', luz:'#F7E7CE' },
  niebla:  '214,186,240'       /* lila */
};
(function(){
  function el(tag, cls, attrs){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) Object.keys(attrs).forEach(function(k){ e.setAttribute(k, attrs[k]); });
    return e;
  }

  /* 14 · seda iluminada en TODAS las secciones .satin (incluye #regalos si llega como .satin) */
  document.querySelectorAll('.satin').forEach(function(sec){
    if (sec.querySelector(':scope > canvas.lp-seda')) return;
    var cv = el('canvas', 'lp-seda', { 'aria-hidden': 'true' });
    /* las champán van más cálidas (rosa champán); las "silver" quedan en lila */
    if (sec.classList.contains('satin--champ')){
      cv.dataset.sombra = '#EBD2EE'; cv.dataset.base = '#FBEFEA'; cv.dataset.luz = '#E6AE8E';
    }
    sec.insertBefore(cv, sec.firstChild);
    sec.classList.add('lp-has-seda');
  });

  /* 17 · cortina de seda en 2 uniones: entrada de #itinerario y de #rsvp */
  ['itinerario', 'rsvp'].forEach(function(id){
    var s = document.getElementById(id);
    if (s){ s.setAttribute('data-lp-union', 'seda'); s.classList.add('lp-con-cortina'); }
  });

  /* Portada: niebla lila abajo, caída 3D de pétalos rosa y lila, 1 destello */
  var hero = document.getElementById('hero');
  if (hero){
    var veil = hero.querySelector('.hero-veil') || hero.firstChild;
    var niebla = el('div', 'lp-niebla dx-niebla-baja', { 'aria-hidden': 'true' });
    var caida = el('canvas', 'lp-caida', { 'aria-hidden': 'true', 'data-sprites': 'assets/p1.webp,assets/p2.webp,assets/p3.webp' });
    var flare = el('div', 'lp-flare', { 'data-x': '80%', 'data-y': '16%', 'data-s': '.95' });
    veil.parentNode.insertBefore(niebla, veil.nextSibling);
    niebla.parentNode.insertBefore(caida, niebla.nextSibling);
    hero.appendChild(flare);

    /* Nombre "Amanda": cascada (10) + diamantes (2), en Cormorant (no script) */
    var cands = [].slice.call(hero.querySelectorAll('.hero-content span, .hero-content h1, .hero-content div'));
    var nombre = cands.filter(function(c){ return /amanda/i.test(c.textContent) && !c.children.length; })[0]
              || hero.querySelector('.hero-groom') || hero.querySelector('.hero-bride');
    if (nombre && !nombre.closest('.lp-glints')){
      nombre.classList.remove('metal');
      nombre.classList.add('lp-cascada', 'lp-claro', 'dx-nombre');
      var gl = el('span', 'lp-glints');
      nombre.parentNode.insertBefore(gl, nombre);
      gl.appendChild(nombre);
    }
  }

  /* Galería: destello sobre la foto activa (vive en el carrusel, encima del slide visible) */
  var gal = document.getElementById('galCarousel');
  if (gal) gal.appendChild(el('div', 'lp-flare', { 'data-x': '22%', 'data-y': '14%', 'data-s': '.8' }));
})();
