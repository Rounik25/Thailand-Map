import { MapDashboard2 } from "./components/Dashboard2/MapDashboard2"
import { CardsDashboard2 } from "./components/Dashboard2/CardsDashboard2"
import { FilterDashboard2 } from "./components/Dashboard2/FilterDashboard2"
import { parseWorkbookToSheets } from "./utils/importData"
import { useState, useEffect } from "react"

export function Dashboard2({ dark }) {

    const [sheetData, setSheetData] = useState(null);

    useEffect(() => {
        async function loadExcel() {
            try {
                const response = await fetch("/data/data.xlsx");
                const arrayBuffer = await response.arrayBuffer();

                const parsed = parseWorkbookToSheets(arrayBuffer);
                setSheetData(parsed);

                console.log("All sheets:", parsed);
            } catch (err) {
                console.error("Error loading Excel:", err);
            }
        }

        loadExcel();
    }, []);

    console.log(sheetData)


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
                <CardsDashboard2 />
            </div>
            <div className="flex h-screen w-[20%] p-5">
                <FilterDashboard2 sheetData={sheetData} />
            </div>
        </div>
    )
}