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
 * Szene 1–7 gebaut. Letztes Bild = erstes Bild (Bowl schwebt oben, faellt dann hinein).
 */

const Z = ZS as Zeitstempel;
export const MEIN_VIDEO_DAUER = Math.max(3, Z.dauer + 0.6);
const DAUER = MEIN_VIDEO_DAUER;
const {wort, wortEnde} = woerterVon(Z);

// Farben fuer dieses Video: Weiss = Welt, Violett = Açaí, Gold = Zucker
const ACAI = "#7B4FC9";
const ACAI_HELL = "#9C74E0";
const GOLD = "#E8B04A";

// ---- Stichworte (Sekunden, alle aus den Zeitstempeln) ----
const C = {
  bowl: wort("Açaí-Bowl"),
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
  loeffelst: wort("löffelst"),
  schale: wort("Schale"),
  zucker: wort("Zucker"),
  besser: wort("Besser"),
  ungesuesst: wort("ungesüßtes"),
  pueree2: wort("Püree", 2),
  joghurt: wort("Naturjoghurt"),
  frische: wort("frische"),
  beeren: wort("Beeren"),
  fruehstueck: wort("Frühstück"),
  dessert2: wort("Dessert", 2),
  was: wort("Was"),
  deine2: wort("deine", 2),
  bowl2: wort("Bowl"),
  schleife: wortEnde("Bowl") + 0.1, // Schnitt zurueck zum Startbild
};
const ABSPRUNG = DAUER - C.bowl; // Bowl springt hoch und haengt im letzten Bild genau wie im ersten

// ---- Welt ----
const BODEN = 1500;
const FX = 430; // Figur
const BX = 720; // Bowl
const BEERE_X = 270;
const SX = 2400; // Laden (weiter rechts in der Welt)
const REGAL_Y = 1380;
const VX = 3600; // Vergleich: zwei Bowls
const VL = VX - 230; // Dessert-Bowl
const VR = VX + 230; // Fruehstuecks-Bowl

