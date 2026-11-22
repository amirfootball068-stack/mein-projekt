import React from "react";
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FARBE, Schriften, aus, clamp, ein, weich} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {KameraZeile, Welt, kameraBei} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden, Geraeusch, Leuchten, Muenze, Sockel, Zaehler} from "../bausteine/Welt";
import {woerterVon, Zeitstempel} from "../bausteine/zeit";
import ZS from "./zeitstempel.json";

/**
 * BEISPIELVIDEO „Ein Prozent am Tag“ (ca. 22 s)
 * Skript (eine Zeile = eine Szene):
 *  1 Ein Prozent. Mehr nicht.
 *  2 Jeden Tag ein Prozent besser.
 *  3 Klingt nach nichts.
 *  4 Nach einem Jahr bist du fast achtunddreißigmal so weit.
 *  5 Jeden Tag ein Prozent schlechter?
 *  6 Nach einem Jahr ist fast nichts mehr übrig.
 *  7 Der Unterschied liegt nicht an einem großen Tag.
 *  8 Er liegt an dreihundertfünfundsechzig kleinen.
 *  9 Welches Prozent machst du heute?   (letztes Bild = erstes Bild → Schleife)
 *
 * Rechnung: 1,01^365 ≈ 37,8   ·   0,99^365 ≈ 0,026
 */

export type EinProzentProps = {ton: boolean; fassung: "final" | "erste" | "huepfen"};

const Z = ZS as Zeitstempel;
const {wort, wortEnde} = woerterVon(Z);

// ---- Stichworte (Sekunden) ----
export const C = {
  mehr: wort("Mehr"),
  jeden1: wort("Jeden", 1),
  besser: wort("besser"),
  woche: wort("Klingt"),
  nichts: wort("nichts", 1),
  jahr1: wort("Nach einem Jahr", 1),
  acht: wort("achtunddreissigmal"),
  gut: wort("weit"),
  rueck: wortEnde("weit") - 0.05,
  jeden2: wort("Jeden", 2),
  schlechter: wort("schlechter"),
  jahr2: wort("Nach einem Jahr", 2),
  drei: wort("fast nichts mehr"),
  uebrig: wort("übrig"),
  keinem: wort("Der Unterschied"),
  nur: wort("Er liegt"),
  ende: wort("kleinen"),
  welches: wort("Welches"),
  heute: wortEnde("heute"),
};
export const DAUER = Math.max(Z.dauer, C.heute) + 0.9;

// ---- Welt ----
const BODEN = 1500;
const H0 = 44; // Sockel = 100 %
const SB = 260; // Sockelbreite
const FX = 500; // Figur auf dem Sockel (links), rechts ist Platz fuer die Muenze
const MX = 612;
const SCHWEBE_Y = 1150;
const R_ZURUECK = 0.8;

const tageA = (t: number, f: EinProzentProps["fassung"]) => {
  const landet = C.besser + (f === "erste" ? 1.0 : 0.08);
  if (t < landet) return 0;
  if (t < C.woche + 0.3) return 1;
  if (t < C.nichts - 0.15) return 1 + Math.floor(interpolate(t, [C.woche + 0.3, C.nichts - 0.15], [0, 6.999], clamp));
  if (t < C.jahr1 + 0.15) return 7;
  const p = interpolate(t, [C.jahr1 + 0.15, C.acht + 0.45], [0, 1], clamp);
  return 7 + Math.pow(p, 2.1) * 358;
};

const tageC = (t: number) => {
  if (t < C.schlechter + 0.1) return 0;
  if (t < C.jahr2 + 0.15) return 1;
  const p = interpolate(t, [C.jahr2 + 0.15, C.drei + 0.35], [0, 1], clamp);
  return 1 + Math.pow(p, 1.8) * 364;
};

const tageD = (t: number) => 1 + Math.pow(interpolate(t, [C.nur + 0.1, C.ende + 0.55], [0, 1], clamp), 1.8) * 364;

