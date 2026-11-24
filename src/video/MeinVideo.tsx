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
const surfY = BODEN - 132; // Oberseite der Bowl-Fuellung

// Kamera-Tabelle: [Sekunde, Zoom, x, y]
const START: KameraZeile = [0, 2.1, BX + 40, 1420];
const KAMERA: KameraZeile[] = [
  START, // nah: Bowl faellt herein
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
  [C.gesuesst + 0.3, 1.8, SX + 60, 1180], // nah: Zucker faellt
  [C.oben - 0.01, 1.85, SX + 60, 1180],
  [C.oben, 1.35, 600, 1300], // Schnitt, halbnah: Bowl, Figur, Zaehler
  [C.granola - 0.2, 1.45, 640, 1320],
  [C.honig - 0.1, 1.5, 660, 1330],
  [C.honig + 0.4, 2.1, BX, 1400], // nah: Honig
  [C.loeffelst - 0.1, 2.1, BX, 1400],
  [C.loeffelst + 0.4, 1.6, BX, 1280], // halbnah: Loeffel
  [C.schale - 0.01, 1.6, BX, 1280],
  [C.schale, 1.25, 600, 1290], // Schnitt, halbnah: Figur, Bowl, Zaehler
  [C.zucker - 0.1, 1.3, 600, 1290],
  [C.zucker + 0.3, 1.5, 620, 1290], // Zuckerberg
  [C.besser - 0.05, 1.5, 620, 1290],
  [C.besser + 0.4, 1.3, 620, 1260], // alles fliegt weg
  [C.ungesuesst + 0.5, 1.6, BX, 1220], // halbnah: Beutel giesst
  [C.joghurt - 0.1, 1.6, BX, 1220],
  [C.joghurt + 0.4, 2.0, BX, 1360], // nah: Joghurt
  [C.frische, 2.0, BX, 1360],
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

// ---------- Inhalte der Bowl (Weltkoordinaten) ----------
const bananen = (t: number, bx: number, t0: number) => {
  const n: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const landet = t0 + i * 0.07;
    if (t < landet - 0.45) continue;
    const zx = bx - 90 + i * 45 + (zufall(i) - 0.5) * 14;
    const zy = surfY - 6 + (i % 2) * 8;
    const yy = fall(t, landet, 0.45, zy - 620, zy) - 14 * federn(t, landet, 0.3);
    n.push(
      <g key={`b${i}`} transform={`translate(${zx} ${yy}) rotate(${(zufall(i + 3) - 0.5) * 30})`}>
        <ellipse rx={21} ry={11} fill="#F4EBC6" />
        <ellipse rx={8} ry={4} fill="#D9CC98" />
      </g>,
    );
  }
  return n;
};

const granola = (t: number, bx: number, t0: number) => {
  const n: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const landet = t0 + (i / 15) * 0.4;
    if (t < landet - 0.4) continue;
    const a = zufall(i + 20) * Math.PI * 2;
    const r = Math.sqrt(zufall(i + 40));
    const zx = bx + Math.cos(a) * 115 * r;
    const zy = surfY - 14 + Math.sin(a) * 14 * r;
    const yy = fall(t, landet, 0.4, zy - 560, zy);
    const s = 6 + zufall(i + 60) * 5;
    n.push(<rect key={`g${i}`} x={zx - s} y={yy - s * 0.7} width={2 * s} height={1.4 * s} rx={3} fill="#C99A5B" transform={`rotate(${zufall(i) * 90} ${zx} ${yy})`} />);
  }
  return n;
};

const honig = (t: number, bx: number, t0: number) => {
  const n: React.ReactNode[] = [];
  const start = t0 - 0.25;
  if (t <= start) return n;
  const unten = interpolate(t, [start, t0], [surfY - 700, surfY - 18], clamp);
  const oben = interpolate(t, [t0 + 0.5, t0 + 0.9], [surfY - 700, surfY - 18], clamp);
  const wackeln = Math.sin(t * 9) * 4;
  if (oben < unten - 2)
    n.push(<path key="hf" d={`M ${bx + 10} ${oben} Q ${bx + 10 + wackeln} ${(oben + unten) / 2} ${bx} ${unten}`} stroke={GOLD} strokeWidth={7} fill="none" strokeLinecap="round" style={leuchtFilter("rgba(232,176,74,0.7)", 10)} />);
  const lache = ein(t, t0, 0.9);
  if (lache > 0) {
    n.push(<ellipse key="hl" cx={bx} cy={surfY - 16} rx={90 * lache} ry={12 * lache} fill={GOLD} opacity={0.9} style={leuchtFilter("rgba(232,176,74,0.6)", 12)} />);
    n.push(<path key="hs" d={`M ${bx - 60 * lache} ${surfY - 16} Q ${bx} ${surfY - 30} ${bx + 60 * lache} ${surfY - 14}`} stroke="#F6D58E" strokeWidth={4} fill="none" opacity={0.8 * lache} />);
  }
  return n;
};

