import { MapDashboard2 } from "./components/Dashboard2/MapDashboard2"
import { CardsDashboard2 } from "./components/Dashboard2/CardsDashboard2"
import { useState, useMemo } from "react"
import { FILTERS_CONFIG_DASHBOARD2 } from "./utils/filterConfigDashboard2"
import { applyConfigFilters } from "./utils/Dashboard2/applyFIlters"
import { TestFilter2 } from "./components/Dashboard2/TestFilter2"

export function Dashboard2({ dark, sheetData }) {
    const COL1_ID = "decarbLever";
    const COL2_ID = "technology";
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
    

    const mapSheet = "D2_V2";

    const mapRows = useMemo(() => {
        return Array.isArray(sheetData?.[mapSheet]) ? sheetData[mapSheet] : [];
    }, [sheetData, mapSheet]);

    // Filtered rows based on selected filters
    const filteredMapRows = useMemo(() => {
        return applyConfigFilters(mapRows, selectedFilters, FILTERS_CONFIG_DASHBOARD2, mapSheet);
    }, [mapRows, selectedFilters, mapSheet]);

    const d2V1Rows = useMemo(() => {
        return Array.isArray(sheetData?.D2_V1) ? sheetData.D2_V1 : [];
    }, [sheetData]);

    // Filtered rows based on selected filters
    const filteredD2V1Rows = useMemo(() => {
        const lever = selectedFilters[COL1_ID] ?? "All";
        const tech = selectedFilters[COL2_ID] ?? "All";

        const LEVER_COL = "Decarbonization Lever";
        const TECH_COL = "Technology";

        return d2V1Rows.filter((r) => {
            if (lever !== "All" && (r?.[LEVER_COL] ?? "") !== lever) return false;
            if (tech !== "All" && (r?.[TECH_COL] ?? "") !== tech) return false;

            return true;
        });
    }, [d2V1Rows, selectedFilters]);

    const d2V3Rows = useMemo(() => {
        return Array.isArray(sheetData?.D2_V3) ? sheetData.D2_V3 : [];
    }, [sheetData]);

    // Filtered rows based on selected filters
    const filteredD2V3Rows = useMemo(() => {
        const lever = selectedFilters[COL1_ID] ?? "All";
        const tech = selectedFilters[COL2_ID] ?? "All";

        const LEVER_COL = "Decarbonization Lever";
        const TECH_COL = "Technology";

        return d2V3Rows.filter((r) => {
            if (lever !== "All" && (r?.[LEVER_COL] ?? "") !== lever) return false;
            if (tech !== "All" && (r?.[TECH_COL] ?? "") !== tech) return false;

            return true;
        });
    }, [d2V3Rows, selectedFilters]);

    const d2V4_5Rows = useMemo(() => {
        return Array.isArray(sheetData?.D2_V4_5) ? sheetData.D2_V4_5 : [];
    }, [sheetData]);

    // Filtered rows based on selected filters
    const filtereddDV4_5Rows = useMemo(() => {
        const lever = selectedFilters[COL1_ID] ?? "All";

        const LEVER_COL = "Decarbonization Lever";

        return d2V4_5Rows.filter((r) => {
            if (lever !== "All" && (r?.[LEVER_COL] ?? "") !== lever) return false;
            return true;
        });
    }, [d2V4_5Rows, selectedFilters]);

    return (
        <div className="h-full min-h-0 min-w-0 flex scrollbar-hide overflow-y-auto">
            <div className="flex h-full basis-4/5 min-h-0 min-w-0 p-5 pr-0">
                <div className="flex h-full w-full min-h-0 min-w-0 bg-white shadow-xl rounded-xl p-2">
                    <div className="h-full minh-0 min-w-0 basis-1/3 mr-2">
                        <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
                            <MapDashboard2
                                dark={dark}
                                rows={filteredMapRows}
                                emissionType={selectedFilters.emissionType}
                                decarbLever={selectedFilters.decarbLever}
                                selectedFilters={selectedFilters}
                            />
                        </div>
                    </div>
                    <div className="h-full min-h-0 min-w-0 basis-2/3 overflow-hidden">
                        <CardsDashboard2
                            rowsD2V1={filteredD2V1Rows}
                            rowsD2V3={filteredD2V3Rows}
                            rowsD2V4_5={filtereddDV4_5Rows}
                            selectedFilters={selectedFilters}
                        />
                    </div>
                </div>
            </div>
            <div className="flex min-h-0 min-w-0 h-full basis-1/5 p-5">
                <div className="h-full w-full min-h-0 overflow-y-auto scrollbar-hide bg-white rounded-xl shadow-xl">
                    <TestFilter2
                        sheetData={sheetData}
                        value={selectedFilters}
                        onChange={setSelectedFilters}
                    />
                </div>
            </div>
        </div>
    )
}