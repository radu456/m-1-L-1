# Atelierul de povești

Panou PWA pentru cele opt lecții interactive de scriere creativă din after school. Fiecare lecție este un mini-site static în propriul director (`lectia-1` … `lectia-8`) și poate fi deschisă direct printr-un cod QR.

## Utilizare

Deschide `index.html` printr-un server HTTPS (GitHub Pages este potrivit pentru service worker), alege lecția sau scanează codul QR al lecției. Aplicațiile salvează răspunsurile în browserul tabletei și au fallback pentru atingere, mouse și tastatură.

## Rute QR

Panoul generează automat codul QR pentru adresa fiecărei aplicații. Într-o instalare GitHub Pages, rutele sunt:

| Lecție | Link direct |
| --- | --- |
| 1 | `lectia-1/` |
| 2 | `lectia-2/` |
| 3 | `lectia-3/` |
| 4 | `lectia-4/` |
| 5 | `lectia-5/` |
| 6 | `lectia-6/` |
| 7 | `lectia-7/` |
| 8 | `lectia-8/` |

Fiecare aplicație acceptă și `?step=...` pentru un afiș care trebuie să deschidă un pas anume. Dacă elevul revine fără parametru, progresul local al lecției poate fi reluat pe aceeași tabletă.

## Verificare locală

Din acest director poate fi folosit orice server static, de exemplu `python -m http.server 4178`, apoi `http://localhost:4178/`. Pentru PWA și service worker este necesar HTTPS sau `localhost`.