const komma = (v: number, s = 2) => v.toFixed(s).replace(".", ",");

const KAMERA_A = (f: EinProzentProps["fassung"]): KameraZeile[] => {
  if (f === "huepfen") return [[0, 1.25, 540, 1330]];
  const fest = f === "erste";
  return [
    [0, 2.0, 560, 1150],
    [C.mehr - 0.15, 2.0, 560, 1150],
    [C.mehr + 0.55, 1.25, 540, 1330],
    [C.jeden1 + 0.2, 1.25, 540, 1330],
    [C.besser - 0.1, 1.45, 560, 1360],
    ...(fest
      ? ([[C.nichts + 0.5, 1.45, 560, 1360]] as KameraZeile[])
      : ([
          [C.woche - 0.05, 1.45, 560, 1360],
          [C.woche + 0.35, 2.15, 300, 1340],
          [C.nichts - 0.25, 2.15, 300, 1340],
          [C.nichts + 0.25, 1.55, 500, 1340],
        ] as KameraZeile[])),
    [C.jahr1 + 0.1, 1.35, 520, 1260],
    [(C.jahr1 + C.acht) / 2 + 0.2, 0.8, 540, 950],
    [C.acht + 0.45, 0.56, 540, 650],
    [C.rueck, 0.56, 540, 650],
    [C.rueck + R_ZURUECK, 1.3, 540, 1340],
  ];
};

const KAMERA_C: KameraZeile[] = [
  [C.jeden2, 1.3, 540, 1340],
  [C.jahr2 + 0.1, 1.3, 540, 1340],
  [C.drei + 0.4, 1.75, 520, 1400],
  [C.keinem, 1.85, 520, 1410],
];

const KAMERA_D: KameraZeile[] = [
  [C.keinem, 1.22, 540, 1340],
  [C.nur, 1.32, 540, 1350],
  [C.ende + 0.55, 0.52, 540, 640],
  [C.welches, 0.5, 540, 640],
];

const KAMERA_E: KameraZeile[] = [
  [C.welches + 0.3, 1.0, 540, 1250],
  [DAUER - 0.25, 2.0, 560, 1150],
  [DAUER, 2.0, 560, 1150],
];

