import { BarChartTab1 } from "./BarChartTab1"

export function RightTab1() {
    const data = [
        { type: "Non-PTT", value: 47.1 },
        { type: "PTT", value: 31.8 }
    ]
    return (
        <div className="w-1/2 h-18/20">
            <div className="bg-stone-600 mt-5 mb-2 mx-2 text-center text-white">Analatical view</div>
            <div className="h-20/20 p-2">
                <BarChartTab1 data={data} />
            </div>
        </div>
    )
}