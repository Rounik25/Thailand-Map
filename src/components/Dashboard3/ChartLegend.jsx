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

export default function ChartLegendDashboard3({
  rows = [],
  analysisDimension,
  selectedKeyAll,
  selectedKeyPtt,
  onChange,
}) {
  const { items } = useMemo(() => {
    const bucket = bucketFromAnalysisDimension(analysisDimension);

    const present = new Set();
    for (const r of rows ?? []) {
      const k = keyFromRow(r, analysisDimension);
      if (k) present.add(k);
    }

    const paletteKeys = Object.keys(COLOR_DASHBOARD3?.[bucket] ?? {});
    const paletteIndex = new Map(paletteKeys.map((k, i) => [k, i]));

    const ordered = Array.from(present)
      .sort((a, b) => {
        const ia = paletteIndex.has(a) ? paletteIndex.get(a) : Number.POSITIVE_INFINITY;
        const ib = paletteIndex.has(b) ? paletteIndex.get(b) : Number.POSITIVE_INFINITY;
        if (ia !== ib) return ia - ib;
        return a.localeCompare(b);
      })
      .reverse();

    const items = ordered.map((k) => ({
      key: k,
      color: COLOR_DASHBOARD3?.[bucket]?.[k] ?? "#64748b",
    }));

    return { items };
  }, [rows, analysisDimension]);

  const anySelected = Boolean(selectedKeyAll || selectedKeyPtt);

  return (
    <div className="w-fullrounded-xl bg-white flex justify-center">
      <div>
        {items.length === 0 ? (
          <div className="text-xs text-slate-500">No legend items</div>
        ) : (
          <div className="grid grid-cols-5 w-full">
            {items.map((it) => {
              // considered selected if either chart selected it
              const isSelected = selectedKeyAll === it.key || selectedKeyPtt === it.key;
              const dim = anySelected && !isSelected;

              return (
                <div key={it.key}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 text-left mx-5"
                    style={{ opacity: dim ? 0.25 : 1 }}
                    onClick={() => {
                      // toggle: if both charts currently on this key, reset -> null
                      const bothSelectedThis =
                        selectedKeyAll === it.key && selectedKeyPtt === it.key;

                      onChange?.(bothSelectedThis ? null : it.key);
                    }}
                  >
                    <span
                      className="h-3 w-3 rounded-sm border border-slate-300"
                      style={{ backgroundColor: it.color }}
                    />
                    <span className="text-sm text-slate-700">{it.key}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}