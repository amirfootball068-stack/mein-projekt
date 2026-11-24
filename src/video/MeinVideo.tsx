import React from "react";
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FARBE, MONO, SCHRIFT, Schriften, aus, clamp, ein, zufall} from "../stil";
import {Sternenhimmel} from "../bausteine/Sternenhimmel";
import {KameraZeile, Welt, kameraBei} from "../bausteine/Kamera";
import {Figur} from "../bausteine/Figur";
import {Boden, Leuchten} from "../bausteine/Welt";
import {woerterVon, Zeitstempel} from "../bausteine/zeit";
import ZS from "./zeitstempel.json";

/**
 * „Deine Açaí-Bowl ist mehr als ein hübsches Frühstück“ – Szenenplan: src/video/szenenplan.md
 * Gefaess: breite Glasschale, Toppings in Reihen oben drauf.
 * Gebaut: Szene 1–4 (0 – 12,3 s). Rest folgt im naechsten Stueck.
 */

const Z = ZS as Zeitstempel;
export const MEIN_VIDEO_DAUER = Math.max(3, Z.dauer + 0.6);
const DAUER = MEIN_VIDEO_DAUER;
const {wort} = woerterVon(Z);

// Farben: Weiss = Welt, Violett = Açaí, Gold = Akzent; Toppings in echten Farben
const ACAI = "#7B4FC9";
const ACAI_HELL = "#9C74E0";
const GOLD = "#E8B04A";
const EIS = "#A8DCFF";
const ERDBEERE = "#E5484D";
const BLAUBEERE = "#4B6BDB";
const BANANE = "#F4E3A1";
const GRANOLA = "#C99A5B";

// ---- Stichworte (Sekunden, alle aus den Zeitstempeln) ----
const C = {
  bowl: wort("Açaí-Bowl"),
  mehr: wort("mehr"),
  huebsch: wort("hübsches"),
  fruehstueck: wort("Frühstück"),
  cremig: wort("Cremig"),
  fruchtig: wort("fruchtig"),
  eiskalt: wort("eiskalt"),
  oben: wort("Obendrauf"),
  erd: wort("Erdbeeren"),
  blau: wort("Blaubeeren"),
  banane: wort("Banane"),
  und: wort("Und"),
  granola: wort("Granola"),
  loeffel: wort("Löffel"),
  knackt: wort("knackt"),
  morgens: wort("Morgens"),
};

// ---- Welt ----
const BODEN = 1500;
const FX = 430; // Figur
const BX = 720; // Glasschale

// Kamera-Tabelle: [Sekunde, Zoom, x, y]
const START: KameraZeile = [0, 2.1, BX + 40, 1380];
const KAMERA: KameraZeile[] = [
  START, // nah: Schale faellt herein
  [C.mehr - 0.05, 2.1, BX + 40, 1380],
  [C.mehr + 0.55, 1.3, 600, 1320], // halbnah: Figur + Schale
  [C.huebsch - 0.01, 1.3, 600, 1320],
  [C.huebsch, 1.9, BX + 30, 1290], // Schnitt, nah: Funkeln + Faehnchen
  [C.cremig - 0.01, 1.95, BX + 30, 1290],
  [C.cremig, 2.4, BX, 1330], // Schnitt, nah: Strudel
  [C.fruchtig - 0.05, 2.45, BX, 1330],
  [C.fruchtig + 0.3, 1.9, BX, 1290], // zurueck: Fruechte huepfen
  [C.eiskalt - 0.01, 1.9, BX, 1290],
  [C.eiskalt, 1.35, 600, 1300], // Schnitt, halbnah: Figur zittert
  [C.oben - 0.01, 1.4, 610, 1300],
  [C.oben, 1.6, BX - 30, 1290], // Schnitt: Schale + Zutat
  [C.erd + 0.3, 2.35, BX - 60, 1325], // nah: Erdbeeren
  [C.blau - 0.05, 2.35, BX - 60, 1325],
  [C.blau + 0.3, 2.3, BX - 10, 1320],
  [C.banane - 0.05, 2.3, BX - 10, 1320],
  [C.banane + 0.3, 2.2, BX + 20, 1315],
  [C.und - 0.01, 2.2, BX + 20, 1315],
  [C.und, 1.3, 600, 1280], // Schnitt, halbnah: Figur + Schale
  [C.granola + 0.6, 1.4, 620, 1260],
  [C.loeffel - 0.3, 1.4, 620, 1260],
  [C.loeffel + 0.2, 2.3, BX, 1320], // nah: Loeffel, Knack
  [DAUER, 2.3, BX, 1320],
];

