import React from "react";
import {Easing, interpolate} from "remotion";
import {clamp} from "../stil";

/**
 * Kamera-Tabelle: [Sekunde, Zoom, x, y]
 *   Zoom 1 = Bild so gross wie die Buehne (1080 x 1920), 2 = nah, 0.5 = Totale
 *   x, y  = Punkt der Welt, der in der Bildmitte steht
 * Zwischen zwei Zeilen faehrt die Kamera weich (Anlauf und Auslauf).
 * Zwei Zeilen mit fast gleicher Zeit (z. B. 4.00 und 4.01) = harter Schnitt.
 */
export type KameraZeile = [number, number, number, number];

export const kameraBei = (t: number, tabelle: KameraZeile[]) => {
  if (t <= tabelle[0][0]) return {zoom: tabelle[0][1], x: tabelle[0][2], y: tabelle[0][3]};
  for (let i = 0; i < tabelle.length - 1; i++) {
    const [t0, z0, x0, y0] = tabelle[i];
    const [t1, z1, x1, y1] = tabelle[i + 1];
    if (t >= t0 && t <= t1) {
      const p = interpolate(t, [t0, t1], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});
      // Zoom logarithmisch mischen, damit Zoomfahrten gleichmaessig wirken
      const zoom = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * p);
      return {zoom, x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p};
    }
  }
  const l = tabelle[tabelle.length - 1];
  return {zoom: l[1], x: l[2], y: l[3]};
};

export type Kam = ReturnType<typeof kameraBei>;

/** Alles innerhalb von <Welt> bewegt sich mit der Kamera. */
export const Welt: React.FC<{kam: Kam; children: React.ReactNode; breite?: number; hoehe?: number}> = ({kam, children, breite = 1080, hoehe = 1920}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: breite,
      height: hoehe,
      transformOrigin: "0 0",
      transform: `translate(${breite / 2}px, ${hoehe / 2}px) scale(${kam.zoom}) translate(${-kam.x}px, ${-kam.y}px)`,
    }}
  >
    {children}
  </div>
);
