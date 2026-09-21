# Lecția 4 PWA — Ce se întâmplă?

Aplicație statică offline pentru copii de 8–9 ani, construită din documentul \x60C:\Users\Radu\Downloads\lectia4.docx\x60.

## Conținut

- povestea „Ușa s-a deschis” și quiz de înțelegere cu 5 întrebări;
- recunoașterea situațiilor care pot porni o aventură;
- alegerea misiunii și potrivirea problemelor cu misiunile (A→4, B→2, C→3, D→1, E→5);
- alegerea obstacolelor, soluțiilor și reacției personajului;
- câmpuri pentru problema și reacția din povestea proprie, cu preluare tolerantă a personajului din lecțiile anterioare.

Răspunsurile sunt salvate local în \x60localStorage\x60 sub cheia \x60after-school-lesson-4-v1\x60. Aplicația acceptă linkuri de forma \x60?step=5\x60, funcționează offline după prima încărcare și poate fi instalată ca PWA.

## Testare locală

Din acest director:

~~~powershell
python -m http.server 4174
~~~

Deschide \x60http://localhost:4174/?step=1\x60. Pentru testare offline, încarcă pagina o dată, apoi oprește serverul sau folosește DevTools → Network → Offline și reîncarcă. Testează și în portret și landscape pe tabletă.

## Fișiere

\x60index.html\x60, \x60styles/style.css\x60, \x60app.js\x60, \x60manifest.json\x60, \x60sw.js\x60 și \x60icon.svg\x60 sunt autonome și nu cer biblioteci externe.