// Kamera-Tabelle: [Sekunde, Zoom, x, y]
const START: KameraZeile = [0, 2.1, BX + 40, 1380];
const KAMERA: KameraZeile[] = [
  START, // nah: Bowl faellt herein
  [C.ist - 0.1, 2.1, BX + 40, 1380],
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
  [C.gesuesst + 0.3, 1.8, SX + 60, 1180], // nah: Zucker faellt
  [C.oben - 0.01, 1.85, SX + 60, 1180],
  [C.oben, 1.35, 600, 1300], // Schnitt, halbnah: Bowl, Figur, Zaehler
  [C.granola - 0.2, 1.45, 640, 1320],
  [C.honig - 0.1, 1.5, 660, 1330],
  [C.honig + 0.4, 2.0, BX + 30, 1310], // nah: Honig
  [C.loeffelst - 0.1, 2.0, BX + 30, 1310],
  [C.loeffelst + 0.4, 1.6, BX, 1280], // halbnah: Loeffel
  [C.schale - 0.01, 1.6, BX, 1280],
  [C.schale, 1.25, 600, 1290], // Schnitt, halbnah: Figur, Bowl, Zaehler
  [C.zucker - 0.1, 1.3, 600, 1290],
  [C.zucker + 0.3, 1.5, 620, 1290], // Zuckerberg
  [C.besser - 0.05, 1.5, 620, 1290],
  [C.besser + 0.4, 1.3, 620, 1260], // alles fliegt weg
  [C.ungesuesst + 0.5, 1.6, BX, 1220], // halbnah: Beutel giesst
  [C.joghurt - 0.1, 1.6, BX, 1220],
  [C.joghurt + 0.4, 1.9, BX + 30, 1300], // nah: Joghurt
  [C.frische, 1.9, BX + 30, 1300],
  [C.beeren + 0.3, 1.3, 600, 1300], // halbnah: Figur hüpft
  [C.fruehstueck - 0.01, 1.3, 600, 1300],
  [C.fruehstueck, 1.25, VX, 1250], // Schnitt: zwei Bowls
  [C.was - 0.05, 1.32, VX, 1250],
  [C.was + 0.5, 1.55, VX, 1300], // naeher: Figur fragt
  [C.schleife - 0.01, 1.6, VX, 1300],
  [C.schleife, START[1], START[2], START[3]], // Schnitt: Startbild
  [DAUER, START[1], START[2], START[3]],
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
const IMMER = 1e6; // „schon lange gelandet“

// ---------- Becher (durchsichtig, man sieht die Schichten) ----------
const BH = 300; // Becherhoehe
const TW = 125; // halbe Breite oben
const BW = 88; // halbe Breite unten
const RAND = BODEN - BH; // Oberkante Becher
const A = 1350; // Hoehe der Açaí-Schicht
const BAN = 26;
const GRA = 24;
const HON = 10;
const JOG = 34;
const halb = (y: number) => BW + ((TW - BW) * (BODEN - y)) / BH;
const ZUTAT_Y = 1045; // hier schweben die Zutaten ueber dem Becher

/** Schicht im Becher von yTop bis yBot, optional mit welliger Oberkante */
const schicht = (key: string, bx: number, yTop: number, yBot: number, farbe: string, welle = 0, t = 0) => {
  if (yBot - yTop < 0.5) return null;
  const pkt: string[] = [];
  for (let k = 0; k <= 16; k++) {
    const x = bx - TW + (k / 16) * 2 * TW;
    pkt.push(`${x.toFixed(1)},${(yTop + welle * Math.sin(k * 1.3 + t * 3)).toFixed(1)}`);
  }
  pkt.push(`${bx + TW},${yBot}`, `${bx - TW},${yBot}`);
  return <polygon key={key} points={pkt.join(" ")} fill={farbe} />;
};

/** Ein Strahl (Honig, Joghurt, Pueree) von einem Ausguss bis zur Fuellhoehe */
const strahl = (key: string, t: number, x0: number, y0: number, x1: number, y1: number, an: number, trifft: number, aus_: number, farbe: string, dicke: number) => {
  if (t < an || t > aus_ + 0.35) return null;
  const unten = interpolate(t, [an, trifft], [y0, y1], clamp);
  const oben = interpolate(t, [aus_, aus_ + 0.35], [y0, y1], clamp);
  if (oben >= unten - 2) return null;
  const p0x = x0 + (x1 - x0) * ((oben - y0) / (y1 - y0 || 1));
  const p1x = x0 + (x1 - x0) * ((unten - y0) / (y1 - y0 || 1));
  return <path key={key} d={`M ${p0x} ${oben} Q ${(p0x + p1x) / 2 + Math.sin(t * 8) * 4} ${(oben + unten) / 2} ${p1x} ${unten}`} stroke={farbe} strokeWidth={dicke} fill="none" strokeLinecap="round" />;
};

type Art = "banane" | "granola" | "honig" | "joghurt" | "beeren";
const ZUTAT_NAME: Record<Art, string> = {banane: "BANANE", granola: "GRANOLA", honig: "HONIG", joghurt: "JOGHURT", beeren: "BEEREN"};

/** Zutat erscheint gross auf ihrem Wort (mit Name und Zucker), kippt dann in den Becher */
const Zutat = ({t, bx, art, auf, kipp, gramm}: {t: number; bx: number; art: Art; auf: number; kipp: number; gramm: number}) => {
  if (t < auf - 0.05 || t > kipp + 0.75) return null;
  const s = ein(t, auf, 0.18) + 0.15 * federn(t, auf + 0.12, 0.35);
  const o = aus(t, kipp + 0.5, 0.25);
  const neig = 75 * ein(t, kipp, 0.25); // kippt nach rechts in den Becher
  const cx = bx - 75;
  const cy = ZUTAT_Y;
  let form: React.ReactNode = null;
  if (art === "banane")
    form = (
      <g transform={`rotate(${neig * 0.4})`}>
        <path d="M -78 -18 Q -10 52 78 -30 Q 70 -6 60 2 Q -6 38 -66 -6 Z" fill="#F4E3A1" style={leuchtFilter("rgba(244,227,161,0.4)", 10)} />
        <path d="M 78 -30 l 8 -8" stroke="#6B5A2A" strokeWidth={6} strokeLinecap="round" />
        <circle cx={-72} cy={-14} r={4} fill="#6B5A2A" />
      </g>
    );
  if (art === "granola")
    form = (
      <g transform={`rotate(${neig})`}>
        <rect x={-48} y={-62} width={96} height={124} rx={10} fill="#C99A5B" style={leuchtFilter("rgba(201,154,91,0.4)", 10)} />
        <rect x={-48} y={-62} width={96} height={16} rx={4} fill={FARBE.figur} />
        <ellipse cx={0} cy={14} rx={30} ry={24} fill="#8A6435" />
        {[[-12, 6], [8, 18], [-4, 26], [14, 2]].map(([x, y], i) => (
          <rect key={i} x={x - 6} y={y - 4} width={12} height={8} rx={2} fill="#E0B878" />
        ))}
      </g>
    );
  if (art === "honig")
    form = (
      <g transform={`rotate(${neig})`}>
        <rect x={-42} y={-44} width={84} height={100} rx={16} fill={GOLD} style={leuchtFilter("rgba(232,176,74,0.55)", 12)} />
        <rect x={-46} y={-62} width={92} height={20} rx={5} fill={FARBE.figur} />
        <path d="M -20 0 h 40 M -14 14 h 28" stroke="#9A6A1E" strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  if (art === "joghurt")
    form = (
      <g transform={`rotate(${neig})`}>
        <path d="M -46 -50 L 46 -50 L 36 56 L -36 56 Z" fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.4)", 10)} />
        <rect x={-50} y={-60} width={100} height={12} rx={4} fill="#DADAD6" />
        <rect x={-42} y={-6} width={84} height={20} fill={ACAI_HELL} opacity={0.8} />
      </g>
    );
  if (art === "beeren")
    form = (
      <g transform={`rotate(${neig})`}>
        {[-30, -10, 10, 30, -20, 0, 20].map((x, i) => (
          <circle key={i} cx={x} cy={i < 4 ? -12 : -30} r={13} fill={i % 3 === 2 ? ACAI_HELL : ACAI} />
        ))}
        <path d="M -58 -6 L 58 -6 L 44 46 L -44 46 Z" fill="none" stroke={FARBE.figur} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -50 14 H 50 M -46 30 H 46" stroke={FARBE.linie} strokeWidth={3} />
      </g>
    );
  return (
    <g key={`zt${art}`} opacity={o} transform={`translate(${cx} ${cy}) scale(${s})`}>
      {form}
      <text x={0} y={100} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={4} fill={FARBE.figur}>
        {ZUTAT_NAME[art]}
      </text>
      <text x={0} y={132} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={GOLD}>
        +{gramm} g
      </text>
    </g>
  );
};

/** Dessert-Becher: Açaí, Banane, Granola, Honig (Zeiten = Wort, auf dem die Zutat erscheint) */
const dessertInhalt = (t: number, bx: number, T: {banane: number; granola: number; honig: number}) => {
  const pb = ein(t, T.banane + 0.6, 0.3);
  const pg = ein(t, T.granola + 0.65, 0.3);
  const ph = ein(t, T.honig + 0.5, 0.4);
  const yBan = A - BAN * pb;
  const yGra = yBan - GRA * pg;
  const yHon = yGra - HON * ph;
  const innen: React.ReactNode[] = [schicht("acai", bx, A, BODEN, ACAI, 0)];
  if (pb > 0) {
    innen.push(schicht("ban", bx, yBan, A + 2, "#F4E3A1"));
    for (let i = 0; i < 5; i++) innen.push(<ellipse key={`bs${i}`} cx={bx - 90 + i * 45} cy={(yBan + A) / 2} rx={16} ry={8 * pb} fill="#E3CF86" />);
  }
  if (pg > 0) {
    innen.push(schicht("gra", bx, yGra, yBan + 2, "#C99A5B"));
    for (let i = 0; i < 9; i++) innen.push(<rect key={`gs${i}`} x={bx - 105 + i * 26} y={(yGra + yBan) / 2 - 4} width={12} height={8} rx={2} fill="#8A6435" opacity={pg} />);
  }
  if (ph > 0) {
    innen.push(schicht("hon", bx, yHon, yGra + 2, GOLD, 1.5, t));
    const tropf = 90 * ein(t, T.honig + 0.7, 0.9);
    [-1, 1].forEach((sgn, i) => {
      const x = bx + sgn * (halb(yHon) - 14);
      innen.push(<path key={`ht${i}`} d={`M ${x} ${yHon} L ${x - sgn * 4} ${yHon + tropf * (0.7 + 0.3 * i)}`} stroke={GOLD} strokeWidth={7} strokeLinecap="round" />);
    });
  }
  // fallende Stuecke (ueber dem Becher)
  const fallend: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const landet = T.banane + 0.45 + i * 0.05;
    if (t > landet - 0.3 && t < landet)
      fallend.push(<ellipse key={`bf${i}`} cx={bx - 80 + i * 30} cy={fall(t, landet, 0.3, ZUTAT_Y + 20, A - 10)} rx={16} ry={9} fill="#F4E3A1" />);
  }
  for (let i = 0; i < 10; i++) {
    const landet = T.granola + 0.45 + i * 0.03;
    if (t > landet - 0.3 && t < landet)
      fallend.push(<rect key={`gf${i}`} x={bx - 50 + (i % 5) * 22} y={fall(t, landet, 0.3, ZUTAT_Y + 30, yBan - 10)} width={12} height={9} rx={2} fill="#C99A5B" />);
  }
  fallend.push(strahl("hs", t, bx - 20, ZUTAT_Y - 10, bx - 5, yGra, T.honig + 0.3, T.honig + 0.5, T.honig + 0.85, GOLD, 8));
  return {innen, fallend, oben: yHon};
};

