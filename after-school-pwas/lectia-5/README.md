# Lecția 5 PWA — Cum fac povestea interesantă?

Aplicație statică offline pentru copii de 8–9 ani, construită din documentul \x60C:\Users\Radu\Downloads\lectia5.docx\x60.

## Conținut

- povestea „Ce era în spatele ușii?” și quiz de înțelegere cu 5 întrebări;
- descriere simplă vs. interesantă, adjective și sunete;
- alegerea emoțiilor și activități „arată, nu spune”;
- asocierea replicilor cu Max/Lia cu drag-and-drop și fallback touch/click;
- completarea dialogului, transformarea scenei, scena proprie de 5–7 propoziții și insigna „Maestrul cuvintelor”.

Răspunsurile sunt salvate local în \x60localStorage\x60 sub cheia \x60after-school-lesson-5-v1\x60. Aplicația acceptă linkuri de forma \x60?step=7\x60, funcționează offline după prima încărcare și poate fi instalată ca PWA.

## Testare locală

Din acest director:

~~~powershell
python -m http.server 4175
~~~

Deschide \x60http://localhost:4175/?step=1\x60. Pentru testare offline, încarcă pagina o dată, apoi oprește serverul sau folosește DevTools → Network → Offline și reîncarcă. Testează și în portret și landscape pe tabletă.

## Fișiere

\x60index.html\x60, \x60styles/style.css\x60, \x60app.js\x60, \x60manifest.json\x60, \x60sw.js\x60 și \x60icon.svg\x60 sunt autonome și nu cer biblioteci externe.

