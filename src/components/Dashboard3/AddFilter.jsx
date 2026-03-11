import React, { useMemo, useState } from "react";
import { Select } from "./Select";

export default function AddFilter({
  sheetData = {},
  defaultSheet = null,
  existingFilterIds = [],
  onAdd,
}) {
  const sheetNames = useMemo(() => Object.keys(sheetData ?? {}), [sheetData]);
  const initialSheet = defaultSheet ?? sheetNames[0] ?? "";

  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(initialSheet);
  const [column, setColumn] = useState("");
  const [includeAll, setIncludeAll] = useState(true); 

  const columns = useMemo(() => {
    if (!sheet || !Array.isArray(sheetData?.[sheet]) || sheetData[sheet].length === 0) return [];
    const keys = Object.keys(sheetData[sheet][0] ?? {});
    return keys.filter((k) => k && !k.startsWith("__"));
  }, [sheet, sheetData]);

  const columnValues = useMemo(() => {
    if (!sheet || !column || !Array.isArray(sheetData?.[sheet])) return [];
    const set = new Set();
    for (const r of sheetData[sheet]) {
      const v = r?.[column];
      if (v == null) continue;
      const s = String(v).trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort();
  }, [sheet, column, sheetData]);

  const makeId = (col) => {
    const base = String(col || "custom")
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "");
    let id = `custom_${base}`;
    let i = 1;
    const taken = new Set(existingFilterIds || []);
    while (taken.has(id)) id = `custom_${base}_${i++}`;
    return id;
  };

  function handleAdd() {
    if (!sheet || !column) return;

    const id = makeId(column);

    // Your applyConfigFiltersDashboard3 supports f.apply.sheet + f.apply.column.
    const newFilter = {
      id,
      label: column,
      apply: { sheet, column },
    };

    // includeAll => "All"
    // else => first unique value (or "All" if none)
    const defaultSelected = includeAll ? "All" : (columnValues[0] ?? "All");

    // pass includeAll too (so parent can build options with/without "All")
    onAdd?.(newFilter, defaultSelected, { includeAll });

    // reset + close
    setOpen(false);
    setColumn("");
    setIncludeAll(true);
  }

  const columnOptions = columns.length ? columns : ["(no columns)"];

  return (
    <div className="w-full">
      <button
        type="button"
        className="w-full px-3 py-2 bg-slate-800 text-white rounded text-sm"
        onClick={() => {
          setOpen((s) => !s);
          if (!open) {
            setSheet(initialSheet);
            setColumn("");
            setIncludeAll(true);
          }
        }}
      >
        + Add filter
      </button>

      {open && (
        <div className="mt-2 w-full max-w-full p-3 rounded-xl shadow bg-white border border-slate-200">
          <div className="text-xs text-slate-600 mb-2">Add a new filter</div>

          <div className="flex flex-col gap-3">
            {/* If you want sheet selection back, uncomment this */}
            {/* 
            <Select
              label="Sheet"
              value={sheet}
              onChange={(v) => {
                setSheet(v);
                setColumn("");
              }}
              options={sheetNames.length ? sheetNames : ["(no sheets)"]}
            />
            */}

            <Select
              label="Column"
              value={column}
              onChange={(v) => setColumn(v)}
              options={columnOptions}
            />

            <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeAll}
                onChange={(e) => setIncludeAll(e.target.checked)}
              />
              Include “All” option
            </label>

            {/* Show what default will be */}
            <div className="text-xs text-slate-600">
              Default:{" "}
              <span className="font-semibold">
                {includeAll ? "All" : (columnValues[0] ?? "(no values)")}
              </span>
            </div>

            <div className="flex gap-1">
              <button
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                onClick={handleAdd}
                disabled={!sheet || !column}
              >
                Add
              </button>
              <button
                className="flex-1 px-3 py-2 border rounded text-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}