/** Fruehstuecks-Becher: ungesuesstes Pueree, Joghurt, Beeren */
const fruehInhalt = (t: number, bx: number, T: {pueree: number; joghurt: number; beeren: number}) => {
  const lvl = BODEN - (BODEN - A) * ein(t, T.pueree + 0.1, 0.9);
  const pj = ein(t, T.joghurt + 0.4, 0.6);
  const yJ = A - JOG * pj;
  const innen: React.ReactNode[] = [schicht("acai2", bx, lvl, BODEN, ACAI, lvl < BODEN - 2 ? 2 : 0, t)];
  if (pj > 0) {
    innen.push(schicht("jog", bx, yJ, A + 2, FARBE.figur, 2.5, t));
    innen.push(<path key="jm" d={`M ${bx - 100} ${yJ + 14} Q ${bx - 40} ${yJ + 4} ${bx} ${yJ + 16} T ${bx + 100} ${yJ + 12}`} stroke={ACAI_HELL} strokeWidth={5} fill="none" opacity={0.75 * pj} />);
  }
  const fallend: React.ReactNode[] = [strahl("js", t, bx - 25, ZUTAT_Y + 10, bx - 5, A - 4, T.joghurt + 0.2, T.joghurt + 0.4, T.joghurt + 0.85, FARBE.figur, 18)];
  const oben: React.ReactNode[] = [];
  const orte = [-80, -45, -10, 25, 60, 90];
  orte.forEach((dx, i) => {
    const landet = T.beeren + 0.3 + i * 0.05;
    if (t < landet - 0.3) return;
    const y = fall(t, landet, 0.3, ZUTAT_Y, yJ - 10) - 10 * federn(t, landet, 0.3);
    oben.push(
      <g key={`be${i}`}>
        <circle cx={bx + dx} cy={y} r={14} fill={i % 3 === 2 ? ACAI_HELL : ACAI} style={leuchtFilter("rgba(156,116,224,0.5)", 8)} />
        <circle cx={bx + dx - 5} cy={y - 5} r={4} fill="#FFFFFF" opacity={0.35} />
      </g>,
    );
  });
  return {innen, fallend, oben, ober: yJ};
};

