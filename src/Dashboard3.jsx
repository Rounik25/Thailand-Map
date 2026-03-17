import { AreaChart1 } from "./components/Dashboard3/AreaChart1"
import { AreaChart2 } from "./components/Dashboard3/AreaChart2"
import { useState, useMemo } from "react";
import { applyConfigFiltersDashboard3 } from "./utils/Dashboard3/applyFiltersDashboard3";
import { FILTERS_CONFIG_DASHBOARD3 } from "./utils/filterConfigDashboard3";
import { TestFilter3 } from "./components/Dashboard3/TestFilter3";
import ChartLegendDashboard3 from "./components/Dashboard3/ChartLegend";

export function Dashboard3({sheetData}) {
    const [analysisDimension, setAnalysisDimension] = useState("Decarbonization Lever");

    const [selectedKeyAll, setSelectedKeyAll] = useState(null);
    const [selectedKeyPtt, setSelectedKeyPtt] = useState(null);

    const [filtersConfig, setFiltersConfig] = useState(() => {
        // make a shallow copy we can extend
        return FILTERS_CONFIG_DASHBOARD3.slice();
    });

    const handleAddFilter = (newFilter, defaultSelected, meta) => {
        // attach includeAll on config (so options builder can decide)
        const filterWithMeta = { ...newFilter, includeAll: meta?.includeAll ?? true };

        setFiltersConfig((prev) => [...(prev ?? []), filterWithMeta]);
        setSelectedFilters((prev) => ({ ...(prev ?? {}), [newFilter.id]: defaultSelected }));
    };

    const handleLegendChange = (nextKey) => {
        setSelectedKeyAll(nextKey);
        setSelectedKeyPtt(nextKey);
    };

    const initialSelectedFilters = useMemo(() => {
        const init = {};
        for (const f of FILTERS_CONFIG_DASHBOARD3) init[f.id] = "All";

        // keep your defaults if these IDs exist in your config
        init.scenario = "Balanced Phased Localization";
        init.subScenario = "Aggressive CCUS";
        return init;
    }, []);
    const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters);

    const dataSheet = "D3";

    const dataRows = useMemo(() => {
        return Array.isArray(sheetData?.[dataSheet]) ? sheetData[dataSheet] : [];
    }, [sheetData, dataSheet]);

    const costSheet = "D3_Cost";

    const costRows = useMemo(() => {
        return Array.isArray(sheetData?.[costSheet]) ? sheetData[costSheet] : [];
    }, [sheetData, costSheet]);

    // Filtered rows based on selected filters
    const filteredDataRows = useMemo(() => {
        return applyConfigFiltersDashboard3(dataRows, selectedFilters, filtersConfig, dataSheet);
    }, [dataRows, selectedFilters, dataSheet, filtersConfig]);


    const filteredRowPtt = useMemo(() => {
        return filteredDataRows.filter(i => i.Company === "PTT")
    }, [filteredDataRows])

    const [filteredPttCost, filteredAllCost] = useMemo(() => {
        const filteredCosts = costRows.filter(r =>
            r.Scenario === selectedFilters.scenario &&
            r["Sub-Scenario"] === selectedFilters.subScenario
        );

        const allRow = filteredCosts.find(r => r["Company"] === "All Company");
        const pttRow = filteredCosts.find(r => r["Company"] === "PTT");

        return [
            pttRow?.["Weighted average cost of abatement"] ?? null,
            allRow?.["Weighted average cost of abatement"] ?? null,
        ];
    }, [costRows, selectedFilters]);

    const filteredRowAll = useMemo(() => {
        return filteredDataRows.filter(i => i.Company === "All Company")
    }, [filteredDataRows])

    return (
        <div className="h-full flex scrollbar-hide overflow-y-auto min-h-0 min-w-0 overflow-hidden">
            <div className="h-full basis-4/5 min-h-0 min-w-0 flex p-5 pr-0 overflow-hidden">
                <div className="flex flex-col w-full h-full min-h-0 min-w-0 bg-white rounded-xl shadow-xl">
                    <div className="text-2xl text-center font-semibold pb-5 pt-2 flex shrink-0">
                        <img src="src\assets\area-chart.svg" alt="area-chart logo" className="pl-10 shrink-0"/>
                        Emissions to be Abated
                    </div>
                    <div className="flex min-h-0 min-w-0 overflow-hidden">
                        <ChartLegendDashboard3
                            rows={filteredDataRows}
                            analysisDimension={analysisDimension}
                            selectedKeyAll={selectedKeyAll}
                            selectedKeyPtt={selectedKeyPtt}
                            onChange={handleLegendChange}
                            reverse
                        />
                    </div>
                    <div className="flex-1 min-h-0 min-w-0 ofverflow-hidden w-full flex">
                        <div className="h-full w-1/2 mr-5 min-h-0 min-w-0 overflow-hidden">
                            <AreaChart1
                                rows={filteredRowAll}
                                col={analysisDimension}
                                selectedKey={selectedKeyAll}
                                setSelectedKey={setSelectedKeyAll}
                                cost={filteredAllCost}
                            />
                        </div>
                        <div className="h-full w-1/2 min-h-0 min-w-0 overflow-hidden">
                            <AreaChart2
                                rows={filteredRowPtt}
                                col={analysisDimension}
                                selectedKey={selectedKeyPtt}
                                setSelectedKey={setSelectedKeyPtt}
                                cost={filteredPttCost}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full basis-1/5 min-h-0 min-w-0 flex p-5">
                <div className="h-full w-full max-w-full min-h-0 min-w-0 rounded-xl shadow-xl bg-white">
                    <TestFilter3
                        sheetData={sheetData}
                        value={selectedFilters}
                        onChange={setSelectedFilters}
                        analysisDimension={analysisDimension}
                        onAnalysisDimensionChange={setAnalysisDimension}
                        filteredDataRows={filteredDataRows}
                        selectedKeyAll={selectedKeyAll}
                        selectedKeyPtt={selectedKeyPtt}
                        onLegendChange={handleLegendChange}
                        filtersConfig={filtersConfig}
                        handleAddFilter={handleAddFilter}
                        dataSheet={dataSheet}
                    />

                </div>
            </div>
        </div>
    )
}