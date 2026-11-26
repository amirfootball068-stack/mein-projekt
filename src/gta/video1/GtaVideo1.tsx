import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {SCHRIFT, Schriften, clamp, ein, zufall} from "../../stil";
import {woerterVon, Zeitstempel} from "../../bausteine/zeit";
import {Geraeusch} from "../../bausteine/Welt";
import ZS from "./zeitstempel.json";

/**
 * GTA-Account · Video 1: „13 Jahre – warum hat GTA 6 so lange gedauert?“
 * Konzept: serie/gta6-video1.md · Bilder: public/gta/video1 · Gaming-Doku-Look
 */

const Z = ZS as Zeitstempel;
const {wort} = woerterVon(Z);
export const GTA1_DAUER = Z.dauer + 0.8;

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
  zensur?: boolean; // Tafel im Launch-Bild unscharf machen (fremder Schriftzug)
};

const B = (n: string) => `gta/video1/${n}`;
const pruefen = <T extends {von: number}>(l: T[]): T[] => {
  for (let i = 1; i < l.length; i++) if (l[i].von <= l[i - 1].von) throw new Error(`Szene ${i} liegt vor Szene ${i - 1}`);
  return l;
};

const SZENEN: Szene[] = pruefen([
  {von: 0, bild: B("bild1_skyline.png"), zoom: [1.0, 1.12], ursprung: ["50% 60%", "50% 50%"], titel: "13 JAHRE.", farbe: PINK},
  {von: wort("Und das war"), bild: B("bild1_skyline.png"), zoom: [1.7, 1.85], ursprung: ["20% 12%", "25% 12%"]},
  {von: wort("September"), bild: B("bild2_geld.png"), zoom: [1.05, 1.15], ursprung: ["50% 50%", "60% 40%"], titel: "2013", titelBei: wort("2013")},
  {von: wort("Über 200"), bild: B("bild2_geld.png"), zoom: [1.6, 1.75], ursprung: ["35% 80%", "40% 75%"], titel: "200 MIO.", titelBei: wort("200"), klein: "VERKAUFTE KOPIEN", farbe: TUERKIS},
  {von: wort("Warum also"), bild: B("bild1_skyline.png"), zoom: [1.4, 1.25], ursprung: ["45% 75%", "45% 70%"], titel: "WARUM NOCH EINS?"},
  {von: wort("Dann kommt"), bild: B("bild3_reiter.jpg"), zoom: [1.0, 1.1], ursprung: ["60% 50%", "65% 48%"], titel: "RED DEAD", klein: "REDEMPTION 2 · 2018"},
  {von: wort("Aber"), bild: B("bild3_reiter.jpg"), zoom: [1.8, 2.0], ursprung: ["68% 45%", "68% 45%"]},
  {von: wort("Berichte"), bild: B("bild4_buero.jpg"), zoom: [1.0, 1.1], ursprung: ["40% 60%", "45% 55%"], titel: "100 STUNDEN", titelBei: wort("100"), klein: "PRO WOCHE", farbe: PINK},
  {von: wort("Rockstar verspricht"), bild: B("bild4_buero.jpg"), zoom: [1.9, 2.1], ursprung: ["72% 32%", "72% 32%"], titel: "SO NICHT NOCH EINMAL."},
  {von: wort("2020"), bild: B("bild5_stuhl.jpg"), zoom: [1.0, 1.1], ursprung: ["40% 60%", "40% 55%"], titel: "2020", klein: "DAN HOUSER GEHT"},
  {von: wort("Die Stimme"), bild: B("bild5_stuhl.jpg"), zoom: [1.5, 1.7], ursprung: ["38% 55%", "38% 55%"]},
  {von: wort("2022"), bild: B("bild6_hacker.jpg"), zoom: [1.0, 1.08], ursprung: ["50% 50%", "50% 45%"], titel: "2022", farbe: PINK, glitch: true},
  {von: wort("Ein Hacker"), bild: B("bild6_hacker.jpg"), zoom: [1.6, 1.8], ursprung: ["50% 40%", "50% 35%"], titel: "90 CLIPS", titelBei: wort("90"), klein: "GELEAKT", farbe: PINK, glitch: true},
  {von: wort("2023"), bild: B("bild1_skyline.png"), zoom: [1.2, 1.05], ursprung: ["60% 30%", "55% 35%"], titel: "2023", klein: "TRAILER 1"},
  {von: wort("Rekord"), bild: B("bild1_skyline.png"), zoom: [2.0, 2.2], ursprung: ["85% 25%", "80% 25%"], titel: "REKORD.", klein: "RELEASE: 2025", farbe: TUERKIS},
  {von: wort("Doch dann"), bild: B("bild7_kalender.jpg"), zoom: [1.0, 1.1], ursprung: ["50% 55%", "50% 55%"], titel: "VERSCHOBEN.", titelBei: wort("verschoben", 1), farbe: PINK},
  {von: wort("verschoben", 2) - 0.02, bild: B("bild7_kalender.jpg"), zoom: [1.8, 1.95], ursprung: ["45% 52%", "45% 52%"], titel: "VERSCHOBEN.", klein: "FEINSCHLIFF · KEIN CRUNCH", farbe: PINK},
  {von: wort("Am 19"), bild: B("bild8_launch.jpg"), zoom: [1.0, 1.1], ursprung: ["50% 40%", "50% 35%"], titel: "19.11.2026", farbe: TUERKIS, zensur: true},
  {von: wort("Laut Take-Two"), bild: B("bild8_launch.jpg"), zoom: [1.4, 1.6], ursprung: ["50% 70%", "50% 65%"], titel: "$3,79 MRD.", titelBei: wort("3,79"), klein: "AN TAG 1 · LAUT TAKE-TWO", farbe: PINK, zensur: true},
  {von: wort("Also ehrlich"), bild: B("bild9_sunset.jpg"), zoom: [1.0, 1.15], ursprung: ["60% 45%", "65% 45%"], titel: "GELOHNT?", titelBei: wort("Hat sich"), klein: "SCHREIB'S IN DIE KOMMENTARE ↓", farbe: PINK},
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
        <Img src={staticFile(s.bild)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        {s.zensur ? <div style={{position: "absolute", left: "31%", top: "5%", width: "38%", height: "57%", backdropFilter: "blur(22px)", background: "rgba(20,0,40,0.35)", WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 80%)", maskImage: "radial-gradient(ellipse at center, black 55%, transparent 80%)"}} /> : null}
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
          fontSize: s.titel.length > 12 ? 96 : 150,
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
const PINK_WOERTER = ["zufall", "meisterwerk", "limit", "weg", "schock", "rekord", "verschoben", "crunch", "tag", "gelohnt", "müssen"];
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

export const GtaVideo1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);
  const weg = wort("Weg");
  // Licht geht aus auf „Weg.“
  const dunkel = t >= weg && t < wort("2022") ? 0.55 * ein(t, weg, 0.35) : 0;

  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Schriften />
      {SZENEN.map((s, i) => {
        const bis = i + 1 < SZENEN.length ? SZENEN[i + 1].von : GTA1_DAUER;
        return (
          <Sequence key={i} from={f(s.von)} durationInFrames={Math.max(1, f(bis) - f(s.von))}>
            <Bild s={s} dauer={bis - s.von} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{background: "#000", opacity: dunkel}} />
      <Korn />
      {/* dunkler Verlauf oben, damit die Titel immer lesbar sind */}
      <AbsoluteFill style={{background: "linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 38%)"}} />
      {/* Schwarzbild-Knall am Anfang: „13“ */}
      <AbsoluteFill style={{background: "#000", opacity: interpolate(t, [0, 0.35, 0.6], [1, 1, 0], clamp)}} />
      {SZENEN.map((s, i) => (
        <Titel key={i} s={s} t={t} bis={i + 1 < SZENEN.length ? SZENEN[i + 1].von : GTA1_DAUER} />
      ))}
      <Untertitel t={t} />

      <Audio src={staticFile(Z.datei)} />
      {/* Geraeusche aus dem Sound-Paket (Musik waehlst du in der TikTok-App) */}
      <Geraeusch name="bass_drop" bei={0} lautstaerke={0.45} />
      <Geraeusch name="zaehlwerk" bei={wort("200")} lautstaerke={0.25} />
      <Geraeusch name="whoosh" bei={wort("Dann kommt") - 0.15} lautstaerke={0.3} />
      <Geraeusch name="uhr_tickt" bei={wort("Berichte")} lautstaerke={0.25} />
      <Geraeusch name="herzschlag" bei={wort("Ein Studio")} lautstaerke={0.3} />
      <Geraeusch name="licht_aus" bei={weg} lautstaerke={0.4} />
      <Geraeusch name="flackern" bei={wort("2022")} lautstaerke={0.35} />
      <Geraeusch name="spannung" bei={wort("Ein Hacker")} lautstaerke={0.2} />
      <Geraeusch name="whoosh_kurz" bei={wort("2023") - 0.1} lautstaerke={0.3} />
      <Geraeusch name="ding" bei={wort("Rekord")} lautstaerke={0.3} />
      <Geraeusch name="stempel" bei={wort("verschoben", 1)} lautstaerke={0.5} />
      <Geraeusch name="stempel" bei={wort("verschoben", 2)} lautstaerke={0.5} />
      <Geraeusch name="whoosh_lang" bei={wort("Am 19") - 0.3} lautstaerke={0.3} />
      <Geraeusch name="bass_drop" bei={wort("3,79")} lautstaerke={0.45} />
      <Geraeusch name="muenzen_regen" bei={wort("3,79") + 0.1} lautstaerke={0.25} />
      <Geraeusch name="schimmer" bei={wort("Also ehrlich")} lautstaerke={0.2} />
    </AbsoluteFill>
  );
};
