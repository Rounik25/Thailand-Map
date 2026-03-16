import React, { useMemo, useState } from "react";
import { buildFilterOptions } from "../../utils/filterUtils";
import {
  buildOptionsByFilterFromSheets,
  buildOptionsByFilterFromSheets2,
} from "../../utils/buildFilter";
import { Select } from "./Select";

function getOptions({
  optionBuilder,
  rows,
  sheetData,
  filtersConfig,
}) {
  if (!filtersConfig?.length) return {};

  if (optionBuilder === "rows") {
    return buildFilterOptions(rows ?? [], filtersConfig);
  }

  if (optionBuilder === "sheetData") {
    return buildOptionsByFilterFromSheets(sheetData ?? {}, filtersConfig);
  }

  if (optionBuilder === "sheetData2") {
    return buildOptionsByFilterFromSheets2(sheetData ?? {}, filtersConfig);
  }

  return {};
}

export default function Filters({
  title = "Filter Panel",

  value,
  onChange,
  initialSelected = {},

  rows = [],
  sheetData = {},

  filtersConfig = [],
  optionBuilder = "rows",

  analysisDimension,
  onAnalysisDimensionChange,
  analysisDimensionOptions,

  showEmissionType = false,
  emissionTypeOptions = ["All", "Process", "Fuel", "Indirect_Electricity"],

  renderCustomFiltersTop,
  renderCustomFilters,
  renderFooter,

  className = "",
  innerClassName = "",
}) {
  const [localSelected, setLocalSelected] = useState(initialSelected);
  const selected = value ?? localSelected;

  function setSelected(nextOrUpdater) {
    const next =
      typeof nextOrUpdater === "function" ? nextOrUpdater(selected) : nextOrUpdater;

    if (onChange) onChange(next);
    else setLocalSelected(next);
  }

  const optionsByFilter = useMemo(() => {
    return getOptions({
      optionBuilder,
      rows,
      sheetData,
      filtersConfig,
    });
  }, [optionBuilder, rows, sheetData, filtersConfig]);

  return (
    <div
      className={`h-full w-full flex flex-col rounded-xl px-2 min-h-0 overflow-hidden ${className}`}
    >
      <div
        className={`flex-1 min-h-0 flex flex-col bg-white px-4 dark:border-slate-800 dark:bg-slate-900 overflow-hidden ${innerClassName}`}
      >
        <div className="flex justify-center text-center text-red-600 font-bold text-lg mt-3 shrink-0">
          {title}
          <img src="src\assets\funnel.svg" alt="filter logo" className="h-4 mt-1 px-2"/>
        </div>

        <div className="flex flex-col justify-start z-10 shrink-0">
          {renderCustomFiltersTop?.({
            selected,
            setSelected,
            optionsByFilter,
            Select,
          })}

          {analysisDimensionOptions?.length ? (
            <Select
              label="Analysis Dimension"
              value={analysisDimension ?? analysisDimensionOptions[0]}
              onChange={(v) => onAnalysisDimensionChange?.(v)}
              options={analysisDimensionOptions}
            />
          ) : null}

          {showEmissionType ? (
            <Select
              label="Emission Type"
              value={selected.emissionType ?? "All"}
              onChange={(v) => setSelected((p) => ({ ...p, emissionType: v }))}
              options={emissionTypeOptions}
            />
          ) : null}

          {filtersConfig.map((f) => {
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

          {renderCustomFilters?.({
            selected,
            setSelected,
            optionsByFilter,
            Select,
          })}
        </div>
      </div>

      {renderFooter ? (
        <div className="shrink-0 pb-1 scale-80">
          {renderFooter()}
        </div>
      ) : null}
    </div>
  );
}