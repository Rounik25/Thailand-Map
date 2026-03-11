import StackedAreaChart2 from "./StackedAreaChart2"

export function AreaChart2({ rows, col, selectedKey, setSelectedKey, cost }) {
    return (
        <div className="h-full flex flex-col items-center text-center">
            <div className="h-1/10 w-9/10 px-5 py-2 text-lg font-semibold text-white " >
                <div className="bg-black p-1 border-2 border-slate-300 shadow-lg rounded-lg">
                    Emissions to be Abated (PTT)
                </div>
            </div>
            <div className="h-8/10 w-full pl-5 border-2 border-slate-300 shadow-lg rounded-lg ">
                <StackedAreaChart2 rows={rows} col={col} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
            </div>
            <div className="h-1/10 w-9/10 px-5 py-2 text-lg font-semibold text-white" >
                <div className="h-full w-full flex justify-center items-center text-lg ">
                    <div className="p-2 bg-red-500 text-white w-full border-2 border-slate-300 shadow-lg rounded-lg">
                        Weighted average cost of abatement ($/tons): {Number(cost).toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    )
}
    