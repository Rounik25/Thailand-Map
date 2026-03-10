import React, { useMemo, useState } from "react";
import { FILTERS_CONFIG_DASHBOARD3 } from "../../utils/filterConfigDashboard3";
import { buildOptionsByFilterFromSheets } from "../../utils/buildFilter";
import { Select } from "./Select";

const EMISSION_TYPE_OPTIONS = ["All", "Process", "Fuel", "Indirect_Electricity"];

export function FilterDashboard3({ sheetData = {}, value, onChange }) {
    const [localSelected, setLocalSelected] = useState(() => {
        const init = []
        for (const f of FILTERS_CONFIG_DASHBOARD3) init[f.id] = "All";
        return init;
    });

    const selected = value ?? localSelected;

    function setSelected(nextOrUpdater) {
        const next =
            typeof nextOrUpdater === "function" ? nextOrUpdater(selected) : nextOrUpdater;
        if (onChange) onChange(next); // controlled
        else setLocalSelected(next);  // uncontrolled
    }

    // Options for config-driven filters (everything except the two manual ones)
    const optionsByFilter = useMemo(() => {
        return buildOptionsByFilterFromSheets(sheetData, FILTERS_CONFIG_DASHBOARD3);
    }, [sheetData]);

    return (
        <div className="h-full w-full flex flex-col justify-between rounded-xl px-2 shadow-lg rounded-xl border-2 border-slate-300">
            <div className="h-8/10 flex-1 flex flex-col justify-evenly bg-white px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto">
                <div className="text-center text-red-600 font-bold text-md">Filter Panel</div>

                <div className="h-5/10 flex flex-col mt-2 flex-1 justify-start overflow-y-auto " >
                    {FILTERS_CONFIG_DASHBOARD3.map((f) => (
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