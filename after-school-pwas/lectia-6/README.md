# Lecția 6 – Construim povestea

Aplicație PWA statică pentru lecția „Construim povestea” (copii 8–9 ani). Conținutul este transpus din `C:\Users\Radu\Downloads\lectia 6.docx`.

## Ce include

- povestea „Drumul lui Max” și obiectivele lecției;
- cinci întrebări de înțelegere cu feedback imediat;
- puzzle-ul celor patru piese ale unei povești;
- ordonarea evenimentelor prin drag-and-drop și butoane mari pentru touch/keyboard;
- sortarea a șase propoziții în început, mijloc, moment important sau final;
- activitatea „Ce lipsește?” cu răspunsuri multiple;
- alegerea momentului important (variantele 1, 4 și 5);
- cinci câmpuri creative pentru construirea momentului important;
- alegerea/inventarea soluției pentru podul rupt și justificarea ei;
- recapitulare, progres local și linkuri deep-link de forma `?step=ordine`.

Datele sunt salvate numai în `localStorage` pe tabletă. Răspunsurile creative nu sunt marcate ca greșite; feedback-ul de tip corect/încearcă din nou este folosit doar pentru întrebările cu variante și sortare.

## Rulare locală

Din directorul `C:\Codex\after-school-pwas`:

```powershell
py -m http.server 4176
```

Apoi deschide `http://127.0.0.1:4176/lectia-6/?step=start`. Pentru PWA/service worker este necesar HTTP(S), nu `file://`.

## Verificare

Verificare statică executată la 21.09.2026: server HTTP local, încărcare `?step=start`, navigare înainte/înapoi, completarea unui răspuns și persistența în `localStorage`, precum și registrarea service worker-ului. Verificarea vizuală a fost făcută la dimensiuni tabletă portrait și landscape; cardurile rămân în flux și nu se suprapun.

