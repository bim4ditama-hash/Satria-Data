import { useCallback, useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { parseExcelFile } from "@/lib/excel";
import type { ProvinceRow } from "@/data/provinces";

interface Props {
  base: ProvinceRow[];
  onParsed: (rows: ProvinceRow[]) => void;
}

export function ExcelUploader({ base, onParsed }: Props) {
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [filename, setFilename] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    async (file: File) => {
      try {
        const rows = await parseExcelFile(file, base);
        onParsed(rows);
        setFilename(file.name);
        setStatus("ok");
      } catch (e) {
        console.error(e);
        setStatus("err");
      }
    },
    [base, onParsed]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handle(f);
      }}
      onClick={() => ref.current?.click()}
      className={`group flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-dashed px-3 text-xs font-medium transition ${
        drag
          ? "border-foreground bg-surface-2"
          : "border-border bg-white hover:border-foreground/40 hover:bg-surface"
      }`}
    >
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
      {status === "ok" ? (
        <>
          <CheckCircle2 className="size-4 text-[#146B3A]" />
          <span className="truncate text-foreground">{filename}</span>
          <span className="ml-auto text-muted-foreground">Ganti file</span>
        </>
      ) : status === "err" ? (
        <>
          <AlertCircle className="size-4 text-[#BB2528]" />
          <span className="text-foreground">Gagal membaca. Coba file lain.</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="size-4 text-muted-foreground" />
          <span className="text-foreground">Upload template .xlsx</span>
          <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground group-hover:text-foreground">
            <Upload className="size-3.5" /> Drag & drop
          </span>
        </>
      )}
    </div>
  );
}