/** Fall mit Schwerkraft: landet genau bei `landet` */
const fall = (t: number, landet: number, dauer: number, y0: number, y1: number) => {
  const p = interpolate(t, [landet - dauer, landet], [0, 1], clamp);
  return y0 + (y1 - y0) * p * p;
};
/** Wurf von (x0,y0) nach (x1,y1), landet genau bei `landet` */
const wurf = (t: number, landet: number, dauer: number, x0: number, y0: number, x1: number, y1: number) => {
  const p = interpolate(t, [landet - dauer, landet], [0, 1], clamp);
  return {x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p * p};
};
/** kleiner Federschwung nach einem Aufprall (0 → 1 → 0) */
const federn = (t: number, t0: number, d = 0.35) => {
  if (t < t0 || t > t0 + d) return 0;
  const p = (t - t0) / d;
  return Math.sin(p * Math.PI) * (1 - p);
};
const leuchtFilter = (farbe: string, r = 14) => ({filter: `drop-shadow(0 0 ${r}px ${farbe})`});

// ---------- Glasschale ----------
const SH = 150; // Schalenhoehe
const SR = 185; // halbe Breite am Rand
const RAND = BODEN - SH; // Oberkante Schale
const TOP = RAND - 6; // Oberflaeche Açaí (leicht gewoelbt ueber dem Rand)
// hier schweben die Zutaten: jede ueber ihrer eigenen Reihe
const ZUTAT_DX = {erdbeeren: -150, blaubeeren: -70, banane: 15, granola: 100};
const ZUTAT_Y = 1175;

/** Eiskristall (Schneeflocke) */
const Kristall = ({x, y, r, o}: {x: number; y: number; r: number; o: number}) => (
  <g transform={`translate(${x} ${y})`} opacity={o} stroke={EIS} strokeWidth={2.5} strokeLinecap="round">
    {[0, 60, 120].map((a) => (
      <line key={a} x1={-r * Math.cos((a * Math.PI) / 180)} y1={-r * Math.sin((a * Math.PI) / 180)} x2={r * Math.cos((a * Math.PI) / 180)} y2={r * Math.sin((a * Math.PI) / 180)} />
    ))}
  </g>
);

