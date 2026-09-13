import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  loadMaterials,
  parseExcelRows,
  searchMaterials,
  type Material,
} from "@/lib/materials";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Materialex — Material Code Search" },
      {
        name: "description",
        content:
          "Realtime search across 60,000+ material master codes. Look up material numbers, descriptions, material groups and units of measure instantly.",
      },
      { property: "og:title", content: "Materialex — Material Code Search" },
      {
        property: "og:description",
        content:
          "Realtime search across 60,000+ material master codes, descriptions and material groups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dataLabel, setDataLabel] = useState("Material master · zeng_mara_dump 16.03.26");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Material | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchMaterials(materials, query), [materials, query]);

  useEffect(() => {
    let cancelled = false;
    loadMaterials()
      .then((list) => {
        if (cancelled) return;
        setMaterials(list);
        setSelected(list[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load the material index. Please reload the page.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        wb.Sheets[wb.SheetNames[0] ?? ""] ?? {},
      );
      const parsed = parseExcelRows(rows);
      if (parsed.length === 0) {
        alert("No material codes found. Make sure your sheet has a Material or Code column.");
        return;
      }
      setMaterials(parsed);
      setSelected(parsed[0] ?? null);
      setDataLabel(`${file.name} · ${parsed.length.toLocaleString()} records`);
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
              {loading ? "Loading index" : "Index live"}
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
              {loading
                ? "Loading your material master…"
                : `Search ${materials.length.toLocaleString()} material records by code, description, material group or old number.`}
            </p>
            {loadError && (
              <p className="mt-3 font-mono text-[12px] text-amber">{loadError}</p>
            )}
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
                placeholder="Try: 7020000001, hose pipe, sieve…"
                aria-label="Search material codes"
                disabled={loading}
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
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={`font-mono text-[15px] font-semibold tracking-tight ${
                            i === active ? "text-accent" : "text-ink"
                          }`}
                        >
                          {m.code}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] tracking-wide text-sub uppercase">
                          {m.group}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-ink">{m.description}</p>
                      <p className="mt-1 font-mono text-[11px] text-sub">
                        {[m.uom && `UoM ${m.uom}`, m.oldNumber && `Old ${m.oldNumber}`, m.created]
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
            {selected ? (
              <>
                <div className="mt-4">
                  <p className="font-mono text-3xl font-semibold tracking-tight text-ink">
                    {selected.code}
                  </p>
                  <p className="mt-1 text-sm text-ink">{selected.description}</p>
                </div>
                {selected.longDescription && (
                  <p className="mt-3 rounded-lg bg-ink/[.03] p-3 text-[13px] leading-relaxed text-sub">
                    {selected.longDescription}
                  </p>
                )}
                <div className="mt-5 border-t border-line/70 pt-4">
                  <h3 className="font-mono text-[10px] tracking-[.18em] text-sub uppercase">
                    Master data
                  </h3>
                  <dl className="mt-3 space-y-0 divide-y divide-line/60">
                    {(
                      [
                        ["Material group", selected.group],
                        ["Base unit", selected.uom],
                        ["Old material no.", selected.oldNumber],
                        ["Created on", selected.created],
                      ] as const
                    )
                      .filter(([, v]) => v)
                      .map(([label, v]) => (
                        <div key={label} className="flex items-center justify-between gap-3 py-2">
                          <dt className="text-[13px] text-sub">{label}</dt>
                          <dd className="text-right font-mono text-[13px] font-medium text-ink">
                            {v}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </>
            ) : (
              <p className="mt-4 font-mono text-[12px] text-sub">
                {loading ? "Loading records…" : "Search and select a material."}
              </p>
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
                  : `${materials.length.toLocaleString()} records indexed`}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line/70 font-mono text-[10px] tracking-[.14em] text-sub uppercase">
                    <th className="px-5 py-2.5 font-medium">Code</th>
                    <th className="px-3 py-2.5 font-medium">Description</th>
                    <th className="px-3 py-2.5 font-medium">Group</th>
                    <th className="px-3 py-2.5 font-medium">UoM</th>
                    <th className="px-5 py-2.5 text-right font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(results.length > 0 ? results : materials.slice(0, 12)).map((m, i) => (
                    <tr
                      key={m.code + i}
                      onClick={() => setSelected(m)}
                      className={`cursor-pointer border-b border-line/50 transition-colors ${
                        selected?.code === m.code ? "bg-accent/[.06]" : "hover:bg-black/[.02]"
                      }`}
                    >
                      <td
                        className={`px-5 py-3 font-mono font-semibold ${
                          selected?.code === m.code ? "text-accent" : "text-ink"
                        }`}
                      >
                        {m.code}
                      </td>
                      <td className="px-3 py-3 text-ink">{m.description}</td>
                      <td className="px-3 py-3 font-mono text-[12px] text-sub">{m.group}</td>
                      <td className="px-3 py-3 font-mono text-[12px] text-sub">{m.uom}</td>
                      <td className="px-5 py-3 text-right font-mono text-[12px] text-sub">
                        {m.created ?? "—"}
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
          <span className="flex flex-col items-start gap-1 sm:items-end">
            <span>Upload an Excel sheet to search a different database</span>
            <span className="tracking-widest text-muted-foreground">Created by Mahesh Kadam</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
