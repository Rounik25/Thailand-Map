import LineChartTab2 from "./LineChartTab2"
import { BarChartTab2 } from "./BarChartTab2"

export function CardsTab2(){
    const data = [
        { type: "Non-PTT", value: 47.1 },
        { type: "PTT", value: 31.8 }
    ]
    return(
        <div className="h-full">
            <div className="h-4/10 mb-5">
                <LineChartTab2 />
            </div>
            <div className="h-4/10 border-1 border-slate-200 rounded-xl shadow-lg">
                <BarChartTab2 data={data}/>
            </div>
        </div>
    )
}