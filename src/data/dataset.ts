// Static embedded dataset — 38 provinces.
// Source: Hasil Skor sheet + Data Provinsi (Gap) from
// "Copy of template_kesiapan_transisi_energi_FORMULA.xlsx"
// and KMeans_Tipologi + LISA sheets from "Hasil_KMeans_LISA.xlsx".

export type LisaType = "High-High" | "Low-Low" | "Low-High" | "High-Low" | "Tidak signifikan";

export interface ProvinceDatum {
  rank: number;
  no: number;
  kode: number; // BPS code
  nama: string;
  capaian: number;       // 0..1 — Capaian dan Trayektori
  sumberDaya: number;    // 0..1 — Sumber Daya dan Pemanfaatan
  pembiayaan: number;    // 0..1 — Pembiayaan dan Fiskal
  regulasi: number;      // 0..1 — Regulasi dan Kelembagaan
  infrastruktur: number; // 0..1 — Infrastruktur Jaringan
  skor: number;          // 0..1 — Hasil Skor (Indeks Akhir Kesiapan)
  gap: number;           // poin — Gap vs Target RUED-P (negatif = melampaui target)
  tier: number;          // 1..4 — K-Means cluster
  tipologi: string;      // K-Means label (eksak)
  lisa: LisaType;        // Tipe LISA (klaster) — signifikan saja
  kuadran: string;       // Kuadran Local Moran's I (semua)
  pValue: number;
  localI: number;
}

