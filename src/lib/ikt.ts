import type { ProvinceRow } from "../data/provinces";

export type Dim = "capaian" | "komitmen" | "pembiayaan" | "infrastruktur";

export interface IktScore {
  row: ProvinceRow;
  // normalized 0..1 for each input variable
  n: {
    bauran25: number;
    trend: number; // average yearly delta
    pemanfaatan: number;
    elektrifikasi: number;
    kapasitas: number;
    potensi: number;
    anggaran: number;
    investasi: number;
    pdrb: number;
    padApbd: number;
    statusRued: number;
    gapInv: number; // inverted gap (good = high)
    targetAmbisi: number;
  };
  dims: Record<Dim, number>; // 0..100
  ikt: number; // 0..100
  rank: number;
  bandLabel: string;
  bandColor: string;
}

const DIM_WEIGHTS: Record<Dim, number> = {
  capaian: 0.35,
  komitmen: 0.2,
  pembiayaan: 0.25,
  infrastruktur: 0.2,
};

const VAR_LABELS: Record<string, string> = {
  bauran25: "Bauran EBT 2025",
  trend: "Trayektori Pertumbuhan",
  pemanfaatan: "Pemanfaatan Potensi",
  elektrifikasi: "Rasio Elektrifikasi",
  kapasitas: "Kapasitas Terpasang",
  potensi: "Potensi EBT",
  anggaran: "Anggaran EBT (APBD)",
  investasi: "Realisasi Investasi",
  pdrb: "PDRB / Kapita",
  padApbd: "Kapasitas Fiskal (PAD/APBD)",
  statusRued: "Status Perda RUED",
  gapInv: "Deviasi Trayektori",
  targetAmbisi: "Ambisi Target RUED",
};

export const BANDS = [
  { max: 20, label: "Sangat Buruk", color: "#BB2528" },
  { max: 40, label: "Buruk", color: "#EA4630" },
  { max: 60, label: "Sedang", color: "#F8B229" },
  { max: 80, label: "Baik", color: "#146B3A" },
  { max: 100, label: "Sangat Baik", color: "#165B33" },
];

export function bandFor(score: number) {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1];
}

function minMax(vals: number[]) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  return (v: number) => (v - min) / range;
}
function minMaxInv(vals: number[]) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  return (v: number) => (max - v) / range;
}

export function computeAllScores(rows: ProvinceRow[]): IktScore[] {
  const bauran25 = rows.map((r) => r.ebt2025);
  const trend = rows.map((r) => (r.ebt2025 - r.ebt2022) / 3);
  const pemanfaatanRaw = rows.map((r) =>
    r.potensi > 0 ? (r.kapasitas / 1000 / r.potensi) * 100 : 0
  );
  const elektrifikasi = rows.map((r) => r.elektrifikasi);
  const kapasitas = rows.map((r) => r.kapasitas);
  const potensi = rows.map((r) => r.potensi);
  const anggaranPerCap = rows.map((r) => r.anggaran / (r.populasi / 1_000_000));
  const investasiPerCap = rows.map((r) => r.investasi / (r.populasi / 1_000_000));
  const pdrb = rows.map((r) => r.pdrbKapita);
  const padApbd = rows.map((r) => r.padApbd);
  const statusRued = rows.map((r) => r.statusRued);
  const gap = rows.map((r) => r.gapTarget);
  const target = rows.map((r) => r.targetRued);

  const nBauran = minMax(bauran25);
  const nTrend = minMax(trend);
  const nPemanfaatan = minMax(pemanfaatanRaw);
  const nElek = minMax(elektrifikasi);
  const nKap = minMax(kapasitas);
  const nPot = minMax(potensi);
  const nAng = minMax(anggaranPerCap);
  const nInv = minMax(investasiPerCap);
  const nPdrb = minMax(pdrb);
  const nPad = minMax(padApbd);
  const nStat = minMax(statusRued);
  const nGap = minMaxInv(gap); // inverse: smaller gap = better
  const nTarget = minMax(target);

  const out = rows.map((r, i) => {
    const n = {
      bauran25: nBauran(r.ebt2025),
      trend: nTrend(trend[i]),
      pemanfaatan: nPemanfaatan(pemanfaatanRaw[i]),
      elektrifikasi: nElek(r.elektrifikasi),
      kapasitas: nKap(r.kapasitas),
      potensi: nPot(r.potensi),
      anggaran: nAng(anggaranPerCap[i]),
      investasi: nInv(investasiPerCap[i]),
      pdrb: nPdrb(r.pdrbKapita),
      padApbd: nPad(r.padApbd),
      statusRued: nStat(r.statusRued),
      gapInv: nGap(r.gapTarget),
      targetAmbisi: nTarget(r.targetRued),
    };

    // 4 dimensions
    const capaian = (n.bauran25 * 0.45 + n.trend * 0.3 + n.gapInv * 0.25) * 100;
    const komitmen = (n.statusRued * 0.6 + n.targetAmbisi * 0.4) * 100;
    const pembiayaan = (n.anggaran * 0.35 + n.investasi * 0.4 + n.padApbd * 0.25) * 100;
    const infrastruktur =
      (n.kapasitas * 0.3 + n.pemanfaatan * 0.3 + n.elektrifikasi * 0.2 + n.potensi * 0.2) * 100;

    const dims: Record<Dim, number> = { capaian, komitmen, pembiayaan, infrastruktur };
    const ikt =
      dims.capaian * DIM_WEIGHTS.capaian +
      dims.komitmen * DIM_WEIGHTS.komitmen +
      dims.pembiayaan * DIM_WEIGHTS.pembiayaan +
      dims.infrastruktur * DIM_WEIGHTS.infrastruktur;

    const band = bandFor(ikt);
    return {
      row: r,
      n,
      dims,
      ikt,
      rank: 0,
      bandLabel: band.label,
      bandColor: band.color,
    };
  });

  const sorted = [...out].sort((a, b) => b.ikt - a.ikt);
  sorted.forEach((s, i) => (s.rank = i + 1));
  return out;
}

