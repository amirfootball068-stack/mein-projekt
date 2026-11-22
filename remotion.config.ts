import {Config} from "@remotion/cli/config";
import fs from "node:fs";

// Cloud-Umgebung: vorinstallierten Browser nutzen (kein Download nötig). Auf dem eigenen Rechner ohne Wirkung.
const browser = "/opt/pw-browsers/chromium_headless_shell";
if (fs.existsSync(browser)) Config.setBrowserExecutable(browser);

// Vorschau-Renders: schnell. Der Master-Export (npm run master) setzt eigene, verlustarme Werte.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setColorSpace("bt709");
