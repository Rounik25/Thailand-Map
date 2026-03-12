import { COLOR_DASHBOARD3 } from "./colorsDashboard3";

export function toNumber(v) {
  if (v == null) return 0;
  const s = String(v).replace(/,/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function norm(v) {
  return (v ?? "").toString().trim();
}

export function getYear(row) {
  const y = row?.Year ?? row?.year;
  const n = Number(String(y ?? "").trim());
  return Number.isFinite(n) ? n : null;
}

export function bucketFromAnalysisDimension(analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return "Lever 1";
  if (analysisDimension === "Technology") return "Lever 2";
  return "Lever 1";
}

export function getStackKey(row, analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return norm(row?.["Lever 1"]);
  if (analysisDimension === "Technology") return norm(row?.["Lever 2"]);
  return norm(row?.["Lever 1"] ?? row?.["Lever 2"]);
}

export function getColor(bucket, key) {
  return COLOR_DASHBOARD3?.[bucket]?.[key] ?? "#64748b";
}