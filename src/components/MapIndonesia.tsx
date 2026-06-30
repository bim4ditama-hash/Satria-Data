import { useEffect, useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeName } from "@/data/provinces";
import type { IktScore } from "@/lib/ikt";
import { bandFor } from "@/lib/ikt";

interface Props {
  scores: IktScore[];
  selectedKey: string | null;
  hoverKey: string | null;
  onHover: (k: string | null) => void;
  onSelect: (k: string | null) => void;
}

type GeoFeature = Feature<Geometry, { PROVINSI: string; KODE_PROV: string }>;

const WIDTH = 1200;
const HEIGHT = 560;

export function MapIndonesia({ scores, selectedKey, hoverKey, onHover, onSelect }: Props) {
  const [geo, setGeo] = useState<FeatureCollection<Geometry, { PROVINSI: string; KODE_PROV: string }> | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/data/indonesia-38.geojson")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        // Rewind polygons: this dataset uses CW outer rings, which d3-geo
        // (spherical) interprets as the polygon complement, drawing a giant
        // sphere rectangle. Reversing rings restores expected output.
        type Ring = [number, number][];
        const reverseRings = (poly: Ring[]) => poly.map((ring) => [...ring].reverse());
        for (const f of d.features) {
          const g = f.geometry;
          if (g.type === "Polygon") {
            g.coordinates = reverseRings(g.coordinates as Ring[]);
          } else if (g.type === "MultiPolygon") {
            g.coordinates = (g.coordinates as Ring[][]).map(reverseRings);
          }
        }
        setGeo(d);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { path, scoreByKey, isolatedPath, isolatedCentroid } = useMemo(() => {
    const projection = geoEquirectangular()
      .center([118, -2.3])
      .scale(1320)
      .translate([WIDTH / 2, HEIGHT / 2]);
    const path = geoPath(projection);
    const scoreByKey = new Map(scores.map((s) => [normalizeName(s.row.nama), s]));

    let isolatedPath: string | null = null;
    let isolatedCentroid: [number, number] | null = null;
    if (geo && selectedKey) {
      const f = geo.features.find((g) => normalizeName(g.properties.PROVINSI) === selectedKey);
      if (f) {
        isolatedPath = path(f) ?? null;
        isolatedCentroid = path.centroid(f);
      }
    }
    return { path, scoreByKey, isolatedPath, isolatedCentroid };
  }, [geo, scores, selectedKey]);

  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden">
      <div className="bg-grid absolute inset-0 pointer-events-none" />

      {/* Base map fades when a province is selected */}
      <motion.svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 h-full w-full"
        animate={{ opacity: selectedKey ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <defs>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
            <feOffset dx="0" dy="1" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {geo &&
          geo.features.map((f, i) => {
            const key = normalizeName(f.properties.PROVINSI);
            const s = scoreByKey.get(key);
            const fill = s ? bandFor(s.ikt).color : "#E2E8F0";
            const isHover = hoverKey === key;
            const d = path(f) ?? "";
            return (
              <path
                key={f.properties.PROVINSI + i}
                d={d}
                fill={fill}
                fillOpacity={isHover ? 1 : 0.92}
                stroke={isHover ? "#FFFFFF" : "#E2E8F0"}
                strokeWidth={isHover ? 1.4 : 0.8}
                onMouseEnter={() => onHover(key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(key)}
                style={{ cursor: "pointer", transition: "stroke 0.15s, fill-opacity 0.15s" }}
                filter={isHover ? "url(#softShadow)" : undefined}
              />
            );
          })}
      </motion.svg>

      {/* Hover tooltip */}
      <HoverTooltip scores={scores} hoverKey={hoverKey} selectedKey={selectedKey} containerRef={wrapRef} />

      {/* Isolated, spinning province */}
      <AnimatePresence>
        {selectedKey && isolatedPath && isolatedCentroid && (
          <IsolatedProvince
            path={isolatedPath}
            centroid={isolatedCentroid}
            color={scoreByKey.get(selectedKey)?.bandColor ?? "#0F172A"}
            name={scoreByKey.get(selectedKey)?.row.nama ?? ""}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HoverTooltip({
  scores,
  hoverKey,
  selectedKey,
  containerRef,
}: {
  scores: IktScore[];
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
  const s = scores.find((sc) => normalizeName(sc.row.nama) === hoverKey);
  if (!s) return null;
  return (
    <div
      className="pointer-events-none absolute z-30 rounded-md border border-border bg-white px-3 py-2 shadow-md"
      style={{ left: pos.x + 14, top: pos.y + 14 }}
    >
      <div className="text-xs font-semibold text-foreground">{s.row.nama}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block size-2 rounded-full" style={{ backgroundColor: s.bandColor }} />
        IKT {s.ikt.toFixed(1)} — {s.bandLabel} · #{s.rank}
      </div>
    </div>
  );
}

function IsolatedProvince({
  path,
  centroid,
  color,
  name,
}: {
  path: string;
  centroid: [number, number];
  color: string;
  name: string;
}) {
  // Translate centroid -> map center, then scale up.
  const targetX = WIDTH / 2;
  const targetY = HEIGHT / 2;
  const dx = targetX - centroid[0];
  const dy = targetY - centroid[1];

  return (
    <motion.div
      className="perspective-stage pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.div
        className="preserve-3d relative"
        initial={{ scale: 1, rotateY: 0 }}
        animate={{ scale: 2.6, rotateY: 360 }}
        transition={{
          scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
          rotateY: { duration: 18, ease: "linear", repeat: Infinity, delay: 1.1 },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={WIDTH * 0.36}
          height={HEIGHT * 0.36}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="isoGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="isoFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.78" />
            </linearGradient>
          </defs>
          {/* "thickness" layers for a faux 3d slab */}
          <g transform={`translate(${dx}, ${dy})`}>
            {[6, 4, 2].map((depth) => (
              <path
                key={depth}
                d={path}
                fill={color}
                opacity={0.15}
                transform={`translate(0, ${depth})`}
              />
            ))}
            <path d={path} fill="url(#isoFill)" stroke="#FFFFFF" strokeWidth={1.4} filter="url(#isoGlow)" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-x-0 -bottom-10 text-center">
          <div
            className="inline-block rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            {name}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
