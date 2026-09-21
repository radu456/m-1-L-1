# Lecția 3 PWA — Unde și când se întâmplă?

Aplicație statică offline pentru copii de 8–9 ani, construită din documentul \x60C:\Users\Radu\Downloads\lectia3.docx\x60.

## Conținut

- povestea „Ușa care nu era acolo” și quiz de înțelegere cu 5 întrebări;
- alegerea decorului și a momentului zilei;
- sortare decor real / fantastic cu drag-and-drop, plus fallback prin selectare și atingere;
- detalii senzoriale (ce vede, aude și simte), decor trăsnit și detectivul decorului;
- construirea decorului personajului și descrierea lumii în 3–5 propoziții.

Răspunsurile sunt salvate local în \x60localStorage\x60 sub cheia \x60after-school-lesson-3-v1\x60. Aplicația acceptă linkuri de forma \x60?step=4\x60, funcționează offline după prima încărcare și poate fi instalată ca PWA.

## Testare locală

Din acest director:

~~~powershell
python -m http.server 4173
~~~

Deschide \x60http://localhost:4173/?step=1\x60. Pentru testare offline, încarcă pagina o dată, apoi oprește serverul sau folosește DevTools → Network → Offline și reîncarcă. Testează și în portret și landscape pe tabletă.

## Fișiere

\x60index.html\x60, \x60styles/style.css\x60, \x60app.js\x60, \x60manifest.json\x60, \x60sw.js\x60 și \x60icon.svg\x60 sunt autonome și nu cer biblioteci externe.

