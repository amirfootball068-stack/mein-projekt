import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {SCHRIFT, Schriften, clamp, ein, zufall} from "../../stil";
import {woerterVon, Zeitstempel} from "../../bausteine/zeit";
import {Geraeusch} from "../../bausteine/Welt";
import ZS from "./zeitstempel.json";

/**
 * GTA-Account · Video 2: „Jason & Lucia – was steckt hinter ihrer Beziehung?“
 * Konzept: serie/gta6-video2.md · Bilder: offizielle Rockstar-Screenshots (rockstargames.com/VI) · Gaming-Doku-Look
 */

const Z = ZS as Zeitstempel;
const {wort} = woerterVon(Z);
export const GTA2_DAUER = Z.dauer + 0.8;

const PINK = "#FF3EA5";
const TUERKIS = "#3EF2E0";

type Szene = {
  von: number;
  bild: string;
  zoom: [number, number]; // Zoom am Anfang / Ende der Szene
  ursprung: [string, string]; // Zoom-Mittelpunkt am Anfang / Ende (CSS transform-origin)
  titel?: string; // grosser Text oben
  titelBei?: number;
  klein?: string; // kleine Zeile unter dem Titel
  farbe?: string;
  glitch?: boolean;
  fx?: [number, number]; // Fokuspunkt im Bild (0..1), Anfang/Ende – landet in der Bildmitte
  fy?: number; // Fokuspunkt vertikal (0..1) – landet bei FOKUS_Y
};

const B = (n: string) => `gta/video2/${n}`;
const pruefen = <T extends {von: number}>(l: T[]): T[] => {
  for (let i = 1; i < l.length; i++) if (l[i].von <= l[i - 1].von) throw new Error(`Szene ${i} liegt vor Szene ${i - 1}`);
  return l;
};

// Querformat-Bilder: Fokuspunkt (Gesicht) landet mittig zwischen Titel und Untertitel
const FOKUS_Y = 830;
const BILD_SEITE: Record<string, number> = {"r_bank.jpg": 2576 / 1357, "r_lucia.jpg": 2576 / 1344, "r_motorrad.jpg": 2576 / 1348, "r_zaun.jpg": 2576 / 1420, "r_sumpf.jpg": 2576 / 1431};

const SZENEN: Szene[] = pruefen([
  {von: 0, bild: B("r_bank.jpg"), fx: [0.4, 0.55], fy: 0.1, zoom: [0.9, 0.98], ursprung: ["", ""], titel: "DAS GEFÄHRLICHSTE PAAR", klein: "IN LEONIDA?", farbe: PINK, glitch: true},
  {von: wort("Lucia Caminos"), bild: B("r_lucia.jpg"), fx: [0.79, 0.78], fy: 0.27, zoom: [1.0, 1.1], ursprung: ["", ""], titel: "LUCIA CAMINOS", klein: "KÄMPFT, SEIT SIE LAUFEN KANN", farbe: TUERKIS},
  {von: wort("Sie hat für"), bild: B("r_lucia.jpg"), fx: [0.77, 0.77], fy: 0.2, zoom: [1.15, 1.25], ursprung: ["", ""], titel: "GEFÄNGNIS", titelBei: wort("Gefängnis"), klein: "RAUS DURCH PURES GLÜCK", farbe: PINK},
  {von: wort("Jason Duval"), bild: B("r_motorrad.jpg"), fx: [0.68, 0.7], fy: 0.14, zoom: [0.95, 1.05], ursprung: ["", ""], titel: "JASON DUVAL", klein: "AUFGEWACHSEN UNTER GAUNERN", farbe: TUERKIS},
  {von: wort("Gelandet"), bild: B("r_motorrad.jpg"), fx: [0.62, 0.68], fy: 0.3, zoom: [1.3, 1.4], ursprung: ["", ""], titel: "EX-SOLDAT", klein: "HANDLANGER IN DEN KEYS"},
  {von: wort("Zwei Menschen"), bild: B("r_bank.jpg"), fx: [0.6, 0.55], fy: 0.28, zoom: [1.0, 1.06], ursprung: ["", ""], titel: "DAS SPIEL IST", klein: "GEGEN SIE GEZINKT", farbe: PINK},
  {von: wort("Dann geht"), bild: B("r_bank.jpg"), fx: [0.3, 0.32], fy: 0.13, zoom: [1.05, 1.15], ursprung: ["", ""], titel: "EIN LEICHTER COUP …", glitch: true},
  {von: wort("schief") - 0.02, bild: B("r_zaun.jpg"), fx: [0.55, 0.55], fy: 0.42, zoom: [1.0, 1.1], ursprung: ["", ""], titel: "… GEHT SCHIEF.", farbe: PINK, glitch: true},
  {von: wort("Verschwörung"), bild: B("r_zaun.jpg"), fx: [0.22, 0.3], fy: 0.4, zoom: [0.95, 1.0], ursprung: ["", ""], titel: "VERSCHWÖRUNG", klein: "QUER DURCH LEONIDA", farbe: PINK},
  {von: wort("Ihre einzige"), bild: B("r_sumpf.jpg"), fx: [0.49, 0.5], fy: 0.2, zoom: [1.05, 1.15], ursprung: ["", ""], titel: "VERTRAUEN", klein: "= ÜBERLEBEN", farbe: TUERKIS},
  {von: wort("Aber in"), bild: B("r_lucia.jpg"), fx: [0.5, 0.68], fy: 0.38, zoom: [0.95, 1.0], ursprung: ["", ""], titel: "VERRAT?", titelBei: wort("Verrat"), farbe: PINK, glitch: true},
  {von: wort("Du hast"), bild: B("r_sumpf.jpg"), fx: [0.5, 0.52], fy: 0.15, zoom: [0.8, 0.86], ursprung: ["", ""], titel: "VERTRAUEN ODER VERRAT?", klein: "OHNE SPOILER ↓", farbe: PINK},
]);