/** Durchsichtige Glasschale mit Açaí. oben = was darauf liegt, eis = 0..1, welle = Bewegung der Oberflaeche */
const Glasschale: React.FC<{bx: number; t: number; dy?: number; sq?: number; welle?: number; oben?: React.ReactNode; vorne?: React.ReactNode; eis?: number}> = ({
  bx,
  t,
  dy = 0,
  sq = 0,
  welle = 0,
  oben,
  vorne,
  eis = 0,
}) => {
  const id = `schale${bx}`;
  const koerper = `M ${bx - SR} ${RAND} Q ${bx - SR + 8} ${BODEN} ${bx} ${BODEN} Q ${bx + SR - 8} ${BODEN} ${bx + SR} ${RAND}`;
  const innen = `M ${bx - SR + 9} ${RAND} Q ${bx - SR + 16} ${BODEN - 9} ${bx} ${BODEN - 9} Q ${bx + SR - 16} ${BODEN - 9} ${bx + SR - 9} ${RAND} Z`;
  // gewoelbte, leicht wellige Açaí-Oberflaeche
  const pkt: string[] = [];
  for (let k = 0; k <= 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    const w = 1 + (welle / 40) * Math.sin(a * 4 + t * 3);
    pkt.push(`${(bx + Math.cos(a) * (SR - 12) * w).toFixed(1)},${(TOP + Math.sin(a) * 20 * w).toFixed(1)}`);
  }
  return (
    <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <defs>
        <clipPath id={id}>
          <path d={innen} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${dy}) translate(${bx} ${BODEN}) scale(${1 + 0.1 * sq} ${1 - 0.14 * sq}) translate(${-bx} ${-BODEN})`}>
        <path d={`${koerper} Z`} fill="rgba(242,242,240,0.07)" />
        <g clipPath={`url(#${id})`}>
          <rect x={bx - SR} y={RAND} width={2 * SR} height={SH} fill={ACAI} />
          <path d={`M ${bx - SR} ${RAND + 40} Q ${bx} ${RAND + 70} ${bx + SR} ${RAND + 40}`} stroke={ACAI_HELL} strokeWidth={10} fill="none" opacity={0.5} />
          {eis > 0 ? <rect x={bx - SR} y={RAND} width={2 * SR} height={SH} fill={EIS} opacity={0.18 * eis} /> : null}
        </g>
        <polygon points={pkt.join(" ")} fill={ACAI} />
        <ellipse cx={bx - 50} cy={TOP - 4} rx={60} ry={6} fill={ACAI_HELL} opacity={0.55} />
        <path d={koerper} fill="none" stroke={FARBE.figur} strokeWidth={5} strokeLinejoin="round" style={leuchtFilter("rgba(242,242,240,0.4)", 12)} />
        {eis > 0 ? <path d={koerper} fill="none" stroke={EIS} strokeWidth={6} opacity={eis} style={leuchtFilter("rgba(168,220,255,0.8)", 16)} /> : null}
        <path d={`M ${bx - SR} ${RAND} A ${SR} 22 0 0 0 ${bx + SR} ${RAND}`} fill="none" stroke={eis > 0.5 ? EIS : FARBE.figur} strokeWidth={4} />
        <path d={`M ${bx - SR + 30} ${RAND + 22} Q ${bx - SR + 40} ${BODEN - 30} ${bx - 60} ${BODEN - 16}`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.25} />
        {eis > 0
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Kristall key={i} x={bx - 140 + zufall(i + 5) * 280} y={RAND + 35 + zufall(i + 9) * 80} r={8 + zufall(i) * 8} o={eis * interpolate(eis, [i / 9, i / 9 + 0.3], [0, 1], clamp)} />
            ))
          : null}
        {oben}
      </g>
      {vorne}
    </svg>
  );
};

// ---------- Zutaten (erscheinen gross mit Namen, kippen dann hinein) ----------
type Art = "erdbeeren" | "blaubeeren" | "banane" | "granola";
const ZUTAT_NAME: Record<Art, string> = {erdbeeren: "ERDBEEREN", blaubeeren: "BLAUBEEREN", banane: "BANANE", granola: "GRANOLA"};

