/**
 * Wort-Zeitstempel: jedes Wort des Voice-Overs mit Start- und Endzeit (Sekunden).
 * Die Datei entsteht mit `npm run zeitstempel` (siehe skripte/zeitstempel.mjs).
 */
export type Wort = {wort: string; von: number; bis: number};
export type Zeitstempel = {datei: string; dauer: number; woerter: Wort[]};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%]/g, "");

/**
 * Liefert Funktionen, um Zeiten ueber Woerter zu finden:
 *   const {wort, wortEnde} = woerterVon(zeitstempel)
 *   wort("besser")          → Startzeit des ersten "besser"
 *   wort("Nach einem Jahr", 2) → Startzeit der zweiten Stelle mit dieser Wortfolge
 *   wortEnde("heute")       → Endzeit
 */
export const woerterVon = (z: Zeitstempel) => {
  const w = z.woerter.map((x) => ({...x, n: norm(x.wort)}));
  const finde = (suche: string, nr = 1): number => {
    const teile = suche.split(/\s+/).map(norm).filter(Boolean);
    let gefunden = 0;
    for (let i = 0; i < w.length; i++) {
      let ok = true;
      for (let k = 0; k < teile.length; k++) {
        const x = w[i + k];
        if (!x || !(x.n === teile[k] || (teile[k].length > 4 && x.n.startsWith(teile[k])))) {
          ok = false;
          break;
        }
      }
      if (ok && ++gefunden === nr) return i;
    }
    throw new Error(`Wort nicht gefunden: "${suche}" (${nr}.)`);
  };
  return {
    wort: (suche: string, nr = 1) => w[finde(suche, nr)].von,
    wortEnde: (suche: string, nr = 1) => {
      const i = finde(suche, nr);
      return w[i + suche.split(/\s+/).filter(Boolean).length - 1].bis;
    },
    dauer: z.dauer,
  };
};