export const DATASET: ProvinceDatum[] = [
  {"rank": 1, "no": 1, "kode": 32, "nama": "Jawa Barat", "capaian": 0.643537415, "sumberDaya": 1.0, "pembiayaan": 0.9213836478, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.9540173873, "gap": -1.0, "tier": 1, "tipologi": "Tier 1 - Matang (Inti Jawa)", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.056, "localI": 2.197},
  {"rank": 2, "no": 2, "kode": 35, "nama": "Jawa Timur", "capaian": 0.474829932, "sumberDaya": 0.673653822, "pembiayaan": 0.7394284435, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.8188145505, "gap": 2.2, "tier": 1, "tipologi": "Tier 1 - Matang (Inti Jawa)", "lisa": "High-High", "kuadran": "High-High", "pValue": 0.035, "localI": 1.773},
  {"rank": 3, "no": 3, "kode": 31, "nama": "DKI Jakarta", "capaian": 0.1646258503, "sumberDaya": 0.831387808, "pembiayaan": 0.5095271502, "regulasi": 1.0, "infrastruktur": 1.0, "skor": 0.7906309074, "gap": 11.3, "tier": 1, "tipologi": "Tier 1 - Matang (Inti Jawa)", "lisa": "High-High", "kuadran": "High-High", "pValue": 0.008, "localI": 1.93},
  {"rank": 4, "no": 4, "kode": 33, "nama": "Jawa Tengah", "capaian": 0.4269387755, "sumberDaya": 0.7681582361, "pembiayaan": 0.4975361963, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.780051656, "gap": 6.12, "tier": 1, "tipologi": "Tier 1 - Matang (Inti Jawa)", "lisa": "High-High", "kuadran": "High-High", "pValue": 0.001, "localI": 2.26},
  {"rank": 5, "no": 5, "kode": 12, "nama": "Sumatera Utara", "capaian": 0.6299319728, "sumberDaya": 0.3255512322, "pembiayaan": 0.4465647484, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.6690782094, "gap": -0.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.336, "localI": 0.414},
  {"rank": 6, "no": 6, "kode": 73, "nama": "Sulawesi Selatan", "capaian": 0.7306122449, "sumberDaya": 0.3315730962, "pembiayaan": 0.4118669294, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.6676791847, "gap": -4.2, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-Low", "pValue": 0.826, "localI": -0.107},
  {"rank": 7, "no": 7, "kode": 11, "nama": "Aceh", "capaian": 0.3850340136, "sumberDaya": 0.6077185738, "pembiayaan": 0.1426534857, "regulasi": 1.0, "infrastruktur": 0.9571428571, "skor": 0.6472425373, "gap": 8.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.323, "localI": 0.384},
  {"rank": 8, "no": 8, "kode": 64, "nama": "Kalimantan Timur", "capaian": 0.2027210884, "sumberDaya": 0.5270876983, "pembiayaan": 0.2369743511, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.636900752, "gap": 15.2, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-Low", "pValue": 0.373, "localI": -0.315},
  {"rank": 9, "no": 9, "kode": 13, "nama": "Sumatera Barat", "capaian": 0.568707483, "sumberDaya": 0.3344255581, "pembiayaan": 0.2304432931, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.6080148013, "gap": 1.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.37, "localI": 0.253},
  {"rank": 10, "no": 10, "kode": 72, "nama": "Sulawesi Tengah", "capaian": 0.5619047619, "sumberDaya": 0.3344255581, "pembiayaan": 0.2850281837, "regulasi": 1.0, "infrastruktur": 0.8571428571, "skor": 0.601117487, "gap": 2.0, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-Low", "pValue": 0.969, "localI": -0.012},
  {"rank": 11, "no": 11, "kode": 71, "nama": "Sulawesi Utara", "capaian": 0.8394557823, "sumberDaya": 0.2561226825, "pembiayaan": 0.1518332044, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.5910739427, "gap": -8.2, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-Low", "pValue": 0.734, "localI": -0.076},
  {"rank": 12, "no": 12, "kode": 14, "nama": "Riau", "capaian": 0.3850340136, "sumberDaya": 0.2323186084, "pembiayaan": 0.2780334034, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5840936621, "gap": 4.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.31, "localI": 0.209},
  {"rank": 13, "no": 13, "kode": 17, "nama": "Bengkulu", "capaian": 0.493877551, "sumberDaya": 0.3929961089, "pembiayaan": 0.0643792438, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5774857558, "gap": 4.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.507, "localI": 0.132},
  {"rank": 14, "no": 14, "kode": 16, "nama": "Sumatera Selatan", "capaian": 0.2081632653, "sumberDaya": 0.1952599929, "pembiayaan": 0.3173966154, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5746682625, "gap": 13.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.798, "localI": 0.052},
  {"rank": 15, "no": 15, "kode": 36, "nama": "Banten", "capaian": 0.2489795918, "sumberDaya": 0.2693471682, "pembiayaan": 0.2234385133, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5722171666, "gap": 9.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "High-High", "kuadran": "High-High", "pValue": 0.011, "localI": 0.46},
  {"rank": 16, "no": 16, "kode": 18, "nama": "Lampung", "capaian": 0.3306122449, "sumberDaya": 0.2715953307, "pembiayaan": 0.1877706354, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5685751275, "gap": 10.5, "tier": 2, "tipologi": "Tier 2 - Penantang Menengah-Atas", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.266, "localI": 0.193},
  {"rank": 17, "no": 17, "kode": 52, "nama": "Nusa Tenggara Barat", "capaian": 0.4394557823, "sumberDaya": 0.153873364, "pembiayaan": 0.07968911067, "regulasi": 1.0, "infrastruktur": 0.9428571429, "skor": 0.5188743149, "gap": 6.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "High-High", "pValue": 0.276, "localI": 0.041},
  {"rank": 18, "no": 18, "kode": 51, "nama": "Bali", "capaian": 0.1537414966, "sumberDaya": 0.103946637, "pembiayaan": 0.1109098765, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.5047989071, "gap": 15.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.091, "localI": -0.002},
  {"rank": 19, "no": 19, "kode": 15, "nama": "Jambi", "capaian": 0.3170068027, "sumberDaya": 0.1147859922, "pembiayaan": 0.1004136208, "regulasi": 1.0, "infrastruktur": 0.9142857143, "skor": 0.5007611607, "gap": 8.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.378, "localI": -0.011},
  {"rank": 20, "no": 20, "kode": 62, "nama": "Kalimantan Tengah", "capaian": 1.0, "sumberDaya": 0.02204928664, "pembiayaan": 0.08006999935, "regulasi": 1.0, "infrastruktur": 0.8571428571, "skor": 0.4977445673, "gap": -14.1, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-Low", "pValue": 0.631, "localI": 0.01},
  {"rank": 21, "no": 21, "kode": 34, "nama": "DI Yogyakarta", "capaian": 0.2299319728, "sumberDaya": 0.1147859922, "pembiayaan": 0.04767890821, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.4962005412, "gap": 10.2, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Low-High", "kuadran": "Low-High", "pValue": 0.001, "localI": -0.094},
  {"rank": 22, "no": 22, "kode": 75, "nama": "Gorontalo", "capaian": 0.4666666667, "sumberDaya": 0.140077821, "pembiayaan": 0.01024639101, "regulasi": 1.0, "infrastruktur": 0.8571428571, "skor": 0.4799409348, "gap": 5.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-Low", "pValue": 0.997, "localI": 0.0},
  {"rank": 23, "no": 23, "kode": 63, "nama": "Kalimantan Selatan", "capaian": 0.2571428571, "sumberDaya": 0.06251621271, "pembiayaan": 0.07908526277, "regulasi": 1.0, "infrastruktur": 0.9142857143, "skor": 0.4791876855, "gap": 9.2, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.597, "localI": -0.04},
  {"rank": 24, "no": 24, "kode": 21, "nama": "Kepulauan Riau", "capaian": 0.2217687075, "sumberDaya": 0.02204928664, "pembiayaan": 0.03744924579, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.4702171494, "gap": 8.0, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-Low", "pValue": 0.972, "localI": 0.003},
  {"rank": 25, "no": 25, "kode": 19, "nama": "Kep. Bangka Belitung", "capaian": 0.2027210884, "sumberDaya": 0.05155642023, "pembiayaan": 0.006516025516, "regulasi": 1.0, "infrastruktur": 0.9714285714, "skor": 0.4688579575, "gap": 9.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.231, "localI": -0.119},
  {"rank": 26, "no": 26, "kode": 61, "nama": "Kalimantan Barat", "capaian": 0.3442176871, "sumberDaya": 0.05155642023, "pembiayaan": 0.1358378865, "regulasi": 1.0, "infrastruktur": 0.7428571429, "skor": 0.4554204631, "gap": 10.0, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.861, "localI": -0.025},
  {"rank": 27, "no": 27, "kode": 74, "nama": "Sulawesi Tenggara", "capaian": 0.2108843537, "sumberDaya": 0.05058365759, "pembiayaan": 0.09338537223, "regulasi": 1.0, "infrastruktur": 0.7714285714, "skor": 0.443905584, "gap": 14.9, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.839, "localI": -0.034},
  {"rank": 28, "no": 28, "kode": 76, "nama": "Sulawesi Barat", "capaian": 0.3850340136, "sumberDaya": 0.05577172503, "pembiayaan": 0.004431314623, "regulasi": 1.0, "infrastruktur": 0.6857142857, "skor": 0.413119903, "gap": 8.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.646, "localI": -0.125},
  {"rank": 29, "no": 29, "kode": 53, "nama": "Nusa Tenggara Timur", "capaian": 0.5210884354, "sumberDaya": 0.1001433545, "pembiayaan": 0.104333178, "regulasi": 1.0, "infrastruktur": 0.4857142857, "skor": 0.4097957606, "gap": 3.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.769, "localI": -0.086},
  {"rank": 30, "no": 30, "kode": 82, "nama": "Maluku Utara", "capaian": 0.1673469388, "sumberDaya": 0.01642888024, "pembiayaan": 0.1909323507, "regulasi": 1.0, "infrastruktur": 0.4571428571, "skor": 0.3838518116, "gap": 12.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Tidak signifikan", "kuadran": "Low-Low", "pValue": 0.382, "localI": 0.314},
  {"rank": 31, "no": 31, "kode": 92, "nama": "Papua Barat", "capaian": 0.2761904762, "sumberDaya": 0.01361867704, "pembiayaan": 0.03873872214, "regulasi": 1.0, "infrastruktur": 0.5714285714, "skor": 0.3784034369, "gap": 12.5, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.005, "localI": 0.974},
  {"rank": 32, "no": 32, "kode": 81, "nama": "Maluku", "capaian": 0.0, "sumberDaya": 0.0, "pembiayaan": 0.01257861635, "regulasi": 1.0, "infrastruktur": 0.5714285714, "skor": 0.3531006736, "gap": 22.65, "tier": 3, "tipologi": "Tier 3 - Menengah-Bawah Beragam", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.008, "localI": 0.998},
  {"rank": 33, "no": 33, "kode": 65, "nama": "Kalimantan Utara", "capaian": 0.1863945578, "sumberDaya": 0.004421648391, "pembiayaan": 0.1092179384, "regulasi": 1.0, "infrastruktur": 0.1314285714, "skor": 0.2860300641, "gap": 15.8, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Tidak signifikan", "kuadran": "Low-High", "pValue": 0.871, "localI": -0.084},
  {"rank": 34, "no": 34, "kode": 96, "nama": "Papua Barat Daya", "capaian": 0.2761904762, "sumberDaya": 0.01361867704, "pembiayaan": 0.03873872214, "regulasi": 0.5, "infrastruktur": 0.5714285714, "skor": 0.2698942476, "gap": 12.5, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.027, "localI": 1.39},
  {"rank": 35, "no": 35, "kode": 91, "nama": "Papua", "capaian": 0.4394557823, "sumberDaya": 0.02542153048, "pembiayaan": 0.08056377555, "regulasi": 1.0, "infrastruktur": 0.0, "skor": 0.26779162, "gap": 6.5, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.001, "localI": 2.188},
  {"rank": 36, "no": 36, "kode": 93, "nama": "Papua Selatan", "capaian": 0.4394557823, "sumberDaya": 0.02542153048, "pembiayaan": 0.08056377555, "regulasi": 0.5, "infrastruktur": 0.0, "skor": 0.1592824307, "gap": 6.5, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.001, "localI": 2.891},
  {"rank": 37, "no": 37, "kode": 94, "nama": "Papua Tengah", "capaian": 0.4394557823, "sumberDaya": 0.02542153048, "pembiayaan": 0.08056377555, "regulasi": 0.5, "infrastruktur": 0.0, "skor": 0.1592824307, "gap": 6.5, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.007, "localI": 2.589},
  {"rank": 38, "no": 38, "kode": 95, "nama": "Papua Pegunungan", "capaian": 0.4394557823, "sumberDaya": 0.02542153048, "pembiayaan": 0.08056377555, "regulasi": 0.5, "infrastruktur": 0.0, "skor": 0.1592824307, "gap": 6.5, "tier": 4, "tipologi": "Tier 4 - Tertinggal Struktural", "lisa": "Low-Low", "kuadran": "Low-Low", "pValue": 0.001, "localI": 2.891},];

// === Global Moran's I (KNN k=4, row-standardized, 999 permutations) ===
export const MORAN_GLOBAL = {
  variable: "Skor Indeks Akhir Kesiapan",
  weightMatrix: "K-Nearest Neighbors (k=4, Row-Standardized)",
  I: 0.616184,
  zScore: 6.113416,
  pValue: 0.0,
  category: "Positif Kuat / Clustering",
};

// === 4-tier IKT bands (0..100) ===
export interface Band {
  min: number;
  max: number;
  label: string;
  color: string;
}
export const IKT_BANDS: Band[] = [
  { min: 0,  max: 25,  label: "Belum Siap",   color: "#CC0001" },
  { min: 26, max: 50,  label: "Kurang Siap",  color: "#F89C13" },
  { min: 51, max: 75,  label: "Cukup Siap",   color: "#7FAC1E" },
  { min: 76, max: 100, label: "Sangat Siap",  color: "#529718" },
];

export function iktBandFor(score100: number): Band {
  if (score100 <= 25) return IKT_BANDS[0];
  if (score100 <= 50) return IKT_BANDS[1];
  if (score100 <= 75) return IKT_BANDS[2];
  return IKT_BANDS[3];
}

// === LISA colors ===
export const LISA_COLORS: Record<LisaType, string> = {
  "High-High": "#E5484D",
  "Low-Low": "#2B6CB0",
  "Low-High": "#BEE3F8",
  "High-Low": "#E2E8F0",      // not present in dataset as significant
  "Tidak signifikan": "#E2E8F0",
};
export const LISA_LABELS: Record<LisaType, string> = {
  "High-High": "High-High (Pelopor Berkelompok)",
  "Low-Low": "Low-Low (Zona Tertinggal)",
  "Low-High": "Low-High (Outlier Negatif)",
  "High-Low": "High-Low (Outlier Positif)",
  "Tidak signifikan": "Tidak signifikan (Acak)",
};

// === Name normalization for GeoJSON join ===
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/daerah istimewa/g, "di")
    .replace(/kepulauan/g, "kep")
    .replace(/\s+/g, " ")
    .replace(/[.,]/g, "")
    .trim();
}

// === Diagnostic engine: variable to fix ===
export interface WeakVar {
  key: string;
  label: string;
  value: number;
}
const SUBSCORES: { key: keyof ProvinceDatum; label: string; criticalMsg: string }[] = [
  { key: "capaian", label: "Capaian dan Trayektori", criticalMsg: "Trayektori EBT Tertinggal" },
  { key: "sumberDaya", label: "Sumber Daya dan Pemanfaatan", criticalMsg: "Pemanfaatan Potensi EBT Rendah" },
  { key: "pembiayaan", label: "Pembiayaan dan Fiskal", criticalMsg: "Alokasi Anggaran Fiskal Rendah" },
  { key: "regulasi", label: "Regulasi dan Kelembagaan", criticalMsg: "Regulasi Daerah Belum Kuat" },
  { key: "infrastruktur", label: "Infrastruktur Jaringan", criticalMsg: "Infrastruktur Jaringan Lemah" },
];

export function detectWeaknesses(d: ProvinceDatum): WeakVar[] {
  return SUBSCORES.filter((s) => (d[s.key] as number) < 0.5).map((s) => ({
    key: s.key as string,
    label: s.criticalMsg,
    value: d[s.key] as number,
  }));
}

export function hasNoCritical(d: ProvinceDatum): boolean {
  return SUBSCORES.every((s) => (d[s.key] as number) >= 0.6);
}
