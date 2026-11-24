import React from "react";
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FARBE, Schriften} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {KameraZeile, Welt, kameraBei} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden} from "../bausteine/Welt";
import {woerterVon, Zeitstempel} from "../bausteine/zeit";
import ZS from "./zeitstempel.json";

/**
 * DEIN VIDEO. Hier baut Claude dein Video – Stueck fuer Stueck, je zehn Sekunden.
 *
 * So arbeitest du mit Claude (Details in CLAUDE.md):
 *  1. Voice-Over in den Ordner "Stimme" legen → "Erstelle die Wort-Zeitstempel fuer mein Voice-Over."
 *  2. Szenenplan in szenenplan.md schreiben (eine Zeile im Skript = eine Szene)
 *  3. "Bau die ersten zehn Sekunden nach dem Szenenplan und zeig mir Standbilder."
 *  4. Genaues Feedback: Wort, Zeit, Bewegung.
 */

const Z = ZS as Zeitstempel;
export const MEIN_VIDEO_DAUER = Math.max(3, Z.dauer + 0.6);
const {wort} = woerterVon(Z); // z. B. wort("besser") → Sekunde, in der "besser" beginnt

// Kamera-Tabelle: [Sekunde, Zoom, x, y]  (Zoom 1 = ganze Buehne, 2 = nah, 0.5 = Totale)
const KAMERA: KameraZeile[] = [
  [0, 1.2, 540, 1300],
  [MEIN_VIDEO_DAUER, 1.3, 540, 1320],
];

export const MeinVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const kam = kameraBei(t, KAMERA);
  void wort;
  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam}>
        <Boden y={1500} />
        <Figur x={540} y={1500} t={t} />
      </Welt>
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
