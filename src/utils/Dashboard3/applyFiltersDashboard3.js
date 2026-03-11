export function applyConfigFiltersDashboard3(rows, selectedFilters, filtersConfig, sheetName) {
  const norm = (v) => (v ?? "").toString().trim().toLowerCase();
  return (rows ?? []).filter((r) => {
    for (const f of filtersConfig) {
      const selected = selectedFilters?.[f.id] ?? "All";
      if (selected === "All") continue;
      const apply = f.apply;

      if (apply?.sheet && apply.sheet !== sheetName) continue;

      const col = apply?.column ?? f.source?.column ?? f.column ?? f.id;
      const rowVal = r?.[col];

      if (norm(rowVal) !== norm(selected)) return false;
    }
    return true;
  });
}   