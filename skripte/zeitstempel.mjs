// Wort-Zeitstempel fuer dein Voice-Over.
// 1. Leg dein gekuerztes Voice-Over (mp3 oder wav) in den Ordner "Stimme".
// 2. npm run zeitstempel
// Ergebnis: src/video/zeitstempel.json (jedes Wort mit Start und Ende in Sekunden)
//           Stimme/zeitstempel.txt   (zum Nachlesen)
// Beim ersten Mal wird Whisper (Spracherkennung, laeuft lokal auf deinem Rechner) einmalig heruntergeladen.
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from "@remotion/install-whisper-cpp";

const VERSION = "1.5.5";
const MODELL = process.env.WHISPER_MODELL || "small"; // "medium" ist genauer, aber langsamer
const WHISPER = path.resolve(".whisper");
const shell = process.platform === "win32";

const run = (args) => {
  const r = spawnSync("npx", args, {encoding: "utf8", shell});
  if (r.status !== 0) throw new Error(`Fehler bei: npx ${args.join(" ")}\n${r.stderr}`);
  return r.stdout;
};

const dateien = fs
  .readdirSync("Stimme")
  .filter((d) => /\.(mp3|wav|m4a)$/i.test(d))
  .map((d) => ({d, zeit: fs.statSync(path.join("Stimme", d)).mtimeMs}))
  .sort((a, b) => b.zeit - a.zeit);
if (!dateien.length) {
  console.error('Keine Audiodatei im Ordner "Stimme" gefunden. Leg dort dein gekuerztes Voice-Over ab (mp3 oder wav).');
  process.exit(1);
}
const quelle = path.join("Stimme", dateien[0].d);
console.log("Voice-Over:", quelle);

// fuer Remotion bereitstellen
const endung = path.extname(quelle).toLowerCase();
fs.mkdirSync("public/stimme", {recursive: true});
const ziel = `stimme/voiceover${endung}`;
fs.copyFileSync(quelle, path.join("public", ziel));

// 16 kHz Mono fuer die Spracherkennung
fs.mkdirSync(WHISPER, {recursive: true});
const wav16 = path.join(WHISPER, "eingabe_16k.wav");
run(["remotion", "ffmpeg", "-y", "-v", "error", "-i", quelle, "-ar", "16000", "-ac", "1", wav16]);
const dauer = parseFloat(run(["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", quelle]).trim());

console.log("Whisper wird vorbereitet (beim ersten Mal dauert das ein paar Minuten) ...");
await installWhisperCpp({to: WHISPER, version: VERSION, printOutput: false});
await downloadWhisperModel({model: MODELL, folder: WHISPER, printOutput: true});

console.log("Erkenne Woerter ...");
const ergebnis = await transcribe({
  inputPath: wav16,
  whisperPath: WHISPER,
  whisperCppVersion: VERSION,
  model: MODELL,
  tokenLevelTimestamps: true,
  language: "de",
  splitOnWord: true,
});
const {captions} = toCaptions({whisperCppOutput: ergebnis});
const woerter = captions
  .map((c) => ({wort: c.text.trim(), von: +(c.startMs / 1000).toFixed(3), bis: +(c.endMs / 1000).toFixed(3)}))
  .filter((w) => w.wort && !/^\[.*\]$/.test(w.wort));

fs.writeFileSync("src/video/zeitstempel.json", JSON.stringify({datei: ziel, dauer: +dauer.toFixed(3), woerter}, null, 0));
fs.writeFileSync(
  path.join("Stimme", "zeitstempel.txt"),
  woerter.map((w) => `${w.von.toFixed(2).padStart(7)}  ${w.wort}`).join("\n") + "\n",
);
console.log(`Fertig: ${woerter.length} Woerter, ${dauer.toFixed(1)} s → src/video/zeitstempel.json`);
console.log("Pruef die Liste in Stimme/zeitstempel.txt. Falsch erkannte Woerter sind kein Problem: die Zeiten stimmen trotzdem.");
