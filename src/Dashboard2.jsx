import { MapDashboard2 } from "./components/Dashboard2/MapDashboard2"
import { CardsDashboard2 } from "./components/Dashboard2/CardsDashboard2"
import { FilterDashboard2 } from "./components/Dashboard2/FilterDashboard2"
import { parseWorkbookToSheets } from "./utils/importData"
import { useState, useEffect, useMemo } from "react"

export function Dashboard2({ dark }) {
    const COL1_ID = "decarbLever";
    const COL2_ID = "technology";

    const [sheetData, setSheetData] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        [COL1_ID]: "CCUS",
        [COL2_ID]: "All",
        emissionType: "All",
        conglomerate: "All",
        industry: "All",
        decarbPlan: "All",
        state: "All",
        city: "All",
        company: "All",

    });

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

    const d2V1Rows = useMemo(() => {
        return Array.isArray(sheetData?.D2_V1) ? sheetData.D2_V1 : [];
    }, [sheetData]);

    // Filtered rows based on selected filters
    const filteredD2V1Rows = useMemo(() => {
        const lever = selectedFilters[COL1_ID] ?? "All";
        const tech = selectedFilters[COL2_ID] ?? "All";

        // Column names in D2_V1 sheet (must match Excel headers)
        const LEVER_COL = "Decarbonization Lever";
        const TECH_COL = "Technology";

        return d2V1Rows.filter((r) => {
            if (lever !== "All" && (r?.[LEVER_COL] ?? "") !== lever) return false;
            if (tech !== "All" && (r?.[TECH_COL] ?? "") !== tech) return false;

            return true;
        });
    }, [d2V1Rows, selectedFilters]);

    const d2V4_5Rows = useMemo(() => {
        return Array.isArray(sheetData?.D2_V4_5) ? sheetData.D2_V4_5 : [];
    }, [sheetData]);

    // Filtered rows based on selected filters
    const filtereddDV4_5Rows = useMemo(() => {
        const lever = selectedFilters[COL1_ID] ?? "All";

        // Column names in D2_V1 sheet (must match Excel headers)
        const LEVER_COL = "Decarbonization Lever";

        return d2V4_5Rows.filter((r) => {
            if (lever !== "All" && (r?.[LEVER_COL] ?? "") !== lever) return false;
            return true;
        });
    }, [d2V4_5Rows, selectedFilters]);

    return (
        <div className="flex h-screen w-full">
            <div className="flex h-full w-[35%] p-5 pb-20">
                <MapDashboard2
                    dark={dark}
                // rows={filteredRows}          // or rows
                // emissionType={selectedFilters.emissionType}
                />
            </div>
            <div className="flex h-screen w-[45%]">
                <CardsDashboard2 rowsD2V1={filteredD2V1Rows} rowsD2V4_5={filtereddDV4_5Rows} />
            </div>
            <div className="flex h-screen w-[20%] p-5">
                <FilterDashboard2 sheetData={sheetData} value={selectedFilters} onChange={setSelectedFilters} />
            </div>
        </div>
    )
}