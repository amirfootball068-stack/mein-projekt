import React from "react";
import {Kam} from "./Kamera";
import {zufall} from "../stil";

/**
 * Sternenhimmel mit Tiefe (Parallaxe): drei Ebenen. Ferne Sterne bewegen sich kaum,
 * nahe Sterne bewegen sich staerker mit der Kamera. So wirkt jede Kamerafahrt raeumlich.
 */
const EBENEN = [
  {anzahl: 170, tiefe: 0.06, groesse: 1.3, hell: 0.45},
  {anzahl: 90, tiefe: 0.16, groesse: 2.0, hell: 0.7},
  {anzahl: 34, tiefe: 0.32, groesse: 2.9, hell: 0.95},
];
const B = 1080;
const H = 1920;
const FELD = 2600; // Kachelgroesse, die sich wiederholt

export const Sternenhimmel: React.FC<{t: number; kam: Kam; ruhe?: {x: number; y: number}; deckkraft?: number}> = ({
  t,
  kam,
  ruhe = {x: 540, y: 960},
  deckkraft = 1,
}) => (
  <svg width={B} height={H} style={{position: "absolute", left: 0, top: 0, opacity: deckkraft}}>
    {EBENEN.map((e, ei) => {
      const s = 1 + (kam.zoom - 1) * e.tiefe * 1.5;
      const dx = -(kam.x - ruhe.x) * e.tiefe * kam.zoom;
      const dy = -(kam.y - ruhe.y) * e.tiefe * kam.zoom;
      const sterne = [];
      for (let i = 0; i < e.anzahl; i++) {
        const k = ei * 1000 + i;
        let x = zufall(k) * FELD + dx;
        let y = zufall(k + 0.5) * FELD + dy;
        x = ((x % FELD) + FELD) % FELD - (FELD - B) / 2;
        y = ((y % FELD) + FELD) % FELD - (FELD - H) / 2;
        x = B / 2 + (x - B / 2) * s;
        y = H / 2 + (y - H / 2) * s;
        if (x < -10 || x > B + 10 || y < -10 || y > H + 10) continue;
        const funkeln = 0.65 + 0.35 * Math.sin(t * (0.8 + zufall(k + 0.2) * 2.2) + zufall(k + 0.7) * 6.28);
        sterne.push(<circle key={k} cx={x} cy={y} r={e.groesse * (0.6 + zufall(k + 0.3) * 0.7)} fill="#F2F2F0" opacity={e.hell * funkeln} />);
      }
      return <g key={ei}>{sterne}</g>;
    })}
  </svg>
);
