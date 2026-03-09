import React, { useMemo, useState } from "react";
import { FILTERS_CONFIG_DASHBOARD2 } from "../../utils/filterConfigDashboard2";
import { buildOptionsByFilterFromSheets } from "../../utils/buildFilter";
import { Select } from "./Select";
import { TechnologyLegend } from "./TechnologyLegend";

const EMISSION_TYPE_OPTIONS = ["All", "Process", "Fuel", "Indirect_Electricity"];

export function FilterDashboard2({ sheetData = {}, value, onChange }) {
    const MASTER_SHEET = "D2_V1";
    const COL1_KEY = "Decarbonization Lever";
    const COL2_KEY = "Technology";

    // IDs used in selected state (your map/charts will read these)
    const COL1_ID = "decarbLever";
    const COL2_ID = "technology";

    // Controlled/uncontrolled selected state
    const [localSelected, setLocalSelected] = useState(() => {
        const init = {
            [COL1_ID]: "CCUS",
            [COL2_ID]: "All",
            emissionType: "All",
        };
        for (const f of FILTERS_CONFIG_DASHBOARD2) init[f.id] = "All";
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
        return buildOptionsByFilterFromSheets(sheetData, FILTERS_CONFIG_DASHBOARD2);
    }, [sheetData]);

    // Build relationship + full option lists for the two linked filters
    const {
        col2ToCol1,
        col1ToCol2s,
        col1OptionsAll,
        col2OptionsAll,
    } = useMemo(() => {
        const rows = Array.isArray(sheetData?.[MASTER_SHEET]) ? sheetData[MASTER_SHEET] : [];

        const col2ToCol1 = new Map();  // Technology -> Lever
        const col1ToCol2s = new Map(); // Lever -> Set(Technology)
        const col1Set = new Set();
        const col2Set = new Set();

        for (const r of rows) {
            const c1 = (r?.[COL1_KEY] ?? "").toString().trim();
            const c2 = (r?.[COL2_KEY] ?? "").toString().trim();
            if (!c1 || !c2) continue;

            col1Set.add(c1);
            col2Set.add(c2);

            col2ToCol1.set(c2, c1);
            if (!col1ToCol2s.has(c1)) col1ToCol2s.set(c1, new Set());
            col1ToCol2s.get(c1).add(c2);
        }

        return {
            col2ToCol1,
            col1ToCol2s,
            col1OptionsAll: Array.from(col1Set).sort(),
            col2OptionsAll: ["All", ...Array.from(col2Set).sort()],
        };
    }, [sheetData]);

    const col1Value = selected[COL1_ID] ?? "All";

    // Dependent Technology options based on selected Lever
    const col2Options = useMemo(() => {
        if (col1Value === "All") return col2OptionsAll;

        const subsSet = col1ToCol2s.get(col1Value);
        const subs = subsSet ? Array.from(subsSet).sort() : [];
        return ["All", ...subs];
    }, [col1Value, col1ToCol2s, col2OptionsAll]);

    // Two-way linkage handlers
    function onCol1Change(v) {
        setSelected((prev) => {
            const next = { ...prev, [COL1_ID]: v };
            const allowed = col1ToCol2s.get(v);
            const currentCol2 = prev[COL2_ID] ?? "All";

            if (currentCol2 !== "All" && (!allowed || !allowed.has(currentCol2))) {
                next[COL2_ID] = "All";
            }

            return next;
        });
    }

    function onCol2Change(v) {
        setSelected((prev) => {
            const next = { ...prev, [COL2_ID]: v };

            if (v !== "All") {
                const parent = col2ToCol1.get(v);
                if (parent) next[COL1_ID] = parent;
            }

            return next;
        });
    }


    return (
        <div className="h-9/10 w-full flex flex-col justify-between rounded-xl px-2 shadow-lg rounded-xl border-2 border-slate-300">
            <div className="h-8/10 flex-1 flex flex-col justify-evenly bg-white px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto">
                <div className="text-center text-red-600 font-bold text-lg mt-2">Filter Panel</div>

                <div className="h-6/10 flex flex-col mt-2 flex-1 justify-start overflow-y-auto " >
                    <Select
                        label="Decarbonization Lever"
                        value={selected[COL1_ID] ?? "CCUS"}
                        onChange={onCol1Change}
                        options={col1OptionsAll}
                    />

                    <Select
                        label="Technology"
                        value={selected[COL2_ID] ?? "All"}
                        onChange={onCol2Change}
                        options={col2Options}
                    />
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

            <div className="h-2/10 overflow-y-auto">
                <TechnologyLegend
                    technologies={col2OptionsAll.slice(1)} // remove "All"
                    selectedTechnology={selected[COL2_ID] ?? "All"}
                    onSelect={(tech) => {
                        const current = selected[COL2_ID] ?? "All";

                        if (current === tech) {
                            setSelected((p) => ({ ...p, [COL2_ID]: "All" }));
                        } else {
                            setSelected((p) => ({ ...p, [COL2_ID]: tech }));
                        }
                    }}
                />
            </div>

            <div className="p-5">
                <img src="src\assets\logo.svg" alt="Bain Logo" />
            </div>


        </div>
    );
}