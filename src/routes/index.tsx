import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  SAMPLE_MATERIALS,
  searchMaterials,
  type Material,
} from "@/lib/materials";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Materialex — Engineering Material Code Search" },
      {
        name: "description",
        content:
          "Realtime search engine for engineering material codes. Look up alloys, steels, polymers and composites across ASTM, EN, ISO and SAE standards.",
      },
      { property: "og:title", content: "Materialex — Engineering Material Code Search" },
      {
        property: "og:description",
        content:
          "Realtime search engine for engineering material codes across ASTM, EN, ISO and SAE standards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function parseExcelRows(rows: Record<string, unknown>[]): Material[] {
  const pick = (row: Record<string, unknown>, ...keys: string[]) => {
    for (const k of Object.keys(row)) {
      const norm = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (keys.some((key) => norm.includes(key))) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== "")
          return String(v).trim();
      }
    }
    return undefined;
  };
  return rows
    .map((row): Material | null => {
      const code = pick(row, "materialcode", "code", "designation", "material");
      if (!code) return null;
      return {
        code,
        description: pick(row, "description", "name", "desc") ?? "",
        standard: pick(row, "standard", "spec", "specification") ?? "",
        grade: pick(row, "grade") ?? "",
        family: pick(row, "family", "category", "type", "class") ?? "",
        uns: pick(row, "uns"),
        tensile: pick(row, "tensile"),
        yield: pick(row, "yield"),
        density: pick(row, "density"),
        elongation: pick(row, "elongation"),
        thermalConductivity: pick(row, "thermal"),
        meltingRange: pick(row, "melting"),
        equivalents: pick(row, "equivalent")?.split(/[,;]/).map((s) => s.trim()),
      } satisfies Material;
    })
    .filter((m): m is Material => m !== null);
}

