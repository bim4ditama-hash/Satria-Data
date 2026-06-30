// Pre-loaded data from template_kesiapan_transisi_energi_FORMULA.xlsx
// Kolom: kode BPS, nama, EBT 2022-2025, Target RUED, Tahun Target,
// Kapasitas Terpasang (MW), Potensi (GW), Anggaran (Rp jt), Investasi (USD jt),
// Rasio Elektrifikasi (%), PDRB/Kapita (Rp jt), PAD/APBD (%), Populasi, Status RUED,
// Pemanfaatan Potensi (%), Gap vs Target (poin)

export interface ProvinceRow {
  no: number;
  kode: string;
  nama: string;
  ebt2022: number;
  ebt2023: number;
  ebt2024: number;
  ebt2025: number;
  targetRued: number;
  tahunTarget: number;
  kapasitas: number; // MW
  potensi: number; // GW
  anggaran: number; // Rp jt
  investasi: number; // USD jt
  elektrifikasi: number; // %
  pdrbKapita: number; // Rp jt
  padApbd: number; // %
  populasi: number;
  statusRued: number; // 0 / 0.5 / 1
  pemanfaatan: number; // %
  gapTarget: number; // poin %
  catatan: string;
}

export const PROVINCES_RAW: ProvinceRow[] = [
  { no: 1, kode: "11", nama: "Aceh", ebt2022: 11.2, ebt2023: 12.5, ebt2024: 13.1, ebt2025: 14.5, targetRued: 23, tahunTarget: 2025, kapasitas: 300, potensi: 24.5, anggaran: 45000, investasi: 55, elektrifikasi: 99.85, pdrbKapita: 48.5, padApbd: 15.2, populasi: 5400000, statusRued: 1, pemanfaatan: 1.22, gapTarget: 8.5, catatan: "DEN 2023, BPS 2024, Perda RUED" },
  { no: 2, kode: "12", nama: "Sumatera Utara", ebt2022: 20.5, ebt2023: 21.8, ebt2024: 22.5, ebt2025: 23.5, targetRued: 23, tahunTarget: 2025, kapasitas: 1200, potensi: 180, anggaran: 85000, investasi: 280, elektrifikasi: 99.9, pdrbKapita: 63.5, padApbd: 45.2, populasi: 15110000, statusRued: 1, pemanfaatan: 0.67, gapTarget: -0.5, catatan: "Pembangkit Hidro dominan" },
  { no: 3, kode: "13", nama: "Sumatera Barat", ebt2022: 18.5, ebt2023: 19.5, ebt2024: 20.2, ebt2025: 21, targetRued: 22.5, tahunTarget: 2025, kapasitas: 650, potensi: 95, anggaran: 55000, investasi: 110, elektrifikasi: 99.8, pdrbKapita: 57.05, padApbd: 38.5, populasi: 5600000, statusRued: 1, pemanfaatan: 0.68, gapTarget: 1.5, catatan: "Potensi Geothermal & Hidro" },
  { no: 4, kode: "14", nama: "Riau", ebt2022: 8.2, ebt2023: 9.1, ebt2024: 9.8, ebt2025: 10.5, targetRued: 15, tahunTarget: 2025, kapasitas: 410, potensi: 85, anggaran: 65000, investasi: 210, elektrifikasi: 99.8, pdrbKapita: 142.5, padApbd: 48.2, populasi: 6610000, statusRued: 1, pemanfaatan: 0.48, gapTarget: 4.5, catatan: "Dominasi Bioenergi Kelapa Sawit" },
  { no: 5, kode: "15", nama: "Jambi", ebt2022: 7.5, ebt2023: 8.1, ebt2024: 8.8, ebt2025: 9.5, targetRued: 18, tahunTarget: 2025, kapasitas: 150, potensi: 60, anggaran: 35000, investasi: 65, elektrifikasi: 99.7, pdrbKapita: 78.2, padApbd: 32.5, populasi: 3700000, statusRued: 1, pemanfaatan: 0.25, gapTarget: 8.5, catatan: "Potensi Bioenergi" },
  { no: 6, kode: "16", nama: "Sumatera Selatan", ebt2022: 4.5, ebt2023: 5.1, ebt2024: 5.8, ebt2025: 6.5, targetRued: 20, tahunTarget: 2025, kapasitas: 450, potensi: 110, anggaran: 75000, investasi: 220, elektrifikasi: 99.8, pdrbKapita: 74.5, padApbd: 45.8, populasi: 8650000, statusRued: 1, pemanfaatan: 0.41, gapTarget: 13.5, catatan: "PLTP Rantau Dedap" },
  { no: 7, kode: "17", nama: "Bengkulu", ebt2022: 16.2, ebt2023: 17.1, ebt2024: 17.8, ebt2025: 18.5, targetRued: 23, tahunTarget: 2025, kapasitas: 280, potensi: 35, anggaran: 22000, investasi: 45, elektrifikasi: 99.8, pdrbKapita: 45.5, padApbd: 22.4, populasi: 2100000, statusRued: 1, pemanfaatan: 0.8, gapTarget: 4.5, catatan: "PLTP & PLTA" },
  { no: 8, kode: "18", nama: "Lampung", ebt2022: 10.2, ebt2023: 11.1, ebt2024: 11.8, ebt2025: 12.5, targetRued: 23, tahunTarget: 2025, kapasitas: 420, potensi: 75, anggaran: 48000, investasi: 115, elektrifikasi: 99.8, pdrbKapita: 46.2, padApbd: 35.4, populasi: 9170000, statusRued: 1, pemanfaatan: 0.56, gapTarget: 10.5, catatan: "PLTP Ulubelu" },
  { no: 9, kode: "19", nama: "Kepulauan Bangka Belitung", ebt2022: 1.2, ebt2023: 1.5, ebt2024: 1.8, ebt2025: 2.1, targetRued: 11.6, tahunTarget: 2025, kapasitas: 25, potensi: 20, anggaran: 15000, investasi: 18, elektrifikasi: 99.9, pdrbKapita: 64.2, padApbd: 28.5, populasi: 1500000, statusRued: 1, pemanfaatan: 0.13, gapTarget: 9.5, catatan: "Uji Coba Biomassa & PLTS" },
  { no: 10, kode: "21", nama: "Kepulauan Riau", ebt2022: 0.8, ebt2023: 1.1, ebt2024: 1.5, ebt2025: 2, targetRued: 10, tahunTarget: 2025, kapasitas: 30, potensi: 45, anggaran: 20000, investasi: 55, elektrifikasi: 99.9, pdrbKapita: 145.2, padApbd: 38.5, populasi: 2200000, statusRued: 1, pemanfaatan: 0.07, gapTarget: 8, catatan: "Pengembangan PLTS Kepulauan" },
  { no: 11, kode: "31", nama: "DKI Jakarta", ebt2022: 0.5, ebt2023: 0.6, ebt2024: 0.8, ebt2025: 1.1, targetRued: 12.4, tahunTarget: 2025, kapasitas: 35, potensi: 2.1, anggaran: 120000, investasi: 450, elektrifikasi: 100, pdrbKapita: 322.62, padApbd: 66.4, populasi: 10680000, statusRued: 1, pemanfaatan: 1.67, gapTarget: 11.3, catatan: "PLTS Atap" },
  { no: 12, kode: "32", nama: "Jawa Barat", ebt2022: 21.2, ebt2023: 22.5, ebt2024: 23.1, ebt2025: 24, targetRued: 23, tahunTarget: 2025, kapasitas: 3400, potensi: 170, anggaran: 95000, investasi: 850, elektrifikasi: 99.9, pdrbKapita: 51.2, padApbd: 58.2, populasi: 49400000, statusRued: 1, pemanfaatan: 2, gapTarget: -1, catatan: "PLTP & PLTA Terapung Cirata" },
  { no: 13, kode: "33", nama: "Jawa Tengah", ebt2022: 11.5, ebt2023: 13.2, ebt2024: 14.1, ebt2025: 15.2, targetRued: 21.32, tahunTarget: 2025, kapasitas: 1850, potensi: 120, anggaran: 72000, investasi: 350, elektrifikasi: 99.9, pdrbKapita: 45.2, padApbd: 48.5, populasi: 37030000, statusRued: 1, pemanfaatan: 1.54, gapTarget: 6.12, catatan: "Perda RUED" },
  { no: 14, kode: "34", nama: "Daerah Istimewa Yogyakarta", ebt2022: 3.1, ebt2023: 3.5, ebt2024: 4.1, ebt2025: 4.8, targetRued: 15, tahunTarget: 2025, kapasitas: 55, potensi: 22, anggaran: 25000, investasi: 35, elektrifikasi: 99.9, pdrbKapita: 48.2, padApbd: 45.2, populasi: 3800000, statusRued: 1, pemanfaatan: 0.25, gapTarget: 10.2, catatan: "PLTS & Bioenergi" },
  { no: 15, kode: "35", nama: "Jawa Timur", ebt2022: 10.5, ebt2023: 12.3, ebt2024: 13.5, ebt2025: 14.8, targetRued: 17, tahunTarget: 2025, kapasitas: 2100, potensi: 155, anggaran: 112000, investasi: 580, elektrifikasi: 99.9, pdrbKapita: 75.77, padApbd: 52.1, populasi: 41150000, statusRued: 1, pemanfaatan: 1.35, gapTarget: 2.2, catatan: "PLTP Ijen & PLTS Atap" },
  { no: 16, kode: "36", nama: "Banten", ebt2022: 3.5, ebt2023: 4.1, ebt2024: 4.8, ebt2025: 5.5, targetRued: 15, tahunTarget: 2025, kapasitas: 250, potensi: 45, anggaran: 40000, investasi: 310, elektrifikasi: 99.8, pdrbKapita: 68.4, padApbd: 54.2, populasi: 12250000, statusRued: 1, pemanfaatan: 0.56, gapTarget: 9.5, catatan: "PLT Sampah & Surya" },
  { no: 17, kode: "51", nama: "Bali", ebt2022: 2.5, ebt2023: 3.1, ebt2024: 3.8, ebt2025: 4.5, targetRued: 20, tahunTarget: 2025, kapasitas: 80, potensi: 35, anggaran: 38000, investasi: 85, elektrifikasi: 99.9, pdrbKapita: 68.5, padApbd: 58.2, populasi: 4400000, statusRued: 1, pemanfaatan: 0.23, gapTarget: 15.5, catatan: "Kebijakan Energi Bersih Daerah" },
  { no: 18, kode: "52", nama: "Nusa Tenggara Barat", ebt2022: 14.1, ebt2023: 15.2, ebt2024: 15.8, ebt2025: 16.5, targetRued: 23, tahunTarget: 2025, kapasitas: 180, potensi: 55, anggaran: 30000, investasi: 45, elektrifikasi: 99.8, pdrbKapita: 30.5, padApbd: 28.5, populasi: 5500000, statusRued: 1, pemanfaatan: 0.33, gapTarget: 6.5, catatan: "Skenario NZE NTB, PLTS Komersial" },
  { no: 19, kode: "53", nama: "Nusa Tenggara Timur", ebt2022: 16.5, ebt2023: 17.8, ebt2024: 18.5, ebt2025: 19.5, targetRued: 23, tahunTarget: 2025, kapasitas: 210, potensi: 95, anggaran: 35000, investasi: 60, elektrifikasi: 98.2, pdrbKapita: 24.5, padApbd: 15.4, populasi: 5600000, statusRued: 1, pemanfaatan: 0.22, gapTarget: 3.5, catatan: "PLTP Mataloko & PLTS Pulau Sabu" },
  { no: 20, kode: "61", nama: "Kalimantan Barat", ebt2022: 10.5, ebt2023: 11.2, ebt2024: 12.1, ebt2025: 13, targetRued: 23, tahunTarget: 2025, kapasitas: 150, potensi: 120, anggaran: 45000, investasi: 75, elektrifikasi: 99.1, pdrbKapita: 52.4, padApbd: 31.5, populasi: 5500000, statusRued: 1, pemanfaatan: 0.13, gapTarget: 10, catatan: "Potensi Hidro perbatasan" },
  { no: 21, kode: "62", nama: "Kalimantan Tengah", ebt2022: 34.1, ebt2023: 35.83, ebt2024: 36.2, ebt2025: 37.1, targetRued: 23, tahunTarget: 2025, kapasitas: 120, potensi: 180, anggaran: 32000, investasi: 45, elektrifikasi: 99.5, pdrbKapita: 72.3, padApbd: 34.8, populasi: 2800000, statusRued: 1, pemanfaatan: 0.07, gapTarget: -14.1, catatan: "Bauran tertinggi nasional" },
  { no: 22, kode: "63", nama: "Kalimantan Selatan", ebt2022: 4.1, ebt2023: 4.8, ebt2024: 5.2, ebt2025: 5.8, targetRued: 15, tahunTarget: 2025, kapasitas: 110, potensi: 75, anggaran: 32000, investasi: 45, elektrifikasi: 99.7, pdrbKapita: 64.5, padApbd: 38.2, populasi: 4200000, statusRued: 1, pemanfaatan: 0.15, gapTarget: 9.2, catatan: "Potensi PLTA Kusan" },
  { no: 23, kode: "64", nama: "Kalimantan Timur", ebt2022: 6.1, ebt2023: 6.53, ebt2024: 7.1, ebt2025: 7.8, targetRued: 23, tahunTarget: 2025, kapasitas: 180, potensi: 16.9, anggaran: 68000, investasi: 140, elektrifikasi: 99.8, pdrbKapita: 182.4, padApbd: 52.4, populasi: 3900000, statusRued: 1, pemanfaatan: 1.07, gapTarget: 15.2, catatan: "Perda RUED No. 8/2019" },
  { no: 24, kode: "65", nama: "Kalimantan Utara", ebt2022: 5.2, ebt2023: 5.8, ebt2024: 6.5, ebt2025: 7.2, targetRued: 23, tahunTarget: 2025, kapasitas: 35, potensi: 110, anggaran: 18000, investasi: 250, elektrifikasi: 96.96, pdrbKapita: 155.2, padApbd: 18.5, populasi: 750000, statusRued: 1, pemanfaatan: 0.03, gapTarget: 15.8, catatan: "Pembangkit Kayan Hidro" },
  { no: 25, kode: "71", nama: "Sulawesi Utara", ebt2022: 28.5, ebt2023: 29.8, ebt2024: 30.5, ebt2025: 31.2, targetRued: 23, tahunTarget: 2025, kapasitas: 450, potensi: 85, anggaran: 35000, investasi: 120, elektrifikasi: 99.9, pdrbKapita: 62.4, padApbd: 28.4, populasi: 2700000, statusRued: 1, pemanfaatan: 0.53, gapTarget: -8.2, catatan: "PLTP Lahendong dominan" },
  { no: 26, kode: "72", nama: "Sulawesi Tengah", ebt2022: 18.2, ebt2023: 19.5, ebt2024: 20.1, ebt2025: 21, targetRued: 23, tahunTarget: 2025, kapasitas: 650, potensi: 95, anggaran: 42000, investasi: 350, elektrifikasi: 99.5, pdrbKapita: 115.4, padApbd: 22.5, populasi: 3100000, statusRued: 1, pemanfaatan: 0.68, gapTarget: 2, catatan: "PLTA Poso Energy" },
  { no: 27, kode: "73", nama: "Sulawesi Selatan", ebt2022: 24.5, ebt2023: 25.8, ebt2024: 26.4, ebt2025: 27.2, targetRued: 23, tahunTarget: 2025, kapasitas: 950, potensi: 140, anggaran: 78000, investasi: 310, elektrifikasi: 99.9, pdrbKapita: 65.4, padApbd: 41.5, populasi: 9220000, statusRued: 1, pemanfaatan: 0.68, gapTarget: -4.2, catatan: "PLTB Sidrap & Jeneponto" },
  { no: 28, kode: "74", nama: "Sulawesi Tenggara", ebt2022: 6.2, ebt2023: 6.8, ebt2024: 7.5, ebt2025: 8.1, targetRued: 23, tahunTarget: 2025, kapasitas: 80, potensi: 65, anggaran: 28000, investasi: 120, elektrifikasi: 99.2, pdrbKapita: 61.2, padApbd: 21.2, populasi: 2700000, statusRued: 1, pemanfaatan: 0.12, gapTarget: 14.9, catatan: "Biomassa & PLTS" },
  { no: 29, kode: "75", nama: "Gorontalo", ebt2022: 15.2, ebt2023: 16.1, ebt2024: 16.8, ebt2025: 17.5, targetRued: 23, tahunTarget: 2025, kapasitas: 75, potensi: 25, anggaran: 15000, investasi: 15, elektrifikasi: 99.5, pdrbKapita: 42.5, padApbd: 14.5, populasi: 1200000, statusRued: 1, pemanfaatan: 0.3, gapTarget: 5.5, catatan: "PLTS Atap & Mikrohidro" },
  { no: 30, kode: "76", nama: "Sulawesi Barat", ebt2022: 12.4, ebt2023: 13.1, ebt2024: 13.8, ebt2025: 14.5, targetRued: 23, tahunTarget: 2025, kapasitas: 60, potensi: 45, anggaran: 14000, investasi: 12, elektrifikasi: 98.9, pdrbKapita: 38.2, padApbd: 12.1, populasi: 1500000, statusRued: 1, pemanfaatan: 0.13, gapTarget: 8.5, catatan: "PLT Hidro & Biomassa" },
  { no: 31, kode: "81", nama: "Maluku", ebt2022: 0.15, ebt2023: 0.17, ebt2024: 0.25, ebt2025: 0.35, targetRued: 23, tahunTarget: 2025, kapasitas: 15, potensi: 65, anggaran: 18000, investasi: 12, elektrifikasi: 98.5, pdrbKapita: 31.2, padApbd: 12.5, populasi: 1900000, statusRued: 1, pemanfaatan: 0.02, gapTarget: 22.65, catatan: "Dominasi BBM Pembangkit" },
  { no: 32, kode: "82", nama: "Maluku Utara", ebt2022: 1.5, ebt2023: 1.8, ebt2024: 2.1, ebt2025: 2.5, targetRued: 15, tahunTarget: 2025, kapasitas: 25, potensi: 45, anggaran: 19000, investasi: 450, elektrifikasi: 98.1, pdrbKapita: 98.4, padApbd: 15.2, populasi: 1300000, statusRued: 1, pemanfaatan: 0.06, gapTarget: 12.5, catatan: "Investasi LGA Smelter Tinggi" },
  { no: 33, kode: "91", nama: "Papua", ebt2022: 14.5, ebt2023: 15.2, ebt2024: 15.8, ebt2025: 16.5, targetRued: 23, tahunTarget: 2025, kapasitas: 110, potensi: 150, anggaran: 35000, investasi: 25, elektrifikasi: 96.5, pdrbKapita: 72.5, padApbd: 14.8, populasi: 1050000, statusRued: 1, pemanfaatan: 0.07, gapTarget: 6.5, catatan: "Perda RUED induk" },
  { no: 34, kode: "92", nama: "Papua Barat", ebt2022: 8.5, ebt2023: 9.2, ebt2024: 9.8, ebt2025: 10.5, targetRued: 23, tahunTarget: 2025, kapasitas: 45, potensi: 90, anggaran: 25000, investasi: 15, elektrifikasi: 98.5, pdrbKapita: 85.4, padApbd: 4.8, populasi: 560000, statusRued: 1, pemanfaatan: 0.05, gapTarget: 12.5, catatan: "Perda RUED induk" },
  { no: 35, kode: "93", nama: "Papua Selatan", ebt2022: 14.5, ebt2023: 15.2, ebt2024: 15.8, ebt2025: 16.5, targetRued: 23, tahunTarget: 2025, kapasitas: 110, potensi: 150, anggaran: 35000, investasi: 25, elektrifikasi: 96.5, pdrbKapita: 72.5, padApbd: 14.8, populasi: 520000, statusRued: 0.5, pemanfaatan: 0.07, gapTarget: 6.5, catatan: "Imputasi Papua induk; Raperda DOB" },
  { no: 36, kode: "94", nama: "Papua Tengah", ebt2022: 14.5, ebt2023: 15.2, ebt2024: 15.8, ebt2025: 16.5, targetRued: 23, tahunTarget: 2025, kapasitas: 110, potensi: 150, anggaran: 35000, investasi: 25, elektrifikasi: 96.5, pdrbKapita: 72.5, padApbd: 14.8, populasi: 1400000, statusRued: 0.5, pemanfaatan: 0.07, gapTarget: 6.5, catatan: "Imputasi Papua induk; Raperda DOB" },
  { no: 37, kode: "95", nama: "Papua Pegunungan", ebt2022: 14.5, ebt2023: 15.2, ebt2024: 15.8, ebt2025: 16.5, targetRued: 23, tahunTarget: 2025, kapasitas: 110, potensi: 150, anggaran: 35000, investasi: 25, elektrifikasi: 96.5, pdrbKapita: 72.5, padApbd: 14.8, populasi: 1450000, statusRued: 0.5, pemanfaatan: 0.07, gapTarget: 6.5, catatan: "Imputasi Papua induk; Raperda DOB" },
  { no: 38, kode: "96", nama: "Papua Barat Daya", ebt2022: 8.5, ebt2023: 9.2, ebt2024: 9.8, ebt2025: 10.5, targetRued: 23, tahunTarget: 2025, kapasitas: 45, potensi: 90, anggaran: 25000, investasi: 15, elektrifikasi: 98.5, pdrbKapita: 85.4, padApbd: 4.8, populasi: 610000, statusRued: 0.5, pemanfaatan: 0.05, gapTarget: 12.5, catatan: "Imputasi Pap. Barat induk; Raperda DOB" },
];

// Friendly aliases used to match GeoJSON province names
export const NAME_ALIASES: Record<string, string> = {
  "Kep. Bangka Belitung": "Kepulauan Bangka Belitung",
  "DI Yogyakarta": "Daerah Istimewa Yogyakarta",
  "Daerah Istimewa Yogyakarta": "DI Yogyakarta",
  "Kepulauan Bangka Belitung": "Kep. Bangka Belitung",
};

export function normalizeName(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").replace(/[.,]/g, "").trim();
}
