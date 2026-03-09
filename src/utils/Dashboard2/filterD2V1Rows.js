
export function filterD2V1Rows(rows, selected, { leverKey, techKey, leverId, techId }) {
  if (!Array.isArray(rows)) return [];

  const leverSel = selected?.[leverId] ?? "All";
  const techSel = selected?.[techId] ?? "All";

  return rows.filter((r) => {
    const leverVal = (r?.[leverKey] ?? "").toString().trim();
    const techVal = (r?.[techKey] ?? "").toString().trim();

    if (leverSel !== "All" && leverVal !== leverSel) return false;
    if (techSel !== "All" && techVal !== techSel) return false;

    return true;
  });
}