export const EinProzent: React.FC<EinProzentProps> = ({ton, fassung}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const huepfFassung = fassung === "huepfen";

  // ---- Phasen ----
  const phase = t < C.rueck + R_ZURUECK ? "A" : t < C.keinem ? "C" : t < C.welches + 0.3 ? "D" : "E";

  let kam = kameraBei(t, KAMERA_A(fassung));
  if (phase === "C") kam = kameraBei(t, KAMERA_C);
  if (phase === "D") kam = kameraBei(t, KAMERA_D);
  if (phase === "E") kam = kameraBei(t, KAMERA_E);
  // Rueckwaerts: kurzes Zittern der Kamera
  if (t > C.rueck && t < C.rueck + R_ZURUECK) {
    const z = Math.sin(((t - C.rueck) / R_ZURUECK) * Math.PI);
    kam = {...kam, x: kam.x + z * 6 * Math.sin(t * 90), y: kam.y + z * 4 * Math.sin(t * 70)};
  }

  const welt: React.ReactNode[] = [];
  let figurLicht = 1;

  if (phase === "A") {
    let tage = huepfFassung ? 1 : tageA(t, fassung);
    if (t > C.rueck) tage = 365 * (1 - weich(t, C.rueck, C.rueck + R_ZURUECK * 0.9));
    const faktor = Math.pow(1.01, tage);
    const h = H0 * faktor;
    const oben = BODEN - h;
    // Muenze
    const landet = C.besser + (fassung === "erste" ? 1.0 : 0.08);
    let mY = SCHWEBE_Y + Math.sin(t * 2.4) * 7 * ein(t, 0, 1.2);
    let mDreh = Math.sin(t * 1.3) * 25 * ein(t, 0, 1.2);
    let mO = 1;
    if (!huepfFassung && t > C.jeden1 + 0.1) {
      const p = interpolate(t, [Math.max(C.jeden1 + 0.1, landet - 0.55), landet], [0, 1], clamp);
      mY = interpolate(p * p, [0, 1], [mY, oben - 28]);
      mDreh = mDreh + p * 540;
      mO = aus(t, landet + 0.05, 0.25);
    }
    if (mO > 0) welt.push(<Muenze key="m" x={MX} y={mY} r={28} drehung={mDreh} deckkraft={mO} />);
    // Lichtblitz beim Landen
    const blitz = !huepfFassung ? ein(t, landet, 0.06) * aus(t, landet + 0.08, 0.5) : 0;
    if (blitz > 0) welt.push(<Leuchten key="bl" x={MX} y={oben} r={150} staerke={0.5 * blitz} />);
    // kleine Muenzen in der Woche (je Tag eine)
    if (!huepfFassung && fassung !== "erste" && t > C.woche + 0.1 && t < C.nichts) {
      const tagF = interpolate(t, [C.woche + 0.3, C.nichts - 0.15], [0, 6.999], clamp);
      const i = Math.floor(tagF);
      const p = tagF - i;
      if (i < 6) welt.push(<Muenze key={`w${i}`} x={MX} y={interpolate(p * p, [0, 1], [oben - 260, oben - 22])} r={20} drehung={p * 360} deckkraft={aus(p, 0.85, 0.15)} />);
    }
    // Muenzregen beim Wachsen
    if (!huepfFassung && t > C.jahr1 + 0.15 && t < C.acht + 0.5) {
      for (let k = 0; k < 9; k++) {
        const p = ((t - C.jahr1) * 2.6 + k / 9) % 1;
        welt.push(<Muenze key={`r${k}`} x={MX - 30 + (k % 3) * 30} y={oben - 380 + p * 360} r={16} drehung={p * 720 + k * 40} deckkraft={0.85 * Math.sin(p * Math.PI)} />);
      }
    }
    welt.push(<Leuchten key="gl" x={540} y={oben} r={260} staerke={0.08 + 0.1 * Math.min(1, (faktor - 1) / 5)} />);
    welt.push(<Sockel key="s" x={540} y={BODEN} breite={SB} hoehe={h} />);
    // Figur
    const zweifel = fassung === "erste" || huepfFassung ? 0 : ein(t, C.nichts, 0.35) * aus(t, C.jahr1 + 0.2, 0.4);
    const freude = !huepfFassung ? Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - C.gut) / 0.45)) * Math.PI)) : 0;
    const dauerHuepfen = huepfFassung ? Math.abs(Math.sin(t * 5.2)) * 70 : 0;
    welt.push(
      <Figur
        key="f"
        x={FX}
        y={oben}
        t={t}
        kippen={-10 * zweifel}
        blick={huepfFassung ? 0 : -0.9 * zweifel + 0.6 * ein(t, C.besser, 0.3) * aus(t, C.woche, 0.3)}
        huepfen={dauerHuepfen + freude * 60}
        stauchen={huepfFassung ? Math.max(0, -Math.sin(t * 5.2 - 0.3)) * 0.25 : 0}
      />,
    );
    // Zaehler
    const zO = huepfFassung ? 1 : ein(t, C.jeden1 + 0.25, 0.4) * (t > C.rueck ? aus(t, C.rueck, 0.3) : 1);
    const tageAnz = Math.round(tage);
    if (zO > 0)
      welt.push(
        <Zaehler key="z" x={300} y={oben - 120} oben={`TAG ${tageAnz}`} unten={`× ${komma(Math.pow(1.01, tageAnz))}`} deckkraft={zO} skala={Math.min(1.8, Math.max(1, 0.9 / kam.zoom))} />,
      );
  }

  if (phase === "C") {
    const tage = tageC(t);
    const faktor = Math.pow(0.99, tage);
    const h = H0 * faktor;
    const oben = BODEN - h;
    figurLicht = Math.min(1, 0.22 + 0.78 * Math.pow(faktor, 0.45));
    if (t > C.uebrig) figurLicht = Math.min(figurLicht, interpolate(t, [C.uebrig, C.uebrig + 0.6], [figurLicht, 0.12], clamp));
    // Muenze faellt heraus
    if (t > C.schlechter - 0.05 && t < C.schlechter + 1.4) {
      const p = interpolate(t, [C.schlechter - 0.05, C.schlechter + 0.6], [0, 1], clamp);
      const x = interpolate(p, [0, 1], [MX, MX + 150]);
      const y = interpolate(p, [0, 0.3, 1], [oben - 10, oben - 70, BODEN - 22]);
      welt.push(<Muenze key="mc" x={x} y={y} r={22} drehung={p * 600} deckkraft={aus(t, C.schlechter + 1.0, 0.35)} />);
    }
    welt.push(<Sockel key="s" x={540} y={BODEN} breite={SB} hoehe={h} hell={0.5 + 0.5 * Math.pow(faktor, 0.3)} />);
    const druck = ein(t, C.uebrig, 0.5);
    welt.push(<Figur key="f" x={FX} y={oben} t={t} licht={figurLicht} stauchen={0.55 * druck} kippen={4 * druck} blick={-0.4 * druck} />);
    const tageAnz = Math.round(tage);
    welt.push(<Zaehler key="z" x={300} y={oben - 120} oben={`TAG ${tageAnz}`} unten={`× ${komma(Math.pow(0.99, tageAnz))}`} deckkraft={ein(t, C.jeden2 + 0.2, 0.35)} />);
  }

  if (phase === "D") {
    const tage = t < C.nur ? 1 : tageD(t);
    const fL = Math.pow(1.01, tage);
    const fR = Math.pow(0.99, tage);
    const oL = BODEN - H0 * fL;
    const oR = BODEN - H0 * fR;
    const XL = 320;
    const XR = 760;
    const trauer = ein(t, C.ende + 0.2, 0.5);
    const freude = Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - (C.ende + 0.25)) / 0.45)) * Math.PI));
    welt.push(<Leuchten key="gl" x={XL} y={oL} r={260} staerke={0.08 + 0.1 * Math.min(1, (fL - 1) / 5)} />);
    welt.push(<Sockel key="sl" x={XL} y={BODEN} breite={200} hoehe={H0 * fL} />);
    welt.push(<Sockel key="sr" x={XR} y={BODEN} breite={200} hoehe={H0 * fR} hell={0.5 + 0.5 * Math.pow(fR, 0.3)} />);
    welt.push(<Figur key="fl" x={XL} y={oL} t={t} huepfen={freude * 60} blick={0.5 * ein(t, C.keinem + 0.3, 0.4) * aus(t, C.nur, 0.3)} />);
    welt.push(
      <Figur key="fr" x={XR} y={oR} t={t + 1.7} licht={Math.min(1, 0.2 + 0.8 * Math.pow(fR, 0.45))} stauchen={0.5 * trauer} blick={-0.5 * ein(t, C.keinem + 0.3, 0.4) * aus(t, C.nur, 0.3)} />,
    );
    const td = Math.round(tage);
    const sk = Math.min(1.8, Math.max(1, 0.9 / kam.zoom));
    welt.push(<Zaehler key="zl" x={XL} y={oL - 230 - 90 * sk} oben={`TAG ${td}`} unten={`× ${komma(Math.pow(1.01, td))}`} skala={sk} deckkraft={ein(t, C.keinem + 0.15, 0.3)} />);
    welt.push(<Zaehler key="zr" x={XR} y={oR - 230 - 90 * sk} oben={`TAG ${td}`} unten={`× ${komma(Math.pow(0.99, td))}`} skala={sk} deckkraft={ein(t, C.keinem + 0.15, 0.3)} />);
  }

  if (phase === "E") {
    const mY = SCHWEBE_Y + Math.sin((t - C.welches) * 2.4) * 7 * aus(t, DAUER - 0.9, 0.7);
    const mDreh = Math.sin((t - C.welches) * 1.3) * 25 * aus(t, DAUER - 0.9, 0.7);
    welt.push(<Leuchten key="gl" x={540} y={BODEN - H0} r={260} staerke={0.08} />);
    welt.push(<Sockel key="s" x={540} y={BODEN} breite={SB} hoehe={H0} />);
    welt.push(<Muenze key="m" x={MX} y={mY} r={28} drehung={mDreh} />);
    welt.push(<Figur key="f" x={FX} y={BODEN - H0} t={t} blick={0.6 * ein(t, C.welches + 0.5, 0.4) * aus(t, DAUER - 0.8, 0.5)} />);
  }

  // Blenden bei harten Wechseln
  const schwarz = Math.max(
    phase === "D" ? aus(t, C.keinem, 0.18) : 0,
    t > C.welches - 0.05 && t < C.welches + 0.6 ? Math.sin(Math.min(1, Math.max(0, (t - C.welches + 0.05) / 0.6)) * Math.PI) : 0,
  );

  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam}>
        <Boden y={BODEN} />
        {welt}
      </Welt>
      {/* Rueckwaerts-Streifen */}
      {t > C.rueck && t < C.rueck + R_ZURUECK ? (
        <AbsoluteFill style={{opacity: Math.sin(((t - C.rueck) / R_ZURUECK) * Math.PI) * 0.5}}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{position: "absolute", left: 0, right: 0, top: ((i * 331 + t * 2400) % 1920), height: 3, background: "rgba(242,242,240,0.35)"}} />
          ))}
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: "#000", opacity: schwarz}} />
      <Audio src={staticFile("beispiel/stimme.wav")} />
      {ton && fassung === "final" ? (
        <>
          <Geraeusch name="muenze_landet" bei={C.besser + 0.05} lautstaerke={0.32} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Geraeusch key={i} name="klack" bei={C.woche + 0.3 + ((i + 0.9) * (C.nichts - 0.15 - C.woche - 0.3)) / 7} lautstaerke={0.16} />
          ))}
          <Geraeusch name="zaehlwerk" bei={C.woche + 0.25} lautstaerke={0.12} />
          <Geraeusch name="rumpeln" bei={C.jahr1 + 0.1} lautstaerke={0.35} />
          <Geraeusch name="muenzen_regen" bei={C.jahr1 + 0.2} lautstaerke={0.16} />
          <Geraeusch name="zaehlwerk" bei={C.jahr1 + 0.3} lautstaerke={0.15} />
          <Geraeusch name="ding" bei={C.acht + 0.35} lautstaerke={0.2} />
          <Geraeusch name="huepfer" bei={C.gut} lautstaerke={0.2} />
          <Geraeusch name="whoosh_rueckwaerts" bei={C.rueck - 0.05} lautstaerke={0.35} />
          <Geraeusch name="muenze" bei={C.schlechter} lautstaerke={0.14} />
          <Geraeusch name="klack_tief" bei={C.schlechter + 0.6} lautstaerke={0.22} />
          <Geraeusch name="zaehlwerk" bei={C.jahr2 + 0.2} lautstaerke={0.15} />
          <Geraeusch name="licht_aus" bei={C.uebrig} lautstaerke={0.3} />
          <Geraeusch name="whoosh_kurz" bei={C.keinem - 0.12} lautstaerke={0.28} />
          <Geraeusch name="rumpeln" bei={C.nur + 0.1} lautstaerke={0.3} />
          <Geraeusch name="ding_tief" bei={C.ende + 0.3} lautstaerke={0.2} />
          <Geraeusch name="whoosh" bei={C.welches - 0.2} lautstaerke={0.26} />
          <Geraeusch name="schimmer" bei={DAUER - 1.5} lautstaerke={0.1} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