/** Berg aus Zuckerwuerfeln, der sich auf „Zucker“ auf dem Becher auftuermt */
const zuckerBerg = (t: number, bx: number, t0: number, basis: number) => {
  const n: React.ReactNode[] = [];
  const reihen = [5, 4, 3, 2, 1];
  const s = 34;
  let k = 0;
  reihen.forEach((anz, r) => {
    for (let i = 0; i < anz; i++, k++) {
      const landet = t0 + k * 0.025;
      if (t < landet - 0.25) continue;
      const x = bx + (i - (anz - 1) / 2) * (s + 4);
      const y = basis - s / 2 - r * (s + 2);
      const yy = fall(t, landet, 0.25, y - 400, y);
      n.push(<rect key={`z${k}`} x={x - s / 2} y={yy - s / 2} width={s} height={s} rx={4} fill={FARBE.figur} stroke="rgba(0,0,0,0.15)" strokeWidth={2} style={leuchtFilter("rgba(232,176,74,0.55)", 10)} />);
    }
  });
  return n;
};

/** Faehnchen mit Aufschrift, faellt in den Becher und steckt auf t0 */
const fahne = (t: number, bx: number, t0: number, text: string, basis: number, farbe = FARBE.figur) => {
  if (t < t0 - 0.35) return null;
  const yy = fall(t, t0, 0.35, basis - 700, basis);
  const wippen = 8 * federn(t, t0, 0.5);
  const b = text.length * 15 + 26;
  return (
    <g key={`f${text}`} transform={`translate(${bx + 60} ${yy}) rotate(${8 + wippen})`}>
      <rect x={-2.5} y={-250} width={5} height={258} fill={FARBE.figur} rx={2} />
      <rect x={2} y={-250} width={b} height={44} rx={4} fill={farbe} style={leuchtFilter("rgba(242,242,240,0.35)")} />
      <text x={2 + b / 2} y={-220} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={3} fill="#111">
        {text}
      </text>
    </g>
  );
};

