import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Layers, MapPin, Sparkles } from "lucide-react";
import { PROVINCES_RAW, normalizeName, type ProvinceRow } from "@/data/provinces";
import { computeAllScores } from "@/lib/ikt";
import { MapIndonesia } from "@/components/MapIndonesia";
import { ProvincePanel } from "@/components/ProvincePanel";
import { SearchBar } from "@/components/SearchBar";
import { Legend } from "@/components/Legend";
import { ExcelUploader } from "@/components/ExcelUploader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peta Jurang Transisi Energi · 38 Provinsi Indonesia" },
      {
        name: "description",
        content:
          "Dashboard spasial interaktif Indeks Kesiapan Transisi (IKT) 38 provinsi: capaian, komitmen, pembiayaan, dan infrastruktur energi terbarukan.",
      },
      { property: "og:title", content: "Peta Jurang Transisi Energi · 38 Provinsi" },
      {
        property: "og:description",
        content:
          "Visualisasi data jurang kesiapan transisi energi 38 provinsi Indonesia.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [rows, setRows] = useState<ProvinceRow[]>(PROVINCES_RAW);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const scores = useMemo(() => computeAllScores(rows), [rows]);

  const stats = useMemo(() => {
    const avg = scores.reduce((a, s) => a + s.ikt, 0) / scores.length;
    const top = [...scores].sort((a, b) => b.ikt - a.ikt)[0];
    const bottom = [...scores].sort((a, b) => a.ikt - b.ikt)[0];
    const lagging = scores.filter((s) => s.row.gapTarget > 5).length;
    return { avg, top, bottom, lagging };
  }, [scores]);

  const selected = selectedKey
    ? scores.find((s) => normalizeName(s.row.nama) === selectedKey) ?? null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Control bar */}
      <motion.div
        className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-xl"
        animate={{ opacity: selectedKey ? 0 : 1, y: selectedKey ? -8 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: selectedKey ? "none" : "auto" }}
      >
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-6 py-3">
          <SearchBar
            scores={scores}
            onPick={(k) => setSelectedKey(k)}
          />
          <div className="w-72">
            <ExcelUploader base={rows} onParsed={setRows} />
          </div>
          <div className="ml-auto hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground lg:flex">
            <span className="inline-flex size-1.5 rounded-full bg-[#146B3A]" />
            Real-time engine aktif
          </div>
        </div>
      </motion.div>

      {/* Stat strip */}
      <motion.section
        className="mx-auto max-w-[1500px] px-6 pt-6"
        animate={{ opacity: selectedKey ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Rata-rata IKT Nasional"
            value={stats.avg.toFixed(1)}
            sub="dari skala 0–100"
          />
          <StatCard
            icon={Sparkles}
            label="Skor tertinggi"
            value={stats.top.row.nama}
            sub={`${stats.top.ikt.toFixed(1)} · ${stats.top.bandLabel}`}
            accent={stats.top.bandColor}
          />
          <StatCard
            icon={MapPin}
            label="Skor terendah"
            value={stats.bottom.row.nama}
            sub={`${stats.bottom.ikt.toFixed(1)} · ${stats.bottom.bandLabel}`}
            accent={stats.bottom.bandColor}
          />
          <StatCard
            icon={Layers}
            label="Provinsi tertinggal trayektori"
            value={`${stats.lagging}`}
            sub="deviasi > 5 poin vs RUED-P"
          />
        </div>
      </motion.section>

      {/* Map */}
      <section className="mx-auto max-w-[1500px] px-6 pt-5 pb-10">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Indeks Kesiapan Transisi Energi · 38 Provinsi
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Klik provinsi untuk isolasi · putar otomatis 3D · panel diagnostik meluncur dari kanan.
              </p>
            </div>
            <Legend />
          </div>
          <div className="relative h-[640px] w-full">
            <MapIndonesia
              scores={scores}
              selectedKey={selectedKey}
              hoverKey={hoverKey}
              onHover={setHoverKey}
              onSelect={setSelectedKey}
            />
          </div>
        </div>

        {/* Ranking list */}
        <AnimatePresence>
          {!selectedKey && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-8"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Peringkat Nasional 38 Provinsi
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Klik baris untuk membuka analisis diagnostik
                </span>
              </div>
              <RankList scores={scores} onPick={(k) => setSelectedKey(k)} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {selected && (
          <ProvincePanel score={selected} onClose={() => setSelectedKey(null)} />
        )}
      </AnimatePresence>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1500px] px-6 py-5 text-[11px] text-muted-foreground">
          Indeks komposit min-max · bobot 35/20/25/20 · 38 provinsi (Kode BPS sebagai kunci join).
          Sumber data: DEN Outlook, ESDM EBTKE, BPS, DJPK Kemenkeu, BKPM.
        </div>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative grid size-10 place-items-center overflow-hidden rounded-lg bg-foreground text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#146B3A] via-[#F8B229] to-[#BB2528] opacity-90" />
            <Layers className="relative size-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Data Journalism · Spasial
            </div>
            <h1 className="font-display text-xl font-semibold leading-tight text-foreground">
              Peta Jurang Transisi Energi
              <span className="text-muted-foreground"> · 38 Provinsi</span>
            </h1>
          </div>
        </div>
        <div className="hidden text-right text-[11px] text-muted-foreground md:block">
          Dashboard Interaktif Spasial · IKT v1.0
          <div>Kalkulasi real-time dari template RUED-P</div>
        </div>
      </div>
    </header>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div
        className="mt-1 truncate font-display text-xl font-semibold text-foreground"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function RankList({
  scores,
  onPick,
}: {
  scores: ReturnType<typeof computeAllScores>;
  onPick: (k: string) => void;
}) {
  const sorted = [...scores].sort((a, b) => b.ikt - a.ikt);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="grid grid-cols-12 border-b border-border bg-surface px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Provinsi</div>
        <div className="col-span-2">Skor IKT</div>
        <div className="col-span-2">Capaian</div>
        <div className="col-span-2">Pembiayaan</div>
        <div className="col-span-1">Δ RUED-P</div>
        <div className="col-span-1 text-right">Status</div>
      </div>
      <ul>
        {sorted.map((s) => (
          <li key={s.row.kode}>
            <button
              onClick={() => onPick(normalizeName(s.row.nama))}
              className="grid w-full grid-cols-12 items-center gap-2 px-4 py-2.5 text-left text-xs transition hover:bg-surface"
            >
              <div className="col-span-1 font-mono text-muted-foreground">#{s.rank}</div>
              <div className="col-span-3 flex items-center gap-2 font-medium text-foreground">
                <span className="inline-block size-2 rounded-full" style={{ backgroundColor: s.bandColor }} />
                {s.row.nama}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full" style={{ width: `${s.ikt}%`, backgroundColor: s.bandColor }} />
                </div>
                <span className="font-mono text-foreground">{s.ikt.toFixed(1)}</span>
              </div>
              <div className="col-span-2 font-mono text-muted-foreground">{s.dims.capaian.toFixed(0)}</div>
              <div className="col-span-2 font-mono text-muted-foreground">{s.dims.pembiayaan.toFixed(0)}</div>
              <div className="col-span-1 font-mono" style={{ color: s.row.gapTarget > 0 ? "#BB2528" : "#146B3A" }}>
                {s.row.gapTarget > 0 ? "+" : ""}
                {s.row.gapTarget.toFixed(1)}
              </div>
              <div className="col-span-1 text-right">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: s.bandColor + "1A", color: s.bandColor }}
                >
                  {s.bandLabel}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
