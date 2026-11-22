import React from "react";
import {Easing, interpolate, staticFile} from "remotion";

/** Farben – im Stil-Dokument festlegen und hier eintragen. Wenige Farben wirken hochwertiger. */
export const FARBE = {
  hintergrund: "#000000", // Pechschwarz, nicht Dunkelgrau
  figur: "#F2F2F0",
  akzent: "#F2F2F0",
  grau: "#8C8C89",
  linie: "rgba(242,242,240,0.25)",
};

export const SCHRIFT = "'Space Grotesk', sans-serif";
export const MONO = "'IBM Plex Mono', monospace";
export const LEUCHTEN = "0 0 22px rgba(242,242,240,0.45)";

export const Schriften: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Space Grotesk'; src: url('${staticFile("fonts/space-grotesk-latin-400-normal.woff2")}') format('woff2'); font-weight: 400; }
    @font-face { font-family: 'Space Grotesk'; src: url('${staticFile("fonts/space-grotesk-latin-500-normal.woff2")}') format('woff2'); font-weight: 500; }
    @font-face { font-family: 'Space Grotesk'; src: url('${staticFile("fonts/space-grotesk-latin-600-normal.woff2")}') format('woff2'); font-weight: 600; }
    @font-face { font-family: 'Space Grotesk'; src: url('${staticFile("fonts/space-grotesk-latin-700-normal.woff2")}') format('woff2'); font-weight: 700; }
    @font-face { font-family: 'IBM Plex Mono'; src: url('${staticFile("fonts/ibm-plex-mono-latin-400-normal.woff2")}') format('woff2'); font-weight: 400; }
  `}</style>
);

export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** weich von 0 auf 1 zwischen t0 und t0 + d */
export const ein = (t: number, t0: number, d = 0.4) =>
  interpolate(t, [t0, t0 + d], [0, 1], {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)});

/** weich von 1 auf 0 */
export const aus = (t: number, t0: number, d = 0.35) => 1 - ein(t, t0, d);

/** weicher Uebergang mit Anlauf und Auslauf (fuer Kamerafahrten) */
export const weich = (t: number, t0: number, t1: number) =>
  interpolate(t, [t0, t1], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});

/** kleine, wiederholbare Zufallszahl (gleiches Ergebnis bei jedem Render) */
export const zufall = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