/** Querformat-Bild im Hochformat: unscharfer Hintergrund + scharfes Bild, Fokuspunkt (Gesicht) in der Mitte */
const Bild: React.FC<{s: Szene; dauer: number}> = ({s, dauer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = Math.min(1, t / dauer);
  const z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * p;
  const fx = s.fx ? s.fx[0] + (s.fx[1] - s.fx[0]) * p : 0.5;
  const fy = s.fy ?? 0.4;
  const seite = BILD_SEITE[s.bild.split("/").pop() ?? ""] ?? 16 / 9;
  const h = 1920 * z;
  const w = h * seite;
  const left = Math.min(0, Math.max(1080 - w, 540 - fx * w));
  const top = Math.min(1920 * 0.42, Math.max(1920 - h, FOKUS_Y - fy * h));
  // Glitch beim Schnitt: kurzer Versatz + Aufhellen
  const stoss = 1 - Math.min(1, t / 0.12);
  const versatz = stoss * 18 * Math.sin(frame * 7);
  const glitchBalken = s.glitch && zufall(Math.floor(t * 8)) > 0.7;
  const rand = "linear-gradient(transparent 0%, black 9%, black 91%, transparent 100%)";
  return (
    <AbsoluteFill style={{overflow: "hidden", filter: `brightness(${1 + 0.6 * stoss}) contrast(1.08) saturate(1.1)`, transform: `translateX(${versatz}px)`}}>
      <Img src={staticFile(s.bild)} style={{position: "absolute", inset: -60, width: 1200, height: 2040, objectFit: "cover", objectPosition: `${fx * 100}% 50%`, filter: "blur(38px) brightness(0.45)"}} />
      <Img src={staticFile(s.bild)} style={{position: "absolute", left, top, width: w, height: h, WebkitMaskImage: rand, maskImage: rand}} />
      {glitchBalken ? (
        <div style={{position: "absolute", left: 0, right: 0, top: `${zufall(Math.floor(t * 8) + 3) * 90}%`, height: 40 + zufall(Math.floor(t * 8) + 5) * 60, background: `linear-gradient(90deg, ${PINK}55, ${TUERKIS}55)`, mixBlendMode: "screen", transform: `translateX(${(zufall(frame) - 0.5) * 80}px)`}} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Filmkorn (wechselt jedes Bild) + Vignette */
const Korn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: 0.13, mixBlendMode: "overlay"}}>
        <filter id="korn">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 50} />
        </filter>
        <rect width="100%" height="100%" filter="url(#korn)" />
      </svg>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)"}} />
    </>
  );
};

