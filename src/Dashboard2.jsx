import { MapDashboard2 } from "./components/Dashboard2/MapDashboard2"
import { CardsDashboard2 } from "./components/Dashboard2/CardsDashboard2"
import { FilterDashboard2 } from "./components/Dashboard2/FilterDashboard2"

export function Dashboard2({ dark }) {
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
                <FilterDashboard2 />
            </div>
        </div>
    )
}