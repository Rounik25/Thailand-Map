import { KPI } from "./KPI"
import { LineChartDashboard2 } from "./LineChartDashboard2"

export function CardsDashboard2(){
    return (
        <div className="w-full h-full">
            <div className="w-full h-[70%] p-5 ">
                <LineChartDashboard2 />
            </div>
            <div className="w-full h-[30%]">
                <KPI />
            </div>
        </div>
    )
}