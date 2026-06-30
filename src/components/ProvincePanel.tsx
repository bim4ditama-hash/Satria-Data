import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Sparkles, TrendingDown, TrendingUp, Building2, Coins, Zap, Target } from "lucide-react";
import type { IktScore } from "@/lib/ikt";
import { buildNarrative, detectWeaknesses } from "@/lib/ikt";

interface Props {
  score: IktScore;
  onClose: () => void;
}

const DIM_META = [
  { key: "capaian" as const, label: "Capaian & Trayektori", weight: 35, icon: TrendingUp },
  { key: "komitmen" as const, label: "Komitmen & Regulasi", weight: 20, icon: Target },
  { key: "pembiayaan" as const, label: "Pembiayaan & Investasi", weight: 25, icon: Coins },
  { key: "infrastruktur" as const, label: "Infrastruktur & Enabling", weight: 20, icon: Zap },
];

export function ProvincePanel({ score, onClose }: Props) {
  const weak = detectWeaknesses(score, 4);
  const narrative = buildNarrative(score, weak);
  const r = score.row;

  return (
    <motion.aside
      className="fixed right-0 top-0 z-40 flex h-screen w-full max-w-[460px] flex-col border-l border-border bg-white shadow-[-20px_0_60px_-30px_rgba(15,23,42,0.25)]"
      initial={{ x: 480, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 480, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
    >
      {/* Header */}
      <div className="border-b border-border px-6 pt-5 pb-4">
        <button
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke peta nasional
        </button>
        <div className="flex items-start gap-3">
          <div
            className="mt-1 size-3 rounded-full ring-4"
            style={{ backgroundColor: score.bandColor, boxShadow: `0 0 0 4px ${score.bandColor}22` }}
          />
          <div className="flex-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Provinsi · Kode BPS {r.kode}
            </div>
            <h2 className="mt-1 text-2xl font-semibold leading-tight text-foreground">{r.nama}</h2>
            <div className="mt-1 text-xs text-muted-foreground">
              {r.catatan}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <KPI label="Skor IKT" value={score.ikt.toFixed(1)} accent={score.bandColor} />
          <KPI label="Peringkat" value={`#${score.rank}`} sub="dari 38" />
          <KPI label="Status" value={score.bandLabel} accent={score.bandColor} mode="band" />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Breakdown radar/bars */}
        <section>
          <SectionTitle icon={Building2}>Bedah 4 Dimensi Kesiapan</SectionTitle>
          <div className="mt-3 space-y-2.5">
            {DIM_META.map((d) => {
              const v = score.dims[d.key];
              const Icon = d.icon;
              return (
                <div key={d.key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Icon className="size-3.5 text-muted-foreground" />
                      {d.label}
                      <span className="ml-1 rounded-sm bg-surface-2 px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
                        bobot {d.weight}%
                      </span>
                    </span>
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

        {/* Variables to fix */}
        <section>
          <SectionTitle icon={AlertTriangle} tone="warn">
            Variabel yang Perlu Dibenahi
          </SectionTitle>
          <ul className="mt-3 space-y-2">
            {weak.map((w) => (
              <li
                key={w.key}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
              >
                <span className="text-xs font-medium text-foreground">{w.label}</span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {(w.value * 100).toFixed(0)}/100
                  </span>
                  <TrendingDown className="size-3.5" style={{ color: "#BB2528" }} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Narrative */}
        <section>
          <SectionTitle icon={Sparkles}>Narasi Alur Logika</SectionTitle>
          <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-foreground/85">
            {narrative.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </section>

        {/* Raw indicators */}
        <section>
          <SectionTitle>Indikator Mentah</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <Stat label="Bauran 2025" value={`${r.ebt2025.toFixed(2)}%`} />
            <Stat label="Target RUED" value={`${r.targetRued}% @ ${r.tahunTarget}`} />
            <Stat label="Δ vs Trayektori" value={`${r.gapTarget > 0 ? "+" : ""}${r.gapTarget.toFixed(1)} pt`} />
            <Stat label="Status RUED" value={r.statusRued === 1 ? "Perda" : r.statusRued === 0.5 ? "Raperda" : "Belum"} />
            <Stat label="Kapasitas EBT" value={`${r.kapasitas.toLocaleString("id-ID")} MW`} />
            <Stat label="Potensi EBT" value={`${r.potensi.toFixed(1)} GW`} />
            <Stat label="Pemanfaatan" value={`${r.pemanfaatan.toFixed(2)}%`} />
            <Stat label="Elektrifikasi" value={`${r.elektrifikasi.toFixed(2)}%`} />
            <Stat label="Anggaran EBT" value={`Rp ${(r.anggaran / 1000).toFixed(1)} M`} />
            <Stat label="Investasi" value={`USD ${r.investasi.toFixed(1)} jt`} />
            <Stat label="PDRB/Kapita" value={`Rp ${r.pdrbKapita.toFixed(1)} jt`} />
            <Stat label="PAD/APBD" value={`${r.padApbd.toFixed(1)}%`} />
          </div>
        </section>
      </div>

      <div className="border-t border-border bg-surface px-6 py-3 text-[11px] text-muted-foreground">
        Sumber: DEN, ESDM, BPS, DJPK Kemenkeu, BKPM · Indeks komposit min-max, bobot 35/20/25/20.
      </div>
    </motion.aside>
  );
}

function SectionTitle({
  icon: Icon,
  children,
  tone,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {Icon && <Icon className={`size-3.5 ${tone === "warn" ? "text-[#EA4630]" : ""}`} />}
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
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-white px-2.5 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-[12px] font-medium text-foreground">{value}</div>
    </div>
  );
}

function barColor(v: number) {
  if (v <= 20) return "#BB2528";
  if (v <= 40) return "#EA4630";
  if (v <= 60) return "#F8B229";
  if (v <= 80) return "#146B3A";
  return "#165B33";
}
