export function uniqueNonEmpty(values) {
  const set = new Set();
  for (const v of values) {
    const s = String(v ?? "").trim();
    if (s) set.add(s);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function buildFilterOptions(rows, filtersConfig) {
  // returns: { [filterId]: ["All", ...uniqueValues] }
  const optionsByFilter = {};

  for (const f of filtersConfig) {
    const col = f.column;
    const colValues = rows.map((r) => r[col]);
    optionsByFilter[f.id] = ["All", ...uniqueNonEmpty(colValues)];
  }

  return optionsByFilter;
}

export function applyFilters(rows, filtersConfig, selected) {
  // selected: { [filterId]: "All" | "some value" }
  return rows.filter((row) => {
    return filtersConfig.every((f) => {
      const chosen = selected[f.id];
      if (!chosen || chosen === "All") return true;
      const cell = String(row[f.column] ?? "").trim();
      return cell === chosen;
    });
  });
}