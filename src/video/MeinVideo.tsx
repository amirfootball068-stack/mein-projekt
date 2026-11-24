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
 * Szene 1–8 gebaut. Letztes Bild = erstes Bild (Becher schwebt oben, faellt dann hinein).
 */

const Z = ZS as Zeitstempel;
export const MEIN_VIDEO_DAUER = Math.max(3, Z.dauer + 0.6);
const DAUER = MEIN_VIDEO_DAUER;
const {wort, wortEnde} = woerterVon(Z);

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
  start: wort("Start"),
  nachmittags: wort("Nachmittags"),
  kleiner: wort("kleiner"),
  snack: wort("Snack"),
  abends: wort("Abends"),
  belohnung: wort("Belohnung"),
  langen: wort("langen"),
  welche: wort("Welche"),
  toppings: wort("Toppings"),
  deiner: wort("deiner"),
  nie: wort("nie"),
  fehlen: wort("fehlen"),
  schleife: wortEnde("fehlen") + 0.15, // Schnitt zurueck zum Startbild
};
const ABSPRUNG = DAUER - C.bowl; // Becher springt hoch und haengt im letzten Bild genau wie im ersten

// ---- Welt ----
const BODEN = 1500;
const FX = 430; // Figur
const BX = 720; // Becher
const MX = BX + 290; // kleiner Snack-Becher

