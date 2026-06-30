import { IKT_BANDS, LISA_COLORS } from "@/data/dataset";
import type { MapMode } from "@/components/MapIndonesia";

export function Legend({ mode }: { mode: MapMode }) {
  return (
    <div className="rounded-lg border border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {mode === "ikt" ? "Skor IKT (0–100) · 4 Tier" : "Klaster Spasial LISA (Local Moran's I)"}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {mode === "ikt"
          ? IKT_BANDS.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5">
                <span
                  className="inline-block size-3 rounded-sm"
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-[11px] font-medium text-foreground">{b.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {b.min}–{b.max}
                </span>
              </div>
            ))
          : (
              [
                { k: "High-High" as const, lbl: "High-High · Pelopor Berkelompok" },
                { k: "Low-Low" as const, lbl: "Low-Low · Zona Tertinggal" },
                { k: "Low-High" as const, lbl: "Low-High · Outlier Negatif" },
                { k: "Tidak signifikan" as const, lbl: "Tidak signifikan · Acak" },
              ].map((it) => (
                <div key={it.k} className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-3 rounded-sm"
                    style={{
                      backgroundColor: LISA_COLORS[it.k],
                      border: it.k === "Tidak signifikan" ? "1px solid #CBD5E1" : undefined,
                    }}
                  />
                  <span className="text-[11px] font-medium text-foreground">{it.lbl}</span>
                </div>
              ))
            )}
      </div>
    </div>
  );
}
