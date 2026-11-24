// Standbilder an bestimmten Sekunden – schneller als ein ganzes Video.
// Aufruf: npm run standbild -- 1.5 3 4.2        (Sekunden)
//         npm run standbild -- 1.5 3 --komposition=EinProzent
import path from "node:path";
import fs from "node:fs";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";

const args = process.argv.slice(2);
const id = (args.find((a) => a.startsWith("--komposition=")) || "--komposition=MeinVideo").split("=")[1];
const sekunden = args.filter((a) => !a.startsWith("--")).map(Number).filter((n) => !Number.isNaN(n));
if (!sekunden.length) {
  console.error("Bitte Sekunden angeben, z. B.: npm run standbild -- 1.5 3 4.2");
  process.exit(1);
}
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts")});
const composition = await selectComposition({serveUrl, id});
fs.mkdirSync("Ausgabe/standbilder", {recursive: true});
for (const s of sekunden) {
  const frame = Math.min(composition.durationInFrames - 1, Math.max(0, Math.round(s * composition.fps)));
  const ziel = `Ausgabe/standbilder/${id}_${s.toFixed(2).replace(".", "-")}s.png`;
  await renderStill({composition, serveUrl, output: ziel, frame});
  console.log("Standbild:", ziel);
}
