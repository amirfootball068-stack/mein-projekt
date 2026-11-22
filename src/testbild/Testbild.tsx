import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {FARBE, MONO, Schriften, ein} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {Welt, kameraBei} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden, Leuchten, Sockel} from "../bausteine/Welt";

/** Testbild: Wenn du die Figur unter dem Sternenhimmel siehst, ist alles bereit. */
export const Testbild: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const kam = kameraBei(t, [
    [0, 0.9, 540, 1150],
    [5, 1.3, 520, 1320],
  ]);
  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam}>
        <Boden y={1500} />
        <Leuchten x={540} y={1456} r={260} staerke={0.1} />
        <Sockel x={540} y={1500} breite={260} hoehe={44} />
        <Figur x={500} y={1456} t={t} huepfen={Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - 2.4) / 0.45)) * Math.PI)) * 60} blick={0.6 * ein(t, 1.2, 0.4)} />
      </Welt>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: FARBE.grau, opacity: ein(t, 0.6, 0.6)}}>
        TESTBILD · ALLES BEREIT
      </div>
    </AbsoluteFill>
  );
};
