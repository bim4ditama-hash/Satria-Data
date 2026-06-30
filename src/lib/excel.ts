import * as XLSX from "xlsx";
import type { ProvinceRow } from "../data/provinces";
import { normalizeName } from "../data/provinces";

// Parse uploaded Excel using the FORMULA template layout.
// Returns merged rows keyed by province name.
export async function parseExcelFile(file: File, base: ProvinceRow[]): Promise<ProvinceRow[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheetName =
    wb.SheetNames.find((s) => s.toLowerCase().includes("data")) ?? wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const aoa: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

  // Find header row - look for "Provinsi" string in first 5 rows
  let headerRow = 0;
  for (let i = 0; i < Math.min(5, aoa.length); i++) {
    const row = aoa[i] ?? [];
    if (row.some((c) => typeof c === "string" && c.toLowerCase().includes("provinsi"))) {
      headerRow = i;
      break;
    }
  }

  const byName = new Map(base.map((r) => [normalizeName(r.nama), { ...r }]));

  for (let r = headerRow + 1; r < aoa.length; r++) {
    const row = aoa[r];
    if (!row || row.length < 3) continue;
    const nameCell = row[2];
    if (typeof nameCell !== "string" || !nameCell.trim()) continue;
    const key = normalizeName(nameCell);
    const existing = byName.get(key);
    if (!existing) continue;

    const num = (v: unknown, fallback: number) =>
      typeof v === "number" && isFinite(v) ? v : fallback;

    existing.ebt2022 = num(row[3], existing.ebt2022);
    existing.ebt2023 = num(row[4], existing.ebt2023);
    existing.ebt2024 = num(row[5], existing.ebt2024);
    existing.ebt2025 = num(row[6], existing.ebt2025);
    existing.targetRued = num(row[7], existing.targetRued);
    existing.tahunTarget = num(row[8], existing.tahunTarget);
    existing.kapasitas = num(row[9], existing.kapasitas);
    existing.potensi = num(row[10], existing.potensi);
    existing.anggaran = num(row[11], existing.anggaran);
    existing.investasi = num(row[12], existing.investasi);
    existing.elektrifikasi = num(row[13], existing.elektrifikasi);
    existing.pdrbKapita = num(row[14], existing.pdrbKapita);
    existing.padApbd = num(row[15], existing.padApbd);
    existing.populasi = num(row[16], existing.populasi);
    existing.statusRued = num(row[17], existing.statusRued);
    existing.pemanfaatan = num(row[18], existing.pemanfaatan);
    existing.gapTarget = num(row[19], existing.gapTarget);
    if (typeof row[20] === "string") existing.catatan = row[20] as string;
  }

  return Array.from(byName.values()).sort((a, b) => a.no - b.no);
}
