export function buildOptionsByFilterFromSheets(sheetsData, filtersConfig) {
  const out = {};

  for (const f of filtersConfig) {
    const { sheet, column } = f.source;
    const rows = sheetsData?.[sheet] ?? [];

    const values = new Set();
    for (const r of rows) {
      const v = (r?.[column] ?? "").toString().trim();
      if (v) values.add(v);
    }
    out[f.id] = ["All", ...Array.from(values).sort()];
  }
  return out;
}