const Erdbeere = ({x, y, s = 1, dreh = 0}: {x: number; y: number; s?: number; dreh?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${dreh}) scale(${s})`}>
    <path d="M 0 -16 C 16 -18 22 -2 0 18 C -22 -2 -16 -18 0 -16 Z" fill={ERDBEERE} />
    <path d="M -8 -16 L 0 -22 L 8 -16" stroke="#6FBF73" strokeWidth={4} fill="none" strokeLinecap="round" />
    {[[-6, -4], [5, -2], [-1, 6], [7, 8], [-8, 6]].map(([a, b], i) => (
      <circle key={i} cx={a} cy={b} r={1.6} fill="#FFE9A8" />
    ))}
  </g>
);
const Blaubeere = ({x, y, r = 11}: {x: number; y: number; r?: number}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={BLAUBEERE} />
    <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#FFFFFF" opacity={0.35} />
  </g>
);

const Zutat = ({t, art, auf, kipp}: {t: number; art: Art; auf: number; kipp: number}) => {
  if (t < auf - 0.05 || t > kipp + 0.75) return null;
  const s = ein(t, auf, 0.18) + 0.15 * federn(t, auf + 0.12, 0.35);
  const o = aus(t, kipp + 0.5, 0.25);
  const neig = 75 * ein(t, kipp, 0.25); // kippt nach rechts in die Schale
  let form: React.ReactNode = null;
  const schale = (inhalt: React.ReactNode) => (
    <g transform={`rotate(${neig})`}>
      {inhalt}
      <path d="M -58 -6 L 58 -6 L 44 46 L -44 46 Z" fill="rgba(0,0,0,0.6)" stroke={FARBE.figur} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -50 14 H 50 M -46 30 H 46" stroke={FARBE.linie} strokeWidth={3} />
    </g>
  );
  if (art === "erdbeeren") form = schale([-32, -8, 18, 40, -20, 6].map((x, i) => <Erdbeere key={i} x={x} y={i < 4 ? -14 : -34} s={1.1} dreh={(i - 2) * 12} />));
  if (art === "blaubeeren") form = schale([-36, -14, 8, 30, -25, -3, 19, 6].map((x, i) => <Blaubeere key={i} x={x} y={i < 4 ? -14 : i < 7 ? -32 : -48} r={13} />));
  if (art === "banane")
    form = (
      <g transform={`rotate(${neig * 0.4})`}>
        <path d="M -78 -18 Q -10 52 78 -30 Q 70 -6 60 2 Q -6 38 -66 -6 Z" fill={BANANE} style={leuchtFilter("rgba(244,227,161,0.4)", 10)} />
        <path d="M 78 -30 l 8 -8" stroke="#6B5A2A" strokeWidth={6} strokeLinecap="round" />
        <circle cx={-72} cy={-14} r={4} fill="#6B5A2A" />
      </g>
    );
  if (art === "granola")
    form = (
      <g transform={`rotate(${neig})`}>
        <rect x={-48} y={-62} width={96} height={124} rx={10} fill={GRANOLA} style={leuchtFilter("rgba(201,154,91,0.4)", 10)} />
        <rect x={-48} y={-62} width={96} height={16} rx={4} fill={FARBE.figur} />
        <ellipse cx={0} cy={14} rx={30} ry={24} fill="#8A6435" />
        {[[-12, 6], [8, 18], [-4, 26], [14, 2]].map(([x, y], i) => (
          <rect key={i} x={x - 6} y={y - 4} width={12} height={8} rx={2} fill="#E0B878" />
        ))}
      </g>
    );
  return (
    <g key={`zt${art}`} opacity={o} transform={`translate(${BX + ZUTAT_DX[art]} ${ZUTAT_Y}) scale(${s})`}>
      {form}
      <text x={0} y={100} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={4} fill={FARBE.figur}>
        {ZUTAT_NAME[art]}
      </text>
    </g>
  );
};

/** Toppings fliegen von der Zutat auf die Schale und legen sich in Reihen */
const toppings = (t: number, bx: number) => {
  const n: React.ReactNode[] = [];
  const start = {e: ZUTAT_DX.erdbeeren, b: ZUTAT_DX.blaubeeren, n: ZUTAT_DX.banane, g: ZUTAT_DX.granola} as Record<string, number>;
  const stueck = (key: string, i: number, landet: number, dx: number, y1: number, zeichne: (x: number, y: number) => React.ReactNode) => {
    if (t < landet - 0.35) return;
    const {x, y} = wurf(t, landet, 0.35, bx + start[key] + 30, ZUTAT_Y + 10, bx + dx, y1);
    n.push(<g key={`${key}${i}`}>{zeichne(x, y - 8 * federn(t, landet, 0.3))}</g>);
  };
  // Reihen von links nach rechts: Erdbeeren | Blaubeeren | Banane | Granola
  const reihe = (n0: number, x0: number, x1: number, i: number) => {
    const spalte = i % 2;
    const zeile = Math.floor(i / 2);
    const zeilen = Math.ceil(n0 / 2);
    return {dx: x0 + ((x1 - x0) * (spalte + 0.5)) / 2 + (zeile % 2) * 6, dy: -16 + ((zeile + 0.5) / zeilen) * 30 - 15};
  };
  for (let i = 0; i < 6; i++) {
    const r = reihe(6, -165, -85, i);
    stueck("e", i, C.erd + 0.45 + i * 0.04, r.dx, TOP + r.dy - 8, (x, y) => <Erdbeere x={x} y={y} s={1.05} dreh={(i - 2.5) * 15} />);
  }
  for (let i = 0; i < 8; i++) {
    const r = reihe(8, -80, -5, i);
    stueck("b", i, C.blau + 0.45 + i * 0.03, r.dx, TOP + r.dy - 8, (x, y) => <Blaubeere x={x} y={y} />);
  }
  for (let i = 0; i < 6; i++) {
    const r = reihe(6, 0, 80, i);
    stueck("n", i, C.banane + 0.45 + i * 0.04, r.dx, TOP + r.dy - 6, (x, y) => (
      <g>
        <ellipse cx={x} cy={y} rx={18} ry={9} fill={BANANE} />
        <ellipse cx={x} cy={y} rx={7} ry={3} fill="#D9CC98" />
      </g>
    ));
  }
  for (let i = 0; i < 16; i++) {
    const r = reihe(16, 85, 165, i);
    stueck("g", i, C.granola + 0.45 + i * 0.02, r.dx + (zufall(i) - 0.5) * 14, TOP + r.dy - 8, (x, y) => (
      <rect x={x - 7} y={y - 5} width={14} height={10} rx={2} fill={GRANOLA} transform={`rotate(${zufall(i + 7) * 90} ${x} ${y})`} />
    ));
  }
  return n;
};

// ---------- Effekte Szene 1 + 2 ----------
const Funkeln = ({t, bx}: {t: number; bx: number}) => {
  if (t < C.huebsch || t > C.huebsch + 1.2) return null;
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t0 = C.huebsch + i * 0.08;
        const p = interpolate(t, [t0, t0 + 0.7], [0, 1], clamp);
        const s = Math.sin(p * Math.PI);
        const a = (i / 6) * Math.PI * 2 + 0.4;
        const x = bx + Math.cos(a) * 240;
        const y = RAND + 10 + Math.sin(a) * 140;
        return (
          <path
            key={i}
            d={`M ${x} ${y - 22 * s} Q ${x} ${y} ${x + 22 * s} ${y} Q ${x} ${y} ${x} ${y + 22 * s} Q ${x} ${y} ${x - 22 * s} ${y} Q ${x} ${y} ${x} ${y - 22 * s} Z`}
            fill={i % 2 ? GOLD : FARBE.figur}
            style={leuchtFilter("rgba(232,176,74,0.7)", 10)}
          />
        );
      })}
    </>
  );
};

/** Cremiger Strudel auf der Oberflaeche */
const Strudel = ({t, bx}: {t: number; bx: number}) => {
  const o = ein(t, C.cremig, 0.15) * aus(t, C.oben, 0.3);
  if (o <= 0) return null;
  const zeichnen = ein(t, C.cremig, 0.5);
  const pkt: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const a = (k / 60) * Math.PI * 5 + t * 2.2;
    const r = (k / 60) * 150;
    pkt.push(`${(bx + Math.cos(a) * r).toFixed(1)},${(TOP - 2 + Math.sin(a) * r * 0.13).toFixed(1)}`);
  }
  return (
    <polyline
      points={pkt.join(" ")}
      fill="none"
      stroke={ACAI_HELL}
      strokeWidth={6}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={`${zeichnen} 1`}
      opacity={o}
      style={leuchtFilter("rgba(156,116,224,0.6)", 6)}
    />
  );
};

/** Fruchtstuecke huepfen auf „fruchtig“ aus der Schale und wieder hinein */
const Fruchthuepfer = ({t, bx}: {t: number; bx: number}) => {
  const n: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const t0 = C.fruchtig + i * 0.05;
    const p = interpolate(t, [t0, t0 + 0.7], [0, 1], clamp);
    if (p <= 0 || p >= 1) continue;
    const dx = (i - 2.5) * 55;
    const x = bx + dx * (1 + 0.6 * p);
    const y = TOP - 10 - 4 * 220 * p * (1 - p);
    n.push(i % 2 ? <Blaubeere key={i} x={x} y={y} r={13} /> : <Erdbeere key={i} x={x} y={y} s={1.1} dreh={p * 200} />);
  }
  return <>{n}</>;
};

/** Kalter Nebel ueber der Schale */
const Nebel = ({t, bx, eis}: {t: number; bx: number; eis: number}) => {
  if (eis <= 0) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = ((t - C.eiskalt) * 0.6 + i / 3) % 1;
        return <ellipse key={i} cx={bx - 90 + i * 90 + Math.sin(t * 2 + i) * 15} cy={RAND - 20 - p * 160} rx={50 + p * 40} ry={16 + p * 10} fill={FARBE.figur} opacity={0.14 * eis * Math.sin(p * Math.PI)} style={{filter: "blur(10px)"}} />;
      })}
    </>
  );
};

/** Loeffel: taucht auf „Löffel“ ein, knackt auf „knackt“, hebt dann eine Ladung heraus */
const Loeffel = ({t, bx}: {t: number; bx: number}) => {
  const t0 = C.loeffel;
  const hoch = C.knackt + 0.3;
  if (t < t0 - 0.4 || t > hoch + 0.9) return null;
  const rein = interpolate(t, [t0 - 0.4, t0], [0, 1], clamp);
  const raus = interpolate(t, [hoch, hoch + 0.8], [0, 1], clamp);
  const zittern = federn(t, C.knackt, 0.3) * 6;
  const x = bx + 30 + 260 * (1 - rein) * (1 - rein) + 200 * raus * raus;
  const y = TOP - 34 - 520 * (1 - rein) * (1 - rein) - 640 * raus * raus + zittern;
  const dreh = -45 + 20 * rein - 25 * raus;
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh})`}>
      <rect x={20} y={-6} width={280} height={12} rx={6} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)")} />
      <ellipse cx={0} cy={0} rx={38} ry={24} fill={FARBE.figur} />
      {raus > 0 ? (
        <>
          <ellipse cx={0} cy={-6} rx={30} ry={14} fill={ACAI} />
          <rect x={-14} y={-24} width={14} height={10} rx={2} fill={GRANOLA} />
          <circle cx={10} cy={-16} r={7} fill={BLAUBEERE} />
        </>
      ) : null}
    </g>
  );
};