/** Berg aus Zuckerwuerfeln, der sich auf „Zucker“ auftuermt */
const zuckerBerg = (t: number, bx: number, t0: number) => {
  const n: React.ReactNode[] = [];
  const reihen = [5, 4, 3, 2, 1];
  const s = 34;
  let k = 0;
  reihen.forEach((anz, r) => {
    for (let i = 0; i < anz; i++, k++) {
      const landet = t0 + k * 0.025;
      if (t < landet - 0.25) continue;
      const x = bx + (i - (anz - 1) / 2) * (s + 4);
      const y = surfY - 30 - r * (s + 2);
      const yy = fall(t, landet, 0.25, y - 400, y);
      n.push(<rect key={`z${k}`} x={x - s / 2} y={yy - s / 2} width={s} height={s} rx={4} fill={FARBE.figur} stroke="rgba(0,0,0,0.15)" strokeWidth={2} style={leuchtFilter("rgba(232,176,74,0.55)", 10)} />);
    }
  });
  return n;
};

/** Joghurt: dicker, fluessiger Strahl, der auf „Naturjoghurt“ auftrifft und zu einer welligen Lache zerlaeuft */
const joghurt = (t: number, bx: number, t0: number) => {
  const start = t0 - 0.2;
  if (t < start) return [];
  const n: React.ReactNode[] = [];
  const cx = bx - 15;
  const cy = surfY - 16;
  // Strahl: trifft auf „Naturjoghurt“, reisst nach 0,7 s oben ab
  const unten = interpolate(t, [start, t0], [cy - 650, cy], clamp);
  const oben = interpolate(t, [t0 + 0.45, t0 + 0.8], [cy - 650, cy], clamp);
  if (oben < unten - 2) {
    const w = Math.sin(t * 7) * 6;
    n.push(<path key="js" d={`M ${cx + 6} ${oben} C ${cx + 6 + w} ${oben + (unten - oben) * 0.4}, ${cx - w} ${oben + (unten - oben) * 0.7}, ${cx} ${unten}`} stroke={FARBE.figur} strokeWidth={22} fill="none" strokeLinecap="round" style={leuchtFilter("rgba(242,242,240,0.45)", 10)} />);
  }
  // Lache: waechst weich, Rand wellt sich leicht
  const g = ein(t, t0, 1.0);
  if (g > 0) {
    const pkt: string[] = [];
    const N = 28;
    for (let k = 0; k <= N; k++) {
      const a = (k / N) * Math.PI * 2;
      const welle = 1 + 0.12 * Math.sin(a * 3 + 1.3) + 0.07 * Math.sin(a * 5 + t * 1.5);
      pkt.push(`${(cx + Math.cos(a) * 100 * g * welle).toFixed(1)},${(cy + Math.sin(a) * 17 * g * welle).toFixed(1)}`);
    }
    n.push(<polygon key="jl" points={pkt.join(" ")} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)", 8)} />);
    // Marmorierung: violetter Schlieren und Glanz
    n.push(<path key="jm" d={`M ${cx - 70 * g} ${cy + 2} Q ${cx - 20 * g} ${cy - 12 * g} ${cx + 10 * g} ${cy} T ${cx + 75 * g} ${cy - 2}`} stroke={ACAI_HELL} strokeWidth={4} fill="none" opacity={0.7 * g} strokeLinecap="round" />);
    n.push(<ellipse key="jg" cx={cx - 30 * g} cy={cy - 6 * g} rx={22 * g} ry={4 * g} fill="#FFFFFF" opacity={0.9} />);
  }
  return n;
};

const beeren = (t: number, bx: number, t0: number) => {
  const n: React.ReactNode[] = [];
  const orte = [-95, -60, 40, 75, 105, 10];
  orte.forEach((dx, i) => {
    const landet = t0 + i * 0.06;
    if (t < landet - 0.4) return;
    const zy = surfY - 18 + (i % 2) * 8;
    const yy = fall(t, landet, 0.4, zy - 600, zy) - 16 * federn(t, landet, 0.3);
    n.push(
      <g key={`be${i}`}>
        <circle cx={bx + dx} cy={yy} r={15} fill={i % 3 === 2 ? ACAI_HELL : ACAI} style={leuchtFilter("rgba(156,116,224,0.5)", 8)} />
        <circle cx={bx + dx - 5} cy={yy - 5} r={4} fill="#FFFFFF" opacity={0.35} />
      </g>,
    );
  });
  return n;
};

