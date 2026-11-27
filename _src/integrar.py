import pathlib, re, sys
R = pathlib.Path(r"C:/Users/aleja/xv-amanda-diaz")
B = R / "_src/bloques"
P = R / "index.html"
s = P.read_text(encoding="utf8")
if "vinyl-fab" in s:
    sys.exit("ya integrado")

def body(name):
    t = (B / name).read_text(encoding="utf8")
    first, rest = t.split("\n", 1)
    assert "INSERTAR" in first, name
    return rest

def once(anchor):
    n = s.count(anchor)
    if n != 1:
        sys.exit(f"ancla {n}x: {anchor[:70]!r}")

# CSS antes de </style>
css = "\n".join(body(f) for f in ["C-vinilo.css", "C-regalos.css", "A-tintas.css", "A-adornos.css",
                                   "E-luz.css", "E-luz-ajustes.css", "D-brillo.css", "D-itinerario.css", "D-21st.css"])
once("</style>")
s = s.replace("</style>", css + "\n</style>")
# fuente Bodoni
once("</head>")
s = s.replace("</head>", body("D-itinerario.html") + "\n</head>")
# vinilo HTML
s2, n = re.subn(r'<button class="music-fab" id="musicFab".*?</button>', body("C-vinilo.html").strip(), s, flags=re.S)
assert n == 1; s = s2
# vinilo JS
a = "/* ─────────────── RSVP → PANEL DE INVITADOS"
once(a); s = s.replace(a, body("C-vinilo.js") + "\n" + a)
# regalos antes de RSVP
a = '<section id="rsvp"'
once(a); s = s.replace(a, body("C-regalos.html").strip() + "\n\n  " + a)

# tintas (secciones sin seda) + adornos
inks = {l.split("-->", 1)[0]: l.split("-->", 1)[1].strip() for l in body("A-tintas.html").splitlines() if l.startswith("<!--")}
ink = lambda k: next(v for kk, v in inks.items() if k in kk)
ad = {l.split("-->", 1)[0]: l.split("-->", 1)[1].strip() for l in body("A-adornos.html").splitlines() if l.startswith("<!--")}
adr = lambda k: next(v for kk, v in ad.items() if k in kk)
plan = {
    '<section id="quote" class="sec sec--surface">': (ink("ubicación").replace("i3", "i3"), adr("portada")),
    '<section id="ubicacion" class="sec sec--bg">': (ink("invitación"), ""),
    '<section id="dresscode" class="sec sec--surface">': (ink("dress code"), adr("dress code")),
    '<section id="rsvp" class="sec sec--bg">': (ink("RSVP"), ""),
    '<section id="familia" class="sec satin satin--champ">': ("", adr("familias")),
    '<section id="regalos" class="sec satin satin--champ">': ("", adr("sobres")),
}
for tag, (i, a_) in plan.items():
    once(tag)
    new = tag.replace('class="', 'class="ink-sec ', 1) if i else tag
    s = s.replace(tag, new + ("\n    " + i if i else "") + ("\n    " + a_ if a_ else ""))

# JS al final
js = "".join("<script>\n" + body(f) + "\n</script>\n" for f in
             ["E-luz-config.js", "E-luz.js", "D-brillo.js", "D-itinerario.js", "D-21st.js"])
once("</body>")
s = s.replace("</body>", js + "</body>")
P.write_text(s, encoding="utf8")
print("OK", len(s))
