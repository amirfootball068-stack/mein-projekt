import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {SCHRIFT, Schriften, clamp, ein} from "../../stil";
import {woerterVon, Zeitstempel} from "../../bausteine/zeit";
import {Geraeusch} from "../../bausteine/Welt";
import ZS from "./zeitstempel.json";

/**
 * loeffelweise – „Die perfekte Açaí-Bowl“, Folge 1: Strawberry Explosion
 * Realistische KI-Clips (Gemini/Veo) + Erzaehlerstimme. Plan: serie/acai-challenges.md
 * Jede Szene: [Start im Reel, Ende im Reel, Clip, Start im Clip, Ton-Lautstaerke, Farbfilter]
 */

const Z = ZS as Zeitstempel;
const {wort, wortEnde} = woerterVon(Z);
export const FOLGE1_DAUER = Z.dauer + 0.7;

const VIOLETT = "#B48CFF";

const C = {
  challenge: wort("Challenge"),
  gefroren: wort("Gefrorenes"),
  dass: wort("dass"),
  oben: wort("Obendrauf"),
  erdbeeren: wort("Erdbeeren"),
  kokos: wort("Kokos"),
  granola: wort("Granola"),
  und: wort("Und jetzt"),
  wuerdest: wort("Würdest"),
  folge: wort("Folge"),
  ende: wortEnde("verrückt"),
};

type Szene = {von: number; bis: number; clip: string | null; ab: number; ton: number; filter?: string};

// Clip-Zeiten so gewaehlt, dass Aktionen auf Woertern sitzen:
// Spritzer (Clip 1 bei 3,0 s) auf „alle“, erste Erdbeerscheibe (Clip 4 bei 3,0 s) auf „Erdbeeren“, Granola (Clip 5 bei 3,6 s) auf „Granola“
const SZENEN: Szene[] = [
  {von: 0, bis: C.challenge, clip: "szene1", ab: 3.0 - wort("alle"), ton: 1},
  {von: C.challenge, bis: C.gefroren, clip: "szene1", ab: 3.0 - wort("alle") + C.challenge + 0.4, ton: 0.8},
  {von: C.gefroren, bis: C.gefroren + 1.0, clip: "szene2", ab: 2.6, ton: 0.9},
  {von: C.gefroren + 1.0, bis: C.dass, clip: "szene2", ab: 4.4, ton: 0.8},
  {von: C.dass, bis: C.oben, clip: "szene3", ab: 6.0, ton: 1, filter: "brightness(0.82) contrast(1.08) saturate(1.2)"},
  {von: C.oben, bis: C.kokos, clip: "szene4", ab: 3.0 - (C.erdbeeren - C.oben), ton: 1},
  {von: C.kokos, bis: C.und, clip: "szene5", ab: 3.6 - (C.granola - C.kokos), ton: 1},
  {von: C.und, bis: C.wuerdest, clip: null, ab: 0, ton: 0}, // Szene 6 folgt – Platzhalter: Startbild
  {von: C.wuerdest, bis: FOLGE1_DAUER, clip: null, ab: 0, ton: 0}, // Schlussbild: fertige Bowl
];

/** Standbild mit langsamem Zoom (Ken Burns) */
const Startbild: React.FC<{dauer: number; z0: number; z1: number}> = ({dauer, z0, z1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = Math.min(1, frame / fps / dauer);
  const z = z0 + (z1 - z0) * p;
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img src={staticFile("serie/folge1/startbild.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "50% 45%"}} />
    </AbsoluteFill>
  );
};

// ---------- Untertitel: Wort fuer Wort ----------
const SCHLUESSEL = ["alle", "explosion", "löffel", "erdbeeren", "granola", "verrückt"];
const ohneZeichen = (s: string) => s.replace(/[.,!?;:…]/g, "");

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
  const farbig = SCHLUESSEL.includes(text.toLowerCase());
  const pop = ein(t, x.von, 0.12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1920 * 0.72,
        transform: `translateY(-50%) scale(${0.86 + 0.14 * pop})`,
        textAlign: "center",
        fontFamily: SCHRIFT,
        fontWeight: 700,
        fontSize: 104,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: farbig ? VIOLETT : "#FFFFFF",
        textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)",
        opacity: pop,
      }}
    >
      {text}
    </div>
  );
};

export const Folge1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);

  // Titel „CHALLENGE 1/4“ und Schluss-Hinweis „Folge 2 →“
  const titel = ein(t, C.challenge, 0.25) * (1 - ein(t, C.gefroren - 0.3, 0.3));
  const weiter = ein(t, C.folge, 0.3);

  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Schriften />
      {SZENEN.map((s, i) => (
        <Sequence key={i} from={f(s.von)} durationInFrames={Math.max(1, f(s.bis) - f(s.von))}>
          {s.clip ? (
            <>
              <OffthreadVideo
                src={staticFile(`serie/folge1/${s.clip}.mp4`)}
                startFrom={f(Math.max(0, s.ab))}
                muted
                style={{width: "100%", height: "100%", objectFit: "cover", filter: s.filter}}
              />
              <Audio src={staticFile(`serie/folge1/ton/${s.clip}.wav`)} startFrom={f(Math.max(0, s.ab))} volume={0.55 * s.ton} />
            </>
          ) : i === SZENEN.length - 1 ? (
            <Startbild dauer={s.bis - s.von} z0={1.0} z1={1.12} />
          ) : (
            <Startbild dauer={s.bis - s.von} z0={1.15} z1={1.3} />
          )}
        </Sequence>
      ))}

      {/* leichte Abdunklung unten, damit der Untertitel immer lesbar ist */}
      <AbsoluteFill style={{background: "linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)"}} />

      {titel > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SCHRIFT,
            fontWeight: 700,
            fontSize: 58,
            letterSpacing: 12,
            color: "#fff",
            opacity: titel,
            textShadow: "0 3px 18px rgba(0,0,0,0.8)",
          }}
        >
          CHALLENGE 1/4
        </div>
      ) : null}

      {weiter > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SCHRIFT,
            fontWeight: 700,
            fontSize: 84,
            color: "#fff",
            opacity: weiter,
            transform: `translateX(${interpolate(t, [C.folge, C.folge + 0.4], [-30, 0], clamp)}px)`,
            textShadow: "0 3px 18px rgba(0,0,0,0.8)",
          }}
        >
          Folge 2 →
        </div>
      ) : null}

      <Untertitel t={t} />
      <Audio src={staticFile(Z.datei)} />
      {/* ASMR-Ergaenzung: Szene 5 ist sehr leise → leises Knuspern auf „Granola“ */}
      <Geraeusch name="tock" bei={C.granola + 0.05} lautstaerke={0.2} />
    </AbsoluteFill>
  );
};
