# loeffelweise – „Die perfekte Açaí-Bowl – 4 Challenges“

Food-Entertainment, keine Werbung. Hochformat 9:16, Instagram Reels.

---

## 1. Wer macht was

| Schritt | Wer | Womit |
|---|---|---|
| Drehbuch, Voiceover-Text, Szenen-Prompts, ASMR-Plan, Caption, Hashtags | **Claude** | hier im Chat |
| Startbild (Referenz für den Look) | **Du** | Gemini-App (Bild) |
| Video-Clips (realistisch, Slow Motion, mit Geräuschen) | **Du** | Gemini-App (Veo) – Alternativen: Kling, Sora, Runway |
| Erzählerstimme | **Du** | ElevenLabs-App (gleiche Stimme wie bisher) |
| Schnitt, Untertitel Wort für Wort, Ton-Mischung, Lautstärke, Export 9:16 | **Claude** | Remotion im Projekt – du schickst Clips + Stimme |
| Posten / Einplanen | **Du** | Instagram-App (Reel „planen“) |

**Was Claude nicht kann:** realistische Videos oder Fotos erzeugen, Apps auf deinem iPhone bedienen, auf Instagram posten.
Wenn hier ein Prompt steht, ist das **nur ein Prompt** – das Video entsteht erst in der App.

---

## 2. Look-Bibel (gilt für ALLE Szenen und Folgen)

Diesen Block kopierst du **an das Ende jedes Prompts**, damit Schüssel, Tisch und Licht gleich bleiben:

> **STYLE:** vertical 9:16, ultra-realistic food commercial, macro close-up, 100mm lens, shallow depth of field, soft natural window light from the left, dark moody background, dark walnut wood table, matte black ceramic bowl, thick deep-violet açaí with a smooth creamy texture, fresh ripe ingredients, natural appetizing colors, no text, no logos, no people's faces

**Feste Zutaten (immer gleich aussehen):**
- Açaí: tiefviolett, dick, cremig, leicht glänzend
- Schüssel: matt schwarze Keramik, rund, mittelgroß
- Tisch: dunkles Walnussholz
- Toppings (je nach Folge): rote Erdbeeren mit grünem Grün, Blaubeeren, Bananenscheiben, goldenes Granola, Kokosflocken
- Licht: weiches Fensterlicht von links, dunkler Hintergrund

**Trick für gleichen Look:** Erst ein **Startbild** erzeugen (siehe unten), dann jeden Clip **aus diesem Bild** erzeugen („Bild zu Video“).

---

## 3. Folge 1 – „Strawberry Explosion“

Länge: ca. 20 Sekunden · 6 Einstellungen · Hook in der ersten Sekunde

### Voiceover (für ElevenLabs, ruhig und genießerisch gesprochen)

> Eine Erdbeere. Dann zehn. Dann alle.
> Challenge Nummer eins: die Strawberry Explosion.
> Gefrorenes Açaí, so dick gemixt, dass der Löffel stehen bleibt.
> Obendrauf frische Erdbeeren, Kokos und knuspriges Granola.
> Und jetzt … der erste Löffel.
> Würdest du sie probieren? In Folge zwei wird's richtig verrückt.

### Szenen

| # | Zeit | Bild | ASMR-Geräusch |
|---|---|---|---|
| 1 | 0–3 s | **Hook:** Erdbeere fällt in Zeitlupe in die Açaí-Schüssel, violetter Spritzer | dumpfes „Plopp“, feuchter Spritzer |
| 2 | 3–6 s | Gefrorene Açaí-Stücke werden im Mixer dick gemixt | Mixer, knackendes Eis |
| 3 | 6–9 s | Löffel steckt aufrecht in der dicken Masse, wird langsam gedreht | zähes, cremiges Schmatzen |
| 4 | 9–13 s | Erdbeeren werden auf dem Holzbrett geschnitten, Scheiben fächern sich auf die Bowl | Messer schneidet saftig |
| 5 | 13–16 s | Kokosflocken rieseln, Granola fällt darauf | Rieseln, Knuspern |
| 6 | 16–20 s | Erster Löffel hebt sich in Zeitlupe, Erdbeere und Granola obendrauf | Knirschen, leises „mmh“-Gefühl ohne Stimme |

### Prompts (jeweils + STYLE-Block anhängen)

