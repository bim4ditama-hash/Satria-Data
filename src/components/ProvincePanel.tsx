import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Sparkles, Award, Layers as LayersIcon } from "lucide-react";
import {
  DATASET,
  detectWeaknesses,
  hasNoCritical,
  iktBandFor,
  LISA_COLORS,
  LISA_LABELS,
  normalizeName,
  type ProvinceDatum,
} from "@/data/dataset";

interface Props {
  provinceKey: string;
  onClose: () => void;
}

const SUB_META = [
  { key: "capaian" as const, label: "Capaian & Trayektori" },
  { key: "sumberDaya" as const, label: "Sumber Daya & Pemanfaatan" },
  { key: "pembiayaan" as const, label: "Pembiayaan & Fiskal" },
  { key: "regulasi" as const, label: "Regulasi & Kelembagaan" },
  { key: "infrastruktur" as const, label: "Infrastruktur Jaringan" },
];

export function ProvincePanel({ provinceKey, onClose }: Props) {
  const d = DATASET.find((x) => normalizeName(x.nama) === provinceKey);
  if (!d) return null;
  const ikt = d.skor * 100;
  const band = iktBandFor(ikt);
  const weak = detectWeaknesses(d);
  const ok = hasNoCritical(d);
  const lisaColor = LISA_COLORS[d.lisa];

  return (
    <motion.aside
      className="fixed right-0 top-0 z-40 flex h-screen w-full max-w-[460px] flex-col border-l border-border bg-white shadow-[-20px_0_60px_-30px_rgba(15,23,42,0.25)]"
      initial={{ x: 480, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 480, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
    >
      <div className="border-b border-border px-6 pt-5 pb-4">
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Peta Nasional
        </button>
        <div className="flex items-start gap-3">
          <div
            className="mt-1 size-3 rounded-full ring-4"
            style={{ backgroundColor: band.color, boxShadow: `0 0 0 4px ${band.color}22` }}
          />
          <div className="flex-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Provinsi · Kode BPS {d.kode}
            </div>
            <h2 className="mt-1 text-2xl font-semibold leading-tight text-foreground">{d.nama}</h2>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <KPI label="Skor IKT" value={ikt.toFixed(1)} accent={band.color} />
          <KPI label="Peringkat" value={`#${d.rank}`} sub="dari 38" />
          <KPI label="Status" value={band.label} accent={band.color} mode="band" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <LayersIcon className="size-3" /> Tipologi K-Means
            </div>
            <div className="mt-1 text-[12px] font-semibold text-foreground">{d.tipologi}</div>
          </div>
          <div
            className="rounded-lg border px-3 py-2"
            style={{ borderColor: lisaColor + "66", backgroundColor: lisaColor + "1A" }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="size-3" /> Klaster LISA
            </div>
            <div className="mt-1 text-[12px] font-semibold text-foreground">
              {LISA_LABELS[d.lisa]}
            </div>
          </div>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <section>
          <SectionTitle>Bedah 5 Sub-Skor Kesiapan</SectionTitle>
          <div className="mt-3 space-y-2.5">
            {SUB_META.map((s) => {
              const v = (d[s.key] as number) * 100;
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{s.label}</span>
                    <span className="font-mono text-foreground">{v.toFixed(0)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor(v) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle icon={AlertTriangle} tone={ok ? "good" : "warn"}>
            Variabel yang Perlu Dibenahi
          </SectionTitle>
          {ok ? (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-[#146B3A33] bg-[#146B3A0F] px-3 py-2.5">
              <Award className="mt-0.5 size-4 shrink-0" style={{ color: "#146B3A" }} />
              <p className="text-[13px] leading-relaxed text-foreground/85">
                Tidak ada variabel kritis yang perlu dibenahi segera. Pertahankan komitmen
                transisi.
              </p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {weak.map((w) => (
                <li
                  key={w.key}
                  className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
                >
                  <span className="text-xs font-medium text-foreground">{w.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {(w.value * 100).toFixed(0)}/100
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle>Indikator Diagnostik</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <Stat
              label="Δ vs RUED-P"
              value={`${d.gap > 0 ? "+" : ""}${d.gap.toFixed(1)} poin`}
              accent={d.gap > 0 ? "#E5484D" : "#146B3A"}
            />
            <Stat label="Local I" value={d.localI.toFixed(3)} />
            <Stat label="Kuadran" value={d.kuadran || "—"} />
            <Stat label="p-value" value={d.pValue.toFixed(3)} />
          </div>
        </section>

        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {buildNarrative(d, band.label)}
        </p>
      </div>

      <div className="border-t border-border bg-surface px-6 py-3">
        <button
          onClick={onClose}
          className="w-full rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-foreground/90"
        >
          ← Kembali ke Peta Nasional
        </button>
      </div>
    </motion.aside>
  );
}

function buildNarrative(d: ProvinceDatum, status: string): string {
  const parts: string[] = [];
  parts.push(
    `${d.nama} menempati peringkat #${d.rank} dari 38 dengan skor ${(d.skor * 100).toFixed(1)} (${status}), klaster ${d.tipologi}.`
  );
  if (d.gap > 0)
    parts.push(`Tertinggal ${d.gap.toFixed(1)} poin dari trayektori RUED-P.`);
  else if (d.gap < 0)
    parts.push(`Melampaui jalur RUED-P sebesar ${Math.abs(d.gap).toFixed(1)} poin.`);
  if (d.lisa === "High-High")
    parts.push(`Berada dalam koridor High-High — wilayah pelopor yang dikelilingi tetangga sama-sama kuat.`);
  if (d.lisa === "Low-Low")
    parts.push(`Terperangkap dalam zona Low-Low — wilayah lambat di tengah daerah tertinggal lainnya.`);
  if (d.lisa === "Low-High")
    parts.push(`Outlier Low-High — daerah lambat yang dikelilingi tetangga lebih maju.`);
  return parts.join(" ");
}

function SectionTitle({
  icon: Icon,
  children,
  tone,
}: {
  icon?: React.ComponentType<{ className?: string; color?: string }>;
  children: React.ReactNode;
  tone?: "warn" | "good";
}) {
  const color = tone === "warn" ? "#E5484D" : tone === "good" ? "#146B3A" : undefined;
  return (
    <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {Icon && <Icon className="size-3.5" color={color} />}
      {children}
    </h3>
  );
}

function KPI({
  label,
  value,
  sub,
  accent,
  mode,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  mode?: "band";
}) {
  return (
    <div
      className="rounded-lg border border-border bg-surface px-3 py-2.5"
      style={mode === "band" && accent ? { borderColor: accent + "55", backgroundColor: accent + "0F" } : undefined}
    >
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-0.5 truncate font-display text-lg font-semibold leading-tight"
        style={accent && mode !== "band" ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-white px-2.5 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div
        className="mt-0.5 font-mono text-[12px] font-semibold"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function barColor(v: number) {
  if (v <= 25) return "#BB2528";
  if (v <= 50) return "#EA4630";
  if (v <= 75) return "#F8B229";
  return "#146B3A";
}