/** Grosser Kapitel-Text oben: knallt rein */
const Titel: React.FC<{s: Szene; t: number; bis: number}> = ({s, t, bis}) => {
  if (!s.titel) return null;
  const t0 = s.titelBei ?? s.von;
  if (t < t0 || t >= bis) return null;
  const p = ein(t, t0, 0.18);
  const s1 = 1.6 - 0.6 * p;
  const wackeln = (1 - p) * 10 * Math.sin(t * 90);
  const kleinO = ein(t, t0 + 0.25, 0.3);
  return (
    <div style={{position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", transform: `translateX(${wackeln}px)`}}>
      <div
        style={{
          fontFamily: SCHRIFT,
          fontWeight: 700,
          fontSize: s.titel.length > 14 ? 92 : s.titel.length > 9 ? 112 : 150,
          lineHeight: 1,
          letterSpacing: 2,
          color: s.farbe ?? "#FFFFFF",
          transform: `scale(${s1})`,
          opacity: p,
          textShadow: `0 0 30px ${s.farbe ?? "rgba(255,255,255,0.5)"}, 0 6px 30px rgba(0,0,0,0.9)`,
        }}
      >
        {s.titel}
      </div>
      {s.klein ? (
        <div style={{marginTop: 22, fontFamily: SCHRIFT, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: "#fff", opacity: kleinO, textShadow: "0 3px 18px rgba(0,0,0,0.9)"}}>{s.klein}</div>
      ) : null}
    </div>
  );
};

// ---------- Untertitel: Wort fuer Wort ----------
const PINK_WOERTER = ["paar", "zerstören", "gefängnis", "glück", "gezinkt", "schief", "verschwörung", "vertrauen", "verrat", "trauen"];
const ohneZeichen = (s: string) => s.replace(/[.?!:;…]/g, "").replace(/,$/, "");

const Untertitel: React.FC<{t: number}> = ({t}) => {
  const w = Z.woerter;
  let i = -1;
  for (let k = 0; k < w.length; k++) if (w[k].von <= t) i = k;
  if (i < 0) return null;
  const x = w[i];
  const naechstes = i + 1 < w.length ? w[i + 1].von : Infinity;
  const ende = naechstes - x.bis > 0.4 ? x.bis + 0.3 : naechstes;
  if (t >= ende) return null;
  const text = ohneZeichen(x.wort);
  const farbig = PINK_WOERTER.includes(text.toLowerCase());
  const pop = ein(t, x.von, 0.1);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1920 * 0.72,
        transform: `translateY(-50%) scale(${0.85 + 0.15 * pop})`,
        textAlign: "center",
        fontFamily: SCHRIFT,
        fontWeight: 700,
        fontSize: 100,
        textTransform: "uppercase",
        color: farbig ? PINK : "#FFFFFF",
        textShadow: "0 4px 26px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)",
        opacity: pop,
      }}
    >
      {text}
    </div>
  );
};

export const GtaVideo2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Schriften />
      {SZENEN.map((s, i) => {
        const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].von : GTA2_DAUER;
        return (
          <Sequence key={i} from={f(s.von)} durationInFrames={Math.max(1, f(bis) - f(s.von))}>
            <Bild s={s} dauer={bis - s.von} />
          </Sequence>
        );
      })}
      <Korn />
      {/* dunkler Verlauf oben, damit die Titel immer lesbar sind */}
      <AbsoluteFill style={{background: "linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 38%)"}} />
      {SZENEN.map((s, i) => (
        <Titel key={i} s={s} t={t} bis={i + 1 < SZENEN.length ? SZENEN[i + 1].von : GTA2_DAUER} />
      ))}
      <Untertitel t={t} />

      <Audio src={staticFile(Z.datei)} />
      {/* Geraeusche aus dem Sound-Paket (Musik waehlst du in der App) */}
      <Geraeusch name="bass_drop" bei={0} lautstaerke={0.45} />
      <Geraeusch name="flackern" bei={wort("zerstören")} lautstaerke={0.35} />
      <Geraeusch name="whoosh_kurz" bei={wort("Lucia Caminos") - 0.1} lautstaerke={0.3} />
      <Geraeusch name="klack_tief" bei={wort("Gefängnis")} lautstaerke={0.5} />
      <Geraeusch name="schimmer" bei={wort("Glück")} lautstaerke={0.2} />
      <Geraeusch name="whoosh_kurz" bei={wort("Jason Duval") - 0.1} lautstaerke={0.3} />
      <Geraeusch name="tock" bei={wort("gezinkt")} lautstaerke={0.35} />
      <Geraeusch name="spannung" bei={wort("Dann geht")} lautstaerke={0.25} />
      <Geraeusch name="flackern" bei={wort("schief")} lautstaerke={0.4} />
      <Geraeusch name="herzschlag" bei={wort("Verschwörung")} lautstaerke={0.35} />
      <Geraeusch name="bass_drop" bei={wort("Verrat")} lautstaerke={0.4} />
      <Geraeusch name="schimmer" bei={wort("Du hast")} lautstaerke={0.2} />
    </AbsoluteFill>
  );
};