**Startbild (Gemini, Bild):**
> A finished açaí bowl seen from a 45° angle: thick deep-violet açaí in a matte black ceramic bowl, topped with fanned fresh strawberry slices, a few whole strawberries, golden granola and coconut flakes, on a dark walnut wood table, a few strawberries scattered beside the bowl.

**Startbild:** ✅ erledigt → `serie/referenz/startbild_folge1.jpg`

**Szene 1 – Hook (Bild zu Video, Startbild hochladen):**
> Use the uploaded image as the first frame. Slow motion: a single ripe red strawberry falls from above into the smooth free açaí surface on the left side of the bowl, a small creamy violet splash rises and falls back, droplets glisten in the window light. Everything else stays exactly the same. Camera slowly pushes in, macro. Audio: one soft wet plop and a gentle creamy splash, quiet room, no music, no voice.

**Szene 1:** ✅ erledigt → `public/serie/folge1/szene1.mp4` (10 s, Ton 2,5–6 s, Spritzer bei ca. 3 s – im Schnitt ab ca. 1 s verwenden)

**Szene 2 – Mixer (Text zu Video, ohne Startbild):**
> Slow motion inside a blender: frozen dark-violet açaí chunks and a few frozen strawberries are blended into a very thick, creamy violet mass, the blade turns slowly through the dense texture. Camera close, slight push-in. Audio: powerful blender motor, crushing ice and frozen fruit, thick creamy churning, no music, no voice.

**Szene 2:** ✅ erledigt → `public/serie/folge1/szene2.mp4` (10 s, Zerkleinern 1,3–3,8 s, cremige Masse ab 4 s – im Schnitt ca. 2,5–3,5 s + 4–6 s)

**Szene 3 – Löffel steht (Text zu Video, ohne Startbild):**
> Close-up of the matte black ceramic bowl filled to the rim with plain, extremely thick deep-violet açaí, no toppings yet. A metal spoon stands upright in the açaí without falling. A hand enters, slowly turns the spoon once, the dense creamy texture curls around it, then the hand lets go and the spoon stays upright. Only the hand is visible. Camera static, macro. Audio: thick creamy squelch, soft spoon scrape on ceramic, no music, no voice.

**Szene 3:** ✅ erledigt → `public/serie/folge1/szene3.mp4` (10 s, Hand dreht 1,5–5 s, Löffel bleibt stehen ab ca. 6,5 s; Farbe etwas heller/rosa → im Schnitt an Szene 1 angleichen)

**Szene 4 – Erdbeeren schneiden (Text zu Video, ohne Startbild):**
> Macro close-up on a dark walnut wooden board: a sharp chef's knife slowly slices a ripe red strawberry with its green top into thin slices, juicy glistening cross-section, a drop of juice runs down. Only the hand holding the knife is visible. Slow motion, camera static. Audio: crisp juicy knife cuts on wood, quiet room, no music, no voice.

**Szene 5 – Toppings:**
> Slow motion: white coconut flakes snow down onto the strawberry-topped açaí bowl, then golden crunchy granola clusters fall and bounce lightly. Camera static, macro.

**Szene 6 – Erster Löffel:**
> Slow motion: a spoon lifts a perfect bite from the açaí bowl – thick violet açaí, a strawberry slice and granola on top, a few granola crumbs fall back. Camera follows the spoon up, shallow depth of field.

### Schnitt (macht Claude)
- Clips auf die Stimme schneiden, harte Schnitte auf betonte Wörter („Erdbeere“, „zehn“, „alle“, „Löffel“).
- Untertitel Wort für Wort, fett, weiß, Schlüsselwörter violett.
- ASMR-Geräusche aus den Clips behalten, Stimme klar darüber, Lautstärke −14 LUFS.
- Letzte Sekunde: Text „Folge 2 →“.

### Caption
> Challenge 1/4: die Strawberry Explosion 🍓💜
> Würdest du sie probieren? Schreib „🍓“ in die Kommentare!
> Folge 2 kommt in 3 Tagen …

**Hashtags:** #acaibowl #acai #foodasmr #asmrfood #erdbeeren #bowl #foodporn #fruehstueck #loeffelweise

**Kennzeichnung:** Beim Posten „KI-Info“ / „Mit KI erstellt“ einschalten (realistische KI-Videos).

---

## 4. Folgen 2–4 (kommen Schritt für Schritt)

- Folge 2: Die ungewöhnlichste Açaí-Kombination
- Folge 3: Günstig gegen teuer
- Folge 4: Die Community entscheidet (aus den Kommentaren von Folge 1–3)