/** Loeffel: taucht auf „löffelst“ ein und hebt eine Ladung heraus */
const loeffel = (t: number, bx: number, t0: number, ziel: number) => {
  if (t < t0 - 0.4 || t > t0 + 1.2) return null;
  const rein = interpolate(t, [t0 - 0.4, t0], [0, 1], clamp);
  const raus = interpolate(t, [t0 + 0.35, t0 + 1.1], [0, 1], clamp);
  const x = bx + 40 + 260 * (1 - rein) * (1 - rein) + 200 * raus * raus;
  const y = ziel - 520 * (1 - rein) * (1 - rein) - 640 * raus * raus;
  const dreh = -45 + 20 * rein - 25 * raus;
  return (
    <g key="loeffel" transform={`translate(${x} ${y}) rotate(${dreh})`}>
      <rect x={20} y={-6} width={280} height={12} rx={6} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)")} />
      <ellipse cx={0} cy={0} rx={38} ry={24} fill={FARBE.figur} />
      {raus > 0 ? (
        <>
          <ellipse cx={0} cy={-6} rx={30} ry={14} fill={ACAI} />
          <rect x={-10} y={-26} width={16} height={16} rx={2} fill={FARBE.figur} />
          <circle cx={14} cy={-14} r={6} fill={GOLD} />
        </>
      ) : null}
    </g>
  );
};

/** Beutel „OHNE ZUCKER“ erscheint auf „ungesüßtes“ und giesst auf „Püree“ */
const beutelGiesst = (t: number, bx: number) => {
  const auf = ein(t, C.ungesuesst - 0.1, 0.35) * aus(t, C.joghurt - 0.35, 0.3);
  if (auf <= 0) return null;
  const kipp = -100 * ein(t, C.pueree2 - 0.3, 0.3);
  const px = bx + 150;
  const py = RAND - 200 - 300 * (1 - auf);
  const lvl = BODEN - (BODEN - A) * ein(t, C.pueree2 + 0.1, 0.9);
  return (
    <g key="beutel" opacity={auf}>
      {strahl("ps", t, px - 70, py - 10, bx + 10, lvl, C.pueree2 - 0.05, C.pueree2 + 0.15, C.joghurt - 0.4, ACAI, 16)}
      <g transform={`translate(${px} ${py}) rotate(${kipp})`}>
        <path d="M -60 90 L -54 -80 L 54 -80 L 60 90 Z" fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)", 14)} />
        <rect x={-56} y={-20} width={112} height={52} fill={ACAI} />
        <text x={0} y={2} textAnchor="middle" fontFamily={MONO} fontSize={19} letterSpacing={2} fill={FARBE.figur}>
          AÇAÍ
        </text>
        <text x={0} y={24} textAnchor="middle" fontFamily={MONO} fontSize={12} letterSpacing={1} fill={FARBE.figur}>
          OHNE ZUCKER
        </text>
      </g>
    </g>
  );
};

