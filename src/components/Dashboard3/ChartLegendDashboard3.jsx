import React, { useMemo } from "react";
import { COLOR_DASHBOARD3 } from "../../utils/Dashboard3/colorsDashboard3";

const norm = (v) => (v ?? "").toString().trim();

function bucketFromAnalysisDimension(analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return "Lever 1";
  if (analysisDimension === "Technology") return "Lever 2";
  return "Lever 1";
}

function keyFromRow(row, analysisDimension) {
  if (analysisDimension === "Decarbonization Lever") return norm(row?.["Lever 1"]);
  if (analysisDimension === "Technology") return norm(row?.["Lever 2"]);
  return norm(row?.["Lever 1"] ?? row?.["Lever 2"]);
}

export default function ChartLegendDashboard3({ rows = [], analysisDimension }) {
  const { bucket, items } = useMemo(() => {
    const bucket = bucketFromAnalysisDimension(analysisDimension);

    // keys present in current data
    const present = new Set();
    for (const r of rows ?? []) {
      const k = keyFromRow(r, analysisDimension);
      if (k) present.add(k);
    }

    // order by palette order, then unknown at end
    const paletteKeys = Object.keys(COLOR_DASHBOARD3?.[bucket] ?? {});
    const paletteIndex = new Map(paletteKeys.map((k, i) => [k, i]));

    const ordered = Array.from(present).sort((a, b) => {
      const ia = paletteIndex.has(a) ? paletteIndex.get(a) : Number.POSITIVE_INFINITY;
      const ib = paletteIndex.has(b) ? paletteIndex.get(b) : Number.POSITIVE_INFINITY;
      if (ia !== ib) return ia - ib;
      return a.localeCompare(b);
    }).reverse();

    const items = ordered.map((k) => ({
      key: k,
      color: COLOR_DASHBOARD3?.[bucket]?.[k] ?? "#64748b",
    }));

    return { bucket, items };
  }, [rows, analysisDimension]);

  return (
    <div className="mt-3 rounded-xl bg-white p-3">
      <div className="text-xs font-semibold text-slate-700 mb-2">
        {bucket==="Lever 1" ? "Decarbonization Lever" : "Technology"}
      </div>

      {items.length === 0 ? (
        <div className="text-xs text-slate-500">No legend items</div>
      ) : (
        <div className="overflow-auto pr-1">
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.key} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm border border-slate-300"
                  style={{ backgroundColor: it.color }}
                />
                <span className="text-xs text-slate-700">{it.key}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}