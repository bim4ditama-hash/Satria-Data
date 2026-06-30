import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3-geo";
import { DATASET, iktBandFor, LISA_COLORS } from "@/data/dataset";

export type MapMode = "ikt" | "lisa";

interface MapIndonesiaProps {
  mode: MapMode;
  selectedKey: string | null;
  hoverKey: string | null;
  onHover: (key: string | null) => void;
  onSelect: (key: string | null) => void;
}

export function MapIndonesia({
  mode,
  selectedKey,
  hoverKey,
  onHover,
  onSelect,
}: MapIndonesiaProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Mengambil data geografi Indonesia asli beresolusi tinggi (Fail-Safe CDN)
  useEffect(() => {
    // GANTI baris fetch lama yang mengarah ke file lokal dengan URL GitHub ini:
    fetch("https://raw.githubusercontent.com/superpikar/Indonesia-GeoJSON/master/indonesia-provinces.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Gagal memuat GeoJSON Peta:", err));
  }, []);

  if (!geoData) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground animate-pulse">
        Mengonstruksi Proyeksi Spasial GeoJSON Indonesia...
      </div>
    );
  }

  // Atur dimensi canvas peta secara dinamis
  const width = 900;
  const height = 450;

  // Proteksi Bug Proyeksi: Menggunakan fitSize otomatis agar pas di tengah layar putih
  const projection = d3.geoMercator().fitSize([width, height], geoData);
  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full transition-all duration-500"
      >
        <g>
          {geoData.features.map((feature: any) => {
            // Sinkronisasi Kunci Administrasi BPS Daerah
            const namaGeoJSON = feature.properties.PROVINSI || "";
            const kodeBPSGeo = String(feature.properties.KODE_PROV || feature.id || "");
            
            // COCOKKAN DATA DENGAN DATABASE STATIC (DATASET)
            const dataProvinsi = DATASET.find(
              (d) => 
                String(d.kode) === kodeBPSGeo || 
                d.nama.toLowerCase().trim() === namaGeoJSON.toLowerCase().trim()
            );

            const searchKey = dataProvinsi ? d3.geoMercator() ? dataProvinsi.nama.toLowerCase().trim() : "" : "";
            const isSelected = selectedKey === searchKey;
            const isHovered = hoverKey === searchKey;

            // WARNA DEFAULT JIKA PROVINSI TIDAK COCOK DATA
            let fillWarna = "#E2E8F0"; 

            if (dataProvinsi) {
              if (mode === "ikt") {
                // Mode A: Isian Mengikuti 4 Tier Warna Baru Kesiapan Energi
                fillWarna = iktBandFor(dataProvinsi.skor * 100).color;
              } else {
                // Mode B: Isian Mengikuti Klaster LISA Spasial Resmi
                fillWarna = LISA_COLORS[dataProvinsi.lisa] || "#E2E8F0";
              }
            }

            // Efek Isolasi: Jika ada provinsi dipilih, pudar provinsi lain ke putih transparan
            const opacityStyle = selectedKey ? (isSelected ? 1 : 0.08) : (hoverKey ? (isHovered ? 1 : 0.6) : 1);

            return (
              <path
                key={feature.id || namaGeoJSON}
                d={pathGenerator(feature) || ""}
                fill={fillWarna}
                stroke={isHovered || isSelected ? "#0F172A" : "#FFFFFF"}
                strokeWidth={isHovered || isSelected ? 2 : 0.7}
                style={{ opacity: opacityStyle }}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => dataProvinsi && onHover(searchKey)}
                onMouseLeave={() => onHover(null)}
                onClick={() => dataProvinsi && onSelect(searchKey)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}