/** Durchsichtiger Becher. innen = Schichten (abgeschnitten), oben = was darauf liegt */
const Becher: React.FC<{bx: number; dy?: number; sq?: number; innen?: React.ReactNode; oben?: React.ReactNode; vorne?: React.ReactNode}> = ({bx, dy = 0, sq = 0, innen, oben, vorne}) => {
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
        <g clipPath={`url(#${id})`}>{innen}</g>
        <path d={umriss} fill="none" stroke={FARBE.figur} strokeWidth={5} strokeLinejoin="round" style={leuchtFilter("rgba(242,242,240,0.4)", 12)} />
        <ellipse cx={bx} cy={RAND} rx={TW} ry={10} fill="none" stroke={FARBE.figur} strokeWidth={4} />
        <path d={`M ${bx - TW + 22} ${RAND + 30} L ${bx - BW + 20} ${BODEN - 40}`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.25} />
        {oben}
      </g>
      {vorne}
    </svg>
  );
};

/** Haupt-Becher in Szene 1, 2, 4, 5, 6 und im Schlussbild */
const HauptBecher: React.FC<{t: number}> = ({t}) => {
  const leer = [schicht("acai", BX, A, BODEN, ACAI)];
  // Ende (Schleife): steht nur mit Açaí da, springt hoch und haengt im letzten Bild wie im ersten
  if (t >= C.schleife) {
    const p = interpolate(t, [ABSPRUNG, DAUER], [0, 1], clamp);
    const dy = -400 * (1 - (1 - p) * (1 - p));
    const sq = t < ABSPRUNG ? 0.6 * ein(t, ABSPRUNG - 0.3, 0.3) : 0;
    return <Becher bx={BX} dy={dy} sq={sq} innen={leer} />;
  }
  // Anfang: faellt ab Bild 1 herein, landet auf „Açaí-Bowl“
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
  if (t < C.besser + 0.45) {
    // Dessert-Becher; auf „Besser“ fliegt alles nach oben weg
    const weg = interpolate(t, [C.besser, C.besser + 0.45], [0, 1], clamp);
    const d = dessertInhalt(t, BX, {banane: C.banane, granola: C.granola, honig: C.honig});
    const innen = weg > 0 ? [...leer, <g key="altInnen" opacity={1 - weg}>{d.innen.slice(1)}</g>] : d.innen;
    const altOben = (
      <g key="alt" transform={`translate(0 ${-900 * weg * weg})`} opacity={1 - weg}>
        {t > C.zucker - 0.3 ? zuckerBerg(t, BX, C.zucker, d.oben) : null}
        {fahne(t, BX, C.dessert, "DESSERT", d.oben)}
      </g>
    );
    return (
      <Becher
        bx={BX}
        dy={dy}
        sq={sq}
        innen={innen}
        oben={altOben}
        vorne={
          <>
            {spritzer}
            {d.fallend}
            <Zutat t={t} bx={BX} art="banane" auf={C.banane} kipp={C.banane + 0.3} gramm={9} />
            <Zutat t={t} bx={BX} art="granola" auf={C.granola} kipp={C.granola + 0.3} gramm={8} />
            <Zutat t={t} bx={BX} art="honig" auf={C.honig} kipp={C.honig + 0.2} gramm={17} />
            {loeffel(t, BX, C.loeffelst, d.oben)}
          </>
        }
      />
    );
  }
  // Fruehstuecks-Becher
  const f = fruehInhalt(t, BX, {pueree: C.pueree2, joghurt: C.joghurt, beeren: C.beeren});
  return (
    <Becher
      bx={BX}
      innen={f.innen}
      oben={f.oben}
      vorne={
        <>
          {beutelGiesst(t, BX)}
          {f.fallend}
          <Zutat t={t} bx={BX} art="joghurt" auf={C.joghurt} kipp={C.joghurt + 0.15} gramm={5} />
          <Zutat t={t} bx={BX} art="beeren" auf={C.frische} kipp={C.beeren} gramm={4} />
        </>
      }
    />
  );
};

