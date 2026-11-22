import React from "react";
import {Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {FARBE, LEUCHTEN, MONO} from "../stil";

/** Boden: eine leuchtende Linie, darunter ein schwacher Schimmer */
export const Boden: React.FC<{y: number; breite?: number; deckkraft?: number}> = ({y, breite = 6000, deckkraft = 1}) => (
  <>
    <div style={{position: "absolute", left: 540 - breite / 2, top: y, width: breite, height: 2, background: FARBE.linie, opacity: deckkraft}} />
    <div
      style={{
        position: "absolute",
        left: 540 - breite / 2,
        top: y,
        width: breite,
        height: 260,
        opacity: deckkraft * 0.5,
        background: "linear-gradient(rgba(242,242,240,0.07), rgba(242,242,240,0))",
      }}
    />
  </>
);

/** Weiches Leuchten hinter einem Objekt */
export const Leuchten: React.FC<{x: number; y: number; r: number; staerke?: number}> = ({x, y, r, staerke = 0.18}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: 2 * r,
      height: 2 * r,
      borderRadius: r,
      background: `radial-gradient(circle, rgba(242,242,240,${staerke}) 0%, rgba(242,242,240,0) 70%)`,
    }}
  />
);

/** Muenze mit Praegung. drehung in Grad (um die senkrechte Achse) */
export const Muenze: React.FC<{x: number; y: number; r?: number; drehung?: number; text?: string; deckkraft?: number}> = ({
  x,
  y,
  r = 34,
  drehung = 0,
  text = "1%",
  deckkraft = 1,
}) => {
  const sx = Math.max(0.08, Math.abs(Math.cos((drehung * Math.PI) / 180)));
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: r,
        background: FARBE.figur,
        boxShadow: LEUCHTEN,
        transform: `scaleX(${sx})`,
        opacity: deckkraft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{width: 2 * r - 10, height: 2 * r - 10, borderRadius: r, border: "2px solid rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <span style={{fontFamily: MONO, fontSize: r * 0.62, color: "#111", fontWeight: 700, opacity: sx > 0.4 ? 1 : 0}}>{text}</span>
      </div>
    </div>
  );
};

/** Sockel (Block), auf dem etwas steht. y = Unterkante */
export const Sockel: React.FC<{x: number; y: number; breite: number; hoehe: number; hell?: number}> = ({x, y, breite, hoehe, hell = 1}) => (
  <div
    style={{
      position: "absolute",
      left: x - breite / 2,
      top: y - hoehe,
      width: breite,
      height: Math.max(0.6, hoehe),
      background: `rgba(242,242,240,${0.88 * hell})`,
      boxShadow: hell > 0.2 ? "0 0 26px rgba(242,242,240,0.28)" : "none",
      borderRadius: Math.min(4, hoehe / 2),
    }}
  />
);

/** Zaehler: kleines Schild in der Welt (kleine Woerter in der Welt sind erlaubt) */
export const Zaehler: React.FC<{x: number; y: number; oben: string; unten: string; deckkraft?: number; skala?: number}> = ({
  x,
  y,
  oben,
  unten,
  deckkraft = 1,
  skala = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${skala})`,
      opacity: deckkraft,
      padding: "14px 22px",
      border: `2px solid ${FARBE.linie}`,
      borderRadius: 12,
      background: "rgba(0,0,0,0.75)",
      fontFamily: MONO,
      color: FARBE.figur,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div style={{fontSize: 22, letterSpacing: 4, color: FARBE.grau}}>{oben}</div>
    <div style={{fontSize: 46, marginTop: 4, fontVariantNumeric: "tabular-nums", textShadow: LEUCHTEN}}>{unten}</div>
  </div>
);

/**
 * Geraeusch aus dem Sound-Paket (public/sounds) an einer Stelle abspielen.
 *   <Geraeusch name="klack" bei={3.2} />
 * Lautstaerke: Geraeusche leise, eher gefuehlt als gehoert (0.15 – 0.4).
 */
export const Geraeusch: React.FC<{name: string; bei: number; lautstaerke?: number}> = ({name, bei, lautstaerke = 0.3}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(bei * fps))} layout="none">
      <Audio src={staticFile(`sounds/${name}.wav`)} volume={lautstaerke} />
    </Sequence>
  );
};