/** Knack: Lichtblitz, Strahlen, Kruemel springen */
const Knack = ({t, bx}: {t: number; bx: number}) => {
  const p = interpolate(t, [C.knackt, C.knackt + 0.5], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  const cx = bx + 30;
  const cy = TOP - 40;
  const o = 1 - p;
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const r0 = 40 + 60 * p;
        const r1 = r0 + 40 * (1 - p);
        return <line key={`s${i}`} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0 * 0.8} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1 * 0.8} stroke={GOLD} strokeWidth={6} strokeLinecap="round" opacity={o} />;
      })}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const dx = (i - 2.5) * 30;
        const x = cx + dx * (1 + 2 * p);
        const y = cy - 4 * 150 * p * (1 - p) + 60 * p * p;
        return <rect key={`k${i}`} x={x - 6} y={y - 4} width={12} height={8} rx={2} fill={GRANOLA} opacity={o} transform={`rotate(${p * 300 + i * 40} ${x} ${y})`} />;
      })}
    </>
  );
};

/** Faehnchen, faellt in die Schale und steckt auf t0 */
const fahne = (t: number, bx: number, t0: number, text: string, basis: number, farbe = FARBE.figur, o = 1) => {
  if (t < t0 - 0.35 || o <= 0) return null;
  const yy = fall(t, t0, 0.35, basis - 700, basis);
  const wippen = 8 * federn(t, t0, 0.5);
  const b = text.length * 15 + 26;
  return (
    <g key={`f${text}`} opacity={o} transform={`translate(${bx + 60} ${yy}) rotate(${8 + wippen})`}>
      <rect x={-2.5} y={-250} width={5} height={258} fill={FARBE.figur} rx={2} />
      <rect x={2} y={-250} width={b} height={44} rx={4} fill={farbe} style={leuchtFilter("rgba(242,242,240,0.35)")} />
      <text x={2 + b / 2} y={-220} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={3} fill="#111">
        {text}
      </text>
    </g>
  );
};

