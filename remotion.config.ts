import {Config} from "@remotion/cli/config";

// Vorschau-Renders: schnell. Der Master-Export (npm run master) setzt eigene, verlustarme Werte.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setColorSpace("bt709");
