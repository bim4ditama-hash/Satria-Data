import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Layers, MapPin, Sparkles, Map as MapIcon, Network } from "lucide-react";
import {
  DATASET,
  IKT_BANDS,
  LISA_COLORS,
  LISA_LABELS,
  MORAN_GLOBAL,
  iktBandFor,
  normalizeName,
} from "@/data/dataset";
import { MapIndonesia, type MapMode } from "@/components/MapIndonesia";
import { ProvincePanel } from "@/components/ProvincePanel";
import { SearchBar } from "@/components/SearchBar";
import { Legend } from "@/components/Legend";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peta Jurang Transisi Energi · 38 Provinsi Indonesia" },
      {
        name: "description",
        content:
          "Dashboard spasial interaktif Indeks Kesiapan Transisi (IKT) 38 provinsi: dual-mode IKT & klaster LISA, Global Moran's I 0.616 (p<0.001).",
      },
      { property: "og:title", content: "Peta Jurang Transisi Energi · 38 Provinsi" },
    ],
  }),
  component: Page,
});

function Page() {
  const [mode, setMode] = useState<MapMode>("ikt");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const stats = useMemo(() => {
    const avg = DATASET.reduce((a, d) => a + d.skor * 100, 0) / DATASET.length;
    const top = DATASET[0];
    const bottom = DATASET[DATASET.length - 1];
    const lagging = DATASET.filter((d) => d.gap > 5).length;
    return { avg, top, bottom, lagging };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <motion.div
        className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-xl"
        animate={{ opacity: selectedKey ? 0 : 1, y: selectedKey ? -8 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: selectedKey ? "none" : "auto" }}
      >
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-6 py-3">
          <SearchBar onPick={(k) => setSelectedKey(k)} />
          <ModeToggle mode={mode} onChange={setMode} />
          <div className="ml-auto hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground lg:flex">
            <span className="inline-flex size-1.5 rounded-full bg-[#529718]" />
            38 provinsi · IKT + LISA
          </div>
        </div>
      </motion.div>

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
            value={stats.top.nama}
            sub={`${(stats.top.skor * 100).toFixed(1)} · ${iktBandFor(stats.top.skor * 100).label}`}
            accent={iktBandFor(stats.top.skor * 100).color}
          />
          <StatCard
            icon={MapPin}
            label="Skor terendah"
            value={stats.bottom.nama}
            sub={`${(stats.bottom.skor * 100).toFixed(1)} · ${iktBandFor(stats.bottom.skor * 100).label}`}
            accent={iktBandFor(stats.bottom.skor * 100).color}
          />
          <StatCard
            icon={Layers}
            label="Tertinggal trayektori"
            value={`${stats.lagging}`}
            sub="Δ RUED-P > 5 poin (positif)"
          />
        </div>
      </motion.section>

      <section className="mx-auto max-w-[1500px] px-6 pt-5 pb-10">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {mode === "ikt"
                  ? "Mode A · Indeks Kesiapan Transisi (4 Tier)"
                  : "Mode B · Klaster Spasial LISA (Local Moran's I)"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Klik provinsi untuk isolasi · panel diagnostik.
              </p>
            </div>
          </div>
          <div className="relative h-[640px] w-full bg-white">
            <MapIndonesia
              mode={mode}
              selectedKey={selectedKey}
              hoverKey={hoverKey}
              onHover={setHoverKey}
              onSelect={setSelectedKey}
            />

            <AnimatePresence>
              {!selectedKey && (
                <motion.div
                  key="legend"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-4 left-4 z-10 max-w-md"
                >
                  <Legend mode={mode} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!selectedKey && mode === "lisa" && (
                <motion.div
                  key="moran"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute right-4 top-4 z-10 w-[300px] rounded-xl border border-border bg-white/95 px-4 py-3 shadow-md backdrop-blur"
                >
                  <div className="flex items-center gap-2">
                    <Network className="size-3.5 text-[#2B6CB0]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Global Moran's I
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <Mini label="Index I" value={MORAN_GLOBAL.I.toFixed(3)} accent="#146B3A" />
                    <Mini label="Z-Score" value={MORAN_GLOBAL.zScore.toFixed(3)} />
                    <Mini label="P-Value" value="0.000000" accent="#146B3A" />
                    <Mini label="Kategori" value="Clustering" />
                  </div>
                  <div className="mt-2 space-y-0.5 text-[10px] leading-snug text-muted-foreground">
                    <div>Variabel: {MORAN_GLOBAL.variable}</div>
                    <div>Bobot: {MORAN_GLOBAL.weightMatrix}</div>
                    <div className="text-[#146B3A]">Sangat signifikan pada α = 5%.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
              <RankTable onPick={(k) => setSelectedKey(k)} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {selectedKey && (
          <ProvincePanel
            provinceKey={selectedKey}
            onClose={() => setSelectedKey(null)}
          />
        )}
      </AnimatePresence>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1500px] px-6 py-5 text-[11px] text-muted-foreground">
          Static embedded database · 38 provinsi · Sumber: template kesiapan transisi energi (FORMULA),
          K-Means tipologi & LISA cluster (KNN k=4, row-standardized, 999 permutasi).
        </div>
      </footer>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: MapMode; onChange: (m: MapMode) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange("ikt")}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
          mode === "ikt"
            ? "bg-foreground text-white"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <MapIcon className="size-3.5" />
        Mode A · IKT
      </button>
      <button
        onClick={() => onChange("lisa")}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
          mode === "lisa"
            ? "bg-foreground text-white"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Network className="size-3.5" />
        Mode B · LISA
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: '#002060' }} className="p-2 rounded-lg flex items-center justify-center">
            <img src="/itb.jpg" alt="Logo ITB" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Institut Teknologi Bandung · Data Journalism Spasial
            </div>
            <h1 className="font-display text-xl font-semibold leading-tight text-foreground">
              Peta Jurang Transisi Energi
              <span className="text-muted-foreground"> · 38 Provinsi Indonesia</span>
            </h1>
          </div>
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

function Mini({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-white px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div
        className="mt-0.5 font-mono text-[12px] font-semibold text-foreground"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function RankTable({ onPick }: { onPick: (k: string) => void }) {
  const sorted = [...DATASET].sort((a, b) => b.skor - a.skor);
  // ensure unique IKT_BANDS reference used (eliminate unused-import warning)
  void IKT_BANDS;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="grid grid-cols-[40px_1.5fr_0.9fr_0.9fr_0.9fr_0.7fr_1.6fr_1.2fr] gap-2 border-b border-border bg-surface px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <div>#</div>
        <div>Provinsi</div>
        <div>Skor IKT</div>
        <div>Capaian</div>
        <div>Pembiayaan</div>
        <div>Δ RUED-P</div>
        <div>K-Means Typology</div>
        <div>Tipe LISA</div>
      </div>
      <ul>
        {sorted.map((d) => {
          const ikt = d.skor * 100;
          const band = iktBandFor(ikt);
          const lisaColor = LISA_COLORS[d.lisa];
          const gapColor = d.gap > 0 ? "#E5484D" : "#146B3A";
          return (
            <li key={d.kode}>
              <button
                onClick={() => onPick(normalizeName(d.nama))}
                className="grid w-full grid-cols-[40px_1.5fr_0.9fr_0.9fr_0.9fr_0.7fr_1.6fr_1.2fr] items-center gap-2 px-4 py-2.5 text-left text-xs transition hover:bg-surface"
              >
                <div className="font-mono text-muted-foreground">#{d.rank}</div>
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: band.color }}
                  />
                  {d.nama}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ikt}%`, backgroundColor: band.color }}
                    />
                  </div>
                  <span className="font-mono text-foreground">{ikt.toFixed(1)}</span>
                </div>
                <div className="font-mono text-muted-foreground">
                  {(d.capaian * 100).toFixed(0)}
                </div>
                <div className="font-mono text-muted-foreground">
                  {(d.pembiayaan * 100).toFixed(0)}
                </div>
                <div
                  className="font-mono font-semibold"
                  style={{ color: gapColor }}
                >
                  {d.gap > 0 ? "+" : ""}
                  {d.gap.toFixed(1)}
                </div>
                <div className="truncate text-[11px] text-foreground/85">{d.tipologi}</div>
                <div>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: lisaColor + (d.lisa === "Tidak signifikan" ? "" : "1F"),
                      color:
                        d.lisa === "Tidak signifikan" ? "#475569" : lisaColor,
                      border:
                        d.lisa === "Tidak signifikan"
                          ? "1px solid #CBD5E1"
                          : `1px solid ${lisaColor}55`,
                    }}
                  >
                    {LISA_LABELS[d.lisa].split(" (")[0]}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
