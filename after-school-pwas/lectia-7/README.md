# Lecția 7 – Povestea mea

Aplicație PWA statică pentru lecția finală de creație și prezentare (copii 8–9 ani). Conținutul este transpus din `C:\Users\Radu\Downloads\lectia7.docx`.

## Ce include

- introducerea „Astăzi ești autor!” și obiectivele lecției;
- recapitularea tuturor elementelor (personaj, lume, aventură și final), cu completare locală și încercare de preluare a ideilor salvate de alte lecții;
- testul cu 9 bife „Am tot ce îmi trebuie?” și feedback de pregătire;
- exemplu de titlu, tipuri de titlu, titlu propriu și alegerea titlului care trezește curiozitatea;
- constructor pentru început, problemă, aventură, moment important, emoție, dialog, final și ultim detaliu;
- câmp mare pentru povestea completă (8–15 propoziții recomandate);
- verificare de autor cu 8 criterii;
- copertă digitală (stil + element principal), prezentare scurtă și înregistrare audio opțională prin `MediaRecorder`;
- misiunea finală „Eu sunt autor!” și diploma „Autor de povești”;
- deep-link-uri de forma `?step=cover`, progres și salvare automată în `localStorage`.

Textele creative sunt mereu răspunsuri libere și nu sunt marcate „greșit”. Feedback-ul corect/încearcă din nou este rezervat exemplelor cu variante (titlu și curiozitate). Audio-ul este ținut în memoria sesiunii browserului și nu este încărcat nicăieri.

## Rulare locală

Din `C:\Codex\after-school-pwas`:

```powershell
py -m http.server 4176
```

Deschide `http://127.0.0.1:4176/lectia-7/?step=start`. Pentru service worker este necesar HTTP(S), nu `file://`.

## Verificare

Verificare statică executată la 21.09.2026: server HTTP local, încărcare deep-link, navigare între toate cele 20 de ecrane, completare și reîncărcare cu persistență `localStorage`, precum și verificarea registrării service worker-ului. Layout-ul a fost verificat în portrait și landscape de tabletă; câmpurile mari și butoanele rămân accesibile fără suprapuneri.

