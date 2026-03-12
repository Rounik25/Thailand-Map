import React, { useEffect, useMemo, useRef, useState } from "react";
import { buildFilterOptions } from "../../utils/filterUtils";
import {
  buildOptionsByFilterFromSheets,
  buildOptionsByFilterFromSheets2,
} from "../../utils/buildFilter";

function Select({ label, value, onChange, options = [] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-w-0 flex flex-col gap-1">
      <span className="text-sm font-medium text-black dark:text-slate-300">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-7 min-w-0 border-2 border-slate-200 bg-white px-3 text-sm text-left text-black rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      >
        <span className="block truncate w-full">{value || "Select option"}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-0 border border-slate-200 bg-white rounded-lg shadow-lg z-50 dark:border-slate-700 dark:bg-slate-900 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-normal break-words"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  renderCustomFilters,
  renderLegend,
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
      className={`h-full w-full flex flex-col justify-between rounded-xl px-2 ${className}`}
    >
      <div
        className={`flex-1 flex flex-col bg-white px-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto scrollbar-hide ${innerClassName}`}
      >
        <div className="text-center text-red-600 font-bold text-md mt-5">
          {title}
        </div>

        <div className="flex flex-col mt-2 justify-start z-10 gap-3">
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

        {renderLegend ? (
          <div className="h-full mt-3">
            {renderLegend({ selected, setSelected, optionsByFilter })}
          </div>
        ) : null}
      </div>

      {renderFooter ? <div className="p-5">{renderFooter()}</div> : null}
    </div>
  );
}