import React, { useEffect } from "react";
import Filters from "../common/Filter";
import { FILTERS_CONFIG_DASHBOARD3 } from "../../utils/filterConfigDashboard3";
import ChartLegendDashboard3 from "./ChartLegendDashboard3";
import AddFilter from "./AddFilter";

const ANALYSIS_DIMENSIONS_OPTIONS = ["Decarbonization Lever", "Technology"];
const DEFAULT_ANALYSIS_DIMENSION = "Decarbonization Lever";

export function TestFilter3({
  sheetData = {},
  value,
  onChange,
  analysisDimension,
  onAnalysisDimensionChange,
  filteredDataRows,
  selectedKeyAll,
  selectedKeyPtt,
  onLegendChange,
  filtersConfig,
  handleAddFilter,
  dataSheet = "D3",
}) {
  useEffect(() => {
    if (!analysisDimension && onAnalysisDimensionChange) {
      onAnalysisDimensionChange(DEFAULT_ANALYSIS_DIMENSION);
    }
  }, [analysisDimension, onAnalysisDimensionChange]);

  const initialSelected = {
    ...Object.fromEntries(FILTERS_CONFIG_DASHBOARD3.map((f) => [f.id, "All"])),
    scenario: "Balanced Phased Localization",
    subScenario: "Aggressive CCUS",
  };

  return (
    <Filters
      sheetData={sheetData}
      value={value}
      onChange={onChange}
      initialSelected={initialSelected}
      filtersConfig={filtersConfig}
      optionBuilder="sheetData2"
      analysisDimension={analysisDimension}
      onAnalysisDimensionChange={onAnalysisDimensionChange}
      analysisDimensionOptions={ANALYSIS_DIMENSIONS_OPTIONS}
      className="shadow-lg border-2 border-slate-300"
      renderCustomFilters={() => (
        <div className="mt-2">
          <AddFilter
            sheetData={sheetData}
            defaultSheet={dataSheet}
            existingFilterIds={filtersConfig.map((f) => f.id)}
            onAdd={handleAddFilter}
          />
        </div>
      )}
      renderLegend={() => (
        <ChartLegendDashboard3
          rows={filteredDataRows}
          analysisDimension={analysisDimension}
          selectedKeyAll={selectedKeyAll}
          selectedKeyPtt={selectedKeyPtt}
          onChange={onLegendChange}
          reverse
        />
      )}
      renderFooter={() => (
        <img src="src/assets/logo.svg" alt="Bain Logo" />
      )}
    />
  );
}