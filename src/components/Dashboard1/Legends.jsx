import React, { useMemo } from "react";
import { buildColorMap } from "../../utils/mapColors"; // adjust path if needed

export default function Labels({
  rows = [],
  analysisDimension = "Entity",
  onClickItem,
  showCount = true,
  maxHeightPx = 180, // scroll height
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
    <div className="px-3 py-3">
      <div className="mb-2 text-sm font-semibold">
        Legend — {analysisDimension}
      </div>

      <div
        className="overflow-y-auto space-y-2 pr-2"
        style={{ maxHeight: `${maxHeightPx}px` }}
      >
        {uniques.map((val) => {
          const color = colorByValue[val] ?? fallbackColor;
          const dimText = val || "Unknown";

          return (
            <button
              key={val}
              type="button"
              onClick={() => onClickItem?.(val)}
              className="w-full flex items-center justify-between gap-3 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-4 h-4 rounded shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08) inset",
                  }}
                />
                <span
                  className="text-sm text-slate-700 dark:text-slate-200 truncate"
                  title={dimText}
                >
                  {dimText}
                </span>
              </div>

              {showCount ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
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