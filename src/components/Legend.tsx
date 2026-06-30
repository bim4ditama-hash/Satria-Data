import { BANDS } from "@/lib/ikt";

export function Legend() {
  return (
    <div className="rounded-lg border border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Skor IKT (0–100)
      </div>
      <div className="mt-2 flex items-center gap-3">
        {BANDS.map((b, i) => {
          const min = i === 0 ? 0 : BANDS[i - 1].max;
          return (
            <div key={b.label} className="flex items-center gap-1.5">
              <span
                className="inline-block size-3 rounded-sm"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-[11px] font-medium text-foreground">{b.label}</span>
              <span className="text-[10px] text-muted-foreground">
                {min}–{b.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