/** Haupt-Glasschale */
const HauptSchale: React.FC<{t: number; eis: number}> = ({t, eis}) => {
  const dy = fall(t, C.bowl, C.bowl, -400, 0);
  const sq = federn(t, C.bowl, 0.4);
  const spritzer: React.ReactNode[] = [];
  if (t > C.bowl && t < C.bowl + 0.7) {
    const p = (t - C.bowl) / 0.7;
    [-1, -0.4, 0.5, 1].forEach((r, i) => {
      const sx = BX + r * (60 + 230 * p);
      const sy = RAND - 10 - (520 + 80 * (i % 2)) * p + 640 * p * p;
      spritzer.push(<circle key={`sp${i}`} cx={sx} cy={sy} r={12 - 1.5 * i} fill={ACAI} opacity={1 - p * p} />);
    });
  }
  const welle = 1.5 + 6 * ein(t, C.cremig, 0.3) * aus(t, C.fruchtig + 0.4, 0.4);
  return (
    <Glasschale
      bx={BX}
      t={t}
      dy={dy}
      sq={sq}
      eis={eis}
      welle={welle}
      oben={
        <>
          <Strudel t={t} bx={BX} />
          {toppings(t, BX)}
          {fahne(t, BX, C.fruehstueck, "FRÜHSTÜCK", TOP, GOLD, aus(t, C.oben - 0.2, 0.2))}
        </>
      }
      vorne={
        <>
          {spritzer}
          <Funkeln t={t} bx={BX} />
          <Fruchthuepfer t={t} bx={BX} />
          <Nebel t={t} bx={BX} eis={eis} />
          <Zutat t={t} art="erdbeeren" auf={C.erd} kipp={C.erd + 0.25} />
          <Zutat t={t} art="blaubeeren" auf={C.blau} kipp={C.blau + 0.25} />
          <Zutat t={t} art="banane" auf={C.banane} kipp={C.banane + 0.25} />
          <Zutat t={t} art="granola" auf={C.granola} kipp={C.granola + 0.25} />
          <Loeffel t={t} bx={BX} />
          <Knack t={t} bx={BX} />
        </>
      }
    />
  );
};

