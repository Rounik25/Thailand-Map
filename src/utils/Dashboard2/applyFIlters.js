// utils/Dashboard2/applyFilters.js
export function applyConfigFilters(rows, selectedFilters, filtersConfig, sheetName) {
  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

  // ids in your selectedFilters
  const LEVER_ID = "decarbLever";
  const EMISSION_TYPE_ID = "emissionType";

  // column names in the MAP sheet
  const LEVER_COL = "Decarbonization Lever";
  const EMISSION_TYPE_COL = "Emission Type";

  return (rows ?? []).filter((r) => {
    // ----------------------------
    // A) Apply config-driven filters
    // ----------------------------
    for (const f of filtersConfig) {
      const selected = selectedFilters?.[f.id] ?? "All";
      if (selected === "All") continue;

      const apply = f.apply;

      if (apply?.sheet && apply.sheet !== sheetName) continue;

      const col = apply?.column ?? f.source?.column ?? f.column ?? f.id;
      const rowVal = r?.[col];

      if (norm(rowVal) !== norm(selected)) return false;
    }

    // ----------------------------
    // B) Apply special filters (lever + emission type)
    // ----------------------------
    const leverSel = selectedFilters?.[LEVER_ID] ?? "All";
    if (leverSel !== "All") {
      const rowLever = r?.[LEVER_COL];
      if (norm(rowLever) !== norm(leverSel)) return false;
    }

    const etSel = selectedFilters?.[EMISSION_TYPE_ID] ?? "All";
    if (etSel !== "All") {
      const rowEt = r?.[EMISSION_TYPE_COL];
      if (norm(rowEt) !== norm(etSel)) return false;
    }

    return true;
  });
}   