function Index() {
  const [materials, setMaterials] = useState<Material[]>(SAMPLE_MATERIALS);
  const [dataLabel, setDataLabel] = useState("Sample index");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Material>(SAMPLE_MATERIALS[0]!);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchMaterials(materials, query), [materials, query]);

  useEffect(() => setActive(0), [results]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const choose = (m: Material) => {
    setSelected(m);
    setOpen(false);
  };

  const onFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        wb.Sheets[wb.SheetNames[0]],
      );
      const parsed = parseExcelRows(rows);
      if (parsed.length === 0) {
        alert("No material codes found. Make sure your sheet has a Code column.");
        return;
      }
      setMaterials(parsed);
      setSelected(parsed[0]);
      setDataLabel(`${file.name} · ${parsed.length} records`);
      setQuery("");
    } catch {
      alert("Could not read that file. Please upload a valid .xlsx sheet.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-display text-ink antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 size-[520px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute top-1/3 -right-24 size-[460px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[420px] rounded-full bg-amber/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-line/70 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-ink font-mono text-sm font-semibold text-primary-foreground">
              M
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">Materialex</p>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-sub">
                Code Index
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-white/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-sub sm:flex">
              <span className="animate-live size-1.5 rounded-full bg-emerald-500" />
              Index live
            </span>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-line bg-panel px-3 py-1.5 font-mono text-[11px] text-ink transition-colors hover:border-accent/50"
            >
              Upload Excel
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </header>

        <section className="pt-12 pb-6 sm:pt-16">
          <div className="animate-in max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">
              Material code search
            </p>
            <h1 className="mt-3 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
              Look up any material code in milliseconds.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-pretty text-sub">
              Search {materials.length.toLocaleString()} alloys, steels, polymers and
              composites. Type a code, prefix or family.
            </p>
          </div>

          <div className="relative mt-8 max-w-2xl" ref={boxRef}>
            <div className="animate-in flex items-center gap-2 rounded-xl border border-line2 bg-white/55 px-4 shadow-[0_2px_24px_rgba(20,24,29,.06)] backdrop-blur-xl focus-within:border-accent/50 focus-within:shadow-[0_4px_34px_rgba(30,64,175,.12)]">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    choose(results[active]);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                className="w-full bg-transparent py-3.5 font-mono text-[15px] text-ink placeholder:text-sub/60 focus:outline-none"
                type="text"
                placeholder="Try: 316, 4130, ULTEM…"
                aria-label="Search material codes"
              />
              <div className="flex items-center gap-1.5">
                <span className="hidden rounded-md border border-line bg-panel px-2 py-1 font-mono text-[10px] text-sub sm:block">
                  ↵
                </span>
                <span className="font-mono text-[11px] text-sub">Ctrl K</span>
              </div>
            </div>

            {open && query.trim() && (
              <div className="animate-drop absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-line bg-panel/90 shadow-[0_24px_60px_rgba(20,24,29,.18)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
                  <span className="font-mono text-[10px] tracking-[.18em] text-sub uppercase">
                    {results.length} matches · <span className="text-ink">{query}</span>
                  </span>
                  <span className="font-mono text-[10px] text-sub">↑ ↓ navigate</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto py-1">
                  {results.length === 0 && (
                    <p className="px-4 py-6 text-center font-mono text-[12px] text-sub">
                      No matches for “{query}”
                    </p>
                  )}
                  {results.map((m, i) => (
                    <button
                      key={m.code + i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(m)}
                      className={`block w-full cursor-pointer px-4 py-3 text-left transition-colors ${
                        i === active
                          ? "bg-accent/10 ring-1 ring-accent/20 ring-inset"
                          : "hover:bg-black/[.03]"
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`font-mono text-[15px] font-semibold tracking-tight ${
                            i === active ? "text-accent" : "text-ink"
                          }`}
                        >
                          {m.code}
                        </span>
                        <span className="font-mono text-[10px] tracking-wide text-sub uppercase">
                          {m.family || m.standard}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-ink">{m.description}</p>
                      <p className="mt-1 font-mono text-[11px] text-sub">
                        {[m.standard, m.grade && `Grade ${m.grade}`, m.uns && `UNS ${m.uns}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </button>
                  ))}
                </div>
                {results.length > 0 && (
                  <div className="border-t border-line/70 bg-panel/60 px-4 py-2 font-mono text-[10px] text-sub">
                    Showing top {results.length} · press{" "}
                    <span className="text-ink">↵</span> to select
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <aside className="animate-in max-h-none rounded-xl border border-line bg-white/45 p-5 backdrop-blur-xl lg:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[11px] tracking-[.18em] text-sub uppercase">
                Material detail
              </h2>
              <span className="rounded-full bg-amber/10 px-2 py-0.5 font-mono text-[10px] font-medium text-amber">
                Selected
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-3xl font-semibold tracking-tight text-ink">
                  {selected.code}
                </p>
                <p className="mt-1 text-sm text-ink">{selected.description}</p>
              </div>
              {selected.uns && (
                <span className="shrink-0 rounded-md border border-line bg-panel px-2 py-1 font-mono text-[10px] text-sub">
                  UNS {selected.uns}
                </span>
              )}
            </div>
            {(selected.equivalents?.length || selected.standard) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selected.standard && (
                  <span className="rounded-md bg-ink/[.04] px-2 py-1 font-mono text-[10px] text-sub">
                    {selected.standard}
                  </span>
                )}
                {selected.equivalents?.map((eq) => (
                  <span
                    key={eq}
                    className="rounded-md bg-ink/[.04] px-2 py-1 font-mono text-[10px] text-sub"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 border-t border-line/70 pt-4">
              <h3 className="font-mono text-[10px] tracking-[.18em] text-sub uppercase">
                Properties
              </h3>
              <dl className="mt-3 space-y-0 divide-y divide-line/60">
                {(
                  [
                    ["Density", selected.density],
                    ["Tensile strength", selected.tensile],
                    ["Yield strength", selected.yield],
                    ["Elongation", selected.elongation],
                    ["Thermal cond.", selected.thermalConductivity],
                    ["Melting range", selected.meltingRange],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([label, v]) => (
                    <div key={label} className="flex items-center justify-between py-2">
                      <dt className="text-[13px] text-sub">{label}</dt>
                      <dd className="font-mono text-[13px] font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                {!selected.density &&
                  !selected.tensile &&
                  !selected.yield &&
                  !selected.elongation &&
                  !selected.thermalConductivity &&
                  !selected.meltingRange && (
                    <p className="py-2 text-[13px] text-sub">No property data.</p>
                  )}
              </dl>
            </div>
            {selected.composition && selected.composition.length > 0 && (
              <div className="mt-5 border-t border-line/70 pt-4">
                <h3 className="font-mono text-[10px] tracking-[.18em] text-sub uppercase">
                  Composition
                </h3>
                <div className="mt-3 space-y-2">
                  {selected.composition.map((c) => (
                    <div key={c.element} className="flex items-center gap-2">
                      <span className="w-8 font-mono text-[11px] text-sub">{c.element}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/60">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(c.pct * 4, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-mono text-[11px] text-ink">
                        {c.range}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="animate-in rounded-xl border border-line bg-white/55 backdrop-blur-xl lg:col-span-8">
            <div className="flex items-center justify-between border-b border-line/70 px-5 py-3.5">
              <h2 className="font-mono text-[11px] tracking-[.18em] text-sub uppercase">
                Results table
              </h2>
              <span className="font-mono text-[11px] text-sub">
                {results.length > 0
                  ? `${results.length} rows · sorted by match`
                  : `${materials.length} records indexed`}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line/70 font-mono text-[10px] tracking-[.14em] text-sub uppercase">
                    <th className="px-5 py-2.5 font-medium">Code</th>
                    <th className="px-3 py-2.5 font-medium">Description</th>
                    <th className="px-3 py-2.5 font-medium">Standard</th>
                    <th className="px-3 py-2.5 font-medium">Grade</th>
                    <th className="px-5 py-2.5 text-right font-medium">Tensile</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(results.length > 0 ? results : materials.slice(0, 10)).map((m, i) => (
                    <tr
                      key={m.code + i}
                      onClick={() => setSelected(m)}
                      className={`cursor-pointer border-b border-line/50 transition-colors ${
                        selected.code === m.code
                          ? "bg-accent/[.06]"
                          : "hover:bg-black/[.02]"
                      }`}
                    >
                      <td
                        className={`px-5 py-3 font-mono font-semibold ${
                          selected.code === m.code ? "text-accent" : "text-ink"
                        }`}
                      >
                        {m.code}
                      </td>
                      <td className="px-3 py-3 text-ink">{m.description}</td>
                      <td className="px-3 py-3 font-mono text-[12px] text-sub">
                        {m.standard}
                      </td>
                      <td className="px-3 py-3 font-mono text-[12px] text-sub">{m.grade}</td>
                      <td className="px-5 py-3 text-right font-mono text-[12px] text-ink">
                        {m.tensile ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-line/70 px-5 py-3 font-mono text-[11px] text-sub">
              <span>{dataLabel}</span>
              <span>Click a row to inspect</span>
            </div>
          </section>
        </div>

        <footer className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line/70 py-6 font-mono text-[11px] text-sub sm:flex-row sm:items-center">
          <span>Materialex · {materials.length.toLocaleString()} materials indexed</span>
          <span>Upload an Excel sheet to search your own database</span>
        </footer>
      </div>
    </div>
  );
}
