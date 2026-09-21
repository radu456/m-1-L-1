# Fabrica de idei · Lecția 1

Aplicație PWA statică pentru atelierul de scriere creativă din documentul `Lectia 1.docx`. Este gândită pentru tablete folosite în after school: butoane mari pentru atingere, font sans-serif lizibil, focus vizibil pentru tastatură, navigare pe pași și răspunsuri păstrate local pe dispozitiv.

## Conținut inclus

- povestea „Fabrica de idei”, cu formulările și exemplele din lecție;
- quiz cu cele șapte întrebări de înțelegere;
- jocul „De unde vin ideile?” cu selecție multiplă și feedback;
- „Detectivul ideilor”, cu cele trei situații;
- „Amestecă și creează!” (personaj + loc + situație), generator de propoziție și continuare liberă;
- „Ideea trăsnită”, cu selecție de exact două elemente și câmp pentru poveste;
- salvare automată în `localStorage`, inclusiv după reîncărcarea paginii;
- deep-link-uri de tip `?step=quiz`, `?step=mix` etc.;
- service worker pentru cache offline și manifest instalabil.

## Rulare locală

Din acest director, pornește un server static (service worker-ul nu se activează prin `file://`):

```powershell
python -m http.server 4171
```

Deschide `http://localhost:4171/?step=welcome`. Pentru un cod QR, folosește URL-ul public al folderului după publicarea pe GitHub Pages.

## Verificare

Fișierele sunt autonome și nu au dependențe externe. Verifică manual în browser pașii, variantele de quiz, salvarea textului și reîncărcarea offline după prima vizită. Nu am publicat încă repository-ul și nu am generat link GitHub Pages în această etapă.

Limitare intenționată: instalarea PWA este oferită de browser (butonul apare când browserul emite `beforeinstallprompt`; altfel este afișată instrucțiunea din meniul browserului). Răspunsurile nu sunt sincronizate între tablete sau către un server.