// Kamera-Tabelle: [Sekunde, Zoom, x, y]
const START: KameraZeile = [0, 2.1, BX + 40, 1380];
const KAMERA: KameraZeile[] = [
  START, // nah: Becher faellt herein
  [C.mehr - 0.05, 2.1, BX + 40, 1380],
  [C.mehr + 0.55, 1.3, 600, 1320], // halbnah: Figur + Becher
  [C.huebsch - 0.01, 1.3, 600, 1320],
  [C.huebsch, 1.9, BX + 30, 1290], // Schnitt, nah: Funkeln + Faehnchen
  [C.cremig - 0.01, 1.95, BX + 30, 1290],
  [C.cremig, 2.4, BX, 1330], // Schnitt, nah: Strudel
  [C.fruchtig - 0.05, 2.45, BX, 1330],
  [C.fruchtig + 0.3, 1.6, BX, 1245], // zurueck: Fruechte huepfen
  [C.eiskalt - 0.01, 1.6, BX, 1245],
  [C.eiskalt, 1.35, 600, 1300], // Schnitt, halbnah: Figur zittert
  [C.oben - 0.01, 1.4, 610, 1300],
  [C.oben, 1.4, BX - 40, 1220], // Schnitt: Becher + Zutat
  [C.erd + 0.3, 1.9, BX - 40, 1285], // nah: Erdbeeren
  [C.blau - 0.05, 1.9, BX - 40, 1285],
  [C.blau + 0.3, 1.75, BX - 20, 1265],
  [C.banane - 0.05, 1.75, BX - 20, 1265],
  [C.banane + 0.3, 1.6, BX, 1245],
  [C.und - 0.01, 1.6, BX, 1245],
  [C.und, 1.3, 600, 1280], // Schnitt, halbnah: Figur + Becher
  [C.granola + 0.6, 1.4, 620, 1260],
  [C.loeffel - 0.3, 1.4, 620, 1260],
  [C.loeffel + 0.2, 2.3, BX, 1320], // nah: Loeffel, Knack
  [C.morgens - 0.01, 2.3, BX, 1320],
  [C.morgens, 1.0, 650, 1250], // Schnitt, Totale: Sonnenaufgang
  [C.start - 0.1, 1.05, 650, 1250],
  [C.start + 0.45, 1.35, 590, 1320], // halbnah: Figur huepft los
  [C.nachmittags - 0.01, 1.38, 590, 1320],
  [C.nachmittags, 0.9, 720, 1150], // Schnitt, Totale: Sonne hoch
  [C.kleiner - 0.05, 0.95, 720, 1160],
  [C.kleiner + 0.4, 1.7, MX - 120, 1330], // nah: Snack-Becher
  [C.abends - 0.01, 1.75, MX - 120, 1330],
  [C.abends, 1.0, 620, 1200], // Schnitt, Totale: Mond
  [C.belohnung - 0.3, 1.05, 620, 1210],
  [C.belohnung + 0.3, 1.9, BX, 1290], // nah: Stern
  [C.langen - 0.2, 1.95, BX, 1290],
  [C.langen + 0.25, 1.35, 590, 1320], // halbnah: Figur muede
  [C.welche - 0.01, 1.38, 590, 1320],
  [C.welche, 2.0, BX, 1320], // Schnitt, nah: Becher
  [C.toppings + 0.2, 2.0, BX, 1320],
  [C.toppings + 0.7, 1.3, 640, 1250], // halbnah: Toppings kreisen, Figur mit ?
  [C.schleife - 0.01, 1.35, 640, 1255],
  [C.schleife, START[1], START[2], START[3]], // Schnitt: Startbild
  [DAUER, START[1], START[2], START[3]],
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

// ---------- Becher ----------
const BH = 300; // Becherhoehe
const TW = 125; // halbe Breite oben
const BW = 88; // halbe Breite unten
const RAND = BODEN - BH; // Oberkante Becher
const TOP = 1250; // Oberflaeche Açaí
const ZUTAT_X = BX - 75; // hier schweben die Zutaten
const ZUTAT_Y = 1045;

/** Schicht im Becher von yTop bis yBot, optional mit welliger Oberkante */
const schicht = (key: string, bx: number, yTop: number, yBot: number, farbe: string, welle = 0, t = 0) => {
  const pkt: string[] = [];
  for (let k = 0; k <= 16; k++) {
    const x = bx - TW + (k / 16) * 2 * TW;
    pkt.push(`${x.toFixed(1)},${(yTop + welle * Math.sin(k * 1.3 + t * 3)).toFixed(1)}`);
  }
  pkt.push(`${bx + TW},${yBot}`, `${bx - TW},${yBot}`);
  return <polygon key={key} points={pkt.join(" ")} fill={farbe} />;
};

/** Eiskristall (Schneeflocke) */
const Kristall = ({x, y, r, o}: {x: number; y: number; r: number; o: number}) => (
  <g transform={`translate(${x} ${y})`} opacity={o} stroke={EIS} strokeWidth={2.5} strokeLinecap="round">
    {[0, 60, 120].map((a) => (
      <line key={a} x1={-r * Math.cos((a * Math.PI) / 180)} y1={-r * Math.sin((a * Math.PI) / 180)} x2={r * Math.cos((a * Math.PI) / 180)} y2={r * Math.sin((a * Math.PI) / 180)} />
    ))}
  </g>
);

/** Durchsichtiger Becher. innen = Schichten (abgeschnitten), oben = was darauf liegt, eis = 0..1 */
const Becher: React.FC<{bx: number; dy?: number; sq?: number; innen?: React.ReactNode; oben?: React.ReactNode; vorne?: React.ReactNode; eis?: number}> = ({
  bx,
  dy = 0,
  sq = 0,
  innen,
  oben,
  vorne,
  eis = 0,
}) => {
  const id = `becher${bx}`;
  const umriss = `M ${bx - TW} ${RAND} L ${bx - BW} ${BODEN - 10} Q ${bx - BW + 2} ${BODEN} ${bx - BW + 14} ${BODEN} L ${bx + BW - 14} ${BODEN} Q ${bx + BW - 2} ${BODEN} ${bx + BW} ${BODEN - 10} L ${bx + TW} ${RAND}`;
  return (
    <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <defs>
        <clipPath id={id}>
          <polygon points={`${bx - TW + 6},${RAND} ${bx - BW + 6},${BODEN - 6} ${bx + BW - 6},${BODEN - 6} ${bx + TW - 6},${RAND}`} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${dy}) translate(${bx} ${BODEN}) scale(${1 + 0.1 * sq} ${1 - 0.14 * sq}) translate(${-bx} ${-BODEN})`}>
        <path d={`${umriss} Z`} fill="rgba(242,242,240,0.06)" />
        <g clipPath={`url(#${id})`}>
          {innen}
          {eis > 0 ? <rect x={bx - TW} y={RAND} width={2 * TW} height={BH} fill={EIS} opacity={0.16 * eis} /> : null}
        </g>
        <path d={umriss} fill="none" stroke={FARBE.figur} strokeWidth={5} strokeLinejoin="round" style={leuchtFilter("rgba(242,242,240,0.4)", 12)} />
        {eis > 0 ? <path d={umriss} fill="none" stroke={EIS} strokeWidth={6} strokeLinejoin="round" opacity={eis} style={leuchtFilter("rgba(168,220,255,0.8)", 16)} /> : null}
        <ellipse cx={bx} cy={RAND} rx={TW} ry={10} fill="none" stroke={eis > 0.5 ? EIS : FARBE.figur} strokeWidth={4} />
        <path d={`M ${bx - TW + 22} ${RAND + 30} L ${bx - BW + 20} ${BODEN - 40}`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.25} />
        {eis > 0
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Kristall key={i} x={bx - 90 + zufall(i + 5) * 180} y={RAND + 30 + zufall(i + 9) * 230} r={8 + zufall(i) * 8} o={eis * interpolate(eis, [i / 9, i / 9 + 0.3], [0, 1], clamp)} />
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
  const neig = 75 * ein(t, kipp, 0.25); // kippt nach rechts in den Becher
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
    <g key={`zt${art}`} opacity={o} transform={`translate(${ZUTAT_X} ${ZUTAT_Y}) scale(${s})`}>
      {form}
      <text x={0} y={100} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={4} fill={FARBE.figur}>
        {ZUTAT_NAME[art]}
      </text>
    </g>
  );
};

/** Toppings fliegen von der Zutat auf den Becher und tuermen sich oben */
const toppings = (t: number, bx: number) => {
  const n: React.ReactNode[] = [];
  const stueck = (key: string, i: number, landet: number, dx: number, y1: number, zeichne: (x: number, y: number) => React.ReactNode) => {
    if (t < landet - 0.35) return;
    const {x, y} = wurf(t, landet, 0.35, ZUTAT_X + 25, ZUTAT_Y + 10, bx + dx, y1);
    n.push(<g key={`${key}${i}`}>{zeichne(x, y - 8 * federn(t, landet, 0.3))}</g>);
  };
  [-85, -35, 30, 82].forEach((dx, i) => stueck("e", i, C.erd + 0.45 + i * 0.05, dx, TOP - 14, (x, y) => <Erdbeere x={x} y={y} s={1.15} dreh={(i - 1.5) * 20} />));
  [-98, -58, -12, 12, 52, 98, -40].forEach((dx, i) => stueck("b", i, C.blau + 0.45 + i * 0.04, dx, TOP - 22 - (i % 2) * 8, (x, y) => <Blaubeere x={x} y={y} />));
  [-70, -22, 26, 72, 2].forEach((dx, i) =>
    stueck("n", i, C.banane + 0.45 + i * 0.05, dx, TOP - 30 - (i === 4 ? 10 : 0), (x, y) => (
      <g>
        <ellipse cx={x} cy={y} rx={19} ry={9} fill={BANANE} />
        <ellipse cx={x} cy={y} rx={7} ry={3} fill="#D9CC98" />
      </g>
    )),
  );
  for (let i = 0; i < 14; i++) {
    const dx = -105 + i * 16 + (zufall(i) - 0.5) * 10;
    stueck("g", i, C.granola + 0.45 + i * 0.025, dx, TOP - 36 - zufall(i + 3) * 10, (x, y) => (
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
        const x = bx + Math.cos(a) * 190;
        const y = RAND + 40 + Math.sin(a) * 150;
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
    const r = (k / 60) * 105;
    pkt.push(`${(bx + Math.cos(a) * r).toFixed(1)},${(TOP - 6 + Math.sin(a) * r * 0.14).toFixed(1)}`);
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

/** Fruchtstuecke huepfen auf „fruchtig“ aus dem Becher und wieder hinein */
const Fruchthuepfer = ({t, bx}: {t: number; bx: number}) => {
  const n: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const t0 = C.fruchtig + i * 0.05;
    const p = interpolate(t, [t0, t0 + 0.7], [0, 1], clamp);
    if (p <= 0 || p >= 1) continue;
    const dx = (i - 2.5) * 40;
    const x = bx + dx * (1 + 0.6 * p);
    const y = TOP - 10 - 4 * 220 * p * (1 - p);
    n.push(i % 2 ? <Blaubeere key={i} x={x} y={y} r={13} /> : <Erdbeere key={i} x={x} y={y} s={1.1} dreh={p * 200} />);
  }
  return <>{n}</>;
};

/** Kalter Nebel ueber dem Becher */
const Nebel = ({t, bx, eis}: {t: number; bx: number; eis: number}) => {
  if (eis <= 0) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = ((t - C.eiskalt) * 0.6 + i / 3) % 1;
        return <ellipse key={i} cx={bx - 60 + i * 60 + Math.sin(t * 2 + i) * 15} cy={RAND - 20 - p * 160} rx={50 + p * 40} ry={16 + p * 10} fill={FARBE.figur} opacity={0.14 * eis * Math.sin(p * Math.PI)} style={{filter: "blur(10px)"}} />;
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

/** Faehnchen, faellt in den Becher und steckt auf t0 */
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

// ---------- Szene 5–8: Tageszeiten, Frage, Schleife ----------

/** Sonne und Mond (hinter dem Boden abgeschnitten) */
const Himmel = ({t}: {t: number}) => {
  if (t < C.morgens || t >= C.welche) return null;
  let sx = BX + 300;
  let sy = 2000;
  if (t < C.nachmittags) sy = interpolate(t, [C.morgens, C.morgens + 1.3], [1620, 1170], {...clamp, easing: (x) => 1 - (1 - x) * (1 - x)});
  else if (t < C.abends) {
    const p = ein(t, C.nachmittags, 0.6);
    sx = BX + 300 - 120 * p;
    sy = 1170 - 420 * p;
  } else {
    sx = BX + 330;
    sy = interpolate(t, [C.abends, C.abends + 1.1], [1250, 1640], clamp);
  }
  const mond = ein(t, C.abends + 0.1, 1.0);
  const my = 1120 - 200 * mond;
  return (
    <div style={{position: "absolute", left: -3000, top: -3000, width: 9000, height: 3000 + BODEN, overflow: "hidden"}}>
      <svg width={1} height={1} style={{position: "absolute", left: 3000, top: 3000, overflow: "visible"}}>
        <circle cx={sx} cy={sy} r={250} fill={GOLD} opacity={0.12} style={{filter: "blur(30px)"}} />
        <circle cx={sx} cy={sy} r={105} fill={GOLD} style={leuchtFilter("rgba(232,176,74,0.8)", 30)} />
        {mond > 0 ? (
          <g opacity={mond}>
            <circle cx={260} cy={my} r={62} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.6)", 20)} />
            <circle cx={290} cy={my - 18} r={56} fill="#000" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/** Uhr-Schild: 07:00 → 15:00 → 20:00 */
const Uhr = ({t}: {t: number}) => {
  if (t < C.morgens || t >= C.welche) return null;
  const zeit = t < C.nachmittags ? "07:00" : t < C.abends ? "15:00" : "20:00";
  const wechsel = t < C.nachmittags ? C.morgens : t < C.abends ? C.nachmittags : C.abends;
  const s = ein(t, wechsel, 0.2) + 0.15 * federn(t, wechsel + 0.15, 0.35);
  return (
    <div
      style={{
        position: "absolute",
        left: 310,
        top: 1080,
        transform: `translate(-50%, -50%) scale(${1.4 * Math.max(0.01, s)})`,
        padding: "12px 22px",
        border: `2px solid ${FARBE.linie}`,
        borderRadius: 12,
        background: "rgba(0,0,0,0.75)",
        fontFamily: MONO,
        color: FARBE.figur,
        textAlign: "center",
      }}
    >
      <div style={{fontSize: 18, letterSpacing: 4, color: FARBE.grau}}>UHR</div>
      <div style={{fontSize: 44, marginTop: 2, textShadow: "0 0 18px rgba(232,176,74,0.6)", color: GOLD}}>{zeit}</div>
    </div>
  );
};

/** Kleiner Snack-Becher: erscheint auf „kleiner“, landet auf „Snack“ */
const MiniBecher = ({t}: {t: number}) => {
  if (t < C.kleiner - 0.05 || t >= C.welche) return null;
  const dy = fall(t, C.snack, C.snack - C.kleiner + 0.05, -500, 0);
  const sq = federn(t, C.snack, 0.4);
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: `${MX}px ${BODEN}px`, transform: "scale(0.5)"}}>
      <Becher
        bx={MX}
        dy={dy}
        sq={sq}
        innen={schicht("mini", MX, TOP, BODEN, ACAI, 1.5, t)}
        oben={
          <>
            {[-70, -30, 10, 50, 85].map((dx, i) => (
              <Blaubeere key={i} x={MX + dx} y={TOP - 12 - (i % 2) * 8} r={16} />
            ))}
            <Erdbeere x={MX - 10} y={TOP - 30} s={1.4} />
          </>
        }
      />
    </div>
  );
};

/** Goldener Stern als Belohnung: landet auf „Belohnung“ auf dem Becher */
const Stern = ({t}: {t: number}) => {
  if (t < C.belohnung - 0.4 || t >= C.welche) return null;
  const y = fall(t, C.belohnung, 0.4, TOP - 700, TOP - 90) - 20 * federn(t, C.belohnung, 0.5);
  const d = (t - C.belohnung) * 40;
  const pkt: string[] = [];
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
    const r = k % 2 ? 24 : 58;
    pkt.push(`${(BX + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`);
  }
  const blitz = ein(t, C.belohnung, 0.05) * aus(t, C.belohnung + 0.06, 0.6);
  return (
    <g>
      {blitz > 0 ? <circle cx={BX} cy={y} r={170} fill={GOLD} opacity={0.35 * blitz} style={{filter: "blur(24px)"}} /> : null}
      <polygon points={pkt.join(" ")} fill={GOLD} transform={`rotate(${Math.sin(d / 20) * 8} ${BX} ${y})`} style={leuchtFilter("rgba(232,176,74,0.9)", 18)} />
    </g>
  );
};

/** Toppings steigen auf „Toppings“ aus dem Becher und kreisen um ihn */
const ToppingRing = ({t}: {t: number}) => {
  if (t < C.toppings || t >= C.schleife) return null;
  const raus = ein(t, C.toppings, 0.6);
  const n: React.ReactNode[] = [];
  const arten = ["e", "b", "n", "g", "e", "b", "n", "g"];
  arten.forEach((a, i) => {
    const w = (i / arten.length) * Math.PI * 2 + (t - C.toppings) * 1.6;
    const x = BX + Math.cos(w) * 290 * raus;
    const y = RAND - 90 - 60 * raus + Math.sin(w) * 90 * raus;
    const s = 2.5 + 0.6 * Math.sin(w) + 0.3 * federn(t, C.nie, 0.4);
    const vorne = Math.sin(w) > 0;
    const item =
      a === "e" ? (
        <Erdbeere x={x} y={y} s={s} dreh={w * 30} />
      ) : a === "b" ? (
        <Blaubeere x={x} y={y} r={11 * s} />
      ) : a === "n" ? (
        <g>
          <ellipse cx={x} cy={y} rx={19 * s} ry={9 * s} fill={BANANE} />
          <ellipse cx={x} cy={y} rx={7 * s} ry={3 * s} fill="#D9CC98" />
        </g>
      ) : (
        <rect x={x - 8 * s} y={y - 6 * s} width={16 * s} height={12 * s} rx={3} fill={GRANOLA} transform={`rotate(${w * 40} ${x} ${y})`} />
      );
    n.push(
      <g key={i} opacity={vorne ? 1 : 0.6}>
        {item}
      </g>,
    );
  });
  return <>{n}</>;
};

/** „?“ ueber der Figur auf „deiner“ */
const Frage = ({t}: {t: number}) => {
  if (t < C.deiner || t >= C.schleife) return null;
  const s = ein(t, C.deiner, 0.2) + 0.2 * federn(t, C.deiner + 0.15, 0.35) + 0.15 * federn(t, C.fehlen, 0.4);
  return (
    <div
      style={{
        position: "absolute",
        left: FX,
        top: BODEN - 300,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin(t * 3) * 6}deg)`,
        fontFamily: SCHRIFT,
        fontWeight: 700,
        fontSize: 120,
        color: GOLD,
        textShadow: "0 0 24px rgba(232,176,74,0.7)",
      }}
    >
      ?
    </div>
  );
};

/** Haupt-Becher */
const HauptBecher: React.FC<{t: number; eis: number}> = ({t, eis}) => {
  // Ende (Schleife): nur Açaí, springt hoch und haengt im letzten Bild wie im ersten
  if (t >= C.schleife) {
    const p = interpolate(t, [ABSPRUNG, DAUER], [0, 1], clamp);
    const dyE = -400 * (1 - (1 - p) * (1 - p));
    const sqE = t < ABSPRUNG ? 0.6 * ein(t, ABSPRUNG - 0.3, 0.3) : 0;
    return <Becher bx={BX} dy={dyE} sq={sqE} innen={schicht("acai", BX, TOP, BODEN, ACAI, 1.5, t)} />;
  }
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
  const welle = 1.5 + 3 * ein(t, C.cremig, 0.3) * aus(t, C.fruchtig + 0.4, 0.4);
  return (
    <Becher
      bx={BX}
      dy={dy}
      sq={sq}
      eis={eis}
      innen={schicht("acai", BX, TOP, BODEN, ACAI, welle, t)}
      oben={
        <>
          <Strudel t={t} bx={BX} />
          {t < C.toppings + 0.3 ? toppings(t, BX) : <g opacity={aus(t, C.toppings, 0.3)}>{toppings(t, BX)}</g>}
          <Stern t={t} />
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
          <ToppingRing t={t} />
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
  const huepfen = 55 * freude(C.fruehstueck) + 60 * freude(C.knackt) + 70 * freude(C.start) + 40 * freude(C.belohnung);
  const zittern = ein(t, C.eiskalt, 0.2) * aus(t, C.oben - 0.2, 0.3);
  const muede = ein(t, C.langen, 0.35) * aus(t, C.welche, 0.3);
  const blick = t >= C.kleiner && t < C.abends ? 0.9 : t >= C.welche ? 0.6 * Math.sin((t - C.welche) * 3) : 0.6;
  const kippen = -10 * ein(t, C.fehlen, 0.25) * aus(t, C.schleife, 0.05);
  // Sterne: tagsueber blasser, abends hell
  const sterne = t < C.morgens || t >= C.welche ? 1 : t < C.abends ? 1 - 0.65 * ein(t, C.morgens, 0.8) : 0.35 + 0.65 * ein(t, C.abends, 0.8);

  return (
    <AbsoluteFill style={{background: FARBE.hintergrund}}>
      <Schriften />
      <Sternenhimmel t={t} kam={kam} ruhe={{x: 540, y: 1340}} deckkraft={sterne} />
      <Welt kam={kam}>
        <Himmel t={t} />
        <Boden y={BODEN} />
        <Leuchten
          x={BX}
          y={RAND + 60}
          r={300}
          staerke={0.09 * ein(t, C.bowl, 0.1) * aus(t, ABSPRUNG - 0.3, 0.5) + 0.4 * ein(t, C.bowl, 0.05) * aus(t, C.bowl + 0.06, 0.5) + 0.35 * federn(t, C.knackt, 0.4)}
        />
        <HauptBecher t={t} eis={eis} />
        <MiniBecher t={t} />
        <Figur x={FX} y={BODEN} t={t} blick={blick} huepfen={huepfen} zittern={zittern} stauchen={0.35 * muede} licht={1 - 0.35 * muede} kippen={kippen} />
        <Uhr t={t} />
        <Frage t={t} />
      </Welt>
      <Untertitel t={t} />
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
