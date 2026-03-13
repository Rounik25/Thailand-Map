import { KPI } from "./KPI"
import { LineChartDashboard2 } from "./LineChartDashboard2"

export function CardsDashboard2({rowsD2V1, rowsD2V3, rowsD2V4_5, selectedFilters}){
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="w-full h-7/10 ">
                <div className="text-2xl font-semibold h-10 px-5">
                    MACC Curves
                </div>
                <div className="h-full w-full">
                    <LineChartDashboard2 rows={rowsD2V1} decarbLever={selectedFilters.decarbLever}/>
                </div>
            </div>
            <div className="w-full h-2/10">
                <KPI rowsD2V3={rowsD2V3} rowsD2V4_5={rowsD2V4_5} />
            </div>
        </div>
    )
}