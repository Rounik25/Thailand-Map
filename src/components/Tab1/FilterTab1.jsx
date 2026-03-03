import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { FILTERS_CONFIG } from "../../utils/filterConfig";
import { buildFilterOptions } from "../../utils/filterUtils";

function Select({ label, value, onChange, options }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`h-8 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900
                   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50`}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </label>
    )
}

export function FilterTab1() {
    const [rows, setRows] = useState([]); // Excel rows as JSON
    const [selected, setSelected] = useState(() => {
        // Initialize all filters to "All"
        const init = {};
        for (const f of FILTERS_CONFIG) init[f.id] = "All";
        return init;
    });

    const [fileName, setFileName] = useState("")

    async function onFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name)

        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        // Convert to JSON rows; defval keeps missing cells as empty string
        const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setRows(json);

        // Reset filters whenever a new file loads
        const reset = {};
        for (const f of FILTERS_CONFIG) reset[f.id] = "All";
        setSelected(reset);
    }

    const optionsByFilter = useMemo(() => {
        if (!rows.length) return {};
        return buildFilterOptions(rows, FILTERS_CONFIG);
    }, [rows]);

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-center text-red-600 font-bold text-xl mb-2">Filter Panel</div>
                <div className="flex items-center">
                    <label
                        htmlFor="fileUpload"
                        className="cursor-pointer inline-block px-2 py-1 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700"
                    >
                        Choose File
                    </label>

                    <div className="ml-3 text-sm text-gray-600 w-40 overflow-hidden">
                        {fileName || "No file selected"}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={onFileChange}
                        className="text-xs hidden"
                        id="fileUpload"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col mt-4 " >
                    {FILTERS_CONFIG.map((f) => (
                        <Select
                            key={f.id}
                            label={f.label}
                            value={selected[f.id] ?? "All"}
                            onChange={(v) => setSelected((p) => ({ ...p, [f.id]: v }))}
                            options={optionsByFilter[f.id] ?? ["All"]}
                        />
                    ))}
                </div>

                {/* <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const reset = {};
              for (const f of FILTERS_CONFIG) reset[f.id] = "All";
              setSelected(reset);
            }}
            className="h-9 rounded-md border border-slate-300 px-3 text-sm
                       hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Reset
          </button>
        </div> */}
                <div className="text-center text-red-600 font-bold text-xl mt-5">Legend</div>
            </div>


        </div>
    );
}