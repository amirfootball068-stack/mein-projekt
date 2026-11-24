import React from "react";
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FARBE, MONO, SCHRIFT, Schriften, aus, clamp, ein, zufall} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {KameraZeile, Welt, kameraBei} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden, Leuchten, Zaehler} from "../bausteine/Welt";
import {woerterVon, Zeitstempel} from "../bausteine/zeit";
import ZS from "./zeitstempel.json";

/**
 * „Deine Açaí-Bowl ist ein Dessert“ – Szenenplan: src/video/szenenplan.md
 * Gebaut: Szene 1–4 (0 – 10,4 s). Rest folgt in den naechsten Stuecken.
 */

const Z = ZS as Zeitstempel;
export const MEIN_VIDEO_DAUER = Math.max(3, Z.dauer + 0.6);
const {wort} = woerterVon(Z);

// Farben fuer dieses Video: Weiss = Welt, Violett = Açaí, Gold = Zucker
const ACAI = "#7B4FC9";
const ACAI_HELL = "#9C74E0";
const GOLD = "#E8B04A";

// ---- Stichworte (Sekunden, alle aus den Zeitstempeln) ----
const C = {
  ist: wort("ist", 1),
  dessert: wort("Dessert", 1),
  die: wort("Die"),
  beere: wort("Beere"),
  schmeckt: wort("schmeckt"),
  kaum: wort("kaum"),
  erdig: wort("erdig"),
  darum: wort("Darum"),
  pueree: wort("Püree", 1),
  gesuesst: wort("gesüßt"),
  oben: wort("Obendrauf"),
  banane: wort("Banane"),
  granola: wort("Granola"),
  honig: wort("Honig"),
  am: wort("Am"),
};

// ---- Welt ----
const BODEN = 1500;
const FX = 430; // Figur
const BX = 720; // Bowl
const BEERE_X = 270;
const SX = 2400; // Laden (weiter rechts in der Welt)
const REGAL_Y = 1380;
const OBERFLAECHE = BODEN - 132; // Oberseite der Bowl-Fuellung

// Kamera-Tabelle: [Sekunde, Zoom, x, y]
const KAMERA: KameraZeile[] = [
  [0, 2.1, BX + 40, 1420], // nah: Bowl
  [C.ist - 0.1, 2.1, BX + 40, 1420],
  [C.ist + 0.5, 1.3, 600, 1340], // halbnah: Figur + Bowl
  [C.die - 0.01, 1.3, 600, 1340],
  [C.die, 2.0, 320, 1400], // Schnitt, nah: hier landet die Beere
  [C.kaum - 0.2, 2.0, 350, 1385],
  [C.kaum + 0.45, 1.4, 420, 1300], // halbnah: Figur, Beere, Messgeraet
  [C.darum - 0.01, 1.5, 430, 1310],
  [C.darum, 0.75, SX, 1150], // Schnitt, Totale: Laden
  [C.pueree - 0.1, 0.8, SX, 1160],
  [C.pueree + 0.6, 1.4, SX + 40, 1250], // halbnah: Beutel
  [C.gesuesst - 0.1, 1.45, SX + 40, 1250],
  [C.gesuesst + 0.3, 1.9, SX + 40, 1220], // nah: Zucker faellt
  [C.oben - 0.01, 1.95, SX + 40, 1220],
  [C.oben, 1.35, 600, 1300], // Schnitt, halbnah: Bowl, Figur, Zaehler
  [C.granola - 0.2, 1.45, 640, 1320],
  [C.honig - 0.1, 1.5, 660, 1330],
  [C.honig + 0.4, 2.1, BX, 1400], // nah: Honig
  [MEIN_VIDEO_DAUER, 2.1, BX, 1400],
];

/** Fall mit Schwerkraft: landet genau bei `landet` */
const fall = (t: number, landet: number, dauer: number, y0: number, y1: number) => {
  const p = interpolate(t, [landet - dauer, landet], [0, 1], clamp);
  return y0 + (y1 - y0) * p * p;
};
/** kleiner Federschwung nach einem Aufprall (0 → 1 → 0) */
const federn = (t: number, t0: number, d = 0.35) => {
  if (t < t0 || t > t0 + d) return 0;
  const p = (t - t0) / d;
  return Math.sin(p * Math.PI) * (1 - p);
};

const leuchtFilter = (farbe: string, r = 14) => ({filter: `drop-shadow(0 0 ${r}px ${farbe})`});

