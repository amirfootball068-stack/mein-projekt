# WENDEPUNKT Starter-Projekt – Arbeitsregeln für Claude

Dieses Projekt baut kurze Hochkant-Videos (1080 × 1920, 30 fps) mit Remotion.
Die Person, mit der du arbeitest, programmiert nicht. Du schreibst den Code, sie gibt die Richtung vor.
Antworte auf Deutsch, kurz und ohne Fachchinesisch. Erkläre nur, was sie wissen muss, um weiterzumachen.

## Ordner

- `Stimme/` – hier legt die Person ihr gekürztes Voice-Over ab (mp3 oder wav).
- `src/video/MeinVideo.tsx` – IHR Video. Hier baust du.
- `src/video/szenenplan.md` – Szenenplan (eine Zeile im Skript = eine Szene).
- `src/video/zeitstempel.json` – Wort-Zeitstempel (entsteht mit `npm run zeitstempel`).
- `src/bausteine/` – Figur, Sternenhimmel, Kamera, Zähler, Münze, Sockel, Leuchten, Geräusche.
- `src/beispiel/EinProzent.tsx` – das Beispielvideo aus dem Kurs. Gute Vorlage, wie alles zusammenspielt.
- `public/sounds/` – Sound-Paket (frei verwendbar, alle selbst erzeugt).
- `Ausgabe/` – fertige Videos und Standbilder.
- `stil.md` – Stil-Dokument der Person (Figur, Farben, Hintergrund, Schrift). Halte dich immer daran.

## Befehle

| Satz der Person | Was du tust |
|---|---|
| „Richte das Projekt ein und rendere das Testbild.“ | `npm install`, dann `npm run testbild`. Danach sagen, wo die Datei liegt (`Ausgabe/testbild.mp4`) und dass sie die Figur unter dem Sternenhimmel sehen sollte. Bei Fehlern selbst beheben (z. B. fehlendes Node.js erklären). |
| „Erstelle die Wort-Zeitstempel für mein Voice-Over.“ | `npm run zeitstempel`. Danach kurz die ersten Wörter mit Zeiten zeigen. |
| „Bau die ersten zehn Sekunden …“ | Nach Szenenplan bauen, dann `npm run standbild -- <Sekunden>` für 3–5 Stellen und die Bilder zeigen. Erst wenn die Person zufrieden ist: `npm run vorschau`. |
| „Leg passende Geräusche aus dem Sound-Paket auf die Aktionen.“ | Für jede Aktion im Szenenplan genau ein Geräusch mit `<Geraeusch name="…" bei={wort("…")} />`. |
| „Mach den Master-Export.“ | `npm run master`. Ergebnis: `Ausgabe/MeinVideo_master.mp4`. |

## Arbeitsweise

1. **In Stücken von zehn Sekunden bauen.** Nie das ganze Video auf einmal.
2. **Erst Standbilder, dann Video.** Standbilder sind schnell. Ein ganzes Video zu rendern dauert Minuten.
3. **Feedback genau umsetzen.** Die Person nennt Wort, Zeit und Bewegung. Setz genau das um, nichts anderes nebenbei.
4. Nach jeder Änderung sagen, was sich geändert hat (ein Satz) und welche Stelle sie prüfen soll.

## Regeln für jedes Video

- **Jede Aktion sitzt auf einem Wort.** Zeiten immer über `wort("…")` aus den Zeitstempeln, nie geschätzt.
- **Das erste neue Bild nach höchstens zwei Sekunden.**
- **Etwa alle zwei bis drei Sekunden eine neue Einstellung** (nah, halbnah, Totale). Kein Bild länger als drei Sekunden gleich.
- **Die Welt bewegt sich, nicht nur die Figur.** Dinge fallen, rollen, leuchten, Zähler laufen. Eine Figur, die nur hüpft, wirkt billig.
- **Untertitel Wort für Wort.** Jedes gesprochene Wort erscheint einzeln genau auf seinem Wort-Zeitstempel (unten, bei etwa 78 % der Bildhöhe, fett, weicher Schatten) und verschwindet beim nächsten Wort. Etwa ein Schlüsselwort pro Satz farbig. Ganze Sätze nie auf einmal als große Schrift. Kleine Wörter in der Welt (Schild, Etikett, Zähler) sind zusätzlich gut.
- **Hintergrund pechschwarz** (`#000000`), wenige Farben, eine Figur in allen Videos.
- **Letztes Bild = erstes Bild**, damit das Video nahtlos in Schleife läuft.
- **Gefühle ohne Gesicht:** kippen = Zweifel, hüpfen = begreift, zittern = Angst, stauchen = Druck, umfallen = aufgeben, Lichtpunkt dunkel = verliert.

## Ton

- Die Stimme ist das Wichtigste. Geräusche leise (Lautstärke 0,15–0,4), eher gefühlt als gehört.
- Musik (falls im Projekt) etwa 18 dB unter der Stimme. Fertiger Mix um −14 LUFS.
- **Nie fremde Musik ins Video einbauen.** Musik wählt die Person erst beim Hochladen in der TikTok-App.

## Export

- Vorschau: `npm run vorschau` (schnell, JPG-Zwischenbilder).
- Fertig: `npm run master` (PNG-Zwischenbilder, CRF 8, x264 slow, BT.709). Diese Datei wird hochgeladen.

## Kamera-Tabelle

`[Sekunde, Zoom, x, y]` – Zoom 1 = ganze Bühne, 2 = nah, 0,5 = Totale. x/y = Punkt der Welt in der Bildmitte.
Zwei Zeilen mit fast gleicher Sekunde = harter Schnitt. Zwischen Zeilen fährt die Kamera weich.
