import { AreaChart1 } from "./components/Dashboard3/AreaChart1"
import { AreaChart2 } from "./components/Dashboard3/AreaChart2"
import { FilterDashboard3 } from "./components/Dashboard3/FilterDashboard3"
import { useState, useEffect } from "react";
import { parseWorkbookToSheets } from "./utils/importData";

export function Dashboard3() {
    const [sheetData, setSheetData] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        scenerio: "All",
        subScenerio: "All"
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

    return (
        <div className="h-screen flex justify-evenly pb-15">
            <div className="h-full w-4/10 pl-5">
                <AreaChart1 />
            </div>
            <div className="h-full w-4/10 pl-5">
                <AreaChart2 />
            </div>
            <div className="h-full w-4/20 p-5 pl-10 pb-10">
                <div className="h-full ">
                    <FilterDashboard3 sheetData={sheetData} value={selectedFilters} onChange={setSelectedFilters} />
                </div>
            </div>
        </div>
    )
}