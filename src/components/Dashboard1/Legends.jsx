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
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-2 w-full min-w-0 items-center px-4 sm:px-6 lg:px-10 py-5">
        {uniques.map((val) => {
          const color = colorByValue[val] ?? fallbackColor;
          const dimText = val || "Unknown";

          return (
            <button
              key={val}
              type="button"
              onClick={() => onClickItem?.(val)}
              className="w-full min-w-0 pr-2 sm:pr-5 flex items-center justify-between rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.08) inset",
                  }}
                />
                <span
                  className="text-xs text-slate-700 dark:text-slate-200 truncate min-w-0"
                  title={dimText}
                >
                  {dimText}
                </span>
              </div>

              {showCount ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 shrink-0 pl-2">
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