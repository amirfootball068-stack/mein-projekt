import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {SCHRIFT, Schriften, clamp, ein, zufall} from "../../stil";
import {woerterVon, Zeitstempel} from "../../bausteine/zeit";
import {Geraeusch} from "../../bausteine/Welt";
import ZS from "./zeitstempel.json";

/**
 * GTA-Account · Video 2: „Jason & Lucia – was steckt hinter ihrer Beziehung?“
 * Konzept: serie/gta6-video2.md · Bilder: eigene KI-Stimmungsbilder (Silhouetten, keine Rockstar-Figuren) · Gaming-Doku-Look
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
  pos?: [number, number]; // horizontaler Bildausschnitt in % (Anfang, Ende) – Querformat-Bilder
};

const B = (n: string) => `gta/video2/${n}`;
const pruefen = <T extends {von: number}>(l: T[]): T[] => {
  for (let i = 1; i < l.length; i++) if (l[i].von <= l[i - 1].von) throw new Error(`Szene ${i} liegt vor Szene ${i - 1}`);
  return l;
};

const SZENEN: Szene[] = pruefen([
  {von: 0, bild: B("s1_strasse.jpg"), zoom: [1.05, 1.15], ursprung: ["50% 55%", "50% 50%"], titel: "DAS GEFÄHRLICHSTE PAAR", klein: "IN LEONIDA?", farbe: PINK, glitch: true},
  {von: wort("Lucia Caminos"), bild: B("s2_gefaengnis.jpg"), zoom: [1.0, 1.1], ursprung: ["70% 60%", "65% 55%"], titel: "LUCIA CAMINOS", klein: "KÄMPFT, SEIT SIE LAUFEN KANN", farbe: TUERKIS},
  {von: wort("Sie hat für"), bild: B("s2_gefaengnis.jpg"), zoom: [1.5, 1.7], ursprung: ["30% 45%", "35% 40%"], titel: "GEFÄNGNIS", titelBei: wort("Gefängnis"), klein: "RAUS DURCH PURES GLÜCK", farbe: PINK},
  {von: wort("Jason Duval"), bild: B("s3_boot.jpg"), pos: [80, 72], zoom: [1.0, 1.08], ursprung: ["50% 50%", "50% 50%"], titel: "JASON DUVAL", klein: "AUFGEWACHSEN UNTER GAUNERN", farbe: TUERKIS},
  {von: wort("Gelandet"), bild: B("s3_boot.jpg"), pos: [50, 54], zoom: [1.4, 1.6], ursprung: ["50% 70%", "50% 75%"], titel: "EX-SOLDAT", klein: "HANDLANGER IN DEN KEYS"},
  {von: wort("Zwei Menschen"), bild: B("s1_strasse.jpg"), zoom: [1.6, 1.75], ursprung: ["50% 45%", "50% 42%"], titel: "DAS SPIEL IST", klein: "GEGEN SIE GEZINKT", farbe: PINK},
  {von: wort("Dann geht"), bild: B("s4_auto.jpg"), zoom: [1.0, 1.1], ursprung: ["50% 55%", "50% 50%"], titel: "EIN LEICHTER COUP …", glitch: true},
  {von: wort("schief") - 0.02, bild: B("s4_auto.jpg"), zoom: [2.0, 2.2], ursprung: ["50% 37%", "50% 37%"], titel: "… GEHT SCHIEF.", farbe: PINK, glitch: true},
  {von: wort("Verschwörung"), bild: B("s5_pinnwand.jpg"), zoom: [1.0, 1.15], ursprung: ["45% 40%", "45% 45%"], titel: "VERSCHWÖRUNG", klein: "QUER DURCH LEONIDA", farbe: PINK},
  {von: wort("Ihre einzige"), bild: B("s6_sunset.jpg"), zoom: [1.5, 1.6], ursprung: ["50% 50%", "50% 50%"], titel: "VERTRAUEN", klein: "= ÜBERLEBEN", farbe: TUERKIS},
  {von: wort("Aber in"), bild: B("s1_strasse.jpg"), zoom: [2.0, 2.2], ursprung: ["50% 40%", "50% 38%"], titel: "VERRAT?", titelBei: wort("Verrat"), farbe: PINK, glitch: true},
  {von: wort("Du hast"), bild: B("s6_sunset.jpg"), zoom: [1.0, 1.1], ursprung: ["50% 60%", "50% 55%"], titel: "VERTRAUEN ODER VERRAT?", klein: "OHNE SPOILER ↓", farbe: PINK},
]);

/** Bild mit langsamer Kamerafahrt (Ken Burns) */
const Bild: React.FC<{s: Szene; dauer: number}> = ({s, dauer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = Math.min(1, t / dauer);
  const z = s.zoom[0] + (s.zoom[1] - s.zoom[0]) * p;
  const [ax, ay] = s.ursprung[0].split(" ").map(parseFloat);
  const [bx, by] = s.ursprung[1].split(" ").map(parseFloat);
  const ox = ax + (bx - ax) * p;
  const oy = ay + (by - ay) * p;
  // Glitch beim Schnitt: kurzer Versatz + Aufhellen
  const stoss = 1 - Math.min(1, t / 0.12);
  const versatz = stoss * 18 * Math.sin(frame * 7);
  const glitchBalken = s.glitch && zufall(Math.floor(t * 8)) > 0.7;
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, transform: `translateX(${versatz}px) scale(${z})`, transformOrigin: `${ox}% ${oy}%`, filter: `brightness(${1 + 0.6 * stoss}) contrast(1.08) saturate(1.1)`}}>
        <Img src={staticFile(s.bild)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ? `${s.pos[0] + (s.pos[1] - s.pos[0]) * p}% 50%` : "50% 50%"}} />
      </div>
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
