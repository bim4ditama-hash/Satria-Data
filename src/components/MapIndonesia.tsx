import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { motion, AnimatePresence } from "framer-motion";
import {
  DATASET,
  iktBandFor,
  LISA_COLORS,
  normalizeName,
  type ProvinceDatum,
} from "@/data/dataset";

export type MapMode = "ikt" | "lisa";

interface Props {
  mode: MapMode;
  selectedKey: string | null;
  hoverKey: string | null;
  onHover: (k: string | null) => void;
  onSelect: (k: string | null) => void;
}

type GeoFeature = Feature<Geometry, { PROVINSI: string; KODE_PROV: string }>;

const WIDTH = 1200;
const HEIGHT = 560;

function colorFor(d: ProvinceDatum | undefined, mode: MapMode): string {
  if (!d) return "#E2E8F0";
  if (mode === "ikt") return iktBandFor(d.skor * 100).color;
  return LISA_COLORS[d.lisa] ?? "#E2E8F0";
}

export function MapIndonesia({ mode, selectedKey, hoverKey, onHover, onSelect }: Props) {
  const [geo, setGeo] = useState<FeatureCollection<Geometry, { PROVINSI: string; KODE_PROV: string }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/indonesia-38.geojson")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        // Rewind CW rings so d3-geo (spherical) doesn't draw the complement.
        type Ring = [number, number][];
        const rev = (poly: Ring[]) => poly.map((r) => [...r].reverse());
        for (const f of d.features) {
          const g = f.geometry;
          if (g.type === "Polygon") g.coordinates = rev(g.coordinates as Ring[]);
          else if (g.type === "MultiPolygon")
            g.coordinates = (g.coordinates as Ring[][]).map(rev);
        }
        setGeo(d);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const datumByKey = useMemo(
    () => new Map(DATASET.map((d) => [normalizeName(d.nama), d])),
    []
  );

  const { path, isolatedPath, isolatedCentroid } = useMemo(() => {
    const projection = geoMercator();
    if (geo) {
      projection.fitExtent(
        [
          [16, 28],
          [WIDTH - 16, HEIGHT - 28],
        ],
        geo
      );
    } else {
      projection.center([118, -2.3]).scale(950).translate([WIDTH / 2, HEIGHT / 2]);
    }
    const path = geoPath(projection);
    let isolatedPath: string | null = null;
    let isolatedCentroid: [number, number] | null = null;
    if (geo && selectedKey) {
      const f = geo.features.find(
        (g) => normalizeName(g.properties.PROVINSI) === selectedKey
      );
      if (f) {
        isolatedPath = path(f) ?? null;
        isolatedCentroid = path.centroid(f);
      }
    }
    return { path, isolatedPath, isolatedCentroid };
  }, [geo, selectedKey]);

  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden bg-white">
      <motion.svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 h-full w-full"
        animate={{ opacity: selectedKey ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <defs>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" />
            <feOffset dx="0" dy="1" result="off" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {geo &&
          geo.features.map((f, i) => {
            const key = normalizeName(f.properties.PROVINSI);
            const d = datumByKey.get(key);
            const fill = colorFor(d, mode);
            const isHover = hoverKey === key;
            const dStr = path(f) ?? "";
            return (
              <path
                key={f.properties.PROVINSI + i}
                d={dStr}
                fill={fill}
                fillOpacity={isHover ? 1 : 0.93}
                stroke={isHover ? "#0F172A" : "#FFFFFF"}
                strokeWidth={isHover ? 1.4 : 0.6}
                onMouseEnter={() => onHover(key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(key)}
                style={{ cursor: "pointer", transition: "stroke 0.15s, fill-opacity 0.15s" }}
                filter={isHover ? "url(#softShadow)" : undefined}
              />
            );
          })}
      </motion.svg>

      <HoverTooltip
        mode={mode}
        datumByKey={datumByKey}
        hoverKey={hoverKey}
        selectedKey={selectedKey}
        containerRef={wrapRef}
      />

      <AnimatePresence>
        {selectedKey && isolatedPath && isolatedCentroid && (
          <IsolatedProvince
            path={isolatedPath}
            centroid={isolatedCentroid}
            color={colorFor(datumByKey.get(selectedKey), mode)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HoverTooltip({
  mode,
  datumByKey,
  hoverKey,
  selectedKey,
  containerRef,
}: {
  mode: MapMode;
  datumByKey: Map<string, ProvinceDatum>;
  hoverKey: string | null;
  selectedKey: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  if (selectedKey || !hoverKey || !pos) return null;
  const d = datumByKey.get(hoverKey);
  if (!d) return null;
  const ikt = d.skor * 100;
  const band = iktBandFor(ikt);
  return (
    <div
      className="pointer-events-none absolute z-30 rounded-md border border-border bg-white px-3 py-2 shadow-md"
      style={{ left: pos.x + 14, top: pos.y + 14 }}
    >
      <div className="text-xs font-semibold text-foreground">{d.nama}</div>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span
          className="inline-block size-2 rounded-full"
          style={{ backgroundColor: mode === "ikt" ? band.color : LISA_COLORS[d.lisa] }}
        />
        {mode === "ikt"
          ? `IKT ${ikt.toFixed(1)} · ${band.label} · #${d.rank}`
          : `LISA: ${d.lisa} · IKT ${ikt.toFixed(1)}`}
      </div>
    </div>
  );
}

function IsolatedProvince({
  path,
  centroid,
  color,
}: {
  path: string;
  centroid: [number, number];
  color: string;
}) {
  const dx = WIDTH / 2 - centroid[0];
  const dy = HEIGHT / 2 - centroid[1];

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: 0.35 }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 2.4 }}
        exit={{ scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={WIDTH * 0.4}
          height={HEIGHT * 0.4}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="isoGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform={`translate(${dx}, ${dy})`}>
            <path d={path} fill={color} opacity={0.18} transform="translate(0, 6)" />
            <path d={path} fill={color} stroke="#FFFFFF" strokeWidth={1.6} filter="url(#isoGlow)" />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
