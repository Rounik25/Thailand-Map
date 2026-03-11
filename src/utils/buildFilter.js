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

export function buildOptionsByFilterFromSheets2(sheetsData, filtersConfig) {
  const out = {};

  for (const f of filtersConfig ?? []) {
    // support both static configs (source) and runtime configs (apply)
    const sheet = f?.apply?.sheet ?? f?.source?.sheet;
    const column = f?.apply?.column ?? f?.source?.column;

    const rows = sheetsData?.[sheet] ?? [];

    const values = new Set();
    for (const r of rows) {
      const v = (r?.[column] ?? "").toString().trim();
      if (v) values.add(v);
    }

    const sorted = Array.from(values).sort();

    // default is NO "All" (keeps Dashboard2 behavior exactly the same)
    // only add "All" when filter explicitly says includeAll: true
    const includeAll = f?.includeAll === true;

    out[f.id] = includeAll ? ["All", ...sorted] : sorted;
  }

  return out;
}

// export function buildOptionsByFilterFromSheets2(sheetData, filtersConfig) {
//   const result = {};

//   for (const f of filtersConfig ?? []) {
//     // support both source and apply
//     const sheet =
//       f?.apply?.sheet ??
//       f?.source?.sheet;

//     const column =
//       f?.apply?.column ??
//       f?.source?.column ??
//       f?.column ??
//       f?.id;

//     if (!sheet || !column) {
//       result[f.id] = ["All"];
//       continue;
//     }

//     const rows = sheetData?.[sheet] ?? [];

//     const values = new Set();

//     for (const r of rows) {
//       const v = r?.[column];
//       if (v != null && v !== "") {
//         values.add(String(v));
//       }
//     }

//     result[f.id] = [...Array.from(values).sort()];
//   }

//   return result;
// }