export interface Weakness {
  key: string;
  label: string;
  value: number; // normalized 0..1
}

export function detectWeaknesses(score: IktScore, top = 4): Weakness[] {
  const entries: Weakness[] = Object.entries(score.n).map(([k, v]) => ({
    key: k,
    label: VAR_LABELS[k] ?? k,
    value: v,
  }));
  return entries.sort((a, b) => a.value - b.value).slice(0, top);
}

export function buildNarrative(score: IktScore, weak: Weakness[]) {
  const r = score.row;
  const fiscalWeak = score.n.padApbd < 0.35 || score.n.anggaran < 0.35;
  const deviasi = r.gapTarget;
  const lagging = deviasi > 5;
  const ambitious = r.targetRued >= 23;
  const lines: string[] = [];

  lines.push(
    `${r.nama} berada di peringkat nasional ke-${score.rank} dari 38 provinsi dengan skor IKT ${score.ikt.toFixed(1)} (${score.bandLabel}).`
  );

  if (lagging && fiscalWeak) {
    lines.push(
      `Korelasi kelemahan terlihat jelas: kapasitas fiskal yang lemah (PAD/APBD ${r.padApbd.toFixed(1)}% dan anggaran EBT proxy Rp ${r.anggaran.toLocaleString("id-ID")} jt) berbanding lurus dengan deviasi trayektori +${deviasi.toFixed(1)} poin di bawah jalur RUED-P.`
    );
  } else if (lagging) {
    lines.push(
      `Walau kelembagaan tersedia, realisasi bauran 2025 (${r.ebt2025.toFixed(1)}%) masih tertinggal ${deviasi.toFixed(1)} poin dari trayektori menuju target RUED-P ${r.targetRued}% pada ${r.tahunTarget}.`
    );
  } else if (deviasi < 0) {
    lines.push(
      `Provinsi ini telah melampaui jalur RUED-P sebesar ${Math.abs(deviasi).toFixed(1)} poin — momentum kuat yang perlu dikunci dengan regulasi turunan.`
    );
  } else {
    lines.push(
      `Trayektori berada pada koridor: deviasi tipis ${deviasi.toFixed(1)} poin terhadap target ${r.targetRued}% RUED-P ${r.tahunTarget}.`
    );
  }

  const w0 = weak[0];
  if (w0) {
    lines.push(
      `Variabel paling perlu dibenahi: ${w0.label} (skor normalisasi ${(w0.value * 100).toFixed(0)}/100). Intervensi prioritas sebaiknya diarahkan ke titik ini.`
    );
  }

  if (r.statusRued < 1) {
    lines.push(
      `Status RUED-P daerah masih berupa rancangan (skor ${r.statusRued}); pengesahan Perda akan menggeser dimensi Komitmen secara signifikan.`
    );
  }

  if (ambitious && r.pemanfaatan < 30) {
    lines.push(
      `Target nasional 23% disandingkan dengan pemanfaatan potensi hanya ${r.pemanfaatan.toFixed(1)}% mengindikasikan jurang antara ambisi regulasi dan eksekusi proyek di lapangan.`
    );
  }

  return lines;
}
