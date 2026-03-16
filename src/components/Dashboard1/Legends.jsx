import React, { useMemo } from "react";
import { buildColorMap } from "../../utils/mapColors"; // adjust path if needed

export default function Legends({
  rows = [],
  analysisDimension = "Entity",
  onClickItem,
  showCount = true,
  dark
}) {
  const colorInfo = useMemo(
    () => buildColorMap(rows, analysisDimension, dark),
    [rows, analysisDimension, dark]
  );

  const { column, colorByValue, uniques, fallbackColor = "#64748b" } = colorInfo;

  const counts = useMemo(() => {
    if (!column) return {};
    const c = {};
    for (const r of rows) {
      const key = String(r?.[column] ?? "").trim();
      if (!key) continue;
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [rows, column]);

  if (!column || !uniques?.length) {
    return (
      <div className="px-4 py-3">
        <div className="text-xs text-slate-400">
          No legend available for{" "}
          <span className="font-medium">{analysisDimension}</span>.
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div
        className="grid grid-cols-3 gap-x-5 gap-y-2 w-full items-center justify-center px-10 py-5"
      >
        {uniques.map((val) => {
          const color = colorByValue[val] ?? fallbackColor;
          const dimText = val || "Unknown";

          return (
            <button
              key={val}
              type="button"
              onClick={() => onClickItem?.(val)}
              className="pr-5 flex items-center justify-betweenrounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08) inset",
                  }}
                />
                <span
                  className="text-xs text-slate-700 dark:text-slate-200 truncate"
                  title={dimText}
                >
                  {dimText}
                </span>
              </div>

              {showCount ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {counts[val] ?? 0}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}