// ---------- Bowl ----------
const Bowl: React.FC<{t: number}> = ({t}) => {
  const y = BODEN;
  const surf = OBERFLAECHE;
  // Toppings
  const teile: React.ReactNode[] = [];
  // Banane: 5 Scheiben, die erste landet genau auf „Banane“
  for (let i = 0; i < 5; i++) {
    const landet = C.banane + i * 0.07;
    if (t < landet - 0.45) continue;
    const zx = BX - 90 + i * 45 + (zufall(i) - 0.5) * 14;
    const zy = surf - 6 + (i % 2) * 8;
    const yy = fall(t, landet, 0.45, zy - 620, zy) - 14 * federn(t, landet, 0.3);
    teile.push(
      <g key={`b${i}`} transform={`translate(${zx} ${yy}) rotate(${(zufall(i + 3) - 0.5) * 30})`}>
        <ellipse rx={21} ry={11} fill="#F4EBC6" />
        <ellipse rx={8} ry={4} fill="#D9CC98" />
      </g>,
    );
  }
  // Granola: 16 Brocken
  for (let i = 0; i < 16; i++) {
    const landet = C.granola + (i / 15) * 0.4;
    if (t < landet - 0.4) continue;
    const a = zufall(i + 20) * Math.PI * 2;
    const r = Math.sqrt(zufall(i + 40));
    const zx = BX + Math.cos(a) * 115 * r;
    const zy = surf - 14 + Math.sin(a) * 14 * r;
    const yy = fall(t, landet, 0.4, zy - 560, zy);
    const s = 6 + zufall(i + 60) * 5;
    teile.push(<rect key={`g${i}`} x={zx - s} y={yy - s * 0.7} width={2 * s} height={1.4 * s} rx={3} fill="#C99A5B" transform={`rotate(${zufall(i) * 90} ${zx} ${yy})`} />);
  }
  // Honig: Faden von oben, dann Lache
  const honigStart = C.honig - 0.25;
  if (t > honigStart) {
    const unten = interpolate(t, [honigStart, C.honig], [surf - 700, surf - 18], clamp);
    const oben = interpolate(t, [C.honig + 0.5, C.honig + 0.9], [surf - 700, surf - 18], clamp);
    const wackeln = Math.sin(t * 9) * 4;
    if (oben < unten - 2)
      teile.push(<path key="hf" d={`M ${BX + 10} ${oben} Q ${BX + 10 + wackeln} ${(oben + unten) / 2} ${BX} ${unten}`} stroke={GOLD} strokeWidth={7} fill="none" strokeLinecap="round" style={leuchtFilter("rgba(232,176,74,0.7)", 10)} />);
    const lache = ein(t, C.honig, 0.9);
    if (lache > 0) {
      teile.push(<ellipse key="hl" cx={BX} cy={surf - 16} rx={90 * lache} ry={12 * lache} fill={GOLD} opacity={0.9} style={leuchtFilter("rgba(232,176,74,0.6)", 12)} />);
      teile.push(<path key="hs" d={`M ${BX - 60 * lache} ${surf - 16} Q ${BX} ${surf - 30} ${BX + 60 * lache} ${surf - 14}`} stroke="#F6D58E" strokeWidth={4} fill="none" opacity={0.8 * lache} />);
    }
  }
  // Faehnchen „DESSERT“: faellt hinein und steckt auf „Dessert“
  const fahneT = C.dessert;
  let fahne: React.ReactNode = null;
  if (t > fahneT - 0.35) {
    const yy = fall(t, fahneT, 0.35, surf - 700, surf - 20);
    const wippen = 8 * federn(t, fahneT, 0.5);
    fahne = (
      <g transform={`translate(${BX + 70} ${yy}) rotate(${8 + wippen})`}>
        <rect x={-2.5} y={-170} width={5} height={180} fill={FARBE.figur} rx={2} />
        <rect x={2} y={-170} width={132} height={44} rx={4} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)")} />
        <text x={68} y={-140} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={3} fill="#111">
          DESSERT
        </text>
      </g>
    );
  }
  return (
    <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {/* Schale */}
      <path d={`M ${BX - 160} ${y - 120} Q ${BX - 150} ${y - 4} ${BX} ${y - 2} Q ${BX + 150} ${y - 4} ${BX + 160} ${y - 120} Z`} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)", 16)} />
      {/* Fuellung */}
      <ellipse cx={BX} cy={y - 120} rx={160} ry={24} fill={FARBE.figur} />
      <path d={`M ${BX - 148} ${y - 120} Q ${BX} ${surf - 34} ${BX + 148} ${y - 120} Q ${BX} ${y - 100} ${BX - 148} ${y - 120} Z`} fill={ACAI} />
      <ellipse cx={BX - 40} cy={surf - 6} rx={50} ry={7} fill={ACAI_HELL} opacity={0.6} />
      {teile}
      {fahne}
    </svg>
  );
};

