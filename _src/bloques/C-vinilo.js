/* INSERTAR: justo antes de la línea "/* ─────────────── RSVP → PANEL DE INVITADOS" (después del IIFE initFab, dentro del mismo <script>) */
/* ─────────────── VINILO: aparición tras el sobre, inercia, aguja, aria ─────────────── */
(function initVinilo(){
  var fab = document.getElementById('musicFab');
  var audio = document.getElementById('bgAudio');
  if(!fab || !audio) return;
  var disc = fab.querySelector('.vinyl-disc');
  var img = fab.querySelector('.vinyl-arm-img');

  /* aguja real si existe assets/aguja.png; si no, queda la dibujada en CSS */
  var probe = new Image();
  probe.onload = function(){ img.src = probe.src; fab.classList.add('has-img'); };
  probe.src = 'assets/aguja.png';

  function angle(){
    var m = getComputedStyle(disc).transform;
    if(!m || m === 'none') return 0;
    var v = m.match(/matrix\(([^)]+)\)/); if(!v) return 0;
    var p = v[1].split(',');
    return Math.atan2(parseFloat(p[1]), parseFloat(p[0])) * 180 / Math.PI;
  }
  var wasPlaying = false;
  function sync(){
    var on = fab.classList.contains('playing');
    fab.classList.toggle('is-playing', on);
    fab.setAttribute('aria-label', on ? 'Pausar música' : 'Reproducir música');
    if(on === wasPlaying) return;
    if(!on && wasPlaying){            /* frena con inercia */
      var a = angle();
      disc.style.transition = 'none';
      disc.style.transform = 'rotate(' + a + 'deg)';
      void disc.offsetWidth;
      disc.style.transition = 'transform 1.2s cubic-bezier(.12,.6,.25,1)';
      disc.style.transform = 'rotate(' + (a + 70) + 'deg)';
    } else {
      disc.style.transition = ''; disc.style.transform = '';
    }
    wasPlaying = on;
  }
  new MutationObserver(sync).observe(fab, {attributes:true, attributeFilter:['class']});
  sync();

  /* aparece con fundido al abrir el sobre (initAll llama _startAudio al revelar) */
  var show = function(){ setTimeout(function(){ fab.classList.add('is-shown'); }, 600); };
  var prev = window._startAudio;
  window._startAudio = function(){ show(); if(typeof prev === 'function') return prev.apply(this, arguments); };
  if(!document.getElementById('envelope-screen')) show();
})();
