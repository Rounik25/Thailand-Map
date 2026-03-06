import React, { useMemo, useState, useEffect, useRef } from "react";
import { FILTERS_CONFIG } from "../../utils/filterConfig";
import { buildFilterOptions } from "../../utils/filterUtils";

const EMISSION_TYPE_OPTIONS = ["All", "Process", "Fuel", "Indirect_Electricity"];
const ANALYSIS_DIMENSIONS_OPTIONS = ["Entity", "Sector", 'Decarbonization Plan'];

function Select({ label, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div ref={containerRef} className="relative w-full min-w-0 flex flex-col gap-1">
            <span className="text-sm font-medium text-black dark:text-slate-300">
                {label}
            </span>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full h-8 min-w-0 border-2 border-slate-200 bg-white px-3 text-sm text-left text-black rounded-lg
             dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            >
                <span className="block truncate w-full">
                    {value || "Select option"}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 top-full mt-1 w-full min-w-0 border border-slate-200 bg-white rounded-lg shadow-lg z-50
               dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto">

                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 
                            dark:hover:bg-slate-800 whitespace-normal break-words"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function FilterTab2({ rows = [], value, onChange, analysisDimension, onAnalysisDimensionChange }) {
    const [localSelected, setLocalSelected] = useState(() => {
        const init = {};
        for (const f of FILTERS_CONFIG) init[f.id] = "All";
        return init;
    });

    const selected = value ?? localSelected;

    const optionsByFilter = useMemo(() => {
        if (!rows.length) return {};
        return buildFilterOptions(rows, FILTERS_CONFIG);
    }, [rows]);

    function setSelected(next) {
        if (onChange) onChange(next);       // controlled path
        else setLocalSelected(next);        // fallback uncontrolled path
    }

    return (
        <div className="h-full w-full flex flex-col justify-between rounded-xl p-2">
            <div className="h-8/10 flex-1 flex flex-col justify-evenly bg-white p-2 px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto scrollbar-hide">
                <div className="text-center text-red-600 font-bold text-lg mt-4">Filter Panel</div>

                <div className="flex flex-col mt-2 flex-1 justify-evenly " >
                    <Select
                        label="Analysis Dimension"
                        value={analysisDimension ?? "Entity"}
                        onChange={(v) => onAnalysisDimensionChange?.(v)}
                        options={ANALYSIS_DIMENSIONS_OPTIONS}
                    />
                    <Select
                        label="Emission Type"
                        value={selected.emissionType ?? "All"}
                        onChange={(v) => setSelected({ ...selected, emissionType: v })}
                        options={EMISSION_TYPE_OPTIONS}
                    />
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
            </div>

            <div className="p-5">
                <img src="src\assets\logo.svg" alt="Bain Logo" />
            </div>


        </div>
    );
}