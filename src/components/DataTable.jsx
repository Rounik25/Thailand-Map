import React, { useMemo, useState } from "react";

function formatTHB(v) {
  return `฿${(v ?? 0).toLocaleString("en-IN")}`;
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="opacity-40">↕</span>;
  return <span>{dir === "asc" ? "↑" : "↓"}</span>;
}

export default function DataTable({ rows }) {
  const [sort, setSort] = useState({ key: "date", dir: "asc" });

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const { key, dir } = sort;
      const av = a[key];
      const bv = b[key];

      // date special
      if (key === "date") {
        const cmp = new Date(av) - new Date(bv);
        return dir === "asc" ? cmp : -cmp;
      }

      // number vs string
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      return dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sort]);

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  const headerCell =
    "px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none whitespace-nowrap";

  const cell =
    "px-3 py-2 text-sm text-slate-900 dark:text-slate-50 whitespace-nowrap";

  return (
    <div className="h-[30vh] mt-10 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
      <div className="h-[6vh] flex items-center justify-between p-4">
        <div>
          <div className="text-sm font-semibold">Filtered Data</div>
          <div className="text-xs text-slate-500 dark:text-slate-300">
            Rows: {sorted.length}
          </div>
        </div>
      </div>

      <div className="h-[22vh] overflow-auto hide-scrollbar">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-950">
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th
                className={headerCell}
                onClick={() => toggleSort("date")}
              >
                Date <SortIcon active={sort.key === "date"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("city")}
              >
                City <SortIcon active={sort.key === "city"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("region")}
              >
                Region{" "}
                <SortIcon active={sort.key === "region"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("category")}
              >
                Category{" "}
                <SortIcon active={sort.key === "category"} dir={sort.dir} />
              </th>

              <th
                className={headerCell}
                onClick={() => toggleSort("stores")}
              >
                Stores{" "}
                <SortIcon active={sort.key === "stores"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("orders")}
              >
                Orders{" "}
                <SortIcon active={sort.key === "orders"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("salesTHB")}
              >
                Sales (THB){" "}
                <SortIcon active={sort.key === "salesTHB"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("footfall")}
              >
                Footfall{" "}
                <SortIcon active={sort.key === "footfall"} dir={sort.dir} />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("conversionRate")}
              >
                Conv.{" "}
                <SortIcon
                  active={sort.key === "conversionRate"}
                  dir={sort.dir}
                />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("avgBasketTHB")}
              >
                Avg Basket{" "}
                <SortIcon
                  active={sort.key === "avgBasketTHB"}
                  dir={sort.dir}
                />
              </th>
              <th
                className={headerCell}
                onClick={() => toggleSort("returns")}
              >
                Returns{" "}
                <SortIcon active={sort.key === "returns"} dir={sort.dir} />
              </th>
            </tr>
          </thead>

          <tbody className="">
            {sorted.map((r, idx) => (
              <tr
                key={`${r.date}-${r.locationId}-${idx}`}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
              >
                <td className={cell}>{r.date}</td>
                <td className={cell}>{r.city}</td>
                <td className={cell}>{r.region}</td>
                <td className={cell}>{r.category}</td>

                <td className={cell}>{r.stores}</td>
                <td className={cell}>{r.orders.toLocaleString("en-IN")}</td>
                <td className={cell}>{formatTHB(r.salesTHB)}</td>
                <td className={cell}>{r.footfall.toLocaleString("en-IN")}</td>
                <td className={cell}>
                  {(r.conversionRate * 100).toFixed(1)}%
                </td>
                <td className={cell}>{formatTHB(r.avgBasketTHB)}</td>
                <td className={cell}>{r.returns}</td>
              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-300"
                >
                  No rows for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}