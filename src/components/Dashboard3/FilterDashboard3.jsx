import React, { useEffect, useMemo, useState } from "react";
import { FILTERS_CONFIG_DASHBOARD3 } from "../../utils/filterConfigDashboard3";
import { buildOptionsByFilterFromSheets2 } from "../../utils/buildFilter";
import { Select } from "./Select";
import ChartLegendDashboard3 from "./ChartLegendDashboard3";

const ANALYSIS_DIMENSIONS_OPTIONS = ['Decarbonization Lever', 'Technology'];
const DEFAULT_ANALYSIS_DIMENSION = "Decarbonization Lever";

export function FilterDashboard3({
    sheetData = {},
    value,
    onChange,
    analysisDimension,
    onAnalysisDimensionChange,
    filteredDataRows,
    selectedKeyAll,
    selectedKeyPtt,
    onLegendChange
}) {
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
        return buildOptionsByFilterFromSheets2(sheetData, FILTERS_CONFIG_DASHBOARD3);
    }, [sheetData]);

    useEffect(() => {
        if (!analysisDimension && onAnalysisDimensionChange) {
            onAnalysisDimensionChange(DEFAULT_ANALYSIS_DIMENSION);
        }
    }, [analysisDimension, onAnalysisDimensionChange]);

    useEffect(() => {
        if (!optionsByFilter) return;

        let changed = false;
        const next = { ...selected };

        for (const f of FILTERS_CONFIG_DASHBOARD3) {
            const opts = optionsByFilter[f.id] ?? ["All"];
            const current = next[f.id];

            // if missing or not in available options, pick first option (or "All")
            if (!current || !opts.includes(current)) {
                next[f.id] = opts[0] ?? "All";
                changed = true;
            }
        }

        if (changed) setSelected(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsByFilter]);

    return (
        <div className="h-full w-full flex flex-col justify-between rounded-xl px-2 shadow-lg rounded-xl border-2 border-slate-300">
            <div className="h-8/10 flex-1 flex flex-col justify-start bg-white px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto">
                <div className="text-center text-red-600 font-bold text-md mt-5">Filter Panel</div>
                <div className="h-8/10 flex flex-col mt-2 justify-start z-10" >
                    <Select
                        label="Analysis Dimension"
                        value={analysisDimension ?? "Decarbonization Lever"}
                        onChange={(v) => onAnalysisDimensionChange?.(v)}
                        options={ANALYSIS_DIMENSIONS_OPTIONS}
                    />
                    {FILTERS_CONFIG_DASHBOARD3.map((f) => {
                        const opts = optionsByFilter[f.id] ?? ["All"];
                        const v = selected[f.id] ?? opts[0] ?? "All";
                        return (
                            <Select
                                key={f.id}
                                label={f.label}
                                value={v}
                                onChange={(val) => setSelected((p) => ({ ...p, [f.id]: val }))}
                                options={opts}
                            />
                        );
                    })}

                </div>
                <div className="h-full">
                    <ChartLegendDashboard3
                        rows={filteredDataRows}
                        analysisDimension={analysisDimension}
                        selectedKeyAll={selectedKeyAll}
                        selectedKeyPtt={selectedKeyPtt}
                        onChange={onLegendChange}  
                        reverse
                    />
                </div>
            </div>


            <div className="p-5">
                <img src="src\assets\logo.svg" alt="Bain Logo" />
            </div>
        </div>
    );
}