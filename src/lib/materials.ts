export interface Material {
  code: string;
  description: string;
  standard: string;
  grade: string;
  family: string;
  uns?: string | undefined;
  tensile?: string | undefined;
  yield?: string | undefined;
  density?: string | undefined;
  elongation?: string | undefined;
  thermalConductivity?: string | undefined;
  meltingRange?: string | undefined;
  composition?: { element: string; range: string; pct: number }[] | undefined;
  equivalents?: string[] | undefined;
}

export const SAMPLE_MATERIALS: Material[] = [
  {
    code: "316L",
    description: "Austenitic stainless steel, low carbon",
    standard: "ASTM A240",
    grade: "316L",
    family: "Stainless · 300-series",
    uns: "S31603",
    tensile: "485 MPa",
    yield: "170 MPa",
    density: "8.00 g/cm³",
    elongation: "40 %",
    thermalConductivity: "16.3 W/m·K",
    meltingRange: "1375–1400 °C",
    composition: [
      { element: "Cr", range: "16.0–18.0", pct: 18 },
      { element: "Ni", range: "10.0–14.0", pct: 13 },
      { element: "Mo", range: "2.0–3.0", pct: 5 },
    ],
    equivalents: ["EN 1.4404", "ASME SA-240", "UNS S31603"],
  },
  {
    code: "316H",
    description: "Austenitic stainless, high temperature service",
    standard: "ASTM A240",
    grade: "316H",
    family: "Stainless · 300-series",
    uns: "S31609",
    tensile: "585 MPa",
    yield: "205 MPa",
    density: "8.00 g/cm³",
    elongation: "40 %",
    thermalConductivity: "16.3 W/m·K",
    meltingRange: "1375–1400 °C",
    composition: [
      { element: "Cr", range: "16.0–18.0", pct: 18 },
      { element: "Ni", range: "10.0–14.0", pct: 13 },
      { element: "Mo", range: "2.0–3.0", pct: 5 },
    ],
    equivalents: ["EN 1.4401", "UNS S31609"],
  },
  {
    code: "304",
    description: "Austenitic stainless — general purpose 18/8",
    standard: "ASTM A240",
    grade: "304",
    family: "Stainless · 300-series",
    uns: "S30400",
    tensile: "515 MPa",
    yield: "205 MPa",
    density: "7.90 g/cm³",
    elongation: "40 %",
    thermalConductivity: "16.2 W/m·K",
    meltingRange: "1400–1450 °C",
    composition: [
      { element: "Cr", range: "18.0–20.0", pct: 19 },
      { element: "Ni", range: "8.0–10.5", pct: 10 },
    ],
    equivalents: ["EN 1.4301", "X5CrNi18-10"],
  },
  {
    code: "SAE 3160",
    description: "Stainless bar, hot-work 316",
    standard: "SAE J403",
    grade: "3160",
    family: "Stainless · bar",
    uns: "S31600",
    tensile: "515 MPa",
    yield: "205 MPa",
    density: "8.00 g/cm³",
    meltingRange: "1375–1400 °C",
    equivalents: ["UNS S31600", "AISI 316"],
  },
  {
    code: "1.4404",
    description: "Stainless sheet, marine grade (EN X2CrNiMo17-12-2)",
    standard: "EN 10088-1",
    grade: "316L",
    family: "Stainless · EN",
    uns: "S31603",
    tensile: "485 MPa",
    yield: "170 MPa",
    density: "8.00 g/cm³",
    meltingRange: "1375–1400 °C",
    equivalents: ["AISI 316L", "ASTM A240"],
  },
  {
    code: "4130",
    description: "Chromium-molybdenum alloy steel",
    standard: "ASTM A29",
    grade: "4130",
    family: "Alloy steel · Cr-Mo",
    uns: "G41300",
    tensile: "560 MPa",
    yield: "460 MPa",
    density: "7.85 g/cm³",
    elongation: "20 %",
    composition: [
      { element: "Cr", range: "0.80–1.10", pct: 3 },
      { element: "Mo", range: "0.15–0.25", pct: 1 },
      { element: "C", range: "0.28–0.33", pct: 1 },
    ],
    equivalents: ["EN 1.7218", "25CrMo4"],
  },
  {
    code: "4340",
    description: "Nickel-chromium-molybdenum high strength steel",
    standard: "ASTM A29",
    grade: "4340",
    family: "Alloy steel · Ni-Cr-Mo",
    uns: "G43400",
    tensile: "745 MPa",
    yield: "470 MPa",
    density: "7.85 g/cm³",
    elongation: "22 %",
    equivalents: ["EN 1.6511", "36CrNiMo4"],
  },
  {
    code: "6061-T6",
    description: "Aluminum alloy, heat treated structural",
    standard: "ASTM B209",
    grade: "6061-T6",
    family: "Aluminum · 6xxx",
    uns: "A96061",
    tensile: "310 MPa",
    yield: "276 MPa",
    density: "2.70 g/cm³",
    elongation: "12 %",
    thermalConductivity: "167 W/m·K",
    equivalents: ["EN AW-6061", "AlMg1SiCu"],
  },
  {
    code: "7075-T651",
    description: "Aluminum alloy, aerospace high strength",
    standard: "ASTM B209",
    grade: "7075-T651",
    family: "Aluminum · 7xxx",
    uns: "A97075",
    tensile: "572 MPa",
    yield: "503 MPa",
    density: "2.81 g/cm³",
    elongation: "11 %",
    thermalConductivity: "130 W/m·K",
    equivalents: ["EN AW-7075", "AlZn5.5MgCu"],
  },
  {
    code: "Ti-6Al-4V",
    description: "Titanium grade 5, aerospace workhorse",
    standard: "ASTM B348",
    grade: "Grade 5",
    family: "Titanium",
    uns: "R56400",
    tensile: "895 MPa",
    yield: "828 MPa",
    density: "4.43 g/cm³",
    elongation: "10 %",
    thermalConductivity: "6.7 W/m·K",
    meltingRange: "1604–1660 °C",
    composition: [
      { element: "Al", range: "5.5–6.75", pct: 7 },
      { element: "V", range: "3.5–4.5", pct: 4 },
    ],
    equivalents: ["EN 3.7164", "AMS 4911"],
  },
  {
    code: "C11000",
    description: "Electrolytic tough pitch copper, 99.9% pure",
    standard: "ASTM B152",
    grade: "C11000",
    family: "Copper",
    uns: "C11000",
    tensile: "220 MPa",
    yield: "69 MPa",
    density: "8.89 g/cm³",
    thermalConductivity: "388 W/m·K",
    meltingRange: "1083 °C",
    equivalents: ["CW004A", "ETP Copper"],
  },
  {
    code: "A36",
    description: "Carbon structural steel, general construction",
    standard: "ASTM A36",
    grade: "A36",
    family: "Carbon steel",
    tensile: "400 MPa",
    yield: "250 MPa",
    density: "7.85 g/cm³",
    elongation: "20 %",
    equivalents: ["S235JR", "EN 1.0038"],
  },
  {
    code: "INCONEL 718",
    description: "Nickel-chromium superalloy, high temp oxidation resistant",
    standard: "AMS 5662",
    grade: "718",
    family: "Superalloy · Ni",
    uns: "N07718",
    tensile: "1240 MPa",
    yield: "1035 MPa",
    density: "8.19 g/cm³",
    meltingRange: "1260–1336 °C",
    composition: [
      { element: "Ni", range: "50.0–55.0", pct: 52 },
      { element: "Cr", range: "17.0–21.0", pct: 19 },
      { element: "Nb", range: "4.75–5.5", pct: 5 },
    ],
    equivalents: ["EN 2.4668", "UNS N07718"],
  },
  {
    code: "ULTEM 1000",
    description: "Polyetherimide (PEI) engineering polymer, amber transparent",
    standard: "ASTM D5205",
    grade: "PEI",
    family: "Polymer · PEI",
    tensile: "110 MPa",
    yield: "105 MPa",
    density: "1.27 g/cm³",
    equivalents: ["PEI 1000"],
  },
  {
    code: "PEEK 450G",
    description: "Polyetheretherketone, high performance thermoplastic",
    standard: "ASTM D6262",
    grade: "PEEK",
    family: "Polymer · PEEK",
    tensile: "100 MPa",
    density: "1.32 g/cm³",
    thermalConductivity: "0.25 W/m·K",
    equivalents: ["Victrex 450G"],
  },
  {
    code: "EN8",
    description: "Medium carbon steel, general engineering shafts",
    standard: "BS 970",
    grade: "080M40",
    family: "Carbon steel · EN",
    tensile: "550 MPa",
    yield: "280 MPa",
    density: "7.85 g/cm³",
    equivalents: ["AISI 1040", "C40"],
  },
  {
    code: "20MnCr5",
    description: "Case hardening steel, gears and shafts",
    standard: "EN 10084",
    grade: "1.7147",
    family: "Alloy steel · case-hardening",
    tensile: "900 MPa",
    density: "7.83 g/cm³",
    composition: [
      { element: "Mn", range: "1.10–1.40", pct: 4 },
      { element: "Cr", range: "1.00–1.30", pct: 3 },
    ],
    equivalents: ["AISI 5120", "EN 1.7147"],
  },
  {
    code: "1.2379",
    description: "Cold work tool steel, high wear resistance",
    standard: "EN ISO 4957",
    grade: "X153CrMoV12",
    family: "Tool steel",
    tensile: "740 MPa",
    density: "7.70 g/cm³",
    composition: [
      { element: "C", range: "1.45–1.60", pct: 5 },
      { element: "Cr", range: "11.0–13.0", pct: 12 },
    ],
    equivalents: ["AISI D2", "SKD11"],
  },
  {
    code: "MONEL 400",
    description: "Nickel-copper alloy, seawater corrosion resistant",
    standard: "ASTM B164",
    grade: "400",
    family: "Superalloy · Ni-Cu",
    uns: "N04400",
    tensile: "550 MPa",
    yield: "240 MPa",
    density: "8.80 g/cm³",
    meltingRange: "1300–1350 °C",
    equivalents: ["EN 2.4360", "UNS N04400"],
  },
  {
    code: "CF8M",
    description: "Cast austenitic stainless, equivalent of wrought 316",
    standard: "ASTM A351",
    grade: "CF8M",
    family: "Stainless · cast",
    tensile: "485 MPa",
    yield: "205 MPa",
    density: "8.00 g/cm³",
    equivalents: ["Cast 316", "EN 1.4408"],
  },
];

export function searchMaterials(materials: Material[], query: string, limit = 8): Material[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: { m: Material; s: number }[] = [];
  for (const m of materials) {
    const fields = [
      m.code,
      m.description,
      m.standard,
      m.grade,
      m.family,
      m.uns ?? "",
      ...(m.equivalents ?? []),
    ]
      .join(" ")
      .toLowerCase();
    if (!fields.includes(q)) continue;
    let s = 10;
    const code = m.code.toLowerCase();
    if (code === q) s = 0;
    else if (code.startsWith(q)) s = 1;
    else if (code.includes(q)) s = 2;
    else if (m.standard.toLowerCase().includes(q) || m.grade.toLowerCase().includes(q)) s = 3;
    scored.push({ m, s });
  }
  return scored
    .sort((a, b) => a.s - b.s || a.m.code.localeCompare(b.m.code))
    .slice(0, limit)
    .map((x) => x.m);
}
