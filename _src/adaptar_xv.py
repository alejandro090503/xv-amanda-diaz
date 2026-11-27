import re, pathlib, sys
P = pathlib.Path(r"C:/Users/aleja/xv-amanda-diaz/index.html")
s = P.read_text(encoding="utf8")

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        sys.exit(f"ANCLA {n}x (esperaba {count}): {old[:80]!r}")
    s = s.replace(old, new)

def rx(pat, new, flags=re.S):
    global s
    s2, n = re.subn(pat, new, s, flags=flags)
    if n != 1:
        sys.exit(f"REGEX {n}x: {pat[:80]!r}")
    s = s2

URL = "https://xv-amanda-diaz.vercel.app"
MAPS = "https://www.google.com/maps/search/?api=1&amp;query=My+Illusion+Reception+Hall+18855+W+Little+York+Rd+Katy+TX+77449"
DESC = "Celebra conmigo mis XV años. Una noche especial en Katy, Texas — 17 de Enero 2027 · Abre tu invitación"

# ── HEAD ──
rx(r"<title>.*?</title>", "<title>Mis XV Años · Amanda · 17 Enero 2027</title>")
rx(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{DESC} 💌">')
rep('https://boda-edith-y-siddharta.vercel.app/"', URL + '/"')
s = s.replace("https://boda-edith-y-siddharta.vercel.app/og-image.jpg", URL + "/og-image.jpg")
s = s.replace("💌 Edith &amp; Siddharta · 5 · Diciembre · 2026", "💌 Mis XV Años · Amanda · 17 · Enero · 2027")
s = re.sub(r'(og:description" content=")[^"]*"', r'\g<1>' + DESC + ' ✉️"', s)
s = re.sub(r'(twitter:description" content=")[^"]*"', r'\g<1>' + DESC + ' ✉️"', s)
rep('Sobre de invitación de Edith y Siddharta', 'Sobre de invitación de los XV años de Amanda')

# ── LOADER / SOBRE ──
rep('<span>S</span><span>&nbsp;</span><span>&amp;</span><span>&nbsp;</span><span>E</span>', '<span>A</span><span>D</span>')
rep('Nos casamos &middot; 5 Diciembre 2026', 'Mis XV Años &middot; 17 Enero 2027')
rep('alt="Invitación de boda"', 'alt="Invitación de XV años"')

# ── HERO: un solo nombre, sin "&" ──
rx(r'<span class="hero-bride metal rv">Siddharta Omar</span>\s*<span class="hero-amp rv">&amp;</span>\s*<span class="hero-groom metal rv">Edith</span>',
   '<span class="hero-amp hero-xv rv">Mis XV Años</span>\n      <span class="hero-bride metal rv">Amanda</span>')

# ── FECHA ──
rep('<p class="fecha-label">Sábado</p>', '<p class="fecha-label">Domingo</p>')
rep('<span class="fecha-main">5 &middot; Diciembre &middot; 2026</span>', '<span class="fecha-main">17 &middot; Enero &middot; 2027</span>')

# ── QUOTE (bienvenida) ──
rx(r'<p class="quote-txt rv">.*?</p>\s*<span class="quote-sig metal rv">Siddharta Omar &amp; Edith</span>',
   '<p class="quote-txt rv">\n      &ldquo;Hay momentos que se esperan toda una vida. Hoy cierro una etapa llena de sueños y abro otra con ilusión, gratitud y la bendición de Dios. Nada me haría más feliz que compartir esta noche tan especial contigo.&rdquo;\n    </p>\n    <span class="quote-sig metal rv">Amanda</span>')

# ── FAMILIA: Mis Padres / Mis Padrinos ──
rx(r'(<section id="familia" class="sec satin satin--champ">).*?(</section>)',
   r'''\1
    <h2 class="script-title metal rv">Mis Padres</h2>
    <div class="fam-hijos fam-padres rv">
      <div class="fam-role">Con el amor y la bendición de</div>
      <div class="fam-name">Glorimel Albany</div>
      <div class="fam-name">Freddy Diaz</div>
    </div>

    <div class="nk-line rv"></div>
    <p class="fam-sub rv">Mis Padrinos</p>
    <div class="pad-list">
      <div class="pad-row rv"><span class="pad-role">Padrinos</span><span class="pad-name pendiente">Por confirmar</span></div>
    </div>
  \2''')

# ── UBICACIÓN ──
rx(r'(<p class="eyebrow rv">)Dónde Celebramos(</p>\s*<h2 class="script-title metal rv">Ubicación</h2>\s*)<div class="loc-card rv">.*?<div style="height:22px"></div>\s*<div class="loc-card rv">.*?</a>\s*</div>',
   r'''\1Dónde Celebraremos\2<div class="loc-card rv">
      <div class="loc-name">My Illusion Reception Hall</div>
      <div class="loc-sub">Recepción</div>
      <div class="loc-hours">5:00 PM &mdash; 11:00 PM</div>
      <div class="loc-city">18855 W Little York Rd, Katy, TX 77449</div>
      <a href="''' + MAPS + r'''"
         target="_blank" rel="noopener" class="btn-map">
        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        Ver en Google Maps
      </a>
    </div>''')
rx(r'https://calendar\.google\.com/calendar/render\?[^"]*"',
   'https://calendar.google.com/calendar/render?action=TEMPLATE&amp;text=XV+A%C3%B1os+de+Amanda&amp;dates=20270117T230000Z/20270118T050000Z&amp;details=Recepci%C3%B3n+5%3A00+PM+%C2%B7+My+Illusion+Reception+Hall&amp;location=18855+W+Little+York+Rd+Katy+TX+77449"')

# ── ITINERARIO (programa por confirmar) ──
rx(r'(<div class="itin-grid" id="itinGrid">\s*<div class="itin-spine"></div>).*?(\s*</div>\s*</section>)',
   r'''\1

      <div class="itin-item itin-row-l">
        <div class="itin-time">5:00 PM</div>
        <div class="itin-evt">Recepción</div>
      </div>
      <div class="itin-dot-col"><div class="itin-dot"></div></div>
      <div></div>
      <div></div>
      <div class="itin-dot-col"><div class="itin-dot"></div></div>
      <div class="itin-item itin-item--r itin-row-r">
        <div class="itin-time">11:00 PM</div>
        <div class="itin-evt">Fin de la Celebración</div>
      </div>
    </div>
    <p class="itin-pend rv">Programa completo de la noche: por confirmar</p>
  </section>''')

# ── DRESS CODE: Formal + colores a evitar ──
rep('<h2 class="script-title metal rv">Semiformal</h2>', '<h2 class="script-title metal rv">Formal</h2>')
rx(r'<p class="dc-avoid">Por favor evitar este color</p>.*?<p class="dc-avoid-name">.*?</p>',
   '''<p class="dc-avoid">Por favor evitar estos colores</p>
      <div class="dc-swatches">
        <span class="dc-swatch-dot" style="background:#efcaff;" aria-label="Lila"></span>
        <span class="dc-swatch-dot" style="background:#ffd24b;" aria-label="Amarillo"></span>
      </div>
      <p class="dc-avoid-name">Lila y amarillo</p>''')

# ── SOLO ADULTOS (pendiente de confirmar) ──
rep('<p class="nk-text">Agradecemos su comprensión.</p>', '<p class="nk-text">Por confirmar con la familia.</p>')

# ── GALERÍA ──
rep('<p class="eyebrow rv">Nosotros</p>\n    <h2 class="script-title metal rv">Nuestra Historia</h2>',
    '<p class="eyebrow rv">Así he crecido</p>\n    <h2 class="script-title metal rv">Mis Momentos</h2>\n    <p class="gal-pend rv">Fotos de muestra &middot; pronto las de Amanda</p>')
s = s.replace('alt="Edith &amp; Siddharta"', 'alt="Amanda"')

# ── ÁLBUM ──
rep('data-fecha="2026-12-05"', 'data-fecha="2027-01-17"')
rep('Ayúdanos a guardar cada momento', 'Ayúdame a guardar cada momento')

# ── RSVP ──
rep('<div class="eyebrow rsvp-eyebrow">Confirma tu Asistencia</div>', '<div class="eyebrow rsvp-eyebrow">Acompáñame &middot; Confirma tu Asistencia</div>')
rep('Por favor confírmanos tu asistencia antes del <strong>20 de noviembre de 2026</strong>.<br>Te lo agradecemos.',
    'Me encantará celebrar contigo. Por favor confírmame tu asistencia antes del <strong>25 de diciembre de 2026</strong>.')
rep('Fecha límite · 20 de noviembre de 2026', 'Fecha límite · 25 de diciembre de 2026')
rep("var RSVP_URL  = 'https://boda-edith-y-siddharta.vercel.app';", "var RSVP_URL  = '" + URL + "';")
rep("var DEADLINE  = new Date(2026, 10, 20, 23, 59, 59, 999); /* 20 nov 2026 */", "var DEADLINE  = new Date(2026, 11, 25, 23, 59, 59, 999); /* 25 dic 2026 */")
s = s.replace("los novios", "la familia")

# ── COUNTDOWN (Katy TX = CST -06:00) ──
rep("new Date('2026-12-05T13:00:00-07:00')", "new Date('2027-01-17T17:00:00-06:00')")

# ── FOOTER ──
rep('<div class="footer-names metal rv">Siddharta Omar &amp; Edith</div>', '<div class="footer-names metal rv">Amanda</div>\n    <div class="footer-xv rv">Mis XV Años</div>')
rep('<div class="footer-date rv">5 &middot; Diciembre &middot; 2026</div>', '<div class="footer-date rv">17 &middot; Enero &middot; 2027</div>')

# ── MÚSICA ──
rep('title="Chris Stapleton — Tennessee Whiskey"', 'title="Música de fondo"')
rep('audio/boda-edith-y-siddharta/cancion.mp3', 'audio/xv-amanda-diaz/cancion.mp3')

# ── METAL: plata → rosa oro + dorado ──
rep('<stop offset="0" stop-color="#825cb8"/><stop offset=".35" stop-color="#9a9aa6"/><stop offset=".55" stop-color="#e4e4ec"/><stop offset=".75" stop-color="#c9a977"/><stop offset="1" stop-color="#825cb8"/>',
    '<stop offset="0" stop-color="#825cb8"/><stop offset=".35" stop-color="#B76E79"/><stop offset=".55" stop-color="#F7E7CE"/><stop offset=".75" stop-color="#D4AF37"/><stop offset="1" stop-color="#825cb8"/>')
rep('--silver:linear-gradient(135deg,#8e8e96 0%,#e9e9ee 28%,#C0C0C0 50%,#f7f7fa 70%,#9a9aa3 100%);',
    '--silver:linear-gradient(135deg,#8f4f5b 0%,#e7b9b4 28%,#B76E79 50%,#F7E7CE 70%,#b8902c 100%);')
rep('--plata:linear-gradient(115deg,#7f7f8a 0%,#f2f2f6 18%,#a9a9b4 34%,#ffffff 50%,#9c9ca8 66%,#ececf2 82%,#85858f 100%);',
    '--plata:linear-gradient(115deg,#8f4f5b 0%,#f3d2cc 18%,#B76E79 34%,#fff4e6 50%,#c9a24a 66%,#F7E7CE 82%,#9a5a64 100%);')
rep('--morado-metal:linear-gradient(100deg,#4a2d7c 0%,#7650ad 36%,#9a8cc0 46%,#d2d2de 50%,#9a8cc0 54%,#7650ad 64%,#4a2d7c 100%);',
    '--morado-metal:linear-gradient(100deg,#4a2d7c 0%,#7650ad 34%,#B76E79 44%,#F7E7CE 50%,#D4AF37 55%,#7650ad 66%,#4a2d7c 100%);')
rep('.satin--silver::before{background-image:linear-gradient(115deg,#e2d0f4 0%,#f1eff6 14%,#cfcdd9 28%,#fafafc 42%,#d6c2f0 58%,#e9e8ef 72%,#c6c4d2 86%,#dfccf3 100%)}',
    '.satin--silver::before{background-image:linear-gradient(115deg,#e9d2fb 0%,#fbe3ec 14%,#efcaff 28%,#fff5f8 42%,#f4c6d8 58%,#ead6fb 72%,#f2cfe0 86%,#e6cffb 100%)}')
rep('--gold:#b08f5a;', '--gold:#B76E79;')
rep('.pad-dots i.on{width:22px;background:linear-gradient(90deg,#825cb8,#c9a977)}', '.pad-dots i.on{width:22px;background:linear-gradient(90deg,#825cb8,#B76E79)}')

# ── CSS XV: nombre en serif (nunca script), "Mis XV Años", pendientes ──
CSS = '''
/* ══ XV AMANDA: nombre en Cormorant (sin script) + rosa oro ══ */
.hero-bride,.footer-names,.quote-sig{font-family:'Cormorant Garamond',serif !important;font-weight:600;font-style:normal;letter-spacing:.04em}
.hero-bride.metal{font-size:clamp(64px,20vw,104px) !important;line-height:1.02;white-space:nowrap}
.hero-amp.hero-xv{font-family:'Cormorant Garamond',serif;font-style:normal;font-weight:700;font-size:clamp(15px,4.4vw,19px);letter-spacing:.42em;text-transform:uppercase;
  background:linear-gradient(100deg,#8f4f5b 0%,#B76E79 30%,#F7E7CE 50%,#D4AF37 68%,#8f4f5b 100%);background-size:220% 100%;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:metalSweep 7s linear infinite;
  filter:drop-shadow(0 1px 1px rgba(255,255,255,.85));margin:0 0 .35em;padding-left:.42em}
.footer-names{font-size:clamp(46px,13vw,60px) !important}
.quote-sig{font-size:30px !important}
.footer-xv{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:15px;letter-spacing:.38em;text-transform:uppercase;color:#7a4a8c;margin-top:4px;padding-left:.38em}
.fam-padres{margin-top:26px}
.pendiente{color:#7a4a8c !important;font-style:italic}
.itin-pend,.gal-pend{font-family:'Cormorant Garamond',serif;font-weight:600;font-style:italic;font-size:17px;color:#6d48a6;text-align:center;margin:22px auto 0;max-width:320px}
.gal-pend{margin:6px auto 16px}
'''
rep('</style>\n</head>', CSS + '</style>\n</head>')

P.write_text(s, encoding="utf8")
left = [w for w in ("Edith", "Siddharta", "Siddharta", "El Paso", "boda-edith", "Nos casamos", "novio", "Novia") if w in s]
print("OK; restos:", left)
