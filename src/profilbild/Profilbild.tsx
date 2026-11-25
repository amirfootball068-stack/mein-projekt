import React from "react";
import {AbsoluteFill} from "remotion";
import {FARBE, Schriften} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {Welt} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden, Leuchten} from "../bausteine/Welt";
import {ACAI, BODEN, BX, Becher, FX, GOLD, RAND, TOP, schicht, toppings} from "../video/MeinVideo";

/** Profilbild (1080 x 1080): Figur + Becher mit Toppings, mittig fuer den runden Ausschnitt */
export const Profilbild: React.FC = () => {
  const kam = {zoom: 1.8, x: 615, y: 1330};
  const t = 100; // alle Toppings liegen schon
  const funkeln = [
    [BX + 30, RAND - 115, 22],
    [BX - 150, RAND - 70, 15],
    [FX - 40, BODEN - 280, 11],
  ];
  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={2} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam} breite={1080} hoehe={1080}>
        <Boden y={BODEN} />
        <Leuchten x={BX} y={RAND + 40} r={330} staerke={0.16} />
        <Leuchten x={FX} y={BODEN - 100} r={200} staerke={0.08} />
        <Becher bx={BX} innen={schicht("acai", BX, TOP, BODEN, ACAI, 1.5, 0)} oben={<>{toppings(t, BX)}</>} />
        <Figur x={FX + 20} y={BODEN} t={0.7} hoehe={230} blick={0.7} kippen={-4} />
        <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {funkeln.map(([x, y, r], i) => (
            <path
              key={i}
              d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`}
              fill={i === 0 ? GOLD : FARBE.figur}
              style={{filter: "drop-shadow(0 0 10px rgba(232,176,74,0.8))"}}
            />
          ))}
        </svg>
      </Welt>
    </AbsoluteFill>
  );
};
