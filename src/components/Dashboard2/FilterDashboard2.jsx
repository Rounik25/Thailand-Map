import React, { useMemo, useState, useEffect, useRef } from "react";
import { FILTERS_CONFIG_DASHBOARD2 } from "../../utils/filterConfigDashboard2";
import { buildOptionsByFilterFromSheets } from "../../utils/buildFilter";

const EMISSION_TYPE_OPTIONS = ["All", "Process", "Fuel", "Indirect_Electricity"];

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
                className="w-full h-7 min-w-0 border-2 border-slate-200 bg-white px-3 text-sm text-left text-black rounded-lg
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

export function FilterDashboard2({ sheetData = {}, value, onChange }) {
    const [localSelected, setLocalSelected] = useState(() => {
        const init = {};
        for (const f of FILTERS_CONFIG_DASHBOARD2) init[f.id] = "All";
        return init;
    });

    console.log("sheetData keys:", Object.keys(sheetData || {}));

    const selected = value ?? localSelected;

    const optionsByFilter = useMemo(() => {
        return buildOptionsByFilterFromSheets(sheetData, FILTERS_CONFIG_DASHBOARD2);
    }, [sheetData]);

    function setSelected(nextOrUpdater) {
        const next =
            typeof nextOrUpdater === "function" ? nextOrUpdater(selected) : nextOrUpdater;
        if (onChange) onChange(next);       // controlled path
        else setLocalSelected(next);        // fallback uncontrolled path
    }



    return (
        <div className="h-9/10 w-full flex flex-col justify-between rounded-xl px-2 shadow-lg rounded-xl border-2 border-slate-300">
            <div className="h-8/10 flex-1 flex flex-col justify-evenly bg-white px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto">
                <div className="text-center text-red-600 font-bold text-lg mt-2">Filter Panel</div>

                <div className="flex flex-col mt-2 flex-1 justify-start " >
                    <Select
                        label="Emission Type"
                        value={selected.emissionType ?? "All"}
                        onChange={(v) => setSelected({ ...selected, emissionType: v })}
                        options={EMISSION_TYPE_OPTIONS}
                    />
                    {FILTERS_CONFIG_DASHBOARD2.map((f) => (
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

            {/* <div>
                <Legends
                    rows={rows}
                    analysisDimension={analysisDimension}
                    onClickItem={() => {
                        // Optionally: call out to parent to set filters

                    }}
                    showCount={true}
                />
            </div> */}

            <div className="p-5">
                <img src="src\assets\logo.svg" alt="Bain Logo" />
            </div>


        </div>
    );
}