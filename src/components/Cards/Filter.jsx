import React from "react";

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900
                   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Filters({
  monthOptions,
  cityOptions,
  regionOptions,
  categoryOptions,
  filters,
  setFilters,
  onReset,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Month"
          value={filters.month}
          onChange={(v) => setFilters((p) => ({ ...p, month: v }))}
          options={monthOptions}
        />
        <Select
          label="City"
          value={filters.city}
          onChange={(v) => setFilters((p) => ({ ...p, city: v }))}
          options={cityOptions}
        />
        <Select
          label="Region"
          value={filters.region}
          onChange={(v) => setFilters((p) => ({ ...p, region: v }))}
          options={regionOptions}
        />
        <Select
          label="Category"
          value={filters.category}
          onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
          options={categoryOptions}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onReset}
          className="h-9 rounded-md border border-slate-300 px-3 text-sm
                     hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Reset
        </button>
      </div>
    </div>
  );
}