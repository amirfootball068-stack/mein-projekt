// Master-Export: jedes Bild verlustfrei (PNG), das Video wird genau einmal kodiert.
// Aufruf: npm run master   (oder: node skripte/master.mjs <Komposition>)
import {spawnSync} from "node:child_process";
import {mkdirSync} from "node:fs";

const id = process.argv[2] || "MeinVideo";
const extra = process.argv.slice(3);
mkdirSync("Ausgabe", {recursive: true});
const ziel = `Ausgabe/${id}_master.mp4`;
const args = [
  "remotion", "render", id, ziel,
  "--image-format=png",      // keine JPG-Zwischenbilder
  "--codec=h264",
  "--crf=8",                 // sehr hohe Qualitaet (TikTok kodiert sowieso noch einmal)
  "--x264-preset=slow",
  "--pixel-format=yuv420p",
  "--color-space=bt709",
  "--audio-codec=aac",
  "--audio-bitrate=320k",
  ...extra,
];
console.log("Master-Export:", ziel);
const r = spawnSync("npx", args, {stdio: "inherit", shell: process.platform === "win32"});
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`\nFertig: ${ziel}\nDiese Datei laedst du hoch (am besten per WLAN, mit "Uploads in hoher Qualitaet").`);
