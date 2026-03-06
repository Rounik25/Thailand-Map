import { MapTab3 } from "./components/Tab3/MapTab3"
import { DashboardTab3 } from "./components/Tab3/DashboardTab3"
import { FilterTab3 } from "./components/Tab3/FilterTab3"

export function Tab3({ dark }) {
    return (
        <div className="flex h-screen w-full">
            <div className="flex h-full w-[35%] p-5 pb-20">
                <MapTab3
                    dark={dark}
                    // rows={filteredRows}          // or rows
                    // emissionType={selectedFilters.emissionType}
                />
            </div>
            <div className="flex h-screen w-[45%]">
                <DashboardTab3 />
            </div>
            <div className="flex h-screen w-[20%]">
                <FilterTab3 />
            </div>
        </div>
    )
}