// ---------- Beere ----------
const Beere: React.FC<{t: number}> = ({t}) => {
  if (t < C.beere - 0.4 || t > C.darum) return null;
  const r = 26;
  const ruhe = BODEN - r;
  const y = fall(t, C.beere, 0.4, ruhe - 700, ruhe) - 40 * federn(t, C.beere, 0.4);
  const blitz = ein(t, C.beere, 0.05) * aus(t, C.beere + 0.06, 0.4);
  return (
    <>
      {blitz > 0 ? <Leuchten x={BEERE_X} y={BODEN} r={120} staerke={0.35 * blitz} /> : null}
      <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <circle cx={BEERE_X} cy={y} r={r} fill={ACAI} style={leuchtFilter("rgba(156,116,224,0.6)", 16)} />
        <circle cx={BEERE_X - 8} cy={y - 9} r={7} fill="#FFFFFF" opacity={0.35} />
        <path d={`M ${BEERE_X} ${y - r} l -4 -12 M ${BEERE_X} ${y - r} l 6 -10`} stroke={FARBE.figur} strokeWidth={3} strokeLinecap="round" />
      </svg>
    </>
  );
};

// ---------- Messgeraet „SUESSE“ ----------
const SuesseMesser: React.FC<{t: number}> = ({t}) => {
  const o = ein(t, C.kaum, 0.3) * aus(t, C.darum - 0.05, 0.05);
  if (o <= 0) return null;
  const fuell = 0.12 * ein(t, C.kaum + 0.1, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: BEERE_X,
        top: BODEN - 250,
        transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * ein(t, C.kaum, 0.25)})`,
        opacity: o,
        padding: "14px 20px",
        border: `2px solid ${FARBE.linie}`,
        borderRadius: 12,
        background: "rgba(0,0,0,0.75)",
        fontFamily: MONO,
        color: FARBE.grau,
        textAlign: "center",
      }}
    >
      <div style={{fontSize: 20, letterSpacing: 4}}>SÜSSE</div>
      <div style={{width: 200, height: 18, marginTop: 10, border: `2px solid ${FARBE.linie}`, borderRadius: 9, overflow: "hidden"}}>
        <div style={{width: `${fuell * 100}%`, height: "100%", background: GOLD, boxShadow: `0 0 12px ${GOLD}`}} />
      </div>
    </div>
  );
};

// ---------- Laden ----------
const Laden: React.FC<{t: number}> = ({t}) => {
  const regalB = 620;
  const beutelB = 150;
  const beutelH = 210;
  const by = REGAL_Y; // Unterkante Beutel
  const top = by - beutelH;
  const wuerfel: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const landet = C.gesuesst + i * 0.08;
    if (t < landet - 0.4 || t > landet + 0.05) continue;
    const x = SX - 30 + (i % 3) * 30 + (zufall(i + 7) - 0.5) * 16;
    const y = fall(t, landet, 0.4, top - 520, top + 10);
    wuerfel.push(<rect key={i} x={x - 13} y={y - 13} width={26} height={26} rx={3} fill={FARBE.figur} transform={`rotate(${(t - landet) * 300 + i * 25} ${x} ${y})`} style={leuchtFilter("rgba(242,242,240,0.5)", 8)} />);
  }
  const beben = 6 * federn(t, C.gesuesst, 0.5);
  const andere = [-220, -130, 130, 220];
  return (
    <>
      {/* Schild */}
      <div
        style={{
          position: "absolute",
          left: SX,
          top: 880,
          transform: "translate(-50%, -50%)",
          padding: "12px 34px",
          border: `2px solid ${FARBE.figur}`,
          borderRadius: 10,
          fontFamily: MONO,
          fontSize: 40,
          letterSpacing: 12,
          color: FARBE.figur,
          textShadow: "0 0 18px rgba(242,242,240,0.6)",
          boxShadow: "0 0 26px rgba(242,242,240,0.25)",
        }}
      >
        LADEN
      </div>
      <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {/* Regal */}
        <rect x={SX - regalB / 2} y={REGAL_Y} width={regalB} height={8} rx={3} fill={FARBE.figur} opacity={0.85} />
        <rect x={SX - regalB / 2} y={1100} width={regalB} height={8} rx={3} fill={FARBE.figur} opacity={0.5} />
        <rect x={SX - regalB / 2} y={1100} width={6} height={BODEN - 1100} fill={FARBE.figur} opacity={0.4} />
        <rect x={SX + regalB / 2 - 6} y={1100} width={6} height={BODEN - 1100} fill={FARBE.figur} opacity={0.4} />
        {/* andere Produkte, nur Umrisse */}
        {andere.map((dx, i) => (
          <rect key={i} x={SX + dx - 34} y={REGAL_Y - 120 - (i % 2) * 30} width={68} height={120 + (i % 2) * 30} rx={8} fill="none" stroke={FARBE.linie} strokeWidth={2} />
        ))}
        {[-200, -60, 80, 200].map((dx, i) => (
          <rect key={`o${i}`} x={SX + dx - 40} y={1100 - 110} width={80} height={110} rx={8} fill="none" stroke={FARBE.linie} strokeWidth={2} />
        ))}
        {wuerfel}
        {/* Pueree-Beutel */}
        <g transform={`translate(0 ${-beben})`}>
          <path d={`M ${SX - beutelB / 2} ${by} L ${SX - beutelB / 2 + 6} ${top + 20} L ${SX + beutelB / 2 - 6} ${top + 20} L ${SX + beutelB / 2} ${by} Z`} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)", 16)} />
          <rect x={SX - beutelB / 2 + 6} y={top} width={beutelB - 12} height={24} rx={4} fill={FARBE.figur} />
          <rect x={SX - beutelB / 2 + 4} y={top + 70} width={beutelB - 8} height={70} fill={ACAI} />
          <text x={SX} y={top + 114} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={FARBE.figur}>
            AÇAÍ
          </text>
          <text x={SX} y={top + 170} textAnchor="middle" fontFamily={MONO} fontSize={15} letterSpacing={2} fill="#333">
            PÜREE
          </text>
        </g>
      </svg>
    </>
  );
};

// ---------- Zucker-Zaehler ----------
// grobe Richtwerte (Gramm Zucker): gesuesstes Pueree, Banane, Granola, Honig
const ZUCKER: [number, number][] = [
  [C.gesuesst + 0.1, 12],
  [C.banane + 0.05, 9],
  [C.granola + 0.05, 8],
  [C.honig + 0.1, 17],
];
const zuckerBei = (t: number) => {
  let g = 0;
  for (const [t0, plus] of ZUCKER) g += plus * interpolate(t, [t0, t0 + 0.35], [0, 1], clamp);
  return Math.round(g);
};

// ---------- Untertitel: Wort fuer Wort ----------
const SCHLUESSEL = ["dessert", "süß", "gesüßt", "honig", "zucker"];
const ohneZeichen = (s: string) => s.replace(/[.,!?;:]/g, "");

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
  const pop = ein(t, x.von, 0.14);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1920 * 0.78,
        transform: `translateY(-50%) scale(${0.86 + 0.14 * pop})`,
        textAlign: "center",
        fontFamily: SCHRIFT,
        fontWeight: 700,
        fontSize: 96,
        color: farbig ? GOLD : FARBE.figur,
        textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
        opacity: 0.4 + 0.6 * pop,
      }}
    >
      {text}
    </div>
  );
};

export const MeinVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const kam = kameraBei(t, KAMERA);

  const imLaden = t >= C.darum && t < C.oben;

  // Figur: schaut zur Bowl, dann zur Beere; beugt sich zum Probieren, kippt bei „erdig“ (Zweifel)
  const zurBeere = ein(t, C.beere, 0.3) * aus(t, C.darum, 0.1);
  const probieren = ein(t, C.schmeckt, 0.35) * aus(t, C.erdig - 0.1, 0.3);
  const zweifel = ein(t, C.erdig, 0.35) * aus(t, C.darum, 0.1);
  const druck = ein(t, C.honig + 0.2, 0.5);
  const blick = t < C.beere ? 0.6 : t < C.oben ? -0.9 * zurBeere : 0.7;

  const zZ = ein(t, C.gesuesst, 0.3);
  const zuckerZaehler = (x: number, y: number, o: number) =>
    o > 0 ? <Zaehler key={`z${x}`} x={x} y={y} oben="ZUCKER" unten={`${zuckerBei(t)} g`} deckkraft={o} skala={1 + 0.12 * federn(t, C.gesuesst + 0.1, 0.4)} /> : null;

  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam}>
        <Boden y={BODEN} />
        {imLaden ? (
          <>
            <Leuchten x={SX} y={REGAL_Y - 100} r={320} staerke={0.08} />
            <Laden t={t} />
            {zuckerZaehler(SX + 230, 1230, zZ)}
          </>
        ) : (
          <>
            <Leuchten x={BX} y={OBERFLAECHE} r={300} staerke={0.07 + 0.08 * ein(t, C.honig, 0.6)} />
            <Bowl t={t} />
            <Beere t={t} />
            <SuesseMesser t={t} />
            <Figur x={FX} y={BODEN} t={t} blick={blick} kippen={-7 * probieren + 10 * zweifel} stauchen={0.25 * druck} />
            {t >= C.oben ? zuckerZaehler(FX, 1150, 1) : null}
          </>
        )}
      </Welt>
      <Untertitel t={t} />
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
