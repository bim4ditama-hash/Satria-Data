import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { DATASET, iktBandFor, normalizeName, type ProvinceDatum } from "@/data/dataset";

interface Props {
  onPick: (key: string) => void;
}

export function SearchBar({ onPick }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo<ProvinceDatum[]>(() => {
    if (!q.trim()) return DATASET.slice(0, 8);
    const nq = normalizeName(q);
    return DATASET.filter((d) => normalizeName(d.nama).includes(nq)).slice(0, 8);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown")
              setActive((a) => Math.min(a + 1, results.length - 1));
            else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
            else if (e.key === "Enter" && results[active]) {
              onPick(normalizeName(results[active].nama));
              setOpen(false);
              setQ(results[active].nama);
            } else if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Cari provinsi… (Aceh, DKI Jakarta, Papua)"
          className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-9 text-sm font-medium text-foreground shadow-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setOpen(true);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-surface-2"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-white shadow-lg scrollbar-thin">
          {results.map((d, i) => {
            const band = iktBandFor(d.skor * 100);
            return (
              <button
                key={d.kode}
                onClick={() => {
                  onPick(normalizeName(d.nama));
                  setOpen(false);
                  setQ(d.nama);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                  i === active ? "bg-surface-2" : "bg-white hover:bg-surface"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="inline-block size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: band.color }}
                  />
                  <span className="font-medium text-foreground">{d.nama}</span>
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  IKT {(d.skor * 100).toFixed(1)} · #{d.rank}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