/** Faehnchen mit Aufschrift, faellt hinein und steckt auf t0 */
const fahne = (t: number, bx: number, t0: number, text: string, farbe = FARBE.figur) => {
  if (t < t0 - 0.35) return null;
  const yy = fall(t, t0, 0.35, surfY - 700, surfY - 20);
  const wippen = 8 * federn(t, t0, 0.5);
  const b = text.length * 15 + 26;
  return (
    <g key={`f${text}`} transform={`translate(${bx + 70} ${yy}) rotate(${8 + wippen})`}>
      <rect x={-2.5} y={-170} width={5} height={180} fill={FARBE.figur} rx={2} />
      <rect x={2} y={-170} width={b} height={44} rx={4} fill={farbe} style={leuchtFilter("rgba(242,242,240,0.35)")} />
      <text x={2 + b / 2} y={-140} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={3} fill="#111">
        {text}
      </text>
    </g>
  );
};

/** Loeffel: taucht auf „löffelst“ ein und hebt eine Ladung heraus */
const loeffel = (t: number, bx: number, t0: number) => {
  if (t < t0 - 0.4 || t > t0 + 1.2) return null;
  const rein = interpolate(t, [t0 - 0.4, t0], [0, 1], clamp);
  const raus = interpolate(t, [t0 + 0.35, t0 + 1.1], [0, 1], clamp);
  const x = bx + 40 + 260 * (1 - rein) * (1 - rein) + 200 * raus * raus;
  const y = surfY - 20 - 520 * (1 - rein) * (1 - rein) - 640 * raus * raus;
  const dreh = -35 + 20 * rein - 25 * raus;
  return (
    <g key="loeffel" transform={`translate(${x} ${y}) rotate(${dreh})`}>
      <rect x={20} y={-6} width={230} height={12} rx={6} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)")} />
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
  const py = surfY - 360 - 300 * (1 - auf);
  const strahl = t > C.pueree2 - 0.05 && t < C.joghurt - 0.3;
  const sEnde = interpolate(t, [C.pueree2 - 0.05, C.pueree2 + 0.15], [py, surfY - 20], clamp);
  return (
    <g key="beutel" opacity={auf}>
      {strahl ? <path d={`M ${px - 70} ${py - 10} Q ${bx + 20} ${py + 30} ${bx + 10} ${sEnde}`} stroke={ACAI} strokeWidth={16} fill="none" strokeLinecap="round" /> : null}
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

// ---------- Schale ----------
const Schale: React.FC<{bx: number; dy?: number; sq?: number; children?: React.ReactNode; vorne?: React.ReactNode}> = ({bx, dy = 0, sq = 0, children, vorne}) => {
  const y = BODEN;
  return (
    <svg width={1} height={1} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <g transform={`translate(0 ${dy}) translate(${bx} ${y}) scale(${1 + 0.1 * sq} ${1 - 0.14 * sq}) translate(${-bx} ${-y})`}>
        <path d={`M ${bx - 160} ${y - 120} Q ${bx - 150} ${y - 4} ${bx} ${y - 2} Q ${bx + 150} ${y - 4} ${bx + 160} ${y - 120} Z`} fill={FARBE.figur} style={leuchtFilter("rgba(242,242,240,0.35)", 16)} />
        <ellipse cx={bx} cy={y - 120} rx={160} ry={24} fill={FARBE.figur} />
        <path d={`M ${bx - 148} ${y - 120} Q ${bx} ${surfY - 34} ${bx + 148} ${y - 120} Q ${bx} ${y - 100} ${bx - 148} ${y - 120} Z`} fill={ACAI} />
        <ellipse cx={bx - 40} cy={surfY - 6} rx={50} ry={7} fill={ACAI_HELL} opacity={0.6} />
        {children}
      </g>
      {vorne}
    </svg>
  );
};

/** Haupt-Bowl in Szene 1, 2, 4, 5, 6 und im Schlussbild */
const HauptBowl: React.FC<{t: number}> = ({t}) => {
  // Ende (Schleife): steht leer da, springt hoch und haengt im letzten Bild wie im ersten
  if (t >= C.schleife) {
    const p = interpolate(t, [ABSPRUNG, DAUER], [0, 1], clamp);
    const dy = -400 * (1 - (1 - p) * (1 - p));
    const sq = t < ABSPRUNG ? 0.6 * ein(t, ABSPRUNG - 0.3, 0.3) : 0;
    return <Schale bx={BX} dy={dy} sq={sq} />;
  }
  // Anfang: faellt ab Bild 1 herein, landet auf „Açaí-Bowl“
  const dy = fall(t, C.bowl, C.bowl, -400, 0);
  const sq = federn(t, C.bowl, 0.4);
  const spritzer: React.ReactNode[] = [];
  if (t > C.bowl && t < C.bowl + 0.7) {
    const p = (t - C.bowl) / 0.7;
    [-1, -0.4, 0.5, 1].forEach((r, i) => {
      const sx = BX + r * (70 + 230 * p);
      const sy = surfY - 20 - (520 + 80 * (i % 2)) * p + 640 * p * p;
      spritzer.push(<circle key={`sp${i}`} cx={sx} cy={sy} r={12 - 1.5 * i} fill={ACAI} opacity={1 - p * p} />);
    });
  }
  // Szene 6: alles Alte fliegt auf „Besser“ nach oben weg
  const weg = interpolate(t, [C.besser, C.besser + 0.45], [0, 1], clamp);
  const alt =
    weg < 1 ? (
      <g key="alt" transform={`translate(0 ${-900 * weg * weg})`} opacity={1 - weg}>
        {bananen(t, BX, C.banane)}
        {granola(t, BX, C.granola)}
        {honig(t, BX, C.honig)}
        {t > C.zucker - 0.3 ? zuckerBerg(t, BX, C.zucker) : null}
        {fahne(t, BX, C.dessert, "DESSERT")}
      </g>
    ) : null;
  return (
    <Schale
      bx={BX}
      dy={dy}
      sq={sq}
      vorne={
        <>
          {spritzer}
          {loeffel(t, BX, C.loeffelst)}
          {beutelGiesst(t, BX)}
        </>
      }
    >
      {alt}
      {t > C.besser ? (
        <>
          {joghurt(t, BX, C.joghurt)}
          {beeren(t, BX, C.beeren)}
        </>
      ) : null}
    </Schale>
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
            <Leuchten x={VL} y={surfY} r={260} staerke={0.1} />
            <Leuchten x={VR} y={surfY} r={260} staerke={0.1} />
            <Schale bx={VL} vorne={fahne(t, VL, C.dessert2, "DESSERT", GOLD)}>
              {bananen(IMMER, VL, 0)}
              {granola(IMMER, VL, 0)}
              {honig(IMMER, VL, 0)}
              {zuckerBerg(IMMER, VL, 0)}
            </Schale>
            <Schale bx={VR} vorne={fahne(t, VR, C.fruehstueck, "FRÜHSTÜCK", ACAI_HELL)}>
              {joghurt(IMMER, VR, 0)}
              {beeren(IMMER, VR, 0)}
            </Schale>
            <Figur x={VX} y={BODEN} t={t} hoehe={170} blick={vBlick} kippen={vKippen} />
            <Zaehler x={VR} y={1010} oben="ZUCKER" unten={`${FRUEHSTUECK_G} g`} skala={1.3 + 0.2 * federn(t, C.fruehstueck, 0.4)} deckkraft={ein(t, C.fruehstueck, 0.2)} />
            <Zaehler x={VL} y={1010} oben="ZUCKER" unten={`${DESSERT_G} g`} skala={1.3 + 0.2 * federn(t, C.dessert2, 0.4)} deckkraft={ein(t, C.dessert2, 0.2)} />
          </>
        ) : (
          <>
            <Leuchten
              x={BX}
              y={surfY}
              r={300}
              staerke={(0.07 + 0.08 * ein(t, C.honig, 0.6)) * ein(t, C.bowl, 0.1) * aus(t, ABSPRUNG - 0.3, 0.5) + 0.4 * ein(t, C.bowl, 0.05) * aus(t, C.bowl + 0.06, 0.5)}
            />
            <HauptBowl t={t} />
            <Beere t={t} />
            <SuesseMesser t={t} />
            <Figur x={FX} y={BODEN} t={t} blick={blick} licht={licht} huepfen={freude * 60} kippen={-7 * probieren + 10 * zweifel} stauchen={druck} />
          </>
        )}
      </Welt>
      {/* Zucker-Zaehler an der Bowl: fest oben im Bild, damit er bei jeder Einstellung lesbar bleibt */}
      {!imLaden && !imVergleich && t >= C.oben && t < C.schleife ? zuckerZaehler(540, 330, 1) : null}
      <Untertitel t={t} />
      {Z.datei ? <Audio src={staticFile(Z.datei)} /> : null}
    </AbsoluteFill>
  );
};