// ---------- Beere ----------
const Beere: React.FC<{t: number}> = ({t}) => {
  // faellt langsam ab dem Schnitt auf „Die“ und landet auf „schmeckt“
  if (t < C.die || t > C.darum) return null;
  const r = 26;
  const ruhe = BODEN - r;
  const p = interpolate(t, [C.die, C.schmeckt], [0, 1], clamp);
  const y = ruhe - 640 + 640 * Math.pow(p, 1.6) - 40 * federn(t, C.schmeckt, 0.4);
  const blitz = ein(t, C.schmeckt, 0.05) * aus(t, C.schmeckt + 0.06, 0.4);
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
    const x = SX - 50 + (i % 3) * 25 + (zufall(i + 7) - 0.5) * 16;
    const y = fall(t, landet, 0.4, top - 520, top + 10);
    wuerfel.push(<rect key={i} x={x - 13} y={y - 13} width={26} height={26} rx={3} fill={FARBE.figur} transform={`rotate(${(t - landet) * 300 + i * 25} ${x} ${y})`} style={leuchtFilter("rgba(242,242,240,0.5)", 8)} />);
  }
  const beben = 6 * federn(t, C.gesuesst, 0.5);
  const andere = [-220, -130, 130, 220];
  return (
    <>
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
        <rect x={SX - regalB / 2} y={REGAL_Y} width={regalB} height={8} rx={3} fill={FARBE.figur} opacity={0.85} />
        <rect x={SX - regalB / 2} y={1100} width={regalB} height={8} rx={3} fill={FARBE.figur} opacity={0.5} />
        <rect x={SX - regalB / 2} y={1100} width={6} height={BODEN - 1100} fill={FARBE.figur} opacity={0.4} />
        <rect x={SX + regalB / 2 - 6} y={1100} width={6} height={BODEN - 1100} fill={FARBE.figur} opacity={0.4} />
        {andere.map((dx, i) => (
          <rect key={i} x={SX + dx - 34} y={REGAL_Y - 120 - (i % 2) * 30} width={68} height={120 + (i % 2) * 30} rx={8} fill="none" stroke={FARBE.linie} strokeWidth={2} />
        ))}
        {[-200, -60, 80, 200].map((dx, i) => (
          <rect key={`o${i}`} x={SX + dx - 40} y={1100 - 110} width={80} height={110} rx={8} fill="none" stroke={FARBE.linie} strokeWidth={2} />
        ))}
        {wuerfel}
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
// grobe Richtwerte (Gramm Zucker)
const ZUCKER_DESSERT: [number, number][] = [
  [C.gesuesst + 0.1, 12], // gesuesstes Pueree
  [C.banane + 0.05, 9],
  [C.granola + 0.05, 8],
  [C.honig + 0.1, 17],
];
const ZUCKER_FRUEHSTUECK: [number, number][] = [
  [C.pueree2 + 0.1, 2], // ungesuesstes Pueree
  [C.joghurt + 0.05, 5],
  [C.beeren + 0.1, 4],
];
const summe = (liste: [number, number][]) => liste.reduce((s, [, g]) => s + g, 0);
const DESSERT_G = summe(ZUCKER_DESSERT);
const FRUEHSTUECK_G = summe(ZUCKER_FRUEHSTUECK);
const zaehle = (t: number, liste: [number, number][]) => {
  let g = 0;
  for (const [t0, plus] of liste) g += plus * interpolate(t, [t0, t0 + 0.35], [0, 1], clamp);
  return g;
};
const zuckerBei = (t: number) => {
  const runter = interpolate(t, [C.besser + 0.05, C.besser + 0.6], [1, 0], clamp);
  return Math.round(zaehle(t, ZUCKER_DESSERT) * runter + (t > C.besser ? zaehle(t, ZUCKER_FRUEHSTUECK) : 0));
};

// ---------- Untertitel: Wort fuer Wort ----------
const ZUCKER_WOERTER = ["dessert", "süß", "gesüßt", "honig", "zucker"]; // Gold
const GUT_WOERTER = ["ungesüßtes", "frühstück"]; // Violett
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
  const farbe = GUT_WOERTER.includes(klein) ? ACAI_HELL : ZUCKER_WOERTER.includes(klein) ? GOLD : FARBE.figur;
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
  const kam = kameraBei(t, KAMERA);

  const imLaden = t >= C.darum && t < C.oben;
  const imVergleich = t >= C.fruehstueck && t < C.schleife;

  // Figur bei der Bowl
  const zurBeere = ein(t, C.beere, 0.3) * aus(t, C.darum, 0.1);
  const probieren = ein(t, C.schmeckt, 0.35) * aus(t, C.erdig - 0.1, 0.3);
  const zweifel = ein(t, C.erdig, 0.35) * aus(t, C.darum, 0.1);
  const erleichtert = aus(t, C.besser, 0.4);
  const druck = Math.max(0.25 * ein(t, C.honig + 0.2, 0.5), 0.6 * ein(t, C.zucker, 0.3)) * erleichtert;
  const licht = 1 - 0.6 * ein(t, C.zucker, 0.4) * erleichtert;
  const freude = Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - C.beeren - 0.1) / 0.45)) * Math.PI));
  const blick = t < C.beere ? 0.6 : t < C.oben ? -0.9 * zurBeere : 0.7;

  const zZ = ein(t, C.gesuesst, 0.3);
  const zuckerZaehler = (x: number, y: number, o: number) =>
    o > 0 ? (
      <Zaehler
        key={`z${x}`}
        x={x}
        y={y}
        oben="ZUCKER"
        unten={`${zuckerBei(t)} g`}
        deckkraft={o}
        skala={1.6 + 0.15 * federn(t, C.gesuesst + 0.1, 0.4) + 0.25 * federn(t, C.zucker, 0.5)}
      />
    ) : null;

  // Figur im Vergleich: schaut nach rechts (Fruehstueck), links (Dessert), dann fragend
  const vBlick = 0.8 * ein(t, C.fruehstueck, 0.25) - 1.6 * ein(t, C.dessert2, 0.25) + 0.8 * ein(t, C.was, 0.3);
  const vKippen = -8 * ein(t, C.deine2, 0.25) + 16 * ein(t, C.bowl2, 0.25);

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
            {zuckerZaehler(SX + 200, 1050, zZ)}
          </>
        ) : imVergleich ? (
          <>
            <Leuchten x={VL} y={RAND + 60} r={280} staerke={0.1} />
            <Leuchten x={VR} y={RAND + 60} r={280} staerke={0.1} />
            {(() => {
              const d = dessertInhalt(IMMER, VL, {banane: 0, granola: 0, honig: 0});
              return <Becher bx={VL} innen={d.innen} oben={<>{zuckerBerg(IMMER, VL, 0, d.oben)}{fahne(t, VL, C.dessert2, "DESSERT", d.oben, GOLD)}</>} />;
            })()}
            {(() => {
              const f = fruehInhalt(IMMER, VR, {pueree: 0, joghurt: 0, beeren: 0});
              return <Becher bx={VR} innen={f.innen} oben={<>{f.oben}{fahne(t, VR, C.fruehstueck, "FRÜHSTÜCK", f.ober, ACAI_HELL)}</>} />;
            })()}
            <Figur x={VX} y={BODEN} t={t} hoehe={170} blick={vBlick} kippen={vKippen} />
            <Zaehler x={VR} y={880} oben="ZUCKER" unten={`${FRUEHSTUECK_G} g`} skala={1.3 + 0.2 * federn(t, C.fruehstueck, 0.4)} deckkraft={ein(t, C.fruehstueck, 0.2)} />
            <Zaehler x={VL} y={880} oben="ZUCKER" unten={`${DESSERT_G} g`} skala={1.3 + 0.2 * federn(t, C.dessert2, 0.4)} deckkraft={ein(t, C.dessert2, 0.2)} />
          </>
        ) : (
          <>
            <Leuchten
              x={BX}
              y={RAND + 60}
              r={300}
              staerke={(0.07 + 0.08 * ein(t, C.honig, 0.6)) * ein(t, C.bowl, 0.1) * aus(t, ABSPRUNG - 0.3, 0.5) + 0.4 * ein(t, C.bowl, 0.05) * aus(t, C.bowl + 0.06, 0.5)}
            />
            <HauptBecher t={t} />
            <Beere t={t} />
            <SuesseMesser t={t} />
            <Figur x={FX} y={BODEN} t={t} blick={blick} licht={licht} huepfen={freude * 60} kippen={-7 * probieren + 10 * zweifel} stauchen={druck} />
          </>
        )}
      </Welt>
      {/* Zucker-Zaehler an der Bowl: fest oben im Bild, damit er bei jeder Einstellung lesbar bleibt */}
      {!imLaden && !imVergleich && t >= C.oben && t < C.schleife ? zuckerZaehler(230, 235, 1) : null}
      <Untertitel t={t} />
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