// ---------- Untertitel: Wort fuer Wort ----------
const GOLD_WOERTER = ["frühstück", "erdbeeren", "knackt", "morgens", "nachmittags", "abends", "toppings"];
const EIS_WOERTER = ["eiskalt"];
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
  const klein = text.toLowerCase();
  const farbe = EIS_WOERTER.includes(klein) ? EIS : GOLD_WOERTER.includes(klein) ? GOLD : FARBE.figur;
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
        color: farbe,
        textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)",
        opacity: pop,
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
  let kam = kameraBei(t, KAMERA);
  // kurzes Wackeln beim Knacken
  const wackeln = federn(t, C.knackt, 0.35);
  if (wackeln > 0) kam = {...kam, x: kam.x + 10 * wackeln * Math.sin(t * 90), y: kam.y + 6 * wackeln * Math.sin(t * 70)};

  // Eis: kommt auf „eiskalt“, bleibt leicht frostig
  const eis = ein(t, C.eiskalt, 0.4) * (1 - 0.6 * ein(t, C.oben, 0.6));

  // Figur
  const freude = (t0: number) => Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - t0) / 0.45)) * Math.PI));
  const huepfen = 55 * freude(C.fruehstueck) + 60 * freude(C.knackt);
  const zittern = ein(t, C.eiskalt, 0.2) * aus(t, C.oben - 0.2, 0.3);

  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} />
      <Welt kam={kam}>
        <Boden y={BODEN} />
        <Leuchten
          x={BX}
          y={RAND + 60}
          r={300}
          staerke={0.09 * ein(t, C.bowl, 0.1) + 0.4 * ein(t, C.bowl, 0.05) * aus(t, C.bowl + 0.06, 0.5) + 0.35 * federn(t, C.knackt, 0.4)}
        />
        <HauptSchale t={t} eis={eis} />
        <Figur x={FX} y={BODEN} t={t} blick={0.6} huepfen={huepfen} zittern={zittern} />
      </Welt>
      <Untertitel t={t} />
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
