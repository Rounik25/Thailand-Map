import { KPI } from "./KPI"
import { LineChartDashboard2 } from "./LineChartDashboard2"

export function CardsDashboard2({ rowsD2V1, rowsD2V3, rowsD2V4_5, selectedFilters }) {
    return (
        <div className="w-full h-full flex flex-col justify-start">
            <div className="w-full h-7/10 bg-white border-2 border-slate-300 shadow-xl rounded-xl">
                <div className="flex flex-col h-full w-full">
                    <div className="text-xl font-semibold h-10 px-5">
                        MACC Curves
                    </div>
                    <div>Legend</div>
                    <div className="flex-1 min-h-0 w-full pb-5">
                        <LineChartDashboard2 rows={rowsD2V1} decarbLever={selectedFilters.decarbLever} />
                    </div>
                </div>
            </div>
            <div className="w-full h-2/10 mt-10">
                <KPI rowsD2V3={rowsD2V3} rowsD2V4_5={rowsD2V4_5} />
            </div>
        </div>
    )
}