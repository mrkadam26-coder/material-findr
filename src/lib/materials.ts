import dbAsset from "@/assets/materials-db.json.asset.json";

export interface Material {
  code: string;
  description: string;
  longDescription?: string | undefined;
  group: string;
  uom: string;
  oldNumber?: string | undefined;
  created?: string | undefined;
}

interface RawDb {
  groups: string[];
  uoms: string[];
  codes: string[];
  desc: string[];
  long: string[];
  grp: number[];
  uom: number[];
  old: string[];
  created: string[];
}

export async function loadMaterials(): Promise<Material[]> {
  const res = await fetch(dbAsset.url);
  if (!res.ok) throw new Error(`Failed to load material index (${res.status})`);
  const db = (await res.json()) as RawDb;
  const out: Material[] = new Array(db.codes.length);
  for (let i = 0; i < db.codes.length; i++) {
    out[i] = {
      code: db.codes[i] ?? "",
      description: db.desc[i] ?? "",
      longDescription: db.long[i] || undefined,
      group: db.groups[db.grp[i] ?? 0] ?? "",
      uom: db.uoms[db.uom[i] ?? 0] ?? "",
      oldNumber: db.old[i] || undefined,
      created: db.created[i] || undefined,
    };
  }
  return out;
}

const LIMIT = 60;

/** Ranked realtime search: exact code > code prefix > all tokens in text. */
export function searchMaterials(materials: Material[], query: string): Material[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { m: Material; s: number }[] = [];

  for (const m of materials) {
    const code = m.code.toLowerCase();
    const text = `${code} ${m.description.toLowerCase()} ${(m.longDescription ?? "").toLowerCase()} ${m.group.toLowerCase()} ${(m.oldNumber ?? "").toLowerCase()}`;

    let ok = true;
    for (const t of tokens) {
      if (!text.includes(t)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    let s = 10;
    if (code === q) s = 1000;
    else if (code.startsWith(q)) s = 500;
    else if (code.includes(q)) s = 300;
    else if (m.description.toLowerCase().startsWith(q)) s = 200;
    else if (m.description.toLowerCase().includes(q)) s = 100;
    scored.push({ m, s });
    if (scored.length > 4000) break;
  }

  scored.sort((a, b) => b.s - a.s || a.m.code.localeCompare(b.m.code));
  return scored.slice(0, LIMIT).map((x) => x.m);
}

export function parseExcelRows(rows: Record<string, unknown>[]): Material[] {
  const pick = (row: Record<string, unknown>, ...keys: string[]) => {
    for (const k of Object.keys(row)) {
      const norm = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (keys.some((key) => norm.includes(key))) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
      }
    }
    return undefined;
  };
  return rows
    .map((row): Material | null => {
      const code = pick(row, "material", "code", "number");
      if (!code) return null;
      return {
        code,
        description: pick(row, "shortdesc", "materialdescription", "description", "desc") ?? "",
        longDescription: pick(row, "longdesc"),
        group: pick(row, "materialgroup", "group", "category") ?? "",
        uom: pick(row, "baseunit", "unitofmeasure", "uom", "unit") ?? "",
        oldNumber: pick(row, "oldmaterial", "oldnumber"),
        created: pick(row, "createdon", "created"),
      };
    })
    .filter((m): m is Material => m !== null);
}
