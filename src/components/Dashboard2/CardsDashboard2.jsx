import { KPI } from "./KPI"
import { LineChartDashboard2 } from "./LineChartDashboard2"

export function CardsDashboard2({rowsD2V1, rowsD2V3, rowsD2V4_5}){
    return (
        <div className="w-full h-full">
            <div className="w-full h-[70%] p-5 ">
                <LineChartDashboard2 rows={rowsD2V1}/>
            </div>
            <div className="w-full h-[30%]">
                <KPI rowsD2V3={rowsD2V3} rowsD2V4_5={rowsD2V4_5} />
            </div>
        </div>
    )
}