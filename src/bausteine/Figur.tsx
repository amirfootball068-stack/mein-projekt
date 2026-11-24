import React from "react";
import {FARBE} from "../stil";

/**
 * PLATZHALTER-FIGUR. Ersetze sie durch deine eigene Figur aus Lektion 2
 * (Claude kann die SVG-Form hier austauschen, die Gefuehle bleiben gleich).
 *
 * Gefuehle ohne Gesicht – nur durch Bewegung:
 *   kippen   Grad, z. B. -8   → zweifelt
 *   huepfen  Pixel nach oben  → begreift etwas / freut sich
 *   zittern  0..1             → Angst
 *   stauchen 0..1             → Druck
 *   umfallen 0..1             → gibt auf
 *   blick    -1..1            → Lichtpunkt schaut nach links / rechts
 *   licht    0..1             → Lichtpunkt wird dunkel, wenn sie verliert
 */
export type FigurProps = {
  x: number;
  y: number; // Fusspunkt (Boden unter der Figur)
  t: number;
  hoehe?: number;
  kippen?: number;
  huepfen?: number;
  zittern?: number;
  stauchen?: number;
  umfallen?: number;
  blick?: number;
  licht?: number;
  deckkraft?: number;
};

export const Figur: React.FC<FigurProps> = ({
  x,
  y,
  t,
  hoehe = 200,
  kippen = 0,
  huepfen = 0,
  zittern = 0,
  stauchen = 0,
  umfallen = 0,
  blick = 0,
  licht = 1,
  deckkraft = 1,
}) => {
  const b = hoehe * 0.42; // Breite
  const zx = zittern * 3.2 * Math.sin(t * 61) + zittern * 2 * Math.sin(t * 37);
  const sy = 1 - 0.22 * stauchen;
  const sx = 1 + 0.16 * stauchen;
  const dreh = kippen + umfallen * 88;
  // leichtes Atmen, damit die Figur nie ganz einfriert
  const atmen = 1 + 0.012 * Math.sin(t * 2.1);
  return (
    <div
      style={{
        position: "absolute",
        left: x - b / 2 + zx,
        top: y - hoehe - huepfen,
        width: b,
        height: hoehe,
        opacity: deckkraft,
        transformOrigin: "50% 100%",
        transform: `rotate(${dreh}deg) scale(${sx}, ${sy * atmen})`,
      }}
    >
      <svg width={b} height={hoehe} viewBox="0 0 84 200" style={{overflow: "visible"}}>
        <defs>
          <radialGradient id="punkt" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={licht} />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.55 * licht} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Koerper: einfache Kapsel */}
        <rect x="6" y="6" width="72" height="188" rx="36" fill={FARBE.figur} style={{filter: "drop-shadow(0 0 14px rgba(242,242,240,0.35))"}} />
        {/* dunkles Sichtfeld */}
        <rect x="18" y="38" width="48" height="22" rx="11" fill="#0b0b0b" />
        {/* Lichtpunkt (Blick) */}
        <circle cx={42 + blick * 13} cy="49" r="16" fill="url(#punkt)" />
        <circle cx={42 + blick * 13} cy="49" r="4.2" fill="#FFFFFF" opacity={0.15 + 0.85 * licht} />
      </svg>
    </div>
  );
};
