import { KPI } from "./KPI"
import { LineChartTab3 } from "./LineChartTab3"

export function DashboardTab3(){
    return (
        <div className="w-full h-full">
            <div className="w-full h-[70%] p-5 ">
                <LineChartTab3 />
            </div>
            <div className="w-full h-[30%]">
                <KPI />
            </div>
        </div>
    )
}