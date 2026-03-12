import React, { useMemo } from "react";
import Filters from "../common/Filter";
import { FILTERS_CONFIG_DASHBOARD2 } from "../../utils/filterConfigDashboard2";
import { TechnologyLegend } from "./TechnologyLegend";
import { EntityLegend } from "./EntityLegend";
import { Select } from "../common/Select";

const EMISSION_TYPE_OPTIONS = ["All", "Process", "Fuel", "Indirect_Electricity"];

export function TestFilter2({ sheetData = {}, value, onChange }) {
  const MASTER_SHEET = "D2_V1";
  const COL1_KEY = "Decarbonization Lever";
  const COL2_KEY = "Technology";
  const COL1_ID = "decarbLever";
  const COL2_ID = "technology";

  const initialSelected = {
    [COL1_ID]: "CCUS",
    [COL2_ID]: "All",
    emissionType: "All",
    ...Object.fromEntries(FILTERS_CONFIG_DASHBOARD2.map((f) => [f.id, "All"])),
  };

  const { col2ToCol1, col1ToCol2s, col1OptionsAll, col2OptionsAll } = useMemo(() => {
    const rows = Array.isArray(sheetData?.[MASTER_SHEET]) ? sheetData[MASTER_SHEET] : [];

    const col2ToCol1 = new Map();
    const col1ToCol2s = new Map();
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

  return (
    <div className="h-full w-full shadow-lg border-2 border-slate-300 rounded-lg">
      <Filters
        sheetData={sheetData}
        value={value}
        onChange={onChange}
        initialSelected={initialSelected}
        filtersConfig={FILTERS_CONFIG_DASHBOARD2}
        optionBuilder="sheetData"
        showEmissionType
        emissionTypeOptions={EMISSION_TYPE_OPTIONS}
        renderCustomFiltersTop={({ selected, setSelected }) => {
          const col1Value = selected[COL1_ID] ?? "CCUS";
          const col2Value = selected[COL2_ID] ?? "All";

          const col2Options =
            col1Value === "All"
              ? col2OptionsAll
              : ["All", ...Array.from(col1ToCol2s.get(col1Value) ?? []).sort()];

          return (
            <>
              <Select
                label="Decarbonization Lever"
                value={col1Value}
                onChange={(nextCol1) => {
                  const allowedTechs =
                    nextCol1 === "All"
                      ? col2OptionsAll
                      : ["All", ...Array.from(col1ToCol2s.get(nextCol1) ?? []).sort()];

                  const nextCol2 = allowedTechs.includes(col2Value) ? col2Value : "All";

                  setSelected((p) => ({
                    ...p,
                    [COL1_ID]: nextCol1,
                    [COL2_ID]: nextCol2,
                  }));
                }}
                options={col1OptionsAll}
              />

              <Select
                label="Technology"
                value={col2Value}
                onChange={(nextCol2) => {
                  const mappedCol1 =
                    nextCol2 === "All"
                      ? selected[COL1_ID]
                      : col2ToCol1.get(nextCol2) ?? selected[COL1_ID];

                  setSelected((p) => ({
                    ...p,
                    [COL2_ID]: nextCol2,
                    [COL1_ID]: mappedCol1,
                  }));
                }}
                options={col2Options}
              />
            </>
          );
        }}
        renderLegend={({ selected, setSelected }) => {
          const col1Value = selected[COL1_ID] ?? "CCUS";
          const currentTechOptions =
            col1Value === "All"
              ? col2OptionsAll
              : ["All", ...Array.from(col1ToCol2s.get(col1Value) ?? []).sort()];

          return (
            <div>
              <div className="text-md font-bold text-red-600 text-center my-1">Legend</div>

              <div className="p-1 text-sm font-semibold">Entity Category</div>
              <EntityLegend />

              <div className="p-1 text-sm font-semibold">Technology</div>
              <TechnologyLegend
                technologies={currentTechOptions.filter((t) => t !== "All")}
                selectedTechnology={selected[COL2_ID] ?? "All"}
                onSelect={(tech) => {
                  const current = selected[COL2_ID] ?? "All";

                  if (current === tech) {
                    setSelected((p) => ({ ...p, [COL2_ID]: "All" }));
                  } else {
                    setSelected((p) => ({
                      ...p,
                      [COL2_ID]: tech,
                      [COL1_ID]: col2ToCol1.get(tech) ?? p[COL1_ID],
                    }));
                  }
                }}
              />
            </div>
          );
        }}
        renderFooter={() => <img src="src/assets/logo.svg" alt="Bain Logo" />}
      />
    </div>
  );
}