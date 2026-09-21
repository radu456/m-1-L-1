# Lecția 2 – Cine este personajul meu?

PWA statică pentru modulul de scriere creativă (8–9 ani, 30–40 minute), construită din documentul `C:\Users\Radu\Downloads\lectia2.docx`.

## Conținut

- povestea „Personajul prinde viață” și quiz-ul cu 5 întrebări;
- joc de alegere a 3–5 trăsături;
- sortare „Calitate sau defect?” cu drag-and-drop și alternativă touch;
- dorință, teamă și cinci dialoguri cu răspunsuri libere;
- „Ghicește personajul” și portretul final cu nume, tip, trăsături, preferințe, teamă și dorință.

Răspunsurile sunt păstrate local în cheia `after-school-lectia-2-v1`; cheia `after-school-lectia-2-story` este rezervată pentru progresul poveștii și compatibilitatea cu navigarea dintre lecții. URL-ul acceptă `?step=story`, `quiz`, `traits`, `quality`, `wish`, `fear`, `dialogues` sau `portrait`.

## Rulare și limite

Din acest director rulează un server static, de exemplu `python -m http.server 4172`, apoi deschide `http://localhost:4172/`. Service worker-ul funcționează numai prin HTTP(S), nu prin `file://`. Nu există sincronizare în cloud, conturi sau evaluare automată a răspunsurilor creative. Sortarea poate fi făcută prin atingere pe cuvânt (îl mută alternativ) sau prin drag-and-drop.

