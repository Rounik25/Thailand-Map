import { AreaChart1 } from "./components/Dashboard3/AreaChart1"
import { AreaChart2 } from "./components/Dashboard3/AreaChart2"
import { FilterDashboard3 } from "./components/Dashboard3/FilterDashboard3"
import { useState, useEffect, useMemo } from "react";
import { parseWorkbookToSheets } from "./utils/importData";
import { applyConfigFiltersDashboard3 } from "./utils/Dashboard3/applyFiltersDashboard3";
import { FILTERS_CONFIG_DASHBOARD3 } from "./utils/filterConfigDashboard3";

export function Dashboard3() {
    const [sheetData, setSheetData] = useState(null);
    const [analysisDimension, setAnalysisDimension] = useState("Decarbonization Lever");
    const initialSelectedFilters = useMemo(() => {
        const init = {};
        for (const f of FILTERS_CONFIG_DASHBOARD3) init[f.id] = "All";

        // keep your defaults if these IDs exist in your config
        init.scenario = "Balanced Phased Localization";
        init.subScenario = "Aggressive CCUS";
        return init;
    }, []);
    const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters);

    useEffect(() => {
        async function loadExcel() {
            try {
                const response = await fetch("/data/data.xlsx");
                const arrayBuffer = await response.arrayBuffer();

                const parsed = parseWorkbookToSheets(arrayBuffer);
                setSheetData(parsed);
            } catch (err) {
                console.error("Error loading Excel:", err);
            }
        }
        loadExcel();
    }, []);

    const dataSheet = "D3";

    const dataRows = useMemo(() => {
        return Array.isArray(sheetData?.[dataSheet]) ? sheetData[dataSheet] : [];
    }, [sheetData, dataSheet]);

    // Filtered rows based on selected filters
    const filteredDataRows = useMemo(() => {
        return applyConfigFiltersDashboard3(dataRows, selectedFilters, FILTERS_CONFIG_DASHBOARD3, dataSheet);
    }, [dataRows, selectedFilters, dataSheet]);

    
    const filteredRowPtt = useMemo(() =>{
        return filteredDataRows.filter(i => i.Company==="PTT")
    },[filteredDataRows])

    const filteredRowAll = useMemo(() =>{
        return filteredDataRows.filter(i => i.Company==="All Company")
    },[filteredDataRows])
    
    return (
        <div className="h-screen flex justify-evenly pb-15">
            <div className="h-full w-4/10 pl-5">
                <AreaChart1 rows={filteredRowAll} col={analysisDimension} />
            </div>
            <div className="h-full w-4/10 pl-5">
                <AreaChart2 rows={filteredRowPtt} col={analysisDimension} />
            </div>
            <div className="h-full w-4/20 p-5 pl-10 pb-10">
                <div className="h-full ">
                    <FilterDashboard3
                        sheetData={sheetData}
                        value={selectedFilters}
                        onChange={setSelectedFilters}
                        analysisDimension={analysisDimension}
                        onAnalysisDimensionChange={setAnalysisDimension}
                    />
                </div>
            </div>
        </div>
    )
}