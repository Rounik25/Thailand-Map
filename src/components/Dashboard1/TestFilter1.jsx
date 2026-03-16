import React from "react";
import Filters from "../common/Filter";
import { FILTERS_CONFIG_DASHBOARD1 } from "../../utils/filterConfigDashboard1";

const ANALYSIS_DIMENSIONS_OPTIONS = ["Entity", "Sector", "Decarbonization Plan"];

export function TestFilter1({
  rows = [],
  value,
  onChange,
  analysisDimension,
  onAnalysisDimensionChange,
}) {
  const initialSelected = {
    emissionType: "All",
    ...Object.fromEntries(FILTERS_CONFIG_DASHBOARD1.map((f) => [f.id, "All"])),
  };

  return (
    <Filters
      rows={rows}
      value={value}
      onChange={onChange}
      initialSelected={initialSelected}
      filtersConfig={FILTERS_CONFIG_DASHBOARD1}
      optionBuilder="rows"
      analysisDimension={analysisDimension}
      onAnalysisDimensionChange={onAnalysisDimensionChange}
      analysisDimensionOptions={ANALYSIS_DIMENSIONS_OPTIONS}
      showEmissionType
      
      renderFooter={() => (
        <img src="src/assets/logo.svg" alt="Bain Logo" />
      )}
    />
  );
}